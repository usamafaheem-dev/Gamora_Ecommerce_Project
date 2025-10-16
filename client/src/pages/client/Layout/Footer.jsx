import React, { useState } from 'react';
import { Layout, Row, Col, Input, Button, Divider, message } from 'antd';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const { Footer: AntFooter } = Layout;

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      message.warning('Please enter your email address');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      message.warning('Please enter a valid email address');
      return;
    }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('Thank you for subscribing to our newsletter!');
      setEmail('');
    } catch (error) {
      message.error('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const socialLinks = {
    facebook: "https://facebook.com/",
    twitter: "https://twitter.com/",
    instagram: "https://instagram.com/",
    youtube: "https://youtube.com/",
  };

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: "Men's", path: '/men' },
    { name: "Women's", path: '/women' },
    { name: 'Track Order', path: '/my-orders' },
    { name: 'Size Guide', path: '/size-guide' },
  ];

  const customerService = [
    { name: 'Contact Us', path: '/contact' },
    { name: 'Return Policy', path: '/return-policy' },
    { name: 'Shipping Info', path: '/shipping' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Terms of Service', path: '/terms' },
  ];

  const aboutLinks = [
    { name: 'Our Story', path: '/about' },
    { name: 'Careers', path: '/careers' },
    { name: 'Press', path: '/press' },
    { name: 'Sustainability', path: '/sustainability' },
    { name: 'Affiliate Program', path: '/affiliate' },
  ];

  const paymentMethods = [
    { name: 'Visa', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/120px-Visa_Inc._logo.svg.png' },
    { name: 'Mastercard', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/120px-Mastercard-logo.svg.png' },
    { name: 'PayPal', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/120px-PayPal.svg.png' },
    { name: 'Stripe', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/120px-Stripe_Logo%2C_revised_2016.svg.png' },
  ];

  return (
    <AntFooter className="bg-gradient-to-b from-gray-900 to-gray-800 text-white p-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    

        {/* Main Footer Content */}
        <Row gutter={[32, 32]} className="py-8">
          {/* Company Info */}
          <Col xs={24} lg={6}>
            <div className="space-y-6">
              <Link to="/" className="inline-block">
                <img
                  src="/assets/glamLogo.png"
                  alt="Glamora Fashion"
                  className="h-14 w-auto brightness-0 invert"
                />
              </Link>
              <p className="text-gray-300 leading-relaxed">
                Your ultimate destination for fashion-forward clothing. Discover the latest trends with premium quality at affordable prices.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center group-hover:bg-pink-600 transition-colors">
                    <MapPin size={16} className="text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Visit Our Store</div>
                    <div className="text-gray-300 text-sm">Johar Town, Lahore, Pakistan</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center group-hover:bg-pink-600 transition-colors">
                    <Phone size={16} className="text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Call Us</div>
                    <div className="text-gray-300 text-sm">+92 314 3416588</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center group-hover:bg-pink-600 transition-colors">
                    <Mail size={16} className="text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Email Us</div>
                    <div className="text-gray-300 text-sm">support@glamora.com</div>
                  </div>
                </div>
              </div>
            </div>
          </Col>

          {/* Quick Links */}
          <Col xs={12} sm={8} lg={4}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b-2 border-pink-500 pb-2">Quick Links</h3>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="flex items-center gap-2 text-gray-300 hover:text-pink-400 transition-colors text-sm"
                    >
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Col>

          {/* Customer Service */}
          <Col xs={12} sm={8} lg={4}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b-2 border-pink-500 pb-2">Customer Service</h3>
              <ul className="space-y-2">
                {customerService.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="flex items-center gap-2 text-gray-300 hover:text-pink-400 transition-colors text-sm"
                    >
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Col>

          {/* About */}
          <Col xs={12} sm={8} lg={4}>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b-2 border-pink-500 pb-2">About Glamora</h3>
              <ul className="space-y-2">
                {aboutLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="flex items-center gap-2 text-gray-300 hover:text-pink-400 transition-colors text-sm"
                    >
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Col>

          {/* Social Media & App */}
          <Col xs={24} sm={12} lg={6}>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white border-b-2 border-pink-500 pb-2">Follow Us</h3>
                <div className="flex gap-3 mt-4">
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-all duration-300 hover:scale-105"
                  >
                    <Facebook size={18} />
                  </a>
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center hover:bg-sky-600 transition-all duration-300 hover:scale-105"
                  >
                    <Twitter size={18} />
                  </a>
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105"
                  >
                    <Instagram size={18} />
                  </a>
                  <a
                    href={socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-all duration-300 hover:scale-105"
                  >
                    <Youtube size={18} />
                  </a>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Download Our App</h4>
                <div className="flex flex-col gap-3">
                  <a
                    href="#"
                    className="flex items-center gap-2 p-2 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/270px-Google_Play_Store_badge_EN.svg.png"
                      alt="Get on Google Play"
                      className="h-8"
                    />
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 p-2 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/270px-Download_on_the_App_Store_Badge.svg.png"
                      alt="Download on App Store"
                      className="h-8"
                    />
                  </a>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <Divider className="border-gray-700 bg-gray-700 my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 py-6">
          <div className="text-gray-400 text-sm text-center lg:text-left">
            © {new Date().getFullYear()} <span className="text-white font-semibold">Glamora Fashion</span>. All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/privacy-policy" className="text-gray-400 hover:text-pink-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-pink-400 transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-gray-400 hover:text-pink-400 transition-colors">
              Cookie Policy
            </Link>
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {paymentMethods.map((method) => (
              <img
                key={method.name}
                src={method.logo}
                alt={method.name}
                className="h-6 bg-white rounded-md p-1"
              />
            ))}
          </div>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;