import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getAllOrdersApi, updateOrderStatusApi, isAuthenticated, clearAuthToken } from "../../../apis/Api";
import "./ViewOrder.css";

const ViewOrder = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated before fetching orders
    if (!isAuthenticated()) {
      toast.error('Please login to access this page');
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await getAllOrdersApi();
      if (res.data.success && res.data.orders) {
        setOrders(res.data.orders);
      } else {
        console.error("Error Fetching Orders");
        setError("No orders found or invalid response");
      }
    } catch (error) {
      console.error("Error Fetching Orders:", error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        clearAuthToken();
        navigate('/login');
      } else {
        setError("Error fetching orders. Please try again later.");
        toast.error("Failed to fetch orders");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4"
        role="alert"
      >
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  const formatAddress = (order) => {
    return `${order.street}, ${order.city},${order.phone}`;
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const statusHandler = async (e, orderId) => {
    e.preventDefault();
    const selectedStatus = e.target.value;

    const newStatus = { status: selectedStatus };

    try {
      const response = await updateOrderStatusApi(orderId, newStatus);
      if (response.status === 200) {
        if (response.data.success) {
          toast.success(response.data.message);

          // Update orders state to reflect the change in the UI
          const updatedOrders = orders.map((order) => {
            if (order._id === orderId) {
              return { ...order, status: selectedStatus };
            }
            return order;
          });
          setOrders(updatedOrders);
        } else {
          toast.error("Failed to update status: " + response.data.message);
        }
      } else {
        // Handle non-200 responses
        toast.error(
          `Failed to update status: ${response.data.message || "Unknown error"}`
        );
      }
    } catch (error) {
      if (error.response) {
        // Handle errors from backend
        toast.error(`Error updating status: ${error.response.data.message}`);
      } else {
        // Handle other errors like network errors
        toast.error("Error updating status: " + error.message);
      }
    }
  };

  return (
    <div>
      <div className="admin-navbar">
        <button className="back-button" onClick={() => navigate(-1)}>
          &larr;
        </button>
        <div className="admin-navbar-logo">COSMOCARE</div>
      </div>
      <div className="container">
        <h1 className="header">Order Management</h1>
        {orders.length > 0 ? (
          <div className="space-y-4 md:space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div
                  className="order-header"
                  onClick={() => toggleOrderExpansion(order._id)}
                >
                  <div>
                    <h2 className="order-title">Order #{order._id.slice(-6)}</h2>
                    <p className="order-user">Placed by: {order.userId}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="order-price">
                      Rs {order.totalPrice.toFixed(2)}
                    </span>
                    <svg
                      className={`expand-icon ${
                        expandedOrder === order._id ? "open" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="https://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                {expandedOrder === order._id && (
                  <div className="order-details">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-gray-700">
                          Order Details
                        </h3>
                        <div className="space-y-3">
                          {order.carts.map((product) => (
                            <div
                              key={product.productId._id}
                              className="product-item"
                            >
                              <img
                                src={`http://localhost:5000/products/${product.productId.productImage}`}
                                alt={product.productId.productName}
                                className="product-image"
                              />
                              <div className="product-details">
                                <p className="product-name">
                                  {product.productId.productName}
                                </p>
                                <p className="product-quantity">
                                  Quantity: {product.quantity}
                                </p>
                                <p className="product-price">
                                  Rs{" "}
                                  {product.productId.productPrice.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-gray-700">
                          Shipping Information
                        </h3>
                        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                          <p className="text-gray-700 mb-2">
                            <span className="font-semibold">Address:</span>
                            {formatAddress(order)}
                          </p>
                          <p className="text-gray-700">
                            <span className="font-semibold">Phone:</span>{" "}
                            {order.phone}
                          </p>
                        </div>
                        <div className="mt-4">
                          <label
                            htmlFor="status"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Order Status
                          </label>
                          <select
                            id="status"
                            value={order.status}
                            onChange={(e) => statusHandler(e, order._id)}
                            className="status-select"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-40 bg-gray-100 rounded-lg shadow-md">
            <p className="text-gray-500 text-lg">No orders found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewOrder;
