'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import {
  Bell,
  Sun,
  Moon,
  Menu,
  ChevronDown,
  User,
  LogOut,
  Settings,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/lib/services/auth.services';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/common/Button';
import { cn } from '@/utils/cn';

interface AdminNavbarProps {
  onMenuClick: () => void;
}

function getInitials(name?: string): string {
  if (!name) return 'A';
  const parts = name.trim().split(' ');
  const first = parts[0]?.[0] || '';
  const last = parts[parts.length - 1]?.[0] || '';
  return (first + last).toUpperCase();
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ onMenuClick }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout API failed:', error);
    } finally {
      logout();
      router.push('/login');
    }
  };

  return (
    <header className="sticky top-0 right-0 w-full h-16 md:h-20 admin-navbar flex items-center justify-between px-4 md:px-6 lg:px-10 z-40">
      {/* Mobile Toggle & Brand */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden text-on-surface-variant dark:text-zinc-400 p-1"
        >
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      {/* Right Side: Actions & Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="text-on-surface-variant dark:text-zinc-400 hover:text-primary relative p-1.5"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
        </Button>

        {/* Theme Toggle */}
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-on-surface-variant dark:text-zinc-400 hover:text-primary transition-colors p-1.5"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        )}

        <div className="h-8 w-[1px] bg-outline-variant/20 dark:bg-zinc-800 mx-1 hidden sm:block" />

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-[10px] font-bold overflow-hidden border border-primary/20 shadow-sm transition-transform group-hover:scale-105">
              {getInitials(user?.fullname)}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-on-surface dark:text-white leading-tight truncate max-w-[100px]">
                {user?.fullname || 'Admin'}
              </div>
              <div className="text-[9px] text-on-surface-variant dark:text-zinc-500 font-semibold uppercase tracking-widest mt-0.5">
                {user?.role || 'Super Admin'}
              </div>
            </div>
            <ChevronDown className={cn(
              "w-4 h-4 text-on-surface-variant dark:text-zinc-500 group-hover:text-primary transition-all duration-300",
              isDropdownOpen ? "rotate-180" : ""
            )} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-zinc-900 border border-outline-variant/30 dark:border-zinc-800 rounded-2xl shadow-2xl py-2 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-outline-variant/10 dark:border-zinc-800 mb-1">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Logged in as</p>
                <p className="text-sm font-bold text-on-surface dark:text-white truncate">{user?.email || 'admin@aijobfit.com'}</p>
              </div>

              <div className="px-2 space-y-0.5">
                <Link
                  href="/settings"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-on-surface dark:text-zinc-300 hover:bg-primary/10 hover:text-primary rounded-xl transition-colors group/item"
                >
                  <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 group-hover/item:bg-primary/20 group-hover/item:text-primary transition-colors">
                    <User size={16} />
                  </div>
                  My Profile
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-on-surface dark:text-zinc-300 hover:bg-primary/10 hover:text-primary rounded-xl transition-colors group/item"
                >
                  <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 group-hover/item:bg-primary/20 group-hover/item:text-primary transition-colors">
                    <Settings size={16} />
                  </div>
                  Settings
                </Link>
              </div>

              <div className="mt-2 pt-2 border-t border-outline-variant/10 dark:border-zinc-800 px-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="p-1.5 rounded-lg bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                    <LogOut size={16} />
                  </div>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
