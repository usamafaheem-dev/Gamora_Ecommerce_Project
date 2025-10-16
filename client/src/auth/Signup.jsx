import { Icon } from '@iconify/react/dist/iconify.js'
import { Button, Col, Input, Row, Spin } from 'antd'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import axios from 'axios'
import { toast } from 'react-toastify'

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  })

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: ""
  })

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) {
      newErrors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please provide a valid email address";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
      // Handle success with a proper success message
      const successMessage = response.data.message || 'Registration successful!';

      console.log(response.data.user);
      toast.success(successMessage)

      setFormData({
        name: "",
        email: "",
        password: ""
      });

      navigate('/auth/login');

    } catch (error) {
      console.log("error coming from backend:", error.response.data);
      const errorMessage = error.response.data.message || 'Backend error'
      toast.error(errorMessage)
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Row >
        <Col xs={24} md={12}>
          <div className="w-full h-[100vh] ">
            <img src="/assets/photo-161.jpg" alt="auth-img" className='size-full object-cover' />
          </div>
        </Col>
        <Col xs={24} md={12}>
          <div className="flex justify-center items-center bg-[#d6d6d6] flex-column h-[100vh]">
            <div className="border md:w-3/4 xxl:w-[60%]  p-6 bg-[#fff] rounded-2xl shadow-2xl">
              <div className="flex justify-center mb-6 text-[#29a9ee]  items-center gap-2">
                <h6 className="text-center text-2xl mb-0 font-bold ">Sign Up</h6>
                <div className="flex text-[32px]  items-center">
                  <Icon icon="simple-icons:authelia" />
                </div>
              </div>
              <form onSubmit={handleSubmit} >
                <div className="mb-6">
                  <h6 className="font-medium mb-1">Name</h6>
                  <input
                    type="text"
                    name="name"
                    placeholder="user name"
                    className="w-full px-3 py-2 rounded-xl border bg-[#2294ff0a] border-gray-300 focus:outline-none focus:border-blue-600"
                    onChange={handleInputChange}
                    value={formData.name}
                  />
                  {errors.name && <p className="error-text">{errors.name}</p>}
                </div>
                <div className="mb-6">
                  <h6 className="font-medium mb-1">Email</h6>
                  <input
                    type="email"
                    name="email"
                    placeholder="email address"
                    className="w-full px-3 py-2 rounded-xl border bg-[#2294ff0a] border-gray-300 focus:outline-none focus:border-blue-600"
                    onChange={handleInputChange}
                    value={formData.email}
                  />
                  {errors.email && <p className="error-text">{errors.email}</p>}
                </div>
                <div className="mb-6">
                  <h6 className="font-medium mb-1">Password</h6>
                  <Input.Password
                    name="password"
                    placeholder="password"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-[#2294ff0a] focus:outline-none focus:border-blue-600"
                    onChange={handleInputChange}
                    value={formData.password}
                  />
                  {errors.password && (
                    <p className="error-text">{errors.password}</p>
                  )}

                </div>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  className="w-full bg-[#0F172A] hover:!bg-[#1E293B] h-12 text-lg"
                  disabled={loading}
                >
                  {loading ? <Spin /> : "Sign Up"}
                </Button>
              </form>
              <p className="text-center text-sm text-gray-400 mt-4">
                Already have an account?{" "}
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

export default Signup
