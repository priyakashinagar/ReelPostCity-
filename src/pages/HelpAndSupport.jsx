import React from 'react';

function HelpAndSupport({ onNavigate }) {
  const handleBack = () => {
    onNavigate('profile');
  };

  const faqs = [
    {
      question: 'How do I edit my profile?',
      answer: 'Go to your Profile page and click the "Edit Profile" button. You can update your name, username, and bio.'
    },
    {
      question: 'How do I reset my password?',
      answer: 'Click on "Preferences" in your profile settings, then scroll down to find "Change Password" option.'
    },
    {
      question: 'How do I block a user?',
      answer: 'Visit "Privacy & Safety" settings and use the blocking options to block unwanted users.'
    },
    {
      question: 'How do I delete my account?',
      answer: 'Go to Preferences > Account, scroll to the bottom and click "Delete Account". This action is permanent.'
    },
    {
      question: 'Where is my data stored?',
      answer: 'Your data is securely stored on our servers with end-to-end encryption. We comply with GDPR and other privacy regulations.'
    },
    {
      question: 'How do I report a problem?',
      answer: 'Use the "Report Issue" button at the bottom of this page or email us at support@dhvanicast.com'
    },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-black/70 backdrop-blur-md border-b border-gray-800/50 px-4 py-3 flex items-center gap-3">
        <button
          onClick={handleBack}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-white hover:text-blue-400"
          title="Go back"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-white">Help & Support</h1>
      </div>

      <div className="w-full bg-gray-900 min-h-screen pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center gap-3 mb-8">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-white hover:text-blue-400"
              title="Go back"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-4xl font-bold text-white">❓ Help & Support</h1>
          </div>

          {/* FAQ Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-gradient-to-br from-gray-800 to-gray-750 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-100 mb-3">{faq.question}</h3>
                  <p className="text-gray-400">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl p-8 border border-blue-500/30 mb-8">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">📧 Contact Support</h2>
            
            <div className="space-y-6">
              <div>
                <p className="text-gray-400 text-sm mb-2">Email</p>
                <a href="mailto:support@dhvanicast.com" className="text-blue-400 hover:text-blue-300 font-semibold text-lg">
                  support@dhvanicast.com
                </a>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-2">Business Inquiries</p>
                <a href="mailto:business@dhvanicast.com" className="text-blue-400 hover:text-blue-300 font-semibold text-lg">
                  business@dhvanicast.com
                </a>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-2">Response Time</p>
                <p className="text-gray-300">We typically respond within 24-48 hours</p>
              </div>
            </div>
          </div>

          {/* Resources Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">📚 Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="#" className="bg-gradient-to-br from-gray-800 to-gray-750 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all group">
                <p className="text-gray-100 font-semibold mb-2 group-hover:text-blue-400">📖 User Guide</p>
                <p className="text-gray-400 text-sm">Learn how to use DhvaniCast features</p>
              </a>
              
              <a href="#" className="bg-gradient-to-br from-gray-800 to-gray-750 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all group">
                <p className="text-gray-100 font-semibold mb-2 group-hover:text-blue-400">🔒 Privacy Policy</p>
                <p className="text-gray-400 text-sm">Understand how we protect your data</p>
              </a>

              <a href="#" className="bg-gradient-to-br from-gray-800 to-gray-750 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all group">
                <p className="text-gray-100 font-semibold mb-2 group-hover:text-blue-400">⚖️ Terms & Conditions</p>
                <p className="text-gray-400 text-sm">Review our terms of service</p>
              </a>

              <a href="#" className="bg-gradient-to-br from-gray-800 to-gray-750 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all group">
                <p className="text-gray-100 font-semibold mb-2 group-hover:text-blue-400">🐞 Report a Bug</p>
                <p className="text-gray-400 text-sm">Help us improve by reporting issues</p>
              </a>
            </div>
          </div>

          {/* Community Section */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-750 rounded-2xl p-8 border border-gray-700 mb-8">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">👥 Community</h2>
            <p className="text-gray-400 mb-6">Join our community to connect with other users and get tips from experienced travelers.</p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold">
              Join Community
            </button>
          </div>

          {/* Back Button */}
          <button
            onClick={handleBack}
            className="px-6 py-3 border border-gray-700 text-gray-300 rounded-lg hover:border-gray-600 transition-all font-semibold"
          >
            Back to Profile
          </button>
        </div>
      </div>
    </>
  );
}

export default HelpAndSupport;
