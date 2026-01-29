import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedCities, selectCity } from '../store/slices/citySlice';
import axios from 'axios';
import postService from '../services/postService.js';

// Get API URL from environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Load Leaflet CSS from CDN - Only for once
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

function MapComponent({ zoom = 3, onNavigate }) {
  const dispatch = useDispatch();
  const { cities, loading, error } = useSelector(state => state.city);
  const containerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerLayerRef = useRef(null);
  const subCitiesLayerRef = useRef(null);
  const [subCitiesData, setSubCitiesData] = useState({});
  const [postCountsByCity, setPostCountsByCity] = useState({});

  // Fetch featured cities on component mount
  useEffect(() => {
    console.log('MapComponent mounted, fetching cities...');
    dispatch(fetchFeaturedCities());
  }, [dispatch]);

  // Fetch post counts for all cities
  const fetchPostCounts = async (citiesData) => {
    try {
      const allPosts = await postService.getAllPosts();
      const posts = allPosts.data || allPosts;
      
      console.log('Fetched posts:', posts.length, 'posts total');
      
      const counts = {};
      citiesData.forEach(city => {
        // Count posts for this city by cityId
        const cityPostCount = posts.filter(post => {
          // Match by cityId (most reliable)
          if (post.cityId && city.id && post.cityId === city.id) {
            return true;
          }
          // Fallback: match by city name
          const postCityName = post.city || post.cityName || '';
          const cityName = city.displayName || city.name || '';
          return postCityName.toLowerCase().trim() === cityName.toLowerCase().trim();
        }).length;
        
        const displayName = city.displayName || city.name;
        counts[displayName] = cityPostCount;
        console.log(`City: ${displayName} (ID: ${city.id}) → ${cityPostCount} posts`);
      });
      
      console.log('Final post counts by city:', counts);
      setPostCountsByCity(counts);
    } catch (error) {
      console.error('Error fetching post counts:', error);
      // Set default counts to 0
      const counts = {};
      citiesData.forEach(city => {
        const cityName = city.displayName || city.name;
        counts[cityName] = 0;
      });
      setPostCountsByCity(counts);
    }
  };

  // Load post counts when cities change
  useEffect(() => {
    if (cities && cities.length > 0) {
      fetchPostCounts(cities);
      
      // Refresh post counts every 3 seconds to keep map dynamic
      const interval = setInterval(() => {
        fetchPostCounts(cities);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [cities]);

  // Load sub-cities for a city
  const loadSubCities = async (cityId) => {
    if (subCitiesData[cityId]) {
      return subCitiesData[cityId]; // Return cached data
    }
    
    try {
      const response = await axios.get(`${API_BASE_URL}/cities/${cityId}/sub-cities`);
      const subCities = response.data.data || [];
      setSubCitiesData(prev => ({
        ...prev,
        [cityId]: subCities
      }));
      return subCities;
    } catch (error) {
      console.error('Error loading sub-cities:', error);
      return [];
    }
  };

  // Update sub-cities markers based on zoom level
  const updateSubCitiesVisibility = async (map, cities) => {
    const currentZoom = map.getZoom();
    
    // Remove existing sub-cities layer
    if (subCitiesLayerRef.current) {
      subCitiesLayerRef.current.clearLayers();
    } else {
      subCitiesLayerRef.current = L.featureGroup().addTo(map);
    }

    // Show sub-cities only when zoomed in enough (level 7+)
    if (currentZoom >= 7) {
      for (const city of cities) {
        const subCities = await loadSubCities(city.id);
        
        subCities.forEach((subCity) => {
          const html = `
            <div style="cursor: pointer; font-size: 12px; padding: 4px 8px; background: rgba(59,130,246,0.9); color: white; border-radius: 6px; border: 2px solid white; font-weight: bold; white-space: nowrap; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
              ${subCity.displayName || subCity.name}
            </div>
          `;

          const lat = subCity.location?.coordinates?.[1] || subCity.coordinates?.lat || (city.lat + (Math.random() - 0.5) * 2);
          const lng = subCity.location?.coordinates?.[0] || subCity.coordinates?.lng || (city.lng + (Math.random() - 0.5) * 2);

          const marker = L.marker([lat, lng], {
            icon: L.divIcon({
              html: html,
              className: 'sub-city-marker',
              iconSize: [120, 32],
              iconAnchor: [60, 16],
              popupAnchor: [0, -16],
            }),
          })
            .addTo(subCitiesLayerRef.current)
            .on('click', () => {
              // Select sub-city and navigate to posts
              dispatch(selectCity({
                id: subCity._id,
                name: subCity.displayName || subCity.name,
                state: subCity.state || 'India',
                lat: lat,
                lng: lng,
              }));
              if (onNavigate) {
                onNavigate('posts', null, true);
              }
            });
        });
      }
    }
  };

  // Fetch featured cities on component mount
  useEffect(() => {
    console.log('MapComponent mounted, fetching cities...');
    dispatch(fetchFeaturedCities());
  }, [dispatch]);

  // Log cities when they change
  useEffect(() => {
    console.log('Cities updated:', cities);
    console.log('Loading:', loading);
    console.log('Error:', error);
  }, [cities, loading, error]);

  // Update markers when post counts change
  useEffect(() => {
    if (mapInstanceRef.current && markerLayerRef.current && cities.length > 0 && Object.keys(postCountsByCity).length > 0) {
      console.log('Updating markers with new post counts:', postCountsByCity);
      
      // Clear existing markers
      markerLayerRef.current.clearLayers();
      
      // Add updated markers with new counts
      const cityMarkers = [];
      cities.forEach((city) => {
        const cityNameToMatch = city.displayName || city.name;
        const postCount = postCountsByCity[cityNameToMatch] || 0;
        const html = `
          <div style="position: relative; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
            <div style="width: 60px; height: 60px; border-radius: 10px; overflow: hidden; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.25); background-image: url('${city.image || 'https://picsum.photos/60/60?random=' + Math.random()}'); background-size: cover; background-position: center; display: flex; align-items: flex-end; justify-content: center; color: white; font-weight: bold; text-align: center; padding: 3px; opacity: 0.85; filter: brightness(0.9);">
              <div style="background: rgba(0,0,0,0.5); width: 100%; padding: 2px 1px; border-radius: 0 0 8px 8px; font-size: 10px; backdrop-filter: blur(4px);">${city.name}</div>
            </div>
            <div style="position: absolute; top: -8px; right: -8px; width: 36px; height: 36px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; box-shadow: 0 2px 8px rgba(59,130,246,0.4);">
              ${postCount}
            </div>
          </div>
        `;

        const marker = L.marker([city.lat, city.lng], {
          icon: L.divIcon({
            html: html,
            className: 'custom-marker',
            iconSize: [60, 60],
            iconAnchor: [30, 60],
            popupAnchor: [0, -60],
          }),
        })
          .addTo(markerLayerRef.current)
          .on('click', () => {
            dispatch(selectCity({
              id: city.id,
              name: city.name,
              state: city.state,
              lat: city.lat,
              lng: city.lng,
            }));
            if (onNavigate) {
              onNavigate('posts', null, true);
            }
          });

        cityMarkers.push(marker);
      });
    }
  }, [postCountsByCity, cities, dispatch, onNavigate]);

  useEffect(() => {
    if (!containerRef.current || mapInstanceRef.current || cities.length === 0) return;

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

      // Fit initial view with all cities
      const cityMarkers = cities.map(city => L.latLng(city.lat, city.lng));

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

      // Handle zoom changes to show/hide sub-cities
      map.on('zoom', () => {
        updateSubCitiesVisibility(map, cities);
      });

      // Initial sub-cities load
      updateSubCitiesVisibility(map, cities);
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
  }, [cities, zoom, dispatch, onNavigate]);

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-50 bg-opacity-80 z-10">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600 font-medium">Loading cities...</p>
          </div>
        </div>
      )}
      <div 
        ref={containerRef} 
        className="w-full h-full bg-blue-100" 
        style={{ filter: 'drop-shadow(0 4px 20px rgba(0, 0, 0, 0.15))' }} 
      />
    </div>
  );
}

export default MapComponent;
