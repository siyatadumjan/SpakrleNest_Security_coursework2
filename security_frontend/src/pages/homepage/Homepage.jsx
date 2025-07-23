import React, { useEffect, useState } from 'react';
import { filterProductsApi, getPaginatedProductsApi } from '../../apis/Api';
import Carousel from '../../components/Carousel';
import ContactDetails from '../../components/ContactDetails';
import MenuBar from '../../components/MenuBar';
import Navbar from '../../components/NavBar';
import ProductCard from '../../components/ProductCard';
import './Homepage.css';

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const response = selectedCategory 
          ? await filterProductsApi(selectedCategory)
          : await getPaginatedProductsApi(page);

        if (response.data) {
          setProducts(response.data.products || []);
          setTotalPages(Math.ceil(response.data.totalProducts / 9));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, selectedCategory]);

  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory);
    setPage(1);
    setProducts([]); // Reset products to avoid duplication
  };

  

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleSearchResults = (results) => {
    setProducts(results);
    setTotalPages(1); // Since we are showing search results, set totalPages to 1
  };

  return (
    <div className="homepage">
      <Navbar onSearchResults={handleSearchResults} />
      
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <h1>Discover Premium Beauty</h1>
          <p>Explore our curated collection of luxury cosmetics and skincare products</p>
        </div>
      </div>
      
      <div className="carousel-container">
        <Carousel />
      </div>
      
      <div className="content">
        <div className="filter-container">
          <MenuBar onCategoryChange={handleCategoryChange} />
        </div>
        
        <div className="product-grid">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <h3>No Products Found</h3>
              <p>We couldn't find any products matching your criteria. Try adjusting your filters or browse our other categories.</p>
            </div>
          ) : (
            products.map((singleProduct) => (
              <ProductCard key={singleProduct._id} productInformation={singleProduct} />
            ))
          )}
        </div>
        
        {!loading && products.length > 0 && (
          <div className="pagination">
            <button onClick={handlePrevPage} disabled={page === 1}>
              ← Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={page === index + 1 ? 'current-page' : ''}
              >
                {index + 1}
              </button>
            ))}
            <button onClick={handleNextPage} disabled={page === totalPages}>
              Next →
            </button>
          </div>
        )}
      </div>
      
      <ContactDetails />
    </div>
  );
};

export default Homepage;
