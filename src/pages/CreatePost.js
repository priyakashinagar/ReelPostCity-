import React, { useState } from 'react';

function CreatePost({ onNavigate }) {
  const [formData, setFormData] = useState({
    caption: '',
    tags: '',
    city: '',
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
    <div className="w-full min-h-screen bg-gray-900">
      {/* Header */}
      <section className="relative bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8" style={{backgroundImage: 'url(https://picsum.photos/1200/400?random=102)'}}>
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Create Your New Post</h1>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Column */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Upload Area */}
                <div className="bg-gray-800 rounded-lg p-8 border-2 border-dashed border-blue-500 shadow-lg shadow-blue-500/50 hover:shadow-blue-400/70 transition-all">
                  <h3 className="text-lg font-bold text-white mb-2">Upload Photo</h3>
                  <p className="text-gray-300 mb-4">Drag and drop or click to upload an image</p>
                  <p className="text-sm text-gray-400 mb-4">Maximum file size: 5MB</p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="w-full cursor-pointer"
                    onChange={handleImageChange}
                  />
                </div>

                {/* Caption */}
                <div className="bg-gray-800 rounded-lg p-8 border border-blue-500 shadow-lg shadow-blue-500/50">
                  <h3 className="text-lg font-bold text-white mb-4">Caption and Tags</h3>
                  
                  <label htmlFor="caption" className="block text-sm font-semibold text-white mb-2">
                    Caption
                  </label>
                  <textarea
                    id="caption"
                    name="caption"
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows="5"
                    placeholder="This city showcases vibrant art and rich history..."
                    value={formData.caption}
                    onChange={handleChange}
                  />

                  <label htmlFor="tags" className="block text-sm font-semibold text-white mt-6 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Press Enter to add tags (e.g., art, history, urban)"
                    value={formData.tags}
                    onChange={handleChange}
                  />
                </div>

                {/* City Selection */}
                <div className="bg-gray-800 rounded-lg p-8 border border-blue-500 shadow-lg shadow-blue-500/50">
                  <label htmlFor="city" className="block text-sm font-semibold text-white mb-2">
                    Select City
                  </label>
                  <select
                    id="city"
                    name="city"
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.city}
                    onChange={handleChange}
                  >
                    <option value="">Choose the city associated with your post</option>
                    <option value="Utrecht">Utrecht</option>
                    <option value="Barcelona">Barcelona</option>
                    <option value="Venice">Venice</option>
                    <option value="Paris">Paris</option>
                    <option value="Tokyo">Tokyo</option>
                    <option value="NewYork">New York</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors border border-blue-500 shadow-lg shadow-blue-500/50 hover:shadow-blue-400/70"
                >
                  Publish Post
                </button>
              </form>
            </div>

            {/* Preview Column */}
            <div>
              <div className="bg-gray-800 rounded-lg p-8 border border-blue-500 shadow-lg shadow-blue-500/50 sticky top-24">
                <h3 className="text-lg font-bold text-white mb-2">Post Preview</h3>
                <p className="text-gray-400 mb-6">How your post will look...</p>
                
                {formData.image ? (
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                ) : (
                  <div className="bg-gray-700 rounded-lg h-48 flex items-center justify-center text-gray-500 mb-4">
                    📷 No image selected
                  </div>
                )}
                
                <p className="text-gray-300 mb-4 min-h-12">
                  {formData.caption || 'Your post caption will appear here...'}
                </p>
                
                {formData.tags ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.split(',').map((tag, idx) => (
                      <span key={idx} className="bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-sm">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No tags</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CreatePost;
