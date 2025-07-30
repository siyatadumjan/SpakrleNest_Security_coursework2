import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createProductApi, deleteProductApi, getAllProductsApi } from '../../../apis/Api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  // Form states
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productMaterial, setProductMaterial] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

  // Fetch products on component mount
  useEffect(() => {
    getAllProductsApi()
      .then((res) => {
        setProducts(res.data.products);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const handleImage = (event) => {
    const file = event.target.files[0];
    setProductImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !productName ||
      !productPrice ||
      !productCategory ||
      !productDescription ||
      !productImage ||
      !productQuantity
    ) {
      toast.warning("Please fill all the fields");
      return;
    }

    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('productPrice', productPrice);
    formData.append('productCategory', productCategory);
    formData.append('productMaterial', productMaterial);
    formData.append('productDescription', productDescription);
    formData.append('productQuantity', productQuantity);
    formData.append('productImage', productImage);

    createProductApi(formData)
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          setShowForm(false);
          setProducts([res.data.data, ...products]);

          // Clear the form
          setProductName('');
          setProductPrice('');
          setProductCategory('');
          setProductMaterial('');
          setProductDescription('');
          setProductQuantity('');
          setProductImage(null);
          setPreviewImage('');
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400 || error.response.status === 500) {
            toast.warning(error.response.data.message);
          } else {
            toast.error('Something went wrong');
          }
        }
      });
  };

  const handleDelete = (id) => {
    const confirmDialog = window.confirm('Are you sure you want to delete this product?');
    if (confirmDialog) {
      deleteProductApi(id)
        .then((res) => {
          if (res.data.success) {
            toast.success(res.data.message);
            setProducts(products.filter(product => product._id !== id));
          }
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 500) {
              toast.error(error.response.data.message);
            } else {
              toast.warning(error.response.data.message);
            }
          } else {
            toast.error('Something went wrong');
          }
        });
    }
  };

  return (
    <>
      <h3 className="admin-dashboard-title">Admin Dashboard</h3>
      
      {/* Add Product Button */}
      <div className="dashboard-actions">
        <button
          type="button"
          className="add-product-btn"
          onClick={() => setShowForm(true)}
        >
          <span className="btn-icon">➕</span>
          Add Product
        </button>
      </div>

      <div className="table-container" style={{overflowX: 'auto', background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}>
        <div className="responsive-table">
          {/* Header */}
          <div className="table-header">
            <div className="header-cell col-image">IMAGE</div>
            <div className="header-cell col-name">PRODUCT NAME</div>
            <div className="header-cell col-price">PRICE</div>
            <div className="header-cell col-category">CATEGORY</div>
            <div className="header-cell col-description">DESCRIPTION</div>
            <div className="header-cell col-qty">QTY</div>
            <div className="header-cell col-actions">ACTIONS</div>
          </div>

          {/* Body */}
          <div className="table-body">
            {products.length > 0 ? (
              products.map((product, index) => (
                <div key={product._id} className="table-row">
                  <div className="table-cell col-image">
                    <img 
                      src={`http://localhost:5001/products/${product.productImage}`} 
                      alt={product.productName}
                      className="product-image"
                    />
                  </div>
                  <div className="table-cell col-name">
                    <span className="product-name">{product.productName}</span>
                  </div>
                  <div className="table-cell col-price">
                    <span className="product-price">₹{product.productPrice}</span>
                  </div>
                  <div className="table-cell col-category">
                    <span className="product-category">{product.productCategory}</span>
                  </div>
                  <div className="table-cell col-description">
                    <span className="product-description">{product.productDescription}</span>
                  </div>
                  <div className="table-cell col-qty">
                    <span className="product-quantity">{product.productQuantity}</span>
                  </div>
                  <div className="table-cell col-actions">
                    <div className="action-buttons">
                      <Link 
                        to={`/admin/update/${product._id}`}
                        className="btn-edit"
                      >
                        <span className="btn-icon">✏️</span>
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="btn-delete"
                      >
                        <span className="btn-icon">🗑️</span>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="table-row">
                <div className="table-cell" style={{gridColumn: '1 / -1', textAlign: 'center', padding: '2rem'}}>
                  <p>No products available. Add some products to get started!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Product Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="form-modal">
            <div className="form-container">
              <div className="form-header">
                <h2>Add New Product</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowForm(false)}
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="product-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="productName">Product Name</label>
                    <input
                      id="productName"
                      type="text"
                      placeholder="Enter product name"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="productPrice">Product Price (₹)</label>
                    <input
                      id="productPrice"
                      type="number"
                      placeholder="Enter price"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="productCategory">Product Category</label>
                    <select
                      id="productCategory"
                      value={productCategory}
                      onChange={(e) => setProductCategory(e.target.value)}
                    >
                      <option value="">Select Category</option>
                      <option value="Rings">Rings</option>
                      <option value="Necklaces">Necklaces</option>
                      <option value="Earrings">Earrings</option>
                      <option value="Bracelets">Bracelets</option>
                      <option value="Anklets">Anklets</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="productMaterial">Product Material (Optional)</label>
                    <input
                      id="productMaterial"
                      type="text"
                      placeholder="e.g., Gold, Silver, Diamond"
                      value={productMaterial}
                      onChange={(e) => setProductMaterial(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="productQuantity">Product Quantity</label>
                    <input
                      id="productQuantity"
                      type="number"
                      placeholder="Enter quantity"
                      value={productQuantity}
                      onChange={(e) => setProductQuantity(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="productImage">Product Image</label>
                    <input
                      id="productImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImage}
                    />
                    {previewImage && (
                      <div className="image-preview">
                        <img src={previewImage} alt="Preview" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="productDescription">Product Description</label>
                  <textarea
                    id="productDescription"
                    placeholder="Enter product description"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    rows="4"
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit">
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
