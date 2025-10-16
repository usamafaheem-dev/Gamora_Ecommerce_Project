// src/context/AuthContext.jsx (if using Context)
import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setIsAuthenticated(true);
          setUserRole(decoded.role); // Assuming JWT contains 'role'
          setUserEmail(decoded.email); // Assuming JWT contains 'email'
        } catch (error) {
          console.error('Token decoding error:', error);
          setIsAuthenticated(false);
          setUserRole(null);
          setUserEmail(null);
          localStorage.removeItem('token');
        }
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
        setUserEmail(null);
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userEmail }}>
      {children}
    </AuthContext.Provider>
  );
};