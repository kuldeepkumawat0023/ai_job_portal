'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks/redux';
import { logout as logoutAction, setCredentials, initializeAuth, updateUser as updateUserAction } from '@/store/authSlice';
import { AuthUser } from '@/lib/apiClient';
import { useEffect } from 'react';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isInitialized, token } = useAppSelector((state) => state.auth);

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
    updateUser: (data: Partial<AuthUser>) => dispatch(updateUserAction(data)),
    isCandidate: user?.role === 'candidate',
    isRecruiter: user?.role === 'recruiter',
    isAdmin: user?.role === 'admin',
  };
};
