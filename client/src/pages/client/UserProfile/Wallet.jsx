import React, { useState, useEffect } from 'react';
import { Card, Table, Spin, Empty, Typography } from 'antd';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { walletAPI } from '../../../utils/api';
import { toast } from 'react-toastify';

const { Title, Text } = Typography;

const UserWallet = () => {
    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWallet();
    }, []);

    const fetchWallet = async () => {
        try {
            setLoading(true);
            const response = await walletAPI.getUserWallet();
            setWallet(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch wallet data.');
            console.error('Fetch wallet error:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            className:'center-column',
            key: 'date',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            className:'center-column',
            key: 'type',
            render: (type) => (
                <span className={`capitalize font-semibold ${type === 'refund' ? 'text-green-600' : 'text-red-600'}`}>
                    {type}
                </span>
            ),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            className:'center-column',
            key: 'amount',
            render: (amount, record) => (
                <span className={`font-semibold ${record.type === 'refund' ? 'text-green-600' : 'text-red-600'}`}>
                    {record.type === 'refund' ? '+' : '-'} Rs: {amount.toFixed(2)}
                </span>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            className:'center-column',
            key: 'description',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            className:'center-column',
            key: 'status',
            render: (status) => (
                <span className="capitalize">{status}</span>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-7xl px-8 py-10 ">
            <Title level={2} className="flex items-center gap-2">
                <Wallet /> My Wallet
            </Title>
            <Card className='mb-4'>
                <div className="flex xs:flex-col justify-between items-center">
                    <Text className=' text-2xl !font-bold'>Current Balance</Text>
                    <Title level={3} className="!text-green-600">
                        Rs: {wallet?.balance.toFixed(2) || '0.00'}
                    </Title>
                </div>
            </Card>

            <Card title="Transaction History">
                <Table
                    columns={columns}
                    dataSource={wallet?.transactions || []}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                    locale={{ emptyText: <Empty description="No transactions yet." /> }}
                />
            </Card>
        </div>
    );
};

export default UserWallet; 