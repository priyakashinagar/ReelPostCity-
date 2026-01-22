
import React, { useState } from 'react';
import MapComponent from '../components/MapComponent.jsx';
import Footer from '../components/Common/Footer.jsx';

function Home({ onNavigate }) {
  const [zoom, setZoom] = useState(3);
  const [showMap, setShowMap] = useState(true);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 18));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 1));
  };

  const handleReset = () => {
    setZoom(3);
  };



  return (
    <>
      {/* Map Section - Full Width */}
      {showMap && (
        
          <div className="relative w-full h-screen blue-shine-border rounded-2xl">
            <MapComponent zoom={zoom} onNavigate={onNavigate} />
            {/* Zoom Controls */}
            <div className="absolute right-4 bottom-4 sm:right-6 sm:bottom-6 flex flex-col gap-3 z-40">
              <button
                onClick={handleZoomIn}
                className="w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200 font-bold text-lg text-gray-700"
                aria-label="Zoom in"
                title="Zoom in"
              >
                +
              </button>
              <button
                onClick={handleZoomOut}
                className="w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200 font-bold text-lg text-gray-700"
                aria-label="Zoom out"
                title="Zoom out"
              >
                −
              </button>
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
        
      )}
      <Footer />
    </>
  );
}

export default Home;
