import HeroSection from './HeroSection';
import Showcase from './Showcase';
import OurFeatures from './OurFeatures';
import FeaturedMen from './FeaturedMen';
import FeaturedWomen from './FeaturedWomen';
import { useRef, useState, useEffect } from 'react';
import { Spin } from 'antd';

const HomePage = () => {
  const categoryRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // 2 seconds
    return () => clearTimeout(timer);
  }, []);

  const handleShopNowClick = () => {
    if (categoryRef.current) {
      categoryRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <Spin size='large' />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <HeroSection handleShopNowClick={handleShopNowClick} />
      <section ref={categoryRef} className="md:py-16 xs:pt-6 px-4 sm:px-6 lg:px-8 bg-white">
        <Showcase />
      </section>
      <FeaturedMen />
      <FeaturedWomen />

      <OurFeatures />
    </div>
  );
};

export default HomePage;