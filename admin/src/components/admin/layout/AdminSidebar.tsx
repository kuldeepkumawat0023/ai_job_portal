'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UsersRound,
  Briefcase,
  Bell,
  DollarSign,
  CreditCard,
  BarChart3,
  Settings,
  HelpCircle,
  X,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import Button from '@/components/common/Button';

interface NavLink {
  name: string;
  href: string;
  icon: any;
}

const navLinks: NavLink[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Team Management', href: '/team', icon: UsersRound },
  { name: 'Recruiters', href: '/recruiters', icon: Briefcase },
  { name: 'Job Posts', href: '/job-posts', icon: Briefcase },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Revenue', href: '/revenue', icon: DollarSign },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed left-0 top-0 h-screen w-80 max-w-[85vw] lg:w-72 admin-sidebar z-50 transition-transform duration-300 ease-in-out flex flex-col p-6 lg:static lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo Section */}
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-on-surface dark:text-white tracking-tight">AI JobFit</div>
              <div className="text-[10px] font-bold text-primary dark:text-indigo-400 uppercase tracking-widest">Super Admin</div>
            </div>
          </div>

          {/* Mobile Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden text-on-surface-variant hover:text-red-500 transition-colors p-1"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={cn(
                  "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:translate-x-1",
                  active
                    ? "bg-primary/10 text-primary dark:text-indigo-400 shadow-sm border-l-4 border-primary dark:border-indigo-400"
                    : "text-on-surface-variant dark:text-zinc-400 hover:bg-surface-container-high dark:hover:bg-zinc-800 hover:text-on-surface dark:hover:text-white"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                  active ? "text-primary dark:text-indigo-400" : "text-on-surface-variant dark:text-zinc-400 group-hover:text-primary dark:group-hover:text-indigo-400"
                )} />
                <span className="text-sm font-semibold flex-1">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
