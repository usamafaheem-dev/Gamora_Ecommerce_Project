import { Icon } from '@iconify/react/dist/iconify.js';
import { Badge, Drawer, Dropdown, Space, Spin } from 'antd';
import axios from 'axios';
import { Bell, CircleGauge, Heart, Mail, Menu, Shirt, ShoppingBag, User, X } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { StoreUse } from '../../../components';
import { AuthContext } from '../../../routes/AuthProvider';
import api from '../../../utils/api';

const Header = () => {
  const { cart, favorites, setCartOpen, setWishlistOpen, notifications, setNotificationOpen, fetchNotifications } = StoreUse();
  const { isAuthenticated, userRole, userEmail } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      localStorage.removeItem('token');
      toast.success('Logged out successfully');
      navigate('/auth/login');
    } catch (error) {
      toast.error('Error during logout');
      console.log(error);
    }
  };

  const navCategories = [
    {
      name: 'Men',
      path: '/men',
      items: [
        { label: 'All', key: 'all', path: '/men', onClick: () => navigate('/men') },
        { label: 'Shirts', key: 'men-shirts', path: '/men/shirts', onClick: () => navigate('/men/shirts') },
        { label: 'Pants', key: 'men-pants', path: '/men/pants', onClick: () => navigate('/men/pants') },
        { label: 'Shoes', key: 'men-shoes', path: '/men/shoes', onClick: () => navigate('/men/shoes') },
      ],
    },
    {
      name: 'Women',
      path: '/women',
      items: [
        { label: 'All', key: 'all', path: '/women', onClick: () => navigate('/women') },
        { label: 'Shirts', key: 'women-dresses', path: '/women/shirts', onClick: () => navigate('/women/shirts') },
        { label: 'Pants', key: 'women-pants', path: '/women/pants', onClick: () => navigate('/women/pants') },
        { label: 'Shoes', key: 'women-shoes', path: '/women/shoes', onClick: () => navigate('/women/shoes') },
      ],
    },
  ];

  const profileItems = userRole === 'admin' ? [
    { key: '1', label: userEmail, disabled: true },
    { key: '2', label: <Link to="/admin"> Dashboard </Link>, icon: <CircleGauge size={20} /> },
    { key: '4', label: <span className='text-red-600'>Logout</span>, icon: <X size={20} className='text-red-600' />, onClick: handleLogout },
  ] : [
    { key: '1', label: <span>{profile?.email}</span>, icon: <Mail size={20} /> },
    { key: '2', label: 'My Orders', icon: <ShoppingBag size={20} />, onClick: () => navigate('/my-orders') },
    { key: '3', label: 'Profile', icon: <User size={20} />, onClick: () => navigate('/profile') },
    { key: 'wallet', label: 'My Wallet', icon: <Icon icon="icon-park-outline:wallet" width="20" />, onClick: () => navigate('/wallet') },
    { key: '4', label: <span className='text-red-600'>Logout</span>, icon: <X size={20} className='text-red-600' />, onClick: handleLogout },
  ];

  const unreadNotifications = Array.isArray(notifications) ? notifications.filter(n => !n.read).length : 0;

  const isCategoryActive = (categoryPath) => location.pathname.startsWith(categoryPath);
  const isDropdownItemActive = (itemPath) => location.pathname === itemPath;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const profileResponse = await api.get('/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProfile(profileResponse.data.profile);
        await fetchNotifications();
      } catch (error) {
        console.error('Error fetching data:', error.message);
        toast.error(error.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    if (localStorage.getItem('token')) fetchData();
  }, [fetchNotifications]);

  return (
    
    <div className="flex justify-between items-center h-20 px-4 md:px-10 shadow-lg fixed w-full top-0 z-50 bg-gradient-to-r from-gray-900 to-gray-800">
      <Link to='/' className="lg:w-[160px] w-[140px] lg:h-14 h-12">
        <img src="/assets/glamLogo.png" alt="header logo" className='size-full object-cover brightness-0 invert' />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8">
        {navCategories.map((category) => (
          <Dropdown
            key={category.name}
            menu={{
              items: category.items.map(item => ({
                ...item,
                label: (
                  <span className={`transition-colors ${isDropdownItemActive(item.path) ? 'text-pink-500 font-semibold' : 'text-gray-700'}`}>
                    {item.label}
                  </span>
                ),
                className: `hover:bg-pink-50 ${isDropdownItemActive(item.path) ? 'bg-pink-50' : ''}`,
              })),
            }}
            placement="bottom"
            trigger={['hover']}
            onOpenChange={(open) => setActiveDropdown(open ? category.name : null)}
            overlayClassName="bg-white rounded-lg shadow-xl border border-gray-100"
          >
            <div
              className={`flex items-center cursor-pointer px-3 py-2 rounded-lg transition-all duration-300 ${
                isCategoryActive(category.path) || activeDropdown === category.name
                  ? 'text-pink-500 font-semibold bg-pink-50'
                  : 'text-white hover:bg-pink-50/20 hover:text-pink-400'
              }`}
            >
              <Space>
                {category.name}
                <Icon
                  icon="ant-design:down-outlined"
                  className={`text-xs transition-transform duration-300 ${
                    isCategoryActive(category.path) || activeDropdown === category.name
                      ? 'text-pink-500 rotate-180'
                      : 'text-white'
                  }`}
                />
              </Space>
            </div>
          </Dropdown>
        ))}
      </div>

      {/* Desktop Profile and Actions */}
      <div className="hidden md:flex items-center gap-4">
        {loading ? (
          <Spin />
        ) : (
          <>
            {isAuthenticated && (
              <Dropdown
                menu={{ items: profileItems }}
                trigger={['hover']}
                overlayClassName="bg-white rounded-lg shadow-xl border border-gray-100"
              >
                <div className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-500 group-hover:border-pink-600 transition-all">
                    <img
                      src={profile?.profileImage ? `http://localhost:5000${profile.profileImage}` : "/img/default-profile.png"}
                      alt="Profile"
                      className="object-cover size-full"
                    />
                  </div>
                  <span className="text-white font-medium group-hover:text-pink-400 transition-colors">
                    {`${profile?.firstName} ${profile?.lastName}`}
                  </span>
                  <Icon icon="ant-design:down-outlined" className="text-white group-hover:text-pink-400" />
                </div>
              </Dropdown>
            )}
            {isAuthenticated && userRole === 'user' && (
              <div className="flex items-center gap-4">
                <Badge count={unreadNotifications} size="small" color="#FF6B6B">
                  <Bell
                    onClick={() => setNotificationOpen(true)}
                    className="w-6 h-6 text-white cursor-pointer hover:text-pink-400 transition-colors"
                  />
                </Badge>
                <Badge count={favorites.length} size="small" color="#FF6B6B">
                  <Heart
                    onClick={() => setWishlistOpen(true)}
                    className="w-6 h-6 text-white cursor-pointer hover:text-pink-400 transition-colors"
                  />
                </Badge>
                <Badge count={cart.length} size="small" color="#FF6B6B">
                  <ShoppingBag
                    onClick={() => setCartOpen(true)}
                    className="w-6 h-6 text-white cursor-pointer hover:text-pink-400 transition-colors"
                  />
                </Badge>
              </div>
            )}
          </>
        )}
      </div>

      {/* Mobile Actions */}
      <div className="flex md:hidden items-center gap-2">
        <Badge count={unreadNotifications} size="small" color="#FF6B6B">
          <Bell
            onClick={() => setNotificationOpen(true)}
            className="w-6 h-6 text-white cursor-pointer hover:text-pink-400 transition-colors"
          />
        </Badge>
        <Badge count={favorites.length} size="small" color="#FF6B6B">
          <Heart
            onClick={() => setWishlistOpen(true)}
            className="w-6 h-6 text-white cursor-pointer hover:text-pink-400 transition-colors"
          />
        </Badge>
        <Badge count={cart.length} size="small" color="#FF6B6B">
          <ShoppingBag
            onClick={() => setCartOpen(true)}
            className="w-6 h-6 text-white cursor-pointer hover:text-pink-400 transition-colors"
          />
        </Badge>
        <button
          className="text-white p-2 hover:bg-pink-50/20 rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <Drawer
        title={
          <div className="flex gap-2 items-center">
            <Shirt className="text-pink-500" />
            <span className="text-2xl font-bold text-gray-900">Glamora</span>
          </div>
        }
        placement="left"
        onClose={() => setIsMobileMenuOpen(false)}
        open={isMobileMenuOpen}
        width={300}
        className="bg-white"
        headerStyle={{ borderBottom: '1px solid #e5e7eb' }}
        bodyStyle={{ padding: 0 }}
      >
        <div className="flex flex-col h-full">
          {isAuthenticated && (
            <div className="flex items-center gap-3 p-4 border-b border-gray-200">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-pink-500">
                <img
                  src={profile?.profileImage ? `http://localhost:5000${profile.profileImage}` : "/img/default-profile.png"}
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <div className="font-semibold text-gray-900">{`${profile?.firstName} ${profile?.lastName}`}</div>
                <div className="text-sm text-gray-500">{profile?.email}</div>
              </div>
            </div>
          )}

          <div className="flex-1 py-4">
            {navCategories.map((category) => (
              <div key={category.name} className="mb-4">
                <div className="px-4 mb-2 font-semibold text-gray-900">{category.name}</div>
                <div className="space-y-1">
                  {category.items.map((item) => (
                    <NavLink
                      key={item.key}
                      to={item.path}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        item.onClick?.();
                      }}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-colors ${
                          isActive ? 'bg-pink-50 text-pink-500 font-semibold' : ''
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {isAuthenticated && userRole === 'user' && (
            <div className="border-t border-gray-200 p-4 space-y-2">
              <NavLink
                to="/my-orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2 hover:bg-pink-50 hover:text-pink-500 rounded transition-colors"
              >
                <ShoppingBag size={20} />
                <span>My Orders</span>
              </NavLink>
              <NavLink
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2 hover:bg-pink-50 hover:text-pink-500 rounded transition-colors"
              >
                <User size={20} />
                <span>Profile</span>
              </NavLink>
              <NavLink
                to="/wallet"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2 hover:bg-pink-50 hover:text-pink-500 rounded transition-colors"
              >
                <Icon icon="icon-park-outline:wallet" width="20" />
                <span>My Wallet</span>
              </NavLink>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 p-2 text-red-600 hover:bg-red-50 rounded w-full transition-colors"
              >
                <X size={20} />
                <span>Logout</span>
              </button>
            </div>
          )}

          {!isAuthenticated && (
            <div className="border-t border-gray-200 p-4 space-y-2">
              <Link
                to="/auth/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full py-2 px-4 text-center bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/auth/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full py-2 px-4 text-center border border-pink-500 text-pink-500 rounded-lg hover:bg-pink-50 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default Header;