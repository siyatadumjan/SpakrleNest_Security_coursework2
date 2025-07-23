import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCartApi,
  initializeKhaltiPaymentApi,
  placeOrderApi,
  updateCartStatusApi,
} from "../../apis/Api";
import Navbar from '../../components/NavBar';
import './PlaceOrder.css';

const PlaceOrder = () => {
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const params = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    street: "",
    city: "",
    phone: "",
    deliveryFee: 5.0,
  });

  const fetchCart = async () => {
    try {
      const res = await getCartApi();
      if (res.status === 200 && res.data && res.data.products) {
        const cartItems = res.data.products
          .filter((item) => item.productId && item.productId.productName) // Filter out invalid products
          .map((item) => ({
            ...item,
            quantity: item.quantity,
          }));
        setCart(cartItems);
      }
    } catch (error) {
      console.error("Invalid cart data", error);
      toast.error("Invalid cart data.");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    const total = cart.reduce(
      (acc, item) => acc + item.productId.productPrice * item.quantity,
      0
    );
    setSubtotal(total);
  }, [cart]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateOrderData = () => {
    const { fullName, email, city, street, phone } = formData;
    if (!fullName || !email || !city || !street || !phone) {
      toast.error("Please fill all the fields.");
      return false;
    }
    if (
      !cart.length ||
      cart.some(
        (product) =>
          !product.productId || !product.productId._id || product.quantity <= 0
      )
    ) {
      toast.error("No products added to the order or invalid product data.");
      return false;
    }
    return true;
  };

  const handlePayment = async (orderId, totalPrice) => {
    try {
      const paymentResponse = await initializeKhaltiPaymentApi({
        orderId,
        totalPrice,
        website_url: window.location.origin,
      });

      if (paymentResponse.data.success) {
        const paymentUrl = paymentResponse.data.payment.payment_url;
        window.location.href = paymentUrl;
      } else {
        toast.error("Failed to initialize payment. Please try again.");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error(
        "Error processing payment: " +
        (error.response?.data?.message || error.message || "Unknown error")
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateOrderData()) return;

    const total = subtotal + formData.deliveryFee;
    const orderData = {
      carts: cart,
      totalPrice: total,
      name: formData.fullName,
      email: formData.email,
      street: formData.street,
      city: formData.city,
      phone: formData.phone,
      payment: false,
    };

    try {
      const response = await placeOrderApi(orderData);
      if (response.data.success) {
        toast.success(response.data.message);

        const orderId = response.data.order_id;
        if (orderId) {
          await handlePayment(orderId, total);
          await updateCartStatusApi();
        } else {
          toast.error(response.data.message);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(
        "Error placing order: " +
        (error.response?.data?.message || error.message || "Unknown error")
      );
    }
  };

  return (
    <>
      <Toaster />
      <Navbar className="navbar" />
      <div className="place-order-page">
        <div className="page-container">
          <div className="page-header">
            <h1 className="text-3xl font-bold text-red-600 mb-6">
              Place Your Order
            </h1>
          </div>
          <div className="page-content">
            <div className="delivery-info-container">
              <h2 className="delivery-info-title">
                Delivery Information
              </h2>
              <form onSubmit={handleSubmit} className="delivery-info-form space-y-4">
                {Object.entries(formData).map(
                  ([key, value]) =>
                    key !== "deliveryFee" && (
                      <div key={key}>
                        <label
                          htmlFor={key}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          {key.charAt(0).toUpperCase() +
                            key.slice(1).replace(/[A-Z]/g, " $&")}
                        </label>
                        <input
                          id={key}
                          type={key === "email" ? "email" : "text"}
                          name={key}
                          value={value}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    )
                )}
              </form>
            </div>
            <div className="order-summary-container">
              <h2 className="order-summary-title">
                Order Summary
              </h2>
              <div className="space-y-4">
                {cart.map((product, index) => (
                  <div
                    key={index}
                    className="order-summary-item"
                  >
                    <span className="text-gray-700">
                      {product.productId?.productName} x {product.quantity}
                    </span>
                    <span className="font-semibold text-red-600">
                      Rs {(
                        product.productId?.productPrice * product.quantity
                      ).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-300 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="font-semibold text-red-600">
                      Rs {subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-700">Delivery Fee</span>
                    <span className="font-semibold text-red-600">
                      Rs {formData.deliveryFee.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-300 pt-4">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span className="text-gray-800">Total</span>
                    <span className="text-red-600">
                      Rs {(subtotal + formData.deliveryFee).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                onClick={handleSubmit}
                className="place-order-button"
              >
                Place Order Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceOrder;
