import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    getUserAds,
    updateAd,
    deleteAd,
    toggleAdStatus,
    getAdStats,
    getAdsByVideo
} from '../services/adsAPI';
import './ManageAds.css';

const ManageAds = () => {
    const { user } = useSelector(state => state.auth);
    const [ads, setAds] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        if (user?.token) {
            fetchAds();
            fetchStats();
        }
    }, [user, filter]);

    const fetchAds = async () => {
        try {
            setLoading(true);
            const params = filter !== 'all' ? { status: filter } : {};
            const response = await getUserAds(params, user?.token);
            setAds(response.ads || []);
        } catch (err) {
            setError('Failed to load ads');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await getAdStats(user?.token);
            setStats(response);
        } catch (err) {
            console.error('Failed to load stats:', err);
        }
    };

    const handleEdit = (ad) => {
        setEditingId(ad._id);
        setEditForm({
            title: ad.title,
            description: ad.description,
            imageUrl: ad.imageUrl,
            linkUrl: ad.linkUrl,
        });
    };

    const handleSaveEdit = async (adId) => {
        try {
            const response = await updateAd(adId, editForm, user?.token);
            if (response.success) {
                setAds(ads.map(ad => ad._id === adId ? response.ad : ad));
                setEditingId(null);
                alert('Ad updated successfully!');
            }
        } catch (err) {
            alert('Failed to update ad: ' + err.response?.data?.message);
        }
    };

    const handleToggleStatus = async (adId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'active' ? 'paused' : 'active';
            const response = await toggleAdStatus(adId, newStatus, user?.token);
            if (response.success) {
                setAds(ads.map(ad => ad._id === adId ? { ...ad, status: newStatus } : ad));
            }
        } catch (err) {
            alert('Failed to update ad status: ' + err.response?.data?.message);
        }
    };

    const handleDelete = async (adId) => {
        if (window.confirm('Are you sure you want to delete this ad?')) {
            try {
                await deleteAd(adId, user?.token);
                setAds(ads.filter(ad => ad._id !== adId));
                alert('Ad deleted successfully!');
            } catch (err) {
                alert('Failed to delete ad: ' + err.response?.data?.message);
            }
        }
    };

    const getStatusBadgeClass = (status) => {
        const statusClasses = {
            'draft': 'status-draft',
            'pending': 'status-pending',
            'active': 'status-active',
            'paused': 'status-paused',
            'expired': 'status-expired',
            'cancelled': 'status-cancelled'
        };
        return statusClasses[status] || 'status-default';
    };

    const statusLabels = {
        'draft': '📝 Draft',
        'pending': '⏳ Pending Payment',
        'active': '🟢 Active',
        'paused': '⏸️ Paused',
        'expired': '⏱️ Expired',
        'cancelled': '❌ Cancelled'
    };

    return (
        <div className="manage-ads-container">
            <div className="manage-ads-header">
                <h1>📊 Manage Your Ads</h1>
            </div>

            {/* Statistics Cards */}
            {stats && (
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>📈 Total Ads</h3>
                        <p className="stat-value">{stats.totalAds || 0}</p>
                    </div>
                    <div className="stat-card">
                        <h3>💰 Active Ads</h3>
                        <p className="stat-value">{stats.activeAds || 0}</p>
                    </div>
                    <div className="stat-card">
                        <h3>👁️ Total Impressions</h3>
                        <p className="stat-value">{(stats.totalImpressions || 0).toLocaleString()}</p>
                    </div>
                    <div className="stat-card">
                        <h3>🖱️ Total Clicks</h3>
                        <p className="stat-value">{(stats.totalClicks || 0).toLocaleString()}</p>
                    </div>
                    <div className="stat-card">
                        <h3>📊 Avg CTR</h3>
                        <p className="stat-value">{((stats.averageCTR || 0) * 100).toFixed(2)}%</p>
                    </div>
                    <div className="stat-card">
                        <h3>💵 Total Spent</h3>
                        <p className="stat-value">${(stats.totalSpent || 0).toFixed(2)}</p>
                    </div>
                </div>
            )}

            {error && <div className="error-message">{error}</div>}

            {/* Filter Buttons */}
            <div className="filter-buttons">
                <button
                    className={filter === 'all' ? 'active' : ''}
                    onClick={() => setFilter('all')}
                >
                    All Ads
                </button>
                <button
                    className={filter === 'draft' ? 'active' : ''}
                    onClick={() => setFilter('draft')}
                >
                    Draft
                </button>
                <button
                    className={filter === 'active' ? 'active' : ''}
                    onClick={() => setFilter('active')}
                >
                    Active
                </button>
                <button
                    className={filter === 'paused' ? 'active' : ''}
                    onClick={() => setFilter('paused')}
                >
                    Paused
                </button>
            </div>

            {/* Ads List */}
            {loading ? (
                <div className="loading">Loading ads...</div>
            ) : ads.length === 0 ? (
                <div className="empty-state">
                    <p>No ads found. Create your first ad to start promoting! 🚀</p>
                </div>
            ) : (
                <div className="ads-grid">
                    {ads.map(ad => (
                        <div key={ad._id} className="ad-card">
                            <div className="ad-image">
                                <img src={ad.imageUrl} alt={ad.title} onError={(e) => e.target.src = '/placeholder.png'} />
                                <div className={`status-badge ${getStatusBadgeClass(ad.status)}`}>
                                    {statusLabels[ad.status] || ad.status}
                                </div>
                            </div>

                            {editingId === ad._id ? (
                                // Edit Mode
                                <div className="ad-edit-form">
                                    <input
                                        type="text"
                                        value={editForm.title}
                                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                        placeholder="Title"
                                        maxLength={50}
                                    />
                                    <textarea
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        placeholder="Description"
                                        maxLength={500}
                                        rows={3}
                                    ></textarea>
                                    <input
                                        type="url"
                                        value={editForm.imageUrl}
                                        onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                                        placeholder="Image URL"
                                    />
                                    <input
                                        type="url"
                                        value={editForm.linkUrl}
                                        onChange={(e) => setEditForm({ ...editForm, linkUrl: e.target.value })}
                                        placeholder="Landing URL"
                                    />
                                    <div className="edit-buttons">
                                        <button
                                            className="btn-save"
                                            onClick={() => handleSaveEdit(ad._id)}
                                        >
                                            Save
                                        </button>
                                        <button
                                            className="btn-cancel"
                                            onClick={() => setEditingId(null)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // View Mode
                                <>
                                    <div className="ad-content">
                                        <h3>{ad.title}</h3>
                                        <p>{ad.description}</p>
                                        <div className="ad-metrics">
                                            <span>👁️ {ad.impressions || 0} impressions</span>
                                            <span>🖱️ {ad.clicks || 0} clicks</span>
                                            <span>📊 {((ad.ctr || 0) * 100).toFixed(2)}% CTR</span>
                                        </div>
                                        <div className="ad-duration">
                                            <span>📅 Duration: {ad.durationDays} days</span>
                                            <span>💵 Cost: ${ad.totalCost?.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="ad-actions">
                                        {ad.status === 'draft' && (
                                            <button
                                                className="btn btn-edit"
                                                onClick={() => handleEdit(ad)}
                                                title="Edit draft ad"
                                            >
                                                ✏️ Edit
                                            </button>
                                        )}

                                        {(ad.status === 'active' || ad.status === 'paused') && (
                                            <button
                                                className={`btn ${ad.status === 'active' ? 'btn-pause' : 'btn-resume'}`}
                                                onClick={() => handleToggleStatus(ad._id, ad.status)}
                                                title={ad.status === 'active' ? 'Pause ad' : 'Resume ad'}
                                            >
                                                {ad.status === 'active' ? '⏸️ Pause' : '▶️ Resume'}
                                            </button>
                                        )}

                                        {(ad.status === 'draft' || ad.status === 'pending') && (
                                            <button
                                                className="btn btn-delete"
                                                onClick={() => handleDelete(ad._id)}
                                                title="Delete ad"
                                            >
                                                🗑️ Delete
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageAds;
