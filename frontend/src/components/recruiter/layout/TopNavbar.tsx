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
  Search,
  Calendar as CalendarIcon,
  Star,
  BrainCircuit
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { cn } from '@/utils/cn';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/lib/services/auth.services';
import { useRouter } from 'next/navigation';
import { getBackendBaseUrl } from '@/lib/apiClient';
import Link from 'next/link';

interface TopNavbarProps {
  onMenuClick: () => void;
}

const notifications = [
  {
    id: 1,
    title: 'Elena Rodriguez scheduled an interview',
    time: '2 mins ago',
    type: 'interview',
    icon: CalendarIcon,
    color: 'text-primary bg-primary/10'
  },
  {
    id: 2,
    title: 'New 5-star feedback received for TechNova',
    time: '1 hour ago',
    type: 'feedback',
    icon: Star,
    color: 'text-tertiary bg-tertiary/10'
  },
  {
    id: 3,
    title: 'AI Match: David Miller is a 98% match',
    time: '3 hours ago',
    type: 'ai',
    icon: BrainCircuit,
    color: 'text-secondary bg-secondary/10'
  }
];

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
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
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
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-4 flex-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden text-on-surface-variant"
        >
          <Menu className="w-6 h-6" />
        </Button>

        {/* Brand Name */}
        <Link href="/recruiter/dashboard" className="flex items-center gap-2 group">
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

        <div className="hidden md:flex items-center gap-4 ml-2">
          <div className="h-6 w-[1px] bg-outline-variant/20 mx-2" />
          <div className="flex items-center gap-2.5 px-4 py-1.5 bg-surface-container/50 rounded-2xl border border-outline-variant/10">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-black text-on-surface uppercase tracking-widest italic">
              TechNova <span className="text-primary">Solutions</span>
            </span>
          </div>
        </div>
      </div>

      {/* Right Section: Actions & Profile */}
      <div className="flex items-center gap-1 md:gap-4">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-on-surface-variant hover:text-primary relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-background" />
          </Button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-4 w-80 bg-white dark:bg-zinc-950 backdrop-blur-xl rounded-2xl shadow-2xl border border-outline-variant/30 z-50 overflow-hidden py-2"
              >
                <div className="px-6 py-4 border-b border-outline-variant/20 flex justify-between items-center">
                  <span className="text-xs font-black text-on-surface uppercase tracking-widest">Recent Activities</span>
                  <button className="text-[10px] font-bold text-primary hover:underline uppercase">Mark all read</button>
                </div>
                <div className="max-h-[350px] overflow-y-auto">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="px-6 py-4 hover:bg-surface-container transition-colors flex gap-4 cursor-pointer">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${notif.color}`}>
                        <notif.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-on-surface leading-tight mb-1">{notif.title}</p>
                        <p className="text-[10px] text-on-surface-variant font-medium">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full py-3 text-xs font-bold text-primary hover:bg-primary/5 transition-colors border-t border-outline-variant/20">
                  View All Notifications
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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

        <div className="h-8 w-[1px] bg-outline-variant/20 mx-1 hidden sm:block" />

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-full hover:bg-surface-container transition-colors group"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-[10px] font-bold overflow-hidden border border-primary/20 shadow-sm transition-transform group-hover:scale-105">
              {getProfilePhoto() ? (
                <img src={getProfilePhoto()!} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                getInitials(user?.fullname)
              )}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-on-surface leading-tight truncate max-w-[100px]">
                {user?.fullname || 'Guest Recruiter'}
              </div>
              <div className="text-[9px] text-on-surface-variant font-medium uppercase tracking-tighter">
                {user?.role || 'Recruiter'}
              </div>
            </div>
            <ChevronDown className={cn(
              "w-4 h-4 text-on-surface-variant group-hover:text-primary transition-all duration-300",
              isDropdownOpen ? "rotate-180" : ""
            )} />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-60 bg-white dark:bg-zinc-950 backdrop-blur-xl border border-outline-variant/30 rounded-2xl shadow-2xl py-2 overflow-hidden z-50 shadow-primary/10"
              >
                <div className="px-4 py-3 border-b border-outline-variant/10 mb-1">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Recruiter Portal</p>
                  <p className="text-sm font-bold text-on-surface truncate">{user?.email}</p>
                </div>

                <div className="px-2 space-y-0.5">
                  <Link
                    href="/recruiter/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-on-surface hover:bg-primary/10 hover:text-primary rounded-xl transition-colors group/item"
                  >
                    <div className="p-1.5 rounded-lg bg-surface-container text-on-surface-variant group-hover/item:bg-primary/20 group-hover/item:text-primary transition-colors">
                      <User size={16} />
                    </div>
                    Recruiter Profile
                  </Link>

                  <Link
                    href="/"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-on-surface hover:bg-primary/10 hover:text-primary rounded-xl transition-colors group/item"
                  >
                    <div className="p-1.5 rounded-lg bg-surface-container text-on-surface-variant group-hover/item:bg-primary/20 group-hover/item:text-primary transition-colors">
                      <Globe size={16} />
                    </div>
                    Main Website
                  </Link>

                  <Link
                    href="/recruiter/settings"
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
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                  >
                    <div className="p-1.5 rounded-lg bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                      <LogOut size={16} />
                    </div>
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
