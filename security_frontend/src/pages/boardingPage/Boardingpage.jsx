import React from 'react';
import { Link } from 'react-router-dom';
import './Boardingpage.css';

const BoardingPage = () => {
  return (
    <div className="boarding-container">
      <div className="boarding-content">
        <h1 className="boarding-title">
          <span className="sparkle-emoji">✨</span>
          <span className="brand-text">SparkleNest</span>
        </h1>
        <p className="boarding-subtitle">
          Where beauty meets luxury. Discover our curated collection of premium cosmetics, 
          skincare essentials, and beauty treasures designed to enhance your natural radiance.
        </p>
        <div className="boarding-buttons">
          <Link to="/login" className="boarding-button">Sign In</Link>
          <Link to="/register" className="boarding-button">Create Account</Link>
        </div>
      </div>
    </div>
  );
};

export default BoardingPage;
