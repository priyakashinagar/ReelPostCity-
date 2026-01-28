import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import postService from '../services/postService.js';
import { fetchFeaturedCities } from '../store/slices/citySlice.js';
import { getLocationWithCache } from '../services/locationService.js';

function CreatePost({ onNavigate }) {
  const user = useSelector(state => state.auth.user);
  const selectedCity = useSelector(state => state.city.selectedCity);
  const cities = useSelector(state => state.city.cities);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [autoLocatedCity, setAutoLocatedCity] = useState(null);
  const [hasLocationAccess, setHasLocationAccess] = useState(false);
  const [formData, setFormData] = useState({
    caption: '',
    tags: '',
    cityId: selectedCity?.id || '',
    cityName: selectedCity?.name || '',
    type: 'image',
    images: [], // Multiple images support
    videoUrl: '',
    options: [],
    votes: []
  });

  // Check if location is already stored in localStorage (means permission was granted in Home)
  useEffect(() => {
    const checkLocationAccess = () => {
      const userLocation = localStorage.getItem('userCurrentLocation');
      console.log('✅ Checking localStorage for location:', userLocation);
      
      if (userLocation) {
        try {
          const location = JSON.parse(userLocation);
          if (location && location.city) {
            console.log('✅ Location found:', location.city);
            setHasLocationAccess(true);
            return;
          }
        } catch (error) {
          console.log('❌ Invalid location data');
        }
      }
      
      console.log('⏳ Location not found yet, will retry...');
      // If location not found, retry after 1 second (in case Home is still loading)
      const timeout = setTimeout(() => {
        const retryLocation = localStorage.getItem('userCurrentLocation');
        if (retryLocation) {
          try {
            const location = JSON.parse(retryLocation);
            if (location && location.city) {
              console.log('✅ Location found on retry:', location.city);
              setHasLocationAccess(true);
            }
          } catch (error) {
            console.log('❌ Location check failed');
          }
        }
      }, 1000);
      
      return () => clearTimeout(timeout);
    };

    checkLocationAccess();
  }, []);

  // Load featured cities on mount
  useEffect(() => {
    if (!cities || cities.length === 0) {
      dispatch(fetchFeaturedCities());
    }
  }, [dispatch]);

  // Auto-detect user's location and populate city field
  useEffect(() => {
    const autoDetectLocation = async () => {
      try {
        const location = await getLocationWithCache();
        if (location) {
          setAutoLocatedCity(location.city);
          
          // Try to find exact match in our cities database
          const matchedCity = cities?.find(c => 
            c.name?.toLowerCase() === location.city.toLowerCase() ||
            c.displayName?.toLowerCase() === location.city.toLowerCase()
          );
          
          if (matchedCity) {
            console.log('✅ City matched:', matchedCity.name || matchedCity.displayName);
            setFormData(prev => ({
              ...prev,
              cityId: matchedCity._id || matchedCity.id,
              cityName: matchedCity.name || matchedCity.displayName
            }));
          } else {
            // Use the auto-detected city name - generate ID for new cities
            console.log('⚠️ City not in database, will create:', location.city);
            setFormData(prev => ({
              ...prev,
              cityId: location.city.toLowerCase().replace(/\s+/g, '-'),
              cityName: location.city
            }));
          }
        }
      } catch (error) {
        console.log('Could not auto-detect location:', error.message);
      }
    };

    if (!autoLocatedCity) {
      autoDetectLocation();
    }
  }, [cities, autoLocatedCity]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files) {
      const newImages = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Check file size (limit to 2MB per file)
        if (file.size > 2 * 1024 * 1024) {
          alert(`Image ${file.name} is too large (max 2MB)`);
          continue;
        }
        
        // Read file as base64
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result;
          if (result) {
            newImages.push(result);
            
            // Update form data when all files are read
            if (newImages.length === Array.from(files).filter(f => f.size <= 2 * 1024 * 1024).length) {
              setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...newImages]
              }));
            }
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 100MB for video)
      if (file.size > 100 * 1024 * 1024) {
        alert('Video is too large (max 100MB)');
        return;
      }
      
      // Read file as base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (result) {
          setFormData(prev => ({
            ...prev,
            videoUrl: result
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to create a post!');
      onNavigate('auth');
      return;
    }

    if (!formData.caption.trim()) {
      alert('Please enter a caption for your post');
      return;
    }

    if (!formData.cityName.trim()) {
      alert('Please select or enter a city');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare post data for API
      const postData = {
        caption: formData.caption,
        cityId: formData.cityId,
        cityName: formData.cityName,
        userId: user._id || user.id,
        userName: user.name || user.email || 'Anonymous User', // Send user's display name
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        type: formData.type,
      };

      // Add type-specific fields
      if (formData.type === 'image') {
        postData.images = formData.images.length > 0 ? formData.images : ['https://picsum.photos/500/300?random=' + Math.random()];
      } else if (formData.type === 'video') {
        postData.videoUrl = formData.videoUrl;
        postData.images = formData.images.length > 0 ? [formData.images[0]] : ['https://picsum.photos/500/300?random=' + Math.random()];
      } else if (formData.type === 'thought') {
        postData.images = ['https://picsum.photos/500/300?random=' + Math.random()];
      } else if (formData.type === 'poll') {
        postData.options = formData.options.filter(opt => opt.trim()).length > 0 ? formData.options.filter(opt => opt.trim()) : [];
        postData.votes = formData.options.map(() => 0);
        postData.images = ['https://picsum.photos/500/300?random=' + Math.random()];
      }

      // Create post via API
      await postService.createPost(postData);
      alert('Post published successfully! ✅');
      
      // Refresh featured cities
      dispatch(fetchFeaturedCities());
      
      // Reset form
      setFormData({
        caption: '',
        tags: '',
        cityId: selectedCity?.id || '',
        cityName: selectedCity?.name || '',
        type: 'image',
        images: [],
        videoUrl: '',
        options: [],
        votes: []
      });
      
      // Navigate to posts with flag to refresh
      setTimeout(() => {
        // Save a flag to indicate new post was created
        localStorage.setItem('newPostCreated', 'true');
        onNavigate('posts', null, false); // Navigate to Posts page
      }, 1000);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error publishing post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {/* LOCATION REQUIRED - BLOCKING MODAL */}
    {!hasLocationAccess && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-red-500/50 p-8 max-w-md w-full shadow-2xl text-center">
          <div className="text-5xl mb-4">📍</div>
          <h2 className="text-2xl font-bold text-gray-100 mb-3">Location Access Required</h2>
          <p className="text-gray-300 mb-6">
            You need to enable location access to create posts. This helps us show posts by city and keep your exact location private.
          </p>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6 text-sm text-red-300">
            ⚠️ Location permission was denied. Please enable it and return to create posts.
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium"
            >
              Go Back to Home
            </button>
            <button
              onClick={() => onNavigate('posts')}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-lg transition-all font-medium"
            >
              Browse Posts
            </button>
          </div>
        </div>
      </div>
    )}

    {/* MAIN CONTENT - Only show if location access granted */}
    {hasLocationAccess && (
    <>
    <div className="w-full min-h-screen bg-gray-900 flex flex-col lg:flex-row">
      {/* LEFT SIDEBAR */}
      <aside className="hidden lg:block w-64 bg-gray-950 border-r border-blue-500/70 blue-shine-border p-6 h-screen overflow-y-auto z-40 fixed left-0 top-0 bottom-0 scrollbar-hide">
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
      <section className="w-full lg:flex-1 lg:ml-64 lg:mr-80 pt-0 px-4 pb-20 bg-gray-900 blue-shine-border rounded-2xl">
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
              <div className="bg-linear-to-br from-gray-800 to-gray-750 rounded-2xl p-6 border border-gray-700 shadow-lg shadow-blue-400/20">
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

              {/* Upload Area - Only show for image posts */}
              {formData.type === 'image' && (
              <div className="bg-linear-to-br from-gray-800 to-gray-750 rounded-2xl p-6 border-2 border-dashed border-blue-400/30 hover:border-blue-400 transition-all shadow-lg shadow-blue-400/20 hover:shadow-blue-400/40">
                <div className="text-center">
                  <div className="text-4xl mb-3">📷</div>
                  <h3 className="text-lg font-bold text-gray-100 mb-1">Upload Your Photo</h3>
                  <p className="text-gray-400 mb-1 text-sm">Drag and drop or click to upload (add multiple images)</p>
                  <p className="text-xs text-gray-500">Max 2MB per image • PNG, JPG, GIF</p>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple
                    className="w-full cursor-pointer mt-3"
                    onChange={handleImageChange}
                  />
                </div>

                {/* Show uploaded images */}
                {formData.images.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">Uploaded Images ({formData.images.length})</p>
                    <div className="grid grid-cols-3 gap-3">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img 
                            src={img} 
                            alt={`upload-${idx}`}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              )}

              {/* Video Upload & URL - Only show for video posts */}
              {formData.type === 'video' && (
                <div className="bg-linear-to-br from-gray-800 to-gray-750 rounded-2xl p-6 border border-gray-700 shadow-lg shadow-red-400/20">
                  <label className="block text-sm font-bold text-gray-200 mb-3 uppercase tracking-wider">
                    🎥 Video Upload or URL
                  </label>
                  
                  {/* Video URL Input */}
                  <div className="mb-4">
                    <input
                      type="url"
                      name="videoUrl"
                      className="w-full bg-gray-700/50 border border-gray-600 text-gray-100 rounded-xl px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Paste YouTube, Vimeo, or video URL..."
                      value={!formData.videoUrl.startsWith('data:') ? formData.videoUrl : ''}
                      onChange={handleChange}
                    />
                    <p className="text-xs text-gray-400 mt-1">Paste video URL (YouTube, Vimeo, MP4, etc.)</p>
                    
                    {/* Video URL Preview */}
                    {formData.videoUrl && !formData.videoUrl.startsWith('data:') && (
                      <div className="mt-3 bg-black rounded-lg overflow-hidden border border-gray-600 p-2">
                        <video 
                          src={formData.videoUrl}
                          className="w-full h-auto rounded"
                          controls
                          controlsList="nodownload"
                          style={{ maxHeight: '300px' }}
                        >
                          Your browser does not support the video tag.
                        </video>
                        <p className="text-xs text-gray-400 mt-2">Use the player controls to play/pause and adjust volume</p>
                      </div>
                    )}
                  </div>

                  {/* OR Divider */}
                  <div className="flex items-center my-3">
                    <div className="flex-1 border-t border-gray-600"></div>
                    <span className="px-3 text-xs text-gray-500">OR</span>
                    <div className="flex-1 border-t border-gray-600"></div>
                  </div>

                  {/* Video File Upload */}
                  <div className="bg-gray-700/30 border-2 border-dashed border-red-400/30 rounded-xl p-4 text-center hover:border-red-400 transition-all cursor-pointer">
                    <div className="text-2xl mb-2">📹</div>
                    <h4 className="text-sm font-semibold text-gray-200 mb-1">Upload Video File</h4>
                    <p className="text-xs text-gray-400 mb-3">Max 100MB • MP4, WebM, Ogg</p>
                    <input
                      type="file"
                      accept="video/*"
                      className="w-full cursor-pointer"
                      onChange={handleVideoChange}
                    />
                  </div>

                  {/* Show uploaded video status */}
                  {formData.videoUrl && formData.videoUrl.startsWith('data:') && (
                    <div className="mt-4">
                      <div className="mb-3 p-2 bg-green-900/30 border border-green-600/50 rounded-lg flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        <span className="text-xs text-green-300">Video uploaded ({(formData.videoUrl.length / 1024 / 1024).toFixed(1)}MB)</span>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, videoUrl: '' }))}
                          className="ml-auto text-xs text-red-400 hover:text-red-300"
                        >
                          ✕
                        </button>
                      </div>
                      
                      {/* Video Player Preview */}
                      <div className="bg-black rounded-lg overflow-hidden border border-gray-600 p-2">
                        <video 
                          src={formData.videoUrl}
                          className="w-full h-auto rounded"
                          controls
                          controlsList="nodownload"
                          style={{ maxHeight: '300px' }}
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">Preview • Use the player controls to play/pause and adjust volume</p>
                    </div>
                  )}

                  {/* Caption for Video */}
                  <div className="mt-4">
                    <label className="block text-sm font-bold text-gray-200 mb-3">Caption</label>
                    <textarea
                      name="caption"
                      className="w-full bg-gray-700/50 border border-gray-600 text-gray-100 rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-sm"
                      rows="3"
                      placeholder="Describe your video..."
                      value={formData.caption}
                      onChange={handleChange}
                    />
                    <p className="text-xs text-gray-500 mt-2">{formData.caption.length}/500 characters</p>
                  </div>
                </div>
              )}

              {/* Thought Text - Only show for thought posts */}
              {formData.type === 'thought' && (
                <div className="bg-linear-to-br from-gray-800 to-gray-750 rounded-2xl p-6 border border-gray-700 shadow-lg shadow-purple-400/20">
                  <label className="block text-sm font-bold text-gray-200 mb-3 uppercase tracking-wider">
                    💭 Your Thought
                  </label>
                  <textarea
                    name="caption"
                    className="w-full bg-gray-700/50 border border-gray-600 text-gray-100 rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
                    rows="4"
                    placeholder="Share your thoughts, experiences, or insights..."
                    value={formData.caption}
                    onChange={handleChange}
                  />
                  <p className="text-xs text-gray-500 mt-2">{formData.caption.length}/500 characters</p>
                </div>
              )}

              {/* Caption - Show for image and poll posts */}
              {(formData.type === 'image' || formData.type === 'poll') && (
                <div className="bg-linear-to-br from-gray-800 to-gray-750 rounded-2xl p-6 border border-gray-700 shadow-lg shadow-blue-400/20">
                  <label className="block text-sm font-bold text-gray-200 mb-3 uppercase tracking-wider">
                    {formData.type === 'poll' ? '📊 Poll Question' : 'Caption'}
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
              )}

              {/* Poll Options - Only show for poll posts */}
              {formData.type === 'poll' && (
                <div className="bg-linear-to-br from-gray-800 to-gray-750 rounded-2xl p-6 border border-gray-700 shadow-lg shadow-green-400/20">
                  <label className="block text-sm font-bold text-gray-200 mb-3 uppercase tracking-wider">
                    📊 Poll Options
                  </label>
                  <div className="space-y-2">
                    {formData.options.map((option, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          type="text"
                          placeholder={`Option ${idx + 1}`}
                          className="flex-1 bg-gray-700/50 border border-gray-600 text-gray-100 rounded-xl px-4 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...formData.options];
                            newOptions[idx] = e.target.value;
                            setFormData({ ...formData, options: newOptions });
                          }}
                        />
                        {formData.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newOptions = formData.options.filter((_, i) => i !== idx);
                              setFormData({ ...formData, options: newOptions });
                            }}
                            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm transition-colors"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {formData.options.length < 5 && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, options: [...formData.options, ''] });
                      }}
                      className="mt-3 w-full px-4 py-2 bg-green-600/30 hover:bg-green-600/50 border border-green-600 text-green-300 rounded-xl text-sm font-semibold transition-colors"
                    >
                      ➕ Add Option
                    </button>
                  )}
                  <p className="text-xs text-gray-500 mt-2">Add 2-5 options for your poll</p>
                </div>
              )}

              {/* City Selection - Simple Input with Dropdown */}
              <div className="bg-linear-to-br from-gray-800 to-gray-750 rounded-2xl p-6 border border-gray-700 shadow-lg shadow-blue-400/20">
                <label className="block text-sm font-bold text-gray-200 mb-3 uppercase tracking-wider">
                  📍 City
                </label>
                
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type city name..."
                    className="w-full bg-gray-700/50 border border-gray-600 text-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.cityName}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ ...formData, cityName: value });
                      setCitySearchQuery(value);
                      setCityDropdownOpen(true);
                    }}
                    onFocus={() => setCityDropdownOpen(true)}
                    onBlur={() => setTimeout(() => setCityDropdownOpen(false), 200)}
                  />
                  
                  {/* Dropdown List */}
                  {cityDropdownOpen && formData.cityName && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                      {/* Filtered Cities from Redux */}
                      {cities && cities.length > 0 ? (
                        cities
                          .filter(c => c.displayName && c.displayName.toLowerCase().includes(formData.cityName.toLowerCase()))
                          .map(city => (
                            <button
                              key={city._id}
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  cityId: city._id,
                                  cityName: city.displayName
                                });
                                setCityDropdownOpen(false);
                              }}
                              className="w-full px-4 py-2 text-left text-gray-200 hover:bg-blue-900/30 transition-colors border-b border-gray-700 last:border-b-0"
                            >
                              {city.displayName}
                            </button>
                          ))
                      ) : (
                        /* Fallback hardcoded cities if Redux cities not loaded */
                        [
                          { _id: '697484fb217fe92519240ff7', displayName: 'Kanpur' },
                          { _id: '697484fb217fe92519241005', displayName: 'Delhi' },
                          { _id: '697484fb217fe92519241012', displayName: 'Mumbai' },
                          { _id: '697484fb217fe9251924101b', displayName: 'Bangalore' },
                          { _id: '697484fb217fe92519241022', displayName: 'Hyderabad' },
                          { _id: '697484fb217fe92519241027', displayName: 'Pune' },
                          { _id: '697484fb217fe92519241031', displayName: 'Lucknow' }
                        ]
                          .filter(c => c.displayName.toLowerCase().includes(formData.cityName.toLowerCase()))
                          .map(city => (
                            <button
                              key={city._id}
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  cityId: city._id,
                                  cityName: city.displayName
                                });
                                setCityDropdownOpen(false);
                              }}
                              className="w-full px-4 py-2 text-left text-gray-200 hover:bg-blue-900/30 transition-colors border-b border-gray-700 last:border-b-0"
                            >
                              {city.displayName}
                            </button>
                          ))
                      )}
                      
                      {/* Custom City Option - Show only if not matching any preset */}
                      {formData.cityName && !(cities && cities.some(c => c.displayName && c.displayName.toLowerCase() === formData.cityName.toLowerCase())) && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              cityId: formData.cityName.toLowerCase().replace(/\s+/g, '_'),
                              cityName: formData.cityName
                            });
                            setCityDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left text-blue-300 hover:bg-blue-900/50 transition-colors border-t border-blue-600 font-semibold flex items-center gap-2"
                        >
                          <span>➕</span>
                          <span>{formData.cityName}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="bg-linear-to-br from-gray-800 to-gray-750 rounded-2xl p-6 border border-gray-700 shadow-lg shadow-blue-400/20">
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
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-500 text-white font-bold py-2 px-4 rounded-2xl transition-all shadow-lg hover:shadow-blue-500/50 border border-blue-400/50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '⏳ Publishing...' : '🚀 Publish'}
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
                  {formData.images && formData.images.length > 0 ? (
                    <img 
                      src={formData.images[0]} 
                      alt="Preview" 
                      className="w-full h-32 object-cover"
                    />
                  ) : (
                    <div className="bg-gray-800 h-32 flex items-center justify-center text-gray-600">
                      <span className="text-2xl">
                        {formData.type === 'image' && '📷'}
                        {formData.type === 'video' && '🎥'}
                        {formData.type === 'thought' && '💭'}
                        {formData.type === 'poll' && '📊'}
                      </span>
                    </div>
                  )}
                  
                  <div className="p-3">
                    <div className="flex items-center gap-1 mb-2 flex-wrap">
                      <span className="px-2 py-1 bg-blue-900/50 text-blue-300 text-xs font-bold rounded-full border border-blue-500/50">
                        📍 {formData.cityName || 'City'}
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
      <aside className="hidden lg:block w-80 bg-gray-950 border-l border-blue-500/70 blue-shine-border p-6 fixed right-0 top-14 bottom-0 h-screen overflow-y-auto z-40 scrollbar-hide">
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
    )}

    </>
  );
}

export default CreatePost;
