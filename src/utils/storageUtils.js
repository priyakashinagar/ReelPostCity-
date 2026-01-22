/**
 * Local storage utility functions for persistent data management
 */

// Posts storage
export const savePosts = (posts) => {
  localStorage.setItem('posts', JSON.stringify(posts));
};

export const getPosts = () => {
  const saved = localStorage.getItem('posts');
  return saved ? JSON.parse(saved) : [];
};

// Users storage
export const saveUsers = (users) => {
  localStorage.setItem('users', JSON.stringify(users));
};

export const getUsers = () => {
  const saved = localStorage.getItem('users');
  return saved ? JSON.parse(saved) : [];
};

// Current user storage
export const saveCurrentUser = (user) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const getCurrentUser = () => {
  const saved = localStorage.getItem('currentUser');
  return saved ? JSON.parse(saved) : null;
};

// Ads storage
export const saveAds = (ads) => {
  localStorage.setItem('ads', JSON.stringify(ads));
};

export const getAds = () => {
  const saved = localStorage.getItem('ads');
  return saved ? JSON.parse(saved) : [];
};

// Subscriptions storage
export const saveSubscriptions = (subscriptions) => {
  localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
};

export const getSubscriptions = () => {
  const saved = localStorage.getItem('subscriptions');
  return saved ? JSON.parse(saved) : [];
};

// Clear all storage
export const clearStorage = () => {
  localStorage.clear();
};
