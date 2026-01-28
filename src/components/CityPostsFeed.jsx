import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPostsByCity, fetchNearbyPosts, likePost, setSortBy } from '../store/slices/postsSlice';

function CityPostsFeed({ onNavigate, userType }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.token);
  const selectedCity = useSelector(state => state.city.selectedCity);
  const { cityPosts, nearbyPosts, loading, sortBy, pagination, likes } = useSelector(state => state.posts);
  
  const [showNearby, setShowNearby] = useState(false);
  const [radius, setRadius] = useState(50);

  // Fetch posts for selected city
  useEffect(() => {
    if (selectedCity && selectedCity.id) {
      dispatch(fetchPostsByCity({
        cityId: selectedCity.id,
        page: 1,
        limit: 10,
        sortBy: sortBy,
      }));
    }
  }, [selectedCity, sortBy, dispatch]);

  const handleSortChange = (newSort) => {
    dispatch(setSortBy(newSort));
  };

  const handleFetchNearby = async () => {
    if (!selectedCity || !selectedCity.id) return;
    
    if (!showNearby) {
      setShowNearby(true);
      dispatch(fetchNearbyPosts({
        cityId: selectedCity.id,
        radius: radius,
        limit: 10,
      }));
    } else {
      setShowNearby(false);
    }
  };

  const handleRadiusChange = (newRadius) => {
    setRadius(newRadius);
    if (selectedCity && selectedCity.id) {
      dispatch(fetchNearbyPosts({
        cityId: selectedCity.id,
        radius: newRadius,
        limit: 10,
      }));
    }
  };

  const handleLike = async (postId) => {
    if (!user) {
      alert('Please login to like posts');
      return;
    }

    dispatch(likePost({
      postId: postId,
      token: token || localStorage.getItem('token'),
    }));
  };

  const handlePostClick = (post) => {
    onNavigate('postDetail', { postId: post._id });
  };

  const handlePaginationChange = (newPage) => {
    if (selectedCity && selectedCity.id) {
      dispatch(fetchPostsByCity({
        cityId: selectedCity.id,
        page: newPage,
        limit: 10,
        sortBy: sortBy,
      }));
    }
  };

  if (!selectedCity) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">Please select a city from the map</p>
        </div>
      </div>
    );
  }

  const postsToDisplay = showNearby ? nearbyPosts : cityPosts;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                📍 {selectedCity.name}
              </h1>
              {selectedCity.state && (
                <p className="text-gray-600 mt-1">{selectedCity.state}, India</p>
              )}
            </div>
            <button
              onClick={() => onNavigate('home')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Back to Map
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="trending">🔥 Trending</option>
              <option value="latest">⏰ Latest</option>
              <option value="oldest">📅 Oldest</option>
            </select>

            <button
              onClick={handleFetchNearby}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                showNearby
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📍 Nearby Areas ({radius}km)
            </button>

            {showNearby && (
              <select
                value={radius}
                onChange={(e) => handleRadiusChange(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={10}>10 km</option>
                <option value={25}>25 km</option>
                <option value={50}>50 km</option>
                <option value={100}>100 km</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600 font-medium">Loading posts...</p>
            </div>
          </div>
        ) : postsToDisplay.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              {showNearby 
                ? `No posts found within ${radius}km of ${selectedCity.name}`
                : `No posts in ${selectedCity.name} yet`
              }
            </p>
            {!showNearby && (
              <button
                onClick={() => onNavigate('createPost')}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Be the first to post! 🚀
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Posts Display */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {showNearby 
                  ? `Posts from Nearby Areas (within ${radius}km)`
                  : `Posts in ${selectedCity.name}`
                }
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {postsToDisplay.map(post => (
                  <PostCard
                    key={post._id}
                    post={post}
                    likes={likes[post._id] || post.likes || 0}
                    onLike={() => handleLike(post._id)}
                    onClick={() => handlePostClick(post)}
                    user={user}
                    showCityName={showNearby}
                  />
                ))}
              </div>

              {/* Pagination - Only show for city posts, not nearby */}
              {!showNearby && pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 mb-8">
                  <button
                    disabled={pagination.page === 1}
                    onClick={() => handlePaginationChange(pagination.page - 1)}
                    className="px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-gray-700">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() => handlePaginationChange(pagination.page + 1)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Post Card Component
function PostCard({ post, likes, onLike, onClick, user, showCityName = false }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
    >
      {/* Post Image */}
      {post.image && (
        <div className="w-full h-48 bg-gray-200 overflow-hidden">
          <img
            src={post.image}
            alt={post.caption}
            className="w-full h-full object-cover hover:scale-105 transition-transform"
          />
        </div>
      )}

      {/* Post Content */}
      <div className="p-4">
        {/* Author Info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
              {post.user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">
                {post.user?.name || 'Anonymous'}
              </p>
              {showCityName && post.city && (
                <p className="text-xs text-gray-500">📍 {post.city}</p>
              )}
            </div>
          </div>
        </div>

        {/* Caption */}
        <p className="text-gray-700 text-sm mb-3 line-clamp-3">
          {post.caption}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-gray-600 text-sm border-t pt-3">
          <div className="flex items-center gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike();
              }}
              className="flex items-center gap-1 hover:text-red-600 transition"
            >
              <span className="text-lg">
                {user ? '❤️' : '🤍'}
              </span>
              <span>{likes}</span>
            </button>
            <div className="flex items-center gap-1">
              <span>👁️</span>
              <span>{post.views || 0}</span>
            </div>
          </div>
          <span className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CityPostsFeed;
