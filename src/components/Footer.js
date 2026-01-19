import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">cityexplorer posts</h3>
            <p className="text-sm">Discover amazing cities and share your travel experiences with the world.</p>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a className="hover:text-blue-400 transition-colors cursor-pointer" role="button" tabIndex="0">Home</a></li>
              <li><a className="hover:text-blue-400 transition-colors cursor-pointer" role="button" tabIndex="0">Posts</a></li>
              <li><a className="hover:text-blue-400 transition-colors cursor-pointer" role="button" tabIndex="0">About Us</a></li>
              <li><a className="hover:text-blue-400 transition-colors cursor-pointer" role="button" tabIndex="0">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a className="hover:text-blue-400 transition-colors cursor-pointer" role="button" tabIndex="0">Help Center</a></li>
              <li><a className="hover:text-blue-400 transition-colors cursor-pointer" role="button" tabIndex="0">FAQ</a></li>
              <li><a className="hover:text-blue-400 transition-colors cursor-pointer" role="button" tabIndex="0">Support</a></li>
              <li><a className="hover:text-blue-400 transition-colors cursor-pointer" role="button" tabIndex="0">Feedback</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Connect With Us</h3>
            <ul className="space-y-2 text-sm">
              <li><a className="hover:text-blue-400 transition-colors cursor-pointer" role="button" tabIndex="0">Facebook</a></li>
              <li><a className="hover:text-blue-400 transition-colors cursor-pointer" role="button" tabIndex="0">Twitter</a></li>
              <li><a className="hover:text-blue-400 transition-colors cursor-pointer" role="button" tabIndex="0">Instagram</a></li>
              <li><a className="hover:text-blue-400 transition-colors cursor-pointer" role="button" tabIndex="0">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm">&copy; 2026 City Explorer. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <a className="hover:text-blue-400 transition-colors cursor-pointer" role="button" tabIndex="0">Privacy Policy</a>
            <a className="hover:text-blue-400 transition-colors cursor-pointer" role="button" tabIndex="0">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
