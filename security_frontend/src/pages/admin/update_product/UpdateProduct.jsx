import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {  useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSingleProductApi, updateProductApi } from '../../../apis/Api';
import './UpdateProduct.css';

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();


  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [productNewImage, setProductNewImage] = useState(null);
  const [previewNewImage, setPreviewNewImage] = useState(null);
  const [oldImage, setOldImage] = useState('');

  useEffect(() => {
    getSingleProductApi(id)
      .then((res) => {
        const product = res.data.product;
        setProductName(product.productName);
        setProductPrice(product.productPrice);
        setProductCategory(product.productCategory);
      
        setProductDescription(product.productDescription);
        setProductQuantity(product.productQuantity);
        setOldImage(product.productImage);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const handleImage = (event) => {
    const file = event.target.files[0];
    setProductNewImage(file);
    setPreviewNewImage(URL.createObjectURL(file));
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('productPrice', productPrice);
    formData.append('productCategory', productCategory);
  
    formData.append('productDescription', productDescription);
    formData.append('productQuantity', productQuantity);
    if (productNewImage) {
      formData.append('productImage', productNewImage);
    }

    updateProductApi(id, formData)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          toast.success(res.data.message);
          navigate('/admin/dashboard');        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 500) {
            toast.error(error.response.data.message);
          } else if (error.response.status === 400) {
            toast.error(error.response.data.message);
          }
        } else {
          toast.error('Something went wrong');
        }
      });
  };

  return (
    <div className="update-product-container">
      <h2 className="update-product-title">
        Update product for <span className="text-danger">{productName}</span>
      </h2>

      <div className="d-flex gap-3">
        <form className="update-product-form" onSubmit={handleUpdate}>
          <label htmlFor="productName">Product Name</label>
          <input
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="update-product-input"
            type="text"
            placeholder="Enter your product name"
          />

          <label htmlFor="productPrice" className="mt-2">
            Product Price
          </label>
          <input
            id="productPrice"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            className="update-product-input"
            type="number"
            placeholder="Enter your product price"
          />

          <label htmlFor="productCategory" className="mt-2">
            Choose category
          </label>
          <select
            id="productCategory"
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
            className="update-product-input"
          >
            <option value="select-option">Select Options</option>
            <option value="Anklets">Anklets</option>
                      <option value="Braclets">Braclets</option>
                      <option value="Earrings">Earrings</option>
                      <option value="Necklaces">Necklacesr</option>
          </select>

          
          <label htmlFor="productDescription" className="mt-2">
            Enter description
          </label>
          <textarea
            id="productDescription"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            className="update-product-input"
          ></textarea>

          <label htmlFor="productQuantity" className="mt-2">
            Product Quantity
          </label>
          <input
            id="productQuantity"
            value={productQuantity}
            onChange={(e) => setProductQuantity(e.target.value)}
            className="update-product-input"
            type="number"
            placeholder="Enter your product quantity"
          />

          <label htmlFor="productImage" className="mt-2">
            Choose product Image
          </label>
          <input
            id="productImage"
            onChange={handleImage}
            type="file"
            className="update-product-input"
          />

          <button type="submit" className="update-product-button mt-2">
            Update Product
          </button>
        </form>

        <div className="image-section">
          <h6>Previewing old image</h6>
          <img
            className="image-fluid rounded-4 object-fit-cover"
            src={`https://localhost:5000/products/${oldImage}`}
            alt="Old Product"
          />

          {previewNewImage && (
            <>
              <h6>Previewing new image</h6>
              <img
                className="img-fluid rounded-4 object-fit-cover"
                src={previewNewImage}
                alt="New Product"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
