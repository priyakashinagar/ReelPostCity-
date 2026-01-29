import axios from 'axios';

const API_URL = 'https://api.dhvanicast.com/api/ads';

// Create a new ad
export const createAd = async (adData, token) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL, adData, config);
    return response.data;
};

// Get user's ads
export const getUserAds = async (filters = {}, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: filters,
    };
    const response = await axios.get(API_URL, config);
    return response.data;
};

// Get ad by ID
export const getAdById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

// Get ads for a specific video
export const getAdsByVideo = async (videoId) => {
    const response = await axios.get(`${API_URL}/video/${videoId}`);
    return response.data;
};

// Update ad
export const updateAd = async (id, updateData, token) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.put(`${API_URL}/${id}`, updateData, config);
    return response.data;
};

// Toggle ad status (pause/resume)
export const toggleAdStatus = async (id, newStatus, token) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.put(`${API_URL}/${id}/toggle`, { newStatus }, config);
    return response.data;
};

// Delete ad
export const deleteAd = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.delete(`${API_URL}/${id}`, config);
    return response.data;
};

// Get ad statistics
export const getAdStats = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(`${API_URL}/stats`, config);
    return response.data;
};

// Track ad click
export const trackAdClick = async (id) => {
    const response = await axios.post(`${API_URL}/${id}/click`);
    return response.data;
};

// Track ad impression
export const trackAdImpression = async (id) => {
    const response = await axios.post(`${API_URL}/${id}/impression`);
    return response.data;
};
