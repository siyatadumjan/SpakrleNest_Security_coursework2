const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    productCategory: {
        type: String,
        required: true
    },
    productMaterial: {
        type: String,
        required: false, // Optional field for jewelry material (gold, silver, etc.)
    },
    productDescription: {
        type: String,
        required: true,
        maxLength: 1000 // Increased limit for detailed jewelry descriptions
    },
    productImage: {
        type: String,
        required: true
    },
    productQuantity: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const Product = mongoose.model('Product', productSchema); // Capitalize 'Product' here
module.exports = Product;
