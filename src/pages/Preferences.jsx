import React, { useState } from 'react';

function Preferences({ onNavigate }) {
  const [settings, setSettings] = useState({
    theme: 'dark',
    layout: 'default',
    language: 'english',
    fontSize: 'medium',
    autoPlayVideos: true,
    showExplicitContent: false,
  });

  const handleBack = () => {
    onNavigate('profile');
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('preferences', JSON.stringify(settings));
    alert('Preferences saved successfully!');
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-black/70 backdrop-blur-md border-b border-gray-800/50 px-4 py-3 flex items-center gap-3">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-white hover:text-blue-400"
          title="Go back"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-white">Preferences</h1>
      </div>

      <div className="w-full bg-gray-900 min-h-screen pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center gap-3 mb-8">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-white hover:text-blue-400"
              title="Go back"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-4xl font-bold text-white">⚙️ Preferences</h1>
          </div>

          {/* Settings Card */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-750 rounded-2xl p-6 md:p-8 border border-gray-700 space-y-8">
            {/* Display Preferences */}
            <div>
              <h2 className="text-xl font-bold text-gray-100 mb-4">Display</h2>
              
              {/* Theme */}
              <div className="mb-6">
                <label className="text-gray-300 font-medium block mb-3">🎨 Theme</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-800/50 transition-all border border-gray-700">
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      checked={settings.theme === 'dark'}
                      onChange={(e) => handleChange('theme', e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-300">Dark Mode (Default)</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-800/50 transition-all border border-gray-700">
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      checked={settings.theme === 'light'}
                      onChange={(e) => handleChange('theme', e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-300">Light Mode</span>
                  </label>
                </div>
              </div>

              {/* Layout */}
              <div className="mb-6">
                <label className="text-gray-300 font-medium block mb-3">📐 Layout</label>
                <select
                  value={settings.layout}
                  onChange={(e) => handleChange('layout', e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-blue-500 transition-all"
                >
                  <option value="default">Default Layout</option>
                  <option value="compact">Compact Layout</option>
                  <option value="wide">Wide Layout</option>
                </select>
              </div>

              {/* Font Size */}
              <div className="mb-6">
                <label className="text-gray-300 font-medium block mb-3">🔤 Font Size</label>
                <select
                  value={settings.fontSize}
                  onChange={(e) => handleChange('fontSize', e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-blue-500 transition-all"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium (Default)</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>

            <div className="border-t border-gray-700"></div>

            {/* Content Preferences */}
            <div>
              <h2 className="text-xl font-bold text-gray-100 mb-4">Content</h2>
              
              {/* Language */}
              <div className="mb-6">
                <label className="text-gray-300 font-medium block mb-3">🌐 Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-blue-500 transition-all"
                >
                  <option value="english">English</option>
                  <option value="hindi">हिंदी (Hindi)</option>
                  <option value="spanish">Español</option>
                  <option value="french">Français</option>
                </select>
              </div>

              {/* Auto Play Videos */}
              <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-blue-500/30 transition-all mb-4">
                <div>
                  <p className="text-gray-300 font-medium">▶️ Auto-play Videos</p>
                  <p className="text-gray-500 text-sm">Auto-play videos on feed (uses more data)</p>
                </div>
                <button
                  onClick={() => handleChange('autoPlayVideos', !settings.autoPlayVideos)}
                  className={`relative w-12 h-7 rounded-full transition-all ${
                    settings.autoPlayVideos ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-all ${
                      settings.autoPlayVideos ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Explicit Content */}
              <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-blue-500/30 transition-all">
                <div>
                  <p className="text-gray-300 font-medium">🔞 Show Explicit Content</p>
                  <p className="text-gray-500 text-sm">Allow explicit content in your feed</p>
                </div>
                <button
                  onClick={() => handleChange('showExplicitContent', !settings.showExplicitContent)}
                  className={`relative w-12 h-7 rounded-full transition-all ${
                    settings.showExplicitContent ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-all ${
                      settings.showExplicitContent ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex gap-3">
            <button
              onClick={handleBack}
              className="px-6 py-3 border border-gray-700 text-gray-300 rounded-lg hover:border-gray-600 transition-all font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Preferences;
