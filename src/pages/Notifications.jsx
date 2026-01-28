import React, { useState } from 'react';
import Footer from '../components/Common/Footer.jsx';

function Notifications({ onNavigate }) {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'like', user: 'Sarah Wilson', post: 'Amsterdam sunset', time: '2 hours ago', avatar: 'https://i.pravatar.cc/150?img=10', read: false },
    { id: 2, type: 'comment', user: 'Marcus Chen', post: 'Tokyo ramen', time: '3 hours ago', avatar: 'https://i.pravatar.cc/150?img=11', read: false },
    { id: 3, type: 'follow', user: 'Lisa Wong', message: 'started following you', time: '4 hours ago', avatar: 'https://i.pravatar.cc/150?img=12', read: false },
    { id: 4, type: 'like', user: 'David Park', post: 'Brooklyn bridge sunset', time: '5 hours ago', avatar: 'https://i.pravatar.cc/150?img=13', read: true },
    { id: 5, type: 'comment', user: 'Elena Russo', post: 'Venice exploration', time: '6 hours ago', avatar: 'https://i.pravatar.cc/150?img=14', read: true },
    { id: 6, type: 'follow', user: 'Raj Kumar', message: 'started following you', time: '8 hours ago', avatar: 'https://i.pravatar.cc/150?img=15', read: true },
  ]);

  const handleMarkAsRead = (id) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const handleClear = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (notif) => {
    handleMarkAsRead(notif.id);
    if (notif.type === 'like' || notif.type === 'comment') {
      onNavigate('posts');
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'like': return '❤️';
      case 'comment': return '💬';
      case 'follow': return '👤';
      default: return '📢';
    }
  };

  const getColor = (type) => {
    switch(type) {
      case 'like': return 'text-red-500';
      case 'comment': return 'text-blue-500';
      case 'follow': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <>
    {/* Mobile Top Bar with DhvaniCast Logo */}
    <div className="lg:hidden sticky top-0 z-40 bg-black/70 backdrop-blur-md border-b border-gray-800/50 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onNavigate('home')}>
        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-xl">
          <span className="text-lg text-white">🌍</span>
        </div>
        <span className="text-lg font-bold text-white">DhvaniCast</span>
      </div>
    </div>
    
    <div className="w-full bg-gray-900 flex">
      {/* LEFT SIDEBAR */}
      <aside className="hidden lg:block w-64 bg-gray-950 border-r border-gray-800 p-6 fixed left-0 top-14 h-screen overflow-y-auto z-40 scrollbar-hide">
        <div className="mb-8">
          <h1 className="text-2xl font-bold shine-text cursor-pointer bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent" onClick={() => onNavigate('home')}>DhvaniCast</h1>
          <p className="text-xs text-gray-500 mt-1">Explore & Share</p>
        </div>
        
        <nav className="space-y-2">
          <button onClick={() => onNavigate('home')} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 transition-all font-medium">
            <span className="text-lg">🏠</span>
            <span>Home</span>
          </button>
          
          <button onClick={() => onNavigate('posts')} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 transition-all font-medium">
            <span className="text-lg">📄</span>
            <span>Posts</span>
          </button>
          
          <button onClick={() => alert('Search modal coming soon!')} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 transition-all font-medium">
            <span className="text-lg">⊙</span>
            <span>Search</span>
          </button>
          
          <button onClick={() => onNavigate('explore')} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 transition-all font-medium">
            <span className="text-lg">◈</span>
            <span>Explore</span>
          </button>
          
          <button onClick={() => onNavigate('likes')} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 transition-all font-medium">
            <span className="text-lg">♡</span>
            <span>Likes</span>
          </button>
          
          <button onClick={() => onNavigate('messages')} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 transition-all font-medium">
            <span className="text-lg">✉</span>
            <span>Messages</span>
          </button>
          
          <button onClick={() => alert('Create post!')} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-blue-400 transition-all font-medium">
            <span className="text-lg">⊕</span>
            <span>Create</span>
          </button>
          
          <button onClick={() => onNavigate('profile')} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 transition-all font-medium">
            <span className="text-lg">⚙</span>
            <span>Profile</span>
          </button>
        </nav>
      </aside>

      {/* CENTER CONTENT */}
      <section className="flex-1 ml-64 mr-80 py-4 px-4 pb-20">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-100 mb-8">🔔 Notifications</h1>
          
          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div 
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`rounded-xl p-4 border cursor-pointer flex items-center gap-4 transition-all ${
                    notif.read 
                      ? 'bg-gray-800 border-gray-700 hover:border-blue-500/50' 
                      : 'bg-blue-900/30 border-blue-500/50 hover:bg-blue-900/50 hover:border-blue-400'
                  }`}
                >
                  <img src={notif.avatar} alt={notif.user} className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <p className={`${notif.read ? 'text-gray-100' : 'text-blue-100 font-semibold'}`}>
                      <span className="font-semibold hover:text-blue-400">{notif.user}</span>
                      {notif.type === 'like' && ` liked your post "${notif.post}"`}
                      {notif.type === 'comment' && ` commented on "${notif.post}"`}
                      {notif.type === 'follow' && ` ${notif.message}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-2xl ${getColor(notif.type)}`}>{getIcon(notif.type)}</span>
                    {!notif.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
                <p className="text-gray-400 text-lg">No notifications yet</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* RIGHT SIDEBAR */}
      <aside className="hidden lg:block w-80 bg-gray-950 border-l border-gray-800 p-6 fixed right-0 top-14 h-screen overflow-y-auto z-40 scrollbar-hide">
        <h2 className="text-sm font-bold text-gray-300 mb-6 uppercase tracking-wider">Quick Actions</h2>
        <div className="space-y-3">
          <button 
            onClick={handleMarkAllAsRead}
            disabled={notifications.every(n => n.read)}
            className="w-full text-left px-4 py-3 bg-blue-900/30 border border-blue-500/50 rounded-lg hover:bg-blue-900/50 disabled:bg-gray-800 disabled:border-gray-700 disabled:text-gray-500 text-blue-400 transition-all font-medium disabled:cursor-not-allowed"
          >
            Mark all as read
          </button>
          <button 
            onClick={handleClear}
            disabled={notifications.length === 0}
            className="w-full text-left px-4 py-3 bg-red-900/30 border border-red-500/50 rounded-lg hover:bg-red-900/50 disabled:bg-gray-800 disabled:border-gray-700 disabled:text-gray-500 text-red-400 transition-all font-medium disabled:cursor-not-allowed"
          >
            Clear all
          </button>
          <button 
            onClick={() => alert('Notification settings coming soon!')}
            className="w-full text-left px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-blue-500 text-gray-300 transition-all"
          >
            Notification settings
          </button>
        </div>
      </aside>

      <Footer />
    </div>
    </>
  );
}

export default Notifications;
