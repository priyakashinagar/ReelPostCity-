import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Ads from '../components/Common/Ads.jsx';

function Posts({ onNavigate, userType }) {
  const { user } = useAuth();
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

  const exploreCities = [
    { name: 'Lucknow', posts: 1245 },
    { name: 'Shimla', posts: 2103 },
    { name: 'Delhi', posts: 3456 },
    { name: 'London', posts: 1876 },
    { name: 'Noida', posts: 2234 },
    { name: 'Lakhimpur Kheri', posts: 1567 },
    { name: 'Bareilly', posts: 1098 },
    { name: 'Pune', posts: 2345 },
  ];

  const allPosts = [
    // Sarah Wilson - Multiple posts (Images & Thoughts)
    {
      id: 1,
      type: 'image',
      city: 'Amsterdam',
      title: 'Golden hour at the canals',
      description: 'Nothing beats the sunset reflecting off Amsterdam\'s beautiful canals. Perfect evening vibes! 🌅',
      image: 'https://picsum.photos/400/500?random=101',
      author: 'Sarah Wilson',
      authorImg: 'https://i.pravatar.cc/150?img=10',
      date: '2 hours ago',
      likes: 1234,
      tags: ['amsterdam', 'sunset', 'canals', 'travel']
    },
    {
      id: 2,
      type: 'image',
      city: 'Amsterdam',
      title: 'Street art in the Red Light District',
      description: 'Amsterdam\'s street art scene is incredible. Every corner tells a story.',
      image: 'https://picsum.photos/400/500?random=102',
      author: 'Sarah Wilson',
      authorImg: 'https://i.pravatar.cc/150?img=10',
      date: '3 hours ago',
      likes: 845,
      tags: ['amsterdam', 'art', 'street', 'culture']
    },
    {
      id: 3,
      type: 'image',
      city: 'Amsterdam',
      title: 'Anne Frank House - A powerful experience',
      description: 'Visiting the Anne Frank House was deeply moving. History comes alive here.',
      image: 'https://picsum.photos/400/500?random=103',
      author: 'Sarah Wilson',
      authorImg: 'https://i.pravatar.cc/150?img=10',
      date: '4 hours ago',
      likes: 2156,
      tags: ['amsterdam', 'history', 'museum', 'emotional']
    },
    {
      id: 4,
      type: 'thought',
      city: 'Amsterdam',
      title: 'Why Amsterdam captured my heart',
      description: 'Amsterdam is more than just canals and bikes. It\'s about the Dutch spirit - friendly, direct, and welcoming. The culture of cycling everywhere, the cozy coffee shops, the authentic Dutch pancakes... Every moment here feels like a postcard. The city respects individuality while maintaining community. That\'s rare. That\'s magical. 💙',
      author: 'Sarah Wilson',
      authorImg: 'https://i.pravatar.cc/150?img=10',
      date: '5 hours ago',
      likes: 3456,
      tags: ['amsterdam', 'reflection', 'travel', 'lifestyle', 'culture']
    },

    // Marcus Chen - Multiple Videos & Images
    {
      id: 5,
      type: 'video',
      city: 'Tokyo',
      title: 'Best ramen in Shibuya - 30 year old recipe',
      description: 'Found this hidden gem! The chef has perfected his ramen over 3 decades. Every bowl is art. 🍜',
      image: 'https://picsum.photos/400/500?random=104',
      author: 'Marcus Chen',
      authorImg: 'https://i.pravatar.cc/150?img=11',
      date: '6 hours ago',
      likes: 4567,
      duration: '5:32',
      videoSrc: 'train_small.mp4',
      tags: ['tokyo', 'food', 'ramen', 'street food', 'vlog']
    },
    {
      id: 6,
      type: 'video',
      city: 'Tokyo',
      title: 'Tokyo at night - Shinjuku lights',
      description: 'The neon lights of Shinjuku are absolutely insane! This city never sleeps.',
      image: 'https://picsum.photos/400/500?random=105',
      author: 'Marcus Chen',
      authorImg: 'https://i.pravatar.cc/150?img=11',
      date: '7 hours ago',
      likes: 3289,
      duration: '8:45',
      videoSrc: '10007-222013911_medium.mp4',
      tags: ['tokyo', 'nightlife', 'shinjuku', 'travel', 'vlog']
    },
    {
      id: 7,
      type: 'image',
      city: 'Tokyo',
      title: 'Cherry blossoms at Ueno Park',
      description: 'Spring in Tokyo is magical. Thousands of people gathering to celebrate sakura season.',
      image: 'https://picsum.photos/400/500?random=106',
      author: 'Marcus Chen',
      authorImg: 'https://i.pravatar.cc/150?img=11',
      date: '8 hours ago',
      likes: 5123,
      tags: ['tokyo', 'cherry blossoms', 'spring', 'nature', 'photography']
    },
    {
      id: 8,
      type: 'video',
      city: 'Tokyo',
      title: 'Tokyo train culture explained',
      description: 'Why are Japanese trains so efficient? Let me show you the system that amazes the world.',
      image: 'https://picsum.photos/400/500?random=107',
      author: 'Marcus Chen',
      authorImg: 'https://i.pravatar.cc/150?img=11',
      date: '9 hours ago',
      likes: 6234,
      duration: '12:15',
      videoSrc: 'train_small.mp4',
      tags: ['tokyo', 'trains', 'transportation', 'culture', 'vlog']
    },

    // Lisa Wong - Thoughts & Images
    {
      id: 9,
      type: 'thought',
      city: 'Bali',
      title: 'What Bali taught me about simplicity',
      description: 'Bali isn\'t just a beach destination. It\'s a philosophy. The locals have mastered the art of living in the moment. No rushing, no stress, just genuine presence. The temples, the rice paddies, the smiles... Everything moves slower here. And that slowness? That\'s freedom. That\'s what we\'re all searching for. 🙏',
      author: 'Lisa Wong',
      authorImg: 'https://i.pravatar.cc/150?img=12',
      date: '10 hours ago',
      likes: 7234,
      tags: ['bali', 'philosophy', 'mindfulness', 'travel', 'spirituality']
    },
    {
      id: 10,
      type: 'image',
      city: 'Bali',
      title: 'Sunrise at Tanah Lot Temple',
      description: 'Woke up at 4 AM for this moment. The temple glowing as the sun rises is absolutely divine.',
      image: 'https://picsum.photos/400/500?random=108',
      author: 'Lisa Wong',
      authorImg: 'https://i.pravatar.cc/150?img=12',
      date: '11 hours ago',
      likes: 5876,
      tags: ['bali', 'temple', 'sunrise', 'spiritual', 'photography']
    },
    {
      id: 11,
      type: 'image',
      city: 'Bali',
      title: 'Rice terraces of Ubud',
      description: 'These green rice paddies are like nature\'s art gallery. Pure serenity.',
      image: 'https://picsum.photos/400/500?random=109',
      author: 'Lisa Wong',
      authorImg: 'https://i.pravatar.cc/150?img=12',
      date: '12 hours ago',
      likes: 4567,
      tags: ['bali', 'nature', 'ubud', 'green', 'landscape']
    },
    {
      id: 12,
      type: 'thought',
      city: 'Bali',
      title: 'The real cost of tourism in Bali',
      description: 'We need to talk about sustainable tourism. Bali is getting overwhelmed. The beaches are polluted, the local culture is being commercialized, and prices are skyrocketing for locals. If you\'re going to Bali, please travel responsibly. Support local businesses, respect the culture, and minimize your environmental impact. Travel should lift communities up, not tear them down.',
      author: 'Lisa Wong',
      authorImg: 'https://i.pravatar.cc/150?img=12',
      date: '13 hours ago',
      likes: 8945,
      tags: ['bali', 'sustainability', 'travel', 'responsibility', 'environment']
    },

    // David Park - Multiple Images
    {
      id: 13,
      type: 'image',
      city: 'New York',
      title: 'Times Square at midnight',
      description: 'The energy of NYC never stops. Every moment feels cinematic. 🌃',
      image: 'https://picsum.photos/400/500?random=110',
      author: 'David Park',
      authorImg: 'https://i.pravatar.cc/150?img=13',
      date: '14 hours ago',
      likes: 6789,
      tags: ['nyc', 'nightlife', 'timessquare', 'urban', 'photography']
    },
    {
      id: 14,
      type: 'image',
      city: 'New York',
      title: 'Central Park in autumn',
      description: 'Golden leaves, perfect weather, and the skyline peeking through. Magic.',
      image: 'https://picsum.photos/400/500?random=111',
      author: 'David Park',
      authorImg: 'https://i.pravatar.cc/150?img=13',
      date: '15 hours ago',
      likes: 5432,
      tags: ['nyc', 'centralpark', 'autumn', 'nature', 'park']
    },
    {
      id: 15,
      type: 'image',
      city: 'New York',
      title: 'Brooklyn Bridge sunset',
      description: 'Perfect vantage point for watching the city light up.',
      image: 'https://picsum.photos/400/500?random=112',
      author: 'David Park',
      authorImg: 'https://i.pravatar.cc/150?img=13',
      date: '16 hours ago',
      likes: 7821,
      tags: ['nyc', 'brooklyn', 'bridge', 'sunset', 'iconic']
    },

    // Elena Russo - Videos
    {
      id: 16,
      type: 'video',
      city: 'Venice',
      title: 'Getting lost in Venice with no map',
      description: 'The best way to discover Venice is to wander without a plan. 🚤',
      image: 'https://picsum.photos/400/500?random=113',
      author: 'Elena Russo',
      authorImg: 'https://i.pravatar.cc/150?img=14',
      date: '17 hours ago',
      likes: 4123,
      duration: '8:45',
      videoSrc: '10007-222013911_medium.mp4',
      tags: ['venice', 'exploration', 'vlog', 'italy', 'wandering']
    },
    {
      id: 17,
      type: 'video',
      city: 'Venice',
      title: 'Inside a Venice mask-making workshop',
      description: 'Learning the ancient art of Venetian mask making from a master craftsman.',
      image: 'https://picsum.photos/400/500?random=114',
      author: 'Elena Russo',
      authorImg: 'https://i.pravatar.cc/150?img=14',
      date: '18 hours ago',
      likes: 3456,
      duration: '6:20',
      videoSrc: 'train_small.mp4',
      tags: ['venice', 'craft', 'tradition', 'artisan', 'vlog']
    },

    // Raj Kumar - Thoughts
    {
      id: 18,
      type: 'thought',
      city: 'Delhi',
      title: 'What 25 countries taught me about life',
      description: 'Travel isn\'t just about passport stamps. It\'s about expanding your mind. Every country rewrote my perspective. Thailand taught me to slow down. Japan taught me precision and respect. India taught me chaos can be beautiful. The more I travel, the more I realize how much I don\'t know. And that uncertainty? That\'s where growth lives. 🌍',
      author: 'Raj Kumar',
      authorImg: 'https://i.pravatar.cc/150?img=15',
      date: '19 hours ago',
      likes: 9876,
      tags: ['travel', 'philosophy', 'growth', 'inspiration', 'perspective']
    },
    {
      id: 19,
      type: 'thought',
      city: 'Delhi',
      title: 'The hidden cost of traveling',
      description: 'Nobody talks about the real challenge of being a traveler. It\'s not the missing flights or lost luggage. It\'s the constant loneliness. The yearning for home. The relationships that fade because you\'re always moving. The guilt of spending money while others struggle. Travel is beautiful, but it\'s also lonely, expensive, and emotionally exhausting. If you\'re thinking of traveling long-term, be prepared for the real cost. 💔',
      author: 'Raj Kumar',
      authorImg: 'https://i.pravatar.cc/150?img=15',
      date: '20 hours ago',
      likes: 6543,
      tags: ['travel', 'loneliness', 'reality', 'emotion', 'introspection']
    },

    // Poll Post
    {
      id: 20,
      type: 'poll',
      city: 'Global',
      title: 'Which city has the best coffee culture?',
      description: 'Vote for your favorite coffee destination:',
      options: ['Melbourne, Australia', 'Vienna, Austria', 'Naples, Italy', 'Seattle, USA', 'Istanbul, Turkey'],
      votes: [543, 421, 632, 389, 498],
      author: 'Travel Community',
      authorImg: 'https://i.pravatar.cc/150?img=16',
      date: '21 hours ago',
      likes: 2345,
      tags: ['poll', 'coffee', 'global', 'community']
    }
  ];

  // Group posts by author for horizontal scrolling
  const postsGroupedByAuthor = allPosts.reduce((acc, post) => {
    const authorName = post.author;
    if (!acc[authorName]) {
      acc[authorName] = [];
    }
    acc[authorName].push(post);
    return acc;
  }, {});

  const posts = allPosts;

  const handleLike = (postId, e) => {
    if (e) e.stopPropagation();
    setLikes(prev => ({...prev, [postId]: !prev[postId]}));
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

  const handleShare = (post) => {
    alert(`Sharing: ${post.title}\n\nLink: https://dhvanicast.com/post/${post.id}`);
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const PostCard = ({ post, relatedPosts }) => {
    const isLiked = likes[post.id];
    const totalVotes = post.votes ? post.votes.reduce((a, b) => a + b, 0) : 0;

    // Get related posts from same author (excluding current post)
    const authorRelated = relatedPosts ? relatedPosts.filter(p => p.id !== post.id).slice(0, 3) : [];

    if (post.type === 'thought') {
      return (
        <div className="bg-gray-800 rounded-lg sm:rounded-xl shadow-lg shadow-blue-400/20 hover:shadow-blue-400/40 transition-all duration-300 border border-gray-700 hover:border-blue-400/50 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4 justify-between">
            <p className="text-xs text-gray-400">📍 {post.city} • {post.date}</p>
            <span className="px-2 sm:px-3 py-1 bg-purple-900/50 text-purple-300 text-xs rounded-full font-medium">💭 Thought</span>
          </div>
          
          <h2 className="text-lg sm:text-xl font-bold text-gray-100 mb-2 sm:mb-3">{post.title}</h2>
          <p className="text-gray-300 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">{post.description}</p>
          
          <div className="flex gap-2 flex-wrap mb-3 sm:mb-4">
            {post.tags.map((tag, idx) => (
              <span key={idx} className="text-xs bg-purple-900/30 text-purple-300 px-2 sm:px-3 py-1 rounded-full border border-purple-500/30">
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 sm:gap-6 pt-3 sm:pt-4 border-t border-gray-700 text-gray-400 text-sm sm:text-base">
            <button onClick={() => handleLike(post.id)} className={`flex items-center gap-2 hover:text-red-400 transition ${isLiked ? 'text-red-500 font-bold' : ''}`}>
              {isLiked ? '❤️' : '🤍'} {post.likes}
            </button>
            <button onClick={() => openCommentModal(post)} className="flex items-center gap-2 hover:text-blue-400 transition">💬 {post.comments ? post.comments.length : 0}</button>
            <button onClick={() => handleShare(post)} className="flex items-center gap-2 hover:text-green-400 transition">↗️ Share</button>
          </div>
        </div>
      );
    }

    if (post.type === 'poll') {
      return (
        <div className="bg-gray-800 rounded-lg sm:rounded-xl shadow-lg shadow-blue-400/20 hover:shadow-blue-400/40 transition-all duration-300 border border-gray-700 hover:border-blue-400/50 mb-4 sm:mb-6 overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4 justify-between">
              <p className="text-xs text-gray-400">📍 {post.city} • {post.date}</p>
              <span className="px-2 sm:px-3 py-1 bg-green-900/50 text-green-300 text-xs rounded-full font-medium">📊 Poll</span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-gray-100 mb-3 sm:mb-4">{post.title}</h2>
            <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">{post.description}</p>

            <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
              {post.options.map((option, idx) => {
                const percentage = totalVotes > 0 ? Math.round((post.votes[idx] / totalVotes) * 100) : 0;
                return (
                  <div key={idx} className="cursor-pointer hover:bg-gray-700/50 p-2 rounded transition-all">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300 text-xs sm:text-sm">{option}</span>
                      <span className="text-gray-400 text-xs">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-400 to-green-500 h-full" style={{width: `${percentage}%`}}></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 text-center mb-3 sm:mb-4">{totalVotes} total votes</p>

            <div className="flex items-center gap-3 sm:gap-6 pt-3 sm:pt-4 border-t border-gray-700 text-gray-400 text-sm sm:text-base">
              <button onClick={() => handleLike(post.id)} className={`flex items-center gap-2 hover:text-red-400 transition ${isLiked ? 'text-red-500 font-bold' : ''}`}>
                {isLiked ? '❤️' : '🤍'} {post.likes}
              </button>
              <button className="flex items-center gap-2 hover:text-blue-400 transition">💬 {post.comments ? post.comments.length : 0}</button>
              <button className="flex items-center gap-2 hover:text-green-400 transition">↗️ Share</button>
            </div>
          </div>
        </div>
      );
    }

    if (post.type === 'video') {
      return (
        <div className="bg-gray-800 rounded-lg sm:rounded-xl shadow-lg shadow-blue-400/20 hover:shadow-blue-400/40 transition-all duration-300 border border-gray-700 hover:border-blue-400/50 mb-4 sm:mb-6 overflow-hidden">
          <div className="p-4 sm:p-6 pb-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4 justify-between">
              <p className="text-xs text-gray-400">📍 {post.city} • {post.date}</p>
              <span className="px-2 sm:px-3 py-1 bg-red-900/50 text-red-300 text-xs rounded-full font-medium">🎥 Video</span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-gray-100 mb-1 sm:mb-2">{post.title}</h2>
            <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">{post.description}</p>
          </div>

          <div 
            className="relative w-full bg-gray-900 group max-h-96 overflow-hidden mx-0 rounded-lg mb-3 sm:mb-4" 
            onMouseEnter={() => setHoveredVideoId(post.id)} 
            onMouseLeave={() => setHoveredVideoId(null)}
          >
            <video 
              autoPlay={hoveredVideoId === post.id}
              loop
              muted
              playsInline
              controls
              controlsList="nodownload"
              className="w-full h-96 object-cover"
            >
              <source src={post.videoSrc} type="video/mp4" />
            </video>
            <span className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">{post.duration}</span>
          </div>

          <div className="p-4 sm:p-6 pt-0">
            <div className="flex gap-2 flex-wrap mb-3 sm:mb-4">
              {post.tags.map((tag, idx) => (
                <span key={idx} className="text-xs bg-red-900/30 text-red-300 px-2 sm:px-3 py-1 rounded-full border border-red-500/30">#{tag}</span>
              ))}
            </div>

            <div className="flex gap-3 sm:gap-6 text-gray-400 text-sm sm:text-base">
              <button onClick={() => handleLike(post.id)} className={`flex items-center gap-2 hover:text-red-400 transition ${isLiked ? 'text-red-500 font-bold' : ''}`}>
                {isLiked ? '❤️' : '🤍'} {post.likes}
              </button>
              <button className="flex items-center gap-2 hover:text-blue-400 transition">💬 {post.comments ? post.comments.length : 0}</button>
              <button className="flex items-center gap-2 hover:text-green-400 transition">↗️ Share</button>
            </div>
          </div>
        </div>
      );
    }

    // Default image type
    return (
      <div className="bg-gray-800 rounded-lg sm:rounded-xl shadow-lg shadow-blue-400/20 hover:shadow-blue-400/40 transition-all duration-300 border border-gray-700 hover:border-blue-400/50 mb-4 sm:mb-6 overflow-hidden">
        <div className="p-4 sm:p-6 pb-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4 justify-between">
            <p className="text-xs text-gray-400">📍 {post.city} • {post.date}</p>
            <span className="px-2 sm:px-3 py-1 bg-blue-900/50 text-blue-300 text-xs rounded-full font-medium">🖼 Image</span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-gray-100 mb-1 sm:mb-2">{post.title}</h2>
          <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">{post.description}</p>
        </div>

        <img src={post.image} alt={post.title} className="w-full h-96 object-cover mx-0 sm:mx-6 rounded-lg mb-3 sm:mb-4" />

        <div className="p-4 sm:p-6 pt-0">
          <div className="flex gap-2 flex-wrap mb-3 sm:mb-4">
            {post.tags.map((tag, idx) => (
              <span key={idx} className="text-xs bg-blue-900/30 text-blue-300 px-2 sm:px-3 py-1 rounded-full border border-blue-500/30">
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex gap-3 sm:gap-6 pt-3 sm:pt-4 border-t border-gray-700 text-gray-400 text-sm sm:text-base">
            <button onClick={() => handleLike(post.id)} className={`flex items-center gap-2 hover:text-red-400 transition ${isLiked ? 'text-red-500 font-bold' : ''}`}>
              {isLiked ? '❤️' : '🤍'} {post.likes}
            </button>
            <button className="flex items-center gap-2 hover:text-blue-400 transition">💬 {post.comments ? post.comments.length : 0}</button>
            <button className="flex items-center gap-2 hover:text-green-400 transition">↗️ Share</button>
          </div>
        </div>

        {/* Show related posts from same author horizontally */}
        {authorRelated.length > 0 && (
          <div className="p-3 sm:p-6 pt-2 sm:pt-4 border-t border-gray-700 bg-gray-750/50">
            <p className="text-xs text-gray-500 mb-2 sm:mb-3 uppercase font-semibold tracking-wider">More from {post.author}</p>
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {authorRelated.map((relPost) => (
                <div key={relPost.id} className="shrink-0 w-24 sm:w-32 h-32 sm:h-40 bg-gray-700 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all group">
                  <img src={relPost.image} alt={relPost.title} className="w-full h-full object-cover group-hover:brightness-75 transition-all" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {relPost.type === 'video' && <span className="text-xl sm:text-2xl">▶️</span>}
                    {relPost.type === 'thought' && <span className="text-xl sm:text-2xl">💭</span>}
                    {relPost.type === 'image' && <span className="text-xl sm:text-2xl">🖼</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
          {/* Show ads every 3 posts for free/premium users */}
          {userType !== 'pro' && (
            <div className="mb-8">
              <Ads userType={userType} />
            </div>
          )}
          
          <div className="space-y-4">
            {posts.map((post, index) => {
              const relatedPosts = postsGroupedByAuthor[post.author] || [];
              return (
                <div key={post.id}>
                  {/* Show ads every 3 posts */}
                  {(index + 1) % 3 === 0 && userType !== 'pro' && (
                    <div className="my-8">
                      <Ads userType={userType} />
                    </div>
                  )}
                  <PostCard post={post} relatedPosts={relatedPosts} />
                </div>
              );
            })}
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
          {exploreCities.map((city, idx) => (
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
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-start justify-center z-50 pt-20">
        <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-2xl mx-4 border border-blue-500/30 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">🔍 Search Posts</h2>
            <button onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-white text-2xl">✕</button>
          </div>
          
          <input
            type="text"
            placeholder="Search by title, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 mb-4"
            autoFocus
          />

          <div className="max-h-96 overflow-y-auto space-y-3">
            {filteredPosts.length > 0 ? (
              filteredPosts.slice(0, 5).map(post => (
                <div key={post.id} className="bg-gray-800 p-4 rounded-lg hover:bg-gray-750 cursor-pointer transition" onClick={() => {setSearchOpen(false); setSelectedPost(post);}}>
                  <h3 className="text-blue-400 font-bold">{post.title}</h3>
                  <p className="text-gray-400 text-sm">{post.description.substring(0, 80)}...</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">No posts found</p>
            )}
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
    
    </>
  );
}

export default Posts;
