import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, change, trend, icon }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 transition-all hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{value}</h3>
          <div className="flex items-center mt-2">
            {trend === 'up' ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {change}
            </span>
          </div>
        </div>
        <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/20">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;