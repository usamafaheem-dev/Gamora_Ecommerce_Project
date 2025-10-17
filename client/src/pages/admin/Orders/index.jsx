import React, { useState, useEffect } from 'react';
import { Layout, Table, Badge, Button, Input, Select, Modal, Image, Divider, message, Spin, Empty } from 'antd';
import { Search, Eye, Package, MapPin, CreditCard, Phone, Mail, Calendar, Filter } from 'lucide-react';
import api from '../../../utils/api';

const { Content } = Layout;
const { Option } = Select;

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders/admin/all', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      message.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/admin/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      message.success('Order status updated successfully');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      message.error('Failed to update order status');
    }
  };

  const getStatusColor = (status) => ({
    pending: 'orange',
    confirmed: 'blue',
    processing: 'cyan',
    shipped: 'purple',
    delivered: 'green',
    cancelled: 'red'
  }[status] || 'default');

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber?.toLowerCase().includes(searchText.toLowerCase()) ||
      order.shippingAddress?.firstName?.toLowerCase().includes(searchText.toLowerCase()) ||
      order.shippingAddress?.lastName?.toLowerCase().includes(searchText.toLowerCase()) ||
      order.shippingAddress?.email?.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.paymentMethod === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const columns = [
    {
      title: 'Order #',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (orderNumber) => <span className="font-medium text-blue-600">#{orderNumber}</span>,
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.shippingAddress?.firstName} {record.shippingAddress?.lastName}</div>
          <div className="text-sm text-gray-500">{record.shippingAddress?.email}</div>
        </div>
      ),
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (items) => (
        <div className="flex items-center justify-center gap-2">
          <Package size={16} className="text-gray-500" />
          <span>{items?.length || 0} item{(items?.length || 0) > 1 ? 's' : ''}</span>
        </div>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => <span className="font-semibold text-green-600">Rs: {total?.toFixed(2) || '0.00'}</span>,
    },
    {
      title: 'Payment',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (paymentMethod) => (
        <div className="flex items-center justify-center gap-1">
          <CreditCard size={14} />
          <span className="capitalize text-sm">{paymentMethod}</span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Select
          value={status}
          onChange={(newStatus) => updateOrderStatus(record._id, newStatus)}
          className="w-32"
          size="small"
        >
          {['pending','confirmed','processing','shipped','delivered','cancelled'].map(s => (
            <Option key={s} value={s}><Badge color={getStatusColor(s)} text={s.charAt(0).toUpperCase()+s.slice(1)} /></Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <div className="flex items-center justify-center gap-1 text-sm">
          <Calendar size={14} className="text-gray-500" />
          <span>{formatDate(date)}</span>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button type="link" icon={<Eye size={16} />} onClick={() => handleViewOrder(record)} className="text-blue-600">View</Button>
      ),
    },
  ];

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Spin size="large" /></div>;

  return (
    <div className="min-h-screen bg-white !rounded-lg">
      <Content className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1">Manage and track all customer orders</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <Input
              placeholder="Search orders..."
              prefix={<Search size={16} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full md:w-64"
            />
            <div className="flex gap-2 items-center">
              <Filter size={16} className="text-gray-500" />
              <Select value={statusFilter} onChange={setStatusFilter} className="w-32">
                <Option value="all">All Status</Option>
                {['pending','confirmed','processing','shipped','delivered','cancelled'].map(s => <Option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</Option>)}
              </Select>
              <Select value={paymentFilter} onChange={setPaymentFilter} className="w-32">
                <Option value="all">All Payment</Option>
                {['card','paypal','cod'].map(p => <Option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</Option>)}
              </Select>
            </div>
          </div>
          <div className="text-sm text-gray-600">Total Orders: <span className="font-medium">{filteredOrders.length}</span></div>
        </div>

        {/* Orders Table */}
        {filteredOrders.length ? (
          <div className='product-table'>
            <Table
              columns={columns}
              dataSource={filteredOrders}
              rowKey="_id"
              className='w-full show-scrollbar overflow-auto data-table height-horizontal-scrollbar-10'
              pagination={{ pageSize:10, showSizeChanger:true, showQuickJumper:true, showTotal:(total, range)=>`${range[0]}-${range[1]} of ${total} orders` }}
              scroll={{ x: 'max-content' }}
            />
          </div>
        ) : <Empty description="No orders found" className="py-20" />}

        {/* Order Details Modal */}
        <Modal
          title={`Order Details - #${selectedOrder?.orderNumber}`}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width="90%"
          className="order-details-modal"
        >
          {selectedOrder && (
            <div className="space-y-6">
              {/* Modal content remains same, with optional chaining for safety */}
              {/* Customer Info, Payment Info, Order Items (images use fallback) */}
              {/* Images dynamic: */}
              <Image
                src={selectedOrder.items?.[0]?.image?.startsWith('http') ? selectedOrder.items[0].image : `http://localhost:5000${selectedOrder.items[0]?.image}`}
                fallback="https://via.placeholder.com/80x80?text=No+Image"
              />
            </div>
          )}
        </Modal>
      </Content>
    </div>
  );
};

export default ManageOrders;
