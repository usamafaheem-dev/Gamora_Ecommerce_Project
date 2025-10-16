import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Modal, Form, Rate, Spin, message, Avatar } from 'antd';
import axios from 'axios';
import api from '../../../utils/api';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reply, setReply] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/reviews/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(res.data.reviews || []);
    } catch (e) {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleReply = (review) => {
    setSelectedReview(review);
    setReply(review.adminReply || '');
    setReplyModalOpen(true);
  };

  const handleReplySubmit = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await api.put(`/api/reviews/admin/${selectedReview._id}/reply`, {
        reply
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Reply sent!');
      setReplyModalOpen(false);
      setReply('');
      setSelectedReview(null);
      fetchReviews();
    } catch (e) {
      message.error(e.response?.data?.message || 'Failed to send reply');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: 'productId',
      key: 'productId',
      className:'center-column',
      render: (product) => (
        <div className="flex items-center gap-2">
          <Avatar src={product?.images?.[0] ? `http://localhost:5000${product.images[0]}` : undefined} />
          <span>{product?.name}</span>
        </div>
      )
    },
    {
      title: 'User',
      dataIndex: 'userId',
      key: 'userId',
      className:'center-column',
      render: (user) => (
        <div className="flex items-center gap-2">
          <Avatar src={user?.profileImage ? `http://localhost:5000${user.profileImage}` : undefined} />
          <span>{user?.firstName} {user?.lastName}</span>
        </div>
      )
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      className:'center-column',
      render: (rating) => <Rate disabled value={rating} />
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      className:'center-column',
    },
    {
      title: 'Admin Reply',
      dataIndex: 'adminReply',
      key: 'adminReply',
      className:'center-column',
      render: (reply) => reply ? <span className="text-blue-600">{reply}</span> : <span className="text-gray-400">No reply</span>
    },
    {
      title: 'Actions',
      key: 'actions',
      className:'center-column',
      render: (_, record) => (
        <Button type="link" onClick={() => handleReply(record)}>
          {record.adminReply ? 'Edit Reply' : 'Reply'}
        </Button>
      )
    }
  ];

  return (
    <div className="p-6 bg-white rounded-lg ">
      <h2 className="text-2xl font-bold mb-6">Product Reviews</h2>
      {loading ? (
        <div className="flex justify-center items-center min-h-64"><Spin size="large" /></div>
      ) : (
        <Table
          columns={columns}
          dataSource={reviews}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
        />
      )}
      <Modal
        title="Reply to Review"
        open={replyModalOpen}
        onCancel={() => setReplyModalOpen(false)}
        onOk={handleReplySubmit}
        confirmLoading={submitting}
        okText="Send Reply"
      >
        <Form layout="vertical">
          <Form.Item label="User Comment">
            <Input.TextArea value={selectedReview?.comment} readOnly rows={3} />
          </Form.Item>
          <Form.Item label="Your Reply">
            <Input.TextArea value={reply} onChange={e => setReply(e.target.value)} rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Reviews; 