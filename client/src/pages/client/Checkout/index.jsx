import React, { useState } from "react";
import {
  Layout,
  Form,
  Input,
  Button,
  Select,
  Divider,
  Radio,
  Card,
  message,
  Spin,
} from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { StoreUse, StripePaymentForm } from "../../../components";
import { ordersAPI } from "../../../utils/api";

const { Content } = Layout;
const { Option } = Select;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart, user } = StoreUse();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Calculate totals
  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 10.0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleSubmit = async (values) => {
    if (cart.length === 0) {
      message.error("Your cart is empty");
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        items: cart.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
          size: item.selectedSize || item.sizes[0],
          image: item.images[0],
        })),
        shippingAddress: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          address: values.address,
          apartment: values.apartment,
          city: values.city,
          state: values.state,
          zipCode: values.zipCode,
        },
        paymentMethod,
        subtotal,
        shipping,
        tax,
        total,
        status: "pending",
      };

      if (paymentMethod === "cod") {
        // For COD, create order directly
        const response = await ordersAPI.create(orderData);
        if (response.data) {
          clearCart();
          message.success("Order placed successfully!");
          navigate("/order-confirmation", {
            state: {
              orderId: response.data._id,
              orderData: response.data,
            },
          });
        }
      }
      // For card payment, the StripePaymentForm will handle the order creation
    } catch (error) {
      console.error("Order creation error:", error);
      message.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStripeSuccess = async (paymentIntent) => {
    try {
      const values = form.getFieldsValue();
      const orderData = {
        items: cart.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
          size: item.selectedSize || item.sizes[0],
          image: item.images[0],
        })),
        shippingAddress: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          address: values.address,
          apartment: values.apartment,
          city: values.city,
          state: values.state,
          zipCode: values.zipCode,
        },
        paymentMethod: "card",
        paymentIntentId: paymentIntent.id,
        subtotal,
        shipping,
        tax,
        total,
        status: "confirmed",
      };

      const response = await ordersAPI.create(orderData);
      if (response.data) {
        clearCart();
        message.success("Payment successful! Order placed.");
        navigate("/order-confirmation", {
          state: {
            orderId: response.data._id,
            orderData: response.data,
          },
        });
      }
    } catch (error) {
      console.error("Order creation after payment error:", error);
      message.error(
        "Payment succeeded but order creation failed. Please contact support."
      );
    }
  };

  const handleStripeError = (error) => {
    console.error("Stripe payment error:", error);
    message.error("Payment failed. Please try again.");
  };

  if (cart.length === 0) {
    return (
      <Layout className="min-h-screen bg-gray-50">
        <Content className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Add some items to your cart to proceed with checkout.
            </p>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/men/shirts")}
              className="bg-[#0F172A]"
            >
              Continue Shopping
            </Button>
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Content className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order</p>
        </div>

        <Button
          type="link"
          onClick={() => navigate(-1)}
          className="mb-3 pl-0 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} className="mr-1" />
          Go Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className="space-y-6"
              initialValues={{
                email: user?.email || "",
              }}
            >
              {/* Contact Information */}
              <Card title="Contact Information" className="shadow-sm">
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Please enter your email" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="phone"
                  label="Phone"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your phone number",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Card>

              {/* Shipping Address */}
              <Card title="Shipping Address" className="shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item
                    name="firstName"
                    label="First Name"
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="lastName"
                    label="Last Name"
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <Input />
                  </Form.Item>
                </div>
                <Form.Item
                  name="address"
                  label="Street Address"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="apartment"
                  label="Apartment, suite, etc. (optional)"
                >
                  <Input />
                </Form.Item>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Form.Item
                    name="city"
                    label="City"
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="state"
                    label="State"
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <Select
                      showSearch
                      placeholder="Select province"
                      className="state-select"
                    >
                      <Option value="Punjab">Punjab</Option>
                      <Option value="Sindh">Sindh</Option>
                      <Option value="Khyber Pakhtunkhwa">
                        Khyber Pakhtunkhwa
                      </Option>
                      <Option value="Balochistan">Balochistan</Option>
                      <Option value="Islamabad Capital Territory">
                        Islamabad Capital Territory
                      </Option>
                      <Option value="Gilgit-Baltistan">Gilgit-Baltistan</Option>
                      <Option value="Azad Jammu and Kashmir">
                        Azad Jammu and Kashmir
                      </Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="zipCode"
                    label="ZIP Code"
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <Input />
                  </Form.Item>
                </div>
              </Card>

              {/* Payment Method */}
              <Card title="Payment Method" className="shadow-sm">
                <Radio.Group
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full mb-4"
                >
                  <div className="space-y-4">
                    <Radio value="card" className="w-full">
                      <div className="flex justify-between items-center w-full">
                        <span>Credit/Debit Card</span>
                        <div className="flex gap-2">
                          <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                            VISA
                          </span>
                          <span className="text-xs bg-red-100 px-2 py-1 rounded">
                            MC
                          </span>
                        </div>
                      </div>
                    </Radio>
                    <Radio value="paypal" className="w-full">
                      <div className="flex justify-between items-center w-full">
                        <span>PayPal</span>
                        <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                          PayPal
                        </span>
                      </div>
                    </Radio>
                    <Radio value="cod" className="w-full">
                      <span>Cash on Delivery</span>
                    </Radio>
                  </div>
                </Radio.Group>

                {paymentMethod === "card" && (
                  <div className="mt-4">
                    <StripePaymentForm
                      amount={total}
                      onSuccess={handleStripeSuccess}
                      onError={handleStripeError}
                      loading={loading}
                    />
                  </div>
                )}

                {paymentMethod === "cod" && (
                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    loading={loading}
                    className="w-full bg-[#0F172A] hover:bg-[#1E293B] h-12 text-lg mt-4"
                  >
                    {loading
                      ? "Processing..."
                      : `Place Order - Rs: ${total.toFixed(2)}`}
                  </Button>
                )}
              </Card>
            </Form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card title="Order Summary" className="shadow-sm sticky top-4">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    <img
                      src={item.images[0] || "https://via.placeholder.com/150"} // Cloudinary URL already full
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />

                    <div className="flex-grow">
                      <h4 className="font-medium">{item.name}</h4>
                      <div className="text-sm text-gray-500">
                        Size: {item.selectedSize || item.sizes[0]} | Qty:{" "}
                        {item.quantity || 1}
                      </div>
                      <div className="font-medium">
                        Rs: {(item.price * (item.quantity || 1)).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}

                <Divider />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rs: {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? "Free" : `Rs: ${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>Rs: {tax.toFixed(2)}</span>
                  </div>
                  <Divider />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>Rs: {total.toFixed(2)}</span>
                  </div>
                </div>

                {subtotal > 100 && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-700 font-medium">
                      🎉 You qualify for free shipping!
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default CheckoutPage;
