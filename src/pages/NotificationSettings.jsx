import React, { useState } from 'react';

function NotificationSettings({ onNavigate }) {
  const [settings, setSettings] = useState({
    messageNotifications: true,
    likeNotifications: true,
    commentNotifications: true,
    followNotifications: true,
    emailNotifications: false,
    pushNotifications: true,
  });

  const handleBack = () => {
    onNavigate('profile');
  };

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    alert('Notification settings saved successfully!');
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
          <span className="text-blue-400">🔔</span> Notification Settings
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
              <span className="text-blue-400">🔔</span> Notification Settings
            </h1>
          </div>

          {/* Settings Card */}
          <div className="bg-gradient-to-br from-gray-800/90 to-gray-750/80 rounded-2xl p-6 md:p-10 border border-blue-700/40 shadow-xl space-y-8">
            <h2 className="text-2xl font-bold text-blue-300 mb-6 flex items-center gap-2">
              <span>📱</span> In-App Notifications
            </h2>
            <div className="border-t border-blue-700/30 mb-4"></div>
            
            {/* Message Notifications */}
            <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-blue-500/30 transition-all">
              <div>
                <p className="text-gray-300 font-medium">💬 Messages</p>
                <p className="text-gray-500 text-sm">Get notified when you receive new messages</p>
              </div>
              <button
                onClick={() => handleToggle('messageNotifications')}
                className={`relative w-12 h-7 rounded-full transition-all ${
                  settings.messageNotifications ? 'bg-blue-600' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-all ${
                    settings.messageNotifications ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>

            {/* Like Notifications */}
            <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-blue-500/30 transition-all">
              <div>
                <p className="text-gray-300 font-medium">❤️ Likes</p>
                <p className="text-gray-500 text-sm">Get notified when someone likes your posts</p>
              </div>
              <button
                onClick={() => handleToggle('likeNotifications')}
                className={`relative w-12 h-7 rounded-full transition-all ${
                  settings.likeNotifications ? 'bg-blue-600' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-all ${
                    settings.likeNotifications ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>

            {/* Comment Notifications */}
            <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-blue-500/30 transition-all">
              <div>
                <p className="text-gray-300 font-medium">💬 Comments</p>
                <p className="text-gray-500 text-sm">Get notified when someone comments on your posts</p>
              </div>
              <button
                onClick={() => handleToggle('commentNotifications')}
                className={`relative w-12 h-7 rounded-full transition-all ${
                  settings.commentNotifications ? 'bg-blue-600' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-all ${
                    settings.commentNotifications ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>

            {/* Follow Notifications */}
            <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-blue-500/30 transition-all">
              <div>
                <p className="text-gray-300 font-medium">👥 Follows</p>
                <p className="text-gray-500 text-sm">Get notified when someone follows you</p>
              </div>
              <button
                onClick={() => handleToggle('followNotifications')}
                className={`relative w-12 h-7 rounded-full transition-all ${
                  settings.followNotifications ? 'bg-blue-600' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-all ${
                    settings.followNotifications ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>

            <div className="border-t border-gray-700 my-6"></div>

            <h2 className="text-xl font-bold text-gray-100 mb-6">Notification Methods</h2>

            {/* Push Notifications */}
            <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-blue-500/30 transition-all">
              <div>
                <p className="text-gray-300 font-medium">🔔 Push Notifications</p>
                <p className="text-gray-500 text-sm">Send notifications to your browser</p>
              </div>
              <button
                onClick={() => handleToggle('pushNotifications')}
                className={`relative w-12 h-7 rounded-full transition-all ${
                  settings.pushNotifications ? 'bg-blue-600' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-all ${
                    settings.pushNotifications ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>

            {/* Email Notifications */}
            <div className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-blue-500/30 transition-all">
              <div>
                <p className="text-gray-300 font-medium">📧 Email Notifications</p>
                <p className="text-gray-500 text-sm">Send notifications to your email</p>
              </div>
              <button
                onClick={() => handleToggle('emailNotifications')}
                className={`relative w-12 h-7 rounded-full transition-all ${
                  settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-all ${
                    settings.emailNotifications ? 'translate-x-5' : ''
                  }`}
                />
              </button>
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

export default NotificationSettings;
