import React, { useState } from 'react';

function Explore({ onNavigate }) {
  const [selectedCity, setSelectedCity] = useState(null);

  const exploreCities = [
    { name: 'Amsterdam', posts: 3456, image: 'https://picsum.photos/400/300?random=201', description: 'Canals, bikes, and tulips' },
    { name: 'Tokyo', posts: 5678, image: 'https://picsum.photos/400/300?random=202', description: 'Ancient traditions meet modern tech' },
    { name: 'Bali', posts: 4234, image: 'https://picsum.photos/400/300?random=203', description: 'Tropical paradise and temples' },
    { name: 'New York', posts: 6789, image: 'https://picsum.photos/400/300?random=204', description: 'The city that never sleeps' },
    { name: 'Venice', posts: 2345, image: 'https://picsum.photos/400/300?random=205', description: 'Romance and water streets' },
    { name: 'Delhi', posts: 4567, image: 'https://picsum.photos/400/300?random=206', description: 'History, culture, and colors' },
    { name: 'London', posts: 5432, image: 'https://picsum.photos/400/300?random=207', description: 'Royal heritage and modern vibes' },
    { name: 'Paris', posts: 7654, image: 'https://picsum.photos/400/300?random=208', description: 'The city of love and art' },
  ];

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
      <aside className="hidden lg:block w-64 bg-gray-950 border-r border-blue-500/70 blue-shine-border p-6 h-screen overflow-y-auto z-40 fixed left-0 top-20 bottom-0">
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
      <section className="w-full lg:flex-1 lg:ml-64 lg:mr-80 py-8 px-4 pb-20 blue-shine-border rounded-2xl">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-100 mb-8">Explore Amazing Cities</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {exploreCities.map((city, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedCity(city)}
                className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-2xl shadow-lg shadow-blue-400/20 transition-all duration-300 cursor-pointer group border border-gray-700 hover:border-blue-400/50"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={city.image} 
                    alt={city.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all"></div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-100 group-hover:text-blue-400 transition-colors">{city.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{city.description}</p>
                  <p className="text-xs text-gray-500 mt-3">{city.posts.toLocaleString()} posts</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RIGHT SIDEBAR - TRENDING */}
      <aside className="hidden lg:block w-80 bg-gray-950 border-l border-blue-500/70 blue-shine-border p-6 fixed right-0 top-20 bottom-0 h-screen overflow-y-auto z-40">
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
