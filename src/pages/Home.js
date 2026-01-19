import React, { useState } from 'react';
import MapComponent from '../components/MapComponent';

function Home({ onNavigate }) {
  const [zoom, setZoom] = useState(5);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 18));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 1));
  };

  const handleReset = () => {
    setZoom(5);
  };

  return (
    <div className="w-full h-screen flex flex-col relative">
      {/* Map Section */}
      <section className="w-full h-full bg-blue-100 p-4 sm:p-6 lg:p-8 z-0">
        <div className="w-full h-full">
          <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl">
            <MapComponent zoom={zoom} />

            {/* Zoom Controls */}
            <div className="absolute right-4 bottom-4 sm:right-6 sm:bottom-6 flex flex-col gap-3 z-40">
              {/* Zoom In */}
              <button
                onClick={handleZoomIn}
                className="w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200 font-bold text-lg text-gray-700"
                aria-label="Zoom in"
                title="Zoom in"
              >
                +
              </button>

              {/* Zoom Out */}
              <button
                onClick={handleZoomOut}
                className="w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200 font-bold text-lg text-gray-700"
                aria-label="Zoom out"
                title="Zoom out"
              >
                −
              </button>

              {/* Reset */}
              <button
                onClick={handleReset}
                className="w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200 text-gray-700"
                aria-label="Reset view"
                title="Reset view"
              >
                🧭
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section - Transparent Overlay */}
      <section className="absolute top-0 left-0 right-0 z-20 py-2 px-4 sm:px-6 lg:px-8 bg-blue-400/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 gap-2 items-center">
            {/* Left Content */}
            <div className="text-black">
              <h1 className="text-2xl md:text-3xl font-bold mb-0 text-gray-900 leading-tight">
                City posts
              </h1>
              <p className="text-xs md:text-sm leading-tight text-gray-800">
                Explore stunning cities around the world and discover beautiful destinations through our interactive map. View amazing photos, find unique attractions, and plan your next adventure with us.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
