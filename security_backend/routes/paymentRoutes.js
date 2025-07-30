const router = require("express").Router();

const paymentController = require("../controllers/paymentController");
const { authGuard } = require("../middleware/authGuard");

// Test route to check Khalti configuration
router.get("/test-khalti", (req, res) => {
  const khaltiConfig = {
    secretKey: process.env.KHALTI_SECRET_KEY ? 'Set' : 'Not set',
    gatewayUrl: process.env.KHALTI_GATEWAY_URL || 'Not set',
    backendUri: process.env.BACKEND_URI || 'Not set',
  };
  
  res.json({
    success: true,
    message: "Khalti configuration check",
    config: khaltiConfig,
    timestamp: new Date().toISOString()
  });
});

// Debug test route for Khalti API call
router.post("/debug-khalti", async (req, res) => {
  try {
    const { initializeKhaltiPayment } = require("../service/khaltiService");
    
    // Simple test payload
    const testPayload = {
      amount: 100, // Rs 1 in paisa
      purchase_order_id: "debug_test_" + Date.now(),
      purchase_order_name: "Debug Test Product",
      return_url: `${process.env.BACKEND_URI}/api/khalti/complete-khalti-payment`,
      website_url: req.body.website_url || "http://localhost:3000",
    };

    console.log('Debug: Testing Khalti API with payload:', testPayload);
    
    const result = await initializeKhaltiPayment(testPayload);

    res.json({
      success: true,
      message: "Khalti API test successful",
      result: result,
      payload: testPayload
    });
  } catch (error) {
    console.error('Debug Khalti error:', error);
    res.json({
      success: false,
      message: "Khalti API test failed",
      error: error.message,
      details: error.response?.data || null,
      stack: error.stack
    });
  }
});

// Direct test payment endpoint
router.post("/test-payment-direct", async (req, res) => {
  try {
    const { initializeKhaltiPayment } = require("../service/khaltiService");
    
    const testPayment = {
      amount: 1000, // Rs 10 in paisa
      purchase_order_id: `test_${Date.now()}`,
      purchase_order_name: "Test Product",
      return_url: `${process.env.BACKEND_URI || 'https://localhost:5000'}/api/khalti/complete-khalti-payment`,
      website_url: req.body.website_url || "http://localhost:3000",
    };

    console.log('Testing Khalti payment with:', testPayment);
    
    const result = await initializeKhaltiPayment(testPayment);
    
    res.json({
      success: true,
      message: "Payment initialized successfully",
      payment: result,
      test_data: testPayment
    });
  } catch (error) {
    console.error('Test payment error:', error);
    res.json({
      success: false,
      message: "Payment test failed",
      error: error.message,
      details: error.response?.data || error.stack
    });
  }
});

// Simplified payment initialization for debugging
router.post("/initialize-khalti-simple", async (req, res) => {
  try {
    const { totalPrice } = req.body;
    const { initializeKhaltiPayment } = require("../service/khaltiService");
    
    const paymentData = {
      amount: (totalPrice || 100) * 100, // Convert to paisa
      purchase_order_id: `order_${Date.now()}`,
      purchase_order_name: "SparkleNest Products",
      return_url: `${process.env.BACKEND_URI}/api/khalti/complete-khalti-payment`,
      website_url: req.body.website_url || "http://localhost:3000",
    };

    console.log('Simple payment initialization:', paymentData);
    
    const payment = await initializeKhaltiPayment(paymentData);

    res.json({
      success: true,
      message: "Payment initialized successfully",
      payment: payment
    });
  } catch (error) {
    console.error('Simple payment error:', error);
    res.json({
      success: false,
      message: "Payment initialization failed",
      error: error.message,
      details: error.response?.data || null
    });
  }
});

// Main payment routes
router.post("/initialize-khalti", paymentController.initializePayment);
router.get("/complete-khalti-payment", paymentController.completeKhaltiPayment);

module.exports = router;

