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

  const handleExportPDF = () => {
    if (users.length === 0) return toast.error('No data to export');
    
    const toastId = toast.loading('Generating PDF...');
    try {
      const doc = new jsPDF('landscape');
      
      doc.setFontSize(18);
      doc.text('AI JobFit - User Directory Report', 14, 22);
      
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
      
      let y = 45;
      doc.setFontSize(10);
      doc.setTextColor(50);
      doc.setFont('helvetica', 'bold');
      doc.text('Name', 14, y);
      doc.text('Email', 55, y);
      doc.text('Mobile', 125, y);
      doc.text('Role', 170, y);
      doc.text('Status', 195, y);
      doc.text('Plan', 225, y);
      doc.text('Joined', 250, y);
      
      doc.line(14, y + 2, 283, y + 2);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80);
      
      users.forEach((user) => {
        if (y > 180) {
          doc.addPage();
          y = 20;
          doc.setFont('helvetica', 'bold');
          doc.text('Name', 14, y);
          doc.text('Email', 55, y);
          doc.text('Mobile', 125, y);
          doc.text('Role', 170, y);
          doc.text('Status', 195, y);
          doc.text('Plan', 225, y);
          doc.text('Joined', 250, y);
          doc.line(14, y + 2, 283, y + 2);
          doc.setFont('helvetica', 'normal');
        }
        
        y += 8;
        const name = (user.fullname || '').substring(0, 20);
        const email = (user.email || '').substring(0, 32);
        const mobile = `${user.countryCode ? user.countryCode + ' ' : ''}${user.phoneNumber || ''}`.substring(0, 18);
        const role = (user.role || '').toUpperCase();
        const status = user.isActive !== false ? 'ACTIVE' : 'SUSPENDED';
        const plan = user.isPremium ? 'PREMIUM' : 'FREE';
        const joined = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '';
        
        doc.text(name, 14, y);
        doc.text(email, 55, y);
        doc.text(mobile, 125, y);
        doc.text(role, 170, y);
        doc.text(status, 195, y);
        doc.text(plan, 225, y);
        doc.text(joined, 250, y);
      });
      
      doc.save(`users_report_${Date.now()}.pdf`);
      toast.success('PDF downloaded successfully', { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to generate PDF. Make sure "jspdf" is installed: npm install jspdf', { id: toastId });
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
