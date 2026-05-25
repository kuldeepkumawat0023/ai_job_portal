import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { AuthUser, TOKEN_KEY, USER_KEY } from '../lib/apiClient';

/**
 * 🔒 Advanced Auth Slice
 * Features: Hydration Guard, Persistence, Cross-Tab Sync
 */

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean; // Prevents Next.js Hydration Mismatch
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Client-side initialization: Reads storage only on the browser.
     */
    initializeAuth: (state) => {
      if (typeof window === 'undefined') return;

      const token = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
      const userRaw = localStorage.getItem(USER_KEY);

      try {
        if (token && userRaw) {
          const user = JSON.parse(userRaw);
          state.token = token;
          state.user = user;
          state.isAuthenticated = true;
          
          // Re-sync to cookies to ensure 365-day life
          Cookies.set(TOKEN_KEY, token, { expires: 365, path: '/' });
          Cookies.set('user_role', user.role, { expires: 365, path: '/' });
        }
      } catch (error) {
        console.error('Auth sync failed:', error);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        Cookies.remove(TOKEN_KEY);
        Cookies.remove('user_role');
      } finally {
        state.isInitialized = true;
      }
    },

    /**
     * Store credentials after Login/Register
     */
    setCredentials: (state, action: PayloadAction<{ user: AuthUser; token: string }>) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;

      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        Cookies.set(TOKEN_KEY, token, { expires: 365, path: '/' });
        Cookies.set('user_role', user.role, { expires: 365, path: '/' });
      }
    },

    /**
     * Partial update (e.g. Profile Photo, Skills)
     */
    updateUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        if (typeof window !== 'undefined') {
          localStorage.setItem(USER_KEY, JSON.stringify(state.user));
          
          // Sync role to cookie if updated
          if (action.payload.role) {
            Cookies.set('user_role', action.payload.role, { expires: 365, path: '/' });
          }
        }
      }
    },

    /**
     * Deep clean storage on Logout
     */
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        Cookies.remove(TOKEN_KEY, { path: '/' });
        Cookies.remove('user_role', { path: '/' });
      }
    },
  },
});

export const { initializeAuth, setCredentials, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
