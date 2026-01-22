/**
 * Post utility functions for managing posts lifecycle
 */

// Check if a post is expired based on user type
export const isPostExpired = (post) => {
  const now = Date.now();
  const postAge = now - post.timestamp;
  
  const expiryTimes = {
    'free': 24 * 60 * 60 * 1000,      // 24 hours
    'premium': 4 * 24 * 60 * 60 * 1000, // 4 days
    'vip': 7 * 24 * 60 * 60 * 1000      // 7 days
  };
  
  const expiryTime = expiryTimes[post.userType] || expiryTimes['free'];
  return postAge > expiryTime;
};

// Filter expired posts
export const filterExpiredPosts = (posts) => {
  return posts.filter(post => !isPostExpired(post));
};

// Get posts for a specific user
export const getUserPosts = (posts, userId) => {
  return posts.filter(post => post.userId === userId);
};

// Get posts by type (city)
export const getPostsByType = (posts, type) => {
  return posts.filter(post => post.type === type);
};

// Calculate remaining time for post expiry
export const getPostExpiryTime = (post) => {
  const now = Date.now();
  const postAge = now - post.timestamp;
  
  const expiryTimes = {
    'free': 24 * 60 * 60 * 1000,
    'premium': 4 * 24 * 60 * 60 * 1000,
    'vip': 7 * 24 * 60 * 60 * 1000
  };
  
  const expiryTime = expiryTimes[post.userType] || expiryTimes['free'];
  const remainingTime = expiryTime - postAge;
  
  if (remainingTime <= 0) return null;
  
  const hours = Math.floor(remainingTime / (60 * 60 * 1000));
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d`;
  return `${hours}h`;
};
