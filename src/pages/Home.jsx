import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import MapComponent from '../components/MapComponent.jsx';
import Footer from '../components/Common/Footer.jsx';
import { getUserLocation } from '../services/locationService.js';

function Home({ onNavigate }) {
  const dispatch = useDispatch();
  const [zoom, setZoom] = useState(3);
  const [showMap, setShowMap] = useState(true);
  const [locationStatus, setLocationStatus] = useState('loading'); // 'loading', 'success', 'denied'
  const [locationDenied, setLocationDenied] = useState(false);

  // Request location access on component mount - MANDATORY
  useEffect(() => {
    const requestLocationMandatory = async () => {
      setLocationStatus('loading');
      try {
        const location = await getUserLocation();
        if (location) {
          // Store user's location in localStorage
          localStorage.setItem('userCurrentLocation', JSON.stringify(location));
          setLocationStatus('success');
          setLocationDenied(false);
          console.log('✅ User location allowed:', location.city);
        }
      } catch (error) {
        console.warn('❌ Location denied:', error.message);
        setLocationStatus('denied');
        setLocationDenied(true);
      }
    };

    requestLocationMandatory();
  }, []);

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
    <div className="w-full bg-white">
      {/* Map Section - Full viewport height */}
      {showMap && (
        <div className="w-full h-screen relative overflow-hidden">
          <MapComponent zoom={zoom} onNavigate={onNavigate} />
          
          {/* Zoom Controls - Right Bottom */}
          <div className="absolute right-4 bottom-4 sm:right-6 sm:bottom-6 flex flex-col gap-3 z-30">
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
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;
