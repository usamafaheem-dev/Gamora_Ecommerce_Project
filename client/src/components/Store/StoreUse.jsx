import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import api from '../../utils/api';
// import api from '../../utils/api';

const storeUse = create(
  persist(
    (set, get) => ({
      cart: [],
      favorites: [],
      notifications: [],
      isCartOpen: false,
      isWishlistOpen: false,
      isNotificationOpen: false,
      user: null,

      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null, cart: [], favorites: [], notifications: [] }),

      addToCart: (item) => set((state) => {
        const existingItem = state.cart.find((cartItem) => cartItem._id === item._id);

        if (existingItem) {
          return {
            cart: state.cart.map((cartItem) =>
              cartItem._id === item._id
                ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
                : cartItem
            ),
          };
        }

        return {
          cart: [...state.cart, { ...item, quantity: 1 }],
        };
      }),

      removeFromCart: (itemId) => set((state) => ({
        cart: state.cart.filter((item) => item._id !== itemId),
      })),

      updateQuantity: (itemId, quantity) => set((state) => ({
        cart: state.cart.map((item) =>
          item._id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
        ),
      })),

      clearCart: () => set({ cart: [] }),

      toggleFavorite: (item) => set((state) => {
        const isFavorite = state.favorites.some((fav) => fav._id === item._id);
        return {
          favorites: isFavorite
            ? state.favorites.filter((fav) => fav._id !== item._id)
            : [...state.favorites, item],
        };
      }),

      setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
      setWishlistOpen: (isOpen) => set({ isWishlistOpen: isOpen }),
      setNotificationOpen: (isOpen) => set({ isNotificationOpen: isOpen }),

      // Notification methods
      setNotifications: (notifications) => set({ notifications: Array.isArray(notifications) ? notifications : [] }),

      addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications],
      })),

      markNotificationAsRead: (notificationId) => set((state) => ({
        notifications: state.notifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, read: true }
            : notification
        ),
      })),

      markAllNotificationsAsRead: () => set((state) => ({
        notifications: state.notifications.map((notification) => ({
          ...notification,
          read: true,
        })),
      })),

      removeNotification: (notificationId) => set((state) => ({
        notifications: state.notifications.filter((notification) => notification._id !== notificationId),
      })),

      // Fetch notifications from API
      fetchNotifications: async () => {
        try {
          const response = await api.get('/notifications', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          const notificationsData = Array.isArray(response.data.data) ? response.data.data : [];
          set({ notifications: notificationsData });
        } catch (error) {
          console.error('Error fetching notifications:', error);
          set({ notifications: [] }); // Ensure notifications is always an array
        }
      },

      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((sum, item) => {
          return sum + item.price * (item.quantity || 1);
        }, 0);
      },

      getCartCount: () => {
        const { cart } = get();
        return cart.reduce((count, item) => count + (item.quantity || 1), 0);
      },
    }),
    {
      name: 'fashion-store',
      partialize: (state) => ({
        cart: state.cart,
        favorites: state.favorites,
        user: state.user,
        notifications: state.notifications,
      }),
    }
  )
);

export default storeUse;