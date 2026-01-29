import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './AdsDashboard.css';

const AdsDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [userAds, setUserAds] = useState([]);
  const [allAds, setAllAds] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('my-ads');
  const [stats, setStats] = useState({
    totalAds: 0,
    activeAds: 0,
    expiredAds: 0,
    totalImpressions: 0,
    totalClicks: 0,
    totalBudget: 0,
  });

  useEffect(() => {
    loadAdsData();
  }, [user]);

  const loadAdsData = () => {
    const ads = JSON.parse(localStorage.getItem('ads') || '[]');
    const postsData = JSON.parse(localStorage.getItem('posts') || '[]');
    
    setPosts(postsData);
    setAllAds(ads);

    // Filter user's ads
    const myAds = ads.filter(ad => 
      ad.userId === user?._id || ad.userId === user?.id || ad.userName === user?.username
    );
    setUserAds(myAds);

    // Calculate stats
    const now = new Date();
    const activeCount = myAds.filter(ad => new Date(ad.expiresAt) > now).length;
    const expiredCount = myAds.filter(ad => new Date(ad.expiresAt) <= now).length;
    
    setStats({
      totalAds: myAds.length,
      activeAds: activeCount,
      expiredAds: expiredCount,
      totalImpressions: myAds.reduce((sum, ad) => sum + (ad.views || 0), 0),
      totalClicks: myAds.reduce((sum, ad) => sum + (ad.clicks || 0), 0),
      totalBudget: myAds.reduce((sum, ad) => sum + (ad.budget || 0), 0),
    });
  };

  const getDaysUntilExpiry = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  const getAdStatus = (expiresAt) => {
    const daysLeft = getDaysUntilExpiry(expiresAt);
    if (daysLeft <= 0) return 'expired';
    if (daysLeft <= 3) return 'expiring-soon';
    return 'active';
  };

  const getAdLocationPosts = (ad) => {
    return posts.filter(post => 
      ad.targetLocation === 'all' || ad.targetLocation === post.city
    );
  };

  const deleteAd = (adId) => {
    if (window.confirm('Are you sure you want to delete this ad?')) {
      const ads = JSON.parse(localStorage.getItem('ads') || '[]');
      const updatedAds = ads.filter(ad => ad.id !== adId);
      localStorage.setItem('ads', JSON.stringify(updatedAds));
      loadAdsData();
    }
  };

  const renewAd = (ad) => {
    // Create a copy with new expiry date
    const renewedAd = {
      ...ad,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + ad.duration * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      clicks: 0,
      views: 0,
    };

    const ads = JSON.parse(localStorage.getItem('ads') || '[]');
    ads.push(renewedAd);
    localStorage.setItem('ads', JSON.stringify(ads));
    loadAdsData();
    alert('✅ Ad renewed successfully!');
  };

  return (
    <div className="ads-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>📊 Ads Dashboard</h1>
        <p>Manage your advertisements and track performance</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📢</div>
          <div className="stat-content">
            <p className="stat-label">Total Ads</p>
            <p className="stat-value">{stats.totalAds}</p>
          </div>
        </div>

        <div className="stat-card active">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <p className="stat-label">Active Ads</p>
            <p className="stat-value">{stats.activeAds}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <p className="stat-label">Expired</p>
            <p className="stat-value">{stats.expiredAds}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👁️</div>
          <div className="stat-content">
            <p className="stat-label">Total Views</p>
            <p className="stat-value">{stats.totalImpressions.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🖱️</div>
          <div className="stat-content">
            <p className="stat-label">Total Clicks</p>
            <p className="stat-value">{stats.totalClicks.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <p className="stat-label">Total Budget</p>
            <p className="stat-value">₹{stats.totalBudget.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-section">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'my-ads' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-ads')}
          >
            📝 My Ads ({userAds.length})
          </button>
          <button
            className={`tab ${activeTab === 'all-ads' ? 'active' : ''}`}
            onClick={() => setActiveTab('all-ads')}
          >
            🌍 All Ads ({allAds.length})
          </button>
        </div>

        {/* My Ads Tab */}
        {activeTab === 'my-ads' && (
          <div className="tab-content">
            {userAds.length === 0 ? (
              <div className="empty-state">
                <p>📭 No ads yet. Create your first ad!</p>
              </div>
            ) : (
              <div className="ads-list">
                {userAds.map(ad => {
                  const status = getAdStatus(ad.expiresAt);
                  const daysLeft = getDaysUntilExpiry(ad.expiresAt);
                  const activePosts = getAdLocationPosts(ad);
                  const ctr = ad.views > 0 ? ((ad.clicks / ad.views) * 100).toFixed(2) : 0;

                  return (
                    <div key={ad.id} className={`ad-item ${status}`}>
                      <div className="ad-image">
                        <img src={ad.imagePreview || ad.image} alt={ad.title} />
                        <span className={`status-badge ${status}`}>
                          {status === 'expired' ? '❌ Expired' : 
                           status === 'expiring-soon' ? '⚠️ Expiring' : '✅ Active'}
                        </span>
                      </div>

                      <div className="ad-details">
                        <h3>{ad.title}</h3>
                        <p className="ad-desc">{ad.description}</p>

                        <div className="ad-meta">
                          <span>📍 {ad.targetLocation}</span>
                          <span>💰 ₹{ad.budget}</span>
                          <span>⏱️ {ad.duration} days</span>
                        </div>

                        <div className="ad-stats-row">
                          <div className="stat">
                            <span className="label">Views:</span>
                            <span className="value">{ad.views || 0}</span>
                          </div>
                          <div className="stat">
                            <span className="label">Clicks:</span>
                            <span className="value">{ad.clicks || 0}</span>
                          </div>
                          <div className="stat">
                            <span className="label">CTR:</span>
                            <span className="value">{ctr}%</span>
                          </div>
                        </div>

                        {/* Posts where ad is shown */}
                        <div className="ad-posts">
                          <p className="posts-label">📺 Showing on {activePosts.length} posts</p>
                          {activePosts.length > 0 && (
                            <div className="posts-preview">
                              {activePosts.slice(0, 3).map((post, idx) => (
                                <div key={idx} className="post-preview">
                                  <small>📍 {post.city}</small>
                                </div>
                              ))}
                              {activePosts.length > 3 && (
                                <small className="more">+{activePosts.length - 3} more</small>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Expiry Info */}
                        <div className={`expiry-info ${status}`}>
                          {status === 'expired' ? (
                            <p>❌ This ad has expired</p>
                          ) : (
                            <p>⏰ Expires in {daysLeft} day(s)</p>
                          )}
                        </div>
                      </div>

                      <div className="ad-actions">
                        {status === 'expired' ? (
                          <button 
                            className="btn renew"
                            onClick={() => renewAd(ad)}
                          >
                            Renew Ad
                          </button>
                        ) : (
                          <button 
                            className="btn renew"
                            onClick={() => renewAd(ad)}
                          >
                            Extend
                          </button>
                        )}
                        <button 
                          className="btn delete"
                          onClick={() => deleteAd(ad.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* All Ads Tab */}
        {activeTab === 'all-ads' && (
          <div className="tab-content">
            {allAds.length === 0 ? (
              <div className="empty-state">
                <p>📭 No ads in the system</p>
              </div>
            ) : (
              <div className="ads-table">
                <table>
                  <thead>
                    <tr>
                      <th>Ad Title</th>
                      <th>Owner</th>
                      <th>Location</th>
                      <th>Budget</th>
                      <th>Views</th>
                      <th>Clicks</th>
                      <th>CTR</th>
                      <th>Status</th>
                      <th>Posts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allAds.map(ad => {
                      const status = getAdStatus(ad.expiresAt);
                      const activePosts = getAdLocationPosts(ad);
                      const ctr = ad.views > 0 ? ((ad.clicks / ad.views) * 100).toFixed(2) : 0;

                      return (
                        <tr key={ad.id} className={status}>
                          <td className="title">{ad.title}</td>
                          <td>{ad.userName}</td>
                          <td>{ad.targetLocation}</td>
                          <td>₹{ad.budget}</td>
                          <td>{ad.views || 0}</td>
                          <td>{ad.clicks || 0}</td>
                          <td>{ctr}%</td>
                          <td>
                            <span className={`status-badge ${status}`}>
                              {status === 'expired' ? '❌' : 
                               status === 'expiring-soon' ? '⚠️' : '✅'}
                            </span>
                          </td>
                          <td>{activePosts.length}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdsDashboard;
