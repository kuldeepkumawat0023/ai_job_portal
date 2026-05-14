'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';

/**
 * 🌐 Google Authentication Provider
 * Wraps the application to enable Google Social Login.
 */
export default function GoogleAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    console.error('Google Client ID is missing in environment variables!');
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
