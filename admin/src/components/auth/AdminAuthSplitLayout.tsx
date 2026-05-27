'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Bot, ShieldCheck } from 'lucide-react';

interface AdminAuthSplitLayoutProps {
  children: React.ReactNode;
}

export default function AdminAuthSplitLayout({ children }: AdminAuthSplitLayoutProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [authImage, setAuthImage] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    const randomNum = Math.floor(Math.random() * 9) + 1;
    setAuthImage(`/images/auth/auth${randomNum}.webp`);
  }, []);

  const isDark = !mounted || resolvedTheme === 'dark';

  return (
    <main
      className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 relative bg-zinc-50 dark:bg-zinc-950 overflow-x-hidden transition-colors duration-300"
      role="main"
      aria-label="AI JobFit Admin Authentication Layout"
    >
      {/* Form Column */}
      <div
        className="flex items-center justify-center p-4 sm:p-8 lg:p-12 w-full min-h-screen z-10 relative"
        aria-label="Admin Authentication Form Section"
      >
        {/* Background Glowing Blobs */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none -z-10"
          aria-hidden="true"
        >
          <div className="absolute top-0 left-0 w-[450px] h-[450px] md:w-[650px] md:h-[650px] bg-gradient-to-br from-primary/50 via-secondary/25 to-transparent rounded-full blur-[90px] md:blur-[140px] opacity-75 dark:opacity-100" />
          <div className="absolute bottom-0 right-0 w-[450px] h-[450px] md:w-[650px] md:h-[650px] bg-gradient-to-tl from-secondary/50 via-primary/25 to-transparent rounded-full blur-[90px] md:blur-[140px] opacity-75 dark:opacity-100" />
        </div>

        <section
          className="w-full max-w-[460px] p-6 sm:p-8 md:p-10 bg-gradient-to-br from-white/95 via-white/80 to-zinc-50/50 dark:from-zinc-900/95 dark:via-zinc-950/80 dark:to-zinc-900/50 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 rounded-3xl relative shadow-2xl my-auto transition-colors duration-300"
          aria-labelledby="admin-auth-layout-heading"
        >
          {/* SEO Hidden Heading */}
          <h1 id="admin-auth-layout-heading" className="sr-only">
            AI JobFit Admin Secure Authentication Portal
          </h1>

          {/* SEO Hidden Description */}
          <p className="sr-only">
            Access the AI JobFit Admin Panel securely to manage users, recruiters,
            job postings, and analyze platform metrics.
          </p>

          <div className="w-full mx-auto">
            {children}
          </div>
        </section>
      </div>

      {/* Image / Brand Column */}
      <aside
        className={`hidden lg:flex flex-col justify-between p-12 lg:p-16 relative w-full h-full overflow-hidden select-none transition-all duration-300 ${isDark
          ? 'bg-zinc-950 text-white'
          : 'bg-gradient-to-br from-violet-50/95 via-indigo-50/60 to-purple-100/60 text-zinc-900 border-l border-violet-100/50'
          }`}
        aria-label="AI JobFit Admin Branding Panel"
      >
        {/* Randomized Background Image */}
        {authImage && (
          <Image
            src={authImage}
            alt="AI JobFit Admin Panel background"
            fill
            priority={false}
            className={`object-cover transition-all duration-1000 ${isDark
              ? 'opacity-85 brightness-[0.75] contrast-[1.1] saturate-[0.8]'
              : 'opacity-[0.92] brightness-[1.03] contrast-[0.98] saturate-[1.05] mix-blend-multiply'
              }`}
            sizes="50vw"
          />
        )}

        {/* Overlay Gradients */}
        <div
          className={`absolute inset-0 z-10 transition-all duration-300 ${isDark
            ? 'bg-gradient-to-t from-black via-black/45 to-transparent'
            : 'bg-gradient-to-t from-violet-100/70 via-indigo-50/20 to-transparent'
            }`}
          aria-hidden="true"
        />
        <div
          className={`absolute inset-0 z-10 transition-all duration-300 ${isDark
            ? 'bg-gradient-to-tr from-primary/20 via-transparent to-secondary/10'
            : 'bg-gradient-to-tr from-primary/10 via-transparent to-indigo-500/5'
            }`}
          aria-hidden="true"
        />



        {/* Content */}
        <div className="relative z-20 flex flex-col justify-between h-full" style={{ zIndex: 20 }}>
          {/* Logo */}
          <div
            className={`flex items-center gap-2 backdrop-blur-md px-4 py-2 rounded-full border self-start transition-all duration-300 ${isDark
              ? 'bg-black/35 border-white/10 text-white shadow-lg shadow-black/50'
              : 'bg-white/80 border-violet-100/80 text-indigo-950 shadow-lg shadow-indigo-200/30'
              }`}
            aria-label="AI JobFit Admin Logo"
          >
            <Bot
              className={`w-6 h-6 transition-colors duration-300 ${isDark ? 'text-white' : 'text-primary'}`}
              aria-hidden="true"
            />
            <span className="text-lg font-bold tracking-tight">AI JobFit</span>
            <span className={`text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full ${isDark ? 'bg-primary/20 text-primary' : 'bg-indigo-100 text-indigo-600'}`}>
              Admin
            </span>
          </div>

          {/* Text Content */}
          <section
            className={`max-w-md backdrop-blur-md p-8 rounded-3xl border transition-all duration-300 ${isDark
              ? 'bg-black/35 border-white/10 text-white shadow-2xl shadow-black/60'
              : 'bg-white/80 border-violet-100/80 text-indigo-950 shadow-2xl shadow-indigo-200/40'
              }`}
            aria-labelledby="admin-panel-heading"
          >
            {/* Shield icon */}
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${isDark ? 'bg-primary/15 border border-primary/20' : 'bg-indigo-100/80 border border-indigo-200/50'}`}>
              <ShieldCheck className={`w-7 h-7 ${isDark ? 'text-primary' : 'text-indigo-600'}`} aria-hidden="true" />
            </div>

            <h2
              id="admin-panel-heading"
              className={`text-3xl font-extrabold leading-tight mb-4 tracking-tight transition-colors duration-300 ${isDark ? 'text-white' : 'text-indigo-950'}`}
            >
              Super Admin Control Center
            </h2>

            <p
              className={`text-xs leading-relaxed font-medium transition-colors duration-300 ${isDark ? 'text-zinc-300' : 'text-indigo-950/70'}`}
            >
              Manage users, recruiters, and job listings. Monitor platform health,
              analyze AI matching metrics, and ensure compliance — all from one secure panel.
            </p>

            {/* Feature bullets */}
            <ul className={`mt-4 space-y-2 text-xs font-medium ${isDark ? 'text-zinc-400' : 'text-indigo-950/60'}`}>
              {['User & Recruiter Management', 'AI Metrics Dashboard', 'Job Listing Moderation', 'Platform Security Oversight'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isDark ? 'bg-primary' : 'bg-indigo-500'}`} />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Footer */}
          <footer
            className={`text-[10px] font-medium transition-colors duration-300 ${isDark ? 'text-zinc-400' : 'text-indigo-950/50'}`}
          >
            © {new Date().getFullYear()} AI JobFit Inc. Admin Portal — Authorized Access Only.
          </footer>
        </div>
      </aside>
    </main>
  );
}
