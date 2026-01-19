import React from 'react';

function PostDetail({ post, onNavigate }) {
  if (!post) {
    return (
      <div className="w-full min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-600 mb-6">No post selected. Please select a post to view details.</p>
          <button 
            onClick={() => onNavigate('posts')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Back to Posts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-900">
      {/* Header */}
      <section className="relative bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8" style={{backgroundImage: `url(https://picsum.photos/1200/400?random=${post.id * 15})`}}>
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative max-w-4xl mx-auto">
          <button 
            onClick={() => onNavigate('posts')}
            className="text-blue-400 hover:text-blue-300 font-semibold mb-4 flex items-center gap-2"
          >
            ← Back to Posts
          </button>
          <h1 className="text-4xl font-bold text-white">{post.title}</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <img src={`https://picsum.photos/800/400?random=${post.id * 10}`} alt={post.title} className="w-full h-96 object-cover rounded-lg mb-8 shadow-lg" />

              {/* Post Info */}
              <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-blue-500 shadow-lg shadow-blue-500/50">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{post.author}</h4>
                    <p className="text-sm text-gray-400">{post.date}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                    ❤️ Like ({post.likes})
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                    📤 Share
                  </button>
                </div>
              </div>

              {/* Post Body */}
              <div className="bg-gray-800 rounded-lg p-8 mb-8 border border-blue-500 shadow-lg shadow-blue-500/50">
                <p className="text-gray-300 leading-relaxed mb-4">
                  {post.description} This is a detailed story about the experience. 
                  The journey through this beautiful city was truly enchanting. Every corner revealed 
                  new surprises and unique perspectives. I particularly loved the historic architecture 
                  that blends perfectly with modern amenities. The local community was welcoming and 
                  shared fascinating stories about the city's rich history.
                </p>
              </div>

              {/* Tags */}
              <div className="bg-gray-800 rounded-lg p-8 mb-8 border border-blue-500 shadow-lg shadow-blue-500/50">
                <h4 className="font-semibold text-white mb-4">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, idx) => (
                    <span key={idx} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-700 transition-colors cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Comments */}
              <div className="bg-gray-800 rounded-lg p-8 border border-blue-500 shadow-lg shadow-blue-500/50">
                <h3 className="text-2xl font-bold text-white mb-6">Comments (3)</h3>
                
                <div className="space-y-6 mb-8">
                  <div className="border-b border-gray-700 pb-6">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-white">Sonya Sharma</span>
                      <span className="text-sm text-gray-400">1 hour ago</span>
                    </div>
                    <p className="text-gray-300">This is so beautiful! I would love to visit this place.</p>
                  </div>

                  <div className="border-b border-gray-700 pb-6">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-white">Amir Kumar</span>
                      <span className="text-sm text-gray-400">2 hours ago</span>
                    </div>
                    <p className="text-gray-300">Amazing photos! What camera did you use?</p>
                  </div>

                  <div className="pb-6">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-white">Priya Singh</span>
                      <span className="text-sm text-gray-400">3 hours ago</span>
                    </div>
                    <p className="text-gray-300">Brilliant! Thanks for sharing these gems.</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Write a comment..." 
                    className="flex-1 bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
                    Send
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* City Info */}
              <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-blue-500 shadow-lg shadow-blue-500/50 sticky top-24">
                <h3 className="text-lg font-bold text-white mb-4">City Info</h3>
                <div className="space-y-3 text-sm">
                  <p><strong className="text-white">City:</strong> <span className="text-gray-400">{post.city}</span></p>
                  <p><strong className="text-white">Posted:</strong> <span className="text-gray-400">{post.date}</span></p>
                  <p><strong className="text-white">Views:</strong> <span className="text-gray-400">1,245</span></p>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors mt-4">
                  View City Posts
                </button>
              </div>

              {/* Related Posts */}
              <div className="bg-gray-800 rounded-lg p-6 border border-blue-500 shadow-lg shadow-blue-500/50">
                <h3 className="text-lg font-bold text-white mb-4">Related Posts</h3>
                <div className="space-y-4">
                  <div className="flex gap-3 pb-4 border-b border-gray-700">
                    <img src="https://picsum.photos/80/60?random=8" alt="Related" className="w-20 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-sm">Another great post</h4>
                      <span className="text-xs text-gray-400">5 days ago</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <img src="https://picsum.photos/80/60?random=9" alt="Related" className="w-20 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-white text-sm">Amazing view</h4>
                      <span className="text-xs text-gray-400">1 week ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PostDetail;
