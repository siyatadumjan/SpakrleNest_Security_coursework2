import React, { useCallback, useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { addReviewApi, addToCartApi, filterProductsApi, getAverageRatingApi, getReviewsApi, getReviewsByProductAndUserApi, getSingleProductApi } from '../../apis/Api';
import Navbar from '../../components/NavBar';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const carouselRef = useRef(null);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewChange, setReviewChange] = useState(false);
  const [ownReview, setOwnReview] = useState(null);
  const [productsRatings, setProductsRatings] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getSingleProductApi(id);
        setProduct(response.data.product);
        fetchRelatedProducts(response.data.product.productCategory, response.data.product._id);
      } catch (err) {
        setError(err.response ? err.response.data.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const fetchRelatedProducts = useCallback(async (category, productId) => {
    try {
      const categoryResponse = await filterProductsApi(category);
      const filteredProducts = categoryResponse.data.products.filter(product => product._id !== productId);
      setRelatedProducts(filteredProducts);
    } catch (err) {
      setError(err.response ? err.response.data.message : 'An error occurred');
    }
  }, []);

  useEffect(() => {
    getReviewsApi(id)
      .then((res) => {
        if (res.status === 200) {
          setReviews(res.data.reviews);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, reviewChange]);

  useEffect(() => {
    getReviewsByProductAndUserApi(id)
      .then((res) => {
        if (res.status === 200) {
          setOwnReview(res.data.review);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, reviewChange]);

  useEffect(() => {
    getAverageRatingApi(id)
      .then((res) => {
        if (res.status === 200) {
          const ratings = res.data.averageRating;
          const id = res.data.productId;
          setProductsRatings((prev) => ({ ...prev, [id]: ratings }));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, reviewChange]);

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;

    if (newQuantity < 1) {
      toast.error("Quantity cannot be less than 1");
      return;
    }

    if (newQuantity > product.productQuantity) {
      toast.error("Out of Stock");
      return;
    }

    setQuantity(newQuantity);
  };

  const handleAddToCart = async () => {
    const userId = localStorage.getItem('id'); // Retrieve user ID from local storage
    if (!userId) {
      toast.error('You need to be logged in to add items to the cart');
      return;
    }

    try {
      const response = await addToCartApi({ userId, productId: product._id, quantity });
      if (response.data.success) {
        toast.success('Product added to cart!');
      } else {
        toast.error(response.data.message || 'Failed to add product to cart');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleScroll = (direction) => {
    const scrollAmount = 220;
    if (direction === 'left') {
      carouselRef.current.scrollLeft -= scrollAmount;
    } else if (direction === 'right') {
      carouselRef.current.scrollLeft += scrollAmount;
    }
  };

  const handleViewMore = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();

    if (!rating || !review) {
      toast.error("Please ensure all fields are filled correctly.");
      return;
    }

    addReviewApi({ productId: product._id, rating, review })
      .then((response) => {
        if (response.status === 201) {
          toast.success(response.data.message);
          setShowReviewForm(false);
          setReviewChange(!reviewChange);
        } else {
          return Promise.reject(
            response.data.message || "Unexpected error occurred"
          );
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Error Occurred");
          }
        }
      });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!product) {
    return <div className="not-found">Product not found</div>;
  }

  return (
    <div className="detailed-product-page">
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      <div className="product-details-container">
        <div className="product-details">
          <div className="product-info">
            <h1>{product.productName}</h1>
            <p className="product-price">NPR {product.productPrice}</p>
            <p>{product.productDescription}</p>
            <p><strong>Category:</strong> {product.productCategory}</p>
            <p><strong>Skin Type:</strong> {product.productSkinType}</p>
            <p><strong>Quantities Available:</strong> {product.productQuantity}</p>
            <div className="quantity-selector">
              <button onClick={() => handleQuantityChange(-1)}>-</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantityChange(1)}>+</button>
            </div>
            <div className="button-group">
              <button onClick={handleAddToCart} className="add-to-cart-btn">Add to Cart</button>
            </div>
          </div>

            <img src={`https://localhost:5000/products/${product.productImage}`} alt={product.productName} className="product-image-container" />
        </div>
        <div className="related-products">
          <h2>Related Products</h2>
          <div className="carousel-container">
            <button className="carousel-button left" onClick={() => handleScroll('left')}>&lt;</button>
            <div className="related-products-list" ref={carouselRef}>
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct._id} className="related-product-item">
                  <img src={`https://localhost:5000/products/${relatedProduct.productImage}`} alt={relatedProduct.productName} />
                  <h5>NPR {relatedProduct.productPrice}</h5>
                  <p>{relatedProduct.productName}</p>
                  <div className="button-group">
                    <button className="btn btn-view-more" onClick={() => handleViewMore(relatedProduct._id)}>View More</button>
                  </div>
                </div>
              ))}
            </div>
            <button className="carousel-button right" onClick={() => handleScroll('right')}>&gt;</button>
          </div>
        </div>
        <div className="review-section">
          <h2>Reviews</h2>
          <div className="average-rating">
            <h3>Average Rating: {productsRatings[product._id] || 'Not yet rated'}</h3>
          </div>
          <div className="reviews-list">
            {reviews.length > 0 ? (
              reviews.map((reviewItem) => (
                <div key={reviewItem._id} className="review-item">
                  <p><strong>Rating:</strong> {reviewItem.rating}</p>
                  <p><strong>Review:</strong> {reviewItem.review}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="review-form">
              <h3>Leave a Review</h3>
              <label>
                Rating:
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  required
                />
              </label>
              <label>
                Review:
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  required
                />
              </label>
              <button type="submit">Submit Review</button>
              <button type="button" onClick={() => setShowReviewForm(false)}>Cancel</button>
            </form>
          )}
          {!showReviewForm && (
            <button onClick={() => setShowReviewForm(true)} className="btn btn-show-review-form">Leave a Review</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;


