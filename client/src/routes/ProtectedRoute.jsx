import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ role }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/auth/verify', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAuthenticated(true);
        setUserRole(response.data.user.role);
      } catch (error) {
        console.error('Token verification error:', error);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (role === 'admin' && userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const restrictedUserPagesForAdmin = ['/checkout', '/order-confirmation', '/my-orders', '/profile', '/wallet'];
  if (userRole === 'admin' && restrictedUserPagesForAdmin.includes(location.pathname)) {
    return <Navigate to="/admin" replace />;
  }
  

  return <Outlet />;
};

export default ProtectedRoute;