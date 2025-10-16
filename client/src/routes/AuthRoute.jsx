import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const AuthRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);

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
        setUserRole(response.data.user.role); // Match backend response structure
      } catch (error) {
        console.error('Token verification error:', error.message);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return null; // Or a loading spinner
  }

  if (isAuthenticated) {
    return userRole === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/" replace />;
  }
  

  return <Outlet />;
};

export default AuthRoute;