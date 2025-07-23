import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import {  getWishlistItemsApi, removeFromWishlistApi } from '../../apis/Api';
import Navbar from '../../components/NavBar';
import './Wishlist.css';

const AddToWishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      fetchWishlist();
    }, []);
  
    const fetchWishlist = async () => {
      try {
        const res = await getWishlistItemsApi();
        console.log('Full API Response:', res);
        
        // Robust handling of wishlist items
        const wishlistItems = res.data?.products || [];
        console.log('Wishlist Items:', wishlistItems);
        
        setWishlist(wishlistItems);
        setLoading(false);
      } catch (error) {
        console.error("Wishlist Fetch Error:", error);
        setError('Failed to load wishlist');
        setLoading(false);
      }
    };
  
    const handleDeleteItem = async (id) => {
        try {
          const res = await removeFromWishlistApi(id);
          console.log('Remove Wishlist Response:', res);
      
          if (res.data.success) {
            setWishlist(wishlist.filter(item => item._id !== id));
            toast.success("Item removed from Wishlist");
          } else {
            toast.error(res.data.message || 'Failed to remove item');
          }
        } catch (error) {
          toast.error('Remove failed');
          console.error("Wishlist Remove Error:", error);
        }
      };
  
    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
  
    return (
      <div className="add-to-wishlist-page">
        <Navbar />
        <Toaster position="top-center" reverseOrder={false} />
        <div className="wishlist-container">
        <div className="cart-header">
          <h1>Your Wishlist</h1>
        </div>
          <div className="wishlist-items-container">
            {wishlist.length === 0 ? (
              <p>Your Wishlist is empty</p>
            ) : (
              wishlist.map((item) => (
                <div key={item._id} className="wishlist-item">
                  <img
                    src={`https://localhost:5000/products/${item.productId?.productImage}`}
                    alt={item.productId?.productName}
                    className="wishlist-item-image"
                  />
                  <div className="wishlist-item-details">
                    <h3>{item.productId?.productName}</h3>
                    <p>NPR {item.productId?.productPrice}</p>
                    <div className="wishlist-item-actions">
                      <button 
                        className="btn-remove" 
                        onClick={() => handleDeleteItem(item._id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default AddToWishlist;