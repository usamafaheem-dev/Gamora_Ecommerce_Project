import { Button } from 'antd';
import { Heart, ShoppingBag } from 'lucide-react';
import React, { useContext } from 'react';
import { StoreUse } from '../../../components';
import { AuthContext } from '../../../routes/AuthProvider';

const HeroSection = ({ handleShopNowClick }) => {
  const { userRole } = useContext(AuthContext);
  const { setWishlistOpen } = StoreUse();

  return (
    <section className="relative hero-img flex items-center justify-center min-h-[100vh] bg-cover bg-center">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 to-gray-800/30 z-10" />
      <div className="relative z-20 text-center flex flex-col justify-center items-center w-full px-4 py-12">
        <h1 className="text-4xl xs:text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 md:mb-6 drop-shadow-2xl animate-fade-in">
          Fashion That Defines
          <span className="block text-pink-400 mt-2">Your Unique Style</span>
        </h1>
        <p className="text-lg xs:text-base md:text-xl text-gray-200 mb-6 md:mb-8 max-w-3xl mx-auto drop-shadow-lg animate-slide-up">
          Discover the latest trends in fashion with our curated collection of premium clothing for men, women, and kids.
        </p>
        
        {/* Buttons - Fixed Responsive */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full max-w-xs sm:max-w-md mx-auto">
          <Button
            type="primary"
            size="large"
            className="bg-pink-500 hover:bg-pink-600 border-none h-12 px-6 sm:px-8 text-lg font-semibold rounded-lg flex items-center gap-2 w-full sm:w-auto transition-all duration-300 hover:scale-105 min-w-[120px] sm:min-w-0"
            icon={<ShoppingBag size={20} />}
            onClick={handleShopNowClick}
          >
            Shop Now
          </Button>
          {userRole === 'user' && (
            <Button
              size="large"
              className="h-12 px-6 sm:px-8 text-lg border-2 border-pink-400 hover:border-pink-500 bg-white/10 hover:bg-white/20 text-white hover:text-pink-400 font-semibold rounded-lg flex items-center gap-2 w-full sm:w-auto transition-all duration-300 hover:scale-105 min-w-[120px] sm:min-w-0"
              icon={<Heart size={20} />}
              onClick={() => setWishlistOpen(true)}
            >
              View Wishlist
            </Button>
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 1s ease-out 0.2s;
          animation-fill-mode: backwards;
        }
        /* Mobile buttons fix */
        @media (max-width: 640px) {
          .ant-btn {
            width: 100% !important;
            max-width: 100% !important;
          }
          .flex.flex-col > .ant-btn:first-child {
            margin-bottom: 0.75rem;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;