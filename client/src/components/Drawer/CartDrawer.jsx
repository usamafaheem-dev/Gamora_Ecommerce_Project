import React, { useEffect, useState } from "react";
import { Drawer, Button, InputNumber, message } from "antd";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StoreUse from "../Store/StoreUse";
import { toast } from "react-toastify";
import axios from "axios";
import api from "../../utils/api";

const CartDrawer = () => {
  const navigate = useNavigate();
  const {
    cart,
    isCartOpen,
    setCartOpen,
    removeFromCart,
    updateQuantity,
    getCartTotal,
  } = StoreUse();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setIsAdmin(response.data.profile?.role === "admin");
      } catch {
        setIsAdmin(false);
      }
    };
    fetchProfile();
  }, []);

  if (isAdmin) return null;

  const total = getCartTotal();

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.warning("Your cart is empty");
      return;
    }
    setCartOpen(false);
    navigate("/checkout");
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  return (
    <Drawer
      title={
        <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <ShoppingBag size={22} className="text-pink-500" /> Shopping Cart
        </div>
      }
      placement="right"
      onClose={() => setCartOpen(false)}
      open={isCartOpen}
      width={400}
    >
      <div className="flex flex-col h-full">
        {/* Cart Items */}
        <div className="flex-grow overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <ShoppingBag size={50} className="text-gray-400 mb-4" />
              <p className="text-lg">Your cart is empty</p>
              <Button
                type="link"
                className="mt-2 text-pink-500 font-medium"
                onClick={() => setCartOpen(false)}
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 border-b pb-4 hover:bg-gray-50 rounded-lg transition-all duration-300 p-2"
                >
                  <img
                    src={
                      item.images[0].startsWith("http")
                        ? item.images[0]
                        : `http://localhost:5000${item.images[0]}`
                    }
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />

                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800 leading-tight">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Size: {item.selectedSize || item.sizes[0]} |{" "}
                        <span className="capitalize">{item.material}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        size="small"
                        icon={<Minus size={14} />}
                        onClick={() =>
                          updateQuantity(item._id, (item.quantity || 1) - 1)
                        }
                      />
                      <InputNumber
                        min={1}
                        value={item.quantity || 1}
                        onChange={(value) => updateQuantity(item._id, value)}
                        className="w-16"
                      />
                      <Button
                        size="small"
                        icon={<Plus size={14} />}
                        onClick={() =>
                          updateQuantity(item._id, (item.quantity || 1) + 1)
                        }
                      />
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end">
                    <Button
                      type="text"
                      icon={<Trash2 size={18} />}
                      onClick={() => handleRemoveItem(item._id)}
                      className="text-gray-400 hover:text-red-500"
                    />
                    <p className="text-sm font-semibold text-pink-500">
                      Rs: {item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Checkout Section */}
        {cart.length > 0 && (
          <div className="py-5 border-t mt-4">
            <div className="flex justify-between mb-4 text-lg font-semibold">
              <span>Total:</span>
              <span className="text-pink-500">Rs: {total.toFixed(2)}</span>
            </div>
            <Button
              type="primary"
              block
              className="bg-pink-400 hover:bg-pink-600 text-white font-medium py-5"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default CartDrawer;
