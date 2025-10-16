import React from 'react';
import ShirtCard from './ShirtCard';

const ShirtGrid = ({ productData, onClick }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6">
            {productData.map(data => (
                <ShirtCard key={data._id} products={data} onClick={onClick} />
            ))}
        </div>
    );
};

export default ShirtGrid;