import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Use environment variable for API URL
const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/users`
  : 'http://localhost:5000/api/users';

// Normalize user object from backend format to frontend format
const normalizeUser = (user) => ({
  ...user,
  username: user.name || user.username,
  userType: user.role || user.userType,
  profileImg: user.profilePicture || user.profileImg || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (user.name || user.username),
});

// Register user thunk
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, {
        name: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.userType || 'user',
      }, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.data.data?.token) {
        localStorage.setItem('authToken', response.data.data.token);
      }
      return normalizeUser(response.data.data.user);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      );
    }
  }
);

// Login user thunk
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.data.data?.token) {
        localStorage.setItem('authToken', response.data.data.token);
      }
      return normalizeUser(response.data.data.user);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

// Verify token thunk
export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await axios.get(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return normalizeUser(response.data.data);
    } catch (error) {
      localStorage.removeItem('authToken');
      return rejectWithValue(
        error.response?.data?.message || 'Token verification failed'
      );
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('authToken') || null,
  isLoading: false,
  isAuthenticated: !!localStorage.getItem('authToken'),
  error: null,
  successMessage: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('authToken');
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    },
    initializeAuth: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    setUser: (state, action) => {
      state.user = normalizeUser(action.payload);
      // Persist updated user to localStorage for recovery (without large profile picture)
      if (state.user && state.user._id) {
        const userToSave = { ...state.user };
        // Don't save profilePicture if it's a large base64 string to avoid localStorage overflow
        if (userToSave.profilePicture && userToSave.profilePicture.length > 1000) {
          delete userToSave.profilePicture;
        }
        localStorage.setItem('userProfileData', JSON.stringify(userToSave));
      }
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = localStorage.getItem('authToken');
        state.isAuthenticated = true;
        state.successMessage = 'Registration successful! Welcome!';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = localStorage.getItem('authToken');
        state.isAuthenticated = true;
        state.successMessage = 'Login successful!';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Verify Token
    builder
      .addCase(verifyToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
        // Save user profile to localStorage for persistence (without large profile picture)
        if (state.user && state.user._id) {
          const userToSave = { ...state.user };
          // Don't save profilePicture if it's a large base64 string to avoid localStorage overflow
          if (userToSave.profilePicture && userToSave.profilePicture.length > 1000) {
            delete userToSave.profilePicture;
          }
          localStorage.setItem('userProfileData', JSON.stringify(userToSave));
        }
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { logout, clearError, clearSuccess, initializeAuth, setUser } =
  authSlice.actions;
export default authSlice.reducer;
