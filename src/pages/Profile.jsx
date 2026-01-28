import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../store/slices/authSlice.js';
import postService from '../services/postService.js';
import { usersAPI } from '../services/api.js';

// Helper function to generate default avatar with initials
const generateDefaultAvatar = (name, gender = 'male') => {
  const colors = gender === 'female' ? ['#FF69B4', '#FF1493', '#FFB6C1'] : ['#42A5F5', '#2196F3', '#1976D2'];
  const bgColor = colors[Math.floor(Math.random() * colors.length)];
  const initials = name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';
  
  const svg = `
    <svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
      <rect width="96" height="96" fill="${bgColor}"/>
      <text x="48" y="56" font-size="40" font-weight="bold" fill="white" text-anchor="middle" font-family="Arial">
        ${initials}
      </text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

function Profile({ onNavigate }) {
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editingData, setEditingData] = useState({ caption: '', tags: '' });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Fetch user's posts
  const fetchUserPosts = async () => {
    if (!user || (!user._id && !user.id)) return;
    setLoading(true);
    try {
      const response = await postService.getAllPosts();
      const allPosts = response.data || response; // Handle both array and response object
      console.log('Full response from backend:', response);
      console.log('All posts array:', allPosts);
      console.log('User:', user);
      
      const postsArray = Array.isArray(allPosts) ? allPosts : [];
      console.log('Processing', postsArray.length, 'posts for userId comparison');
      
      const myPosts = postsArray.filter(post => {
        // Debug each post
        console.log('Post data:', post);
        console.log('Post userId field:', post.userId);
        console.log('User._id:', user._id);
        console.log('User.id:', user.id);
        
        // Try multiple comparison strategies
        const postUserId = post.userId?._id?.toString() || post.userId?.toString() || post.userId;
        const userId = user._id?.toString() || user.id?.toString() || user._id || user.id;
        
        console.log('Comparing:', postUserId, 'vs', userId, '→', postUserId === userId);
        return postUserId === userId;
      });
      
      console.log('Matched user posts:', myPosts.length);
      setUserPosts(myPosts);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      setUserPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  const handleEditClick = (post) => {
    setEditingPost(post);
    setEditingData({
      caption: post.caption || '',
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingPost || !user) return;
    
    try {
      await postService.updatePost(editingPost._id || editingPost.id, {
        caption: editingData.caption,
        tags: editingData.tags.split(',').map(tag => tag.trim()).filter(t => t)
      });
      alert('Post updated successfully!');
      setEditingPost(null);
      fetchUserPosts();
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post');
    }
  };

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete || !user) return;
    
    try {
      await postService.deletePost(postToDelete._id || postToDelete.id);
      alert('Post deleted successfully!');
      setDeleteConfirmOpen(false);
      setPostToDelete(null);
      fetchUserPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  // Avatar upload handlers
  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadAvatar = async () => {
    if (!avatarPreview || !user) return;
    
    setUploadingAvatar(true);
    try {
      const response = await usersAPI.updateProfile({
        profilePicture: avatarPreview
      });
      
      // Extract user data from response
      const updatedUser = response.data || response;
      
      // Update Redux store with new user data
      dispatch(setUser(updatedUser));
      
      alert('Profile picture updated successfully!');
      setShowAvatarModal(false);
      setAvatarPreview(null);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Failed to upload profile picture');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const closeAvatarModal = () => {
    setShowAvatarModal(false);
    setAvatarPreview(null);
  };

  if (!user) {
    return (
      <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300 mb-4">Please log in to view your profile</p>
          <button
            onClick={() => onNavigate('auth')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-black/70 backdrop-blur-md border-b border-gray-800/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onNavigate('home')}>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-xl">
            <span className="text-lg text-white">🌍</span>
          </div>
          <span className="text-lg font-bold text-white">DhvaniCast</span>
        </div>
      </div>

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
              <span className="text-lg">👤</span>
              <span>Profile</span>
            </button>
          </nav>
        </aside>

        {/* CENTER CONTENT */}
        <section className="w-full lg:flex-1 lg:ml-64 lg:mr-0 pt-4 px-4 bg-gray-900 min-h-screen">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header Card */}
            <div className="bg-gradient-to-br from-blue-900 to-gray-900 rounded-2xl p-6 border-2 border-blue-500/40 mb-6 shadow-lg shadow-blue-500/20">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <img
                    src={user.profilePicture || generateDefaultAvatar(user.name, user.gender)}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover shadow-lg ring-3 ring-blue-400/30"
                  />
                  <button
                    onClick={() => setShowAvatarModal(true)}
                    className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-all"
                    title="Edit Profile Picture"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text text-transparent mb-1">{user.name || user.email}</h1>
                  <p className="text-blue-300 text-sm mb-2 font-medium">{user.email}</p>
                  <p className="text-gray-300 text-sm mb-4">Travel Enthusiast • Explorer • Content Creator</p>
                  <div className="flex gap-6 justify-center sm:justify-start">
                    <div className="bg-blue-900/30 rounded-lg px-4 py-2 border border-blue-500/30">
                      <p className="text-2xl font-bold text-blue-300">{userPosts.length}</p>
                      <p className="text-xs text-blue-400 mt-0.5 font-semibold">Posts Created</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* My Posts Section */}
            <div>
              <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center gap-2">
                <span>📸</span> My Posts
              </h2>

              {loading ? (
                <div className="text-center text-gray-400 py-12">
                  Loading your posts...
                </div>
              ) : userPosts.length === 0 ? (
                <div className="bg-gradient-to-br from-blue-900/20 to-gray-800 rounded-3xl p-16 border-2 border-dashed border-blue-500/30 text-center shadow-lg shadow-blue-500/10">
                  <p className="text-6xl mb-4">🚀</p>
                  <p className="text-2xl font-bold text-gray-100 mb-2">No Posts Yet</p>
                  <p className="text-gray-400 mb-8 text-lg">Start creating amazing travel moments to share with the world!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {userPosts.map((post, idx) => (
                    <div key={post._id || post.id || idx} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden border border-blue-500/20 hover:border-blue-500/40 shadow-md transition-all duration-300 flex flex-col h-full group">
                      {/* Post Image/Preview */}
                      <div className="relative h-28 bg-gradient-to-br from-gray-700 to-gray-800 overflow-hidden flex-shrink-0">
                        {post.images && post.images.length > 0 ? (
                          <img
                            src={post.images[0]}
                            alt="Post"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : post.videoUrl ? (
                          <video
                            src={post.videoUrl}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            muted
                          >
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-900 to-purple-700 flex items-center justify-center">
                            <span className="text-5xl">{post.type === 'poll' ? '📊' : post.type === 'thought' ? '💭' : '📸'}</span>
                          </div>
                        )}
                        <div className="absolute top-1 right-1 bg-blue-600 px-1.5 py-0.5 rounded text-xs text-white font-bold capitalize flex items-center gap-0.5 shadow-lg">
                          {post.type === 'image' && '🖼'}
                          {post.type === 'video' && '🎥'}
                          {post.type === 'thought' && '💭'}
                          {post.type === 'poll' && '📊'}
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="p-2 flex flex-col flex-1">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="px-1.5 py-0.25 bg-blue-900/50 text-blue-200 text-xs font-bold rounded border border-blue-500/30">
                            📍 {post.cityName || 'City'}
                          </span>
                        </div>

                        <p className="text-gray-200 font-medium line-clamp-1 text-xs mb-1">{post.caption || 'No caption'}</p>
                        
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-0.5 mb-1">
                            {post.tags.slice(0, 1).map((tag, tagIdx) => (
                              <span key={tagIdx} className="text-xs bg-blue-600/20 text-blue-300 px-1 py-0.5 rounded border border-blue-500/30 font-medium">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Like count */}
                          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2 border-t border-gray-700/30 pt-1">
                            <span>❤️ {post.likes || 0}</span>
                            <span>👁️ {post.views || 0}</span>
                            <span className="flex-1"></span>
                            <button
                              onClick={() => handleEditClick(post)}
                              className="p-1 text-blue-600 hover:text-blue-800 rounded transition-all"
                              title="Edit post"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteClick(post)}
                              className="p-1 text-red-600 hover:text-red-800 rounded transition-all"
                              title="Delete post"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Edit Post Modal */}
      {editingPost && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">✎ Edit Post</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm font-medium block mb-2">Caption</label>
                <textarea
                  value={editingData.caption}
                  onChange={(e) => setEditingData({ ...editingData, caption: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 text-gray-100 rounded-lg p-3 focus:border-blue-500 outline-none resize-none"
                  rows="4"
                  placeholder="Update your caption..."
                />
                <p className="text-xs text-gray-400 mt-1">{editingData.caption.length}/500 characters</p>
              </div>

              <div>
                <label className="text-gray-300 text-sm font-medium block mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  value={editingData.tags}
                  onChange={(e) => setEditingData({ ...editingData, tags: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 text-gray-100 rounded-lg p-3 focus:border-blue-500 outline-none"
                  placeholder="travel, adventure, city..."
                />
              </div>

              <p className="text-xs text-gray-400 italic">📸 Note: Images cannot be changed. Create a new post if you want to change images.</p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingPost(null)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-lg transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-red-500/50 p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-100 mb-2">🗑️ Delete Post?</h2>
            <p className="text-gray-300 mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>

            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6 text-sm text-red-300">
              This will permanently remove the post from your profile and the platform.
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setPostToDelete(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-lg transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-medium"
              >
                Delete Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Avatar Upload Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">📸 Update Profile Picture</h2>
            
            <div className="space-y-4">
              {/* Preview */}
              <div className="flex justify-center mb-4">
                <div className="relative w-32 h-32">
                  <img
                    src={avatarPreview || user.profilePicture || generateDefaultAvatar(user.name, user.gender)}
                    alt="Avatar Preview"
                    className="w-full h-full rounded-full object-cover border-2 border-blue-500 shadow-lg"
                  />
                </div>
              </div>

              {/* File Input */}
              <div>
                <label className="text-gray-300 text-sm font-medium block mb-2">Choose Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileChange}
                  className="w-full bg-gray-700 border border-gray-600 text-gray-100 rounded-lg p-3 focus:border-blue-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer file:hover:bg-blue-700"
                />
                <p className="text-xs text-gray-400 mt-2">Supported formats: JPG, PNG, GIF (Max 5MB)</p>
              </div>

              {avatarPreview && (
                <p className="text-xs text-blue-300 italic">✓ Image selected and ready to upload</p>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeAvatarModal}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-lg transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadAvatar}
                disabled={!avatarPreview || uploadingAvatar}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all font-medium"
              >
                {uploadingAvatar ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
