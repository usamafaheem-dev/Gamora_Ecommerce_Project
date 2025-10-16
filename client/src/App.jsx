import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ForgotPassword, Login, ResetPassword, Signup, VerifyOtp } from './auth';
import { CheckoutPage, Home, MenPants, MenProducts, MenShirts, MenShoes, OrderConfirmationPage,  ProductDetailsPage, UserLayout, UserOrdersPage, UserProfile, UserWallet, WomenPants, WomenProducts, WomenShirts, WomenShoes } from './pages/client';
import { AdminLayout, AdminProfile, AdminWallet, Dashboard, Kids, ManageOrders, Men, Women, Reviews } from './pages/admin';
import { AuthProvider, AuthRoute, ProtectedRoute } from './routes';
import { NotificationManager } from './components/common';

function App() {
  
  const router = createBrowserRouter([
    {
      path: '/auth',
      element: <AuthRoute />,
      children: [
        { path: 'signup', element: <Signup /> },
        { path: 'login', element: <Login /> },
        { path: 'forgot', element: <ForgotPassword /> },
        { path: 'otp', element: <VerifyOtp /> },
        { path: 'reset', element: <ResetPassword /> },
      ],
    },
    {
      path: '',
      element: <ProtectedRoute role="user" />,
      children: [
        {
          path: '',
          element: <UserLayout />,
          children: [
            { path: '/', element: <Home /> },
            { path: '/men', element: <MenProducts /> },
            { path: '/product/:id', element: <ProductDetailsPage /> },
            { path: '/checkout', element: <CheckoutPage /> },
            { path: '/men/shirts', element: <MenShirts /> },
            { path: '/men/pants', element: <MenPants /> },
            { path: '/men/shoes', element: <MenShoes /> },
            { path: '/women', element: <WomenProducts /> },
            { path: '/women/shirts', element: <WomenShirts /> },
            { path: '/women/pants', element: <WomenPants /> },
            { path: '/women/shoes', element: <WomenShoes /> },
            { path: '/order-confirmation', element: <OrderConfirmationPage /> },
            { path: '/profile', element: <UserProfile /> },
            { path: '/my-orders', element: <UserOrdersPage /> },
            { path: '/wallet', element: <UserWallet /> },

          ],
        },
      ],
    },
    {
      path: '/admin',
      element: <ProtectedRoute role="admin" />,
      children: [
        {
          path: '',
          element: <AdminLayout />,
          children: [
            { path: '', element: <Dashboard /> },
            { path: 'profile', element: <AdminProfile /> },
            { path: 'men', element: <Men /> },
            { path: 'women', element: <Women /> },
            { path: 'kids', element: <Kids /> },
            { path: 'manage-orders', element: <ManageOrders /> },
            { path: 'wallet', element: <AdminWallet /> },
            { path: 'notifications', element: <NotificationManager /> },
            { path: 'reviews', element: <Reviews /> },
            { path: 'wallet', element: <AdminWallet /> },
          ],
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ]);

  return (
    <>
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" draggable theme="light" limit={3} />
    </AuthProvider>
    </>
  );
}

export default App;