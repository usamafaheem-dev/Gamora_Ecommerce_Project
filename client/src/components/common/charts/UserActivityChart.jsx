import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const UserActivityChart = ({ stats }) => {
  // Example: If you have daily user activity in stats, use it. Otherwise, fallback to static data.
  const data = stats && stats.userActivity ? stats.userActivity : [
    { day: 'Mon', active: 2400, new: 1200 },
    { day: 'Tue', active: 3000, new: 1300 },
    { day: 'Wed', active: 3500, new: 1000 },
    { day: 'Thu', active: 2800, new: 1400 },
    { day: 'Fri', active: 3200, new: 1800 },
    { day: 'Sat', active: 2900, new: 2000 },
    { day: 'Sun', active: 2500, new: 1700 },
  ];

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
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
            dataKey="day" 
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
          <Line 
            type="monotone" 
            dataKey="active" 
            name="Active Users"
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#FFFFFF' }}
            animationDuration={750}
          />
          <Line 
            type="monotone" 
            dataKey="new" 
            name="New Users"
            stroke="#10B981" 
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2, fill: '#FFFFFF' }}
            animationDuration={750}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserActivityChart;