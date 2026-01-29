import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { createAd } from '../services/adsAPI';
import './CreateAd.css';

const CreateAd = ({ videoId, onAdCreated, onClose }) => {
    const { user } = useSelector(state => state.auth);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        videoId: videoId || '',
        title: '',
        description: '',
        imageUrl: '',
        linkUrl: '',
        durationDays: 1,
        costPerDay: 10,
    });

    const [totalCost, setTotalCost] = useState(10);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedData = { ...formData, [name]: value };

        if (name === 'durationDays' || name === 'costPerDay') {
            const duration = parseInt(name === 'durationDays' ? value : formData.durationDays);
            const cost = parseFloat(name === 'costPerDay' ? value : formData.costPerDay);
            setTotalCost(duration * cost);
        }

        setFormData(updatedData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate inputs
            if (!formData.title.trim()) {
                setError('Title is required');
                setLoading(false);
                return;
            }
            if (!formData.description.trim()) {
                setError('Description is required');
                setLoading(false);
                return;
            }
            if (!formData.imageUrl.trim()) {
                setError('Image URL is required');
                setLoading(false);
                return;
            }
            if (!formData.linkUrl.trim()) {
                setError('Link URL is required');
                setLoading(false);
                return;
            }

            const duration = parseInt(formData.durationDays);
            if (duration < 1 || duration > 90) {
                setError('Duration must be between 1 and 90 days');
                setLoading(false);
                return;
            }

            const cost = parseFloat(formData.costPerDay);
            if (cost <= 0) {
                setError('Cost per day must be greater than 0');
                setLoading(false);
                return;
            }

            const adData = {
                ...formData,
                durationDays: duration,
                costPerDay: cost,
            };

            const response = await createAd(adData, user?.token);

            if (response.success) {
                alert('Ad created successfully! Status: Draft - Awaiting Payment');
                if (onAdCreated) onAdCreated(response.ad);
                if (onClose) onClose();
            } else {
                setError(response.message || 'Failed to create ad');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating ad');
            console.error('Create ad error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-ad-container">
            <div className="create-ad-card">
                <div className="create-ad-header">
                    <h2>💰 Create Video Advertisement</h2>
                    {onClose && <button className="close-btn" onClick={onClose}>✕</button>}
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {/* Video ID */}
                    <div className="form-group">
                        <label>Video ID *</label>
                        <input
                            type="text"
                            name="videoId"
                            value={formData.videoId}
                            onChange={handleChange}
                            disabled={!!videoId}
                            placeholder="Enter video ID"
                            required
                        />
                        <small>The video this ad will be displayed on</small>
                    </div>

                    {/* Title */}
                    <div className="form-group">
                        <label>Ad Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Summer Sale - 50% Off"
                            maxLength={50}
                            required
                        />
                        <small>{formData.title.length}/50 characters</small>
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label>Ad Description *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe your ad and what you're promoting..."
                            maxLength={500}
                            rows={4}
                            required
                        ></textarea>
                        <small>{formData.description.length}/500 characters</small>
                    </div>

                    {/* Image URL */}
                    <div className="form-group">
                        <label>Ad Image URL *</label>
                        <input
                            type="url"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                            required
                        />
                        {formData.imageUrl && (
                            <div className="image-preview">
                                <img src={formData.imageUrl} alt="Ad preview" onError={(e) => e.target.src = '/placeholder.png'} />
                            </div>
                        )}
                    </div>

                    {/* Link URL */}
                    <div className="form-group">
                        <label>Landing Page URL *</label>
                        <input
                            type="url"
                            name="linkUrl"
                            value={formData.linkUrl}
                            onChange={handleChange}
                            placeholder="https://yoursite.com"
                            required
                        />
                        <small>Users will be redirected here when they click the ad</small>
                    </div>

                    {/* Duration and Cost Row */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Duration (Days) * <span className="required">(1-90)</span></label>
                            <input
                                type="number"
                                name="durationDays"
                                value={formData.durationDays}
                                onChange={handleChange}
                                min="1"
                                max="90"
                                required
                            />
                            <small>How long the ad will run</small>
                        </div>

                        <div className="form-group">
                            <label>Cost Per Day ($) *</label>
                            <input
                                type="number"
                                name="costPerDay"
                                value={formData.costPerDay}
                                onChange={handleChange}
                                min="0.01"
                                step="0.01"
                                required
                            />
                            <small>Daily advertising cost</small>
                        </div>
                    </div>

                    {/* Total Cost Summary */}
                    <div className="cost-summary">
                        <div className="summary-row">
                            <span>Duration:</span>
                            <strong>{formData.durationDays} days</strong>
                        </div>
                        <div className="summary-row">
                            <span>Daily Rate:</span>
                            <strong>${formData.costPerDay.toFixed(2)}</strong>
                        </div>
                        <div className="summary-row total">
                            <span>Total Cost:</span>
                            <strong>${totalCost.toFixed(2)}</strong>
                        </div>
                    </div>

                    {/* Pricing Info */}
                    <div className="pricing-info">
                        <p>💡 <strong>Pricing Model:</strong> Duration × Daily Rate = Total Cost</p>
                        <p>Status after creation: <strong>Draft</strong> (awaiting payment)</p>
                        <p>After payment: <strong>Active</strong> (ready to display on video)</p>
                    </div>

                    {/* Buttons */}
                    <div className="form-buttons">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                        >
                            {loading ? 'Creating Ad...' : `Create Ad & Pay $${totalCost.toFixed(2)}`}
                        </button>
                        {onClose && (
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAd;
