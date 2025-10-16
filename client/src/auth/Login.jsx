import { Button, Col, Input, Row, Spin } from 'antd';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Icon } from '@iconify/react/dist/iconify.js';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      toast.success(response.data.message);
      // console.log(response);
      // Redirect based on user role
      navigate(response.data.user.role === 'admin' ? '/admin' : '/');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error during login';
      toast.error(errorMessage);
      console.log(error.response.data)

    } finally {
      setLoading(false);
    }
  };

  return (
    <Row align="middle">
      <Col xs={24} md={12}>
        <div className="w-full h-[100vh]">
          <img
            src="https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="auth-img"
            className="size-full object-cover"
          />
        </div>
      </Col>
      <Col xs={24} md={12}>
        <div className="flex justify-center items-center bg-[#d6d6d6] flex-col h-[100vh]">
          <div className="border md:w-3/4 xxl:w-[60%] p-6 bg-[#fff] rounded-2xl shadow-2xl">
            <div className="flex justify-center mb-6 text-[#29a9ee] items-center gap-2">
              <h6 className="text-center text-2xl mb-0 font-bold">Log in</h6>
              <div className="flex text-[32px] items-center">
                <Icon icon="hugeicons:login-method" />
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <h6 className="font-medium mb-1">Email</h6>
                <Input
                  type="email"
                  name="email"
                  placeholder="email address"
                  className="w-full px-3 py-2 rounded-xl border bg-[#2294ff0a] border-gray-300 focus:outline-none focus:border-blue-600"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
              <div className="mb-6">
                <h6 className="font-medium mb-1">Password</h6>
                <Input.Password
                  name="password"
                  placeholder="password"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-[#2294ff0a] focus:outline-none focus:border-blue-600"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                className="w-full bg-[#0F172A] hover:!bg-[#1E293B] h-12 text-lg"
                disabled={loading}
              >
                {loading ? <Spin /> : 'Log in'}
              </Button>
            </form>
            <p className="text-center text-sm text-gray-400 mt-4">
              Don't have an account?{' '}
              <Link to="/auth/signup" className="font-medium text-blue-600">
                Signup
              </Link>
            </p>
            <div className="flex justify-center mt-4">
              <Link to="/auth/forgot" className="font-medium text-center text-blue-600">
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default Login;