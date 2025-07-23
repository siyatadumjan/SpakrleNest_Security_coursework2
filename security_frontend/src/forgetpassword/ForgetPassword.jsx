import React, { useState } from "react";
import {
  Mail,
  Lock,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  Shield,
  RefreshCw,
} from "lucide-react";
import bcrypt from "bcryptjs";
import {
  forgotPasswordApi,
  getPasswordHistoryApi,
  verifyOtpApi,
} from "../apis/Api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // Importing useNavigate for navigation
import "./ForgetPassword.css";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [password, setNewPassword] = useState("");
  const [passwordHistory, setPasswordHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); // Initialize navigate hook

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await forgotPasswordApi({ email });
      if (res.status === 200) {
        toast.success(res.data.message);
        setIsSent(true);
        const historyRes = await getPasswordHistoryApi({ email });
        if (historyRes.status === 200) {
          setPasswordHistory(historyRes.data.passwordHistory);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP.");
    }
    setIsLoading(false);
  };

  const validateNewPassword = async (password) => {
    // Loop through password history and check if the password has been reused
    for (const oldPasswordHash of passwordHistory) {
      console.log('Comparing:', password, 'with:', oldPasswordHash); // Debugging line
      const isPasswordReused = await bcrypt.compare(password, oldPasswordHash);
      if (isPasswordReused) {
        console.log('Password reused detected');
       // Debugging line
        return false;
         // Password is reused, return false
      }
    }
    return true; // Password is valid (not reused)
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    // Validate if the new password is not reused
    const isValidPassword = await validateNewPassword(password);
    if (!isValidPassword) {
      toast.error(); // Toast error first
      setIsLoading(false); // Stop loading before returning
      return; // Return early to prevent further execution
    }
  
    try {
      const res = await verifyOtpApi({ email, otp, password });
      if (res.status === 200) {
        toast.success("Password reset successfully");
        setEmail("");
        setOtp("");
        setNewPassword("");
        setPasswordHistory([]);
  
        // Navigate to login page after successful reset
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    }
    setIsLoading(false);
  };
  
  return (
    <div className="forget-password-container">
      <div className="forget-password-box">
        {/* Image Side - Left Side */}
        <div className="forget-password-image-side">
          <div className="forget-password-image-content">
            {/* Just the image background, no text overlay */}
          </div>
        </div>
        
        <div className="forget-password-form">
          <div className="forget-password-header">
            <Shield className="forget-password-icon" />
            <h1 className="forget-password-title">Password Reset</h1>
          </div>
          <h2 className="forget-password-subtitle">
            {!isSent ? "Request Reset Code" : "Enter Reset Details"}
          </h2>
          
          {/* Small descriptive text within the form */}
          <div className="forget-password-description">
            <p>
              Reset your password securely with our two-step verification process. 
              We'll send a verification code to your email to ensure your account stays protected.
            </p>
          </div>

          <div className="forget-password-fields">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', zIndex: 10}} />
              <input
                id="email"
                type="email"
                className="forget-password-input"
                placeholder="name@example.com"
                disabled={isSent}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {!isSent ? (
              <button
                className="forget-password-button"
                onClick={handleSendOtp}
                disabled={isLoading}
              >
                {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <ArrowRight className="w-4 h-4 mr-2" />}
                Send Reset Code
              </button>
            ) : (
              <>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', zIndex: 10}} />
                  <input
                    id="otp"
                    type="number"
                    className="forget-password-input"
                    placeholder="Enter 6-digit code"
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', zIndex: 10}} />
                  <input
                    id="new-password"
                    type="password"
                    className="forget-password-input"
                    placeholder="Enter new password"
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <button
                  className="forget-password-button"
                  onClick={handleVerifyOtp}
                  disabled={isLoading}
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                  Reset Password
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
