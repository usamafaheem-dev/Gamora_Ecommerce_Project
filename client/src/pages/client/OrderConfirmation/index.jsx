import React, { useEffect, useState } from 'react';
import { Layout, Result, Button, Card, Divider, Steps, Empty } from 'antd';
import { CheckCircle, Package, Truck, Home, Eye } from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';

const { Content } = Layout;

const OrderConfirmationPage = () => {
    const location = useLocation();
    const [orderData, setOrderData] = useState(null);
    const orderNumber = Math.floor(100000 + Math.random() * 900000);

    useEffect(() => {
        if (location.state?.orderData) {
            setOrderData(location.state.orderData);
        }
    }, [location.state]);

   

    if (!orderData) {
        return (
            <Layout className="min-h-screen bg-gray-50">
                <Content className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
                    <Result
                        status="success"
                        title="Order Placed Successfully!"
                        subTitle="Your order has been received and is being processed. You'll receive a confirmation email shortly."
                        extra={[
                            <Link to="/men/shirts" key="continue">
                                <Button type="primary" className="bg-[#0F172A] hover:bg-[#1E293B] mr-4">
                                    Continue Shopping
                                </Button>
                            </Link>,
                            <Link to="/" key="home">
                                <Button>Back to Home</Button>
                            </Link>
                        ]}
                    />
                </Content>
            </Layout>
        );
    }

    return (
        <Layout className="min-h-screen bg-gray-50">
            <Content className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
                <Result
                    icon={<CheckCircle className="text-green-500" size={64} />}
                    title="Order Placed Successfully!"
                    subTitle={`Order number: #${orderData.orderNumber || orderNumber}`}
                    extra={[
                        <Link to="/men/shirts" key="continue">
                            <Button type="primary" className="bg-[#0F172A] hover:bg-[#1E293B] mr-4">
                                Continue Shopping
                            </Button>
                        </Link>,
                        <Link to="/my-orders" key="orders">
                            <Button icon={<Eye size={16} />}>
                                View All Orders
                            </Button>
                        </Link>,
                        <Link to="/" key="home">
                            <Button>Back to Home</Button>
                        </Link>
                    ]}
                />

                
            </Content>
        </Layout>
    );
};

export default OrderConfirmationPage;