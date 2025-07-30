const router = require('express').Router();
const productController = require('../controllers/productControllers');
const { logRequest } = require('../middleware/ActivityLog');
const { authGuard, adminGuard } = require('../middleware/authGuard');

// Public routes
router.post('/create', adminGuard, logRequest, productController.createProduct);
router.delete('/delete_product/:id', adminGuard, logRequest, productController.deleteProduct);
router.put('/update_product/:id', adminGuard, logRequest, productController.updateProduct);

 // Only admin should be able to create products

// Protected routes
router.get('/get_all_products', authGuard, logRequest, productController.getAllProducts);
router.get('/get_single_product/:id', authGuard, logRequest, productController.getSingleProduct);
router.get('/search', logRequest, productController.searchProduct);

// Public routes
router.get('/pagination', logRequest, productController.paginatonProducts);
router.get('/filter', logRequest, productController.filterProducts);



module.exports = router;
