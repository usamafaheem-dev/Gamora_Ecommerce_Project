import React from 'react';
import { Link } from 'react-router-dom';

const Showcase = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl xs:text-2xl sm:text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-8 sm:mb-12 lg:mb-16 animate-fade-in">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          <Link to="/men" className="group">
            <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white">
              <img
                src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                alt="Men's Fashion"
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent group-hover:from-gray-900/70 transition-all duration-500"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg">Men's Collection</h3>
                <p className="text-sm sm:text-base text-gray-200 drop-shadow">Shirts, Pants & More</p>
                <span className="inline-block mt-4 text-pink-400 font-semibold text-sm sm:text-base group-hover:text-pink-300 transition-colors">
                  Explore Now →
                </span>
              </div>
            </div>
          </Link>

          <Link to="/women" className="group">
            <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white">
              <img
                src="https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
                alt="Women's Fashion"
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent group-hover:from-gray-900/70 transition-all duration-500"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg">Women's Collection</h3>
                <p className="text-sm sm:text-base text-gray-200 drop-shadow">Shirts, Pants & More</p>
                <span className="inline-block mt-4 text-pink-400 font-semibold text-sm sm:text-base group-hover:text-pink-300 transition-colors">
                  Explore Now →
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
      <style jsx>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Showcase;