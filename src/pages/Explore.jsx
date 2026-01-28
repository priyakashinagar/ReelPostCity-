import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCity, fetchFeaturedCities } from '../store/slices/citySlice.js';
import { getAllPosts } from '../services/postService.js';

function Explore({ onNavigate }) {
  const dispatch = useDispatch();
  const { cities, loading } = useSelector(state => state.city);
  const [selectedCity, setSelectedCity] = useState(null);
  const [postCounts, setPostCounts] = useState({});

  // Fetch featured cities and calculate post counts
  useEffect(() => {
    dispatch(fetchFeaturedCities());
  }, [dispatch]);

  // Calculate post counts for each city
  useEffect(() => {
    const calculateCounts = async () => {
      try {
        const response = await getAllPosts();
        const posts = response?.data || [];
        
        const counts = {};
        cities.forEach(city => {
          const cityName = city.displayName || city.name;
          const count = posts.filter(post => {
            const postCity = post.city || post.cityName;
            return postCity && postCity.toLowerCase().trim() === cityName.toLowerCase().trim();
          }).length;
          counts[cityName] = count;
        });
        
        setPostCounts(counts);
      } catch (error) {
        console.error('Error calculating post counts:', error);
      }
    };

    if (cities && cities.length > 0) {
      calculateCounts();
    }
  }, [cities]);

  const trendingTags = [
    { name: '#Travel', posts: '2.5M' },
    { name: '#Photography', posts: '1.8M' },
    { name: '#Adventure', posts: '3.2M' },
    { name: '#Foodie', posts: '1.5M' },
    { name: '#CityLife', posts: '2.1M' },
    { name: '#Wanderlust', posts: '2.8M' },
  ];

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
    
    <div className="w-full bg-gray-900 flex flex-col lg:flex-row">
      {/* LEFT SIDEBAR */}
      <aside className="hidden lg:block w-64 bg-gray-950 border-r border-blue-500/70 blue-shine-border p-6 h-screen overflow-y-auto z-40 fixed left-0 top-14 bottom-0 scrollbar-hide">
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
          
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg bg-blue-900/30 border border-blue-500/50 text-gray-100 font-medium hover:bg-blue-900/50 transition-all">
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
          
          <button onClick={() => onNavigate('profile')} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 transition-all font-medium">
            <span className="text-lg">⚙</span>
            <span>Profile</span>
          </button>
        </nav>
      </aside>

      {/* CENTER CONTENT */}
      <section className="w-full lg:flex-1 lg:ml-64 lg:mr-80 py-4 px-4 pb-20 blue-shine-border rounded-2xl">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-100 mb-8">Explore Amazing Cities</h1>
          
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
                <p className="text-gray-400">Loading cities...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {cities && cities.length > 0 ? (
                cities.map((city, idx) => (
                  <div 
                    key={city._id || idx}
                    onClick={() => {
                      setSelectedCity(city);
                      dispatch(selectCity({
                        id: city._id,
                        name: city.displayName || city.name,
                        displayName: city.displayName || city.name,
                        image: city.image,
                        description: city.description || '',
                        totalPosts: postCounts[city.displayName || city.name] || 0
                      }));
                      onNavigate('posts', null, true);
                    }}
                    className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-2xl shadow-lg shadow-blue-400/20 transition-all duration-300 cursor-pointer group border border-gray-700 hover:border-blue-400/50"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={city.image || `https://picsum.photos/400/300?random=${idx}`} 
                        alt={city.displayName || city.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all"></div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-100 group-hover:text-blue-400 transition-colors">{city.displayName || city.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">{city.description || 'Explore this amazing city'}</p>
                      <p className="text-xs text-gray-500 mt-3">{(postCounts[city.displayName || city.name] || 0).toLocaleString()} posts</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 col-span-full text-center py-8">No cities available</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* RIGHT SIDEBAR - TRENDING */}
      <aside className="hidden lg:block w-80 bg-gray-950 border-l border-blue-500/70 blue-shine-border p-6 fixed right-0 top-14 bottom-0 h-screen overflow-y-auto z-40 scrollbar-hide">
        <h2 className="text-sm font-bold text-gray-300 mb-6 uppercase tracking-wider">Trending Tags</h2>

        <div className="space-y-3">
          {trendingTags.map((tag, idx) => (
            <div
              key={idx}
              onClick={() => alert(`Viewing posts with ${tag.name}`)}
              className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500/50 hover:bg-gray-750 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-100 group-hover:text-blue-400 transition-colors text-sm">{tag.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{tag.posts} posts</p>
                </div>
                <button onClick={(e) => {e.stopPropagation(); alert(`Following ${tag.name}!`);}} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-all font-medium">
                  Follow
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700">
          <h3 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-wider">More</h3>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2 text-gray-400 hover:text-blue-400 hover:bg-gray-800 rounded transition-all text-sm">✔ Saved</button>
            <button className="w-full text-left px-4 py-2 text-gray-400 hover:text-blue-400 hover:bg-gray-800 rounded transition-all text-sm">🔔 Notifications</button>
            <button className="w-full text-left px-4 py-2 text-gray-400 hover:text-blue-400 hover:bg-gray-800 rounded transition-all text-sm">⚙ Settings</button>
            <button className="w-full text-left px-4 py-2 text-gray-400 hover:text-blue-400 hover:bg-gray-800 rounded transition-all text-sm">ℹ Help</button>
          </div>
        </div>
      </aside>

      {/* MODAL */}
      {selectedCity && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 md:p-8 max-w-md w-full border border-blue-500/50 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-100">{selectedCity.name}</h2>
              <button onClick={() => setSelectedCity(null)} className="text-2xl text-gray-400 hover:text-gray-300">✕</button>
            </div>
            <img src={selectedCity.image} alt={selectedCity.name} className="w-full h-40 object-cover rounded-lg mb-4" />
            <p className="text-gray-300 mb-4">{selectedCity.description}</p>
            <p className="text-gray-400 text-sm mb-6">📍 {selectedCity.posts.toLocaleString()} travelers have posted from here</p>
            <div className="flex gap-3">
              <button onClick={() => setSelectedCity(null)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-100 font-semibold py-2 rounded-lg transition-all">
                Close
              </button>
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all">
                View Posts
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
    </>
  );
}

export default Explore;
