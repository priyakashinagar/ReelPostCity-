import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Async thunks
export const fetchPostsByCity = createAsyncThunk(
  'posts/fetchPostsByCity',
  async ({ cityId, page = 1, limit = 10, sortBy = 'trending' }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/posts/by-city/${cityId}`, {
        params: { page, limit, sortBy },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchNearbyPosts = createAsyncThunk(
  'posts/fetchNearbyPosts',
  async ({ cityId, radius = 50, page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/posts/nearby/${cityId}`, {
        params: { radius, page, limit },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const likePost = createAsyncThunk(
  'posts/likePost',
  async ({ postId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { postId, likes: response.data.data.likes };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async ({ caption, cityId, tags, image, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/posts`,
        {
          caption,
          cityId,
          tags,
          image,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    cityPosts: [],
    nearbyPosts: [],
    selectedPost: null,
    likes: {}, // { postId: likeCount }
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
    sortBy: 'trending',
  },
  reducers: {
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    selectPost: (state, action) => {
      state.selectedPost = action.payload;
    },
    clearPosts: (state) => {
      state.cityPosts = [];
      state.nearbyPosts = [];
      state.selectedPost = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts by city
      .addCase(fetchPostsByCity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostsByCity.fulfilled, (state, action) => {
        state.cityPosts = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
        state.sortBy = action.payload.sortBy;
        state.loading = false;
      })
      .addCase(fetchPostsByCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch nearby posts
      .addCase(fetchNearbyPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNearbyPosts.fulfilled, (state, action) => {
        state.nearbyPosts = action.payload.data;
        state.loading = false;
      })
      .addCase(fetchNearbyPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Like post
      .addCase(likePost.fulfilled, (state, action) => {
        state.likes[action.payload.postId] = action.payload.likes;
      })
      // Create post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.cityPosts.unshift(action.payload);
        state.loading = false;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSortBy, selectPost, clearPosts } = postsSlice.actions;
export default postsSlice.reducer;
