'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks/redux';
import { logout as logoutAction, setCredentials, initializeAuth } from '@/store/authSlice';
import { AuthUser } from '@/lib/apiClient';
import { useEffect } from 'react';

/**
 * 🎣 useAuth Hook
 * Your central hub for all things Authentication.
 * Now located in @/hooks for architectural consistency.
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isInitialized, token } = useAppSelector((state) => state.auth);

  // Auto-initialize on mount if not already done
  useEffect(() => {
    if (!isInitialized) {
      dispatch(initializeAuth());
    }
  }, [dispatch, isInitialized]);

  const logout = () => {
    dispatch(logoutAction());
  };

  const login = (user: AuthUser, token: string) => {
    dispatch(setCredentials({ user, token }));
  };

  return {
    user,
    token,
    isAuthenticated,
    isInitialized,
    logout,
    login,
    isCandidate: user?.role === 'candidate',
    isRecruiter: user?.role === 'recruiter',
    isAdmin: user?.role === 'admin',
  };
};
