'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * 🔒 AuthGuard
 * Prevents unauthenticated users from accessing protected pages.
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isInitialized, router]);

  // Show nothing while initializing or if not authenticated
  if (!isInitialized || !isAuthenticated) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
