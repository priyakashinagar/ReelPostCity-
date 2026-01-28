/**
 * Location Service
 * Handles geolocation detection and reverse geocoding to get city/locality names
 */

// Free reverse geocoding service using OpenStreetMap Nominatim
const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    if (!response.ok) throw new Error('Geocoding failed');
    
    const data = await response.json();
    const address = data.address || {};
    
    // Try to get city, then town, then village, then county
    const city = address.city || address.town || address.village || address.county || 'Unknown Location';
    const country = address.country || 'Unknown';
    
    return {
      city,
      country,
      locality: address.village || address.suburb || city,
      latitude,
      longitude,
      fullAddress: data.display_name || `${latitude}, ${longitude}`
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
};

// Get user's current location using browser Geolocation API
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const locationData = await reverseGeocode(latitude, longitude);
          
          if (locationData) {
            resolve(locationData);
          } else {
            reject(new Error('Could not determine location'));
          }
        } catch (error) {
          reject(error);
        }
      },
      (error) => {
        // Handle different geolocation errors
        let errorMessage = 'Location access denied';
        
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = 'Location permission denied. Please enable location access in browser settings.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = 'Location information unavailable';
        } else if (error.code === error.TIMEOUT) {
          errorMessage = 'Location request timeout';
        }
        
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // Cache location for 5 minutes
      }
    );
  });
};

// Get cached location from localStorage
export const getCachedLocation = () => {
  try {
    const cached = localStorage.getItem('userLocation');
    if (cached) {
      const locationData = JSON.parse(cached);
      // Check if cache is still valid (within 5 minutes)
      const cacheAge = Date.now() - locationData.timestamp;
      if (cacheAge < 300000) {
        return locationData;
      }
    }
  } catch (error) {
    console.error('Error reading cached location:', error);
  }
  return null;
};

// Cache location in localStorage
export const cacheLocation = (locationData) => {
  try {
    const dataToCache = {
      ...locationData,
      timestamp: Date.now()
    };
    localStorage.setItem('userLocation', JSON.stringify(dataToCache));
  } catch (error) {
    console.error('Error caching location:', error);
  }
};

// Get location with caching - tries cache first, then fetches new
export const getLocationWithCache = async () => {
  // Try cached location first
  const cached = getCachedLocation();
  if (cached) {
    return cached;
  }
  
  // If no cache or expired, get new location
  try {
    const locationData = await getUserLocation();
    cacheLocation(locationData);
    return locationData;
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
};

// Get default location (for users who deny location access)
export const getDefaultLocation = () => {
  return {
    city: 'World',
    country: 'Global',
    locality: 'World',
    latitude: null,
    longitude: null,
    fullAddress: 'Location not available'
  };
};

export default {
  getUserLocation,
  getCachedLocation,
  cacheLocation,
  getLocationWithCache,
  getDefaultLocation,
  reverseGeocode
};
