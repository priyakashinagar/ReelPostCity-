import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

function Header({ currentPage, onNavigate }) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getBadge = (userType) => {
    if (userType === 'premium') return '💎';
    if (userType === 'vip') return '👑';
    return '';
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      onNavigate('home');
      setMobileMenuOpen(false);
    }
  };

  const handleNavigation = (page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <>
    <header className="bg-black/70 backdrop-blur-md border-b border-gray-800/50 sticky top-0 z-50 shadow-lg shadow-black/20 navbar-bottom-shine text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleNavigation('home')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-xl relative overflow-hidden blue-shine-border">
              <span className="text-xl text-white z-10">🌍</span>
              {/* Animated blue shine */}
              <span className="absolute inset-0 rounded-lg pointer-events-none animate-shine bg-gradient-to-br from-blue-300/40 via-blue-400/60 to-blue-600/40 blur-sm opacity-80" />
            </div>
            <span className="hidden sm:block text-xl font-bold shine-text" style={{cursor:'pointer'}} onClick={() => handleNavigation('home')}>DhvaniCast</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-white">
            <button
              className={`font-medium cursor-pointer transition-colors ${
                currentPage === 'home'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-white hover:text-blue-400'
              }`}
              onClick={() => handleNavigation('home')}
            >
              Home
            </button>
            <button
              onClick={() => handleNavigation('posts')}
              className={`font-medium cursor-pointer transition-colors ${
                currentPage === 'posts'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-white hover:text-blue-400'
              }`}
            >
              Post
            </button>
            <button
              onClick={() => handleNavigation('about')}
              className={`font-medium cursor-pointer transition-colors ${
                currentPage === 'about'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-white hover:text-blue-400'
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => handleNavigation('contact')}
              className={`font-medium cursor-pointer transition-colors ${
                currentPage === 'contact'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-white hover:text-blue-400'
              }`}
            >
              Contact Us
            </button>
            {user && (
              <>
                <button
                  onClick={() => handleNavigation('post-ad')}
                  className={`font-medium cursor-pointer transition-colors ${
                    currentPage === 'post-ad'
                      ? 'text-red-400 border-b-2 border-red-400'
                      : 'text-white hover:text-blue-400'
                  }`}
                >
                  📢 Post Ad
                </button>
                <button
                  onClick={() => handleNavigation('my-ads')}
                  className={`font-medium cursor-pointer transition-colors ${
                    currentPage === 'my-ads'
                      ? 'text-red-400 border-b-2 border-red-400'
                      : 'text-white hover:text-blue-400'
                  }`}
                >
                  My Ads
                </button>
              </>
            )}
            <button
              onClick={() => handleNavigation('subscription')}
              className={`font-medium cursor-pointer transition-colors px-3 py-1 rounded-lg ${
                currentPage === 'subscription'
                  ? 'bg-blue-500 text-white'
                  : 'text-yellow-400 hover:text-yellow-300 border border-yellow-400/50 hover:border-yellow-400'
              }`}
            >
              ✨ Upgrade
            </button>
          </nav>

          {/* Hamburger Menu for Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2 -mr-2 hover:bg-gray-800/50 rounded-lg transition-colors"
            title="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ease-out ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ease-out ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ease-out ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>

          {/* Right Side - User Info & Logout */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* User Info */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/20 border border-blue-500/50">
                  <img
                    src={user.profileImg}
                    alt={user.username}
                    className="w-7 h-7 rounded-full"
                  />
                  <div>
                    <p className="text-xs text-gray-300 font-bold">{user.username}</p>
                    <p className="text-xs text-blue-400">{user.userType.toUpperCase()}</p>
                  </div>
                </div>

                {/* User Badge */}
                {getBadge(user.userType) && (
                  <span className="text-xl" title={`${user.userType} User`}>
                    {getBadge(user.userType)}
                  </span>
                )}

                {/* Profile & Logout Buttons */}
                <button
                  onClick={() => onNavigate('profile')}
                  className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md shadow-blue-400/50 hover:shadow-lg hover:shadow-blue-400/70 transition-shadow"
                  title="Go to profile"
                >
                  {user.username.charAt(0).toUpperCase()}
                </button>

                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/50 rounded-lg font-bold text-xs transition"
                  title="Logout"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => onNavigate('auth')}
                className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold text-xs transition"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>

    {/* Mobile Menu - Overlays content */}
    {mobileMenuOpen && (
      <>
        {/* Backdrop */}
        <div className="fixed inset-0 top-14 bg-black/50 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>
        
        {/* Menu Panel - Narrow width from right */}
        <div className="fixed right-0 top-14 bottom-0 w-72 bg-black/95 backdrop-blur-md z-40 md:hidden border-l border-blue-500/30 shadow-2xl overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
            title="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <nav className="flex flex-col p-4 pt-12 space-y-2">
          <button
            onClick={() => handleNavigation('home')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
              currentPage === 'home'
                ? 'bg-blue-500/30 text-blue-300'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            🏠 Home
          </button>
          <button
            onClick={() => handleNavigation('posts')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
              currentPage === 'posts'
                ? 'bg-blue-500/30 text-blue-300'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            📝 Post
          </button>
          <button
            onClick={() => handleNavigation('explore')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
              currentPage === 'explore'
                ? 'bg-blue-500/30 text-blue-300'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            🔍 Explore
          </button>
          <button
            onClick={() => handleNavigation('likes')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
              currentPage === 'likes'
                ? 'bg-blue-500/30 text-blue-300'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            ❤️ Likes
          </button>
          <button
            onClick={() => handleNavigation('messages')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
              currentPage === 'messages'
                ? 'bg-blue-500/30 text-blue-300'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            💬 Messages
          </button>
          <button
            onClick={() => handleNavigation('create-post')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
              currentPage === 'create-post'
                ? 'bg-blue-500/30 text-blue-300'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            ✏️ Create
          </button>
          <button
            onClick={() => handleNavigation('about')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
              currentPage === 'about'
                ? 'bg-blue-500/30 text-blue-300'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            ℹ About Us
          </button>
          <button
            onClick={() => handleNavigation('contact')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
              currentPage === 'contact'
                ? 'bg-blue-500/30 text-blue-300'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            📞 Contact Us
          </button>
          {user && (
            <>
              <div className="border-t border-gray-700 my-2"></div>
              <button
                onClick={() => handleNavigation('post-ad')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  currentPage === 'post-ad'
                    ? 'bg-red-500/30 text-red-300'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                📢 Post Ad
              </button>
              <button
                onClick={() => handleNavigation('my-ads')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  currentPage === 'my-ads'
                    ? 'bg-red-500/30 text-red-300'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                📋 My Ads
              </button>
              <button
                onClick={() => handleNavigation('profile')}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  currentPage === 'profile'
                    ? 'bg-blue-500/30 text-blue-300'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                👤 Profile
              </button>
              <div className="border-t border-gray-700 my-2"></div>
            </>
          )}
          <button
            onClick={() => handleNavigation('subscription')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
              currentPage === 'subscription'
                ? 'bg-blue-500/30 text-blue-300'
                : 'text-yellow-400 hover:bg-gray-800'
            }`}
          >
            ✨ Upgrade
          </button>
          {user ? (
            <>
              <div className="border-t border-gray-700 my-2"></div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-lg font-medium text-red-400 hover:bg-red-500/20 transition-colors"
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <div className="border-t border-gray-700 my-2"></div>
              <button
                onClick={() => handleNavigation('auth')}
                className="w-full text-left px-4 py-3 rounded-lg font-medium text-blue-300 bg-blue-500/20 hover:bg-blue-500/30 transition-colors"
              >
                🔐 Sign In
              </button>
            </>
          )}
        </nav>
        </div>
      </>
    )}
    </>
  );
}

export default Header;
