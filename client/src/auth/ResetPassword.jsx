import { Icon } from '@iconify/react/dist/iconify.js'
import { Button, Col, Input, Row, Spin, message } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isValidToken, setIsValidToken] = useState(false);
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
    mismatch: ''
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { email, resetToken } = location.state || {};

  useEffect(() => {
    if (!email || !resetToken) {
      navigate('/auth/forgot');
    } else {
      setIsValidToken(true);
    }
  }, [email, resetToken, navigate]);

  const validateInputs = () => {
    const newErrors = {
      password: '',
      confirmPassword: '',
      mismatch: ''
    };
    let isValid = true;

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    }

    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.mismatch = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
        email,
        password,
        token: resetToken,
        confirmPassword
      });

      toast.success(response.data.message);
      navigate('/auth/login');

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to reset password';
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isValidToken) {
    return null;
  }

  return (
    <>
      <Row align={'middle'}>
        <Col xs={24} md={12}>
          <div className="w-full h-[100vh]">
            <img src="https://img.freepik.com/premium-photo/beautiful-girl-fashionable-clothes-sunglasses-goes-shopping_405651-229.jpg?w=740" alt="auth-img" className='size-full object-cover' />
          </div>
        </Col>
        <Col xs={24} md={12}>
          <div className="flex justify-center items-center bg-[#d6d6d6] flex-column h-[100vh]">
            <div className="border md:w-3/4 xxl:w-[60%] p-6 bg-[#fff] rounded-2xl shadow-2xl">
              <div className="flex justify-center mb-6 text-[#29a9ee] gap-2 items-center">
                <h6 className="text-center text-2xl mb-0 font-bold">Reset Password</h6>
                <div className="flex text-[32px] items-center">
                  <Icon icon="mdi:lock-reset" />
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <h6 className="font-medium mb-1">New Password</h6>
                  <Input.Password
                    placeholder="Enter new password"
                    className={`w-full px-3 py-2 rounded-xl border bg-[#2294ff0a] border-gray-300 focus:outline-none ${errors.password || errors.mismatch ? 'border-red-500' : 'focus:border-blue-600'
                      }`}
                    minLength={4}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      // Clear error when typing
                      if (errors.password) setErrors({ ...errors, password: '' });
                      if (errors.mismatch) setErrors({ ...errors, mismatch: '' });
                    }}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>
                <div className="mb-4">
                  <h6 className="font-medium mb-1">Confirm New Password</h6>
                  <Input.Password
                    placeholder="Confirm new password"
                    className={`w-full px-3 py-2 rounded-xl border bg-[#2294ff0a] border-gray-300 focus:outline-none ${errors.confirmPassword || errors.mismatch ? 'border-red-500' : 'focus:border-blue-600'
                      }`}
                    minLength={4}
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      // Clear error when typing
                      if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                      if (errors.mismatch) setErrors({ ...errors, mismatch: '' });
                    }}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                  {errors.mismatch && !errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.mismatch}</p>
                  )}
                </div>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  className="w-full bg-[#0F172A] hover:!bg-[#1E293B] h-12 text-lg"
                  disabled={loading}
                >
                  {loading ? <Spin /> : "Reset Password"}
                </Button>
              </form>
              <p className="text-center text-sm text-gray-400 mt-4">
                Remembered your password?{" "}
                <Link to="/auth/login" className="font-medium text-blue-600">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ResetPassword;