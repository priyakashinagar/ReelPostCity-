import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import './Posts.css';

function MyAds({ onNavigate }) {
  const { user } = useAuth();
  const [ads, setAds] = useState([]);
  const [filter, setFilter] = useState('all'); // all, active, paused, expired
  const [loading, setLoading] = useState(true);

  const handleBack = () => {
    onNavigate('home');
  };

  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = () => {
    setLoading(true);
    const allAds = JSON.parse(localStorage.getItem('ads') || '[]');
    const userAds = allAds.filter(ad => ad.userId === user?.id);
    setAds(userAds);
    setLoading(false);
  };

  const toggleAdStatus = (adId, currentStatus) => {
    const allAds = JSON.parse(localStorage.getItem('ads') || '[]');
    const adIndex = allAds.findIndex(ad => ad.id === adId);
    
    if (adIndex !== -1) {
      allAds[adIndex].status = currentStatus === 'active' ? 'paused' : 'active';
      localStorage.setItem('ads', JSON.stringify(allAds));
      loadAds();
    }
  };

  const deleteAd = (adId) => {
    if (window.confirm('Are you sure you want to delete this ad?')) {
      const allAds = JSON.parse(localStorage.getItem('ads') || '[]');
      const filteredAds = allAds.filter(ad => ad.id !== adId);
      localStorage.setItem('ads', JSON.stringify(filteredAds));
      loadAds();
    }
  };

  const getFilteredAds = () => {
    const now = new Date();
    return ads.filter(ad => {
      if (filter === 'active') return ad.status === 'active' && new Date(ad.expiresAt) > now;
      if (filter === 'paused') return ad.status === 'paused';
      if (filter === 'expired') return new Date(ad.expiresAt) <= now;
      return true;
    });
  };

  const getStatusBadge = (ad) => {
    const now = new Date();
    if (new Date(ad.expiresAt) <= now) {
      return <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">Expired</span>;
    }
    if (ad.status === 'paused') {
      return <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">Paused</span>;
    }
    return <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Active</span>;
  };

  const filteredAds = getFilteredAds();

  return (
    <div className="min-h-screen bg-gray-900 pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-white hover:text-blue-400 flex-shrink-0"
              title="Go back"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold shine-text mb-2">📢 My Advertisements</h1>
              <p className="text-gray-400">Manage your active and past advertisements</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('post-ad')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition whitespace-nowrap"
          >
            + Create New Ad
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['all', 'active', 'paused', 'expired'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg font-bold transition ${
                filter === tab
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Ads Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your ads...</p>
          </div>
        ) : filteredAds.length === 0 ? (
          <div className="text-center py-12 bg-gray-800/50 rounded-lg">
            <p className="text-gray-400 mb-4">No ads found in this category</p>
            <button
              onClick={() => onNavigate('post-ad')}
              className="text-blue-400 hover:text-blue-300 font-bold"
            >
              Create your first ad
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAds.map(ad => {
              const now = new Date();
              const expiresAt = new Date(ad.expiresAt);
              const daysLeft = Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24));
              const isExpired = daysLeft <= 0;

              return (
                <div
                  key={ad.id}
                  className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 transition-all shadow-lg"
                >
                  {/* Ad Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-700">
                    <img
                      src={ad.imagePreview}
                      alt={ad.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2 right-2">
                      {getStatusBadge(ad)}
                    </div>
                  </div>

                  {/* Ad Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2 truncate">{ad.title}</h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{ad.description}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4 text-center text-sm">
                      <div className="bg-blue-500/20 rounded p-2">
                        <p className="text-blue-400 font-bold">{ad.views || 0}</p>
                        <p className="text-gray-400 text-xs">Views</p>
                      </div>
                      <div className="bg-green-500/20 rounded p-2">
                        <p className="text-green-400 font-bold">{ad.clicks || 0}</p>
                        <p className="text-gray-400 text-xs">Clicks</p>
                      </div>
                      <div className="bg-purple-500/20 rounded p-2">
                        <p className="text-purple-400 font-bold">₹{ad.budget}</p>
                        <p className="text-gray-400 text-xs">Budget</p>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="text-xs text-gray-500 mb-4 space-y-1">
                      <p>📍 Location: {ad.targetLocation}</p>
                      <p>⏰ Duration: {ad.duration} days</p>
                      {!isExpired && daysLeft > 0 && (
                        <p className="text-blue-400">⏳ {daysLeft} days left</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {!isExpired && (
                        <button
                          onClick={() => toggleAdStatus(ad.id, ad.status)}
                          className={`flex-1 py-2 rounded font-bold transition text-sm ${
                            ad.status === 'active'
                              ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                              : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          }`}
                        >
                          {ad.status === 'active' ? '⏸ Pause' : '▶ Resume'}
                        </button>
                      )}
                      <button
                        onClick={() => deleteAd(ad.id)}
                        className="flex-1 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded font-bold transition text-sm"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Total Spent */}
        {ads.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-6">
            <h3 className="text-white font-bold mb-3">💰 Total Ad Spending</h3>
            <p className="text-3xl font-bold text-blue-400">
              ₹{ads.reduce((sum, ad) => sum + ad.budget, 0).toLocaleString()}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Across {ads.length} advertisement{ads.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyAds;
