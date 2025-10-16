import { Heart, ShoppingBag, Star } from "lucide-react";
import React from "react";

const OurFeatures = () => {
  return (
    <>
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center mb-14">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-3">
            Our Features
          </h2>
          <p className="text-gray-500 text-lg">
            Experience premium service, top quality, and complete satisfaction.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-10 bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-2 duration-300">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                Free Shipping
              </h3>
              <p className="text-gray-600">
                Enjoy free shipping on all orders over <b>Rs. 100</b>.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-10 bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-2 duration-300">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                Quality Guarantee
              </h3>
              <p className="text-gray-600">
                We ensure premium materials and top-notch craftsmanship.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-10 bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-2 duration-300">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                Easy Returns
              </h3>
              <p className="text-gray-600">
                Shop confidently with our 30-day return policy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OurFeatures;
