import React, { useState } from 'react';

function Likes({ onNavigate }) {
  const [likedPosts] = useState([
    { id: 1, type: 'image', city: 'Amsterdam', title: 'Golden hour at the canals', author: 'Sarah Wilson', image: 'https://picsum.photos/400/300?random=101', date: '2 hours ago', likes: 1234 },
    { id: 2, type: 'image', city: 'Amsterdam', title: 'Street art in the Red Light District', author: 'Sarah Wilson', image: 'https://picsum.photos/400/300?random=102', date: '3 hours ago', likes: 845 },
    { id: 3, type: 'image', city: 'Tokyo', title: 'Cherry blossoms at Ueno Park', author: 'Marcus Chen', image: 'https://picsum.photos/400/300?random=106', date: '8 hours ago', likes: 5123 },
    { id: 4, type: 'image', city: 'Bali', title: 'Sunrise at Tanah Lot Temple', author: 'Lisa Wong', image: 'https://picsum.photos/400/300?random=108', date: '11 hours ago', likes: 5876 },
    { id: 5, type: 'image', city: 'New York', title: 'Times Square at midnight', author: 'David Park', image: 'https://picsum.photos/400/300?random=110', date: '14 hours ago', likes: 6789 },
  ]);

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
          
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg bg-blue-900/30 border border-blue-500/50 text-gray-100 font-medium hover:bg-blue-900/50 transition-all">
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
          
          <button onClick={() => onNavigate('profile')} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 transition-all font-medium">
            <span className="text-lg">⚙</span>
            <span>Profile</span>
          </button>
        </nav>
      </aside>

      {/* CENTER CONTENT */}
      <section className="flex-1 ml-64 mr-80 py-8 px-4 pb-20 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 blue-shine-border rounded-2xl">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-100 mb-2 flex items-center gap-3">
              <span className="text-4xl">❤️</span> Your Liked Posts
            </h1>
            <p className="text-gray-400">All posts you've loved and saved</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {likedPosts.map((post) => (
              <div 
                key={post.id}
                className="group bg-gradient-to-br from-gray-800 to-gray-750 rounded-2xl overflow-hidden hover:shadow-2xl shadow-lg shadow-blue-400/20 transition-all border border-gray-700 hover:border-blue-400/50 hover:scale-105 duration-300 cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden bg-gray-900">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                  
                  {/* Location Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-2 bg-blue-600/90 backdrop-blur-sm text-blue-50 text-sm font-bold rounded-full border border-blue-400/30 shadow-lg">
                      📍 {post.city}
                    </span>
                  </div>

                  {/* Likes Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-red-600/90 backdrop-blur-sm text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                      ❤️ {post.likes.toLocaleString()}
                    </span>
                  </div>

                  {/* Play overlay if video */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/50">
                        <span className="text-white text-xl">▶</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-100 group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-1 mb-3">by {post.author}</p>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-600">
                    <span className="text-xs text-gray-500">{post.date}</span>
                    <button className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-full transition-all">
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {likedPosts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No liked posts yet</p>
              <p className="text-gray-500 text-sm mt-2">Start exploring and liking posts!</p>
            </div>
          )}
        </div>
      </section>

      {/* RIGHT SIDEBAR */}
      <aside className="w-80 bg-gray-950 border-l border-blue-500/70 blue-shine-border p-6 fixed right-0 h-screen overflow-y-auto z-40">
        <h2 className="text-sm font-bold text-gray-300 mb-6 uppercase tracking-wider">Stats</h2>
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-2xl font-bold text-red-500">{likedPosts.length}</p>
            <p className="text-sm text-gray-400 mt-1">Posts liked</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-2xl font-bold text-blue-500">{likedPosts.reduce((a, b) => a + b.likes, 0).toLocaleString()}</p>
            <p className="text-sm text-gray-400 mt-1">Total likes on liked posts</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700">
          <h3 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-wider">Top Cities</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Amsterdam</span>
              <span className="text-gray-500">2 posts</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Tokyo</span>
              <span className="text-gray-500">1 post</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Bali</span>
              <span className="text-gray-500">1 post</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
    </>
  );
}

export default Likes;
