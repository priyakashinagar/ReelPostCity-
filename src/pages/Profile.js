import React from 'react';

function Profile({ onNavigate }) {
  const userProfile = {
    name: 'Travel Explorer',
    username: '@dhvanicast',
    bio: '🌍 Exploring the world one city at a time | Photography enthusiast | Adventure seeker',
    followers: 12500,
    following: 3450,
    posts: 127,
    avatar: 'https://i.pravatar.cc/150?img=50',
    coverImage: 'https://picsum.photos/1200/300?random=500',
  };

  const stats = [
    { label: 'Posts', value: userProfile.posts },
    { label: 'Followers', value: userProfile.followers.toLocaleString() },
    { label: 'Following', value: userProfile.following.toLocaleString() },
    { label: 'Engagement', value: '8.5%' },
  ];

  return (
    <>
    <div className="w-full bg-gray-900 flex">
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-gray-950 border-r border-blue-500/70 blue-shine-border p-6 fixed left-0 h-screen overflow-y-auto z-40">
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
      <section className="flex-1 ml-64 mr-80 py-8 px-4 pb-20 bg-gray-900 blue-shine-border rounded-2xl">
        <div className="w-full">
          {/* Cover Image */}
          <div className="relative h-56 rounded-2xl overflow-hidden mb-8 border-2 border-blue-500/30 shadow-2xl">
            <img src={userProfile.coverImage} alt="cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
          </div>

          {/* Profile Header */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-750 rounded-2xl p-8 border border-gray-700 mb-8 shadow-xl">
            <div className="flex items-end gap-6">
              <img 
                src={userProfile.avatar} 
                alt={userProfile.name} 
                className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg"
              />
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-100 mb-1">{userProfile.name}</h1>
                <p className="text-blue-400 text-lg font-semibold mb-3">{userProfile.username}</p>
                <p className="text-gray-300 text-sm leading-relaxed">{userProfile.bio}</p>
              </div>
              <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-12">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-800 to-gray-750 rounded-2xl p-6 border border-gray-700 text-center hover:border-blue-500 hover:shadow-xl transition-all group">
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">{stat.value}</p>
                <p className="text-sm text-gray-400 mt-2 group-hover:text-gray-300 transition-colors">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Posts Grid */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-100 mb-8 flex items-center gap-2">
              <span>📸</span> Posts Gallery
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div 
                  key={idx}
                  className="h-48 bg-gradient-to-br from-gray-800 to-gray-750 rounded-2xl border border-gray-700 hover:border-blue-500 transition-all cursor-pointer overflow-hidden group shadow-lg hover:shadow-2xl"
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
      <aside className="w-80 bg-gray-950 border-l border-blue-500/70 blue-shine-border p-6 fixed right-0 h-screen overflow-y-auto z-40">
        <h2 className="text-sm font-bold text-gray-300 mb-6 uppercase tracking-wider">Account</h2>
        <div className="space-y-3">
          <button className="w-full text-left px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-blue-500 text-gray-300 transition-all text-sm font-medium">
            📝 Edit Profile
          </button>
          <button className="w-full text-left px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-blue-500 text-gray-300 transition-all text-sm font-medium">
            🔐 Privacy & Safety
          </button>
          <button className="w-full text-left px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-blue-500 text-gray-300 transition-all text-sm font-medium">
            🔔 Notification Settings
          </button>
          <button className="w-full text-left px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-blue-500 text-gray-300 transition-all text-sm font-medium">
            ⚙ Preferences
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700">
          <h3 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-wider">Other</h3>
          <button className="w-full text-left px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-blue-500 text-gray-300 transition-all text-sm">
            Help & Support
          </button>
          <button className="w-full text-left px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg hover:border-red-500 text-gray-300 transition-all text-sm mt-2">
            🚪 Logout
          </button>
        </div>
      </aside>
    </div>

    </>
  );
}

export default Profile;
