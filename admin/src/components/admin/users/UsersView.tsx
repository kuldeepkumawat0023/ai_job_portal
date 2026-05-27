'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Download,
  Trash2,
  Eye,
  ShieldCheck,
  Crown,
  User,
  Mail,
  Calendar,
  ChevronDown,
  X,
  RefreshCw,
  Briefcase,
  Phone,
  MapPin,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { jsPDF } from 'jspdf';
import { useRouter } from 'next/navigation';

// Services
import { adminService } from '@/lib/services/admin.services';
import { AuthUser } from '@/lib/apiClient';

// Common Components
import PageHeader from '@/components/common/PageHeader';
import StatsCard from '@/components/common/StatsCard';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import Pagination from '@/components/common/Pagination';
import DeleteModal from '@/components/common/DeleteModal';
import Button from '@/components/common/Button';
import toast from 'react-hot-toast';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getInitials = (name?: string) => {
  if (!name) return '??';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (date?: string) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();
};

const AVATAR_GRADIENTS = [
  'from-indigo-500 to-purple-500',
  'from-pink-500 to-rose-500',
  'from-cyan-500 to-blue-500',
  'from-amber-500 to-orange-500',
  'from-emerald-500 to-teal-500',
];

const getGradient = (id?: string) => {
  if (!id) return AVATAR_GRADIENTS[0];
  return AVATAR_GRADIENTS[id.charCodeAt(id.length - 1) % AVATAR_GRADIENTS.length];
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function UsersView() {
  const router = useRouter();
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // Track broken profile photos for graceful fallback
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  // Filters & Tabs
  const [activeTab, setActiveTab] = useState('ALL USERS');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Modal States
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // ─── Fetch Users ─────────────────────────────────────────────────────────

  const fetchUsers = async () => {
    setLoading(true);
    const startTime = Date.now();
    try {
      const res = await adminService.getAllUsers();
      
      const elapsedTime = Date.now() - startTime;
      const minDelay = 2000;
      if (elapsedTime < minDelay) {
        await new Promise((resolve) => setTimeout(resolve, minDelay - elapsedTime));
      }

      if (res.success) {
        setUsers(res.data || []);
      }
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ─── Stats calculation ────────────────────────────────────────────────────

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.isActive !== false).length;
    const suspended = users.filter((u) => u.isActive === false).length;
    const premium = users.filter((u) => u.isPremium).length;

    return { total, active, suspended, premium };
  }, [users]);

  // ─── Filter & Paginated Logic ─────────────────────────────────────────────

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // 1. Status Tab Filter
      if (activeTab === 'ACTIVE' && user.isActive === false) return false;
      if (activeTab === 'SUSPENDED' && user.isActive !== false) return false;

      // 2. Role Filter Dropdown
      if (roleFilter !== 'all' && user.role !== roleFilter) return false;

      // 3. Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchName = user.fullname?.toLowerCase().includes(query);
        const matchEmail = user.email?.toLowerCase().includes(query);
        return matchName || matchEmail;
      }

      return true;
    });
  }, [users, activeTab, roleFilter, searchQuery]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const currentUsers = useMemo(() => {
    return filteredUsers.slice(
      (currentPage - 1) * usersPerPage,
      currentPage * usersPerPage
    );
  }, [filteredUsers, currentPage, usersPerPage]);

  // Reset page when tab/search/role filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, roleFilter]);

  // Tab Badge counts
  const suspendedCount = useMemo(() => users.filter((u) => u.isActive === false).length, [users]);

  // ─── Actions ──────────────────────────────────────────────────────────────

  const handleDeleteUser = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await adminService.deleteUser(deleteId);
      if (res.success) {
        setUsers((prev) => prev.filter((u) => u._id !== deleteId));
        toast.success('User deleted successfully');
      }
    } catch (err) {
      toast.error('Failed to delete user');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleSuspendUser = async (id: string) => {
    try {
      const res = await adminService.suspendUser(id);
      if (res.success) {
        toast.success('User account suspended');
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, isActive: false } : u))
        );
      }
    } catch (err) {
      toast.error('Failed to suspend user');
    }
  };

  const handleActivateUser = async (id: string) => {
    try {
      const res = await adminService.activateUser(id);
      if (res.success) {
        toast.success('User account activated');
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, isActive: true } : u))
        );
      }
    } catch (err) {
      toast.error('Failed to activate user');
    }
  };

  const handleExportCSV = () => {
    if (users.length === 0) return toast.error('No data to export');
    
    const headers = ['Full Name', 'Email', 'Mobile Number', 'Role', 'Status', 'Premium', 'Joined Date'];
    const rows = users.map(user => [
      `"${user.fullname || ''}"`,
      `"${user.email || ''}"`,
      `"${user.countryCode ? user.countryCode + ' ' : ''}${user.phoneNumber || ''}"`,
      `"${user.role || ''}"`,
      `"${user.isActive !== false ? 'Active' : 'Suspended'}"`,
      `"${user.isPremium ? 'Premium' : 'Free'}"`,
      `"${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ''}"`
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `users_export_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV downloaded successfully');
  };

  const handleExportPDF = async () => {
    if (users.length === 0) return toast.error('No data to export');
    
    const toastId = toast.loading('Generating PDF report...');
    try {
      const doc = new jsPDF('landscape', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Ensure no duplicate records by filtering unique user IDs
      const uniqueUsers = Array.from(new Map(users.map(u => [u._id, u])).values());

      // Load watermark image
      const logoImg = new window.Image();
      await new Promise((resolve) => {
        logoImg.onload = resolve;
        logoImg.onerror = resolve;
        logoImg.src = '/images/logo/logo.png';
        if (logoImg.complete) {
          resolve(true);
        }
      });

      const drawPageDecorations = (isFirstPage = false) => {
        // Draw Watermark
        if (logoImg.complete && logoImg.naturalWidth > 0) {
          doc.saveGraphicsState();
          doc.setGState(new (doc as any).GState({ opacity: 0.06 }));
          const imgWidth = 140;
          const imgHeight = (logoImg.naturalHeight / logoImg.naturalWidth) * imgWidth;
          doc.addImage(logoImg, 'PNG', (pageWidth - imgWidth) / 2, (pageHeight - imgHeight) / 2, imgWidth, imgHeight);
          doc.restoreGraphicsState();
        }

        if (isFirstPage) {
          // Draw Primary Theme Header Block
          doc.setFillColor(70, 72, 212); // Primary Color (#4648d4)
          doc.rect(0, 0, pageWidth, 26, 'F');

          // Draw Secondary Theme Accent Strip
          doc.setFillColor(129, 39, 207); // Secondary Color (#8127cf)
          doc.rect(0, 26, pageWidth, 1.5, 'F');

          // Draw Header Text
          doc.setTextColor(255, 255, 255);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(16);
          doc.text('AI JOBFIT - USER DIRECTORY AUDIT REPORT', 14, 11);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.5);
          doc.setTextColor(220, 230, 255);
          doc.text(`Generated on: ${new Date().toLocaleString()} | Total Users: ${uniqueUsers.length} | Admin Controls`, 14, 18);
        } else {
          // Minimal header for page 2+ to avoid duplicating the big colored banner
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(100, 100, 100);
          doc.text(`AI JOBFIT - USER DIRECTORY AUDIT REPORT (Page Header)`, 14, 10);
          
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text(`Total Users: ${uniqueUsers.length}`, pageWidth - 14, 10, { align: 'right' });

          doc.setDrawColor(220, 220, 230);
          doc.setLineWidth(0.3);
          doc.line(14, 12, pageWidth - 14, 12);
        }
      };

      const drawTableHeader = (currentY: number) => {
        // Draw Header Background row
        doc.setFillColor(30, 27, 75); // Dark Navy Indigo (#1e1b4b)
        doc.rect(14, currentY - 5, 269, 8, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(255, 255, 255);
        doc.text('#', 16, currentY);
        doc.text('Name', 24, currentY);
        doc.text('Email', 65, currentY);
        doc.text('Mobile', 130, currentY);
        doc.text('Role', 180, currentY);
        doc.text('Status', 208, currentY);
        doc.text('Plan', 236, currentY);
        doc.text('Joined Date', 256, currentY);
      };

      // Draw first page decorations & table headers
      drawPageDecorations(true);
      let y = 42;
      drawTableHeader(y);
      y += 8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);

      uniqueUsers.forEach((user, index) => {
        if (y > 185) {
          doc.addPage();
          drawPageDecorations(false);
          y = 22; // Start higher up on subsequent pages
          drawTableHeader(y);
          y += 8;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
        }

        const name = (user.fullname || '').substring(0, 20);
        const email = (user.email || '').substring(0, 32);
        const mobile = `${user.countryCode ? user.countryCode + ' ' : ''}${user.phoneNumber || ''}`.substring(0, 18);
        const role = (user.role || '').toUpperCase();
        const status = user.isActive !== false ? 'ACTIVE' : 'SUSPENDED';
        const plan = user.isPremium ? 'PREMIUM' : 'FREE';
        const joined = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '';

        // Draw light bottom border for row
        doc.setDrawColor(230, 230, 240);
        doc.setLineWidth(0.2);
        doc.line(14, y + 2, 283, y + 2);

        // Draw S.No. and user data
        doc.setTextColor(120, 120, 120);
        doc.text(String(index + 1), 16, y);

        doc.setTextColor(60, 60, 60);
        doc.text(name, 24, y);
        doc.text(email, 65, y);
        doc.text(mobile, 130, y);

        // Role Color: Admin Indigo, Recruiter Purple, Candidate Sky
        if (role === 'ADMIN') {
          doc.setTextColor(70, 72, 212); // Primary theme
        } else if (role === 'RECRUITER') {
          doc.setTextColor(129, 39, 207); // Secondary theme
        } else {
          doc.setTextColor(14, 165, 233); // Sky-500
        }
        doc.text(role, 180, y);

        // Status Color: Active Green, Suspended Red
        if (status === 'ACTIVE') {
          doc.setTextColor(16, 185, 129); // Emerald-500
        } else {
          doc.setTextColor(239, 68, 68); // Red-500
        }
        doc.text(status, 208, y);

        // Plan Color: Premium Gold, Free Slate
        if (plan === 'PREMIUM') {
          doc.setTextColor(245, 158, 11); // Amber-500
        } else {
          doc.setTextColor(100, 116, 139); // Slate-500
        }
        doc.text(plan, 236, y);

        // Joined Date Color
        doc.setTextColor(80, 80, 80);
        doc.text(joined, 256, y);

        y += 8;
      });

      // Add page numbers and footers at the end
      const pageCount = (doc.internal as any).getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Page ${i} of ${pageCount}`,
          pageWidth - 14,
          pageHeight - 8,
          { align: 'right' }
        );
        doc.text(
          'AI JobFit © 2026. Confidential Platform Directory Report.',
          14,
          pageHeight - 8
        );
      }

      doc.save(`users_report_${Date.now()}.pdf`);
      toast.success('PDF downloaded successfully', { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to generate PDF report', { id: toastId });
    }
  };


  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <main className="w-full space-y-10 animate-in fade-in duration-700" id="main-users-management" aria-label="User Management Dashboard">

      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight mb-2">Users Management</h1>
          <p className="text-on-surface-variant font-medium">Manage candidate, recruiter and administrative portal privileges.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Button
              variant="gradient"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="shadow-lg shadow-primary/20 hover:shadow-primary/40 text-white font-bold"
              aria-label="Export users report"
            >
              <Download className="w-4 h-4 mr-2" />
              <span>Export Data</span>
            </Button>
            
            {showExportMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowExportMenu(false)} 
                />
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-surface-container border border-outline-variant/30 shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={() => {
                      handleExportCSV();
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm font-semibold hover:bg-primary/10 text-on-surface hover:text-primary transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    Export as CSV (.csv)
                  </button>
                  <button
                    onClick={() => {
                      handleExportPDF();
                      setShowExportMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm font-semibold hover:bg-primary/10 text-on-surface hover:text-primary transition-colors border-t border-outline-variant/10 flex items-center gap-2 cursor-pointer"
                  >
                    Export as PDF (.pdf)
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Quick Stats Bento */}
      <section className="grid grid-cols-2 xl:grid-cols-4 gap-6" aria-label="User Statistics Overview">
        <StatsCard
          label="Total Users"
          value={loading ? '—' : stats.total.toLocaleString()}
          icon={Users}
          lineClass="bg-primary"
          iconBg="bg-primary/10"
          iconColor="text-primary"
          progressPercent={100}
        />
        <StatsCard
          label="Active Users"
          value={loading ? '—' : stats.active.toLocaleString()}
          icon={UserCheck}
          lineClass="bg-emerald-500"
          iconBg="bg-emerald-500/10"
          iconColor="text-emerald-500"
          progressPercent={stats.total ? Math.round((stats.active / stats.total) * 100) : 0}
          positive
        />
        <StatsCard
          label="Inactive / Suspended"
          value={loading ? '—' : stats.suspended.toLocaleString()}
          icon={UserX}
          lineClass="bg-red-500"
          iconBg="bg-red-500/10"
          iconColor="text-red-500"
          progressPercent={stats.total ? Math.round((stats.suspended / stats.total) * 100) : 0}
          positive={false}
        />
        <StatsCard
          label="Premium Members"
          value={loading ? '—' : stats.premium.toLocaleString()}
          icon={Crown}
          lineClass="bg-amber-500"
          iconBg="bg-amber-500/10"
          iconColor="text-amber-500"
          progressPercent={stats.total ? Math.round((stats.premium / stats.total) * 100) : 0}
        />
      </section>

      {/* Directory Archive Section */}
      <section aria-label="Users Profile Directory">
        <div className="bg-surface-container-low/80 backdrop-blur-md rounded-[2.5rem] border border-outline-variant/10 p-6 md:p-10 shadow-2xl space-y-8">

          {/* Header / Filter Toolbar inside directory */}
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-on-surface tracking-tight">Directory Archive</h2>
                <span className="h-4 w-1 bg-gradient-to-b from-primary to-secondary rounded-full" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 mt-1 flex items-center gap-1.5">
                <span className={cn("w-2 h-2 rounded-full bg-emerald-500", loading ? "animate-pulse" : "animate-ping")} />
                {loading ? "Syncing Directory..." : "Directory Active"}
              </p>
            </div>

            {/* Navigation Filter Tabs (Responsive: Scrollable flex row without wrapping) */}
            <div className="flex items-center overflow-x-auto flex-nowrap bg-surface-container-low/50 p-1.5 rounded-2xl border border-outline-variant/10 max-w-full no-scrollbar">
              {[
                { id: 'ALL USERS', label: 'ALL USERS', badge: null },
                { id: 'ACTIVE', label: 'ACTIVE', badge: null },
                { id: 'SUSPENDED', label: 'SUSPENDED', badge: suspendedCount }
              ].map((tab) => (
                <button
                  key={tab.id}
                  disabled={loading}
                  onClick={() => {
                    setActiveTab(tab.id);
                  }}
                  className={cn(
                    "px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer shrink-0",
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                      : "text-on-surface-variant/70 hover:text-on-surface disabled:opacity-50"
                  )}
                >
                  <span>{tab.label}</span>
                  {tab.badge !== null && tab.badge > 0 && (
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-black shrink-0",
                      activeTab === tab.id ? "bg-black/20 text-white" : "bg-red-500/20 text-red-500"
                    )}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search and Role filters */}
            <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto shrink-0">
              {/* Role Dropdown */}
              <div className="relative flex-1 xl:flex-none">
                <select
                  value={roleFilter}
                  disabled={loading}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="appearance-none w-full xl:w-44 pl-4 pr-10 py-3 bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl text-sm focus:outline-none focus:border-primary/50 text-on-surface placeholder-on-surface-variant/40 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <option value="all">ALL ROLES</option>
                  <option value="candidate">CANDIDATES</option>
                  <option value="recruiter">RECRUITERS</option>
                  <option value="admin">ADMINS</option>
                </select>
                <ChevronDown className="w-4 h-4 text-on-surface-variant/60 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Search input */}
              <div className="relative flex-1 xl:flex-none">
                <Search className="w-4 h-4 text-on-surface-variant/60 absolute left-4 top-1/2 -translate-y-1/2" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchQuery}
                  disabled={loading}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full xl:w-64 pl-10 pr-4 py-3 bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl text-sm focus:outline-none focus:border-primary/50 text-on-surface placeholder-on-surface-variant/40 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Refresh button */}
              <button
                onClick={fetchUsers}
                disabled={loading}
                className="p-3 rounded-2xl bg-surface-container-low/50 hover:bg-surface-container-high border border-outline-variant/20 text-on-surface-variant transition-all hover:scale-105 active:scale-95 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                title="Refresh Feed"
              >
                <RefreshCw className={cn("w-4.5 h-4.5", loading && "animate-spin")} />
              </button>

              {/* Clear filters shortcut */}
              {(searchQuery || roleFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setRoleFilter('all');
                  }}
                  className="p-3 text-xs font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* List / Table Wrapper using DataTable */}
          <DataTable
            columns={[
              { header: 'User' },
              { header: 'Mobile' },
              { header: 'Role' },
              { header: 'Status' },
              { header: 'Joined' },
              { header: 'Premium' },
              { header: 'Actions', className: 'text-right pr-4' },
            ]}
            isLoading={false} // Disable default spinner to show skeleton instead
            isEmpty={!loading && filteredUsers.length === 0}
            emptyTitle="No Profiles Found"
            emptyDesc={
              searchQuery || roleFilter !== 'all' || activeTab !== 'ALL USERS'
                ? 'Try adjusting your search query, status tab or role filters.'
                : 'No users have registered on the platform yet.'
            }
          >
            {loading ? (
              /* Skeleton Loader rows matching column widths */
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={`skeleton-${idx}`} className="animate-pulse border-b border-outline-variant/5 last:border-0">
                  {/* User Profile */}
                  <td className="py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-on-surface/10 shrink-0" />
                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="h-4.5 bg-on-surface/10 rounded-md w-32" />
                        <div className="h-3 bg-on-surface/5 rounded-md w-20" />
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-5">
                    <div className="h-3.5 bg-on-surface/10 rounded-md w-40" />
                  </td>

                  {/* Role */}
                  <td className="py-5">
                    <div className="h-6 bg-on-surface/10 rounded-lg w-20" />
                  </td>

                  {/* Status */}
                  <td className="py-5">
                    <div className="h-6 bg-on-surface/10 rounded-full w-24" />
                  </td>

                  {/* Joined Date */}
                  <td className="py-5">
                    <div className="h-3.5 bg-on-surface/10 rounded-md w-24" />
                  </td>

                  {/* Premium status */}
                  <td className="py-5">
                    <div className="h-5.5 bg-on-surface/10 rounded-full w-14" />
                  </td>

                  {/* Actions */}
                  <td className="py-5 text-right pr-4">
                    <div className="flex justify-end items-center gap-3">
                      <div className="w-7 h-7 bg-on-surface/10 rounded-lg" />
                      <div className="w-7 h-7 bg-on-surface/10 rounded-lg" />
                      <div className="w-7 h-7 bg-on-surface/10 rounded-lg" />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              /* User data records */
              currentUsers.map((user) => (
                <tr
                  key={user._id}
                  className="group hover:bg-surface-container-low/20 transition-all border-b border-outline-variant/5 last:border-0"
                >
                  {/* User Profile */}
                  <td className="py-5">
                    <div className="flex items-center gap-4">
                      {user.profilePhoto && !brokenImages[user._id] ? (
                        <img
                          src={user.profilePhoto}
                          alt={user.fullname}
                          onError={() => {
                            setBrokenImages(prev => ({ ...prev, [user._id]: true }));
                          }}
                          className="w-12 h-12 rounded-full object-cover shrink-0 border border-outline-variant/20 transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className={cn(
                          "w-12 h-12 rounded-full border flex items-center justify-center font-black text-base uppercase shrink-0 transition-transform group-hover:scale-105 bg-gradient-to-br text-white",
                          getGradient(user._id)
                        )}>
                          {getInitials(user.fullname)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p
                          onClick={() => router.push(`/users/${user._id}`)}
                          className="font-black text-on-surface hover:text-primary transition-colors cursor-pointer truncate text-base leading-tight mb-0.5"
                        >
                          {user.fullname || '—'}
                        </p>
                        <p className="text-xs text-on-surface-variant/60 font-semibold truncate mb-1 select-all">
                          {user.email}
                        </p>
                        <div className="flex items-center gap-1">
                          {user.isPremium && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-black text-amber-500 uppercase tracking-widest">
                              <Crown className="w-2.5 h-2.5" /> Premium
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Mobile */}
                  <td className="py-5">
                    <span className="text-xs font-semibold text-on-surface-variant/80 tracking-tight break-all">
                      {user.countryCode ? `${user.countryCode} ` : ''}{user.phoneNumber || '—'}
                    </span>
                  </td>

                  {/* Role */}
                  <td className="py-5">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border",
                      user.role === 'admin'
                        ? "bg-primary/10 text-primary border-primary/20"
                        : user.role === 'recruiter'
                          ? "bg-secondary/10 text-secondary border-secondary/20"
                          : "bg-sky-500/10 text-sky-500 border-sky-500/20"
                    )}>
                      {user.role === 'admin' ? (
                        <ShieldCheck className="w-3 h-3" />
                      ) : user.role === 'recruiter' ? (
                        <Briefcase className="w-3 h-3" />
                      ) : (
                        <User className="w-3 h-3" />
                      )}
                      {user.role}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-5">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border",
                      user.isActive !== false
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : "bg-red-500/10 text-red-500 border-red-500/20"
                    )}>
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        user.isActive !== false ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                      )} />
                      {user.isActive !== false ? 'ACTIVE' : 'SUSPENDED'}
                    </span>
                  </td>

                  {/* Joined Date */}
                  <td className="py-5">
                    <span className="text-xs font-black text-on-surface-variant/75 tracking-tight uppercase">
                      {formatDate(user.createdAt)}
                    </span>
                  </td>

                  {/* Premium */}
                  <td className="py-5">
                    {user.isPremium ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        <Crown className="w-3 h-3" /> Yes
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-on-surface-variant/60">Free Plan</span>
                    )}
                  </td>

                  {/* Actions Column (Edit Pencil removed per user request) */}
                  <td className="py-5 text-right pr-4">
                    <div className="flex justify-end items-center gap-2.5">
                      <button
                        onClick={() => router.push(`/users/${user._id}`)}
                        className="p-1.5 text-on-surface-variant/60 hover:text-primary transition-all hover:scale-110 active:scale-95 cursor-pointer"
                        title="View Profile Details"
                      >
                        <Eye className="w-4.5 h-4.5" />
                      </button>
                      {user.isActive !== false ? (
                        <button
                          onClick={() => handleSuspendUser(user._id)}
                          className="p-1.5 text-on-surface-variant/60 hover:text-orange-500 transition-all hover:scale-110 active:scale-95 cursor-pointer"
                          title="Suspend Account"
                        >
                          <UserX className="w-4.5 h-4.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivateUser(user._id)}
                          className="p-1.5 text-emerald-500 hover:text-emerald-600 transition-all hover:scale-110 active:scale-95 cursor-pointer"
                          title="Activate Account"
                        >
                          <UserCheck className="w-4.5 h-4.5" />
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteId(user._id)}
                        className="p-1.5 text-on-surface-variant/60 hover:text-red-500 transition-all hover:scale-110 active:scale-95 cursor-pointer"
                        title="Permanently Delete"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </DataTable>

          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <div className="pt-4 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteUser}
        isLoading={deleting}
        title="Delete User Account"
        message="Are you sure you want to permanently delete this user account? All associated profile documents, applications, and activity history will be deleted. This action cannot be undone."
        confirmText="Permanently Delete"
      />
    </main>
  );
}
