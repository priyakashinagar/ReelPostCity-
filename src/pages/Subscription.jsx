import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './Subscription.css';

function Subscription({ onNavigate }) {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    fullName: '',
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '₹0',
      period: '/month',
      description: 'Perfect for getting started',
      features: [
        '✓ Post videos for 24 hours',
        '✓ Basic profile',
        '✓ View 50 posts/day',
        '✗ No ads removal',
        '✗ No premium badge',
      ],
      badge: '',
      color: 'from-gray-400 to-gray-600',
      buttonText: 'Current Plan',
      buttonClass: 'bg-gray-500 cursor-not-allowed',
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '₹99',
      period: '/month',
      description: 'Most popular choice',
      features: [
        '✓ Posts stay for 3-4 days',
        '✓ Premium badge on profile',
        '✓ View 500 posts/day',
        '✓ 50% fewer ads',
        '✓ Priority support',
        '✓ FREE for 2 months! 🎉',
      ],
      badge: 'FREE FOR 2 MONTHS',
      color: 'from-blue-400 to-blue-600',
      buttonText: 'Claim Free Trial',
      buttonClass: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '₹299',
      period: '/month',
      description: 'For serious creators',
      features: [
        '✓ Posts stay for 7 days',
        '✓ Pro badge on profile',
        '✓ Unlimited posts',
        '✓ No ads at all',
        '✓ VIP support 24/7',
        '✓ FREE for 2 months! 🎉',
      ],
      badge: 'FREE FOR 2 MONTHS',
      color: 'from-yellow-400 to-yellow-600',
      buttonText: 'Claim Free Trial',
      buttonClass: 'bg-yellow-500 hover:bg-yellow-600',
    },
  ];

  const handleUpgrade = (planId) => {
    if (planId !== 'free') {
      // Check if user is logged in
      if (!isAuthenticated || !user) {
        alert('Please login or register first to upgrade your plan');
        onNavigate('auth');
        return;
      }
      
      // For free trial plans
      if (planId === 'premium' || planId === 'pro') {
        const trialMessage = `🎉 Congratulations!\n\nYou've been activated for ${planId.toUpperCase()} plan for FREE for 2 months!\n\nAfter 2 months, you'll be charged:\n${planId === 'premium' ? '₹99/month' : '₹299/month'}\n\nYou'll receive a reminder before billing starts.`;
        alert(trialMessage);
        return;
      }
      
      setSelectedPlan(planId);
      setPaymentModalOpen(true);
    }
  };

  const handlePaymentSubmit = () => {
    if (!paymentForm.fullName || !paymentForm.email || !paymentForm.cardNumber || !paymentForm.expiryDate || !paymentForm.cvv) {
      alert('Please fill all payment details');
      return;
    }
    
    // Validate card number (simple check)
    if (paymentForm.cardNumber.replace(/\s/g, '').length !== 16) {
      alert('Please enter a valid 16-digit card number');
      return;
    }

    alert(`✅ Payment successful! You've subscribed to ${selectedPlan.toUpperCase()} plan.`);
    setPaymentModalOpen(false);
    setPaymentForm({ fullName: '', email: '', cardNumber: '', expiryDate: '', cvv: '' });
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-400">
            Unlock unlimited content and exclusive features
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-20 px-2 sm:px-0">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-gradient-to-br ${plan.color} p-0.5 rounded-2xl transition-transform hover:scale-105 ${
                selectedPlan === plan.id ? 'ring-4 ring-yellow-400' : ''
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                  {plan.badge}
                </div>
              )}

              {/* Card Content */}
              <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 h-full flex flex-col">
                {/* Title */}
                <h2 className="text-3xl font-bold text-white mb-2">
                  {plan.name}
                </h2>
                <p className="text-gray-400 mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-8">
                  <span className="text-5xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>

                {/* Features */}
                <div className="mb-8 grow">
                  {plan.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="text-gray-300 mb-3 flex items-center"
                    >
                      <span className="mr-3">
                        {feature.includes('✓') ? (
                          <span className="text-green-400 font-bold">✓</span>
                        ) : (
                          <span className="text-red-400 font-bold">✗</span>
                        )}
                      </span>
                      {feature.replace(/^[✓✗]\s/, '')}
                    </div>
                  ))}
                </div>

                {/* Button */}
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={plan.id === 'free'}
                  className={`w-full py-3 rounded-lg font-bold text-white transition-all ${plan.buttonClass}`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Features Comparison Table */}
        <div className="bg-gray-800/50 rounded-2xl p-8 mb-16 border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-8">Feature Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-white pb-4">Feature</th>
                  <th className="text-center pb-4 text-gray-300">Free</th>
                  <th className="text-center pb-4 text-blue-400">Premium</th>
                  <th className="text-center pb-4 text-yellow-400">Pro</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700">
                  <td className="py-4 text-gray-300">Post Duration</td>
                  <td className="text-center text-gray-400">24 hours</td>
                  <td className="text-center text-blue-400">3-4 days</td>
                  <td className="text-center text-yellow-400">7 days</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4 text-gray-300">Daily Posts</td>
                  <td className="text-center text-gray-400">10</td>
                  <td className="text-center text-blue-400">Unlimited</td>
                  <td className="text-center text-yellow-400">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4 text-gray-300">Ads</td>
                  <td className="text-center text-gray-400">Full</td>
                  <td className="text-center text-blue-400">50% Less</td>
                  <td className="text-center text-yellow-400">None</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-4 text-gray-300">Profile Badge</td>
                  <td className="text-center text-gray-400">❌</td>
                  <td className="text-center text-blue-400">💎 Premium</td>
                  <td className="text-center text-yellow-400">👑 Pro</td>
                </tr>
                <tr>
                  <td className="py-4 text-gray-300">Support</td>
                  <td className="text-center text-gray-400">Email</td>
                  <td className="text-center text-blue-400">Priority</td>
                  <td className="text-center text-yellow-400">24/7 VIP</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl p-8 border border-blue-500/20">
          <h3 className="text-2xl font-bold text-white mb-6">FAQ</h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-white font-bold mb-2">Can I change my plan anytime?</h4>
              <p className="text-gray-400">Yes! You can upgrade or downgrade your plan anytime. Changes take effect immediately.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-2">Is there a free trial?</h4>
              <p className="text-gray-400">Premium and Pro plans come with 7 days free trial. No credit card required!</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-2">What happens when I cancel?</h4>
              <p className="text-gray-400">Your account reverts to Free plan. Your posts will be visible for 24 hours.</p>
            </div>
          </div>
        </div>
      </div>

      {/* PAYMENT MODAL */}
      {paymentModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 px-4 sm:px-0">
          <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 w-full max-w-md border border-blue-500/30 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">Complete Payment</h2>
            
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg p-4 mb-6 text-white">
              <p className="text-sm text-blue-100">Selected Plan</p>
              <p className="text-2xl font-bold capitalize">{selectedPlan} Plan</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-semibold text-gray-300 block mb-2">Full Name</label>
                <input
                  type="text"
                  value={paymentForm.fullName}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-300 block mb-2">Email</label>
                <input
                  type="email"
                  value={paymentForm.email}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-300 block mb-2">Card Number</label>
                <input
                  type="text"
                  value={paymentForm.cardNumber}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
                  maxLength="19"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500 font-mono"
                  placeholder="1234 5678 9012 3456"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-gray-300 block mb-2">Expiry Date</label>
                  <input
                    type="text"
                    value={paymentForm.expiryDate}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                    maxLength="5"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-300 block mb-2">CVV</label>
                  <input
                    type="text"
                    value={paymentForm.cvv}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) }))}
                    maxLength="3"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-blue-500"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:border-gray-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handlePaymentSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold"
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Subscription;
