import React from 'react';

function Header({ currentPage, onNavigate }) {
  return (
    <header className="bg-black/50 backdrop-blur-md border-b border-gray-800/50 sticky top-0 z-50 shadow-lg shadow-black/20 navbar-bottom-shine">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onNavigate('home')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-xl relative overflow-hidden blue-shine-border">
              <span className="text-xl text-white z-10">🌍</span>
              {/* Animated blue shine */}
              <span className="absolute inset-0 rounded-lg pointer-events-none animate-shine bg-gradient-to-br from-blue-300/40 via-blue-400/60 to-blue-600/40 blur-sm opacity-80" />
            </div>
            <span className="text-xl font-bold shine-text" style={{cursor:'pointer'}} onClick={() => onNavigate('home')}>DhvaniCast</span>
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
