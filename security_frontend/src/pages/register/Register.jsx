import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { registerUserApi, verifyRegisterOtpApi } from '../../apis/Api';
import registerui from '../../assets/images/login.webp';
import zxcvbn from 'zxcvbn'; // Import zxcvbn for password strength checking
import './Register.css';

function Register() {
  const [userName, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [otp, setOtp] = useState(''); // State for OTP input
  const [isOtpSent, setIsOtpSent] = useState(false); // Track OTP sent status
  
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [otpError, setOtpError] = useState(''); // Error for OTP input

  const [passwordStrength, setPasswordStrength] = useState('');  // Strength score
  const [passwordStrengthLabel, setPasswordStrengthLabel] = useState(''); // Strength label
  const [isTypingPassword, setIsTypingPassword] = useState(false);  // Check if the user is typing

  const navigate = useNavigate();

  const sanitizeInput = (input) => {
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
  };

  const validateForm = () => {
    let isValid = true;
  
    // Validate userName
    if (!userName.trim()) {
      setUsernameError('Username is required');
      isValid = false;
    } else {
      setUsernameError('');
    }
  
    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else {
      setEmailError('');
    }
  
    // Validate phone
    if (!phone.trim()) {
      setPhoneError('Phone number is required');
      isValid = false;
    } else {
      setPhoneError('');
    }
  
    // Validate password
    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else {
      // Regex for password validation: at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
      const passwordValidationRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordValidationRegex.test(password)) {
        toast.error('Password must be at least 8 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character');
        setPasswordError('Password format is incorrect');
        isValid = false;
      } else {
        setPasswordError('');
      }
    }
  
    // Validate confirm password
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Confirm Password is required');
      isValid = false;
    } else if (password.trim() !== confirmPassword.trim()) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }
  
    return isValid;
  };
  

  const checkPasswordStrength = (password) => {
    const result = zxcvbn(password);
    setPasswordStrength(result.score);  // 0 to 4 score
    if (result.score === 0) {
      setPasswordStrengthLabel('Low');
    } else if (result.score === 1 || result.score === 2) {
      setPasswordStrengthLabel('Medium');
    } else {
      setPasswordStrengthLabel('High');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const data = {
      userName: userName,
      email: email,
      password: password,
      phone: phone
    };

    registerUserApi(data)
      .then((response) => {
        toast.success('Registration successful! Please verify your email.');
        setIsOtpSent(true); // OTP sent after successful registration
        setOtp(''); // Reset OTP field when switching to OTP form
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Registration failed. Please try again.');
        }
      });
  };

  const handleOtpVerification = (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      setOtpError('OTP is required');
      return;
    }

    const data = {
      email: email,
      otp: otp
    };

    verifyRegisterOtpApi(data)
      .then((response) => {
        toast.success('Email verified successfully!');
        navigate('/homepage'); // Redirect to login after successful verification
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          setOtpError(error.response.data.message);
        } else {
          setOtpError('Verification failed. Please try again.');
        }
      });
  };

  return (
    <div className="register-container">
      <Toaster />
      <div className="register-box">
        <div className="register-form">
          <h2 className="register-title">Sign Up</h2>

          {/* Registration Form */}
          {!isOtpSent ? (
            <form onSubmit={handleSubmit} className="register-fields">
              <div className="input-container">
                <input
                  className="register-input"
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={userName}
                  onChange={(e) => setUsername(sanitizeInput(e.target.value))}
                />
                {usernameError && <p className="error-message">{usernameError}</p>}
              </div>
              <div className="input-container">
                <input
                  className="register-input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(sanitizeInput(e.target.value))}
                />
                {emailError && <p className="error-message">{emailError}</p>}
              </div>
              <div className="input-container">
                <input
                  className="register-input"
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(sanitizeInput(e.target.value))}
                />
                {phoneError && <p className="error-message">{phoneError}</p>}
              </div>
              <div className="input-container">
                <input
                  className="register-input"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(sanitizeInput(e.target.value));
                    setIsTypingPassword(true); // User starts typing password
                    checkPasswordStrength(e.target.value);  // Check password strength on change
                  }}
                />
                {isTypingPassword && (
                  <p className={`password-strength ${passwordStrengthLabel.toLowerCase()}`}>
                    Password Strength: {passwordStrengthLabel}
                  </p>
                )}
                {passwordError && <p className="error-message">{passwordError}</p>}
              </div>
              <div className="input-container">
                <input
                  className="register-input"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(sanitizeInput(e.target.value))}
                />
                {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}
              </div>
              <button type="submit" className="register-button">Sign Up</button>
            </form>
          ) : (
            // OTP Verification Form
            <form onSubmit={handleOtpVerification} className="otp-verification">
              <div className="input-container">
                <input
                  className="register-input"
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                {otpError && <p className="error-message">{otpError}</p>}
              </div>
              <button type="submit" className="register-button">Verify OTP</button>
            </form>
          )}

          <div className="login-link">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-black hover:underline">Login</Link>
            </p>
          </div>
        </div>
        <div className="register-images">
          <div className="register-image">
            <img src={registerui} alt="Register" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
