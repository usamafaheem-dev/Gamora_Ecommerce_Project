import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Input, Select, Table, Badge, Modal, message, Spin } from 'antd';
import { Bell, Send, Eye, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { adminAPI } from '../../utils/api';

const { TextArea } = Input;
const { Option } = Select;

const NotificationManager = () => {
  const [notifications, setNotifications] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchOrders();
    fetchNotifications();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await adminAPI.getAllOrders();
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getNotifications();
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async (values) => {
    try {
      setLoading(true);

      const notificationData = {
        title: values.title,
        message: values.message,
        type: values.type,
        orderId: values.orderId || null,
        userId: values.userId || null
      };

      await adminAPI.sendNotification(notificationData);

      message.success('Notification sent successfully!');
      form.resetFields();
      setModalVisible(false);
      fetchNotifications();
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  const getNotificationTypeColor = (type) => {
    const colors = {
      'order_update': 'blue',
      'order_delivered': 'green',
      'promotion': 'purple',
      'general': 'default'
    };
    return colors[type] || 'default';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
     className: 'center-column',
      render: (title) => (
        <span className="font-medium">{title}</span>
      ),
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
     className: 'center-column',
      render: (message) => (
        <span className="text-sm text-gray-600">
          {message.length > 50 ? `${message.substring(0, 50)}...` : message}
        </span>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
     className: 'center-column',
      render: (type) => (
        <Badge
          color={getNotificationTypeColor(type)}
          text={type.replace('_', ' ').toUpperCase()}
        />
      ),
    },
    {
      title: 'Order',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
     className: 'center-column',
      render: (orderNumber) => (
        orderNumber ? (
          <span className="text-blue-600 font-medium">#{orderNumber}</span>
        ) : (
          <span className="text-gray-400">-</span>
        )
      ),
    },
    {
      title: 'Recipient',
      dataIndex: 'recipientEmail',
      key: 'recipientEmail',
    className: 'center-column',}
    ,
    {
      title: 'Sent At',
      dataIndex: 'createdAt',
      key: 'createdAt',
     className: 'center-column',
      render: (date) => formatDate(date),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
     className: 'center-column',
      render: (status) => (
        <Badge
          color={status === 'sent' ? 'green' : 'orange'}
          text={(status || 'pending').toUpperCase()}
        />
      ),
    },
  ];
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex xs:flex-col xs:gap-3 justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notification Manager</h2>
          <p className="text-gray-600">Send notifications to customers about their orders</p>
        </div>
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => setModalVisible(true)}
          className="bg-[#0F172A] hover:bg-[#1E293B] px-5 py-5 rounded-xl border-0"
        >
          Send Notification
        </Button>
      </div>

      {/* Notifications Table */}
      <Card className="shadow-sm">
        <Table
          columns={columns}
          dataSource={notifications}
          rowKey="_id"
          loading={loading}
          className="custom-scroll-table"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} notifications`,
          }}
          scroll={{ x: 'max-content' }}

        />
      </Card>

      {/* Send Notification Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <Bell size={20} />
            <span>Send Notification</span>
          </div>
        }
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSendNotification}
          className="mt-4"
        >
          <Form.Item
            name="type"
            label="Notification Type"
            rules={[{ required: true, message: 'Please select notification type' }]}
          >
            <Select placeholder="Select notification type">
              <Option value="order_update">Order Update</Option>
              <Option value="order_delivered">Order Delivered</Option>
              <Option value="promotion">Promotion</Option>
              <Option value="general">General</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="orderId"
            label="Related Order (Optional)"
          >
            <Select
              placeholder="Select order"
              allowClear
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {orders.map(order => (
                <Option key={order._id} value={order._id}>
                  #{order.orderNumber} - {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="title"
            label="Notification Title"
            rules={[{ required: true, message: 'Please enter notification title' }]}
          >
            <Input placeholder="Enter notification title" />
          </Form.Item>

          <Form.Item
            name="message"
            label="Message"
            rules={[{ required: true, message: 'Please enter notification message' }]}
          >
            <TextArea
              rows={4}
              placeholder="Enter notification message"
              showCount
              maxLength={500}
            />
          </Form.Item>

          <div className="flex justify-end gap-2">
            <Button onClick={() => setModalVisible(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<Send size={16} />}
              className="bg-blue-600"
            >
              Send Notification
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default NotificationManager;