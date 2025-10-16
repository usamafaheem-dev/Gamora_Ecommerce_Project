import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SalesOverviewChart = ({ stats }) => {
  // Example: If you have monthly sales in stats, use it. Otherwise, fallback to static data.
  const data = stats && stats.monthlySales ? stats.monthlySales : [
    { name: 'Jan', target: 4000, actual: 4500 },
    { name: 'Feb', target: 5000, actual: 4800 },
    { name: 'Mar', target: 5500, actual: 6200 },
    { name: 'Apr', target: 6000, actual: 5800 },
    { name: 'May', target: 6500, actual: 7100 },
    { name: 'Jun', target: 7000, actual: 8500 },
  ];

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 5,
            left: 5,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12, fill: '#6B7280' }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#6B7280' }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={{ stroke: '#E5E7EB' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#FFFFFF', 
              border: 'none', 
              borderRadius: '0.375rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              padding: '0.75rem'
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '10px' }}
            iconType="circle"
          />
          <Bar 
            name="Target Sales" 
            dataKey="target" 
            fill="#94A3B8" 
            radius={[4, 4, 0, 0]} 
            barSize={20}
            animationDuration={750}
          />
          <Bar 
            name="Actual Sales" 
            dataKey="actual" 
            fill="#3B82F6" 
            radius={[4, 4, 0, 0]} 
            barSize={20}
            animationDuration={750}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesOverviewChart;