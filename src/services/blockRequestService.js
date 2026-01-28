import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/block-requests';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Create a new block request
 */
export const createBlockRequest = async (blockData) => {
  try {
    const response = await apiClient.post('/', blockData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating block request:', error);
    throw error;
  }
};

/**
 * Get pending block requests (Admin only)
 */
export const getPendingBlockRequests = async () => {
  try {
    const response = await apiClient.get('/pending', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching pending block requests:', error);
    throw error;
  }
};

/**
 * Approve a block request
 */
export const approveBlockRequest = async (requestId, adminNotes = '') => {
  try {
    const response = await apiClient.put(
      `/${requestId}/approve`,
      { adminNotes },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error approving block request:', error);
    throw error;
  }
};

/**
 * Reject a block request
 */
export const rejectBlockRequest = async (requestId, adminNotes = '') => {
  try {
    const response = await apiClient.put(
      `/${requestId}/reject`,
      { adminNotes },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error rejecting block request:', error);
    throw error;
  }
};

/**
 * Get block requests by user
 */
export const getUserBlockRequests = async (userId) => {
  try {
    const response = await apiClient.get(`/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user block requests:', error);
    throw error;
  }
};

/**
 * Get block requests against a user
 */
export const getBlockRequestsAgainstUser = async (userName) => {
  try {
    const response = await apiClient.get(`/against/${userName}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching block requests against user:', error);
    throw error;
  }
};

export default {
  createBlockRequest,
  getPendingBlockRequests,
  approveBlockRequest,
  rejectBlockRequest,
  getUserBlockRequests,
  getBlockRequestsAgainstUser,
};
