import React from 'react';

function Posts({ onNavigate }) {
  const posts = [
    {
      id: 1,
      city: 'Utrecht',
      title: 'Discovering the charm of Utrecht\'s canals',
      description: 'Discovering the charm of Utrecht\'s canals, a perfect blend of history and modern culture.',
      image: 'https://picsum.photos/400/300?random=1',
      author: 'John Doe',
      date: '2 hours ago',
      likes: 234,
      tags: ['canal', 'history', 'urban']
    },
    {
      id: 2,
      city: 'Utrecht',
      title: 'Utrecht\'s majestic Dom Tower',
      description: 'Utrecht\'s majestic Dom Tower, an architectural marvel standing tall above the city.',
      image: 'https://picsum.photos/400/300?random=2',
      author: 'Jane Smith',
      date: '5 hours ago',
      likes: 456,
      tags: ['architecture', 'landmark', 'photography']
    },
    {
      id: 3,
      city: 'Utrecht',
      title: 'Immersed in art at one of Utrecht\'s fantastic museums',
      description: 'Immersed in art at one of Utrecht\'s fantastic museums. Inspiring new perspectives.',
      image: 'https://picsum.photos/400/300?random=3',
      author: 'Alex Brown',
      date: '1 day ago',
      likes: 189,
      tags: ['art', 'museum', 'culture']
    },
    {
      id: 4,
      city: 'Utrecht',
      title: 'Enjoying a peaceful afternoon stroll through Utrecht\'s beautiful city',
      description: 'Enjoying a peaceful afternoon stroll through Utrecht\'s beautiful city parks and streets.',
      image: 'https://picsum.photos/400/300?random=4',
      author: 'Sarah Wilson',
      date: '2 days ago',
      likes: 567,
      tags: ['travel', 'walk', 'nature']
    },
    {
      id: 5,
      city: 'Utrecht',
      title: 'Coffee and pastries at a charming Utrecht cafe',
      description: 'Coffee and pastries at a charming Utrecht cafe. The perfect spot to relax.',
      image: 'https://picsum.photos/400/300?random=5',
      author: 'Mike Johnson',
      date: '3 days ago',
      likes: 345,
      tags: ['food', 'cafe', 'lifestyle']
    },
    {
      id: 6,
      city: 'Utrecht',
      title: 'Exploring the vibrant streets of Utrecht',
      description: 'Exploring the vibrant streets of Utrecht, full of hidden gems and unique shops.',
      image: 'https://picsum.photos/400/300?random=6',
      author: 'Emily Davis',
      date: '4 days ago',
      likes: 423,
      tags: ['shopping', 'street', 'culture']
    },
    {
      id: 7,
      city: 'Utrecht',
      title: 'Boats gently swaying on the canal waters',
      description: 'Boats gently swaying on the canal waters, a quintessential Utrecht experience.',
      image: 'https://picsum.photos/400/300?random=7',
      author: 'Tom Wilson',
      date: '5 days ago',
      likes: 612,
      tags: ['water', 'boats', 'scenic']
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gray-900">
      {/* Header */}
      <section className="relative bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8" style={{backgroundImage: 'url(https://picsum.photos/1200/400?random=100)'}}>
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">City Posts</h1>
          <p className="text-lg text-gray-200 mb-6 leading-relaxed">Utrecht, a vibrant city in the heart of the Netherlands, known for its picturesque canals, historic buildings, and lively cultural scene.</p>
          <button 
            onClick={() => onNavigate('create-post')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50 hover:scale-105 border border-blue-400"
          >
            + Create Post
          </button>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Filter Section */}
          <div className="mb-12 bg-gray-800 rounded-lg p-6 border border-blue-500 shadow-lg shadow-blue-500/50">
            <h2 className="text-2xl font-bold text-white mb-4">Browse Posts</h2>
            <p className="text-gray-300 mb-6">Explore amazing posts from our community of explorers and photographers</p>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg border border-blue-400 transition-all hover:shadow-blue-500/50">All Posts</button>
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg border border-gray-600 transition-all">Photography</button>
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg border border-gray-600 transition-all">Travel</button>
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg border border-gray-600 transition-all">Urban</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {posts.map(post => (
              <div
                key={post.id}
                onClick={() => onNavigate('post-detail', post)}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-blue-500 hover:border-blue-400 hover:scale-105 group shadow-blue-500/50 hover:shadow-blue-400/70"
              >
                <div className="relative overflow-hidden h-32">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-bold text-white mb-1 line-clamp-2">{post.title}</h3>
                  <p className="text-xs text-gray-400 mb-2 line-clamp-1">{post.description}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-700 pt-2">
                    <span className="font-medium truncate">{post.author}</span>
                    <span className="text-xs">{post.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-16">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-12 rounded-lg border border-blue-400 transition-all duration-300 shadow-lg shadow-blue-500/50 hover:shadow-blue-400/70 hover:scale-105">
              ↓ Load More Posts
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Posts;
