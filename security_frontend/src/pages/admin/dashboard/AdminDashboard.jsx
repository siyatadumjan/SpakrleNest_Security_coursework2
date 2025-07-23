import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createProductApi, deleteProductApi, getAllProductsApi, getAllOrdersApi, isAuthenticated, clearAuthToken, getDashboardNotificationsApi } from '../../../apis/Api';
import './AdminDashboard.css'; // Import the CSS file


const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');

  const [productDescription, setProductDescription] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [productQuantity, setProductQuantity] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const navigate = useNavigate();
  const notificationRef = useRef(null);

  useEffect(() => {
    // Check if user is authenticated before fetching products
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to access this page');
      navigate('/login');
      return;
    }
    
    getAllProductsApi()
      .then((res) => {
        setProducts(res.data.products);
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again.');
          localStorage.removeItem('token');
          navigate('/login');
        }
      });
  }, [navigate]);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch notifications from backend data
  const fetchNotifications = async () => {
    setIsLoadingNotifications(true);
    try {
      const dashboardData = await getDashboardNotificationsApi();
      const generatedNotifications = generateNotificationsFromData(dashboardData);
      setNotifications(generatedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Fallback to empty notifications on error
      setNotifications([]);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  // Generate notifications from backend data
  const generateNotificationsFromData = (data) => {
    const notifications = [];
    let notificationId = 1;

    // Generate order notifications
    if (data.orders && data.orders.length > 0) {
      // Recent orders (last 5)
      const recentOrders = data.orders.slice(0, 5);
      recentOrders.forEach((order, index) => {
        const timeAgo = getTimeAgo(order.date);
        notifications.push({
          id: notificationId++,
          type: 'order',
          title: 'New Order Received',
          message: `Order from ${order.name || 'Customer'} - ₹${order.totalPrice}`,
          time: timeAgo,
          read: index > 2, // Mark first 3 as unread
          orderId: order._id
        });
      });
    }

    // Generate low stock notifications
    if (data.products && data.products.length > 0) {
      const lowStockProducts = data.products.filter(product => 
        product.productQuantity <= 5 && product.productQuantity > 0
      );
      
      lowStockProducts.forEach((product, index) => {
        notifications.push({
          id: notificationId++,
          type: 'product',
          title: 'Low Stock Alert',
          message: `${product.productName} - Only ${product.productQuantity} left`,
          time: getRandomTimeAgo(),
          read: index > 1, // Mark first 2 as unread
          productId: product._id
        });
      });

      // Out of stock notifications
      const outOfStockProducts = data.products.filter(product => 
        product.productQuantity === 0
      );
      
      outOfStockProducts.forEach((product, index) => {
        notifications.push({
          id: notificationId++,
          type: 'product',
          title: 'Out of Stock',
          message: `${product.productName} is out of stock`,
          time: getRandomTimeAgo(),
          read: false,
          productId: product._id
        });
      });
    }

    // If no real notifications, show a system message
    if (notifications.length === 0) {
      notifications.push({
        id: 1,
        type: 'system',
        title: 'System Ready',
        message: 'Dashboard is ready. Add products and receive orders to see notifications.',
        time: 'Just now',
        read: false
      });
    }

    // Sort by unread first, then by time
    return notifications.sort((a, b) => {
      if (a.read !== b.read) {
        return a.read - b.read; // Unread first
      }
      return 0; // Keep original order for same read status
    });
  };

  // Helper function to calculate time ago
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  // Helper function for random time ago (for products without specific timestamps)
  const getRandomTimeAgo = () => {
    const times = ['5 minutes ago', '15 minutes ago', '30 minutes ago', '1 hour ago', '2 hours ago', '3 hours ago'];
    return times[Math.floor(Math.random() * times.length)];
  };

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleImage = (event) => {
    const file = event.target.files[0];
    setProductImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !productName ||
      !productPrice ||
      !productCategory ||

      !productDescription ||
      !productImage ||
      !productQuantity
    ) {
      toast.warning("Please fill all the fields");
      return;
    }

    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('productPrice', productPrice);
    formData.append('productCategory', productCategory);

    formData.append('productDescription', productDescription);
    formData.append('productQuantity', productQuantity);
    formData.append('productImage', productImage);

    createProductApi(formData)
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          setShowForm(false);
          setProducts([res.data.data, ...products]);

          // Add notification for new product
          addNotification('product', 'Product Added', `${productName} has been successfully added to inventory`);

          // Clear the form
          setProductName('');
          setProductPrice('');
          setProductCategory('');
   
          setProductDescription('');
          setProductQuantity('');
          setProductImage(null);
          setPreviewImage('');
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400 || error.response.status === 500) {
            toast.warning(error.response.data.message);
          } else {
            toast.error('Something went wrong');
          }
        }
      });
  };

  const handleDelete = (id) => {
    const confirmDialog = window.confirm('Are you sure you want to delete this product?');
    if (confirmDialog) {
      deleteProductApi(id)
        .then((res) => {
          if (res.data.success) {
            toast.success(res.data.message);
            const deletedProduct = products.find(product => product._id === id);
            setProducts(products.filter(product => product._id !== id));
            
            // Add notification for deleted product
            if (deletedProduct) {
              addNotification('product', 'Product Deleted', `${deletedProduct.productName} has been removed from inventory`);
            }
          }
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 500) {
              toast.error(error.response.data.message);
            } else {
              toast.warning(error.response.data.message);
            }
          } else {
            toast.error('Something went wrong');
          }
        });
    }
  };
  const handleLogout = () => {
    // Clear user session or token here if needed
    navigate('/login'); // Redirect to login page
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const markAsRead = (notificationId) => {
    setNotifications(notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => 
      ({ ...notification, read: true })
    ));
  };

  const deleteNotification = (notificationId) => {
    setNotifications(notifications.filter(notification => 
      notification.id !== notificationId
    ));
  };

  const getUnreadCount = () => {
    return notifications.filter(notification => !notification.read).length;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order': return '📦';
      case 'product': return '⚠️';
      case 'user': return '👤';
      default: return '🔔';
    }
  };

  // Function to add a new notification (can be called when events occur)
  const addNotification = (type, title, message) => {
    const newNotification = {
      id: Date.now(),
      type,
      title,
      message,
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };



  return (
    <div>
      <nav className="premium-admin-navbar">
        <div className="navbar-container">
          <div className="admin-navbar-logo">
            <span className="logo-icon">✨</span>
            <span className="logo-text">SparkleNest</span>
            <span className="logo-badge">Admin</span>
          </div>
          <div className="navbar-center">
            <div className="navbar-search">
              <input 
                type="text" 
                placeholder="Search products, orders..." 
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>
          <div className="admin-navbar-right">
            <div 
              className="navbar-notifications" 
              onClick={handleNotificationClick}
              ref={notificationRef}
            >
              <span className="notification-icon">🔔</span>
              {getUnreadCount() > 0 && (
                <span className="notification-badge">{getUnreadCount()}</span>
              )}
              
              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notification-header">
                    <h4>Notifications</h4>
                    <button 
                      className="mark-all-read"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAllAsRead();
                      }}
                    >
                      Mark all as read
                    </button>
                    <button 
                      className="refresh-notifications"
                      onClick={(e) => {
                        e.stopPropagation();
                        fetchNotifications();
                      }}
                    >
                      🔄
                    </button>
                  </div>
                  
                  <div className="notification-list">
                    {isLoadingNotifications ? (
                      <div className="notification-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading notifications...</p>
                      </div>
                    ) : notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                        >
                          <div className="notification-content">
                            <span className="notification-type-icon">
                              {getNotificationIcon(notification.type)}
                            </span>
                            <div className="notification-text">
                              <h5>{notification.title}</h5>
                              <p>{notification.message}</p>
                              <span className="notification-time">{notification.time}</span>
                            </div>
                          </div>
                          <button 
                            className="delete-notification"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="no-notifications">
                        <span>📭</span>
                        <p>No notifications</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="navbar-profile">
              <img 
                src="/api/placeholder/32/32" 
                alt="Admin Profile" 
                className="profile-avatar"
              />
              <span className="profile-name">Admin</span>
            </div>
            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              <span className="logout-icon">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="admin-dashboard-container">
        <div className="admin-dashboard-sidebar">
          <div className="sidebar-logo">
            <h2>SparkleNest</h2>
          </div>
          <nav className="sidebar-nav">
            <button
              type="button"
              className="sidebar-nav-item"
              onClick={() => setShowForm(true)}
            >
              <span className="nav-icon">➕</span>
              Add Product
            </button>
          
            <Link to="/admin/view-order" className="sidebar-nav-item">
              <span className="nav-icon">📦</span>
              View Orders
            </Link>
            
            <Link to="/admin/activity-log" className="sidebar-nav-item">
              <span className="nav-icon">📊</span>
              Activity Log
            </Link>
          </nav>
        </div>
         


        <div className="admin-dashboard-main">
          <h3 className="admin-dashboard-title">Admin Dashboard</h3>

          <table className="admin-dashboard-table">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-3">Product Image</th>
                <th className="p-3">Product Name</th>
                <th className="p-3">Product Price</th>
                <th className="p-3">Product Category</th>
          
                <th className="p-3">Product Description</th>
                <th className="p-3">Product Quantity</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((singleProduct) => (
                <tr key={singleProduct._id} className="bg-white hover:bg-gray-100">
                  <td className="p-3">
                    <img
                      src={`https://localhost:5000/products/${singleProduct.productImage}`}
                      alt={singleProduct.productName}
                      onError={(e) => { e.target.src = '/path/to/placeholder-image.jpg'; }}
                      className="w-24 h-12 object-cover rounded-md"
                    />
                  </td>
                  <td className="p-3">{singleProduct.productName}</td>
                  <td className="p-3">{singleProduct.productPrice}</td>
                  <td className="p-3">{singleProduct.productCategory}</td>
          
                  <td className="p-3">{singleProduct.productDescription}</td>
                  <td className="p-3">{singleProduct.productQuantity}</td>
                  <td className="p-3">
                    <div className="action-cell">
                      <Link to={`/admin/update/${singleProduct._id}`} className="action-button">
                        <FontAwesomeIcon icon={faEdit} className="text-blue-500 hover:text-blue-700 cursor-pointer" />
                      </Link>
                      <button onClick={() => handleDelete(singleProduct._id)} className="action-button">
                        <FontAwesomeIcon icon={faTrash} className="text-red-500 hover:text-red-700 cursor-pointer" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title">Create a new product</h1>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit} className="modal-form">
                  <div className="modal-form-group">
                    <label>Product Name</label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="form-control"
                      placeholder="Enter Product Name"
                    />
                  </div>

                  <div className="modal-form-group">
                    <label>Product Price</label>
                    <input
                      type="number"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      className="form-control"
                      placeholder="Enter Product Price"
                    />
                  </div>

                  <div className="modal-form-group">
                    <label>Product Category</label>
                    <select
                      value={productCategory}
                      onChange={(e) => setProductCategory(e.target.value)}
                      className="form-control"
                    >
                      <option value="select-option">Select Options</option>
                      <option value="Anklets">Anklets</option>
                      <option value="Braclets">Braclets</option>
                      <option value="Earrings">Earrings</option>
                      <option value="Necklaces">Necklaces</option>
                      
                    </select>
                  </div>

                  
                  <div className="modal-form-group">
                    <label>Product Description</label>
                    <textarea
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                      className="form-control"
                      placeholder="Enter Description"
                    ></textarea>
                  </div>
                  <div className="modal-form-group">
                    <label>Product Quantity</label>
                    <input
                      type="number"
                      value={productQuantity}
                      onChange={(e) => setProductQuantity(e.target.value)}
                      className="form-control"
                      placeholder="Enter Product Quantity"
                    />
                  </div>

                  <div className="modal-form-group">
                    <label>Product Image</label>
                    <input
                      type="file"
                      onChange={handleImage}
                      className="form-control"
                    />
                    {previewImage && (
                      <img
                        src={previewImage}
                        alt="preview"
                        className="img-fluid rounded mt-2"
                      />
                    )}
                  </div>

                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary">
                      Create Product
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
