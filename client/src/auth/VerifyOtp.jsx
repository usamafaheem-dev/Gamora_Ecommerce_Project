import { Icon } from '@iconify/react/dist/iconify.js'
import { Button, Col, Input, Row, Spin, message } from "antd";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
const { OTP } = Input;

const VerifyOtp = () => {
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email || '';


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate OTP input
    if (!otp || otp.length !== 4) {
      message.error('Please enter a complete 4-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-otp', {
        email,
        otp
      });

      message.success('OTP verified successfully!');
      navigate('/auth/reset', {
        state: {
          email,
          resetToken: response.data.data.resetToken
        }
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
        error.message ||
        'Failed to verify OTP';
      message.error(errorMessage);
      setOtp(""); // Clear the OTP field on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Row align={'middle'} >
        <Col xs={24} md={12}>
          <div className="w-full h-[100vh] ">
            <img src="https://images.unsplash.com/photo-1675881149252-a2e3d0e57e0f?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="auth-img" className='size-full object-cover' />
          </div>
        </Col>
        <Col xs={24} md={12}>
          <div className="flex justify-center items-center bg-[#d6d6d6] flex-column h-[100vh]">

            <div className="border md:w-3/4 xxl:w-[60%] p-6 bg-[#fff] rounded-2xl shadow-2xl">
              <div className="flex justify-center mb-6 text-[#29a9ee]  items-center ">
                <h6 className="text-center text-2xl mb-0 font-bold ">Verify OTP</h6>
                <div className="flex text-[32px]  items-center">
                  <Icon icon="bitcoin-icons:verify-filled" />
                </div>
              </div>

              <form onSubmit={handleSubmit}>

                <div className="flex items-center mb-6 justify-center">
                  <OTP
                    length={4}
                    inputType="number"
                    formatter={(str) => str.toUpperCase()}
                    value={otp}
                    onChange={setOtp}
                  />
                </div>

                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  className="w-full bg-[#0F172A] hover:!bg-[#1E293B] h-12 text-lg"
                  disabled={loading}
                >
                  {loading ? <Spin size="small" /> : 'Verify OTP'}
                </Button>
              </form>
              <p className="text-center text-sm text-gray-400 mt-4">
                Didn’t receive the OTP?{" "}
                <Link to="/auth/forgot" className="font-medium text-blue-600">
                  Resend OTP
                </Link>
              </p>

              <p className="text-center text-sm text-gray-400 mt-2">
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
  )
}
export default VerifyOtp



