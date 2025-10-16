import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Layout, Card, Badge, Button, Spin, Empty, Divider, Modal, Image, Popconfirm, Pagination, Input, Tabs, Select } from 'antd';
import { Package, Eye, Calendar, CreditCard, MapPin, Phone, Mail, X, TruckElectric, Search, SearchIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ordersAPI } from '../../../utils/api';
import { OrderTracker } from '../../../components';

const { Content } = Layout;
const { TabPane } = Tabs;
const { Option } = Select;

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [trackingVisible, setTrackingVisible] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [activeTab, setActiveTab] = useState('active');
  const [statusFilter, setStatusFilter] = useState('all');

  const contentRef = useRef(null)

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const { highlightOrderId } = location.state || {};
    if (highlightOrderId && orders.length > 0) {
      const orderToView = orders.find(o => o._id === (highlightOrderId._id || highlightOrderId));
      if (orderToView) {
        handleViewOrder(orderToView);
        // Clean up state to avoid modal popping up on refresh
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [orders, location, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getUserOrders();
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
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

  const getStatusText = (status) => {
    const texts = {
      'pending': 'Pending',
      'confirmed': 'Confirmed',
      'processing': 'Processing',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return texts[status] || status;
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const handleTrackOrder = (order) => {
    setSelectedOrder(order);
    setTrackingVisible(true);
  };

  const handleCancelOrder = async (orderId) => {
    try {
      setCancellingOrder(orderId)
      await ordersAPI.cancelOrder(orderId);
      toast.success('order cancelled successfully')
      fetchOrders()
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order')
    } finally {
      setCancellingOrder(null)
    }
  }

  const canCancelOrder = (order) => {
    return ['pending', 'confirmed'].includes(order.status)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const activeOrders = useMemo(() => orders.filter(order => order.status !== 'cancelled'), [orders]);
  const cancelledOrders = useMemo(() => orders.filter(order => order.status === 'cancelled'), [orders]);

  const filteredActiveOrders = useMemo(() => {
    let filtered = activeOrders;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    if (searchQuery.trim()) {
      filtered = filtered.filter((order) =>
        order.orderNumber.toLowerCase().includes(searchQuery.trim().toLowerCase())
      );
    }
    return filtered;
  }, [activeOrders, statusFilter, searchQuery]);

  const filteredCancelledOrders = useMemo(() => {
    if (!searchQuery.trim()) return cancelledOrders;
    return cancelledOrders.filter((order) =>
      order.orderNumber.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
  }, [cancelledOrders, searchQuery]);

  const paginatedActiveOrders = useMemo(() => {
    return filteredActiveOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [filteredActiveOrders, currentPage, pageSize]);

  const paginatedCancelledOrders = useMemo(() => {
    return filteredCancelledOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [filteredCancelledOrders, currentPage, pageSize]);

  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
    
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Content ref={contentRef} className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex xs:flex-col xs:gap-3  justify-between items-center mb-8 ">
          <div >
            <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
            <p className="text-gray-600 mt-2">Track and manage all your orders</p>
          </div>
          <div className="flex gap-2 items-center">
            {activeTab === 'active' && (
              <Select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                style={{ width: 160 }}
                size="large"
              >
                <Option value="all">All Statuses</Option>
                <Option value="pending">Pending</Option>
                <Option value="confirmed">Confirmed</Option>
                <Option value="processing">Processing</Option>
                <Option value="shipped">Shipped</Option>
                <Option value="delivered">Delivered</Option>
              </Select>
            )}
            <Input
              placeholder="Search by order number"
              allowClear
              size="large"
              prefix={<Search size={18} className="text-gray-400" />}
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
              value={searchQuery}
            />
          </div>
        </div>
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane tab="Active Orders" key="active">
            {activeOrders.length === 0 ? (
              <Card className="text-center py-12">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No active orders found</h3>
                      <p className="text-gray-500 mb-4">You haven't placed any active orders yet.</p>
                      <Button
                        type="primary"
                        size="large"
                        onClick={() => navigate('/men/shirts')}
                        className="bg-[#0F172A]"
                      >
                        Start Shopping
                      </Button>
                    </div>
                  }
                />
              </Card>
            ) : (
              <div className="space-y-6">
                {paginatedActiveOrders.map((order) => (
                  <Card key={order._id} className={`shadow-sm hover:shadow-md transition-shadow ${order.status === 'cancelled' ? 'bg-red-200 cursor-not-allowed !border-red-200 ' : ''} `}>
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="flex items-center gap-2">
                            <Package size={20} className="text-gray-500" />
                            <span className="font-semibold text-lg">Order #{order.orderNumber}</span>
                          </div>
                          <Badge
                            color={getStatusColor(order.status)}
                            text={getStatusText(order.status)}
                            className="font-medium flex items-center"
                          />
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            <span>{formatDate(order.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CreditCard size={16} />
                            <span className="capitalize">{order.paymentMethod}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">
                            {order.items.length} item{order.items.length > 1 ? 's' : ''}
                          </span>
                          <span className="text-lg font-bold text-green-600">
                            Rs: {order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="primary"
                          icon={<Eye size={16} />}
                          onClick={() => handleViewOrder(order)}
                        >
                          View Details
                        </Button>

                        <Button
                          type="default"
                          icon={<TruckElectric size={16} />}
                          onClick={() => handleTrackOrder(order)}
                          className="bg-green-50 !text-green-600 !border-green-200 hover:!bg-green-100"
                        >
                          Track Order
                        </Button>

                        {canCancelOrder(order) && (
                          <Popconfirm
                            title="Cancel Order"
                            description="Are you sure you want to cancel this order?"
                            onConfirm={() => handleCancelOrder(order._id)}
                            okText="Yes, Cancel"
                            cancelText="No"
                            okButtonProps={{ danger: true }}
                          >
                            <Button
                              danger
                              icon={<X size={16} />}
                              className=' !bg-red-50 !text-red-600 !border-red-200 hover:!bg-red-100'
                              loading={cancellingOrder === order._id}
                            >
                              Cancel
                            </Button>
                          </Popconfirm>
                        )}
                      </div>
                    </div>

                    {/* Quick preview of items */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex gap-4 overflow-x-auto">
                        {order.items.slice(0, 4).map((item, index) => (
                          <div key={index} className="flex-shrink-0">
                            <img
                              src={`http://localhost:5000${item.image}`}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                              }}
                            />
                          </div>
                        ))}
                        {order.items.length > 4 && (
                          <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                            <span className="text-sm text-gray-500">+{order.items.length - 4}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            <div className="mt-12 flex justify-center">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredActiveOrders.length}
                onChange={handlePageChange}
                showSizeChanger={false}
                showQuickJumper={false}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`
                }
                className="bg-white p-4 rounded-lg shadow-sm"
              />
            </div>
          </TabPane>
          <TabPane tab="Canceled Orders" key="cancelled">
            {cancelledOrders.length === 0 ? (
              <Card className="text-center py-12">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No canceled orders found</h3>
                      <p className="text-gray-500 mb-4">You haven't canceled any orders yet.</p>
                    </div>
                  }
                />
              </Card>
            ) : (
              <div className="space-y-6">
                {paginatedCancelledOrders.map((order) => (
                  <Card key={order._id} className={`shadow-sm hover:shadow-md transition-shadow bg-red-200 cursor-not-allowed !border-red-200`}>
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="flex items-center gap-2">
                            <Package size={20} className="text-gray-500" />
                            <span className="font-semibold text-lg">Order #{order.orderNumber}</span>
                          </div>
                          <Badge
                            color={getStatusColor(order.status)}
                            text={getStatusText(order.status)}
                            className="font-medium"
                          />
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            <span>{formatDate(order.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CreditCard size={16} />
                            <span className="capitalize">{order.paymentMethod}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">
                            {order.items.length} item{order.items.length > 1 ? 's' : ''}
                          </span>
                          <span className="text-lg font-bold text-green-600">
                            Rs: {order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="primary"
                          icon={<Eye size={16} />}
                          onClick={() => handleViewOrder(order)}
                        >
                          View Details
                        </Button>

                        <Button
                          type="default"
                          icon={<TruckElectric size={16} />}
                          onClick={() => handleTrackOrder(order)}
                          className="bg-green-50 !text-green-600 !border-green-200 hover:!bg-green-100"
                        >
                          Track Order
                        </Button>

                        {canCancelOrder(order) && (
                          <Popconfirm
                            title="Cancel Order"
                            description="Are you sure you want to cancel this order?"
                            onConfirm={() => handleCancelOrder(order._id)}
                            okText="Yes, Cancel"
                            cancelText="No"
                            okButtonProps={{ danger: true }}
                          >
                            <Button
                              danger
                              icon={<X size={16} />}
                              className=' !bg-red-50 !text-red-600 !border-red-200 hover:!bg-red-100'
                              loading={cancellingOrder === order._id}
                            >
                              Cancel
                            </Button>
                          </Popconfirm>
                        )}
                      </div>
                    </div>

                    {/* Quick preview of items */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex gap-4 overflow-x-auto">
                        {order.items.slice(0, 4).map((item, index) => (
                          <div key={index} className="flex-shrink-0">
                            <img
                              src={`http://localhost:5000${item.image}`}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                              }}
                            />
                          </div>
                        ))}
                        {order.items.length > 4 && (
                          <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                            <span className="text-sm text-gray-500">+{order.items.length - 4}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            <div className="mt-12 flex justify-center">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredCancelledOrders.length}
                onChange={handlePageChange}
                showSizeChanger={false}
                showQuickJumper={false}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`
                }
                className="bg-white p-4 rounded-lg shadow-sm"
              />
            </div>
          </TabPane>
        </Tabs>

        {/* Order Details Modal */}
        <Modal
          title={`Order Details - #${selectedOrder?.orderNumber}`}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={800}
          className="order-details-modal"
          centered
        >
          <div className="modal-scroll pe-2">
            {selectedOrder && (
              <div className="space-y-6">
                {/* Order Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Package size={24} className="text-gray-600" />
                    <div>
                      <h3 className="font-semibold">Order Status</h3>
                      <p className="text-sm text-gray-600">{formatDate(selectedOrder.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      color={getStatusColor(selectedOrder.status)}
                      text={getStatusText(selectedOrder.status)}
                      className="font-medium text-lg"
                    />
                    {canCancelOrder(selectedOrder) && (
                      <Popconfirm
                        title="Cancel Order"
                        description="Are you sure you want to cancel this order?"
                        onConfirm={() => {
                          handleCancelOrder(selectedOrder._id);
                          setModalVisible(false);
                        }}
                        okText="Yes, Cancel"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                      >
                        <Button danger size="small">
                          Cancel Order
                        </Button>
                      </Popconfirm>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, index) => (
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
                            <span>Price: <span className="font-medium">Rs: {item.price.toFixed(2)}</span></span>
                          </div>
                          <div className="mt-2">
                            <span className="font-semibold text-gray-900">
                              Total: Rs: {(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>Rs: {selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{selectedOrder.shipping === 0 ? 'Free' : `Rs: ${selectedOrder.shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>Rs: {selectedOrder.tax.toFixed(2)}</span>
                    </div>
                    <Divider className="my-2" />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-green-600">Rs: {selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <MapPin size={18} />
                    Shipping Address
                  </h3>
                  <div className="text-sm space-y-1">
                    <p className="font-medium">
                      {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
                    </p>
                    <p>{selectedOrder.shippingAddress.address}</p>
                    {selectedOrder.shippingAddress.apartment && (
                      <p>{selectedOrder.shippingAddress.apartment}</p>
                    )}
                    <p>
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                    </p>
                    <div className="flex items-center gap-4 mt-2 pt-2 border-t border-gray-200">
                      <div className="flex items-center gap-1">
                        <Mail size={14} />
                        <span>{selectedOrder.shippingAddress.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone size={14} />
                        <span>{selectedOrder.shippingAddress.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CreditCard size={18} />
                    Payment Method
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="capitalize">
                      {selectedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' :
                        selectedOrder.paymentMethod === 'card' ? 'Credit/Debit Card' :
                          selectedOrder.paymentMethod === 'paypal' ? 'PayPal' :
                            selectedOrder.paymentMethod}
                    </span>
                    <Badge
                      color={selectedOrder.paymentMethod === 'cod' ? 'orange' : 'green'}
                      text={selectedOrder.paymentMethod === 'cod' ? 'Pending' : 'Paid'}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </Modal>

        {/* Order Tracking Modal */}
        <Modal
          title={`Track Order - #${selectedOrder?.orderNumber}`}
          open={trackingVisible}
          onCancel={() => setTrackingVisible(false)}
          footer={null}
          width={900}
          centered
        >
          <div className="modal-scroll pe-2">
            {selectedOrder && (
              <OrderTracker order={selectedOrder} />
            )}
          </div>
        </Modal>

      </Content>
    </div>
  );
};

export default UserOrdersPage;