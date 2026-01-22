import React from 'react';

function Ads({ userType }) {
  // Don't show ads for Pro users
  if (userType === 'pro') {
    return null;
  }

  const adVariants = [
    {
      title: 'Learn Web Development',
      description: 'Master React, Node.js, and more',
      image: '📚',
      link: '#',
    },
    {
      title: 'Best Travel Deals',
      description: 'Save 50% on your next trip',
      image: '✈️',
      link: '#',
    },
    {
      title: 'Premium Gaming',
      description: 'Play unlimited games today',
      image: '🎮',
      link: '#',
    },
    {
      title: 'Fitness Course',
      description: 'Transform your body in 30 days',
      image: '💪',
      link: '#',
    },
  ];

  const randomAd = adVariants[Math.floor(Math.random() * adVariants.length)];

  return (
    <div className="bg-linear-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg p-4 my-6 hover:border-purple-500/60 transition-all cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="text-4xl">{randomAd.image}</div>
        <div className="grow">
          <h3 className="text-white font-bold text-lg">{randomAd.title}</h3>
          <p className="text-gray-300 text-sm">{randomAd.description}</p>
        </div>
        <button
          onClick={() => window.open(randomAd.link, '_blank')}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-bold transition-colors whitespace-nowrap"
        >
          Learn More
        </button>
      </div>
      {/* Sponsored tag */}
      <div className="text-xs text-gray-400 mt-2">Sponsored</div>
    </div>
  );
}

export default Ads;
