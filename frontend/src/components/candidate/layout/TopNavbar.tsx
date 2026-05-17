'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Sun,
  Moon,
  Menu,
  ChevronDown,
  User,
  LogOut,
  Globe,
  Settings,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { cn } from '@/utils/cn';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/lib/services/auth.services';
import { useRouter } from 'next/navigation';
import { getBackendBaseUrl } from '@/lib/apiClient';
import Link from 'next/link';
import HiringTransitionModal from './HiringTransitionModal';

interface TopNavbarProps {
  onMenuClick: () => void;
}

function getInitials(name?: string): string {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  const first = parts[0]?.[0] || '';
  const last = parts[parts.length - 1]?.[0] || '';
  return (first + last).toUpperCase();
}

const TopNavbar: React.FC<TopNavbarProps> = ({ onMenuClick }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHiringModalOpen, setIsHiringModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout API failed:', error);
    } finally {
      logout();
      router.push('/');
    }
  };

  const getProfilePhoto = () => {
    if (!user?.profilePhoto) return null;
    return user.profilePhoto.startsWith('http')
      ? user.profilePhoto
      : `${getBackendBaseUrl().replace('/api/v1', '')}${user.profilePhoto}`;
  };

  return (
    <header className="sticky top-0 right-0 w-full h-16 md:h-20 glass-navbar border-b border-outline-variant/10 flex items-center justify-between px-4 md:px-6 lg:px-10 z-40">
      {/* Left: Mobile Toggle + Brand */}
      <div className="flex items-center gap-3 flex-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden text-on-surface-variant"
        >
          <Menu className="w-6 h-6" />
        </Button>

        {/* Brand Name */}
        <Link href="/candidate/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-sm shadow-primary/30">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-sm font-bold text-on-surface hidden sm:block">
            AI JobFit
          </span>
        </Link>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-1 md:gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-on-surface-variant hover:text-primary relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-background" />
        </Button>

        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        )}

        <div className="hidden md:flex items-center ml-2">
          <div className="relative inline-block group">
            {/* Pulsing sound waves/vibration ripples with dual-gradient energy */}
            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/30 to-secondary/30 pointer-events-none blur-[2px]"
              style={{ zIndex: 0 }}
              animate={{
                scale: [1, 1.3],
                opacity: [0.6, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-secondary/20 to-tertiary/20 pointer-events-none blur-[2px]"
              style={{ zIndex: 0 }}
              animate={{
                scale: [1, 1.5],
                opacity: [0.4, 0]
              }}
              transition={{
                duration: 2,
                delay: 0.7,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />

            <Button 
              variant="gradient" 
              size="sm"
              onClick={() => setIsHiringModalOpen(true)}
              className="relative overflow-hidden rounded-xl text-white font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/30 active:scale-95"
              style={{ position: 'relative', zIndex: 1 }}
            >
              {/* Glowing shimmer reflection */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              <Briefcase className="w-3.5 h-3.5 group-hover:animate-bounce" />
              Start Hiring
            </Button>
          </div>
        </div>

        <div className="h-8 w-[1px] bg-outline-variant/20 mx-1 hidden sm:block" />

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-full hover:bg-surface-container transition-colors group"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-[10px] font-bold overflow-hidden border border-primary/20 shadow-sm transition-transform group-hover:scale-105">
              {getProfilePhoto() ? (
                <img
                  src={getProfilePhoto()!}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials(user?.fullname)
              )}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-on-surface leading-tight truncate max-w-[100px]">
                {user?.fullname || 'Guest'}
              </div>
              <div className="text-[9px] text-on-surface-variant font-medium uppercase tracking-tighter">
                {user?.role || 'User'}
              </div>
            </div>
            <ChevronDown className={cn(
              "w-4 h-4 text-on-surface-variant group-hover:text-primary transition-all duration-300",
              isDropdownOpen ? "rotate-180" : ""
            )} />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-60 bg-white dark:bg-zinc-950 backdrop-blur-xl border border-outline-variant/30 rounded-2xl shadow-2xl py-2 overflow-hidden z-50 shadow-primary/10"
              >
                <div className="px-4 py-3 border-b border-outline-variant/10 mb-1">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Signed in as</p>
                  <p className="text-sm font-bold text-on-surface truncate">{user?.email}</p>
                </div>

                <div className="px-2 space-y-0.5">
                  <Link
                    href="/candidate/portfolio"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-on-surface hover:bg-primary/10 hover:text-primary rounded-xl transition-colors group/item"
                  >
                    <div className="p-1.5 rounded-lg bg-surface-container text-on-surface-variant group-hover/item:bg-primary/20 group-hover/item:text-primary transition-colors">
                      <User size={16} />
                    </div>
                    My Profile
                  </Link>

                  <Link
                    href="/"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-on-surface hover:bg-primary/10 hover:text-primary rounded-xl transition-colors group/item"
                  >
                    <div className="p-1.5 rounded-lg bg-surface-container text-on-surface-variant group-hover/item:bg-primary/20 group-hover/item:text-primary transition-colors">
                      <Globe size={16} />
                    </div>
                    View Portal
                  </Link>

                  <Link
                    href="/candidate/settings"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-on-surface hover:bg-primary/10 hover:text-primary rounded-xl transition-colors group/item"
                  >
                    <div className="p-1.5 rounded-lg bg-surface-container text-on-surface-variant group-hover/item:bg-primary/20 group-hover/item:text-primary transition-colors">
                      <Settings size={16} />
                    </div>
                    Settings
                  </Link>
                </div>

                <div className="mt-2 pt-2 border-t border-outline-variant/10 px-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-error hover:bg-error/10 rounded-xl transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-error/10 text-error">
                      <LogOut size={16} />
                    </div>
                    Logout Account
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <HiringTransitionModal 
        isOpen={isHiringModalOpen} 
        onClose={() => setIsHiringModalOpen(false)} 
      />
    </header>
  );
};

export default TopNavbar;
