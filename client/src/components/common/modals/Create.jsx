import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select, Upload, message, Row, Col } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
// import axios from 'axios';
import api from '../../../utils/api';

const { Option } = Select;
const { TextArea } = Input;

const BASE_URL = 'http://localhost:5000';

const CreateModal = ({ onCreate, onUpdate, editProduct, category }) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [fileList, setFileList] = useState([]);

  const subcategoryOptions = {
    Men: ['Shirts', 'Pants', 'Shoes'],
    Women: ['Shirts', 'Pants', 'Shoes'],
    Kids: ['T-Shirts', 'Shorts', 'Shoes'],
  };

  const showModal = () => {
    setIsModalOpen(true);
    setIsEditMode(false);
    form.resetFields();
    setFileList([]);
    form.setFieldsValue({ category });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setFileList([]);
  };

  useEffect(() => {
    if (editProduct) {
      setIsEditMode(true);
      const initialFileList = (editProduct.images || []).map((image, index) => {
        const imageUrl = image.startsWith('http') ? image : `${BASE_URL}${image}`;
        return {
          uid: `-${index}`,
          name: `image${index}.jpg`,
          status: 'done',
          url: imageUrl,
          thumbUrl: imageUrl,
          imageUrl: image, // Store original image URL for sending to backend
        };
      });

      form.setFieldsValue({
        ...editProduct,
        size: editProduct.sizes || [],
      });

      setFileList(initialFileList);
      setIsModalOpen(true);
    } else {
      form.resetFields();
      setFileList([]);
      setIsEditMode(false);
    }
  }, [editProduct, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();

      // Append form fields
      Object.keys(values).forEach(key => {
        const fieldName = key === 'size' ? 'sizes' : key;
        formData.append(fieldName, typeof values[key] === 'object' ? JSON.stringify(values[key]) : values[key]);
      });

      // Append existing images (those not removed)
      const existingImages = fileList
        .filter(file => !file.originFileObj) // Only include files without originFileObj (i.e., existing images)
        .map(file => file.imageUrl);
      formData.append('existingImages', JSON.stringify(existingImages));

      // Append new images
      fileList.forEach(file => {
        if (file.originFileObj) {
          formData.append('images', file.originFileObj);
        }
      });

      if (isEditMode) {
        const response = await api.put(`/products/${editProduct._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        onUpdate(response.data.product);
        toast.success('Product updated successfully');
      } else {
        const response = await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        onCreate(response.data.product);
        toast.success('Product created successfully');
      }

      handleCancel();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Please fill in all required fields');
    }
  };

  const uploadProps = {
    fileList,
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
    },
    onRemove: (file) => {
      setFileList(prev => prev.filter(item => item.uid !== file.uid));
      return true;
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return Upload.LOADING;
      }
      return false;
    },
    multiple: true,
    listType: 'picture-card',
  };

  return (
    <>
      <Button
        onClick={showModal}
        type="primary"
        icon={<PlusOutlined />}
        className="bg-[#0F172A] hover:bg-[#1E293B] px-8 py-5 rounded-xl border-0"
      >
        Add Product
      </Button>
      <Modal
        title={isEditMode ? 'Edit Product' : 'Add New Product'}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={1000}
        className="main-modal"
        centered
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          initialValues={{
            fitType: 'Wide leg',
            stretch: 'None',
            transparency: 'None',
            handFeel: 'Regular',
            lining: 'None',
            material: '100% Cotton',
            size: ['SMALL'],
            occasion: 'Formal Casual',
          }}
        >
          <div className="modal-scroll pe-2">
            <Row gutter={16}>
              <Col md={12} xs={24}>
                <Form.Item
                  name="name"
                  label="Product Name"
                  rules={[{ required: true, message: 'Please enter product name' }]}
                >
                  <Input placeholder="e.g., PARADISE EMBROIDERED PANTS" />
                </Form.Item>
              </Col>
              <Col md={12} xs={24}>
                <Form.Item
                  name="sku"
                  label="SKU"
                  rules={[{ required: true, message: 'Please enter SKU' }]}
                >
                  <Input placeholder="e.g., WAS25BT197-MED-GRY" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col md={12} xs={24}>
                <Form.Item
                  name="category"
                  label="Category"
                >
                  <Select placeholder="Select Category" disabled>
                    <Option value="Men">Men</Option>
                    <Option value="Women">Women</Option>
                    <Option value="Kids">Kids</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col md={12} xs={24}>
                <Form.Item
                  name="subcategory"
                  label="Subcategory"
                  rules={[{ required: true, message: 'Please select subcategory' }]}
                >
                  <Select placeholder="Select Subcategory">
                    {subcategoryOptions[category]?.map(subcat => (
                      <Option key={subcat} value={subcat}>{subcat}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col md={12} xs={24}>
                <Form.Item
                  name="price"
                  label="Regular Price"
                  rules={[{ required: true, message: 'Please enter price' }]}
                >
                  <Input prefix="Rs." type="number" placeholder="e.g., 4950.00" />
                </Form.Item>
              </Col>
              <Col md={12} xs={24}>
                <Form.Item
                  name="stock"
                  label="Stock"
                  rules={[{ required: !isEditMode, message: 'Please enter stock quantity' }]}
                >
                  <Input type="number" min={0} placeholder="e.g., 10" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col md={12} xs={24}>
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[{ required: true, message: 'Please enter description' }]}
                >
                  <TextArea
                    rows={2}
                    placeholder="e.g., High-quality product with premium features..."
                  />
                </Form.Item>
              </Col>
              <Col md={12} xs={24}>
                <Form.Item
                  name="images"
                  label="Images"
                  rules={[{ required: true, message: 'Please upload at least one image' }]}
                >
                  <Upload {...uploadProps}>
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col md={12} xs={24}>
                <Form.Item
                  name="size"
                  label="Size"
                  rules={[{ required: true, message: 'Please select size' }]}
                >
                  <Select mode="multiple" allowClear>
                    <Option value="SMALL">SMALL</Option>
                    <Option value="MEDIUM">MEDIUM</Option>
                    <Option value="LARGE">LARGE</Option>
                    <Option value="XL">XL</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col md={12} xs={24}>
                <Form.Item
                  name="occasion"
                  label="Occasion"
                  rules={[{ required: true, message: 'Please select occasion' }]}
                >
                  <Select allowClear>
                    <Option value="Formal Casual">Formal Casual</Option>
                    <Option value="Casual">Casual</Option>
                    <Option value="Formal">Formal</Option>
                    <Option value="Party">Party</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col md={12} xs={24}>
                <Form.Item
                  name="fitType"
                  label="Fit Type"
                  rules={[{ required: true, message: 'Please select fit type' }]}
                >
                  <Select allowClear>
                    <Option value="Wide leg">Wide leg</Option>
                    <Option value="Slim">Slim</Option>
                    <Option value="Regular">Regular</Option>
                    <Option value="Loose">Loose</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col md={12} xs={24}>
                <Form.Item
                  name="stretch"
                  label="Stretch"
                  rules={[{ required: true, message: 'Please select stretch' }]}
                >
                  <Select allowClear>
                    <Option value="None">None</Option>
                    <Option value="Low">Low</Option>
                    <Option value="Medium">Medium</Option>
                    <Option value="High">High</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col md={12} xs={24}>
                <Form.Item
                  name="transparency"
                  label="Transparency"
                  rules={[{ required: true, message: 'Please select transparency' }]}
                >
                  <Select allowClear>
                    <Option value="None">None</Option>
                    <Option value="Low">Low</Option>
                    <Option value="Medium">Medium</Option>
                    <Option value="High">High</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col md={12} xs={24}>
                <Form.Item
                  name="handFeel"
                  label="Hand Feel"
                  rules={[{ required: true, message: 'Please select hand feel' }]}
                >
                  <Select allowClear>
                    <Option value="Regular">Regular</Option>
                    <Option value="Soft">Soft</Option>
                    <Option value="Rough">Rough</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col md={12} xs={24}>
                <Form.Item
                  name="lining"
                  label="Lining"
                  rules={[{ required: true, message: 'Please select lining' }]}
                >
                  <Select allowClear>
                    <Option value="None">None</Option>
                    <Option value="Full">Full</Option>
                    <Option value="Partial">Partial</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col md={12} xs={24}>
                <Form.Item
                  name="material"
                  label="Material"
                  rules={[{ required: true, message: 'Please enter material' }]}
                >
                  <Input placeholder="e.g., 100% Cotton" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col md={12} xs={24}>
                <Form.Item
                  name="designDetails"
                  label="Design Details"
                  rules={[{ required: true, message: 'Please enter design details' }]}
                >
                  <TextArea
                    className="textarea"
                    rows={4}
                    placeholder="e.g., Embroidered wide-leg pants with a scalloped hem..."
                  />
                </Form.Item>
              </Col>
              <Col md={12} xs={24}>
                <Form.Item
                  name="note"
                  label="Note"
                  rules={[{ required: true, message: 'Please enter note' }]}
                >
                  <TextArea
                    className="textarea"
                    rows={2}
                    placeholder="e.g., The actual color of the product may vary slightly from the image."
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <Form.Item className="m-0">
            <div className="flex mt-2 gap-3">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-10 border-none text-base font-medium rounded-md bg-blue-500 hover:bg-blue-600"
              >
                {isEditMode ? 'Update' : 'Save'}
              </Button>
              <Button
                onClick={handleCancel}
                className="w-full h-10 border-none text-base !text-white font-medium rounded-md !bg-gray-500 hover:!bg-gray-600"
              >
                Cancel
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateModal;