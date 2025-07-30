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
              id="Anklets"
              name="productCategory"
              value="Anklets"
              onChange={handleCategoryChange}
            />
            <label htmlFor="Anklets">Anklets</label>
          </li>
          <li>
            <input
              type="radio"
              id="Bracelets"
              name="productCategory"
              value="Bracelets"
              onChange={handleCategoryChange}
            />
            <label htmlFor="Bracelets">Bracelets</label>
          </li>
          <li>
            <input
              type="radio"
              id="Earrings"
              name="productCategory"
              value="Earrings"
              onChange={handleCategoryChange}
            />
            <label htmlFor="Earrings">Earrings</label>
          </li>
          <li>
            <input
              type="radio"
              id="Necklaces"
              name="productCategory"
              value="Necklaces"
              onChange={handleCategoryChange}
            />
            <label htmlFor="Necklaces">Necklaces</label>
          </li>
          <li>
            <input
              type="radio"
              id="Rings"
              name="productCategory"
              value="Rings"
              onChange={handleCategoryChange}
            />
            <label htmlFor="Rings">Rings</label>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MenuBar;
