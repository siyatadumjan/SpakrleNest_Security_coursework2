// Simple test script to debug Khalti payment
const axios = require("axios");
require('dotenv').config();

console.log('Environment Check:');
console.log('KHALTI_SECRET_KEY:', process.env.KHALTI_SECRET_KEY ? 'Set (Live)' : 'Not set');
console.log('KHALTI_GATEWAY_URL:', process.env.KHALTI_GATEWAY_URL || 'Not set');

async function testKhaltiAPI() {
  try {
    const testPayload = {
      amount: 1000, // Rs 10 in paisa
      purchase_order_id: `test_${Date.now()}`,
      purchase_order_name: "Test Product",
      return_url: "https://localhost:5000/api/khalti/complete-khalti-payment",
      website_url: "http://localhost:3000",
    };

    console.log('\nTesting Khalti LIVE API with payload:', testPayload);

    const headers = {
      "Authorization": `Key ${process.env.KHALTI_SECRET_KEY}`,
      "Content-Type": "application/json",
    };

    const url = `${process.env.KHALTI_GATEWAY_URL}/api/v2/epayment/initiate/`;
    console.log('Request URL:', url);
    console.log('Headers:', { ...headers, Authorization: 'Key [LIVE_KEY_HIDDEN]' });

    const response = await axios.post(url, testPayload, { headers });
    
    console.log('\n✅ Success! Khalti LIVE API Response:');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    
    if (response.data.payment_url) {
      console.log('\n🎉 Payment URL generated:', response.data.payment_url);
    }
    
  } catch (error) {
    console.error('\n❌ Khalti LIVE API Error:');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Response Data:', error.response?.data);
    console.error('Error Message:', error.message);
    
    if (error.response?.status === 401) {
      console.error('\n❌ Authentication failed - Check your Khalti live secret key');
    } else if (error.response?.status === 400) {
      console.error('\n❌ Bad request - Check the payload format');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n❌ Connection refused - Check internet connection and API URL');
    }
  }
}

testKhaltiAPI();
