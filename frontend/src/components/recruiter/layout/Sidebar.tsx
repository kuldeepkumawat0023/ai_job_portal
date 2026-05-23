'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  MessageSquare,
  Calendar,
  Star,
  BarChart3,
  Settings,
  ChevronDown,
  Plus,
  X,
  Building2,
  User,
  Bell,
  Lock,
  CreditCard,
  Globe,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/common/Button';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useAuth } from '@/hooks/useAuth';
import { companyService } from '@/lib/services/company.services';
import { toast } from 'react-hot-toast';

interface NavLink {
  name: string;
  href: string;
  icon: any;
  children?: NavLink[];
}

const recruiterNavLinks: NavLink[] = [
  { name: 'Dashboard', href: '/recruiter/dashboard', icon: LayoutDashboard },
  {
    name: 'Job Management',
    href: '/recruiter/job-board',
    icon: Briefcase,
    children: [
      { name: 'Active Jobs', href: '/recruiter/job-board', icon: Briefcase },
      { name: 'Post New Job', href: '/recruiter/job-board/new', icon: Plus },
    ]
  },
  { name: 'Applications', href: '/recruiter/applications', icon: Users },
  { name: 'Messages', href: '/recruiter/messages', icon: MessageSquare },
  { name: 'Interviews', href: '/recruiter/interviews', icon: Calendar },
  { name: 'Feedback', href: '/recruiter/feedback', icon: Star },
  { name: 'Analytics', href: '/recruiter/analytics', icon: BarChart3 },
  {
    name: 'Settings',
    href: '/recruiter/settings',
    icon: Settings,
    children: [
      { name: 'Company Profile', href: '/recruiter/settings/profile', icon: Building2 },
      { name: 'Team Management', href: '/recruiter/settings', icon: Users },
      { name: 'Personal Profile', href: '/recruiter/settings/personal', icon: User },
      { name: 'Notifications', href: '/recruiter/settings/notifications', icon: Bell },
      { name: 'Billing & Plan', href: '/recruiter/settings/billing', icon: CreditCard },
      { name: 'Security', href: '/recruiter/settings/security', icon: Lock },
    ]
  },
];

const isLinkActive = (href: string, pathname: string, siblings: NavLink[] = []) => {
  if (pathname === href) return true;
  if (href === '/candidate/dashboard' || href === '/recruiter/dashboard') return false;

  if (pathname.startsWith(href)) {
    const hasBetterSiblingMatch = siblings.some(sib =>
      sib.href !== href &&
      pathname.startsWith(sib.href) &&
      sib.href.length > href.length
    );
    return !hasBetterSiblingMatch;
  }
  return false;
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [openSubMenus, setOpenSubMenus] = React.useState<string[]>([]);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = React.useState(false);
  const [companies, setCompanies] = React.useState<any[]>([]);
  const [activeCompany, setActiveCompany] = React.useState<any>(null);
  const [isSwitching, setIsSwitching] = React.useState(false);

  const { user, updateUser } = useAuth();
  const { conversations } = useSelector((state: RootState) => state.chat);
  const totalUnreadCount = conversations.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0);

  // Fetch companies on mount
  React.useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await companyService.getCompanies();
        if (response.success && response.data) {
          setCompanies(response.data);
          if (response.data.length > 0) {
            const active = response.data.find((c: any) => c._id === user?.companyId) || response.data[0];
            setActiveCompany(active);
          }
        }
      } catch (err) {
        console.error('Error fetching companies in sidebar:', err);
      }
    };
    if (user) fetchCompanies();
  }, [user, user?.companyId]);

  const handleSwitchCompany = async (company: any) => {
    if (company._id === activeCompany?._id) {
      setIsCompanyDropdownOpen(false);
      return;
    }
    try {
      setIsSwitching(true);
      const response = await companyService.switchCompany(company._id);
      if (response.success && response.data) {
        toast.success(`Switched to ${company.name}`);
        setActiveCompany(company);
        updateUser({ companyId: company._id });
        setIsCompanyDropdownOpen(false);
        window.location.href = '/recruiter/dashboard';
      } else {
        toast.error('Failed to switch workspace');
      }
    } catch {
      toast.error('Failed to switch workspace');
    } finally {
      setIsSwitching(false);
    }
  };

  const toggleSubMenu = (name: string) => {
    setOpenSubMenus(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  // Automatically open sub-menu if child route is active
  React.useEffect(() => {
    recruiterNavLinks.forEach(item => {
      if (item.children?.some(child => pathname === child.href)) {
        setOpenSubMenus(prev => prev.includes(item.name) ? prev : [...prev, item.name]);
      }
    });
  }, [pathname]);

  const companyName = activeCompany?.name || 'My Company';

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

        {/* Header: Brand + Close */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-white shadow-lg shadow-primary/20 shrink-0">
              {activeCompany?.logo ? (
                <img src={activeCompany.logo} alt={companyName} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <span className="text-sm font-black">{companyName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-black text-on-surface tracking-tight truncate max-w-[140px]">{companyName}</div>
              <div className="text-[9px] font-bold text-primary uppercase tracking-widest">Recruiter Portal</div>
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

        {/* Company Switcher Dropdown */}
        {companies.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
              disabled={isSwitching}
              className={cn(
                "w-full flex items-center justify-between gap-3 px-4 py-3 bg-surface-container-low border border-outline-variant/10 rounded-xl hover:bg-surface-container-high transition-all disabled:opacity-50 cursor-pointer",
                isCompanyDropdownOpen ? "ring-2 ring-primary/20 border-primary/30" : ""
              )}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  {activeCompany?.logo ? (
                    <img src={activeCompany.logo} alt={companyName} className="w-full h-full object-cover rounded-md" />
                  ) : (
                    <Building2 size={14} />
                  )}
                </div>
                <span className="text-sm font-bold truncate text-on-surface">{companyName}</span>
              </div>
              <ChevronDown
                size={16}
                className={cn(
                  "text-on-surface-variant transition-transform duration-300 shrink-0",
                  isCompanyDropdownOpen ? "rotate-180" : ""
                )}
              />
            </button>

            {/* Dropdown Panel */}
            <div className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              isCompanyDropdownOpen ? "max-h-72 opacity-100 mt-2" : "max-h-0 opacity-0"
            )}>
              <div className="py-2 bg-surface-container-high/60 border border-outline-variant/10 rounded-xl space-y-0.5 overflow-y-auto max-h-64">
                <div className="px-4 py-2 border-b border-outline-variant/10">
                  <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Switch Workspace</p>
                </div>

                {companies.map((company: any) => (
                  <button
                    key={company._id}
                    onClick={() => handleSwitchCompany(company)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer",
                      company._id === activeCompany?._id
                        ? "text-primary bg-primary/5"
                        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
                    )}
                  >
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0 overflow-hidden">
                      {company.logo ? (
                        <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] font-black text-primary">{company.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <span className="text-sm font-medium truncate flex-1">{company.name}</span>
                    {company._id === activeCompany?._id && (
                      <CheckCircle2 size={14} className="text-primary shrink-0" />
                    )}
                  </button>
                ))}

                {/* Add New Company */}
                <div className="px-2 pt-1.5 mt-1 border-t border-outline-variant/10">
                  <Link
                    href="/recruiter/settings/profile"
                    onClick={() => {
                      setIsCompanyDropdownOpen(false);
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left text-primary hover:bg-primary/5 transition-colors rounded-lg group cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                      <Plus size={14} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest truncate">Add Company</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {recruiterNavLinks.map((link) => {
            const hasChildren = link.children && link.children.length > 0;
            const isExpanded = openSubMenus.includes(link.name);
            const isActive = isLinkActive(link.href, pathname, recruiterNavLinks);
            const isChildActive = link.children?.some(child => isLinkActive(child.href, pathname, link.children));
            const Icon = link.icon;
            const isMessages = link.name === 'Messages';

            return (
              <div key={link.name} className="flex flex-col gap-1">
                {hasChildren ? (
                  <button
                    onClick={() => {
                      toggleSubMenu(link.name);
                      router.push(link.href);
                    }}
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
                  </Link>
                )}

                {/* Sub-menu Items */}
                {hasChildren && isExpanded && (
                  <div className="flex flex-col gap-1 ml-4 pl-4 border-l border-outline-variant/10 my-1 animate-in slide-in-from-top-2 duration-300">
                    {link.children?.map(child => {
                      const isChildActive = isLinkActive(child.href, pathname, link.children);
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
      </aside>
    </>
  );
};

export default Sidebar;
