import React from 'react';
import './MenuBar.css'; 

const MenuBar = ({ onCategoryChange, }) => {
  const handleCategoryChange = (event) => {
    const category = event.target.value;
    onCategoryChange(category); // Pass selected category back to parent
  };

  

  return (
    <div className="menu-bar">
      <div className="menu-options">
        <span className="menu-label">Categories:</span>
        <ul>
          <li>
            <input
              type="radio"
              id="Skincare"
              name="productCategory"
              value="Skincare"
              onChange={handleCategoryChange}
            />
            <label htmlFor="Skincare">Skincare</label>
          </li>
          <li>
            <input
              type="radio"
              id="Makeup"
              name="productCategory"
              value="Makeup"
              onChange={handleCategoryChange}
            />
            <label htmlFor="Makeup">Makeup</label>
          </li>
          <li>
            <input
              type="radio"
              id="Haircare"
              name="productCategory"
              value="Haircare"
              onChange={handleCategoryChange}
            />
            <label htmlFor="Haircare">Haircare</label>
          </li>
          <li>
            <input
              type="radio"
              id="Fragrance"
              name="productCategory"
              value="Fragrance"
              onChange={handleCategoryChange}
            />
            <label htmlFor="Fragrance">Fragrance</label>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MenuBar;
