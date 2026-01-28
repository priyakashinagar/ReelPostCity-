import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/posts';

// Configure axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Get all posts with optional filters
 * @param {Object} filters - { city, userId, tags, page, limit }
 */
export const getAllPosts = async (filters = {}) => {
  try {
    const response = await apiClient.get('', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

/**
 * Get posts by city name (using query parameter)
 * @param {string} city - City name
 * @param {number} page - Page number
 * @param {number} limit - Limit per page
 */
export const getPostsByCity = async (city, page = 1, limit = 10) => {
  try {
    const response = await apiClient.get('', {
      params: { city, page, limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching posts by city:', error);
    throw error;
  }
};

/**
 * Get posts by city ID (includes all sub-cities)
 * @param {string} cityId - City ObjectId (includes sub-cities)
 * @param {number} page - Page number
 * @param {number} limit - Limit per page
 * @param {string} sortBy - 'trending', 'latest', 'oldest'
 */
export const getPostsByCityId = async (cityId, page = 1, limit = 10, sortBy = 'trending') => {
  try {
    const response = await apiClient.get(`/by-city/${cityId}`, {
      params: { page, limit, sortBy },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching posts by city ID:', error);
    throw error;
  }
};

/**
 * Get posts by user
 * @param {string} userId - User ID
 */
export const getPostsByUser = async (userId) => {
  try {
    const response = await apiClient.get('', {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user posts:', error);
    throw error;
  }
};

/**
 * Get single post by ID
 * @param {string} postId - Post ID
 */
export const getPostById = async (postId) => {
  try {
    const response = await apiClient.get(`/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
};

/**
 * Create new post
 * @param {Object} postData - { caption, tags, city, image, location, userId }
 */
export const createPost = async (postData) => {
  try {
    const response = await apiClient.post('', postData);
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

/**
 * Update post
 * @param {string} postId - Post ID
 * @param {Object} updateData - Updated post data
 */
export const updatePost = async (postId, updateData) => {
  try {
    const response = await apiClient.put(`/${postId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

/**
 * Delete post
 * @param {string} postId - Post ID
 */
export const deletePost = async (postId) => {
  try {
    const response = await apiClient.delete(`/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

/**
 * Like/Unlike post
 * @param {string} postId - Post ID
 */
export const toggleLike = async (postId) => {
  try {
    const response = await apiClient.post(`/${postId}/like`);
    return response.data;
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

/**
 * Add comment to post
 * @param {string} postId - Post ID
 * @param {Object} commentData - { text, userId }
 */
export const addComment = async (postId, commentData) => {
  try {
    const response = await apiClient.post(`/${postId}/comments`, commentData);
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export default {
  getAllPosts,
  getPostsByCity,
  getPostsByCityId,
  getPostsByUser,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
};
