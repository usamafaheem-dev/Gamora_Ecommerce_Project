import React, { useState, useEffect } from 'react';
import { Table, Empty, Space, Tooltip, Popconfirm, Spin } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import axios from 'axios';
import { CreateModal, ViewModal } from '../../../components/common';

const Women = () => {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch {
      toast.error('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = (product) => {
    setProducts([...products, product]);
  };

  const handleUpdate = (updatedProduct) => {
    setProducts(products.map(product =>
      product._id === updatedProduct._id ? updatedProduct : product
    ));
    setEditProduct(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setProducts(products.filter(product => product._id !== id));
      toast.success('Product deleted successfully');
    } catch {
      toast.error('Error deleting product');
    }
  };

  const handleView = (product) => {
    setViewProduct(product);
  };

  const handleViewModalClose = () => {
    setViewProduct(null);
  };

  const shirtsData = products.filter(product => product.subcategory === 'Shirts' && product.category === 'Women');
  const pantsData = products.filter(product => product.subcategory === 'Pants' && product.category === 'Women');
  const shoesData = products.filter(product => product.subcategory === 'Shoes' && product.category === 'Women');

  const columns = [
    {
      title: 'Image',
      dataIndex: 'images',
      key: 'images',
      render: (images) => (
        <div className='w-14 h-14'>
          <img
            src={images && images[0] ? `http://localhost:5000${images[0]}` : 'https://via.placeholder.com/300'}
            alt="product"
            className='size-full rounded-md object-cover'
            onError={(e) => { e.target.src = 'https://via.placeholder.com/300' }}
          />
        </div>
      ),
    },
    {
      title: 'Id',
      dataIndex: '_id',
      key: '_id',
      width: 100,
      className: 'center-column',
      render: (id) => id.slice(-6),
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      className: 'center-column',
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      className: 'center-column',
      render: (stock) => stock || 'N/A',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      className: 'center-column',
    },
    {
      title: 'Subcategory',
      dataIndex: 'subcategory',
      key: 'subcategory',
      className: 'center-column',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      className: 'center-column',
      render: (price) => `Rs.${Number(price).toFixed(2)}`,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      className: 'center-column',
      render: (description) => (
        <div className='flex flex-col text-center items-center h-full justify-center'>
          <Tooltip title={description} placement="topLeft">
            <div className="truncate">{description}</div>
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Sizes',
      dataIndex: 'sizes',
      key: 'sizes',
      className: 'center-column',
      render: (sizes) => (sizes && sizes.length > 0 ? sizes.join(', ') : 'N/A'),
    },
    {
      title: 'Avg Rating',
      key: 'reviewAvg',
      className: 'center-column',
      render: (_, record) => (
        <span>
          {record.reviewCount > 0 ? (
            <>
              <div className="flex items-center justify-center">
                <span className="mr-1">{Number(record.reviewAvg).toFixed(1)}</span>
                <span role="img" aria-label="star" className='text-amber-500'>
                  <iconify-icon icon="mingcute:star-fill"></iconify-icon>
                </span>
              </div>
            </>
          ) : (
            <span className="text-gray-400">No reviews</span>
          )}
        </span>
      ),
    },
    {
      title: 'Reviews',
      key: 'reviewCount',
      className: 'center-column',
      render: (_, record) => (
        <span>{record.reviewCount}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      className: 'center-column',
      render: (_, record) => (
        <Space size="middle">
          <EyeOutlined
            className="text-green-600 text-lg"
            onClick={() => handleView(record)}
          />
          <EditOutlined
            onClick={() => setEditProduct(record)}
            className="text-blue-600 text-lg"
          />
          <Popconfirm
            title="Are you sure to delete this product?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record._id)}
          >
            <DeleteOutlined className="text-red-600 text-lg" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex xs:flex-col gap-3 justify-between mb-8">
        <h2 className="text-3xl font-bold">Women Products</h2>
        <CreateModal
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          editProduct={editProduct}
          category="Women"
        />
      </div>
      <div>
        <h1 className="text-3xl font-bold my-8 text-center">Women Shirts</h1>
      </div>
      {shirtsData.length === 0 ? (
        <Empty description="No Women Shirts Available" />
      ) : (
        <div className="product-table overflow-hidden bg-white p-4">
          <Table
            columns={columns}
            dataSource={shirtsData}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
            className="overflow-x-auto"
            scroll={{ x: 'max-content' }}
          />
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold my-8 text-center">Women Pants</h1>
      </div>
      {pantsData.length === 0 ? (
        <Empty description="No Women Pants Available" />
      ) : (
        <div className="product-table overflow-hidden bg-white p-4">
          <Table
            columns={columns}
            dataSource={pantsData}
            rowKey="_id"
            className="customs-table overflow-x-auto"
            rowClassName={() => "custom-row"}
            pagination={{ pageSize: 5 }}
            scroll={{ x: 'max-content' }}
          />
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold my-8 text-center">Women Shoes</h1>
      </div>
      {shoesData.length === 0 ? (
        <Empty description="No Women Shoes Available" />
      ) : (
        <div className="product-table overflow-hidden bg-white p-4">
          <Table
            columns={columns}
            dataSource={shoesData}
            rowKey="_id"
            className="customs-table overflow-x-auto"
            rowClassName={() => "custom-row"}
            pagination={{ pageSize: 5 }}
            scroll={{ x: 'max-content' }}
          />
        </div>
      )}
      <ViewModal
        visible={!!viewProduct}
        product={viewProduct}
        onCancel={handleViewModalClose}
      />
    </div>
  );
};

export default Women;