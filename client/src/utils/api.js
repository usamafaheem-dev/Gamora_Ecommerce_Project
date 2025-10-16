import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const productsAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (category) => api.get(`/products?category=${category}`),
  getBySubcategory: (category, subcategory) =>
    api.get(`/products?category=${category}&subcategory=${subcategory}`),
};

export const ordersAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getById: (id) => api.get(`/orders/${id}`),
  getUserOrders: () => api.get('/orders/user'),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
};

export const paymentsAPI = {
  createPaymentIntent: (amount) => api.post('/payments/create-intent', { amount }),
  confirmPayment: (paymentIntentId) => api.post('/payments/confirm', { paymentIntentId }),
};

export const notificationsAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
  dismiss: (id) => api.delete(`/notifications/${id}`),
};

export const adminAPI = {
  getWallet: () => api.get('/admin/wallet'),
  getDashboardStats: () => api.get('/admin/dashboard-stats'),
  getAllOrders: () => api.get('/orders/admin/all'),
  updateOrderStatus: (id, status) => api.put(`/orders/admin/${id}/status`, { status }),
  getNotifications: () => api.get('/notifications/admin/all'),
  sendNotification: (data) => api.post('/notifications/admin/send', data),
  processRefund: (data) => api.post('/wallet/refund', data),
};

export const walletAPI = {
  getUserWallet: () => api.get('/wallet/user'),
  getWalletTransactions: () => api.get('/wallet/user/transactions'),
};

export default api;