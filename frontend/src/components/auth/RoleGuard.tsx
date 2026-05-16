'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: ('candidate' | 'recruiter' | 'admin')[];
}

/**
 * 🛡️ RoleGuard
 * Restricts access based on user role.
 */
const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { user, isInitialized } = useAuth();

  if (!isInitialized) return null;

  const userRole = user?.role as 'candidate' | 'recruiter' | 'admin';

  if (!user || !allowedRoles.includes(userRole)) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center text-error mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-on-surface mb-2">Access Denied</h1>
        <p className="text-on-surface-variant max-w-md mb-8">
          You don't have the necessary permissions to view this sanctuary. Please contact your administrator if you believe this is an error, or try logging in again to refresh your session.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => window.location.href = '/login'}
            className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            Back to Login
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-8 py-3 bg-surface-variant text-on-surface-variant rounded-xl font-bold hover:bg-surface-variant/80 transition-all border border-outline/20"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleGuard;
