import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {
  addToCartApi,
  addToWishlistApi,
  getCartApi,
  getWishlistItemsApi,
  removeFromWishlistApi,
} from '../apis/Api';
import './ProductCard.css';

const ProductCard = ({ productInformation, color }) => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('id');
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const checkIfFavorited = async () => {
      try {
        if (!userId) return;
        
        const response = await getWishlistItemsApi();
        if (response.data && response.data.products) {
          const isProductInWishlist = response.data.products.some(
            (item) => item.productId && item.productId._id === productInformation._id
          );
          setIsFavorited(isProductInWishlist);
        }
      } catch (error) {
        console.error('Error checking wishlist:', error);
      }
    };
  
    checkIfFavorited();
  }, [userId, productInformation._id]);

  
  const handleViewMore = () => {
    navigate(`/product/${productInformation._id}`);
  };

  const handleAddToCart = async () => {
    if (!userId) {
      toast.error('You need to be logged in to add items to the cart');
      return;
    }

    try {
      const cartResponse = await getCartApi();
      console.log('Cart API Response:', cartResponse); // Debug response
      const cartItems = cartResponse.data?.cartItems || [];
      const productInCart = cartItems.some(
        (item) => item.product._id === productInformation._id
      );

      if (productInCart) {
        toast.error('Product is already in cart');
        return;
      }

      const addResponse = await addToCartApi({
        productId: productInformation._id,
        quantity: 1,
      }); // Assuming quantity is 1
      if (addResponse.data.success) {
        toast.success('Product added to cart');
      } else {
        toast.error(addResponse.data.message || 'Failed to add product to cart');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error('Error adding product to cart:', error);
    }
  };

  const handleFavoriteClick = async () => {
    if (!userId) {
      toast.error('You need to be logged in to add items to the wishlist');
      return;
    }
  
    try {
      const response = isFavorited
        ? await removeFromWishlistApi(productInformation._id)
        : await addToWishlistApi({ productId: productInformation._id });
  
      if (response.data.success) {
        setIsFavorited(!isFavorited);
        toast.success(isFavorited ? 'Removed from wishlist' : 'Added to wishlist');
      } else {
        toast.error(response.data.message || `Failed to ${isFavorited ? 'remove from' : 'add to'} wishlist`);
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error('Error updating wishlist:', error);
    }
  };
  
  return (
    <div className="product-card">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="card">
        <span
          style={{
            backgroundColor: color,
            color: 'white',
            padding: '5px',
            borderRadius: '5px',
          }}
          className="badge bg-primary position-absolute top-0"
        >
          {productInformation.productCategory}
        </span>
        <FaHeart
          className={`favorite-icon ${isFavorited ? 'favorited' : ''}`}
          onClick={handleFavoriteClick}
        />
        <img
          src={`https://localhost:5000/products/${productInformation.productImage}`}
          className="card-img-top"
          alt={productInformation.productName}
        />
        <div className="card-body">
          <h5 className="card-title text-pink">NPR {productInformation.productPrice}</h5>
          <h5 className="card-title">{productInformation.productName}</h5>
          <p className="card-text">
            {productInformation.productDescription.split(' ').slice(0, 10).join(' ')}...
          </p>
          <div className="button-group">
            <button onClick={handleViewMore} className="btn btn-view-more">
              View More
            </button>
            <button onClick={handleAddToCart} className="btn btn-add-to-cart">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
