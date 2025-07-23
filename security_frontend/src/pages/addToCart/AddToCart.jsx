import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getCartApi, removeFromCartApi } from '../../apis/Api';
import Navbar from '../../components/NavBar';
import './AddToCart.css';

const AddToCart = () => {
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    calculateSubtotal(cart);
  }, [cart]);

  const fetchCart = async () => {
    try {
      const res = await getCartApi();
      if (res.status === 200 && res.data && res.data.products) {
        const cartItems = res.data.products.map((item) => ({
          ...item,
          quantity: item.quantity
        }));
        setCart(cartItems);
        setLoading(false);
      } else {
        setCart([]);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching cart", error);
      setError('An error occurred while fetching cart items.');
      setLoading(false);
    }
  }

  const handleDeleteItem = async (id) => {
    try {
      const res = await removeFromCartApi(id);
      if (res.status === 200) {
        setCart(cart.filter(item => item._id !== id));
        toast.success("Item removed from cart");
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error("Error deleting item from cart", error);
    }
  }

  const calculateSubtotal = (cartItems) => {
    const total = cartItems.reduce((sum, item) => {
      if (item && item.productId && item.productId.productPrice) {
        return sum + item.productId.productPrice * item.quantity;
      }
      return sum;
    }, 0);
    setSubtotal(total);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="add-to-cart-page">
      <Navbar className="navbar" />
      <Toaster position="top-center" reverseOrder={false} />
      <div className="cart-container">
        <div className="cart-header">
          <h1>Your Cart</h1>
        </div>
        <div className="cart-content">
          <div className="cart-items-container">
            {cart.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              cart.map((item, index) => (
                item.productId ? (
                  <div key={item._id} className="cart-item">
                    <img
                      src={`https://localhost:5000/products/${item.productId.productImage}`}
                      alt={item.productId.productName}
                      className="cart-item-image"
                    />
                    <div className="cart-item-details">
                      <h3>{item.productId.productName}</h3>
                      <p>NPR {item.productId.productPrice}</p>
                      <p>Quantity: {item.quantity}</p>
                      <div className="cart-item-actions">
                        {/* <button className="btn-change" onClick={() => handleQuantityChange(index, -1)}>-</button> */}
                        {/* <button className="btn-change" onClick={() => handleQuantityChange(index, 1)}>+</button> */}
                        <button className="btn-remove" onClick={() => handleDeleteItem(item._id)}>
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null
              ))
            )}
          </div>
          <div className="total-price-container">
            <p>Items Total Price - NPR {subtotal}</p>
            <p>Delivery Fee - NPR 5</p>
            <p>Estimated Total - NPR {subtotal + 5}</p>
            <Link to={`/placeorder`}>
              <button className="checkout-button">Checkout</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCart;
