import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchActivityLogsApi } from "../../../apis/Api";
import { toast } from "react-toastify";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiUser,
  FiGlobe,
  FiCommand,
  FiCpu,
  FiServer,
} from "react-icons/fi";
import { motion } from "framer-motion";
import './activityLog.css'; // Import the CSS file

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch activity logs when component mounts
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const fetchedLogs = await fetchActivityLogsApi();
        setLogs(fetchedLogs);
        setIsLoading(false);
      } catch (error) {
        toast.error("Failed to fetch activity logs");
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // Get the color for HTTP methods (GET, POST, PUT, DELETE)
  const getMethodColor = (method) => {
    const colors = {
      GET: "method-get",
      POST: "method-post",
      PUT: "method-put",
      DELETE: "method-delete",
    };
    return colors[method] || "method-get";
  };

  // Get the color for status (200-299 success, 400-499 error, else warning)
  const getStatusColor = (status) => {
    return status >= 200 && status < 300
      ? "status-success"
      : status >= 400
      ? "status-error"
      : "status-warning";
  };

  // Show loading spinner while data is being fetched
  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="activity-log-container">
      <div className="admin-navbar">
        <div className="navbar-left">
          <button className="back-button" onClick={() => navigate(-1)}>
            &larr;
          </button>
          <div className="admin-navbar-logo">✨ Activity Log Management</div>
        </div>
        <div className="navbar-right">
          <div className="navbar-profile">
            <div className="admin-avatar">
              <img 
                src="https://via.placeholder.com/32x32/4F46E5/ffffff?text=AD" 
                alt="Admin Profile" 
                className="profile-avatar"
                onError={(e) => {
                  e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiM0RjQ2RTUiLz4KPHRleHQgeD0iMTYiIHk9IjIxIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSI+QUQ8L3RleHQ+Cjwvc3ZnPgo=";
                }}
              />
              <div className="admin-status-badge"></div>
            </div>
            <span className="profile-name">Admin</span>
          </div>
        </div>
      </div>
      
      <div className="activity-log-title">
        <h2>System Activity Logs</h2>
        <div className="total-entries">Total Entries: {logs.length}</div>
      </div>

      <div className="table-container">
        <div className="table-grid">
          {/* Table Header */}
          <div className="table-header">
            <div className="table-header-cell">
              <div className="flex items-center space-x-2">
                <FiUser className="icon" />
                <span>User</span>
              </div>
            </div>
            <div className="table-header-cell">
              <div className="flex items-center space-x-2">
                <FiGlobe className="icon" />
                <span>URL</span>
              </div>
            </div>
            <div className="table-header-cell">
              <div className="flex items-center space-x-2">
                <FiCommand className="icon" />
                <span>Method</span>
              </div>
            </div>
            <div className="table-header-cell">Role</div>
            <div className="table-header-cell">Status</div>
            <div className="table-header-cell">
              <div className="flex items-center space-x-2">
                <FiClock className="icon" />
                <span>Time</span>
              </div>
            </div>
            <div className="table-header-cell">
              <div className="flex items-center space-x-2">
                <FiCpu className="icon" />
                <span>Device</span>
              </div>
            </div>
            <div className="table-header-cell">
              <div className="flex items-center space-x-2">
                <FiServer className="icon" />
                <span>IP Address</span>
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="table-body">
            {logs.map((log, index) => (
              <motion.div
                key={log._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="table-row"
              >
                <div className="table-cell" data-label="User">
                  <div className="flex items-center w-full">
                    <div className="ml-3 w-full">
                      <div className="text-sm font-medium truncate" title={log.username || "Unknown"}>
                        {log.username || "Unknown"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="table-cell" data-label="URL">
                  <div className="text-sm text-gray-900 w-full" title={log.url}>
                    <span className="break-all">{log.url}</span>
                  </div>
                </div>
                
                <div className="table-cell" data-label="Method">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMethodColor(log.method)}`}>
                    {log.method}
                  </span>
                </div>
                
                <div className="table-cell" data-label="Role">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {log.role}
                  </span>
                </div>
                
                <div className="table-cell" data-label="Status">
                  <div className={`flex items-center ${getStatusColor(log.status)}`}>
                    {log.status >= 200 && log.status < 300 ? (
                      <FiCheckCircle className="mr-1" />
                    ) : (
                      <FiAlertCircle className="mr-1" />
                    )}
                    {log.status}
                  </div>
                </div>
                
                <div className="table-cell" data-label="Time">{new Date(log.time).toLocaleString()}</div>
                
                <div className="table-cell" data-label="Device">{log.device}</div>
                
                <div className="table-cell" data-label="IP Address">{log.ipAddress}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
