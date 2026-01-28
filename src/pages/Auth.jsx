import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser, clearError, clearSuccess } from '../store/slices/authSlice';
import './Auth.css';

function Auth({ onNavigate }) {
  const dispatch = useDispatch();
  const { isLoading, error, user, isAuthenticated, successMessage } = useSelector(state => state.auth);
  
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'free',
  });

  // Redirect on successful authentication
  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect to home (map page) for authenticated users
      onNavigate('home');
    }
  }, [isAuthenticated, user, onNavigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) dispatch(clearError());
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      // Login validation
      if (!formData.email || !formData.password) {
        dispatch(clearError());
        return;
      }
      dispatch(loginUser({
        email: formData.email,
        password: formData.password,
      }));
    } else {
      // Register validation
      if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
        dispatch(clearError());
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        dispatch(clearError());
        return;
      }
      if (formData.password.length < 6) {
        dispatch(clearError());
        return;
      }
      dispatch(registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        userType: formData.userType,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-8 backdrop-blur-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold shine-text mb-2">DhvaniCast</h1>
            <p className="text-gray-400">{isLogin ? 'Welcome Back' : 'Join Us Today'}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
              <p className="text-green-300 text-sm">{successMessage}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username (Register only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose your username"
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Confirm Password (Register only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            )}

            {/* User Type Selection (Register only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Account Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'free', label: 'Free', emoji: '😊' },
                    { value: 'premium', label: 'Premium', emoji: '💎' },
                    { value: 'vip', label: 'VIP', emoji: '👑' },
                  ].map(type => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, userType: type.value }))}
                      className={`p-3 rounded-lg border-2 transition ${
                        formData.userType === type.value
                          ? 'border-blue-500 bg-blue-500/20'
                          : 'border-gray-700 bg-gray-800/30'
                      }`}
                    >
                      <div className="text-2xl mb-1">{type.emoji}</div>
                      <div className="text-xs font-bold text-white">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-lg transition disabled:opacity-50 mt-6"
            >
              {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center border-t border-gray-700 pt-6">
            <p className="text-gray-400 text-sm">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  dispatch(clearError());
                  dispatch(clearSuccess());
                  setFormData({
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    userType: 'free',
                  });
                }}
                className="text-blue-400 hover:text-blue-300 font-bold ml-2"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          {/* Demo Credentials */}
          {isLogin && (
            <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <p className="text-xs text-gray-400 mb-2">📝 Demo Account:</p>
              <p className="text-xs text-gray-300">Email: <span className="text-blue-300">demo@test.com</span></p>
              <p className="text-xs text-gray-300">Pass: <span className="text-blue-300">123456</span></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;
