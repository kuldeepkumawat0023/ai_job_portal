'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, ArrowLeft, Search, Briefcase } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

/**
 * 🚀 Custom 404 Page (Not Found) for Frontend Job Portal
 * Renders a visually stunning, interactive page with animations matching globals.css
 */
export default function NotFound() {
  const { user, isAuthenticated } = useAuth();

  const getHomeLink = () => {
    if (!isAuthenticated || !user) return '/';
    if (user.role === 'recruiter') return '/recruiter/dashboard';
    return '/candidate/dashboard';
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center bg-background px-6 overflow-hidden hero-gradient">
      {/* Background Decorative Blurs */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Glassmorphic Card */}
      <div className="relative w-full max-w-xl bg-surface-container/30 border border-outline-variant/30 rounded-[40px] p-8 md:p-12 text-center shadow-2xl backdrop-blur-md z-10 space-y-8 animate-in fade-in zoom-in duration-500">
        
        {/* Floating 3D Icon Cluster */}
        <div className="flex justify-center relative">
          <div className="w-28 h-28 rounded-[36px] bg-primary/10 flex items-center justify-center relative border border-primary/20 shadow-xl floating-widget">
            <Compass className="w-14 h-14 text-primary animate-spin-slow" />
            <div className="absolute -bottom-2 -right-2 bg-secondary text-white p-2 rounded-2xl shadow-lg border border-background">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Text and Headlines */}
        <div className="space-y-4">
          <h1 className="text-8xl font-black tracking-tighter text-gradient-primary leading-none">
            404
          </h1>
          <h2 className="text-2xl font-black text-on-surface uppercase tracking-wide">
            Lost in the Career Space?
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant font-medium max-w-md mx-auto leading-relaxed">
            The page you are looking for has wandered off the grid. It might have expired, been filled, or the URL path is misspelled. Let's get you back on track!
          </p>
        </div>

        {/* Interactive CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
          <Link
            href={getHomeLink()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 gradient-button text-white px-6 py-3.5 rounded-2xl text-sm font-black shadow-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer button-glow"
          >
            <ArrowLeft className="w-4 h-4" />
            {isAuthenticated ? 'Back to Dashboard' : 'Go Back Home'}
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto flex items-center justify-center gap-2 glass-card px-6 py-3.5 rounded-2xl text-sm font-bold text-on-surface hover:bg-surface-container-high/40 transition-all border border-outline-variant/20 cursor-pointer"
          >
            <Search className="w-4 h-4 text-primary" />
            Browse Portal
          </Link>
        </div>
      </div>
    </main>
  );
}
