import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Async thunks
export const fetchFeaturedCities = createAsyncThunk(
  'city/fetchFeaturedCities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/cities/map/featured`);
      
      console.log('API Response:', response.data);
      
      let cities = [];
      
      // Handle GeoJSON FeatureCollection format
      if (response.data?.features && Array.isArray(response.data.features)) {
        cities = response.data.features.map(feature => ({
          id: feature.properties.id || feature.properties._id,
          name: feature.properties.displayName || feature.properties.name || 'Unknown City',
          lat: feature.geometry.coordinates[1],
          lng: feature.geometry.coordinates[0],
          posts: feature.properties.totalPosts || feature.properties.statistics?.totalPosts || 0,
          state: feature.properties.state || 'India',
          image: `https://picsum.photos/200/200?random=${Math.random() * 1000}`,
        }));
      } 
      // Handle direct array format
      else if (Array.isArray(response.data)) {
        cities = response.data.map(city => ({
          id: city._id,
          name: city.displayName || city.name,
          lat: city.coordinates?.latitude || city.coordinates?.lat || 20 + Math.random() * 30,
          lng: city.coordinates?.longitude || city.coordinates?.lng || 70 + Math.random() * 35,
          posts: city.statistics?.totalPosts || city.totalPosts || 0,
          state: city.state || 'India',
          image: `https://picsum.photos/200/200?random=${Math.random() * 1000}`,
        }));
      }
      // Handle wrapped format
      else if (response.data?.data?.features) {
        cities = response.data.data.features.map(feature => ({
          id: feature.properties.id || feature.properties._id,
          name: feature.properties.displayName || feature.properties.name || 'Unknown City',
          lat: feature.geometry.coordinates[1],
          lng: feature.geometry.coordinates[0],
          posts: feature.properties.totalPosts || 0,
          state: feature.properties.state || 'India',
          image: `https://picsum.photos/200/200?random=${Math.random() * 1000}`,
        }));
      }
      
      console.log('Transformed cities:', cities);
      
      if (cities.length === 0) {
        throw new Error('No cities data received from API');
      }
      
      return cities;
    } catch (error) {
      console.error('Error fetching cities:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchCityStats = createAsyncThunk(
  'city/fetchCityStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/cities/stats/all`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const citySlice = createSlice({
  name: 'city',
  initialState: {
    cities: [],
    selectedCity: null,
    stats: [],
    loading: false,
    error: null,
  },
  reducers: {
    selectCity: (state, action) => {
      state.selectedCity = action.payload;
    },
    clearSelectedCity: (state) => {
      state.selectedCity = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch featured cities
      .addCase(fetchFeaturedCities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedCities.fulfilled, (state, action) => {
        state.cities = action.payload;
        state.loading = false;
      })
      .addCase(fetchFeaturedCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch city stats
      .addCase(fetchCityStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCityStats.fulfilled, (state, action) => {
        state.stats = action.payload;
        state.loading = false;
      })
      .addCase(fetchCityStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { selectCity, clearSelectedCity } = citySlice.actions;
export default citySlice.reducer;
