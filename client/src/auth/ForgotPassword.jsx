import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, Col, Row, Spin } from "antd";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import api from "../utils/api";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/forgot-password", { email });
      toast.success(response.data.message);
      setEmailSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Row align={"middle"}>
        <Col xs={24} md={12}>
          <div className="w-full h-[100vh]">
            <img
              src="https://images.unsplash.com/photo-1656523267493-31b9b2cfdc47?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="auth-img"
              className="size-full object-cover"
            />
          </div>
        </Col>
        <Col xs={24} md={12}>
          <div className="flex justify-center items-center bg-[#d6d6d6] flex-column h-[100vh]">
            <div className="border md:w-3/4 xxl:w-[60%] p-6 bg-[#fff] rounded-2xl shadow-2xl">
              <div className="flex justify-center mb-6 text-[#29a9ee] items-center gap-2">
                <h6 className="text-center text-2xl mb-0 font-bold">Forgot Password</h6>
                <div className="flex text-[32px] items-center">
                  <Icon icon="hugeicons:forgot-password" />
                </div>
              </div>
              {!emailSent ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <h6 className="font-medium mb-1">Email</h6>
                    <input
                      type="email"
                      name="email"
                      placeholder="email address"
                      className="w-full px-3 py-2 rounded-xl border bg-[#2294ff0a] border-gray-300 focus:outline-none focus:border-blue-600"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    className="w-full bg-[#0F172A] hover:!bg-[#1E293B] h-12 text-lg"
                    disabled={loading}
                  >
                    {loading ? <Spin /> : "Send OTP"}
                  </Button>
                </form>
              ) : (
                <div className="text-center">
                  <p className="mb-4 text-[16px]">
                    OTP has been sent to your <span className="font-semibold text-blue-600">{email}</span>
                  </p>
                  <Button
                    type="primary"
                    onClick={() => navigate("/auth/otp", { state: { email } })}
                    className="text-base rounded-xl font-medium w-full h-10 bg-[#FF6F61] text-white"
                  >
                    Verify OTP
                  </Button>
                </div>
              )}
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

export default ForgotPassword;