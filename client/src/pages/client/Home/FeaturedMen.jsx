import React, { useEffect, useState } from "react";
import { message, Spin } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { productsAPI } from "../../../utils/api";
import { Link } from "react-router-dom";

const FeaturedMen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getAll();
        const all = response.data.filter((p) => p.category === "Men");
        const shirts = all
          .filter(
            (p) =>
              p.subcategory && p.subcategory.toLowerCase().includes("shirt")
          )
          .slice(0, 3);
        const pants = all
          .filter(
            (p) => p.subcategory && p.subcategory.toLowerCase().includes("pant")
          )
          .slice(0, 3);
        const shoes = all
          .filter(
            (p) => p.subcategory && p.subcategory.toLowerCase().includes("shoe")
          )
          .slice(0, 3);
        let mixed = [...shirts, ...pants, ...shoes];
        mixed = mixed.sort(() => Math.random() - 0.5);
        setProducts(mixed);
      } catch (error) {
        console.error("Error fetching products:", error);
        message.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getSubcategoryRoute = (subcategory) => {
    if (!subcategory) return "/men";
    const sub = subcategory.toLowerCase();
    const subcategoryRoutes = {
      shirt: "/men/shirts",
      pants: "/men/pants",
      shoes: "/men/shoes",
    };
    if (sub.includes("shirt")) return subcategoryRoutes.shirt;
    if (sub.includes("pant")) return subcategoryRoutes.pants;
    if (sub.includes("shoe")) return subcategoryRoutes.shoes;
    return "/men";
  };

  const handleProductClick = (product) => {
    window.location.href = getSubcategoryRoute(product.subcategory);
  };

  return (
    <>
      <div className="relative min-h-[50vh] sm:min-h-[60vh] bg-cover bg-center">
        <div className="men-featured hidden xs:block sm:hidden">
          <img
            src="/assets/golden-delicious-man-collection-at-lama.webp"
            alt="Men's Collection Banner"
            className="w-full h-full object-c"
          />
        </div>
        <div className="men-featured h-[50vh] sm:h-[60vh] xs:hidden sm:block">
          <img
            src="/assets/new-ss25-man-collection-by-lama.webp"
            alt="Men's Collection Banner"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 to-transparent z-10" />
        <div className="absolute bottom-8 sm:bottom-12 left-1/2 w-full max-w-4xl -translate-x-1/2 text-center z-20">
          <h2 className="text-2xl xs:text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-widest mb-2 sm:mb-4 drop-shadow-2xl animate-fade-in">
            GOLDEN DELICIOUS
          </h2>
          <p className="text-lg xs:text-base sm:text-xl md:text-2xl text-gray-100 tracking-wider mb-4 sm:mb-6 drop-shadow-lg animate-slide-up">
            All Men's Collection
          </p>
          <Link
            to="/men"
            className="inline-block text-base sm:text-lg font-semibold text-pink-400 hover:text-pink-300 underline transition-colors duration-300 animate-slide-up delay-200"
          >
            Shop Now
          </Link>
        </div>
      </div>
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl xs:text-2xl sm:text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-8 sm:mb-12 lg:mb-16 animate-fade-in">
            Featured Men's Products
          </h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <Spin size="large" />
            </div>
          ) : (
            <Swiper
              spaceBetween={30}
              slidesPerView={3}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              modules={[Autoplay]}
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 10 },
                640: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 30 },
              }}
              className="mySwiper"
            >
              {products.map((product) => (
                <SwiperSlide key={product._id}>
                  <div
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer group"
                    onClick={() => handleProductClick(product)}
                  >
                    <div className="relative pb-[100%]">
                      <img
                        src={
                          product.images[0] || "https://via.placeholder.com/400"
                        } // fallback placeholder
                        alt={product.name}
                        className="absolute h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <div className="p-4 sm:p-6">
                      <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">
                        {product.name}
                      </h3>
                      <p className="text-pink-500 font-medium text-sm sm:text-base mt-1">
                        Rs: {product.price.toFixed(2)}
                      </p>
                      <span className="inline-block mt-2 text-pink-400 text-sm sm:text-base font-medium group-hover:text-pink-300 transition-colors">
                        Shop Now →
                      </span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>
      <style jsx>{`
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 1s ease-out;
        }
        .delay-200 {
          animation-delay: 0.2s;
          animation-fill-mode: backwards;
        }
      `}</style>
    </>
  );
};

export default FeaturedMen;
