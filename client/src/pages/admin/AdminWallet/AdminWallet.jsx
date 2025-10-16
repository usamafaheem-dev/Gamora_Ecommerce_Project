import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Table, Badge, Spin, DatePicker, Button, Modal, InputNumber, Form, message } from 'antd';
import { DollarSign, TrendingUp, TrendingDown, Eye, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import { adminAPI } from '../../../utils/api';

const { RangePicker } = DatePicker;

const AdminWallet = () => {
  const [walletData, setWalletData] = useState({
    totalRevenue: 0,
    pendingAmount: 0,
    completedAmount: 0,
    transactions: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [refundModalVisible, setRefundModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [refundForm] = Form.useForm();

  useEffect(() => {
    fetchWalletData();

    // Set up real-time updates
    const interval = setInterval(fetchWalletData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [selectedDateRange]);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedDateRange) {
        params.startDate = selectedDateRange[0].toISOString();
        params.endDate = selectedDateRange[1].toISOString();
      }

      const response = await adminAPI.getWallet(params);
      if (response.data && response.data.data) {
        setWalletData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast.error('Failed to fetch wallet data');
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (dates) => {
    setSelectedDateRange(dates);
  };

  const handleRefund = (transaction) => {
    setSelectedTransaction(transaction);
    setRefundModalVisible(true);
    refundForm.setFieldsValue({
      amount: transaction.amount
    });
  };

  const processRefund = async (values) => {
    try {
      setLoading(true);
      const refundData = {
        orderId: selectedTransaction.orderId,
        orderNumber: selectedTransaction.orderNumber,
        amount: values.amount,
        userId: selectedTransaction.userId,
      };

      await adminAPI.processRefund(refundData);
      message.success('Refund processed successfully');
      setRefundModalVisible(false);
      fetchWalletData();
    } catch (error) {
      console.error('Error processing refund:', error);
      toast.error('Failed to process refund');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'completed': 'green',
      'pending': 'orange',
      'cancelled': 'red',
      'refunded': 'purple'
    };
    return colors[status] || 'default';
  };

  const formatCurrency = (amount) => {
    return `Rs: ${amount.toFixed(2)}`;
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
      title: 'Order ID',
      dataIndex: 'orderNumber',
      className: 'center-column',
      key: 'orderNumber',
      render: (orderNumber) => (
        <span className="font-medium text-blue-600">#{orderNumber}</span>
      ),
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      className: 'center-column',
      key: 'customerName',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      className: 'center-column',
      key: 'amount',
      render: (amount) => (
        <span className="font-semibold">{formatCurrency(amount)}</span>
      ),
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      className: 'center-column',
      key: 'paymentMethod',
      render: (method) => (
        <span className="capitalize">{method === 'cod' ? 'Cash on Delivery' : method}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      className: 'center-column',
      key: 'status',
      render: (status) => (
        <Badge color={getStatusColor(status)} text={status.charAt(0).toUpperCase() + status.slice(1)} />
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      className: 'center-column',
      key: 'createdAt',
      render: (date) => formatDate(date),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        record.status === 'cancelled' && (
          <Button
            type="primary"
            danger
            size="small"
            onClick={() => handleRefund(record)}
            icon={<RefreshCw size={14} />}
          >
            Refund
          </Button>
        )
      ),
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Wallet</h2>
          <p className="text-gray-600">Real-time revenue and transaction overview</p>
        </div>
        <RangePicker onChange={handleDateRangeChange} />
      </div>

      {/* Revenue Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Total Revenue"
              value={walletData.totalRevenue}
              precision={2}
              prefix="Rs: "
              valueStyle={{ color: '#3f8600' }}
              suffix={
                <TrendingUp size={16} className="inline ml-2 text-green-500" />
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Completed Orders"
              value={walletData.completedAmount}
              precision={2}
              prefix="Rs: "
              valueStyle={{ color: '#1890ff' }}
              suffix={
                <Eye size={16} className="inline ml-2 text-blue-500" />
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Pending Amount"
              value={walletData.pendingAmount}
              precision={2}
              prefix="Rs: "
              valueStyle={{ color: '#fa8c16' }}
              suffix={
                <TrendingDown size={16} className="inline ml-2 text-orange-500" />
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <Statistic
              title="Success Rate"
              value={
                walletData.totalRevenue > 0
                  ? ((walletData.completedAmount / walletData.totalRevenue) * 100)
                  : 0
              }
              precision={1}
              suffix="%"
              valueStyle={{
                color: walletData.completedAmount / walletData.totalRevenue > 0.8 ? '#3f8600' : '#fa8c16'
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Transactions Table */}
      <Card
        title="Recent Transactions"
        className="shadow-sm"
        extra={
          <Badge
            count={walletData.transactions.length}
            showZero
            style={{ backgroundColor: '#52c41a' }}
          />
        }
      >
        <Table
          columns={columns}
          dataSource={walletData.transactions}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} transactions`,
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Refund Modal */}
      <Modal
        title="Process Refund"
        open={refundModalVisible}
        onCancel={() => setRefundModalVisible(false)}
        onOk={() => refundForm.submit()}
        confirmLoading={loading}
      >
        <Form form={refundForm} onFinish={processRefund} layout="vertical">
          <p>Order: #{selectedTransaction?.orderNumber}</p>
          <p>Customer: {selectedTransaction?.customerName}</p>
          <Form.Item
            name="amount"
            label="Refund Amount"
            rules={[{ required: true, message: 'Please enter the refund amount' }]}
          >
            <InputNumber
              prefix="Rs: "
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Real-time indicator */}
      <div className="flex items-center justify-center text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live data - Updates every 30 seconds</span>
        </div>
      </div>
    </div>
  );
};

export default AdminWallet;