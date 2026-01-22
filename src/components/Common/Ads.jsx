import React from 'react';

function Ads() {
  const ads = [
    {
      id: 1,
      title: 'Travel Insurance',
      description: 'Protect your adventures with comprehensive travel insurance',
      image: '🛡️'
    },
    {
      id: 2,
      title: 'Booking Hotels',
      description: 'Find the best deals on hotels worldwide',
      image: '🏨'
    },
    {
      id: 3,
      title: 'Flight Deals',
      description: 'Discover amazing flight offers for your next trip',
      image: '✈️'
    },
    {
      id: 4,
      title: 'Travel Packages',
      description: 'All-in-one travel packages tailored for you',
      image: '🎫'
    }
  ];

  const randomAd = ads[Math.floor(Math.random() * ads.length)];

  return (
    <div className="w-full bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 rounded-lg p-6 my-6 text-white shadow-lg border border-purple-700">
      <div className="flex items-center gap-4">
        <div className="text-5xl">{randomAd.image}</div>
        <div className="grow">
          <h3 className="text-xl font-bold mb-2">{randomAd.title}</h3>
          <p className="text-gray-200 mb-4">{randomAd.description}</p>
          <button className="bg-white text-purple-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors cursor-pointer">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}

export default Ads;
