import React, { useEffect, useState } from 'react';
import { DollarSign, Users, ShoppingBag, TrendingUp } from 'lucide-react';
import StatsCard from '../../../components/StatsCard';
import { RevenueChart, SalesOverviewChart, TrafficSourcesChart, UserActivityChart } from '../../../components/common';
import { adminAPI } from '../../../utils/api';
import { Spin, Row, Col } from 'antd';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Real-time update every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardStats();
      setStats(response.data.data);
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return <div className="flex items-center justify-center min-h-64"><Spin size="large" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800  mb-6">Dashboard Overview</h2>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <StatsCard
              title="Total Revenue"
              value={`Rs: ${stats.totalRevenue?.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
              change={stats.completedAmount > 0 ? `+${((stats.completedAmount / stats.totalRevenue) * 100).toFixed(1)}%` : '+0%'}
              trend="up"
              icon={<DollarSign className="h-6 w-6 text-blue-500" />}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatsCard
              title="Completed Orders"
              value={`Rs: ${stats.completedAmount?.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
              change={stats.completedAmount > 0 ? '+100%' : '+0%'}
              trend="up"
              icon={<ShoppingBag className="h-6 w-6 text-purple-500" />}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatsCard
              title="Pending Amount"
              value={`Rs: ${stats.pendingAmount?.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
              change={stats.pendingAmount > 0 ? '+100%' : '+0%'}
              trend="down"
              icon={<TrendingUp className="h-6 w-6 text-orange-500" />}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatsCard
              title="Total Orders"
              value={stats.totalOrders}
              change={stats.successRate ? `+${stats.successRate.toFixed(1)}%` : '+0%'}
              trend={stats.successRate > 50 ? 'up' : 'down'}
              icon={<Users className="h-6 w-6 text-teal-500" />}
            />
          </Col>
        </Row>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white  rounded-lg shadow-sm p-6 transition-all hover:shadow-md">
          <h3 className="text-lg font-semibold text-black mb-4">Revenue Growth</h3>
          <RevenueChart stats={stats} />
        </div>
        <div className="bg-white  rounded-lg shadow-sm p-6 transition-all hover:shadow-md">
          <h3 className="text-lg font-semibold text-black mb-4">Sales Overview</h3>
          <SalesOverviewChart stats={stats} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white  rounded-lg shadow-sm p-6 transition-all hover:shadow-md">
          <h3 className="text-lg font-semibold text-black mb-4">Traffic Sources</h3>
          <TrafficSourcesChart stats={stats} />
        </div>
        <div className="bg-white  rounded-lg shadow-sm p-6 transition-all hover:shadow-md">
          <h3 className="text-lg font-semibold text-black mb-4">User Activity</h3>
          <UserActivityChart stats={stats} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
