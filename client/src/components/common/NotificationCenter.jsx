import React from 'react';
import { Drawer, Badge, Button, List, Typography, Empty, Spin, message } from 'antd';
import { Bell, Package, CheckCircle, X, Star } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import StoreUse from '../Store/StoreUse'; // Adjust the path as needed

const { Text, Title } = Typography;

const NotificationCenter = () => {
  const {
    isNotificationOpen,
    setNotificationOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    removeNotification,
  } = StoreUse();

  const [loading] = React.useState(false);
  const navigate = useNavigate();

  const handleNotificationClick = async (notification) => {
    try {
      await axios.put(
        `http://localhost:5000/api/notifications/${notification._id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      markNotificationAsRead(notification._id);

      if (notification.type === 'order_update' || notification.type === 'order_delivered') {
        if (notification.orderId) {
          setNotificationOpen(false);
          navigate('/my-orders', { state: { highlightOrderId: notification.orderId } });
        } else {
          setNotificationOpen(false);
          navigate('/my-orders');
        }
      } else if (notification.type === 'promotion') {
        setNotificationOpen(false);
        navigate('/men/shirts');
      } else if (notification.type === 'review_reminder') {
        if (notification.productId) {
          setNotificationOpen(false);
          navigate(`/product/${notification.productId._id}`, { state: { scrollToReviews: true } });
        }
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axios.put(
        'http://localhost:5000/api/notifications/mark-all-read',
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      markAllNotificationsAsRead();
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark notifications as read');
    }
  };

  const handleDismissNotification = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`http://localhost:5000/api/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      removeNotification(notificationId);
      message.success('Notification dismissed');
    } catch (error) {
      console.error('Error dismissing notification:', error);
      toast.error('Failed to dismiss notification');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order_update':
        return <Package size={20} className="text-blue-500" />;
      case 'order_delivered':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'promotion':
        return <Bell size={20} className="text-purple-500" />;
      case 'review_reminder':
        return <Star size={20} className="text-yellow-500" />;
      default:
        return <Bell size={20} className="text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const unreadNotifications = Array.isArray(notifications)
    ? notifications.filter((n) => !n.read).length
    : 0;

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={24} />
            <Title level={4} className="!mb-0 !text-2xl">
              Notifications
              {unreadNotifications > 0 && <Badge count={unreadNotifications} className="ml-2" />}
            </Title>
          </div>
          {unreadNotifications > 0 && (
            <Button
              type="link"
              size="small"
              onClick={handleMarkAllAsRead}
              className="text-blue-500"
            >
              Mark all as read
            </Button>
          )}
        </div>
      }
      placement="right"
      onClose={() => setNotificationOpen(false)}
      open={isNotificationOpen}
      width={400}
      className="notification-drawer"
    >
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Spin size="large" />
        </div>
      ) : notifications.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No notifications yet"
          className="mt-16"
        />
      ) : (
        <List
          dataSource={notifications}
          renderItem={(notification) => (
            <List.Item
              className={`cursor-pointer hover:bg-gray-50 !ps-0 !p-4 !border-b relative ${
                !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <List.Item.Meta
                avatar={
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                    {getNotificationIcon(notification.type)}
                  </div>
                }
                title={
                  <div className="flex items-center justify-between">
                    <Text strong={!notification.read} >
                      {notification.title}
                    </Text>
                    <div className="flex items-center gap-2">
                      <Text type="secondary" className="text- font-medium">
                        {formatDate(notification.createdAt)}
                      </Text>
                      <Button
                        type="text"
                        size="small"
                        icon={<X size={14} />}
                        onClick={(e) => handleDismissNotification(notification._id, e)}
                        className="text-gray-400 hover:text-red-500"
                      />
                    </div>
                  </div>
                }
                description={
                  <Text type="secondary" className="text-xs">
                    {notification.message}
                  </Text>
                }
              />
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full ml-2" />
              )}
            </List.Item>
          )}
        />
      )}
    </Drawer>
  );
};

export default NotificationCenter;