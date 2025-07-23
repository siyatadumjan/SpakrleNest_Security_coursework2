import React, { useEffect, useRef, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { loginUserApi, loginOTPApi } from '../../apis/Api';
import loginui from '../../assets/images/loginui.jpeg';
import ReCAPTCHA from 'react-google-recaptcha';
import './Login.css';

// Utility function to sanitize input
const sanitizeInput = (input) => {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [lockoutMessage, setLockoutMessage] = useState('');
  const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState(0); // Track lockout time remaining
  const recaptchaRef = useRef(null);
  const navigate = useNavigate();

  const validation = () => {
    let isValid = true;

    if (!email.trim() || !email.includes('@')) {
      setEmailError('Email is empty or invalid');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password.trim()) {
      setPasswordError('Password is empty');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validation()) return;

    if (!captchaToken) {
      toast.error('CAPTCHA is missing or expired. Please complete it.');
      recaptchaRef.current?.reset();
      return;
    }

    loginUserApi({ email, password, recaptchaToken: captchaToken })
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          setIsOtpSent(true);
        } else {
          if (res.data.lockoutTime) {
            // Handle account lockout
            const remainingTime = Math.floor((new Date(res.data.lockoutTime) - new Date()) / 1000); // time in seconds
            if (remainingTime > 0) {
              setLockoutMessage(`Account locked. Try again in ${remainingTime} seconds.`);
              setLockoutTimeRemaining(remainingTime);
              setTimeout(() => {
                setLockoutMessage('');
                setLockoutTimeRemaining(0);
              }, remainingTime * 1000);
            } else {
              setLockoutMessage('');
              setLockoutTimeRemaining(0);
            }
          } else {
            toast.error(res.data.message);
          }
        }
      })
      .catch((err) => toast.error(err.response?.data?.message || 'Login failed.'));
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setOtpError('');  // Clear previous OTP error
  
    if (!otp.trim()) {
      setOtpError('OTP is required');
      return;
    }
  
    loginOTPApi({ email, otp })
      .then((res) => {
        if (res.data.success) {
          toast.success('OTP verified successfully!');
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.userData));
  
          navigate(res.data.userData.isAdmin ? '/admin/dashboard' : '/homepage');
        } else {
          setOtpError(res.data.message || 'OTP verification failed');
        }
      })
      .catch((err) => setOtpError(err.response?.data?.message || 'OTP verification failed.'));
  };
  

  return (
    <div className={`login-container ${isOtpSent ? 'blur-background' : ''}`}>
      <Toaster />
      <div className="login-box">
        <div className="login-form">
          <h2 className="login-title">Login</h2>
          <p className="login-subtitle">Please Login to Continue</p>
          {lockoutMessage && <p className="error-message">{lockoutMessage}</p>}
          <form onSubmit={handleLogin} className="login-fields">
            <div className="input-container">
              <input
                className="login-input"
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(sanitizeInput(e.target.value))}
                disabled={lockoutTimeRemaining > 0} // Disable input during lockout
              />
              {emailError && <p className="error-message">{emailError}</p>}
            </div>
            <div className="input-container">
              <input
                className="login-input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(sanitizeInput(e.target.value))}
                disabled={lockoutTimeRemaining > 0} // Disable input during lockout
              />
              {passwordError && <p className="error-message">{passwordError}</p>}
            </div>
            <div className="forgot-password-container">
              <Link to="/forgotpassword" className="forgot-password-link">
                Forgot Password?
              </Link>
            </div>
            <div className="flex justify-center bg-gray-800/50 p-4 rounded-xl backdrop-blur-sm">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6LfXFb4qAAAAALY5BEaLWfTEVPgCX9kVsSpP3z4c"
                onChange={setCaptchaToken}
                disabled={lockoutTimeRemaining > 0} // Disable CAPTCHA during lockout
              />
            </div>
            <button type="submit" disabled={!captchaToken || lockoutTimeRemaining > 0} className="login-button">
              Login
            </button>
          </form>
          <div className="login-link">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="text-black hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
        <div className="login-images">
          <div className="login-image">
            <img src={loginui} alt="Login" />
          </div>
        </div>
      </div>
      {isOtpSent && (
        <div className="otp-modal-container">
          <div className="otp-modal">
            <h2>Verify OTP</h2>
            <form onSubmit={handleOtpSubmit}>
              <div className="input-container">
                <input
                  className="login-input"
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(sanitizeInput(e.target.value))}
                />
                {otpError && <p className="error-message">{otpError}</p>}
              </div>
              <button type="submit" className="login-button">
                Verify OTP
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
