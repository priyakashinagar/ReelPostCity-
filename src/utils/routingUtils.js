/**
 * Routing utilities and helpers
 */

import { routes, ROUTE_TYPES, getAllRoutes, canAccessRoute } from '../config/routes.js';

/**
 * Get all navigation menu items for a user
 */
export const getNavigation = (user) => {
  const allRoutes = getAllRoutes();
  return Object.values(allRoutes)
    .filter(route => {
      // Show in header
      if (!route.showInHeader) return false;
      
      // Hide login page if already authenticated
      if (route.id === 'auth' && user?.id) return false;
      
      // Check access permissions
      return canAccessRoute(route, user);
    });
};

/**
 * Get breadcrumb navigation
 */
export const getBreadcrumbs = (currentRoute) => {
  const breadcrumbs = [];
  
  if (currentRoute) {
    breadcrumbs.push({
      label: 'Home',
      id: 'home'
    });
    
    breadcrumbs.push({
      label: currentRoute.label,
      id: currentRoute.id,
      current: true
    });
  }
  
  return breadcrumbs;
};

/**
 * Check if route requires specific user type
 */
export const getRouteRequirements = (routeId) => {
  const route = getAllRoutes()[routeId];
  return {
    requiresAuth: route?.protected || false,
    requiredUserTypes: route?.requiredUserTypes || null,
    description: route?.description || ''
  };
};

/**
 * Get user's accessible features
 */
export const getUserFeatures = (user) => {
  const features = {
    canCreatePost: !!user?.id,
    canPostAds: user?.userType === 'premium' || user?.userType === 'vip',
    canUpgrade: user?.userType === 'free' || user?.userType === 'premium',
    canAccessMessages: !!user?.id,
    canAccessProfile: !!user?.id
  };
  
  return features;
};

/**
 * Get upgrade path for user
 */
export const getUpgradePath = (userType) => {
  const paths = {
    'free': ['premium', 'vip'],
    'premium': ['vip'],
    'vip': []
  };
  
  return paths[userType] || [];
};

/**
 * Check if route is accessible by user
 */
export const isRouteAccessible = (routeId, user) => {
  const route = getAllRoutes()[routeId];
  return route ? canAccessRoute(route, user) : false;
};

/**
 * Get restricted routes for a user type
 */
export const getRestrictedRoutes = (userType) => {
  const allRoutes = Object.values(getAllRoutes());
  return allRoutes.filter(route => {
    if (!route.requiredUserTypes) return false;
    return !route.requiredUserTypes.includes(userType);
  });
};
