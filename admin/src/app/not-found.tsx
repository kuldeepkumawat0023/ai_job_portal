'use client';

import React from 'react';
import Link from 'next/link';
import { HelpCircle, ArrowLeft, ShieldAlert } from 'lucide-react';

/**
 * 🔍 Custom 404 Page (Not Found)
 * Renders a glassmorphic 404 error page aligned with the admin portal theme.
 */
export default function NotFound() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center bg-background px-6 overflow-hidden">
      {/* Background Decorative Blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Glassmorphic Container */}
      <div className="relative w-full max-w-lg bg-surface-container/30 border border-outline-variant/30 rounded-[40px] p-8 md:p-12 text-center shadow-2xl backdrop-blur-md z-10 space-y-8 animate-in fade-in zoom-in duration-500">
        
        {/* Animated Icon Cluster */}
        <div className="flex justify-center relative">
          <div className="w-24 h-24 rounded-[32px] bg-primary/10 flex items-center justify-center relative border border-primary/20 shadow-lg animate-bounce">
            <HelpCircle className="w-12 h-12 text-primary" />
            <div className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-xl shadow-md border border-background">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-3">
          <h1 className="text-7xl font-black tracking-tighter text-gradient-primary">
            404
          </h1>
          <h2 className="text-2xl font-black text-on-surface uppercase tracking-wide">
            Page Not Found
          </h2>
          <p className="text-sm text-on-surface-variant font-medium max-w-md mx-auto leading-relaxed">
            The page you are looking for does not exist, has been removed, or is temporarily unavailable. Please verify the URL path or return to the dashboard.
          </p>
        </div>

        {/* Buttons / Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 gradient-button text-white px-6 py-3.5 rounded-2xl text-sm font-black shadow-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <a
            href="mailto:support@aijobfit.com"
            className="w-full sm:w-auto flex items-center justify-center gap-2 glass-card px-6 py-3.5 rounded-2xl text-sm font-bold text-on-surface hover:bg-surface-container-high/40 transition-all border border-outline-variant/20 cursor-pointer"
          >
            Contact Support
          </a>
        </div>
      </div>
    </main>
  );
}
