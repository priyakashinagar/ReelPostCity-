import React from 'react';

function Header({ currentPage, onNavigate }) {
  return (
    <header className="bg-gray-800 border-b border-blue-500 sticky top-0 z-50 shadow-lg shadow-blue-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onNavigate('home')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-400/50">
              <span className="text-xl text-white">🌍</span>
            </div>
            <span className="text-xl font-bold text-white">City Posts</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              className={`font-medium cursor-pointer transition-colors ${
                currentPage === 'home'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => onNavigate('home')}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('posts')}
              className={`font-medium cursor-pointer transition-colors ${
                currentPage === 'posts'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Post
            </button>
            <button
              onClick={() => onNavigate('about')}
              className={`font-medium cursor-pointer transition-colors ${
                currentPage === 'about'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className={`font-medium cursor-pointer transition-colors ${
                currentPage === 'contact'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Contact Us
            </button>
          </nav>

          {/* User Avatar */}
          <button className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-400/50 hover:shadow-lg hover:shadow-blue-400/70 transition-shadow">
            A
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
