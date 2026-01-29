import axios from 'axios';

// Create axios instance with default configuration
const API_BASE_URL = import.meta.env.PROD 
  ? (import.meta.env.VITE_API_URL || 'https://api.dhvanicast.com/api')
  : (import.meta.env.VITE_API_LOCAL_URL || 'https://api.dhvanicast.com/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased to 30 seconds for better reliability
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses and errors
api.interceptors.response.use(
  (response) => response.data || response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// ============= CITIES API =============
export const citiesAPI = {
  // Get featured cities for map
  getFeaturedCities: () => api.get('/cities/map/featured'),
  
  // Get all cities
  getAllCities: () => api.get('/cities'),
  
  // Get single city details
  getCityById: (cityId) => api.get(`/cities/${cityId}`),
  
  // Get sub-cities (local areas) for a city
  getSubCities: (cityId) => api.get(`/cities/${cityId}/sub-cities`),
  
  // Get nearby cities by coordinates
  getNearby: (lat, lng, radius = 50) => 
    api.get(`/cities/nearby/${lat},${lng}?radius=${radius}`),
  
  // Get cities statistics
  getStatistics: () => api.get('/cities/statistics'),
};

// ============= POSTS API =============
export const postsAPI = {
  // Create new post
  createPost: (postData) => api.post('/posts/create', postData),
  
  // Get all posts
  getAllPosts: (page = 1, limit = 20) => 
    api.get('/posts', { params: { page, limit } }),
  
  // Get posts with filters (city, tags, etc)
  getPostsWithFilter: (filters) => 
    api.get('/posts', { params: filters }),
  
  // Get posts by city (includes sub-cities)
  getPostsByCity: (cityId, page = 1, limit = 20, sortBy = 'trending') =>
    api.get(`/posts/by-city/${cityId}`, { params: { page, limit, sortBy } }),
  
  // Get nearby posts
  getNearbyPosts: (cityId, radius = 50, page = 1, limit = 20) =>
    api.get(`/posts/nearby/${cityId}`, { params: { radius, page, limit } }),
  
  // Get single post details
  getPostById: (postId) => api.get(`/posts/${postId}`),
  
  // Get user's own posts
  getMyPosts: (page = 1, limit = 20) =>
    api.get('/posts/my-posts', { params: { page, limit } }),
  
  // Like/Unlike post
  toggleLike: (postId) => api.post(`/posts/${postId}/like`),
  
  // Delete post
  deletePost: (postId) => api.delete(`/posts/${postId}`),
  
  // Add comment to post
  addComment: (postId, comment) => 
    api.post(`/posts/${postId}/comments`, { text: comment }),
  
  // Get post comments
  getComments: (postId) => 
    api.get(`/posts/${postId}/comments`),
};

// ============= USERS API =============
export const usersAPI = {
  // Register new user
  register: (userData) => api.post('/users/register', userData),
  
  // Login user
  login: (credentials) => api.post('/users/login', credentials),
  
  // Get user profile
  getProfile: () => api.get('/users/profile'),
  
  // Update user profile
  updateProfile: (userData) => 
    api.put('/users/profile', userData),
  
  // Get all users for chat
  getUsersForChat: () => api.get('/users/chat/list'),
  
  // Logout user
  logout: () => {
    localStorage.removeItem('authToken');
    return Promise.resolve();
  },
};

// ============= MESSAGES API =============
export const messagesAPI = {
  // Get messages with a user
  getMessages: (userId) => api.get(`/messages/${userId}`),
  
  // Send a message
  sendMessage: (data) => api.post('/messages', data),
  
  // Update a message
  updateMessage: (id, data) => api.put(`/messages/${id}`, data),
  
  // Delete a message
  deleteMessage: (id) => api.delete(`/messages/${id}`),
};

// ============= CONTACT US API =============
export const contactAPI = {
  // Submit contact form
  submitContact: (data) => api.post('/contacts', data),
  
  // Get all contacts (admin)
  getAllContacts: (params) => api.get('/contacts', { params }),
  
  // Get contact by ID
  getContactById: (id) => api.get(`/contacts/${id}`),
  
  // Update contact (admin)
  updateContact: (id, data) => api.put(`/contacts/${id}`, data),
  
  // Delete contact (admin)
  deleteContact: (id) => api.delete(`/contacts/${id}`),
  
  // Get contact statistics (admin)
  getContactStats: () => api.get('/contacts/stats'),
};

export default api;
