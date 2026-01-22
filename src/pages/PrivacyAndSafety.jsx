import React, { useState } from 'react';

function PrivacyAndSafety({ onNavigate }) {
  const [settings, setSettings] = useState({
    profileVisibility: 'public',
    whoCanMessage: 'everyone',
    allowComments: true,
    allowTags: false,
  });

  const handleBack = () => {
    onNavigate('profile');
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('privacySettings', JSON.stringify(settings));
    alert('Privacy settings saved successfully!');
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-blue-700/60 px-4 py-3 flex items-center gap-3 shadow-md">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-blue-900 rounded-lg transition-colors text-white hover:text-blue-400"
          title="Go back"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
          <span className="text-blue-400">🔒</span> Privacy & Safety
        </h1>
      </div>

      <div className="w-full bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 min-h-screen pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center gap-3 mb-8">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-blue-900 rounded-lg transition-colors text-white hover:text-blue-400"
              title="Go back"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <span className="text-blue-400">🔒</span> Privacy & Safety
            </h1>
          </div>

          {/* Settings Card */}
          <div className="bg-gradient-to-br from-gray-800/90 to-gray-750/80 rounded-2xl p-6 md:p-10 border border-blue-700/40 shadow-xl space-y-10">
            {/* Profile Visibility */}
            <div>
              <h2 className="text-xl font-bold text-gray-100 mb-4">Profile Visibility</h2>
              <p className="text-gray-400 text-sm mb-4">Choose who can see your profile</p>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-800/50 transition-all border border-gray-700">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={settings.profileVisibility === 'public'}
                    onChange={(e) => handleChange('profileVisibility', e.target.value)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="text-gray-300 font-medium">Public</p>
                    <p className="text-gray-500 text-sm">Everyone can see your profile</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-800/50 transition-all border border-gray-700">
                  <input
                    type="radio"
                    name="visibility"
                    value="followers"
                    checked={settings.profileVisibility === 'followers'}
                    onChange={(e) => handleChange('profileVisibility', e.target.value)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="text-gray-300 font-medium">Followers Only</p>
                    <p className="text-gray-500 text-sm">Only your followers can see your profile</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-800/50 transition-all border border-gray-700">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={settings.profileVisibility === 'private'}
                    onChange={(e) => handleChange('profileVisibility', e.target.value)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="text-gray-300 font-medium">Private</p>
                    <p className="text-gray-500 text-sm">Only you can see your profile</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="border-t border-gray-700"></div>

            {/* Messaging */}
            <div>
              <h2 className="text-xl font-bold text-gray-100 mb-4">Messaging</h2>
              <p className="text-gray-400 text-sm mb-4">Control who can message you</p>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-800/50 transition-all border border-gray-700">
                  <input
                    type="radio"
                    name="messaging"
                    value="everyone"
                    checked={settings.whoCanMessage === 'everyone'}
                    onChange={(e) => handleChange('whoCanMessage', e.target.value)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="text-gray-300 font-medium">Everyone</p>
                    <p className="text-gray-500 text-sm">Anyone can send you messages</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-800/50 transition-all border border-gray-700">
                  <input
                    type="radio"
                    name="messaging"
                    value="followers"
                    checked={settings.whoCanMessage === 'followers'}
                    onChange={(e) => handleChange('whoCanMessage', e.target.value)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="text-gray-300 font-medium">Followers Only</p>
                    <p className="text-gray-500 text-sm">Only followers can message you</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="border-t border-gray-700"></div>

            {/* Interactions */}
            <div>
              <h2 className="text-xl font-bold text-gray-100 mb-4">Interactions</h2>
              <p className="text-gray-400 text-sm mb-4">Control how others interact with your posts</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-700">
                  <div>
                    <p className="text-gray-300 font-medium">Allow Comments</p>
                    <p className="text-gray-500 text-sm">Let others comment on your posts</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.allowComments}
                    onChange={(e) => handleChange('allowComments', e.target.checked)}
                    className="w-5 h-5 rounded"
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-700">
                  <div>
                    <p className="text-gray-300 font-medium">Allow Tags</p>
                    <p className="text-gray-500 text-sm">Let others tag you in posts</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.allowTags}
                    onChange={(e) => handleChange('allowTags', e.target.checked)}
                    className="w-5 h-5 rounded"
                  />
                </div>
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
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PrivacyAndSafety;
