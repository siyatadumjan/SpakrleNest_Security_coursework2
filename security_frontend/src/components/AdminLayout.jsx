import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { getDashboardNotificationsApi } from '../apis/Api';
import './AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const notificationRef = useRef(null);

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
      const recentOrders = data.orders.slice(0, 5);
      recentOrders.forEach((order, index) => {
        const timeAgo = getTimeAgo(order.date);
        notifications.push({
          id: notificationId++,
          type: 'order',
          title: 'New Order Received',
          message: `Order from ${order.name || 'Customer'} - ₹${order.totalPrice}`,
          time: timeAgo,
          read: index > 2,
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
          read: index > 1,
          productId: product._id
        });
      });

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

    return notifications.sort((a, b) => {
      if (a.read !== b.read) {
        return a.read - b.read;
      }
      return 0;
    });
  };

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

  const getRandomTimeAgo = () => {
    const times = ['5 minutes ago', '15 minutes ago', '30 minutes ago', '1 hour ago', '2 hours ago', '3 hours ago'];
    return times[Math.floor(Math.random() * times.length)];
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleLogout = () => {
    navigate('/login');
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
                          className={`notification-item ${!notification.read ? 'unread' : ''}`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="notification-content">
                            <div className="notification-header-item">
                              <span className="notification-type-icon">
                                {getNotificationIcon(notification.type)}
                              </span>
                              <span className="notification-title">{notification.title}</span>
                              <button 
                                className="delete-notification"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                              >
                                ×
                              </button>
                            </div>
                            <p className="notification-message">{notification.message}</p>
                            <span className="notification-time">{notification.time}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-notifications">
                        <p>No notifications yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <button
              className="navbar-logout-btn"
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
            <Link to="/admin/dashboard" className="sidebar-nav-item">
              <span className="nav-icon">🏠</span>
              Dashboard
            </Link>
            
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
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
