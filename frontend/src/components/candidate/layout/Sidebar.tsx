'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileSearch,
  Briefcase,
  CheckSquare,
  MessageSquare,
  Lightbulb,
  Mic2,
  UserCircle,
  Settings,
  Bot,
  ChevronRight,
  ChevronDown,
  X,
  Globe,
  User,
  ShieldAlert
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/common/Button';

import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface NavLink {
  name: string;
  href: string;
  icon: any;
  children?: NavLink[];
}

const navLinks: NavLink[] = [
  { name: 'Dashboard', href: '/candidate/dashboard', icon: LayoutDashboard },
  { name: 'Resume Analysis', href: '/candidate/resume-analysis', icon: FileSearch },
  { name: 'Job Matches', href: '/candidate/job-matches', icon: Briefcase },
  { name: 'Applications', href: '/candidate/applications', icon: CheckSquare },
  { name: 'Messages', href: '/candidate/messages', icon: MessageSquare },
  { name: 'AI Suggestions', href: '/candidate/ai-suggestions', icon: Lightbulb },
  { name: 'AI Mock Interview', href: '/candidate/aimock-interview', icon: Mic2 },
  { name: 'AI Portfolio Builder', href: '/candidate/portfolio', icon: UserCircle },
  {
    name: 'Settings',
    href: '/candidate/settings',
    icon: Settings,
    children: [
      { name: 'Profile Settings', href: '/candidate/settings', icon: UserCircle },
      { name: 'View My Profile', href: '/candidate/settings/profile', icon: UserCircle }
    ]
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const [openSubMenus, setOpenSubMenus] = React.useState<string[]>([]);

  const { conversations } = useSelector((state: RootState) => state.chat);
  const totalUnreadCount = conversations.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0);

  const toggleSubMenu = (name: string) => {
    setOpenSubMenus(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  // Automatically open sub-menu if child route is active
  React.useEffect(() => {
    navLinks.forEach(item => {
      if (item.children?.some(child => pathname === child.href)) {
        setOpenSubMenus(prev => prev.includes(item.name) ? prev : [...prev, item.name]);
      }
    });
  }, [pathname]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed left-0 top-0 h-screen w-80 max-w-[85vw] lg:w-72 glass-sidebar z-50 transition-transform duration-300 ease-in-out flex flex-col p-6",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo Section */}
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20">
              A
            </div>
            <div>
              <div className="text-xl font-bold text-on-surface tracking-tight">AI JobFit</div>
              <div className="text-[10px] font-bold text-primary uppercase tracking-widest">Next-Gen Hiring</div>
            </div>
          </div>

          {/* Mobile Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden text-on-surface-variant hover:text-error transition-colors"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {navLinks.map((link) => {
            const hasChildren = link.children && link.children.length > 0;
            const isExpanded = openSubMenus.includes(link.name);
            const isActive = pathname === link.href;
            const isChildActive = link.children?.some(child => pathname === child.href);
            const Icon = link.icon;
            const isMessages = link.name === 'Messages';

            return (
              <div key={link.name} className="flex flex-col gap-1">
                {hasChildren ? (
                  <button
                    onClick={() => toggleSubMenu(link.name)}
                    className={cn(
                      "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 w-full",
                      isChildActive || isActive
                        ? "bg-primary/10 text-primary border-l-4 border-primary"
                        : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface hover:translate-x-1"
                    )}
                  >
                    <Icon className={cn(
                      "w-5 h-5 transition-transform duration-300",
                      isChildActive || isActive ? "text-primary" : "text-on-surface-variant group-hover:text-primary"
                    )} />
                    <span className="text-sm font-semibold flex-1 text-left">{link.name}</span>
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform duration-300",
                      isExpanded ? "rotate-180" : ""
                    )} />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={cn(
                      "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:translate-x-1",
                      isActive
                        ? "bg-primary/10 text-primary shadow-sm border-l-4 border-primary"
                        : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                    )}
                  >
                    <Icon className={cn(
                      "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                      isActive ? "text-primary" : "text-on-surface-variant group-hover:text-primary"
                    )} />
                    <span className="text-sm font-semibold flex-1">{link.name}</span>

                    {isMessages && totalUnreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-error text-white text-[10px] font-black animate-pulse shadow-sm">
                        {totalUnreadCount}
                      </span>
                    )}

                    {isActive && !isMessages && <ChevronRight className="w-4 h-4 opacity-50" />}
                    {isMessages && isActive && totalUnreadCount === 0 && <ChevronRight className="w-4 h-4 opacity-50" />}
                  </Link>
                )}

                {/* Sub-menu Items */}
                {hasChildren && isExpanded && (
                  <div className="flex flex-col gap-1 ml-4 pl-4 border-l border-outline-variant/10 my-1 animate-in slide-in-from-top-2 duration-300">
                    {link.children?.map(child => {
                      const isChildActive = pathname === child.href;
                      const ChildIcon = child.icon;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => {
                            if (window.innerWidth < 1024) onClose();
                          }}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:translate-x-1",
                            isChildActive
                              ? "text-primary bg-primary/5"
                              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
                          )}
                        >
                          <ChildIcon className="w-4 h-4" />
                          <span>{child.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom AI Action */}
        <div className="mt-auto pt-6 border-t border-outline-variant/10">
          <button className="w-full gradient-button text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 group">
            <Bot className="w-5 h-5 transition-transform group-hover:rotate-12" />
            <span>Ask AI Coach</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
