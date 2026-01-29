import React, { useState, useEffect } from 'react';
import './PostWithAds.css';

const PostWithAds = ({ post, onLike, onShare }) => {
  const [displayedAds, setDisplayedAds] = useState([]);
  const [adClickUrl, setAdClickUrl] = useState(null);

  useEffect(() => {
    // Get ads for this post
    const ads = JSON.parse(localStorage.getItem('ads') || '[]');
    const activeAds = ads.filter(ad => 
      ad.targetLocation === 'all' || ad.targetLocation === post.city
    );
    setDisplayedAds(activeAds);
  }, [post.city]);

  const handleAdClick = (ad) => {
    // Track click
    const ads = JSON.parse(localStorage.getItem('ads') || '[]');
    const updatedAds = ads.map(a => 
      a.id === ad.id ? { ...a, clicks: (a.clicks || 0) + 1 } : a
    );
    localStorage.setItem('ads', JSON.stringify(updatedAds));
    
    // Open ad link
    window.open(ad.website || ad.linkUrl || '#', '_blank');
  };

  const handleAdView = (ad) => {
    // Track impression
    const ads = JSON.parse(localStorage.getItem('ads') || '[]');
    const updatedAds = ads.map(a => 
      a.id === ad.id ? { ...a, views: (a.views || 0) + 1 } : a
    );
    localStorage.setItem('ads', JSON.stringify(updatedAds));
  };

  const getDaysUntilExpiry = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    return daysLeft;
  };

  return (
    <div className="post-with-ads">
      {/* Post Content */}
      <div className="post-content">
        <div className="post-header">
          <div className="post-user-info">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.userName}`} alt={post.userName} className="post-avatar" />
            <div className="post-meta">
              <p className="post-username">{post.userName}</p>
              <p className="post-city">📍 {post.city}</p>
            </div>
          </div>
          <button className="post-menu-btn">⋮</button>
        </div>

        {/* Post Media */}
        {post.image && (
          <div className="post-image-container">
            <img src={post.image} alt="post" className="post-image" />
          </div>
        )}

        {/* Post Caption */}
        <div className="post-caption">
          <p>{post.caption}</p>
          {post.tags && post.tags.length > 0 && (
            <div className="post-tags">
              {post.tags.map((tag, i) => (
                <span key={i} className="tag">#{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* Post Actions */}
        <div className="post-actions">
          <button className="action-btn" onClick={onLike}>
            <span>❤️</span> Like
          </button>
          <button className="action-btn">
            <span>💬</span> Comment
          </button>
          <button className="action-btn" onClick={onShare}>
            <span>↗️</span> Share
          </button>
        </div>
      </div>

      {/* Ads Section */}
      {displayedAds.length > 0 && (
        <div className="ads-section">
          <div className="ads-header">
            <h4>📢 Sponsored Ads</h4>
            <span className="ads-count">{displayedAds.length} active</span>
          </div>

          <div className="ads-carousel">
            {displayedAds.map((ad) => {
              const daysLeft = getDaysUntilExpiry(ad.expiresAt);
              const isExpiringSoon = daysLeft <= 3;
              const isExpired = daysLeft <= 0;

              return (
                <div 
                  key={ad.id} 
                  className={`ad-card ${isExpired ? 'expired' : ''} ${isExpiringSoon ? 'expiring-soon' : ''}`}
                  onMouseEnter={() => handleAdView(ad)}
                >
                  {/* Ad Image */}
                  <div className="ad-image-wrapper" onClick={() => handleAdClick(ad)}>
                    <img src={ad.imagePreview || ad.image} alt={ad.title} className="ad-image" />
                    <div className="ad-overlay">
                      <button className="view-ad-btn">View Ad →</button>
                    </div>
                  </div>

                  {/* Ad Info */}
                  <div className="ad-info">
                    <h5 className="ad-title">{ad.title}</h5>
                    <p className="ad-description">{ad.description}</p>

                    {/* Ad Stats */}
                    <div className="ad-stats">
                      <span>👁️ {ad.views || 0}</span>
                      <span>🖱️ {ad.clicks || 0}</span>
                    </div>

                    {/* Expiry Info */}
                    <div className={`ad-expiry ${isExpiringSoon ? 'warning' : ''}`}>
                      {isExpired ? (
                        <p className="expired-text">❌ Ad Expired</p>
                      ) : isExpiringSoon ? (
                        <p className="expiring-text">⚠️ Expires in {daysLeft} day(s)</p>
                      ) : (
                        <p className="valid-text">✅ Valid for {daysLeft} days</p>
                      )}
                    </div>

                    {/* Ad Owner */}
                    <div className="ad-owner">
                      <small>By: {ad.userName}</small>
                      <small>📧 {ad.contactEmail}</small>
                    </div>

                    {/* CTA Button */}
                    <button 
                      className="ad-cta-btn"
                      onClick={() => handleAdClick(ad)}
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostWithAds;
