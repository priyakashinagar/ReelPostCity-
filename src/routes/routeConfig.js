/**
 * Route Type Constants
 */
export const ROUTE_TYPES = {
  PUBLIC: 'public',        // Anyone can access
  PRIVATE: 'private',      // Requires authentication
  PROTECTED: 'protected'   // Requires authentication + specific conditions
};

/**
 * All Route Definitions
 */
export const routeConfig = {
  // PUBLIC ROUTES - No authentication required
  public: {
    HOME: {
      id: 'home',
      path: '/',
      label: 'Home',
      type: ROUTE_TYPES.PUBLIC,
      protected: false,
      showInHeader: true
    },
    AUTH: {
      id: 'auth',
      path: '/auth',
      label: 'Login',
      type: ROUTE_TYPES.PUBLIC,
      protected: false,
      showInHeader: false
    },
    ABOUT: {
      id: 'about',
      path: '/about',
      label: 'About Us',
      type: ROUTE_TYPES.PUBLIC,
      protected: false,
      showInHeader: true
    },
    CONTACT: {
      id: 'contact',
      path: '/contact',
      label: 'Contact Us',
      type: ROUTE_TYPES.PUBLIC,
      protected: false,
      showInHeader: true
    },
    POSTS: {
      id: 'posts',
      path: '/posts',
      label: 'Posts',
      type: ROUTE_TYPES.PUBLIC,
      protected: false,
      showInHeader: true,
      description: 'View all posts (no login required)'
    },
    POST_DETAIL: {
      id: 'post-detail',
      path: '/post/:id',
      label: 'Post Detail',
      type: ROUTE_TYPES.PUBLIC,
      protected: false,
      showInHeader: false,
      description: 'View single post details'
    }
  },

  // PRIVATE ROUTES - Requires authentication
  private: {
    CREATE_POST: {
      id: 'create-post',
      path: '/create-post',
      label: 'Create Post',
      type: ROUTE_TYPES.PRIVATE,
      protected: true,
      showInHeader: true,
      requiresAuth: true,
      description: 'Create a new post (login required)'
    },
    EXPLORE: {
      id: 'explore',
      path: '/explore',
      label: 'Explore',
      type: ROUTE_TYPES.PRIVATE,
      protected: true,
      showInHeader: true,
      requiresAuth: true
    },
    LIKES: {
      id: 'likes',
      path: '/likes',
      label: 'Likes',
      type: ROUTE_TYPES.PRIVATE,
      protected: true,
      showInHeader: true,
      requiresAuth: true
    },
    MESSAGES: {
      id: 'messages',
      path: '/messages',
      label: 'Messages',
      type: ROUTE_TYPES.PRIVATE,
      protected: true,
      showInHeader: true,
      requiresAuth: true
    },
    NOTIFICATIONS: {
      id: 'notifications',
      path: '/notifications',
      label: 'Notifications',
      type: ROUTE_TYPES.PRIVATE,
      protected: true,
      showInHeader: true,
      requiresAuth: true
    },
    PROFILE: {
      id: 'profile',
      path: '/profile',
      label: 'Profile',
      type: ROUTE_TYPES.PRIVATE,
      protected: true,
      showInHeader: true,
      requiresAuth: true
    }
  },

  // PROTECTED ROUTES - Requires authentication + specific conditions
  protected: {
    SUBSCRIPTION: {
      id: 'subscription',
      path: '/subscription',
      label: 'Subscription',
      type: ROUTE_TYPES.PROTECTED,
      protected: true,
      showInHeader: true,
      requiresAuth: true,
      requiredUserTypes: ['free', 'premium'] // VIP users shouldn't see this
    },
    POST_AD: {
      id: 'post-ad',
      path: '/post-ad',
      label: 'Post Ad',
      type: ROUTE_TYPES.PROTECTED,
      protected: true,
      showInHeader: false,
      requiresAuth: true,
      requiredUserTypes: ['premium', 'vip'] // Only paid users
    },
    MY_ADS: {
      id: 'my-ads',
      path: '/my-ads',
      label: 'My Ads',
      type: ROUTE_TYPES.PROTECTED,
      protected: true,
      showInHeader: false,
      requiresAuth: true,
      requiredUserTypes: ['premium', 'vip'] // Only paid users
    }
  }
};

/**
 * Get all routes flattened
 */
export const getAllRoutes = () => {
  return {
    ...routeConfig.public,
    ...routeConfig.private,
    ...routeConfig.protected
  };
};

/**
 * Get all header navigation routes
 */
export const getHeaderRoutes = () => {
  const allRoutes = getAllRoutes();
  return Object.values(allRoutes).filter(route => route.showInHeader);
};

/**
 * Get routes by type
 */
export const getRoutesByType = (type) => {
  return Object.values(getAllRoutes()).filter(route => route.type === type);
};

/**
 * Check if route requires authentication
 */
export const isProtectedRoute = (routeId) => {
  const route = getAllRoutes()[routeId];
  return route?.protected || false;
};

/**
 * Check if user can access a protected route
 */
export const canAccessRoute = (route, user) => {
  if (!route.protected) return true; // Public routes are always accessible
  
  if (!user || !user.id) return false; // Need to be authenticated
  
  if (route.requiredUserTypes) {
    return route.requiredUserTypes.includes(user.userType);
  }
  
  return true;
};
