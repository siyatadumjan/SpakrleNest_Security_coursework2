import axios from "axios";

// Creating backend Config
const Api = axios.create({
    baseURL: "https://localhost:5000",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000 // 10 second timeout
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
    if (error.code === 'CERT_AUTHORITY_INVALID' || error.code === 'SELF_SIGNED_CERT_IN_CHAIN') {
      console.warn('Certificate issue detected. In production, use proper SSL certificates.');
    }
    
    if (error.response?.status === 401) {
      // Clear token if unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
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
export const testApi = () => Api.get('/test');

// Register API
export const registerUserApi = (data) => {
    try {
        return Api.post('/api/user/create', data);
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

// Login API
export const loginUserApi = async (data) => {
    try {
        console.log('Attempting login with:', { email: data.email });
        const response = await Api.post('/api/user/login', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        throw error;
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

  const response = await Api.get("/api/user/current", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data; // Return the response data
};

export const updateUserProfileApi = async (data) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found in localStorage");
  }

  const response = await Api.put("/api/user/update", data, getConfig());
  return response.data;
};

// Profile Picture Upload API
export const uploadProfilePictureApi = async (formData) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found in localStorage");
  }

  const response = await Api.post("/api/user/profile_picture", formData, getFileConfig());

  return response.data;
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
export const initializeKhaltiPaymentApi = (data) => Api.post("api/khalti/initialize-khalti", data);

// Function to verify Khalti payment
export const verifyKhaltiPaymentApi = (params) => Api.get("/api/khalti/complete-khalti-payment", { params });

const KhaltiApi = axios.create({
    baseURL: "https://test-pay.khalti.com/",
    headers: {
        "Content-Type": "application/json",
        authorization: `key 45615eee5f444d8186bce4b1766896fa`,
    },
});



export const fetchActivityLogsApi = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    "https://localhost:5000/api/logs/activity-logs",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.logs;
};

export const initiateKhaltiPayment = (data) => KhaltiApi.post("api/v2/epayment/initiate/", data);
