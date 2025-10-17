import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Layout,
  Breadcrumb,
  Button,
  Rate,
  Radio,
  Tabs,
  Divider,
  Row,
  Col,
  Spin,
  Typography,
  Form,
  Input
} from 'antd';
import { ChevronRight, Home, Tag, ShoppingCart, ArrowLeft, Heart } from 'lucide-react';
import { StoreUse } from '../../../components';
import api, { productsAPI } from '../../../utils/api';
import { toast } from 'react-toastify';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { AuthContext } from '../../../routes/AuthProvider';

import 'swiper/css';

const { Content } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;

const IMAGE_BASE_URL = 'http://localhost:5000';

const ProductDetailsPage = () => {
  const { userRole } = useContext(AuthContext);
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

  // Utility functions
  const calculateAverageRating = (reviewsArray) =>
    reviewsArray.length ? reviewsArray.reduce((acc, r) => acc + r.rating, 0) / reviewsArray.length : 0;

  const scrollToReviews = () => reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });

  // Scroll to reviews if redirected
  useEffect(() => {
    if (location.state?.scrollToReviews) {
      setTimeout(scrollToReviews, 500);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  // Fetch product and related products
  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        setLoading(true);
        setRelatedLoading(true);

        // Fetch product
        const { data: productData } = await productsAPI.getById(id);
        setProduct(productData);
        setSelectedSize(productData.sizes[0] || '');

        // Fetch related products
        const { data: relatedData } = await productsAPI.getBySubcategory(productData.category, productData.subcategory);
        const filteredRelated = relatedData.filter(item => item._id !== id);

        const relatedWithReviews = await Promise.all(
          filteredRelated.map(async (p) => {
            try {
              const res = await api.get(`/reviews/product/${p._id}`);
              const rev = res.data.reviews || [];
              const avg = rev.length ? rev.reduce((a, r) => a + r.rating, 0) / rev.length : 0;
              return { ...p, reviewCount: rev.length, reviewAvg: avg };
            } catch {
              return { ...p, reviewCount: 0, reviewAvg: 0 };
            }
          })
        );

        setRelatedProducts(relatedWithReviews);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load product details');
        navigate('/');
      } finally {
        setLoading(false);
        setRelatedLoading(false);
      }
    };

    if (id) fetchProductAndRelated();
  }, [id, navigate]);

  // Fetch reviews for this product
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewLoading(true);
        const { data } = await api.get(`/reviews/product/${id}`);
        setReviews(data.reviews || []);
      } catch {
        setReviews([]);
      } finally {
        setReviewLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  // Check if user can review
  useEffect(() => {
    const checkUserReviewEligibility = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const { data: profile } = await api.get('/profile', { headers: { Authorization: `Bearer ${token}` } });
        const { data: orders } = await api.get('/orders/user', { headers: { Authorization: `Bearer ${token}` } });

        const delivered = orders.data?.find(order => order.status === 'delivered' && order.items.some(i => i.productId === id));
        if (delivered) {
          const alreadyReviewed = reviews.some(r => r.userId?._id === profile.profile._id && r.orderId === delivered._id);
          setUserCanReview(!alreadyReviewed);
          setUserOrderId(delivered._id);
        } else setUserCanReview(false);
      } catch {
        setUserCanReview(false);
      }
    };
    checkUserReviewEligibility();
  }, [id, reviews]);

  if (loading) return <div className="bg-gray-50 min-h-screen flex items-center justify-center"><Spin size="large" /></div>;
  if (!product) return <div>Product not found</div>;

  const isFavorite = favorites.some(f => f._id === product._id);

  const handleGoBack = () => {
    navigate(-1);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  };

  const handleAddToCart = () => {
    if (!selectedSize) return toast.warning('Please select a size');
    addToCart({ ...product, selectedSize });
    setCartOpen(true);
    toast.success(`${product.name} added to cart!`);
  };

  const handleCheckout = () => {
    if (!selectedSize) return toast.warning('Please select a size');
    addToCart({ ...product, selectedSize });
    navigate('/checkout');
  };

  const handleToggleFavorite = () => toggleFavorite(product);

  const handleReviewSubmit = async (values) => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await api.post('/reviews', { productId: id, orderId: userOrderId, ...values }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Review submitted!');
      form.resetFields();
      const { data } = await api.get(`/reviews/product/${id}`);
      setReviews(data.reviews || []);
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

        {/* Breadcrumb */}
        <Breadcrumb
          className="mb-6"
          separator={<ChevronRight size={14} className="text-gray-400" />}
          items={[
            { title: <div className="flex items-center"><Home size={14} className="mr-1" />Home</div>, href: '/' },
            { title: product.category, href: `/${product.category.toLowerCase()}` },
            { title: <div className="flex items-center"><Tag size={14} className="mr-1" />{product.subcategory}</div>, href: `/${product.category.toLowerCase()}/${product.subcategory.toLowerCase()}` },
            { title: product.name },
          ]}
        />

        <Button type="link" onClick={handleGoBack} className="mb-6 pl-0 flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft size={16} className="mr-1" />
          Back to {product.subcategory}
        </Button>

        {/* Product Images & Info */}
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Row gutter={[{ xs: 8, sm: 16 }, { xs: 8, sm: 16 }]}>
              {/* Thumbnails */}
              <Col xs={24} sm={4} className="flex flex-row md:flex-col gap-2 md:gap-4 overflow-x-auto">
                {product.images.map((img, idx) => (
                  <button key={idx} onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 aspect-w-1 aspect-h-1 rounded-md overflow-hidden ${selectedImage === idx ? 'ring-2 ring-black' : ''}`}>
                    <img src={`${IMAGE_BASE_URL}${img}`} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </Col>

              {/* Main Image */}
              <Col xs={24} sm={20}>
                <div className="aspect-w-4 aspect-h-5 w-full h-[658px] bg-gray-100 rounded-lg overflow-hidden">
                  <img src={`${IMAGE_BASE_URL}${product.images[selectedImage]}`} alt={product.name} className="w-full h-full object-cover" />
                </div>
              </Col>
            </Row>
          </Col>

          {/* Product Info */}
          <Col xs={24} md={12}>
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                  <div className="mt-2 flex items-center cursor-pointer" onClick={scrollToReviews}>
                    <Rate disabled value={calculateAverageRating(reviews)} className="text-amber-500" />
                    <span className="ml-2 text-sm underline text-gray-500">
                      {reviews.length > 0 ? `${calculateAverageRating(reviews).toFixed(1)} rating (${reviews.length})` : 'No reviews yet'}
                    </span>
                  </div>
                </div>
                {userRole === 'user' && (
                  <Button type="text" icon={<Heart className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'} />} onClick={handleToggleFavorite} />
                )}
              </div>

              <div className="text-2xl font-bold text-gray-900">Rs: {product.price}</div>
              {product.stock === 0 && <div className="text-red-600 font-semibold text-lg mb-2">Out of Stock</div>}

              <div>
                <h3 className="text-sm font-medium text-gray-900">Size</h3>
                <Radio.Group value={selectedSize} onChange={e => setSelectedSize(e.target.value)} className="mt-2">
                  {product.sizes.map(size => <Radio.Button key={size} value={size} className="mr-2">{size}</Radio.Button>)}
                </Radio.Group>
              </div>

              {userRole === 'user' && (
                <div className="flex gap-4">
                  <Button type="primary" size="large" icon={<ShoppingCart size={20} />} onClick={handleAddToCart} className="flex-1 bg-[#0F172A] hover:bg-[#1E293B] h-12 text-lg" disabled={product.stock === 0}>Add to Cart</Button>
                  <Button type="primary" size="large" onClick={handleCheckout} className="flex-1 bg-[#22C55E] hover:bg-[#16A34A] h-12 text-lg" disabled={product.stock === 0}>Buy Now</Button>
                </div>
              )}

              <Divider />

              {/* Description & Details */}
              <Tabs defaultActiveKey="1">
                <TabPane tab="Description" key="1">
                  <div className="prose max-w-none">
                    <p>{product.description}</p>
                    <p className="text-sm text-gray-500 mt-2">{product.note}</p>
                  </div>
                </TabPane>
                <TabPane tab="Details" key="2">
                  <div className="space-y-4 grid grid-cols-2 gap-4">
                    <div><h4 className="font-medium">SKU</h4><p className="text-gray-600">{product.sku}</p></div>
                    <div><h4 className="font-medium">Fit Type</h4><p className="text-gray-600">{product.fitType}</p></div>
                    <div><h4 className="font-medium">Material</h4><p className="text-gray-600">{product.material}</p></div>
                    <div><h4 className="font-medium">Occasion</h4><p className="text-gray-600">{product.occasion}</p></div>
                    <div><h4 className="font-medium">Stretch</h4><p className="text-gray-600">{product.stretch}</p></div>
                    <div><h4 className="font-medium">Hand Feel</h4><p className="text-gray-600">{product.handFeel}</p></div>
                    <div className="col-span-2">
                      <h4 className="font-medium">Design Details</h4>
                      <p className="text-gray-600">{product.designDetails}</p>
                    </div>
                  </div>
                </TabPane>
              </Tabs>
            </div>
          </Col>
        </Row>

        {/* Featured Products */}
        <Divider className="my-12" />
        <div className="mt-12">
          <Title level={3} className="text-center !text-3xl">
            Featured {product.category} - {product.subcategory}
          </Title>
          {relatedLoading ? <div className="flex justify-center"><Spin /></div> : 
            relatedProducts.length > 0 ? (
              <Swiper spaceBetween={30} slidesPerView={4} autoplay={{ delay: 3000, disableOnInteraction: false }} modules={[Autoplay]} breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 10 },
                640: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 3, spaceBetween: 30 },
                1024: { slidesPerView: 4, spaceBetween: 30 }
              }} className="mySwiper px-4 py-6">
                {relatedProducts.map(p => (
                  <SwiperSlide key={p._id}>
                    <div className="bg-white rounded-lg overflow-hidden h-full flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={() => navigate(`/product/${p._id}`)}>
                      <div className="relative pb-[120%]">
                        <img src={`${IMAGE_BASE_URL}${p.images[0]}`} alt={p.name} className="absolute h-full w-full object-cover"/>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-[14px] text-gray-900">{p.name}</h3>
                        <div className="mt-1 flex justify-between items-center">
                          <span className="text-gray-900 font-bold">Rs: {p.price}</span>
                          <div className="flex items-center">
                            <Rate disabled value={p.reviewCount ? p.reviewAvg : 0} count={1} className="text-amber-500"/>
                            <span className="ml-1 text-sm text-gray-600">{p.reviewCount ? Number(p.reviewAvg).toFixed(1) : ''}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : <p className="text-center text-gray-500 mt-6">No related products found.</p>
          }
        </div>

        {/* Reviews Section */}
        <Divider className="my-12" />
        <div ref={reviewsRef} className="mt-12">
          <Title level={3} className="!text-3xl mb-6">Customer Reviews</Title>
          {reviewLoading ? <Spin /> : reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map(r => (
                <div key={r._id} className="p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{r.userId?.name || 'Anonymous'}</span>
                    <Rate disabled value={r.rating} className="text-amber-500" />
                  </div>
                  <p className="mt-2 text-gray-700">{r.comment}</p>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-500">No reviews yet.</p>}

          {userCanReview && (
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <Title level={4} className="mb-4">Write a Review</Title>
              <Form form={form} onFinish={handleReviewSubmit} layout="vertical">
                <Form.Item name="rating" label="Rating" rules={[{ required: true, message: 'Please provide a rating' }]}>
                  <Rate />
                </Form.Item>
                <Form.Item name="comment" label="Comment" rules={[{ required: true, message: 'Please provide a comment' }]}>
                  <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={submitting}>Submit Review</Button>
                </Form.Item>
              </Form>
            </div>
          )}
        </div>
      </Content>
    </div>
  );
};

export default ProductDetailsPage;
