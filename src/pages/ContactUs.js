import React, { useState } from 'react';
import MapComponent from '../components/MapComponent';

function ContactUs() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent successfully! We will get back to you soon.');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="w-full min-h-screen bg-gray-900">
      {/* Header */}
      <section className="relative bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8" style={{backgroundImage: 'url(https://picsum.photos/1200/400?random=103)'}}>
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">Contact Us</h1>
          <p className="text-lg text-gray-200">Do you have any questions, suggestions, or feedback? Contact us, we would love to hear from you.</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-gray-800 rounded-lg p-8 border border-blue-500 shadow-lg shadow-blue-500/50">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">Send Your Inquiry</h2>
              <p className="text-gray-400 mb-8">Please fill out the form below to send your inquiry.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      className="w-full bg-gray-700 border border-blue-500 text-white rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md shadow-blue-500/30"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      className="w-full bg-gray-700 border border-blue-500 text-white rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md shadow-blue-500/30"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="w-full bg-gray-700 border border-blue-500 text-white rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md shadow-blue-500/30"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    className="w-full bg-gray-700 border border-blue-500 text-white rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md shadow-blue-500/30"
                    placeholder="Support Topic"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Your Message</label>
                  <textarea
                    name="message"
                    className="w-full bg-gray-700 border border-blue-500 text-white rounded-lg px-4 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none shadow-md shadow-blue-500/30"
                    rows="6"
                    placeholder="Write your inquiry here..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all border border-blue-500 shadow-lg shadow-blue-500/50 hover:shadow-blue-400/70"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              {/* Support Details */}
              <div className="bg-gray-800 rounded-lg p-8 border border-blue-500 shadow-lg shadow-blue-500/50">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6">Support Details</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">📍 Address</h3>
                    <p className="text-gray-400">
                      123 Main Street,<br />
                      City Town, State,<br />
                      12345, Country
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">📞 Phone</h3>
                    <a href="tel:+1-555-123-4567" className="text-blue-400 hover:text-blue-300">
                      +1 (555) 123-4567
                    </a>
                  </div>

                  <div>
                    <h3 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">📧 Email</h3>
                    <a href="mailto:support@cityexplorer.com" className="text-blue-400 hover:text-blue-300">
                      support@cityexplorer.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Location Map */}
              <div className="bg-gray-800 rounded-lg p-8 border border-blue-500 shadow-lg shadow-blue-500/50">
                <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">📌 Our Location</h3>
                <div className="rounded-lg overflow-hidden" style={{height: '300px'}}>
                  <MapComponent />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactUs;
