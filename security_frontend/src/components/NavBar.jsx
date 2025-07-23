import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaDoorOpen, FaUser, FaSearch } from 'react-icons/fa'; // Import the search icon
import logo from '../assets/images/logo.png';
import './NavBar.css';
import { searchProductApi } from '../apis/Api'; // Import the search API function

const Navbar = ({ onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleSearch = async () => {
    try {
      const response = await searchProductApi(searchQuery);
      if (onSearchResults) {
        onSearchResults(response.data.products);
      }
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const handleLogoClick = () => {
    navigate('/homepage'); 
  };

  const handleFavoriteClick = () => {
    navigate('/wishlist'); // Navigate to the wishlist page
  };

  const handleCartClick = () => {
    navigate('/add-to-cart'); // Navigate to the Add to Cart page
  };

  const handleProfileClick = () => {
    navigate('/edit-profile'); // Navigate to the Edit Profile page
  };

  const handleLogout = () => {
    // Clear user data from local storage or state
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login'); // Redirect to login page
  };

  return (
    <nav className="premium-user-navbar">
      <div className="navbar-container">
        <div className="user-navbar-logo" onClick={handleLogoClick}>
          <span className="logo-icon">✨</span>
          <span className="logo-text">SparkleNest</span>
        </div>
        <div className="navbar-center">
          <div className="navbar-search">
            <input 
              type="text" 
              placeholder="Search for cosmetics, skincare..." 
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
            />
            <span className="search-icon" onClick={handleSearch}>
              <FaSearch />
            </span>
          </div>
        </div>
        <div className="user-navbar-right">
          <div className="navbar-icon" onClick={handleFavoriteClick}>
            <FaHeart className="nav-icon-symbol" />
            <span className="icon-label">Wishlist</span>
          </div>
          <div className="navbar-icon" onClick={handleCartClick}>
            <FaShoppingCart className="nav-icon-symbol" />
            <span className="icon-label">Cart</span>
          </div>
          <div className="navbar-profile" onClick={handleProfileClick}>
            <FaUser className="profile-icon" />
            <span className="profile-name">Profile</span>
          </div>
          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            <FaDoorOpen className="logout-icon" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
