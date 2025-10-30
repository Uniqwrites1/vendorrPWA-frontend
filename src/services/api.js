import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vendorr_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('vendorr_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// =============================================================================
// AUTH ENDPOINTS
// =============================================================================

export const auth = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  oauth: (oauthData) => api.post('/api/auth/oauth', oauthData),
  socialLogin: (oauthData) => api.post('/api/auth/oauth', oauthData), // Alias for oauth
  refreshToken: () => api.post('/api/auth/refresh-token'),
  logout: () => api.post('/api/auth/logout'),
  getCurrentUser: () => api.get('/api/auth/me'),
  updateProfile: (userData) => api.put('/api/auth/me', userData),
  changePassword: (passwordData) => api.post('/api/auth/change-password', passwordData),
}

// Also export as authAPI for backwards compatibility
export const authAPI = auth

// =============================================================================
// MENU ENDPOINTS
// =============================================================================

export const menu = {
  // Categories
  getCategories: () => api.get('/api/menu/categories'),

  // Menu Items
  getMenuItems: (categoryId = null) => {
    const url = categoryId ? `/api/menu/items?category_id=${categoryId}` : '/api/menu/items'
    return api.get(url)
  },

  getFeaturedItems: () => api.get('/api/menu/featured'),

  getMenuItem: (itemId) => api.get(`/api/menu/items/${itemId}`),

  getPopularItems: () => api.get('/api/menu/popular'),

  // Admin endpoints
  createMenuItem: (itemData) => api.post('/api/test/admin/menu/items', itemData),
  updateMenuItem: (itemId, itemData) => api.put(`/api/test/admin/menu/items/${itemId}`, itemData),
  deleteMenuItem: (itemId) => api.delete(`/api/test/admin/menu/items/${itemId}`),
}

// =============================================================================
// ORDER ENDPOINTS
// =============================================================================

export const orders = {
  // Customer orders
  createOrder: (orderData) => api.post('/api/orders/', orderData),

  getMyOrders: () => api.get('/api/orders/my/'),

  getOrder: (orderId) => api.get(`/api/orders/${orderId}/`),

  trackOrder: (orderNumber) => api.get(`/api/orders/track/${orderNumber}/`),

  cancelOrder: (orderId) => api.post(`/api/orders/${orderId}/cancel/`),

  uploadReceipt: (formData) => api.post('/api/orders/upload-receipt', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),

  // Admin endpoints (will be added later)
  getAllOrders: (status = null) => {
    const url = status ? `/api/test/admin/orders?status=${status}` : '/api/test/admin/orders'
    return api.get(url)
  },

  updateOrderStatus: (orderId, status) => api.put(`/api/test/admin/orders/${orderId}/status`, { status }),

  getPendingOrders: () => api.get('/api/test/admin/orders?status=pending'),

  getPreparingOrders: () => api.get('/api/test/admin/orders?status=preparing'),
}

// =============================================================================
// USER ENDPOINTS
// =============================================================================

export const users = {
  // Profile management
  getProfile: () => api.get('/api/test/users/profile'),
  updateProfile: (profileData) => api.put('/api/test/users/profile', profileData),

  // Admin endpoints
  getAllUsers: () => api.get('/api/test/admin/users'),
  getUser: (userId) => api.get(`/api/test/admin/users/${userId}`),
  updateUser: (userId, userData) => api.put(`/api/test/admin/users/${userId}`, userData),
  deleteUser: (userId) => api.delete(`/api/test/admin/users/${userId}`),
}

// =============================================================================
// NOTIFICATION ENDPOINTS
// =============================================================================

export const notifications = {
  getNotifications: () => api.get('/api/test/notifications'),

  markAsRead: (notificationId) => api.post(`/api/test/notifications/${notificationId}/read`),

  markAllAsRead: () => api.post('/api/test/notifications/read-all'),

  getUnreadCount: () => api.get('/api/test/notifications/unread-count'),
}

// =============================================================================
// REVIEW ENDPOINTS
// =============================================================================

export const reviews = {
  getItemReviews: (itemId) => api.get(`/api/test/reviews/item/${itemId}`),

  createReview: (reviewData) => api.post('/api/test/reviews', reviewData),

  updateReview: (reviewId, reviewData) => api.put(`/api/test/reviews/${reviewId}`, reviewData),

  deleteReview: (reviewId) => api.delete(`/api/test/reviews/${reviewId}`),
}

// =============================================================================
// ADMIN DASHBOARD ENDPOINTS
// =============================================================================

export const admin = {
  // Dashboard stats
  getDashboardStats: () => api.get('/api/test/admin/dashboard/stats'),

  getDailyRevenue: (days = 7) => api.get(`/api/test/admin/dashboard/revenue?days=${days}`),

  // Order management
  getOrdersByStatus: (status) => api.get(`/api/test/admin/orders?status=${status}`),

  updateOrderStatus: (orderId, status) => api.put(`/api/test/admin/orders/${orderId}/status`, { status }),

  // User management
  getCustomers: () => api.get('/api/test/admin/users?role=customer'),
  getStaff: () => api.get('/api/test/admin/users?role=staff'),

  // Menu management
  getMenuStats: () => api.get('/api/test/admin/menu/stats'),

  updateMenuItemAvailability: (itemId, isAvailable) =>
    api.put(`/api/test/admin/menu/items/${itemId}/availability`, { is_available: isAvailable }),
}

// =============================================================================
// PAYMENT ENDPOINTS
// =============================================================================

export const payments = {
  getBankDetails: () => api.get('/api/test/payments/bank-details'),

  uploadReceipt: (orderId, receiptFile) => {
    const formData = new FormData()
    formData.append('receipt', receiptFile)
    return api.post(`/api/test/payments/upload-receipt/${orderId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  confirmPayment: (orderId, paymentData) => api.post(`/api/test/payments/confirm/${orderId}`, paymentData),
}

// =============================================================================
// SETTINGS ENDPOINTS
// =============================================================================

export const settings = {
  getRestaurantInfo: () => api.get('/api/test/settings/restaurant'),

  updateRestaurantInfo: (infoData) => api.put('/api/test/settings/restaurant', infoData),

  getBusinessHours: () => api.get('/api/test/settings/business-hours'),

  updateBusinessHours: (hoursData) => api.put('/api/test/settings/business-hours', hoursData),
}

// =============================================================================
// HEALTH CHECK
// =============================================================================

export const health = {
  check: () => api.get('/health'),
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export const apiUtils = {
  // Error handling
  handleApiError: (error) => {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data.detail || error.response.data.message || 'An error occurred',
        status: error.response.status,
        data: error.response.data,
      }
    } else if (error.request) {
      // Request made but no response
      return {
        message: 'Unable to connect to server. Please check your internet connection.',
        status: 0,
        data: null,
      }
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        status: -1,
        data: null,
      }
    }
  },

  // Format error for display
  formatErrorMessage: (error) => {
    const apiError = apiUtils.handleApiError(error)
    return apiError.message
  },
}

// =============================================================================
// EXPORT DEFAULT API INSTANCE AND ALL ENDPOINTS
// =============================================================================

export default {
  api,
  auth,
  menu,
  orders,
  users,
  notifications,
  reviews,
  admin,
  payments,
  settings,
  health,
  apiUtils,
}
