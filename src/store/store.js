import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cityReducer from './slices/citySlice';
import postsReducer from './slices/postsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    city: cityReducer,
    posts: postsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/registerUser/fulfilled', 'auth/loginUser/fulfilled', 'auth/verifyToken/fulfilled'],
      },
    }),
});

export default store;
