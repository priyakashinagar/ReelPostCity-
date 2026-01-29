import React, { useState, useEffect } from 'react';
import './AdExpirationNotification.css';

const AdExpirationNotification = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [dismissedAds, setDismissedAds] = useState(() => {
    const saved = localStorage.getItem('dismissedAdNotifications');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    checkAdExpirations();
    // Check every hour
    const interval = setInterval(checkAdExpirations, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);

  const checkAdExpirations = () => {
    const ads = JSON.parse(localStorage.getItem('ads') || '[]');
    const userAds = ads.filter(ad => 
      ad.userId === user?._id || ad.userId === user?.id || ad.userName === user?.username
    );

    const newNotifications = [];
    const now = new Date();

    userAds.forEach(ad => {
      if (dismissedAds.includes(ad.id)) return;

      const expiryDate = new Date(ad.expiresAt);
      const daysLeft = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

      // Notify if expiring in 3 days or already expired
      if (daysLeft <= 3 && daysLeft > 0) {
        newNotifications.push({
          id: `expiring-${ad.id}`,
          adId: ad.id,
          type: 'expiring',
          title: ad.title,
          message: `Your ad "${ad.title}" will expire in ${daysLeft} day(s)`,
          daysLeft,
          budget: ad.budget,
          duration: ad.duration,
          adId: ad.id,
          action: 'Renew Now'
        });
      } else if (daysLeft <= 0) {
        newNotifications.push({
          id: `expired-${ad.id}`,
          adId: ad.id,
          type: 'expired',
          title: ad.title,
          message: `Your ad "${ad.title}" has expired`,
          budget: ad.budget,
          duration: ad.duration,
          action: 'Repost Ad'
        });
      }
    });

    setNotifications(newNotifications);
  };

  const handleDismiss = (notificationId, adId) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
    setDismissedAds([...dismissedAds, adId]);
    localStorage.setItem('dismissedAdNotifications', JSON.stringify([...dismissedAds, adId]));
  };

  const handleRenew = (ad) => {
    // Store the ad to renew in localStorage
    localStorage.setItem('adToRenew', JSON.stringify(ad));
    // Trigger navigation to renewal page (you'll need to implement this in your app)
    window.dispatchEvent(new CustomEvent('renewAd', { detail: ad }));
  };

  const handleRepost = (ad) => {
    // Clear the expired ad
    const ads = JSON.parse(localStorage.getItem('ads') || '[]');
    const updatedAds = ads.filter(a => a.id !== ad.id);
    localStorage.setItem('ads', JSON.stringify(updatedAds));
    
    // Show repost form
    localStorage.setItem('adToRepost', JSON.stringify(ad));
    window.dispatchEvent(new CustomEvent('repostAd', { detail: ad }));
    
    handleDismiss(`expired-${ad.id}`, ad.id);
  };

  if (notifications.length === 0) return null;

  return (
    <div className="ad-notification-container">
      <div className="notifications-stack">
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`notification-card ${notification.type}`}
          >
            {notification.type === 'expiring' ? (
              <div className="notification-content">
                <div className="notification-icon">⏰</div>
                <div className="notification-body">
                  <h4 className="notification-title">Ad Expiring Soon!</h4>
                  <p className="notification-message">{notification.message}</p>
                  <p className="notification-details">
                    📊 Budget: ₹{notification.budget} | ⏱️ Duration: {notification.duration} days
                  </p>
                </div>
                <div className="notification-actions">
                  <button 
                    className="btn-primary"
                    onClick={() => handleRenew(notification)}
                  >
                    {notification.action}
                  </button>
                  <button 
                    className="btn-secondary"
                    onClick={() => handleDismiss(notification.id, notification.adId)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <div className="notification-content">
                <div className="notification-icon">❌</div>
                <div className="notification-body">
                  <h4 className="notification-title">Ad Expired</h4>
                  <p className="notification-message">{notification.message}</p>
                  <p className="notification-details">
                    📊 Budget: ₹{notification.budget} | ⏱️ Duration: {notification.duration} days
                  </p>
                </div>
                <div className="notification-actions">
                  <button 
                    className="btn-danger"
                    onClick={() => handleRepost(notification)}
                  >
                    {notification.action}
                  </button>
                  <button 
                    className="btn-secondary"
                    onClick={() => handleDismiss(notification.id, notification.adId)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdExpirationNotification;
