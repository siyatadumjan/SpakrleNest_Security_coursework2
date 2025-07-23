import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createProductApi, deleteProductApi, getAllProductsApi, isAuthenticated, clearAuthToken } from '../../../apis/Api';
import './AdminDashboard.css'; // Import the CSS file


const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');

  const [productDescription, setProductDescription] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [productQuantity, setProductQuantity] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated before fetching products
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to access this page');
      navigate('/login');
      return;
    }
    
    getAllProductsApi()
      .then((res) => {
        setProducts(res.data.products);
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again.');
          localStorage.removeItem('token');
          navigate('/login');
        }
      });
  }, [navigate]);

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
  const handleLogout = () => {
    // Clear user session or token here if needed
    navigate('/login'); // Redirect to login page
  };



  return (
    <div>
      <nav className="premium-admin-navbar">
        <div className="navbar-container">
          <div className="admin-navbar-logo">
            <span className="logo-icon">✨</span>
            <span className="logo-text">SparkleNest</span>
            <span className="logo-badge">Admin</span>
          </div>
          <div className="navbar-center">
            <div className="navbar-search">
              <input 
                type="text" 
                placeholder="Search products, orders..." 
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>
          <div className="admin-navbar-right">
            <div className="navbar-notifications">
              <span className="notification-icon">🔔</span>
              <span className="notification-badge">3</span>
            </div>
            <div className="navbar-profile">
              <img 
                src="/api/placeholder/32/32" 
                alt="Admin Profile" 
                className="profile-avatar"
              />
              <span className="profile-name">Admin</span>
            </div>
            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              <span className="logout-icon">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="admin-dashboard-container">
        <div className="admin-dashboard-sidebar">
          <div className="sidebar-logo">
            <h2>SparkleNest</h2>
          </div>
          <nav className="sidebar-nav">
            <button
              type="button"
              className="sidebar-nav-item"
              onClick={() => setShowForm(true)}
            >
              <span className="nav-icon">➕</span>
              Add Product
            </button>
          
            <Link to="/admin/view-order" className="sidebar-nav-item">
              <span className="nav-icon">📦</span>
              View Orders
            </Link>
            
            <Link to="/admin/activity-log" className="sidebar-nav-item">
              <span className="nav-icon">📊</span>
              Activity Log
            </Link>
          </nav>
        </div>
         


        <div className="admin-dashboard-main">
          <h3 className="admin-dashboard-title">Admin Dashboard</h3>

          <table className="admin-dashboard-table">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-3">Product Image</th>
                <th className="p-3">Product Name</th>
                <th className="p-3">Product Price</th>
                <th className="p-3">Product Category</th>
          
                <th className="p-3">Product Description</th>
                <th className="p-3">Product Quantity</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((singleProduct) => (
                <tr key={singleProduct._id} className="bg-white hover:bg-gray-100">
                  <td className="p-3">
                    <img
                      src={`https://localhost:5000/products/${singleProduct.productImage}`}
                      alt={singleProduct.productName}
                      onError={(e) => { e.target.src = '/path/to/placeholder-image.jpg'; }}
                      className="w-24 h-12 object-cover rounded-md"
                    />
                  </td>
                  <td className="p-3">{singleProduct.productName}</td>
                  <td className="p-3">{singleProduct.productPrice}</td>
                  <td className="p-3">{singleProduct.productCategory}</td>
          
                  <td className="p-3">{singleProduct.productDescription}</td>
                  <td className="p-3">{singleProduct.productQuantity}</td>
                  <td className="p-3">
                    <div className="action-cell">
                      <Link to={`/admin/update/${singleProduct._id}`} className="action-button">
                        <FontAwesomeIcon icon={faEdit} className="text-blue-500 hover:text-blue-700 cursor-pointer" />
                      </Link>
                      <button onClick={() => handleDelete(singleProduct._id)} className="action-button">
                        <FontAwesomeIcon icon={faTrash} className="text-red-500 hover:text-red-700 cursor-pointer" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title">Create a new product</h1>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit} className="modal-form">
                  <div className="modal-form-group">
                    <label>Product Name</label>
                    <input
                      type="text"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="form-control"
                      placeholder="Enter Product Name"
                    />
                  </div>

                  <div className="modal-form-group">
                    <label>Product Price</label>
                    <input
                      type="number"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      className="form-control"
                      placeholder="Enter Product Price"
                    />
                  </div>

                  <div className="modal-form-group">
                    <label>Product Category</label>
                    <select
                      value={productCategory}
                      onChange={(e) => setProductCategory(e.target.value)}
                      className="form-control"
                    >
                      <option value="select-option">Select Options</option>
                      <option value="Anklets">Anklets</option>
                      <option value="Braclets">Braclets</option>
                      <option value="Earrings">Earrings</option>
                      <option value="Necklaces">Necklaces</option>
                      
                    </select>
                  </div>

                  
                  <div className="modal-form-group">
                    <label>Product Description</label>
                    <textarea
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                      className="form-control"
                      placeholder="Enter Description"
                    ></textarea>
                  </div>
                  <div className="modal-form-group">
                    <label>Product Quantity</label>
                    <input
                      type="number"
                      value={productQuantity}
                      onChange={(e) => setProductQuantity(e.target.value)}
                      className="form-control"
                      placeholder="Enter Product Quantity"
                    />
                  </div>

                  <div className="modal-form-group">
                    <label>Product Image</label>
                    <input
                      type="file"
                      onChange={handleImage}
                      className="form-control"
                    />
                    {previewImage && (
                      <img
                        src={previewImage}
                        alt="preview"
                        className="img-fluid rounded mt-2"
                      />
                    )}
                  </div>

                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary">
                      Create Product
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
