
// Import express router
const router = require("express").Router();

// Import order controller functions
const orderController = require("../controllers/orderControllers");

// Import authentication middleware
const { authGuard, adminGuard } = require("../middleware/authGuard");
const { logRequest } = require("../middleware/ActivityLog");

/**
 * @route   POST /place_order
 * @desc    Place a new order (requires authentication)
 */
router.post("/place_order", authGuard, logRequest, orderController.placeOrder);

/**
 * @route   GET /get_all_orders
 * @desc    Get all orders (admin or public view)
 */
router.get("/get_all_orders", adminGuard, logRequest, orderController.getAllOrders);

/**
 * @route   GET /get_orders_by_user
 * @desc    Get all orders for the authenticated user
 */
router.get("/get_orders_by_user", authGuard, logRequest, orderController.getOrdersByUser);

/**
 * @route   POST /update_order_status/:orderId
 * @desc    Update the status of an order (admin only)
 */
router.post(
  "/update_order_status/:orderId",
  adminGuard,
  logRequest,
  orderController.updateOrderStatus
);

// Export the router for use in the main app
module.exports = router;
