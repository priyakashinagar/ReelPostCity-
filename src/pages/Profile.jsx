import React, { useState } from 'react';

function Profile({ onNavigate }) {
  const [userProfile, setUserProfile] = useState({
    name: 'Travel Explorer',
    username: '@dhvanicast',
    bio: '🌍 Exploring the world one city at a time | Photography enthusiast | Adventure seeker',
    followers: 12500,
    following: 3450,
    posts: 127,
    avatar: 'https://i.pravatar.cc/150?img=50',
    coverImage: 'https://picsum.photos/1200/300?random=500',
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: userProfile.name,
    username: userProfile.username,
    bio: userProfile.bio,
  });

  const handleEditSubmit = () => {
    setUserProfile(prev => ({
      ...prev,
      name: editForm.name,
      username: editForm.username,
      bio: editForm.bio,
    }));
    setEditModalOpen(false);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onNavigate('auth');
    }
  };

  const stats = [
    { label: 'Posts', value: userProfile.posts },
    { label: 'Followers', value: userProfile.followers.toLocaleString() },
    { label: 'Following', value: userProfile.following.toLocaleString() },
    { label: 'Engagement', value: '8.5%' },
  ];

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
    
    <div className="w-full bg-gray-900 flex flex-col lg:flex-row">
      {/* LEFT SIDEBAR */}
      <aside className="hidden lg:block w-64 bg-gray-950 border-r border-blue-500/70 blue-shine-border p-6 h-screen overflow-y-auto z-40 fixed left-0 top-20 bottom-0">
        <div className="mb-8">
          <h1 className="text-2xl font-bold shine-text cursor-pointer bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent" onClick={() => onNavigate('home')}>DhvaniCast</h1>
          <p className="text-xs text-gray-500 mt-1">Explore & Share</p>
        </div>
        
        <nav className="space-y-2">
          <button onClick={() => onNavigate('posts')} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 transition-all font-medium">
            <span className="text-lg">■</span>
            <span>Home</span>
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
          
          <button onClick={() => onNavigate('create-post')} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-blue-400 transition-all font-medium">
            <span className="text-lg">⊕</span>
            <span>Create</span>
          </button>
          
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg bg-blue-900/30 border border-blue-500/50 text-gray-100 font-medium hover:bg-blue-900/50 transition-all">
            <span className="text-lg">⚙</span>
            <span>Profile</span>
          </button>
        </nav>
      </aside>

      {/* CENTER CONTENT */}
      <section className="w-full lg:flex-1 lg:ml-64 lg:mr-80 py-8 px-4 pb-20 bg-gray-900 blue-shine-border rounded-2xl">
        <div className="w-full">
          {/* Cover Image */}
          <div className="relative h-40 md:h-56 rounded-2xl overflow-hidden mb-8 border-2 border-blue-500/30 shadow-2xl">
            <img src={userProfile.coverImage} alt="cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
          </div>

          {/* Profile Header */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-750 rounded-2xl p-4 md:p-8 border border-gray-700 mb-8 shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-6">
              <img 
                src={userProfile.avatar} 
                alt={userProfile.name} 
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-blue-500 shadow-lg flex-shrink-0"
              />
              <div className="flex-1 w-full md:w-auto">
                <h1 className="text-2xl md:text-4xl font-bold text-gray-100 mb-1">{userProfile.name}</h1>
                <p className="text-blue-400 text-base md:text-lg font-semibold mb-3">{userProfile.username}</p>
                <p className="text-gray-300 text-sm leading-relaxed">{userProfile.bio}</p>
              </div>
              <button 
                onClick={() => setEditModalOpen(true)}
                className="w-full md:w-auto px-4 md:px-8 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl text-sm md:text-base">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-8 md:mb-12">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-800 to-gray-750 rounded-xl md:rounded-2xl p-3 md:p-6 border border-gray-700 text-center hover:border-blue-500 hover:shadow-xl transition-all group">
                <p className="text-xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">{stat.value}</p>
                <p className="text-xs md:text-sm text-gray-400 mt-1 md:mt-2 group-hover:text-gray-300 transition-colors">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Posts Grid */}
          <div className="mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-100 mb-6 md:mb-8 flex items-center gap-2">
              <span>📸</span> Posts Gallery
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div 
                  key={idx}
                  className="h-32 md:h-48 bg-gradient-to-br from-gray-800 to-gray-750 rounded-lg md:rounded-2xl border border-gray-700 hover:border-blue-500 transition-all cursor-pointer overflow-hidden group shadow-lg hover:shadow-2xl"
                >
                  <img 
                    src={`https://picsum.photos/300/300?random=${idx + 501}`} 
                    alt={`Post ${idx}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT SIDEBAR */}
      <aside className="hidden lg:block w-80 bg-gray-950 border-l border-blue-500/70 blue-shine-border p-6 fixed right-0 top-20 bottom-0 h-screen overflow-y-auto z-40">
        <h2 className="text-sm font-bold text-gray-300 mb-6 uppercase tracking-wider">Account</h2>
        <div className="space-y-3">
          <button 
            onClick={() => setEditModalOpen(true)}
            className="w-full text-left px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-blue-500 text-gray-300 transition-all text-sm font-medium">
            📝 Edit Profile
          </button>
          <button onClick={() => alert('Privacy & Safety settings coming soon!')} className="w-full text-left px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-blue-500 text-gray-300 transition-all text-sm font-medium">
            🔐 Privacy & Safety
          </button>
          <button onClick={() => alert('Notification Settings coming soon!')} className="w-full text-left px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-blue-500 text-gray-300 transition-all text-sm font-medium">
            🔔 Notification Settings
          </button>
          <button onClick={() => alert('Preferences coming soon!')} className="w-full text-left px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-blue-500 text-gray-300 transition-all text-sm font-medium">
            ⚙ Preferences
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700">
          <h3 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-wider">Other</h3>
          <button onClick={() => alert('Help & Support coming soon!')} className="w-full text-left px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-blue-500 text-gray-300 transition-all text-sm">
            Help & Support
          </button>
          <button 
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-red-500 text-gray-300 transition-all text-sm mt-2 hover:text-red-400">
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* EDIT PROFILE MODAL */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-6 md:p-8 w-full max-w-md border border-blue-500/30 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">Edit Profile</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-semibold text-gray-300 block mb-2">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-300 block mb-2">Username</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-300 block mb-2">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  rows="4"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 transition-all resize-none"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setEditModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:border-gray-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

    </>
  );
}

export default Profile;
