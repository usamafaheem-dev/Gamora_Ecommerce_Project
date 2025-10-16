import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RevenueChart = ({ stats }) => {
  // Example: If you have monthly revenue in stats, use it. Otherwise, fallback to static data.
  const data = stats && stats.monthlyRevenue ? stats.monthlyRevenue : [
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 4500 },
    { month: 'Mar', revenue: 6000 },
    { month: 'Apr', revenue: 6500 },
    { month: 'May', revenue: 7000 },
    { month: 'Jun', revenue: 8500 },
    { month: 'Jul', revenue: 9800 },
    { month: 'Aug', revenue: 11000 },
    { month: 'Sep', revenue: 10500 },
    { month: 'Oct', revenue: 12000 },
    { month: 'Nov', revenue: 14000 },
    { month: 'Dec', revenue: 16000 },
  ];

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 5,
            left: 5,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12, fill: '#6B7280' }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#6B7280' }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={{ stroke: '#E5E7EB' }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#FFFFFF', 
              border: 'none', 
              borderRadius: '0.375rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              padding: '0.75rem'
            }}
            formatter={(value) => [`$${value}`, 'Revenue']}
          />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="#3B82F6" 
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
            activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#FFFFFF' }}
            animationDuration={750}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;