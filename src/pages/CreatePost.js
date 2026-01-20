import React, { useState } from 'react';


function CreatePost({ onNavigate }) {
  const [formData, setFormData] = useState({
    caption: '',
    tags: '',
    city: '',
    type: 'image',
    image: 'https://picsum.photos/500/300?random=50'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({
          ...formData,
          image: event.target?.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Post published successfully!');
    onNavigate('posts');
  };

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
          
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg bg-blue-900/30 border border-blue-500/50 text-gray-100 font-medium hover:bg-blue-900/50 transition-all">
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
      <section className="flex-1 ml-64 mr-80 py-8 px-4 pb-20 bg-gray-900 blue-shine-border rounded-2xl">
        <div className="w-full">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-100 mb-2">✨ Create New Post</h1>
            <p className="text-gray-400">Share your amazing travel experience with the community</p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Column */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-4">
              {/* Post Type Selection */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-750 rounded-2xl p-6 border border-gray-700 shadow-lg shadow-blue-400/20">
                <h3 className="text-lg font-bold text-gray-100 mb-4">Post Type</h3>
                <div className="grid grid-cols-4 gap-3">
                  {['image', 'video', 'thought', 'poll'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({...formData, type})}
                      className={`p-4 rounded-xl border-2 transition-all font-semibold capitalize ${
                        formData.type === type
                          ? 'border-blue-500 bg-blue-900/30 text-blue-300'
                          : 'border-gray-600 bg-gray-700/50 text-gray-400 hover:border-gray-500'
                      }`}
                    >
                      {type === 'image' && '🖼'} {type === 'video' && '🎥'} {type === 'thought' && '💭'} {type === 'poll' && '📊'}
                      <div className="text-xs mt-1">{type}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Area */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-750 rounded-2xl p-6 border-2 border-dashed border-blue-400/30 hover:border-blue-400 transition-all shadow-lg shadow-blue-400/20 hover:shadow-blue-400/40">
                <div className="text-center">
                  <div className="text-4xl mb-3">📷</div>
                  <h3 className="text-lg font-bold text-gray-100 mb-1">Upload Your Photo</h3>
                  <p className="text-gray-400 mb-1 text-sm">Drag and drop or click to upload</p>
                  <p className="text-xs text-gray-500">Max 5MB • PNG, JPG, GIF</p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="w-full cursor-pointer mt-3"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              {/* Caption */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-750 rounded-2xl p-6 border border-gray-700 shadow-lg shadow-blue-400/20">
                <label className="block text-sm font-bold text-gray-200 mb-3 uppercase tracking-wider">
                  Caption
                </label>
                <textarea
                  name="caption"
                  className="w-full bg-gray-700/50 border border-gray-600 text-gray-100 rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  rows="3"
                  placeholder="Share the story behind this photo..."
                  value={formData.caption}
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-500 mt-2">{formData.caption.length}/500 characters</p>
              </div>

              {/* City Selection */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-750 rounded-2xl p-6 border border-gray-700 shadow-lg shadow-blue-400/20">
                <label className="block text-sm font-bold text-gray-200 mb-3 uppercase tracking-wider">
                  City
                </label>
                <select
                  name="city"
                  className="w-full bg-gray-700/50 border border-gray-600 text-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.city}
                  onChange={handleChange}
                >
                  <option value="">Select city</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Tokyo">Tokyo</option>
                  <option value="Venice">Venice</option>
                  <option value="Bali">Bali</option>
                  <option value="Amsterdam">Amsterdam</option>
                  <option value="New York">New York</option>
                </select>
              </div>

              {/* Tags */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-750 rounded-2xl p-6 border border-gray-700 shadow-lg shadow-blue-400/20">
                <label className="block text-sm font-bold text-gray-200 mb-3 uppercase tracking-wider">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  className="w-full bg-gray-700/50 border border-gray-600 text-gray-100 rounded-xl px-4 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Separate with commas"
                  value={formData.tags}
                  onChange={handleChange}
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-2xl transition-all shadow-lg hover:shadow-blue-500/50 border border-blue-400/50 text-sm"
              >
                🚀 Publish
              </button>

              {/* Cancel Button */}
              <button 
                type="button"
                onClick={() => onNavigate('posts')}
                className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-2 px-4 rounded-xl transition-all border border-gray-700 text-sm"
              >
                Cancel
              </button>
            </form>
            </div>

            {/* Preview Column */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-gray-800 to-gray-750 rounded-2xl p-5 border border-gray-700 shadow-lg shadow-blue-400/20 sticky top-8">
                <h3 className="text-sm font-bold text-gray-100 mb-3">✨ Preview</h3>
                
                {/* Preview Card */}
                <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all">
                  {formData.image ? (
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="w-full h-32 object-cover"
                    />
                  ) : (
                    <div className="bg-gray-800 h-32 flex items-center justify-center text-gray-600">
                      <span className="text-2xl">📷</span>
                    </div>
                  )}
                  
                  <div className="p-3">
                    <div className="flex items-center gap-1 mb-2 flex-wrap">
                      <span className="px-2 py-1 bg-blue-900/50 text-blue-300 text-xs font-bold rounded-full border border-blue-500/50">
                        📍 {formData.city || 'City'}
                      </span>
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        formData.type === 'image' ? 'bg-blue-900/50 text-blue-300' :
                        formData.type === 'video' ? 'bg-red-900/50 text-red-300' :
                        formData.type === 'thought' ? 'bg-purple-900/50 text-purple-300' :
                        'bg-green-900/50 text-green-300'
                      }`}>
                        {formData.type === 'image' && '🖼'}
                        {formData.type === 'video' && '🎥'}
                        {formData.type === 'thought' && '💭'}
                        {formData.type === 'poll' && '📊'}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 text-xs line-clamp-2 mb-2">
                      {formData.caption || 'Your caption...'}
                    </p>
                    
                    {formData.tags && (
                      <div className="flex flex-wrap gap-1">
                        {formData.tags.split(',').slice(0, 2).map((tag, idx) => (
                          <span key={idx} className="bg-blue-900/30 text-blue-300 px-2 py-0.5 rounded-full text-xs border border-blue-500/30">
                            #{tag.trim().slice(0, 8)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT SIDEBAR */}
      <aside className="w-80 bg-gray-950 border-l border-blue-500/70 blue-shine-border p-6 fixed right-0 h-screen overflow-y-auto z-40">
        <h2 className="text-sm font-bold text-gray-300 mb-6 uppercase tracking-wider">Tips</h2>
        <div className="space-y-4 text-sm text-gray-400">
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
            <p className="font-semibold text-blue-300 mb-1">📸 Best Practices</p>
            <p className="text-xs">Use good lighting and clear angles for best results</p>
          </div>
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
            <p className="font-semibold text-green-300 mb-1">⭐ Engagement</p>
            <p className="text-xs">Add relevant tags to reach more travelers</p>
          </div>
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3">
            <p className="font-semibold text-purple-300 mb-1">🌍 Location Tags</p>
            <p className="text-xs">Always include the city for better discoverability</p>
          </div>
        </div>
      </aside>
    </div>
   
    </>
  );
}

export default CreatePost;
