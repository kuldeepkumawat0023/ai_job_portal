'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isInitialized, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isInitialized, router]);

  // Loading State
  if (!isInitialized || !isAuthenticated) {
    return (
      <section
        className="h-screen w-full flex items-center justify-center bg-zinc-950 text-white"
        aria-label="Authentication loading screen"
      >
        <h1 className="sr-only">Secure Authentication Verification</h1>
        <p className="sr-only">Verifying admin authentication status...</p>
        <div
          className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"
          role="status"
          aria-live="polite"
          aria-label="Loading authentication status"
        />
      </section>
    );
  }

  // Admin Role Check
  if (user?.role !== 'admin') {
    return (
      <section
        className="h-screen w-full flex flex-col items-center justify-center bg-zinc-950 p-6 text-center text-white"
        aria-labelledby="access-denied-heading"
      >
        <h1 className="sr-only">Access Denied - Unauthorized Admin Access</h1>
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-6" aria-hidden="true">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 id="access-denied-heading" className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-zinc-400 max-w-md mb-8">
          You don&apos;t have the necessary administrator permissions to view this sanctuary. Please contact support or try logging in with an admin account.
        </p>
        <button
          type="button"
          onClick={() => {
            // clear invalid user and redirect
            localStorage.removeItem('portal_token');
            localStorage.removeItem('portal_user');
            window.location.href = '/login';
          }}
          className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
        >
          Back to Login
        </button>
      </section>
    );
  }

  return <>{children}</>;
};

export default AdminAuthGuard;
