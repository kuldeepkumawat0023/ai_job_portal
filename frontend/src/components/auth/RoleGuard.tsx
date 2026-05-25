'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: (
    | 'candidate'
    | 'recruiter'
    | 'admin'
  )[];
}

/**
 * 🛡️ RoleGuard
 * SEO + Accessibility Optimized
 * Restricts access based on user role.
 */
const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles
}) => {
  const { user, isInitialized } = useAuth();

  if (!isInitialized) return null;

  const userRole = user?.role as
    | 'candidate'
    | 'recruiter'
    | 'admin';

  if (
    !user ||
    !allowedRoles.includes(userRole)
  ) {
    return (
      <section
        className="h-screen w-full flex flex-col items-center justify-center bg-background p-6 text-center"
        aria-labelledby="access-denied-heading"
      >
        {/* SEO Hidden H1 */}
        <h1 className="sr-only">
          Access Denied - Unauthorized User
          Access
        </h1>

        <div
          className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center text-error mb-6"
          aria-hidden="true"
        >
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Visible Heading */}
        <h2
          id="access-denied-heading"
          className="text-2xl font-bold text-on-surface mb-2"
        >
          Access Denied
        </h2>

        {/* SEO Description */}
        <p className="sr-only">
          You do not have permission to access
          this protected AI JobFit page. Please
          log in with an authorized account or
          contact the administrator for access.
        </p>

        <p className="text-on-surface-variant max-w-md mb-8">
          You don&apos;t have the necessary
          permissions to view this sanctuary.
          Please contact your administrator if
          you believe this is an error, or try
          logging in again to refresh your
          session.
        </p>

        {/* Action Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4"
          aria-label="Navigation actions"
        >
          <button
            type="button"
            aria-label="Go to login page"
            onClick={() =>
              (window.location.href = '/login')
            }
            className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            Back to Login
          </button>

          <button
            type="button"
            aria-label="Go to homepage"
            onClick={() =>
              (window.location.href = '/')
            }
            className="px-8 py-3 bg-surface-variant text-on-surface-variant rounded-xl font-bold hover:bg-surface-variant/80 transition-all border border-outline/20"
          >
            Back to Home
          </button>
        </div>
      </section>
    );
  }

  return <>{children}</>;
};

export default RoleGuard;