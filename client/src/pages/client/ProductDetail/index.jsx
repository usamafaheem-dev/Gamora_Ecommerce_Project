import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Breadcrumb, Button, Rate, Radio, Tabs, Divider, Row, Col, Spin, Typography } from 'antd';
import { ChevronRight, Home, Tag, ShoppingCart, ArrowLeft, Heart } from 'lucide-react';
import { StoreUse } from '../../../components';
import api, { productsAPI } from '../../../utils/api';
import { toast } from 'react-toastify';
import { Swiper, SwiperSlide } from 'swiper/react';
import axios from 'axios';
import { Modal, Form, Input } from 'antd';

// Import Swiper styles
import 'swiper/css';

import { Autoplay } from 'swiper/modules';
import { AuthContext } from '../../../routes/AuthProvider';

const { Content } = Layout;
const { TabPane } = Tabs;
const { Title } = Typography;

const ProductDetailsPage = () => {
  const { userRole } = useContext(AuthContext)
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, setCartOpen, toggleFavorite, favorites } = StoreUse();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [userCanReview, setUserCanReview] = useState(false);
  const [userOrderId, setUserOrderId] = useState(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const reviewsRef = useRef(null);

  const handleScrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (location.state?.scrollToReviews) {
      setTimeout(() => {
        reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        setLoading(true);
        setRelatedLoading(true);

        // Fetch the current product
        const productResponse = await productsAPI.getById(id);
        const productData = productResponse.data;
        setProduct(productData);
        setSelectedSize(productData.sizes[0]);

        // Fetch related products by category and subcategory
        const relatedResponse = await productsAPI.getBySubcategory(
          productData.category,
          productData.subcategory
        );
        // Filter out the current product and ensure exact category and subcategory match
        const filteredRelated = relatedResponse.data.filter(
          (item) =>
            item._id !== id &&
            item.category.toLowerCase() === productData.category.toLowerCase() &&
            item.subcategory.toLowerCase() === productData.subcategory.toLowerCase()
        );
        const relatedWithReviews = await Promise.all(
          filteredRelated.map(async (prod) => {
            try {
              const res = await api.get(`/reviews/product/${prod._id}`);
              const reviews = res.data.reviews || [];
              const reviewCount = reviews.length;
              const reviewAvg = reviewCount > 0
                ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
                : 0;
              return { ...prod, reviewCount, reviewAvg };
            } catch {
              return { ...prod, reviewCount: 0, reviewAvg: 0 };
            }
          })
        );
        setRelatedProducts(relatedWithReviews);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load product details');
        navigate('/');
      } finally {
        setLoading(false);
        setRelatedLoading(false);
      }
    };

    if (id) {
      fetchProductAndRelated();
    }
  }, [id, navigate]);

  // Fetch reviews for this product
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewLoading(true);
        const res = await api.get(`/reviews/product/${id}`);
        setReviews(res.data.reviews || []);
      } catch {
        setReviews([]);
      } finally {
        setReviewLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  // Check if user can review (delivered order for this product)
  useEffect(() => {
    const checkEligibility = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const profileRes = await api.get('/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ordersRes = await api.get('/orders/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const deliveredOrder = (ordersRes.data.data || []).find(
          (order) => order.status === 'delivered' && order.items.some((item) => item.productId === id)
        );
        if (deliveredOrder) {
          const alreadyReviewed = reviews.some(
            (r) => r.userId?._id === profileRes.data.profile._id && r.orderId === deliveredOrder._id
          );
          setUserCanReview(!alreadyReviewed);
          setUserOrderId(deliveredOrder._id);
        } else {
          setUserCanReview(false);
        }
      } catch {
        setUserCanReview(false);
      }
    };
    checkEligibility();
  }, [id, reviews]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const isFavorite = favorites.some((fav) => fav._id === product._id);

  const handleGoBack = () => {
    navigate(-1);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.warning('Please select a size');
      return;
    }
    addToCart({ ...product, selectedSize });
    setCartOpen(true);
    toast.success(`${product.name} added to cart!`);
  };

  const handleCheckout = () => {
    if (!selectedSize) {
      toast.warning('Please select a size');
      return;
    }
    addToCart({ ...product, selectedSize });
    navigate('/checkout');
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product);
  };

  const handleReviewSubmit = async (values) => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await api.post(
        '/reviews',
        {
          productId: id,
          orderId: userOrderId,
          rating: values.rating,
          comment: values.comment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Review submitted!');
      form.resetFields();
      const res = await api.get(`/reviews/product/${id}`);
      setReviews(res.data.reviews || []);
      setUserCanReview(false);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Content className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumb
          className="mb-6"
          separator={<ChevronRight size={14} className="text-gray-400" />}
          items={[
            {
              title: (
                <div className="flex items-center">
                  <Home size={14} className="mr-1" />
                  <span>Home</span>
                </div>
              ),
              href: '/',
            },
            {
              title: product.category,
              href: `/${product.category.toLowerCase()}`,
            },
            {
              title: (
                <div className="flex items-center">
                  <Tag size={14} className="mr-1" />
                  <span>{product.subcategory}</span>
                </div>
              ),
              href: `/${product.category.toLowerCase()}/${product.subcategory.toLowerCase()}`,
            },
            {
              title: product.name,
            },
          ]}
        />

        <Button
          type="link"
          onClick={handleGoBack}
          className="mb-6 pl-0 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to {product.subcategory}
        </Button>

        <Row gutter={[24, 24]}>
        
          <Col xs={24} md={12}>
            <div className="space-y-4">
              <Row gutter={[{ xs: 8, sm: 16 }, { xs: 8, sm: 16 }]}>
                {/* Thumbnail Column */}
                <Col xs={24} sm={4} md={4} className="flex flex-row md:order-0 xs:order-2 md:flex-col overflow-x-auto md:overflow-x-visible gap-2 md:gap-4">
                  <div className="flex md:grid md:grid-cols-1 gap-2 md:gap-4">
                  {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={` flex-shrink-0 aspect-w-1 aspect-h-1 rounded-md h-[120px] overflow-hidden ${selectedImage === index ? 'ring-2 ring-black' : ''
                          }`}
                      >
                        <img
                          src={`http://localhost:5000${image}`}
                          alt={`${product.name} view ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </Col>
                {/* Main Image Column */}
                <Col xs={24}  md={20}>
                <div className="aspect-w-4 aspect-h-5 w-full h-[658px] bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={`http://localhost:5000${product.images[selectedImage]}`}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
         
          <Col md={12} xs={24}>
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                  <div
                    className="mt-2 flex items-center"
                    onClick={handleScrollToReviews}
                    style={{ cursor: 'pointer' }}
                  >
                    <Rate
                      disabled
                      value={reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0}
                      className="text-amber-500"
                    />
                    <span className="ml-2 text-sm underline text-gray-500">
                      {reviews.length > 0
                        ? `${(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)} rating (${reviews.length
                        })`
                        : 'No reviews yet'}
                    </span>
                  </div>
                </div>
                {userRole === 'user' && (
                  <Button
                    type="text"
                    icon={<Heart className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'} />}
                    onClick={handleToggleFavorite}
                  />
                )}
              </div>

              <div className="text-2xl font-bold text-gray-900">Rs: {product.price}</div>

              {product.stock === 0 ? (
                <div className="text-red-600 font-semibold text-lg mb-2">Out of Stock</div>
              ) : null}

              <div>
                <h3 className="text-sm font-medium text-gray-900">Size</h3>
                <Radio.Group
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="mt-2"
                >
                  {product.sizes.map((size) => (
                    <Radio.Button key={size} value={size} className="mr-2">
                      {size}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </div>

              {userRole === 'user' && (
              <div className="flex gap-4">
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCart size={20} />}
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#0F172A] hover:bg-[#1E293B] disabled:!bg-[#0000000a] h-12 text-lg"
                  disabled={product.stock === 0}
                >
                  Add to Cart
                </Button>
                <Button
                  type="primary"
                  size="large"
                  onClick={handleCheckout}
                  className="flex-1 bg-[#22C55E] hover:bg-[#16A34A] disabled:!bg-[#0000000a] h-12 text-lg"
                  disabled={product.stock === 0}
                >
                  Buy Now
                </Button>
              </div>
              )}
              <Divider />

              <Tabs defaultActiveKey="1">
                <TabPane tab="Description" key="1">
                  <div className="prose max-w-none">
                    <p>{product.description}</p>
                    <p className="text-sm text-gray-500 mt-2">{product.note}</p>
                  </div>
                </TabPane>
                <TabPane tab="Details" key="2">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium">SKU</h4>
                        <p className="text-gray-600">{product.sku}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Fit Type</h4>
                        <p className="text-gray-600">{product.fitType}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Material</h4>
                        <p className="text-gray-600">{product.material}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Occasion</h4>
                        <p className="text-gray-600">{product.occasion}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Stretch</h4>
                        <p className="text-gray-600">{product.stretch}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Hand Feel</h4>
                        <p className="text-gray-600">{product.handFeel}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium">Design Details</h4>
                      <p className="text-gray-600">{product.designDetails}</p>
                    </div>
                  </div>
                </TabPane>
              </Tabs>
            </div>
          </Col>
        </Row>

        {/* Featured Products Section */}
        <Divider className="my-12" />
        <div className="mt-12">
          <Title level={3} className="text-center !text-3xl">
            Featured {product.category} - {product.subcategory}
          </Title>
          {relatedLoading ? (
            <div className="flex justify-center">
              <Spin />
            </div>
          ) : relatedProducts.length > 0 ? (
            <Swiper
              spaceBetween={30}
              slidesPerView={4}
              navigation={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              modules={[Autoplay]}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                },
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 30,
                },
              }}
              className="mySwiper px-4 py-6"
            >
              {relatedProducts.map((product) => (
                <SwiperSlide key={product._id}>
                  <div
                    className="bg-white rounded-lg overflow-hidden h-full flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    <div className="relative pb-[120%]">
                      <img
                        src={`http://localhost:5000${product.images[0]}`}
                        alt={product.name}
                        className="absolute h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-[14px] text-gray-900">{product.name}</h3>
                      <div className="mt-1 flex justify-between items-center">
                        <span className="text-gray-900 font-bold">Rs: {product.price}</span>
                        <div className="flex items-center">
                          <Rate
                            disabled
                            value={product.reviewCount > 0 ? product.reviewAvg : 0}
                            count={1}
                            className="text-amber-500"
                          />
                          <span className="ml-1 text-sm text-gray-600">
                            {product.reviewCount > 0 ? Number(product.reviewAvg).toFixed(1) : ''}
                          </span>
                          <span className="ml-1 text-xs text-gray-400">
                            {product.reviewCount > 0 ? `(${product.reviewCount})` : 'No reviews'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p className="text-gray-500 text-center">
              No featured {product.category.toLowerCase()} - {product.subcategory.toLowerCase()} found.
            </p>
          )}
        </div>

        <Divider className="my-12" />
        <div className="mt-12" ref={reviewsRef}>
          <Title level={3} className="text-center !text-2xl">
            Product Reviews
          </Title>
          {reviewLoading ? (
            <div className="flex justify-center">
              <Spin />
            </div>
          ) : (
            <div className="space-y-8 max-w-5xl mx-auto">
              {userCanReview && (
                <div className="bg-white rounded-lg shadow p-6 mb-8 border border-gray-100">
                  <Title level={4} className="!mb-2 !text-lg">
                    Write a Review
                  </Title>
                  <Form form={form} layout="vertical" onFinish={handleReviewSubmit}>
                    <Form.Item name="rating" label="Rating" rules={[{ required: true, message: 'Please select a rating' }]}>
                      <Rate />
                    </Form.Item>
                    <Form.Item
                      name="comment"
                      label="Comment"
                      rules={[{ required: true, message: 'Please enter your review' }]}
                    >
                      <Input.TextArea rows={4} className="!resize-none" placeholder="Share your experience..." />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" loading={submitting} block>
                        Submit Review
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              )}

              <div className="flex flex-col items-center mb-6">
                <div className="flex items-center gap-2">
                  <Rate
                    disabled
                    allowHalf
                    value={reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0}
                    className="text-amber-500 text-lg"
                  />
                  <span className="text-lg font-semibold text-gray-800">
                    {reviews.length > 0
                      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                      : '0.0'}
                  </span>
                  <span className="text-gray-500">/ 5.0</span>
                </div>
                <span className="text-gray-500 text-sm">
                  {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </span>
              </div>

              {reviews.length === 0 ? (
                <div className="text-center text-gray-500">No reviews yet.</div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                  {reviews.map((review, idx) => (
                    <div
                      key={review._id}
                      className={`flex flex-col gap-2${idx !== reviews.length - 1 ? ' border-b border-gray-200 pb-6 mb-6' : ''
                        }`}
                    >
                      <div className="flex items-center gap-4 mb-2">
                        <img
                          src={
                            review.userId?.profileImage
                              ? `http://localhost:5000${review.userId.profileImage}`
                              : '/img/default-profile.png'
                          }
                          alt="user"
                          className="w-12 h-12 rounded-full object-cover border border-gray-200"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">
                            {review.userId?.firstName} {review.userId?.lastName}
                          </div>
                          <Rate disabled value={review.rating} className="text-amber-500 text-sm" />
                        </div>
                      </div>
                      <div className="text-gray-800 text-base mb-1">{review.comment}</div>
                      {review.adminReply && (
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mt-2 rounded">
                          <div className="font-semibold text-blue-700 mb-1">Admin Reply:</div>
                          <div className="text-gray-700 text-sm">{review.adminReply}</div>
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-1 self-end">
                        {new Date(review.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Content>
    </div>
  );
};

export default ProductDetailsPage;