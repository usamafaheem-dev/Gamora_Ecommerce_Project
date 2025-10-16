import React from 'react';
import { Steps, Badge, Card, Timeline } from 'antd';
import { Package, CheckCircle, Truck, Home, Clock, X } from 'lucide-react';

const OrderTracker = ({ order }) => {
  const getStatusStep = (status) => {
    const statusMap = {
      'pending': 0,
      'confirmed': 1,
      'processing': 2,
      'shipped': 3,
      'delivered': 4,
      'cancelled': -1
    };
    return statusMap[status] || 0;
  };

  const currentStep = getStatusStep(order.status);

  const steps = [
    {
      title: 'Order Placed',
      description: 'Your order has been received',
      icon: <CheckCircle size={16} />,
      status: currentStep >= 0 ? 'finish' : 'wait'
    },
    {
      title: 'Confirmed',
      description: 'Order confirmed and being prepared',
      icon: <Package size={16} />,
      status: currentStep >= 1 ? 'finish' : currentStep === 0 ? 'process' : 'wait'
    },
    {
      title: 'Processing',
      description: 'Your items are being packed',
      icon: <Package size={16} />,
      status: currentStep >= 2 ? 'finish' : currentStep === 1 ? 'process' : 'wait'
    },
    {
      title: 'Shipped',
      description: 'Your order is on the way',
      icon: <Truck size={16} />,
      status: currentStep >= 3 ? 'finish' : currentStep === 2 ? 'process' : 'wait'
    },
    {
      title: 'Delivered',
      description: 'Package delivered successfully',
      icon: <Home size={16} />,
      status: currentStep >= 4 ? 'finish' : currentStep === 3 ? 'process' : 'wait'
    }
  ];

  if (order.status === 'cancelled') {
    return (
      <div className="text-center py-8">
        <X size={64} className="text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-red-600 mb-2">Order Cancelled</h3>
        <p className="text-gray-600">This order has been cancelled.</p>
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">
            If you cancelled this order, your refund will be processed within 3-5 business days.
            If you have any questions, please contact our support team.
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstimatedDelivery = () => {
    const orderDate = new Date(order.createdAt);
    const estimatedDate = new Date(orderDate);
    
    switch (order.status) {
      case 'pending':
      case 'confirmed':
        estimatedDate.setDate(orderDate.getDate() + 5);
        break;
      case 'processing':
        estimatedDate.setDate(orderDate.getDate() + 3);
        break;
      case 'shipped':
        estimatedDate.setDate(orderDate.getDate() + 1);
        break;
    }
    
    return estimatedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-900">
              Current Status: {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </h3>
            <p className="text-blue-700">
              Order placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <Badge 
            color="blue" 
            text={order.status === 'delivered' ? 'Delivered' : `Est. delivery: ${getEstimatedDelivery()}`}
            className="text-sm"
          />
        </div>
      </Card>

      {/* Progress Steps */}
      <div className="flex xs:flex-col gap-5">
      <div className="bg-white md:w-1/2 xs:w-full p-6 rounded-lg border">
        <h4 className="font-semibold mb-4">Order Progress</h4>
        <Steps
          current={currentStep}
          direction="vertical"
          items={steps.map(step => ({
            title: step.title,
            description: step.description,
            icon: step.icon,
            status: step.status
          }))}
        />
      </div>

      {/* Detailed Timeline */}
      <div className="bg-white md:w-1/2 xs:w-full p-6 rounded-lg border">
        <h4 className="font-semibold mb-4">Detailed Timeline</h4>
        <Timeline
          items={[
            {
              dot: <CheckCircle size={16} className="text-green-500" />,
              children: (
                <div>
                  <p className="font-medium">Order Placed</p>
                  <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                </div>
              )
            },
            ...(currentStep >= 1 ? [{
              dot: <Package size={16} className="text-blue-500" />,
              children: (
                <div>
                  <p className="font-medium">Order Confirmed</p>
                  <p className="text-sm text-gray-600">Your order has been confirmed and is being prepared</p>
                </div>
              )
            }] : []),
            ...(currentStep >= 2 ? [{
              dot: <Package size={16} className="text-purple-500" />,
              children: (
                <div>
                  <p className="font-medium">Processing</p>
                  <p className="text-sm text-gray-600">Your items are being packed for shipment</p>
                </div>
              )
            }] : []),
            ...(currentStep >= 3 ? [{
              dot: <Truck size={16} className="text-orange-500" />,
              children: (
                <div>
                  <p className="font-medium">Shipped</p>
                  <p className="text-sm text-gray-600">Your order is on its way to you</p>
                </div>
              )
            }] : []),
            ...(currentStep >= 4 ? [{
              dot: <Home size={16} className="text-green-500" />,
              children: (
                <div>
                  <p className="font-medium">Delivered</p>
                  <p className="text-sm text-gray-600">Package delivered successfully</p>
                </div>
              )
            }] : [])
          ]}
        />
      </div>
      </div>

      {/* Shipping Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Shipping Information</h4>
        <div className="text-sm space-y-1">
          <p>
            <span className="font-medium">Address:</span> {order.shippingAddress.address}
          </p>
          <p>
            <span className="font-medium">City:</span> {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
          </p>
          <p>
            <span className="font-medium">Phone:</span> {order.shippingAddress.phone}
          </p>
        </div>
      </div>

      {order.status === 'shipped' && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Truck size={20} className="text-green-600" />
            <h4 className="font-semibold text-green-800">Out for Delivery</h4>
          </div>
          <p className="text-sm text-green-700">
            Your package is out for delivery and should arrive today. Please keep your phone handy for delivery updates.
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderTracker;