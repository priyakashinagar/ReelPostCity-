/**
 * Route Renderer - Handles all route rendering logic
 * Keeps App.jsx clean by separating routing concerns
 */

import React from 'react';
import ProtectedRoute from '../components/Layout/ProtectedRoute.jsx';
import { routeConfig, canAccessRoute } from './routeConfig.js';

// Import all pages
import Auth from '../pages/Auth.jsx';
import Home from '../pages/Home.jsx';
import Posts from '../pages/Posts.jsx';
import PostDetail from '../pages/PostDetail.jsx';
import AboutUs from '../pages/AboutUs.jsx';
import ContactUs from '../pages/ContactUs.jsx';
import CreatePost from '../pages/CreatePost.jsx';
import Explore from '../pages/Explore.jsx';
import Likes from '../pages/Likes.jsx';
import Messages from '../pages/Messages.jsx';
import Notifications from '../pages/Notifications.jsx';
import Profile from '../pages/Profile.jsx';
import Subscription from '../pages/Subscription.jsx';
import PostAd from '../pages/PostAd.jsx';
import MyAds from '../pages/MyAds.jsx';
import PrivacyAndSafety from '../pages/PrivacyAndSafety.jsx';
import NotificationSettings from '../pages/NotificationSettings.jsx';
import Preferences from '../pages/Preferences.jsx';
import HelpAndSupport from '../pages/HelpAndSupport.jsx';

/**
 * Map of route IDs to their components
 */
const componentMap = {
  // PUBLIC
  'home': Home,
  'auth': Auth,
  'about': AboutUs,
  'contact': ContactUs,
  'posts': Posts,
  'post-detail': PostDetail,
  
  // PRIVATE
  'create-post': CreatePost,
  'explore': Explore,
  'likes': Likes,
  'messages': Messages,
  'notifications': Notifications,
  'profile': Profile,
  
  // PROTECTED
  'subscription': Subscription,
  'post-ad': PostAd,
  'my-ads': MyAds,
  
  // SETTINGS PAGES
  'privacy-and-safety': PrivacyAndSafety,
  'notification-settings': NotificationSettings,
  'preferences': Preferences,
  'help-and-support': HelpAndSupport
};

/**
 * Get all routes as flat object
 */
const getAllRoutes = () => {
  return {
    ...routeConfig.public,
    ...routeConfig.private,
    ...routeConfig.protected
  };
};

/**
 * Find current route configuration
 */
const getCurrentRoute = (currentPage) => {
  const allRoutes = getAllRoutes();
  return allRoutes[currentPage] || null;
};

/**
 * Check if user can access the current route
 */
export const validateRouteAccess = (currentPage, user, isAuthenticated) => {
  const currentRoute = getCurrentRoute(currentPage);
  
  if (!currentRoute) return { allowed: true }; // Route doesn't exist, let it pass
  
  if (!currentRoute.protected) {
    return { allowed: true }; // Public route
  }
  
  if (!isAuthenticated || !user) {
    return { 
      allowed: false, 
      reason: 'NOT_AUTHENTICATED',
      route: currentRoute 
    };
  }
  
  if (currentRoute.requiredUserTypes && !currentRoute.requiredUserTypes.includes(user.userType)) {
    return { 
      allowed: false, 
      reason: 'INSUFFICIENT_PERMISSIONS',
      route: currentRoute,
      userType: user.userType
    };
  }
  
  return { allowed: true };
};

/**
 * Render the appropriate component for current page
 */
export const renderRoute = (currentPage, routeProps) => {
  const {
    user,
    isAuthenticated,
    selectedPost,
    posts,
    onNavigate,
    handleAddPost
  } = routeProps;

  const Component = componentMap[currentPage];

  if (!Component) {
    return (
      <Home
        onNavigate={onNavigate}
        userType={user?.userType}
      />
    );
  }

  const currentRoute = getCurrentRoute(currentPage);

  // PUBLIC routes
  if (!currentRoute?.protected) {
    return (
      <Component
        onNavigate={onNavigate}
        userType={user?.userType}
        post={selectedPost}
        user={user}
        posts={posts}
      />
    );
  }

  // PRIVATE routes (require auth only)
  if (currentRoute.type === 'private') {
    return (
      <ProtectedRoute
        route={currentRoute}
        component={Component}
        onNavigate={onNavigate}
        fallbackComponent={Auth}
        onAddPost={handleAddPost}
      />
    );
  }

  // PROTECTED routes (require auth + user type)
  if (currentRoute.type === 'protected') {
    return (
      <ProtectedRoute
        route={currentRoute}
        component={Component}
        requiredUserTypes={currentRoute.requiredUserTypes}
        onNavigate={onNavigate}
        onAddPost={handleAddPost}
      />
    );
  }

  // Fallback
  return (
    <Home
      onNavigate={onNavigate}
      userType={user?.userType}
    />
  );
};

/**
 * Check if header should be shown for current page
 */
export const shouldShowHeader = (currentPage) => {
  const hiddenRoutes = ['posts', 'explore', 'likes', 'messages', 'notifications', 'profile', 'create-post', 'auth', 'post-ad', 'my-ads', 'privacy-and-safety', 'notification-settings', 'preferences', 'help-and-support'];
  return !hiddenRoutes.includes(currentPage);
};

/**
 * Access control UI - Shows when user denied access
 */
export const AccessDeniedUI = ({ reason, route, userType, onNavigate }) => {
  if (reason === 'NOT_AUTHENTICATED') {
    return <Auth onNavigate={onNavigate} />;
  }

  if (reason === 'INSUFFICIENT_PERMISSIONS') {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center p-8 rounded-lg bg-gray-800 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">⚠️ Access Restricted</h2>
          <p className="text-gray-300 mb-2">
            This feature requires a {route?.requiredUserTypes?.join(' or ')} subscription.
          </p>
          <p className="text-gray-400 text-sm mb-6">Your current plan: <strong className="capitalize text-blue-400">{userType}</strong></p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={() => onNavigate?.('subscription')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-6 rounded-lg transition-colors cursor-pointer"
            >
              Upgrade Now
            </button>
            <button
              onClick={() => onNavigate?.('home')}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors cursor-pointer"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
