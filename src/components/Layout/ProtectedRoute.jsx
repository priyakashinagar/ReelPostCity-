import React from 'react';

/**
 * ProtectedRoute - Wrapper component for routes that require authentication
 * Handles both simple private routes and routes with user type restrictions
 */
function ProtectedRoute({ 
  route, 
  component: Component, 
  requiredUserTypes = null,
  fallbackComponent: FallbackComponent = null,
  onNavigate = null,
  user = null,
  isAuthenticated = false,
  ...props // Pass additional props like onAddPost
}) {
  // Not authenticated - show login prompt
  if (!isAuthenticated || !user) {
    if (FallbackComponent) {
      return <FallbackComponent onNavigate={onNavigate} />;
    }
    return (
      <div className="w-full h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center p-8 rounded-lg bg-gray-800 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">Access Restricted</h2>
          <p className="text-gray-300 mb-6">You need to log in to access this page.</p>
          <button
            onClick={() => onNavigate?.('auth')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors cursor-pointer"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Authenticated but missing required user type
  if (requiredUserTypes && !requiredUserTypes.includes(user.userType)) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center p-8 rounded-lg bg-gray-800 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">Premium Feature</h2>
          <p className="text-gray-300 mb-2">
            This feature requires a {requiredUserTypes.join(' or ')} subscription.
          </p>
          <p className="text-gray-400 text-sm mb-6">Your current plan: <strong className="capitalize text-blue-400">{user.userType}</strong></p>
          <button
            onClick={() => onNavigate?.('subscription')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-lg transition-colors cursor-pointer mb-3"
          >
            Upgrade Plan
          </button>
          <button
            onClick={() => onNavigate?.('home')}
            className="block w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-8 rounded-lg transition-colors cursor-pointer mt-2"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  // User is authorized - render the component
  return <Component onNavigate={onNavigate} userType={user.userType} {...props} />;
}

export default ProtectedRoute;
