import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

// Load Leaflet CSS from CDN - Only once
if (!document.querySelector('link[href*="leaflet.min.css"]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
  document.head.appendChild(link);
}

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const CITIES = [
  {
    name: 'Delhi',
    lat: 28.6139,
    lng: 77.209,
    number: 13,
    image: 'https://picsum.photos/200/200?random=101',
  },
  {
    name: 'Mumbai',
    lat: 19.0760,
    lng: 72.8777,
    number: 2,
    image: 'https://picsum.photos/200/200?random=102',
  },
  {
    name: 'Bangalore',
    lat: 12.9716,
    lng: 77.5946,
    number: 19,
    image: 'https://picsum.photos/200/200?random=103',
  },
  {
    name: 'Kolkata',
    lat: 22.5726,
    lng: 88.3639,
    number: 9,
    image: 'https://picsum.photos/200/200?random=104',
  },
  {
    name: 'Jaipur',
    lat: 26.9124,
    lng: 75.7873,
    number: 45,
    image: 'https://picsum.photos/200/200?random=105',
  },
  {
    name: 'Chennai',
    lat: 13.0827,
    lng: 80.2707,
    number: 66,
    image: 'https://picsum.photos/200/200?random=106',
  },
  {
    name: 'Pune',
    lat: 18.5204,
    lng: 73.8567,
    number: 40,
    image: 'https://picsum.photos/200/200?random=107',
  },
  {
    name: 'Ahmedabad',
    lat: 23.0225,
    lng: 72.5714,
    number: 22,
    image: 'https://picsum.photos/200/200?random=108',
  },
];
function MapComponent({ zoom = 3, onNavigate }) {
  const containerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerLayerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapInstanceRef.current) return;

    try {
      // Initialize map - IMPORTANT: worldCopyJump enables continuous map wrapping
      const map = L.map(containerRef.current, {
        worldCopyJump: true, // Enable wrapping like earth - continuous left/right scrolling
        zoomAnimation: false,
        dragging: true, // Enable panning/scrolling
        touchZoom: true,
        scrollWheelZoom: true,
        minZoom: 3, // Prevent zooming out more than this
        maxZoom: 18, // Maximum zoom level
      }).setView([20, 78], zoom);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        noWrap: false, // Allow tiles to wrap around earth
      }).addTo(map);

      // Configure map interactions
      map.dragging.enable();
      map.touchZoom.enable();
      map.scrollWheelZoom.enable();

      mapInstanceRef.current = map;
      markerLayerRef.current = L.featureGroup().addTo(map);

      // Add city markers
      const cityMarkers = [];
      CITIES.forEach((city) => {
        const html = `
          <div style="position: relative; cursor: pointer;">
            <div style="width: 64px; height: 64px; border-radius: 8px; overflow: hidden; border: 4px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
              <img src="${city.image}" alt="${city.name}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div style="position: absolute; top: -8px; right: -8px; width: 32px; height: 32px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; box-shadow: 0 2px 8px rgba(37,99,235,0.4); border: 2px solid white;">
              ${city.number}
            </div>
          </div>
        `;

        const marker = L.marker([city.lat, city.lng], {
          icon: L.divIcon({
            html: html,
            className: 'custom-marker',
            iconSize: [64, 64],
            iconAnchor: [32, 64],
            popupAnchor: [0, -64],
          }),
        })
          .addTo(map)
          .on('click', () => {
            // Directly navigate to posts page for this city
            handleNavigateToPost(city);
          });

        cityMarkers.push(marker);
      });

      // Fit all markers on the map with padding - using requestAnimationFrame for proper timing
      if (cityMarkers.length > 0) {
        requestAnimationFrame(() => {
          try {
            const group = new L.featureGroup(cityMarkers);
            const bounds = group.getBounds();
            if (bounds.isValid && bounds.isValid()) {
              map.fitBounds(bounds, { padding: [100, 30, 50, 50], animate: false, maxZoom: 4 });
            }
          } catch (error) {
            console.warn('Could not fit bounds:', error);
          }
        });
      }
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [zoom]);

  const handleNavigateToPost = (city) => {
    if (onNavigate) {
      onNavigate('posts', { city: city.name });
    }
  };

  return (
    <div className="relative w-full h-full">
      <div 
        ref={containerRef} 
        className="w-full h-full bg-blue-100" 
        style={{ filter: 'drop-shadow(0 4px 20px rgba(0, 0, 0, 0.15))' }} 
      />
    </div>
  );
}

export default MapComponent;
