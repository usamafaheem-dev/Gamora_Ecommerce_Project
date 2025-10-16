import React from 'react';
import { Select, Divider } from 'antd';
import { ArrowDownUp } from 'lucide-react';

const { Option } = Select;

const SortOptions = ({ sortOption, setSortOption }) => {
  return (
    <div className="flex flex-col  justify-between  mb-4 px-1">
      
      
      <div className="flex items-center">
        <label className="mr-2 text-sm text-gray-700 font-medium">Sort by:</label>
        <Select
          value={sortOption}
          onChange={setSortOption}
          className="w-40"
          suffixIcon={<ArrowDownUp size={14} />}
        >
          <Option value="featured">Featured</Option>
          <Option value="newest">Newest</Option>
          <Option value="price-low">Price: Low to High</Option>
          <Option value="price-high">Price: High to Low</Option>
          <Option value="rating">Top Rated</Option>
        </Select>
      </div>
      
      <Divider className="my-4" />
    </div>
  );
};

export default SortOptions;