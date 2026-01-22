/**
 * Routes Module - Centralized routing configuration
 * Exports all routing related functions and constants
 */

export {
  ROUTE_TYPES,
  routeConfig,
  getAllRoutes,
  getHeaderRoutes,
  getRoutesByType,
  isProtectedRoute,
  canAccessRoute
} from './routeConfig.js';

export {
  validateRouteAccess,
  renderRoute,
  shouldShowHeader,
  AccessDeniedUI
} from './routeRenderer.jsx';
