import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import './CreatePost.css';

function PostAd({ onNavigate }) {
  const { user } = useAuth();

  const handleBack = () => {
    onNavigate('home');
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    imagePreview: '',
    targetLocation: 'all',
    budget: 500,
    duration: 7, // days
    contactEmail: user?.email || '',
    contactPhone: '',
    website: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const indianCities = [
    'All India',
    'Delhi',
    'Mumbai',
    'Bangalore',
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Pune',
    'Lucknow',
    'Shimla',
    'Noida',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imagePreview: reader.result,
          image: file.name,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!formData.title || !formData.description || !formData.imagePreview) {
        throw new Error('Please fill all required fields');
      }

      if (formData.budget < 100) {
        throw new Error('Minimum budget is ₹100');
      }

      if (formData.duration < 1 || formData.duration > 90) {
        throw new Error('Duration must be 1-90 days');
      }

      // Create ad object
      const newAd = {
        id: Date.now(),
        userId: user.id,
        userName: user.username,
        userEmail: user.email,
        ...formData,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + formData.duration * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        clicks: 0,
        views: 0,
      };

      // Save to localStorage
      const ads = JSON.parse(localStorage.getItem('ads') || '[]');
      ads.push(newAd);
      localStorage.setItem('ads', JSON.stringify(ads));

      setSuccess('✅ Ad posted successfully! Your ad will be live soon.');
      
      // Reset form
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          image: '',
          imagePreview: '',
          targetLocation: 'all',
          budget: 500,
          duration: 7,
          contactEmail: user?.email || '',
          contactPhone: '',
          website: '',
        });
        onNavigate('my-ads');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-20 pb-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-12">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-white hover:text-blue-400 flex-shrink-0"
            title="Go back"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold shine-text mb-4">📢 Post Your Advertisement</h1>
            <p className="text-gray-400">Reach your audience across India</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-8 backdrop-blur-md">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
              <p className="text-green-300">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Ad Title */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Ad Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter ad title (Max 50 chars)"
                maxLength={50}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.title.length}/50</p>
            </div>

            {/* Ad Description */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your product/service (Max 250 chars)"
                maxLength={250}
                rows={5}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.description.length}/250</p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Ad Image/Banner *</label>
              <div className="border-2 border-dashed border-blue-500/50 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="imageInput"
                />
                <label htmlFor="imageInput" className="cursor-pointer">
                  {formData.imagePreview ? (
                    <div>
                      <img src={formData.imagePreview} alt="Preview" className="w-full h-64 object-cover rounded-lg mb-3" />
                      <p className="text-blue-400 text-sm">Click to change image</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-3xl mb-2">📸</p>
                      <p className="text-gray-300 font-medium">Click or drag to upload image</p>
                      <p className="text-gray-500 text-sm mt-1">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Target Location */}
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Target Location *</label>
                <select
                  name="targetLocation"
                  value={formData.targetLocation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition"
                >
                  {indianCities.map(city => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Budget (₹) *</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    name="budget"
                    min="100"
                    max="50000"
                    step="100"
                    value={formData.budget}
                    onChange={handleChange}
                    className="flex-1"
                  />
                  <span className="text-blue-400 font-bold text-lg w-24 text-right">₹{formData.budget.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Min: ₹100 | Max: ₹50,000</p>
              </div>
            </div>

            {/* Duration & Contact Info */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Duration */}
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Duration (Days) *</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    name="duration"
                    min="1"
                    max="90"
                    step="1"
                    value={formData.duration}
                    onChange={handleChange}
                    className="flex-1"
                  />
                  <span className="text-blue-400 font-bold text-lg w-16 text-right">{formData.duration}d</span>
                </div>
              </div>

              {/* Contact Email */}
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            {/* Contact Phone & Website */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Phone */}
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Contact Phone</label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Website URL</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://yourwebsite.com"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <h3 className="text-white font-bold mb-3">💰 Cost Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-300">
                  <span>Daily Rate:</span>
                  <span>₹{Math.ceil(formData.budget / formData.duration)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Duration:</span>
                  <span>{formData.duration} days</span>
                </div>
                <div className="border-t border-gray-700 pt-2 flex justify-between text-blue-400 font-bold">
                  <span>Total Cost:</span>
                  <span>₹{formData.budget.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Posting...' : '✅ Post Advertisement'}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
          <h3 className="text-white font-bold mb-3">📋 Ad Guidelines</h3>
          <ul className="text-gray-300 text-sm space-y-2">
            <li>✓ Use high-quality images for better engagement</li>
            <li>✓ Keep title and description clear and concise</li>
            <li>✓ Higher budget = Better visibility</li>
            <li>✓ Your ad will be displayed to users in selected location</li>
            <li>✓ Payment will be processed during checkout</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PostAd;
