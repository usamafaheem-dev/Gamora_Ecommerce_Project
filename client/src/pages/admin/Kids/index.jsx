import React, { useState, useEffect } from 'react';
import { Table, Empty, Space, Tooltip, Popconfirm } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { CreateModal } from '../../../components/common';
import { toast } from 'react-toastify';

const Kids = () => {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
    console.log(products);
  }, [products]);

  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  }, []);

  const handleCreate = (productData) => {
    setProducts([...products, productData]);
  };

  const handleUpdate = (updatedProduct) => {
    setProducts(products.map(product =>
      product.id === updatedProduct.id ? updatedProduct : product
    ));
    setEditProduct(null);
  };

  const handleDelete = (id) => {
    setProducts(products.filter(product => product.id !== id));
    toast.success('Product deleted successfully');
  };

  const tshirtsData = products.filter(product => product.subcategory === 'T-Shirts' && product.category === 'Kids');
  const shortsData = products.filter(product => product.subcategory === 'Shorts' && product.category === 'Kids');

  const columns = [
    {
      title: 'Image',
      dataIndex: 'images',
      key: 'images',
      width: 160,
      className: "center-",
      render: (images) => (
        <div className=' w-14 h-14'>
          <img
            src={images[0] || 'img'}
            alt="product"
            className=' size-full rounded-md object-cover '
            onError={(e) => { e.target.src = 'img' }}
          />
        </div>
      ),
    },
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      className: "center-column",
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      width: 240,
      className: "center-column",
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 240,
      className: "center-column",
    },
    {
      title: 'Subcategory',
      dataIndex: 'subcategory',
      key: 'subcategory',
      width: 240,
      className: "center-column",
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 240,
      className: "center-column",
      render: (price) => `Rs.${Number(price).toFixed(2)}`,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 240,
      className: "center-column",
      render: (description) => (
        <div className=' flex flex-col text-center items-center h-full justify-center'>
          <Tooltip title={description} placement="topLeft">
            <div className="truncate">
              {description}
            </div>
          </Tooltip>
        </div>
      )
    },
    {
      title: 'Token',
      dataIndex: 'token',
      key: 'token',
      width: 200,
      className: "center-column",
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      className: "center-column",
      render: (_, record) => (
        <Space size="middle">
          <EyeOutlined className=' text-green-600 text-lg' />
          <EditOutlined
            onClick={() => setEditProduct(record)}
            className='text-blue-600 text-lg'
          />
          <Popconfirm
            title="Are you sure to delete this product?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.id)}
          >
            <DeleteOutlined className=' text-red-600 text-lg' />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between mb-8">
        <h2 className="text-3xl font-bold">Kids Products</h2>
        <CreateModal
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          editProduct={editProduct}
          category="Kids"
        />
      </div>
      {/* Kids T-Shirts Section */}
      <div>
        <h1 className="text-3xl font-bold my-8 text-center">Kids T-Shirts</h1>
      </div>
      {tshirtsData.length === 0 ? (
        <Empty description="No Kids T-Shirts Available" />
      ) : (
        <div className='product-table py-4'>
          <Table
            columns={columns}
            dataSource={tshirtsData}
            rowKey="id"
            pagination={{ pageSize: 4 }}
          />
        </div>
      )}

      {/* Kids Shorts Section */}
      <div>
        <h1 className="text-3xl font-bold my-8 text-center">Kids Shorts</h1>
      </div>
      {shortsData.length === 0 ? (
        <Empty description="No Kids Shorts Available" />
      ) : (
        <div className='product-table'>
          <Table
            columns={columns}
            dataSource={shortsData}
            rowKey="id"
            className="custom-table"
            rowClassName={() => "custom-row"}
            scroll={{ xs: "100%" }}
            pagination={{ pageSize: 4 }}
          />
        </div>
      )}
    </div>
  );
};

export default Kids;