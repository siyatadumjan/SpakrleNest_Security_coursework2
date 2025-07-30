

const axios = require("axios");

// Function to verify Khalti Payment
async function verifyKhaltiPayment(pidx) {
  const headersList = {
    "Authorization": `Key ${process.env.KHALTI_SECRET_KEY}`,
    "Content-Type": "application/json",
  };

  const bodyContent = JSON.stringify({ pidx });

  const reqOptions = {
    url: `${process.env.KHALTI_GATEWAY_URL}/api/v2/epayment/lookup/`,
    method: "POST",
    headers: headersList,
    data: bodyContent,
  };

  try {
    const response = await axios.request(reqOptions);
    return response.data;
  } catch (error) {
    console.error("Error verifying Khalti payment:", error);
    throw error;
  }
}

// Function to initialize Khalti Payment
async function initializeKhaltiPayment(details) {
  console.log('Khalti Environment Check:');
  console.log('KHALTI_SECRET_KEY:', process.env.KHALTI_SECRET_KEY ? 'Set' : 'Not set');
  console.log('KHALTI_GATEWAY_URL:', process.env.KHALTI_GATEWAY_URL || 'Not set');
  
  if (!process.env.KHALTI_SECRET_KEY) {
    throw new Error('KHALTI_SECRET_KEY environment variable is not set');
  }

  if (!process.env.KHALTI_GATEWAY_URL) {
    throw new Error('KHALTI_GATEWAY_URL environment variable is not set');
  }
  
  // Ensure all required fields are present
  const requiredFields = ['amount', 'purchase_order_id', 'purchase_order_name', 'return_url', 'website_url'];
  for (const field of requiredFields) {
    if (!details[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  
  const headersList = {
    "Authorization": `Key ${process.env.KHALTI_SECRET_KEY}`,
    "Content-Type": "application/json",
  };

  const bodyContent = JSON.stringify(details);
  console.log('Payment initialization details:', details);
  console.log('Request headers:', { ...headersList, Authorization: 'Key [HIDDEN]' });

  const requestUrl = `${process.env.KHALTI_GATEWAY_URL}/api/v2/epayment/initiate/`;
  console.log('Request URL:', requestUrl);

  const reqOptions = {
    url: requestUrl,
    method: "POST",
    headers: headersList,
    data: bodyContent,
    timeout: 30000, // 30 second timeout
  };

  try {
    console.log('Making request to Khalti API...');
    const response = await axios.request(reqOptions);
    console.log('Khalti API response status:', response.status);
    console.log('Khalti API response:', response.data);
    return response.data;
  } catch (error) {
    console.error("Error initializing Khalti payment:");
    console.error("Status:", error.response?.status);
    console.error("Status Text:", error.response?.statusText);
    console.error("Response Data:", error.response?.data);
    console.error("Error Message:", error.message);
    
    // Provide more specific error messages
    if (error.response?.status === 401) {
      throw new Error('Khalti authentication failed. Please check your secret key.');
    } else if (error.response?.status === 400) {
      throw new Error(`Khalti API error: ${error.response?.data?.detail || 'Invalid request data'}`);
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to Khalti API. Please check your internet connection.');
    } else if (error.code === 'ETIMEDOUT') {
      throw new Error('Khalti API request timed out. Please try again.');
    }
    
    throw error;
  }
}

module.exports = { verifyKhaltiPayment, initializeKhaltiPayment };
