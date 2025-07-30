import axios from "axios";

// Creating backend Config - Try HTTP first for better compatibility
const Api = axios.create({
    baseURL: "http://localhost:5001", // Use HTTP port as primary
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 15000 // Increased timeout for better reliability
});

// HTTPS API as backup
const ApiHTTPS = axios.create({
    baseURL: "https://localhost:5000", // HTTPS as fallback
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 15000
});

// Add request interceptor to check authentication
Api.interceptors.request.use(
  (config) => {
    // Add token to every request if available
    const token = localStorage.getItem('token');
    if (token && !config.headers.authorization) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
Api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle SSL certificate issues
    if (error.code === 'CERT_AUTHORITY_INVALID' || 
        error.code === 'SELF_SIGNED_CERT_IN_CHAIN' ||
        error.code === 'ERR_CERT_AUTHORITY_INVALID') {
      console.warn('Certificate issue detected. In production, use proper SSL certificates.');
      console.error('SSL Error:', error.message);
    }
    
    // Handle network errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.error('Network error - backend server might not be running:', error.message);
    }
    
    if (error.response?.status === 401) {
      // Clear token if unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Log the full error for debugging
    console.error('API Error:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status
    });
    
    return Promise.reject(error);
  }
);

// Function to get the config with token
const getConfig = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No authentication token found. Please login first.');
      // Instead of throwing an error, return a config without auth
      return {
        headers: {
          'Content-Type': 'application/json'
        },
      };
    }
    return {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    };
  };

// Config for file uploads
const getFileConfig = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No authentication token found for file upload. Please login first.');
      return {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      };
    }
    return {
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
    };
  };

// Dynamic config that checks for token
const getJsonConfig = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn('No authentication token found. Please login first.');
    return {
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
  return {
    headers: {
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// Authentication utility functions
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const clearAuthToken = () => {
  localStorage.removeItem('token');
};

// Test API
export const testApi = () => {
    console.log('Testing API connection to:', Api.defaults.baseURL);
    return Api.get('/test').then(response => {
        console.log('API test successful:', response.data);
        return response;
    }).catch(error => {
        console.error('API test failed:', error.message);
        throw error;
    });
};

// Register API with HTTP/HTTPS fallback
export const registerUserApi = async (data) => {
    console.log('Sending registration data:', { 
        userName: data.userName, 
        email: data.email, 
        phone: data.phone 
    });
    
    try {
        // Try HTTP first (primary)
        console.log('Trying HTTP registration...');
        const response = await Api.post('/api/user/create', data);
        console.log('Registration API success (HTTP):', response.data);
        return response;
    } catch (httpError) {
        console.warn('HTTP registration failed, trying HTTPS:', httpError.message);
        
        try {
            // Fallback to HTTPS
            console.log('Trying HTTPS registration...');
            const response = await ApiHTTPS.post('/api/user/create', data);
            console.log('Registration API success (HTTPS):', response.data);
            return response;
        } catch (httpsError) {
            console.error('Registration failed on both HTTP and HTTPS:', {
                httpError: httpError.message,
                httpsError: httpsError.message,
                httpStatus: httpError.response?.status,
                httpsStatus: httpsError.response?.status,
                httpData: httpError.response?.data,
                httpsData: httpsError.response?.data
            });
            
            // Throw the more specific error
            throw httpsError.response?.data ? httpsError : httpError;
        }
    }
};

// Login API with HTTP/HTTPS fallback
export const loginUserApi = async (data) => {
    console.log('Attempting login with:', { email: data.email });
    
    try {
        // Try HTTP first
        const response = await Api.post('/api/user/login', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('Login successful (HTTP)');
        return response;
    } catch (httpError) {
        console.warn('HTTP login failed, trying HTTPS:', httpError.message);
        
        try {
            // Fallback to HTTPS
            const response = await ApiHTTPS.post('/api/user/login', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Login successful (HTTPS)');
            return response;
        } catch (httpsError) {
            console.error('Login failed on both HTTP and HTTPS:', {
                httpError: httpError.message,
                httpsError: httpsError.message
            });
            throw httpsError.response?.data ? httpsError : httpError;
        }
    }
};

//forgot password
export const forgotPasswordApi = (data) =>
    Api.post("/api/user/forgot_password", data);
   
  // verify otp
  export const verifyOtpApi = (data) => Api.post("/api/user/verify_otp", data);


// Get Password History
export const getPasswordHistoryApi = (data) =>
  Api.post("/api/user/get-password-history", data);

// Make user admin (for development)
export const makeUserAdminApi = (data) =>
  Api.post("/api/user/make-admin", data);

  export const verifyRegisterOtpApi = (data) =>
    Api.post("/api/user/verify_register_otp", data);
   
  // Resend Registration OTP
  export const resendLoginOtpApi = (data) =>
    Api.post("/api/user/resend_login_otp", data);
   
  // Verify Login OTP
  export const loginOTPApi = (data) =>
    Api.post("/api/user/verify_login_otp", data);

// Create product API
export const createProductApi = (data) => Api.post("/api/product/create", data, getFileConfig());


// Get all products API
export const getAllProductsApi = () => Api.get('/api/product/get_all_products', getConfig());

// Get single product API
export const getSingleProductApi = (id) => Api.get(`/api/product/get_single_product/${id}`, getConfig());

// Delete product API
export const deleteProductApi = (id) => Api.delete(`/api/product/delete_product/${id}`, getConfig());

// Update product API
export const updateProductApi = (id, data) => {
    return Api.put(`/api/product/update_product/${id}`, data, getFileConfig());
  };

// Function to fetch paginated products
export const getPaginatedProductsApi = (page, category, skinType) => {
    const params = { page };
    if (category) {
        params.category = category;
    }
    if (skinType) {
        params.skinType = skinType;
    }

    return Api.get('/api/product/pagination', {
        params,
        ...getConfig()
    });
};

// Function to filter products
export const filterProductsApi = (category, skinType) => {
    const params = {};
    if (category) {
        params.category = category;
    }
    if (skinType) {
        params.skinType = skinType;
    }

    return Api.get('/api/product/filter', {
        params,
        ...getConfig()
    });
};

// Function to search products
export const searchProductApi = (query, category) => {
    const params = { q: query };
    if (category) {
        params.category = category;
    }

    return Api.get('/api/product/search', {
        params,
        ...getConfig()
    });
};


export const fetchUserDataApi = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found in localStorage");
  }

  try {
    // Try HTTP first
    const response = await Api.get("/api/user/current", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (httpError) {
    console.log('HTTP request failed, trying HTTPS:', httpError.message);
    
    try {
      // Fallback to HTTPS
      const response = await ApiHTTPS.get("/api/user/current", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (httpsError) {
      console.error('Both HTTP and HTTPS failed for fetchUserData:', {
        httpError: httpError.message,
        httpsError: httpsError.message
      });
      throw new Error("Failed to fetch user data from both HTTP and HTTPS endpoints");
    }
  }
};

export const updateUserProfileApi = async (data) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found in localStorage");
  }

  try {
    // Try HTTP first
    const response = await Api.put("/api/user/update", data, getConfig());
    return response.data;
  } catch (httpError) {
    console.log('HTTP request failed for updateUserProfile, trying HTTPS:', httpError.message);
    
    try {
      // Fallback to HTTPS
      const response = await ApiHTTPS.put("/api/user/update", data, getConfig());
      return response.data;
    } catch (httpsError) {
      console.error('Both HTTP and HTTPS failed for updateUserProfile:', {
        httpError: httpError.message,
        httpsError: httpsError.message
      });
      throw new Error("Failed to update user profile from both HTTP and HTTPS endpoints");
    }
  }
};

// Profile Picture Upload API
export const uploadProfilePictureApi = async (formData) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found in localStorage");
  }

  try {
    // Try HTTP first
    const response = await Api.post("/api/user/profile_picture", formData, getFileConfig());
    return response.data;
  } catch (httpError) {
    console.log('HTTP request failed for uploadProfilePicture, trying HTTPS:', httpError.message);
    
    try {
      // Fallback to HTTPS
      const response = await ApiHTTPS.post("/api/user/profile_picture", formData, getFileConfig());
      return response.data;
    } catch (httpsError) {
      console.error('Both HTTP and HTTPS failed for uploadProfilePicture:', {
        httpError: httpError.message,
        httpsError: httpsError.message
      });
      throw new Error("Failed to upload profile picture from both HTTP and HTTPS endpoints");
    }
  }
};

// Cart APIs
export const getCartApi = () => Api.get("/api/cart/get_cart", getConfig());

export const addToCartApi = (data) => Api.post("/api/cart/add_to_cart", data, getConfig());

export const removeFromCartApi = (id) => Api.put(`/api/cart/remove_from_cart/${id}`, getConfig());


export const updateCartStatusApi = (data) => Api.put("/api/cart/update_status", data, getConfig());

// Wishlist APIs
export const addToWishlistApi = (data) => Api.post("/api/wishlist/add",data, getConfig());

export const getWishlistItemsApi = () => Api.get("/api/wishlist/get_wishlist", getConfig());

export const removeFromWishlistApi = (productId, wishlistItemId) => {
    return Api.put("/api/wishlist/remove", { 
      id: productId, 
      itemId: wishlistItemId 
    }, getConfig());
  };

//=========================== Review Apis ===========================

// add review api
export const addReviewApi = (data) => Api.post("/api/review/post_reviews", data, getConfig());

// get reviews api
export const getReviewsApi = (ProductId) => Api.get(`/api/review/get_reviews/${ProductId}`, getConfig());

// get reviews by product and user api
export const getReviewsByProductAndUserApi = (ProductId) => Api.get(`/api/review/get_reviews_by_user_and_product/${ProductId}`, getConfig());

// get average rating api
export const getAverageRatingApi = (ProductId) => Api.get(`/api/review/get_average_rating/${ProductId}`, getConfig());

//update review api
export const updateReviewApi = (id, data) => Api.put(`/api/review/update_reviews/${id}`, data, getConfig());

//=========================== Order Apis ===========================
//place order api
export const placeOrderApi = (data) => Api.post("/api/order/place_order", data, getJsonConfig());

// get single order api
export const getSingleOrderApi = (id) => Api.get(`/api/order/get_single_order/${id}`, getConfig());

// get all orders api
export const getAllOrdersApi = () => Api.get("/api/order/get_all_orders", getConfig());

// order status update api
export const updateOrderStatusApi = (id, data) => Api.post(`/api/order/update_order_status/${id}`, data, getConfig());

// get orders by user api
export const getOrdersByUserApi = () => Api.get("/api/order/get_orders_by_user", getConfig());

// Function to initialize Khalti payment
export const initializeKhaltiPaymentApi = (data) => Api.post("api/khalti/initialize-khalti", data, getConfig());

// Function to test simple Khalti payment
export const initializeSimpleKhaltiPaymentApi = (data) => Api.post("api/khalti/initialize-khalti-simple", data);

// Function to test Khalti configuration
export const testKhaltiConfigApi = () => Api.get("/api/khalti/test-khalti");

// Function to debug Khalti API
export const debugKhaltiApi = (data) => Api.post("/api/khalti/debug-khalti", data);

// Function to verify Khalti payment
export const verifyKhaltiPaymentApi = (params) => Api.get("/api/khalti/complete-khalti-payment", { params });

const KhaltiApi = axios.create({
    baseURL: "https://a.khalti.com/",
    headers: {
        "Content-Type": "application/json",
        authorization: `key c471e0d4a7104413b5b084d397396656`,
    },
});



export const fetchActivityLogsApi = async () => {
  console.log('Fetching activity logs...');
  
  try {
    // Try HTTP first (primary)
    console.log('Trying HTTP activity logs...');
    const response = await Api.get('/api/logs/activity-logs', getJsonConfig());
    console.log('Activity logs API success (HTTP):', response.data);
    return response.data.logs;
  } catch (httpError) {
    console.warn('HTTP activity logs failed, trying HTTPS:', httpError.message);
    
    try {
      // Fallback to HTTPS
      console.log('Trying HTTPS activity logs...');
      const response = await ApiHTTPS.get('/api/logs/activity-logs', getJsonConfig());
      console.log('Activity logs API success (HTTPS):', response.data);
      return response.data.logs;
    } catch (httpsError) {
      console.error('Activity logs failed on both HTTP and HTTPS:', {
        httpError: httpError.message,
        httpsError: httpsError.message,
        httpStatus: httpError.response?.status,
        httpsStatus: httpsError.response?.status,
        httpData: httpError.response?.data,
        httpsData: httpsError.response?.data
      });
      
      // Throw the more specific error
      throw httpsError.response?.data ? httpsError : httpError;
    }
  }
};

// Get dashboard notifications from real data
export const getDashboardNotificationsApi = async () => {
  try {
    const [orders, products] = await Promise.all([
      getAllOrdersApi(),
      getAllProductsApi()
    ]);
    
    return {
      orders: orders.data.orders || [],
      products: products.data.products || []
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return { orders: [], products: [] };
  }
};

export const initiateKhaltiPayment = (data) => KhaltiApi.post("api/v2/epayment/initiate/", data);
