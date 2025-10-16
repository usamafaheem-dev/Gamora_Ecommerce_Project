import React, { useState, useEffect } from 'react';
import { Layout, Card, Table, Badge, Button, Input, Select, Modal, Image, Divider, message, Spin } from 'antd';
import { Search, Eye, Package, MapPin, CreditCard, Phone, Mail, Calendar, Filter } from 'lucide-react';
import axios from 'axios';

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

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/orders/admin/all', {
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
      await axios.put(`http://localhost:5000/api/orders/admin/${orderId}/status`, 
        { status: newStatus }, 
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      message.success('Order status updated successfully');
      fetchOrders(); // Refresh the orders
    } catch (error) {
      console.error('Error updating order status:', error);
      message.error('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'orange',
      'confirmed': 'blue',
      'processing': 'cyan',
      'shipped': 'purple',
      'delivered': 'green',
      'cancelled': 'red'
    };
    return colors[status] || 'default';
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
      className: 'center-column',
      render: (orderNumber) => (
        <span className="font-medium text-blue-600">#{orderNumber}</span>
      ),
    },
    {
      title: 'Customer',
      key: 'customer',
      className: 'center-column',
      render: (_, record) => (
        <div>
          <div className="font-medium">
            {record.shippingAddress?.firstName} {record.shippingAddress?.lastName}
          </div>
          <div className="text-sm text-gray-500">{record.shippingAddress?.email}</div>
        </div>
      ),
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      className: 'center-column',
      render: (items) => (
        <div className="flex items-center justify-center  gap-2">
          <Package size={16} className="text-gray-500" />
          <span>{items?.length || 0} item{(items?.length || 0) > 1 ? 's' : ''}</span>
        </div>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      className: 'center-column',
      render: (total) => (
        <span className="font-semibold text-green-600">Rs: {total?.toFixed(2) || '0.00'}</span>
      ),
    },
    {
      title: 'Payment',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      className: 'center-column',
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
      className: 'center-column',
      render: (status, record) => (
        <Select
          value={status}
          onChange={(newStatus) => updateOrderStatus(record._id, newStatus)}
          className="w-32"
          size="small"
        >
          <Option value="pending">
            <Badge color="orange" text="Pending" />
          </Option>
          <Option value="confirmed">
            <Badge color="blue" text="Confirmed" />
          </Option>
          <Option value="processing">
            <Badge color="cyan" text="Processing" />
          </Option>
          <Option value="shipped">
            <Badge color="purple" text="Shipped" />
          </Option>
          <Option value="delivered">
            <Badge color="green" text="Delivered" />
          </Option>
          <Option value="cancelled">
            <Badge color="red" text="Cancelled" />
          </Option>
        </Select>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      className: 'center-column',
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
      className: 'center-column',
      render: (_, record) => (
        <Button
          type="link"
          icon={<Eye size={16} />}
          onClick={() => handleViewOrder(record)}
          className="text-blue-600"
        >
          View
        </Button>
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
    <div className="min-h-screen bg-white !rounded-lg ">
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
                <Select
                  value={statusFilter}
                  onChange={setStatusFilter}
                  className="w-32"
                  placeholder="Status"
                >
                  <Option value="all">All Status</Option>
                  <Option value="pending">Pending</Option>
                  <Option value="confirmed">Confirmed</Option>
                  <Option value="processing">Processing</Option>
                  <Option value="shipped">Shipped</Option>
                  <Option value="delivered">Delivered</Option>
                  <Option value="cancelled">Cancelled</Option>
                </Select>
                
                <Select
                  value={paymentFilter}
                  onChange={setPaymentFilter}
                  className="w-32"
                  placeholder="Payment"
                >
                  <Option value="all">All Payment</Option>
                  <Option value="card">Card</Option>
                  <Option value="paypal">PayPal</Option>
                  <Option value="cod">COD</Option>
                </Select>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              Total Orders: <span className="font-medium">{filteredOrders.length}</span>
            </div>
          </div>

          {/* Orders Table */}
          <div className=' product-table'>
          <Table
            columns={columns}
            dataSource={filteredOrders}
            rowKey="_id"
            className='w-full show-scrollbar overflow-auto data-table height-horizontal-scrollbar-10'
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} orders`,
            }}
            scroll={{ x: 'max-content' }}
          />
          </div>

        {/* Order Details Modal */}
        <Modal
          title={`Order Details - #${selectedOrder?.orderNumber}`}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={900}
          className="order-details-modal"
        >
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Header */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Package size={24} className="text-gray-600" />
                  <div>
                    <h3 className="font-semibold text-lg">Order #{selectedOrder.orderNumber}</h3>
                    <p className="text-sm text-gray-600">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    color={getStatusColor(selectedOrder.status)} 
                    text={selectedOrder.status?.charAt(0).toUpperCase() + selectedOrder.status?.slice(1)}
                    className="font-medium text-lg"
                  />
                  <div className="mt-1">
                    <Select
                      value={selectedOrder.status}
                      onChange={(newStatus) => {
                        updateOrderStatus(selectedOrder._id, newStatus);
                        setSelectedOrder({...selectedOrder, status: newStatus});
                      }}
                      size="small"
                    >
                      <Option value="pending">Pending</Option>
                      <Option value="confirmed">Confirmed</Option>
                      <Option value="processing">Processing</Option>
                      <Option value="shipped">Shipped</Option>
                      <Option value="delivered">Delivered</Option>
                      <Option value="cancelled">Cancelled</Option>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <MapPin size={18} />
                    Customer Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div>
                      <p className="font-medium text-lg">
                        {selectedOrder.shippingAddress?.firstName} {selectedOrder.shippingAddress?.lastName}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail size={14} className="text-gray-500" />
                        <span>{selectedOrder.shippingAddress?.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={14} className="text-gray-500" />
                        <span>{selectedOrder.shippingAddress?.phone}</span>
                      </div>
                    </div>
                    <Divider className="my-3" />
                    <div className="text-sm">
                      <p className="font-medium">Shipping Address:</p>
                      <p>{selectedOrder.shippingAddress?.address}</p>
                      {selectedOrder.shippingAddress?.apartment && (
                        <p>{selectedOrder.shippingAddress.apartment}</p>
                      )}
                      <p>
                        {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <CreditCard size={18} />
                    Payment Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">Payment Method:</span>
                      <span className="capitalize">
                        {selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                         selectedOrder.paymentMethod === 'card' ? 'Credit/Debit Card' :
                         selectedOrder.paymentMethod === 'paypal' ? 'PayPal' :
                         selectedOrder.paymentMethod}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>Rs: {selectedOrder.subtotal?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span>{selectedOrder.shipping === 0 ? 'Free' : `Rs: ${selectedOrder.shipping?.toFixed(2)}`}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>Rs: {selectedOrder.tax?.toFixed(2)}</span>
                      </div>
                      <Divider className="my-2" />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total:</span>
                        <span className="text-green-600">Rs: {selectedOrder.total?.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Order Items</h3>
                <div className="space-y-4">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      <Image
                        src={`http://localhost:5000${item.image}`}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="object-cover rounded"
                        fallback="https://via.placeholder.com/80x80?text=No+Image"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span>Size: <span className="font-medium">{item.size}</span></span>
                          <span>Qty: <span className="font-medium">{item.quantity}</span></span>
                          <span>Price: <span className="font-medium">Rs: {item.price?.toFixed(2)}</span></span>
                        </div>
                        <div className="mt-2">
                          <span className="font-semibold text-gray-900">
                            Total: Rs: {(item.price * item.quantity)?.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Modal>
      </Content>
    </div>
  );
};

export default ManageOrders;

