import React, { useEffect, useState } from "react";
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
      <div className="activity-log-title">
        <h2>System Activity Logs</h2>
        <div className="total-entries">Total Entries: {logs.length}</div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>
                <div className="flex items-center space-x-2">
                  <FiUser className="icon" />
                  <span>User</span>
                </div>
              </th>
              <th>
                <div className="flex items-center space-x-2">
                  <FiGlobe className="icon" />
                  <span>URL</span>
                </div>
              </th>
              <th>
                <div className="flex items-center space-x-2">
                  <FiCommand className="icon" />
                  <span>Method</span>
                </div>
              </th>
              <th>Role</th>
              <th>Status</th>
              <th>
                <div className="flex items-center space-x-2">
                  <FiClock className="icon" />
                  <span>Time</span>
                </div>
              </th>
              <th>
                <div className="flex items-center space-x-2">
                  <FiCpu className="icon" />
                  <span>Device</span>
                </div>
              </th>
              <th>
                <div className="flex items-center space-x-2">
                  <FiServer className="icon" />
                  <span>IP Address</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <motion.tr
                key={log._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td>
                  <div className="flex items-center">
                    {/* <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-400 to-red-400 flex items-center justify-center text-white">
                      {log.username ? log.username[0].toUpperCase() : ""}
                    </div> */}
                    <div className="ml-3">
                      <div className="text-sm font-medium">{log.username || "Unknown"}</div>
                    </div>
                  </div>
                </td>

                <td>
                  <div className="text-sm text-gray-900 max-w-xs truncate">{log.url}</div>
                </td>
                <td>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMethodColor(log.method)}`}>
                    {log.method}
                  </span>
                </td>
                <td>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {log.role}
                  </span>
                </td>
                <td>
                  <div className={`flex items-center ${getStatusColor(log.status)}`}>
                    {log.status >= 200 && log.status < 300 ? (
                      <FiCheckCircle className="mr-1" />
                    ) : (
                      <FiAlertCircle className="mr-1" />
                    )}
                    {log.status}
                  </div>
                </td>
                <td className="time">{new Date(log.time).toLocaleString()}</td>
                <td className="device">{log.device}</td>
                <td className="ip-address">{log.ipAddress}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityLog;
