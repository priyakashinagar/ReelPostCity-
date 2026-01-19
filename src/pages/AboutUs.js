import React from 'react';

function AboutUs() {
  const team = [
    {
      id: 1,
      name: 'Jane Doe',
      role: 'Founder & CEO',
      image: 'https://picsum.photos/200/200?random=101'
    },
    {
      id: 2,
      name: 'Alex Smith',
      role: 'Head of Product',
      image: 'https://picsum.photos/200/200?random=102'
    },
    {
      id: 3,
      name: 'Maria Rodriguez',
      role: 'Lead Photographer',
      image: 'https://picsum.photos/200/200?random=103'
    },
    {
      id: 4,
      name: 'Chris White',
      role: 'Community Manager',
      image: 'https://picsum.photos/200/200?random=104'
    }
  ];

  const values = [
    {
      icon: '🎯',
      title: 'Authenticity',
      description: 'We celebrate genuine stories and real experiences from cities around the world.'
    },
    {
      icon: '🌍',
      title: 'Global Connection',
      description: 'Our platform connects explorers from diverse backgrounds to share and celebrate culture.'
    },
    {
      icon: '📸',
      title: 'Quality Content',
      description: 'We prioritize beautiful photography and compelling storytelling in every post.'
    },
    {
      icon: '🤝',
      title: 'Community',
      description: 'We foster an inclusive community where everyone\'s perspective is valued and celebrated.'
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gray-900">
      {/* Header */}
      <section className="relative bg-cover bg-center py-16 px-4 sm:px-6 lg:px-8" style={{backgroundImage: 'url(https://picsum.photos/1200/400?random=104)'}}>
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">About Us</h1>
          <p className="text-lg text-gray-200">Discover our story and what drives us</p>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">Our Vision</h2>
          <p className="text-lg text-gray-300 mb-6 leading-relaxed">
            At City Explorer, we believe every city has a unique story waiting to be discovered. Our platform is dedicated to connecting explorers and photographers to document and share these unique urban experiences through the lens of photography.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed">
            We empower a community of explorers and photographers to document and share the vibrant tapestry of urban life, celebrating the diverse neighborhoods, hidden pathways, and soul-stirring moments that make each city extraordinary.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent text-center mb-14">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map(member => (
              <div key={member.id} className="bg-gray-800 rounded-lg p-6 border border-blue-500 shadow-lg shadow-blue-500/50 hover:shadow-blue-400/70 transition-all duration-300 hover:scale-105 text-center">
                <div className="mb-6 flex justify-center">
                  <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg shadow-blue-500/50 hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{member.name}</h3>
                <p className="text-blue-400 font-semibold text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">Explore Our World</h2>
          <p className="text-lg text-gray-300 mb-10">
            Our interactive map brings you closer to the heart of every city. Discover hidden pathways, vibrant neighborhoods, beautiful landmarks, and soul-stirring moments, all contributed by our passionate community.
          </p>
          <img 
            src="https://picsum.photos/800/300?random=200" 
            alt="World Map" 
            className="w-full rounded-lg shadow-lg shadow-blue-500/30 border border-blue-500 hover:shadow-blue-400/50 transition-all duration-300"
          />
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent text-center mb-14">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <div key={idx} className="bg-gray-900 rounded-lg p-8 text-center border border-blue-500 shadow-lg shadow-blue-500/50 hover:shadow-blue-400/70 transition-all duration-300 hover:scale-105 hover:bg-gray-800">
                <div className="text-6xl mb-6 transform hover:scale-110 transition-transform duration-300">{value.icon}</div>
                <h3 className="text-lg font-bold text-blue-400 mb-3">{value.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
