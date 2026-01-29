import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearSelectedCity } from '../store/slices/citySlice.js';
import { getAllPosts, getPostsByCity, toggleLike } from '../services/postService.js';
import { createBlockRequest } from '../services/blockRequestService.js';
import { getYoutubeEmbedUrl, isYoutubeUrl } from '../utils/youtubeHelper.js';
import Ads from '../components/Common/Ads.jsx';

function Posts({ onNavigate, userType, fromExplore }) {
  const user = useSelector(state => state.auth?.user);
  const dispatch = useDispatch();
  const selectedCity = useSelector(state => state.city?.selectedCity);
  const cities = useSelector(state => state.city?.cities) || [];
  
  const [selectedPost, setSelectedPost] = useState(null);
  const [likes, setLikes] = useState({});
  const [hoveredVideoId, setHoveredVideoId] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedPostForComment, setSelectedPostForComment] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [follows, setFollows] = useState({});
  const [votes, setVotes] = useState({});
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('trending'); // trending, latest, oldest
  const [menuOpenPostId, setMenuOpenPostId] = useState(null);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [blockUserData, setBlockUserData] = useState({ userName: '', reason: '', postId: '' });
  const [reposts, setReposts] = useState([]);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [unmuteModalOpen, setUnmuteModalOpen] = useState(false);
  const [currentUnmuteVideoId, setCurrentUnmuteVideoId] = useState(null);
  const videoRefs = React.useRef({});

  // Clear city filter when navigating from navbar (not from explore/map)
  useEffect(() => {
    // If coming from navbar (not from explore), always clear selected city
    if (!fromExplore) {
      dispatch(clearSelectedCity());
    }
  }, [fromExplore, dispatch]);

  // Fetch posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let response;
        // If selectedCity is set and we're from explore, fetch city posts
        if (selectedCity?.name && fromExplore) {
          response = await getPostsByCity(selectedCity.name);
        } else {
          // Otherwise fetch all posts
          response = await getAllPosts();
        }
        
        let postsData = response?.data || [];
        
        // Sort posts based on sortBy preference
        postsData = sortPosts(postsData, sortBy);
        
        setPosts(postsData);
        
        // Clear the new post flag
        localStorage.removeItem('newPostCreated');
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedCity, sortBy, fromExplore]);

  // Auto-refresh posts every 10 seconds to catch newly created posts
  useEffect(() => {
    const interval = setInterval(() => {
      // Rerun the fetch effect by toggling sortBy
      setSortBy(prev => prev); // Trigger useEffect
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // Sorting function - Instagram/YouTube style
  const sortPosts = (postsArray, sortType) => {
    const postsCopy = [...postsArray];
    
    switch(sortType) {
      case 'trending':
        // Sort by views + likes + engagement
        return postsCopy.sort((a, b) => {
          const aScore = (a.views || 0) + (a.likes || 0) * 2 + (a.comments?.length || 0) * 3;
          const bScore = (b.views || 0) + (b.likes || 0) * 2 + (b.comments?.length || 0) * 3;
          return bScore - aScore;
        });
      
      case 'latest':
        // Sort by newest first
        return postsCopy.sort((a, b) => {
          const aTime = new Date(a.createdAt || 0).getTime();
          const bTime = new Date(b.createdAt || 0).getTime();
          return bTime - aTime;
        });
      
      case 'oldest':
        // Sort by oldest first
        return postsCopy.sort((a, b) => {
          const aTime = new Date(a.createdAt || 0).getTime();
          const bTime = new Date(b.createdAt || 0).getTime();
          return aTime - bTime;
        });
      
      default:
        return postsCopy;
    }
  };

  // Group posts by author for related posts display
  const postsGroupedByAuthor = posts.reduce((acc, post) => {
    const authorName = post.author?.username || post.author?.name || 'Unknown';
    if (!acc[authorName]) {
      acc[authorName] = [];
    }
    acc[authorName].push(post);
    return acc;
  }, {});

  const handleLike = async (postId, e) => {
    if (e) e.stopPropagation();
    try {
      // Toggle UI immediately
      setLikes(prev => ({...prev, [postId]: !prev[postId]}));
      // Call backend API
      await toggleLike(postId);
    } catch (err) {
      console.error('Error toggling like:', err);
      // Revert UI on error
      setLikes(prev => ({...prev, [postId]: !prev[postId]}));
    }
  };

  const handleFollow = (city) => {
    setFollows(prev => ({...prev, [city]: !prev[city]}));
    alert(`${prev => prev[city] ? 'Unfollowed' : 'Followed'} ${city}!`);
  };

  const handleVote = (option) => {
    setVotes(prev => ({...prev, [option]: !prev[option]}));
    alert(`Voted for ${option}!`);
  };

  const openCommentModal = (post) => {
    setSelectedPostForComment(post);
    setCommentModalOpen(true);
  };

  const submitComment = () => {
    if (newComment.trim()) {
      alert(`Comment posted: "${newComment}"`);
      setNewComment('');
      setCommentModalOpen(false);
    }
  };

  const handleReportPost = (postId, author) => {
    alert(`Report submitted for post by ${author}. Thank you for keeping our community safe!`);
    setMenuOpenPostId(null);
  };

  const handleRepost = (postId, authorName) => {
    // Track this repost
    setReposts(prev => [...prev, { postId, authorName }]);
    alert(`✅ Post reposted! You'll no longer see posts from ${authorName}`);
    setMenuOpenPostId(null);
  };

  const handleBlockUser = (author, postId) => {
    setBlockUserData({ userName: author, reason: '', postId: postId });
    setBlockModalOpen(true);
    setMenuOpenPostId(null);
  };

  const submitBlockRequest = async () => {
    if (!blockUserData.reason.trim()) {
      alert('Please provide a reason for blocking this user');
      return;
    }

    try {
      // Send block request to backend
      const blockRequest = {
        blockedUserName: blockUserData.userName,
        reason: blockUserData.reason,
        postId: blockUserData.postId,
      };

      const response = await createBlockRequest(blockRequest);

      if (response.success) {
        alert('✅ Block request sent to admin!\n\nReason: ' + blockUserData.reason + '\n\nAdmin will review and take action shortly.');
      } else {
        alert('Error: ' + response.message);
      }
      
      setBlockModalOpen(false);
      setBlockUserData({ userName: '', reason: '', postId: '' });
    } catch (err) {
      console.error('Error submitting block request:', err);
      alert('❌ Failed to send block request. Please try again.');
    }
  };

  // Get related videos based on current video
  const getRelatedVideos = (currentPost) => {
    if (!currentPost) return [];
    
    // Filter videos based on:
    // 1. Same city
    // 2. Same or similar tags
    // 3. Same post type (video)
    // Exclude current post and already reposted authors
    const repostedAuthors = reposts.map(r => r.authorName);
    const author = currentPost.userId?.name || currentPost.author?.name || '';
    
    return posts
      .filter(post => {
        // Only video posts
        if (post.type !== 'video') return false;
        
        // Exclude current post
        if ((post._id || post.id) === (currentPost._id || currentPost.id)) return false;
        
        // Exclude reposted authors
        const postAuthor = post.userId?.name || post.author?.name || '';
        if (repostedAuthors.includes(postAuthor)) return false;
        
        // Same city OR has common tags
        const sameCity = post.city === currentPost.city;
        const currentTags = currentPost.tags || [];
        const postTags = post.tags || [];
        const hasCommonTag = currentTags.some(tag => postTags.includes(tag));
        
        return sameCity || hasCommonTag;
      })
      .slice(0, 6); // Show up to 6 related videos
  };

  const handlePlayVideo = (post) => {
    setPlayingVideoId(post._id || post.id);
    const related = getRelatedVideos(post);
    setRelatedVideos(related);
  };

  const handleVideoHover = (postId) => {
    setHoveredVideoId(postId);
    // Use a small delay to ensure DOM is updated
    setTimeout(() => {
      const videoRef = videoRefs.current[postId];
      if (videoRef) {
        // Start playing with muted audio
        videoRef.muted = true;
        videoRef.loop = true;
        videoRef.play().catch(err => console.log('Auto-play blocked:', err));
      }
    }, 10);
  };

  const handleVideoHoverLeave = (postId) => {
    setHoveredVideoId(null);
    const videoRef = videoRefs.current[postId];
    if (videoRef) {
      videoRef.pause();
      videoRef.currentTime = 0; // Reset to beginning
    }
  };

  const handleUnmuteVideo = (postId) => {
    const videoRef = videoRefs.current[postId];
    if (videoRef) {
      videoRef.muted = false;
      videoRef.volume = 1;
      videoRef.play().catch(err => console.log('Play error:', err));
    }
    setUnmuteModalOpen(false);
  };

  const handleShare = (post) => {
    alert(`Sharing: ${post.title}\n\nLink: https://dhvanicast.com/post/${post.id}`);
  };

  // Track post view (increment views when post is displayed)
  const trackPostView = async (postId) => {
    try {
      // TODO: Call backend to increment view count
      // await api.post(`/posts/${postId}/view`);
      console.log('View tracked for post:', postId);
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const filteredPosts = posts
    .filter(post => {
      // Filter out posts from users whose posts user has reposted
      const repostedAuthors = reposts.map(r => r.authorName);
      const author = post.userId?.name || post.author?.name || '';
      if (repostedAuthors.includes(author)) {
        return false;
      }
      return true;
    })
    .filter(post => {
      // City filter
      if (selectedCity && selectedCity.name) {
        return post.city === selectedCity.name;
      }
      return true;
    })
    .filter(post => {
      if (!searchQuery) return true;
      const caption = post.caption || '';
      const tags = post.tags || [];
      return caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
             tags.some(tag => tag?.toLowerCase?.().includes(searchQuery.toLowerCase()));
    });

  const PostCard = ({ post, relatedPosts }) => {
    // Map backend post structure to frontend requirements
    const postId = post._id || post.id;
    const isLiked = likes[postId];
    const likes_count = post.likes || 0;
    const author = post.userId?.name || post.author?.name || 'Unknown User';
    const authorImg = post.userId?.profilePicture || post.author?.profilePicture || 'https://i.pravatar.cc/150?img=1';
    const city = post.city || 'Unknown';
    const createdDate = post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recently';
    
    // Track view on component mount
    React.useEffect(() => {
      trackPostView(postId);
    }, [postId]);
    
    // For now, return a simplified card since backend structure is different
    return (
      <div id={`post-${postId}`} className="bg-gray-800 rounded-lg sm:rounded-xl shadow-lg shadow-blue-400/20 hover:shadow-blue-400/40 transition-all duration-300 border border-gray-700 hover:border-blue-400/50 p-4 sm:p-6 mb-4 sm:mb-6 scroll-mt-20">
        <div className="flex items-start gap-3 mb-4">
          <img src={authorImg} alt={author} className="w-10 h-10 rounded-full" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-gray-200">{author}</p>
              {/* Post Type Badge */}
              {post.type === 'video' && <span className="text-xs bg-red-600/30 text-red-300 px-2 py-0.5 rounded border border-red-500/30">🎥 Video</span>}
              {post.type === 'poll' && <span className="text-xs bg-purple-600/30 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">📊 Poll</span>}
              {post.type === 'thought' && <span className="text-xs bg-yellow-600/30 text-yellow-300 px-2 py-0.5 rounded border border-yellow-500/30">💭 Thought</span>}
            </div>
            <p className="text-xs text-gray-500">📍 {city} • {createdDate}</p>
          </div>
          <div className="relative">
            <button 
              onClick={() => setMenuOpenPostId(menuOpenPostId === postId ? null : postId)}
              className="text-gray-400 hover:text-white transition text-xl"
            >
              ⋯
            </button>
            {menuOpenPostId === postId && (
              <div className="absolute right-0 top-8 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 min-w-48">
                <button 
                  onClick={() => handleRepost(postId, author)}
                  className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-green-400 transition text-sm"
                >
                  🔄 Repost
                </button>
                <button 
                  onClick={() => handleReportPost(postId, author)}
                  className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-yellow-400 transition text-sm border-t border-gray-700"
                >
                  🚩 Report Post
                </button>
                <button 
                  onClick={() => handleBlockUser(author, postId)}
                  className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-red-400 transition text-sm border-t border-gray-700"
                >
                  ⛔ Block User
                </button>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-gray-300 mb-4 leading-relaxed text-sm sm:text-base">{post.caption || post.description || 'No content'}</p>
        
        {/* Video Post */}
        {post.type === 'video' && post.videoUrl && (
          <div className="mb-4 rounded-lg overflow-hidden bg-black relative">
            {isYoutubeUrl(post.videoUrl) ? (
              // YouTube Video with iframe
              <div 
                className="relative cursor-pointer"
                onMouseEnter={() => handlePlayVideo(post)}
              >
                <iframe
                  width="100%"
                  height="400"
                  src={getYoutubeEmbedUrl(post.videoUrl)}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
              </div>
            ) : (
              // Regular HTML5 video with hover preview (muted by default)
              <div
                className="relative group"
                onMouseEnter={() => handleVideoHover(postId)}
                onMouseLeave={() => handleVideoHoverLeave(postId)}
              >
                {/* Hover Preview Video with Controls (Muted initially) */}
                <video 
                  ref={el => {
                    if (el) videoRefs.current[postId] = el;
                  }}
                  src={post.videoUrl} 
                  controls
                  className={`w-full h-auto object-contain rounded-lg transition-opacity ${
                    hoveredVideoId === postId ? 'opacity-100 relative z-20' : 'opacity-0 absolute inset-0 z-0 pointer-events-none'
                  }`}
                  style={{ maxHeight: '500px' }}
                  loop
                  muted
                  controlsList="nodownload"
                  onClick={() => {
                    if (hoveredVideoId === postId) {
                      const videoRef = videoRefs.current[postId];
                      if (videoRef && videoRef.muted) {
                        setCurrentUnmuteVideoId(postId);
                        setUnmuteModalOpen(true);
                      }
                    }
                  }}
                />
                
                {/* Default Player with Controls (only visible when NOT hovering) */}
                {hoveredVideoId !== postId && (
                  <video 
                    src={post.videoUrl} 
                    controls 
                    className="w-full h-auto object-contain relative z-10 rounded-lg"
                    style={{ maxHeight: '500px' }}
                    controlsList="nodownload"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
                
                {/* Muted Indicator on Hover */}
                {hoveredVideoId === postId && (
                  <div className="absolute top-4 right-4 bg-black/70 px-3 py-1 rounded-full text-white text-xs font-bold z-40 flex items-center gap-1">
                    🔇 Muted
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Image Post */}
        {post.type === 'image' && (post.image || post.images?.[0]) && (
          <div className="mb-4 rounded-lg overflow-hidden max-h-96">
            <img src={post.image || post.images?.[0]} alt="Post" className="w-full h-auto object-cover" />
          </div>
        )}
        
        {/* Poll Post */}
        {post.type === 'poll' && post.options && post.options.length > 0 && (
          <div className="mb-4 space-y-2">
            {post.options.map((option, idx) => {
              const totalVotes = post.votes?.reduce((a, b) => a + b, 0) || 0;
              const percentage = totalVotes > 0 ? Math.round((post.votes?.[idx] || 0) / totalVotes * 100) : 0;
              return (
                <div key={idx} className="bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-blue-500/50 transition cursor-pointer">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-300 text-sm">{option}</span>
                    <span className="text-gray-400 text-xs">{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
            <p className="text-gray-400 text-xs mt-2">📊 {post.votes?.reduce((a, b) => a + b, 0) || 0} votes</p>
          </div>
        )}
        
        {/* Thought Post - just text, no image */}
        {post.type === 'thought' && (
          <div className="mb-4 p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg border border-blue-500/30">
            <p className="text-gray-300 italic">💭 {post.caption}</p>
          </div>
        )}
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-3 sm:mb-4">
            {post.tags.slice(0, 5).map((tag, idx) => (
              <span key={idx} className="text-xs bg-blue-900/30 text-blue-300 px-2 sm:px-3 py-1 rounded-full border border-blue-500/30">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 sm:gap-6 pt-3 sm:pt-4 border-t border-gray-700 text-gray-400 text-sm sm:text-base">
          <button onClick={(e) => handleLike(postId, e)} className={`flex items-center gap-2 hover:text-red-400 transition ${isLiked ? 'text-red-500 font-bold' : ''}`}>
            {isLiked ? '❤️' : '🤍'} {isLiked ? likes_count + 1 : likes_count}
          </button>
          <button onClick={() => openCommentModal(post)} className="flex items-center gap-2 hover:text-blue-400 transition">
            💬 {post.commentsCount || 0}
          </button>
          <button onClick={() => handleShare(post)} className="flex items-center gap-2 hover:text-green-400 transition">↗️ Share</button>
          <div className="flex items-center gap-2 ml-auto text-gray-500 text-xs">
            👁️ {post.views || 0} views
          </div>
        </div>
      </div>
    );
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
      {/* LEFT SIDEBAR - Hidden on mobile */}
      <aside className="hidden lg:block w-64 bg-gray-950 border-r border-gray-800 p-6 fixed left-0 h-screen overflow-y-auto z-40">
        <div className="mb-8">
          <h1 className="text-2xl font-bold shine-text cursor-pointer bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent" onClick={() => onNavigate('home')}>DhvaniCast</h1>
          <p className="text-xs text-gray-500 mt-1">Explore & Share</p>
        </div>
        
        <nav className="space-y-2">
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg bg-blue-900/30 border border-blue-500/50 text-gray-100 font-medium hover:bg-blue-900/50 transition-all">
            <span className="text-lg">■</span>
            <span>Home</span>
          </button>
          
          <button onClick={() => setSearchOpen(true)} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 transition-all font-medium">
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
          
          <button onClick={() => {
            if (!user) {
              alert('Please login first to create a post!');
              onNavigate('auth');
            } else {
              onNavigate('create-post');
            }
          }} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-blue-400 transition-all font-medium">
            <span className="text-lg">⊕</span>
            <span>Create</span>
          </button>
          
          <button onClick={() => onNavigate('profile')} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 transition-all font-medium">
            <span className="text-lg">⚙</span>
            <span>Profile</span>
          </button>
        </nav>
      </aside>

      {/* CENTER FEED */}
      <section className="flex-1 lg:ml-64 lg:mr-80 py-4 sm:py-8 px-2 sm:px-4 pb-20">
        <div className="w-full sm:max-w-2xl mx-auto">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
                <p className="text-gray-400">Loading posts...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6 text-red-300">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="text-red-200 hover:text-red-100 underline mt-2"
              >
                Try again
              </button>
            </div>
          )}

          {/* City Filter Header */}
          {!loading && selectedCity && selectedCity.name && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg border border-blue-500/30 flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-blue-300">📍 {selectedCity.name}</h2>
                <p className="text-sm text-gray-400 mt-1">{filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} from this city</p>
              </div>
              <button 
                onClick={() => {
                  dispatch(clearSelectedCity());
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all text-sm font-medium"
              >
                ✕ Clear Filter
              </button>
            </div>
          )}

          {/* Show ads every 3 posts for free/premium users */}
          {!loading && userType !== 'pro' && (
            <div className="mb-8">
              <Ads userType={userType} />
            </div>
          )}

          {/* Sorting Options */}
          {!loading && (
            <div className="mb-6 flex gap-2 flex-wrap items-center">
              <span className="text-sm text-gray-400 font-medium">Sort by:</span>
              <button 
                onClick={() => setSortBy('trending')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  sortBy === 'trending' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                🔥 Trending
              </button>
              <button 
                onClick={() => setSortBy('latest')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  sortBy === 'latest' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                ⏰ Latest
              </button>
              <button 
                onClick={() => setSortBy('oldest')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  sortBy === 'oldest' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                📅 Oldest
              </button>
            </div>
          )}
          
          <div className="space-y-4">
            {!loading && filteredPosts.length > 0 ? (
              filteredPosts.map((post, index) => {
                const authorName = post.author?.username || post.author?.name || 'Unknown';
                const relatedPosts = postsGroupedByAuthor[authorName] || [];
                return (
                  <div key={post._id || post.id}>
                    {/* Show ads every 3 posts */}
                    {(index + 1) % 3 === 0 && userType !== 'pro' && (
                      <div className="my-8">
                        <Ads userType={userType} />
                      </div>
                    )}
                    <PostCard post={post} relatedPosts={relatedPosts} />
                  </div>
                );
              })
            ) : !loading ? (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg mb-4">
                  {selectedCity ? `No posts found in ${selectedCity.name}` : 'No posts available'}
                </p>
                {selectedCity && (
                  <button 
                    onClick={() => dispatch(clearSelectedCity())}
                    className="text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Browse all posts →
                  </button>
                )}
              </div>
            ) : null}
          </div>

          <div className="flex justify-center mt-12">
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-12 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-400">
              ↓ Load More Reels
            </button>
          </div>
        </div>
      </section>

      {/* RIGHT SIDEBAR - EXPLORE - Hidden on mobile */}
      <aside className="hidden lg:block w-80 bg-gray-950 border-l border-gray-800 p-6 fixed right-0 h-screen overflow-y-auto z-40">
        <div className="mb-8">
          <input 
            type="text"
            placeholder="Search cities..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-blue-500 placeholder-gray-500 text-sm"
          />
        </div>

        <h2 className="text-sm font-bold text-gray-300 mb-6 uppercase tracking-wider">Explore Cities</h2>

        <div className="space-y-3">
          {cities.map((city, idx) => (
            <div
              key={idx}
              onClick={() => alert(`Viewing posts from ${city.name}`)}
              className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500/50 hover:bg-gray-750 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                      {city.name.charAt(0)}
                    </div>
                    <h3 className="font-semibold text-gray-100 group-hover:text-blue-400 transition-colors text-sm">{city.name}</h3>
                  </div>
                  <p className="text-xs text-gray-500">{city.posts.toLocaleString()} posts</p>
                </div>
                <button onClick={(e) => {e.stopPropagation(); alert(`Following ${city.name}!`);}} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-all font-medium">
                  Follow
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700">
          <h3 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-wider">Trending</h3>
          <div className="space-y-3">
            <div onClick={() => alert('Showing #Travel posts')} className="p-3 bg-gray-800 rounded-lg hover:bg-gray-750 cursor-pointer transition-all border border-gray-700">
              <p className="font-semibold text-gray-200 text-sm">#Travel</p>
              <p className="text-xs text-gray-500 mt-1">2.5M posts</p>
            </div>
            <div onClick={() => alert('Showing #Photography posts')} className="p-3 bg-gray-800 rounded-lg hover:bg-gray-750 cursor-pointer transition-all border border-gray-700">
              <p className="font-semibold text-gray-200 text-sm">#Photography</p>
              <p className="text-xs text-gray-500 mt-1">1.8M posts</p>
            </div>
            <div onClick={() => alert('Showing #Adventure posts')} className="p-3 bg-gray-800 rounded-lg hover:bg-gray-750 cursor-pointer transition-all border border-gray-700">
              <p className="font-semibold text-gray-200 text-sm">#Adventure</p>
              <p className="text-xs text-gray-500 mt-1">3.2M posts</p>
            </div>
          </div>
        </div>
      </aside>
    </div>

    {/* Search Modal */}
    {searchOpen && (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-start justify-center z-50 pt-10 sm:pt-20 px-4">
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl w-full max-w-2xl border border-blue-500/30 shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between mb-0 p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">🔍 Search Posts</h2>
            <button onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-white text-3xl font-light">✕</button>
          </div>
          
          <div className="p-6">
            <input
              type="text"
              placeholder="Search caption, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 mb-4 text-sm"
              autoFocus
            />

            <div className="max-h-80 overflow-y-scroll space-y-2 scrollbar-hide">
              {filteredPosts.length > 0 ? (
                filteredPosts.slice(0, 8).map(post => (
                  <div key={post._id} className="bg-gray-750 p-4 rounded-lg hover:bg-gray-700 cursor-pointer transition-all border border-gray-700 hover:border-blue-500/50" onClick={() => {setSearchOpen(false); setSelectedPost(post);}}>
                    <div className="flex items-start gap-3">
                      <img src={post.userId?.profilePicture || 'https://i.pravatar.cc/150?img=1'} alt="author" className="w-10 h-10 rounded-full flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-blue-400 font-bold text-sm truncate">{post.userId?.name || 'Unknown'}</p>
                        <p className="text-gray-400 text-xs mt-1 line-clamp-2">{(post.caption || '').substring(0, 100)}</p>
                        <p className="text-gray-500 text-xs mt-1">📍 {post.city}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-12">No posts found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Comment Modal */}
    {commentModalOpen && selectedPostForComment && (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-2xl mx-4 border border-blue-500/30 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">💬 Add Comment</h2>
            <button onClick={() => setCommentModalOpen(false)} className="text-gray-400 hover:text-white text-2xl">✕</button>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <p className="text-gray-300 font-semibold">{selectedPostForComment.title}</p>
            <p className="text-gray-400 text-sm mt-2 truncate">{selectedPostForComment.description}</p>
          </div>

          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 mb-4 h-32 resize-none"
          />

          <div className="flex gap-3">
            <button onClick={submitComment} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition">
              Post Comment
            </button>
            <button onClick={() => setCommentModalOpen(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition">
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Related Videos Modal (YouTube Style) */}
    {playingVideoId && relatedVideos.length > 0 && (
      <div className="fixed bottom-4 right-4 w-80 bg-gray-900 rounded-lg border border-gray-700 shadow-2xl z-40 max-h-96 overflow-hidden">
        <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
          <h3 className="text-white font-bold text-sm">📺 More Videos</h3>
          <button 
            onClick={() => {
              setPlayingVideoId(null);
              setRelatedVideos([]);
            }}
            className="text-gray-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-72 space-y-2 p-2">
          {relatedVideos.map((video, idx) => (
            <div
              key={idx}
              onClick={() => {
                // Scroll to the related video
                const element = document.getElementById(`post-${video._id || video.id}`);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  setPlayingVideoId(video._id || video.id);
                  const newRelated = getRelatedVideos(video);
                  setRelatedVideos(newRelated);
                }
              }}
              className="flex gap-2 bg-gray-800 hover:bg-gray-750 p-2 rounded cursor-pointer transition group"
            >
              <div className="w-20 h-12 rounded bg-gray-700 flex-shrink-0 flex items-center justify-center relative overflow-hidden">
                {video.images?.[0] ? (
                  <img src={video.images[0]} alt="thumbnail" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">🎥</span>
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition flex items-center justify-center">
                  <span className="text-white text-lg">▶️</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-300 text-xs line-clamp-2 group-hover:text-blue-400">
                  {video.caption}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  By {video.userId?.name || video.author?.name || 'Unknown'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Unmute Video Modal (YouTube Style) */}
    {unmuteModalOpen && currentUnmuteVideoId && (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md mx-4 border border-blue-500/30 shadow-2xl text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">🔊</div>
            <h2 className="text-2xl font-bold text-white">Unmute Video?</h2>
            <p className="text-gray-400 text-sm mt-2">Videos play with sound muted to respect your experience. Click below to unmute and hear the audio.</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => {
                handleUnmuteVideo(currentUnmuteVideoId);
                setCurrentUnmuteVideoId(null);
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
            >
              🔊 Unmute & Play
            </button>
            <button 
              onClick={() => {
                setUnmuteModalOpen(false);
                setCurrentUnmuteVideoId(null);
              }}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition"
            >
              Keep Muted
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Block User Modal */}
    {blockModalOpen && (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-2xl mx-4 border border-red-500/30 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">⛔ Block User</h2>
            <button onClick={() => setBlockModalOpen(false)} className="text-gray-400 hover:text-white text-2xl">✕</button>
          </div>

          <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg mb-4">
            <p className="text-gray-300 text-sm">You are about to block <span className="font-bold text-red-400">{blockUserData.userName}</span></p>
            <p className="text-gray-400 text-xs mt-2">Once blocked, you won't see their posts and they can't interact with you. An admin must approve this request.</p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 font-semibold mb-2 text-sm">Why are you blocking this user? *</label>
            <textarea
              value={blockUserData.reason}
              onChange={(e) => setBlockUserData(prev => ({...prev, reason: e.target.value}))}
              placeholder="Please provide a reason (e.g., Harassment, Spam, Inappropriate content)..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 h-24 resize-none text-sm"
            />
            <p className="text-gray-400 text-xs mt-1">{blockUserData.reason.length}/200 characters</p>
          </div>

          <div className="flex gap-3">
            <button onClick={submitBlockRequest} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition">
              Send Block Request
            </button>
            <button onClick={() => setBlockModalOpen(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition">
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
    
    </>
  );
}

export default Posts;
