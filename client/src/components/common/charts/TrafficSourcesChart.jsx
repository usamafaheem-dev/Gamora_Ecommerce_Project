import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#6B7280'];

const TrafficSourcesChart = ({ stats }) => {
  // Example: If you have traffic sources in stats, use it. Otherwise, fallback to static data.
  const data = stats && stats.trafficSources ? stats.trafficSources : [
    { name: 'Organic Search', value: 42 },
    { name: 'Direct', value: 28 },
    { name: 'Referral', value: 15 },
    { name: 'Social Media', value: 10 },
    { name: 'Other', value: 5 },
  ];

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            animationDuration={750}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value}%`, 'Traffic']}
            contentStyle={{ 
              backgroundColor: '#FFFFFF', 
              border: 'none', 
              borderRadius: '0.375rem',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
              padding: '0.75rem'
            }}
          />
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom" 
            align="center"
            iconType="circle"
            iconSize={10}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrafficSourcesChart;