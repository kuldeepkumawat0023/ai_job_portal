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
  Edit3,
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
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Filters & Tabs
  const [activeTab, setActiveTab] = useState('ALL USERS');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Modal States
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewingUser, setViewingUser] = useState<AuthUser | null>(null);
  const [editingUser, setEditingUser] = useState<AuthUser | null>(null);

  // Edit Form Fields
  const [editRole, setEditRole] = useState<'candidate' | 'recruiter' | 'admin'>('candidate');
  const [editPremium, setEditPremium] = useState(false);

  // ─── Fetch Users ─────────────────────────────────────────────────────────

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllUsers();
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
      if (activeTab === 'DEACTIVATED' && user.isActive !== false) return false; // In this setup, deactivated shares same inactive state

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
        // Sync active views if open
        if (viewingUser?._id === id) setViewingUser((prev) => prev ? { ...prev, isActive: false } : null);
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
        // Sync active views if open
        if (viewingUser?._id === id) setViewingUser((prev) => prev ? { ...prev, isActive: true } : null);
      }
    } catch (err) {
      toast.error('Failed to activate user');
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    setUpdating(true);
    try {
      const payload = {
        role: editRole,
        isPremium: editPremium,
      };
      const res = await adminService.updateUser(editingUser._id, payload);
      if (res.success) {
        toast.success('User profile updated successfully');
        setUsers((prev) =>
          prev.map((u) => (u._id === editingUser._id ? { ...u, ...payload } : u))
        );
        setEditingUser(null);
      }
    } catch (err) {
      toast.error('Failed to update user profile');
    } finally {
      setUpdating(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <main className="w-full space-y-10 animate-in fade-in duration-700" id="main-users-management" aria-label="User Management Dashboard">

      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight mb-2">Users Management</h1>
          <p className="text-on-surface-variant font-medium">Manage candidate, recruiter and administrative portal profiles and privileges.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={fetchUsers}
            disabled={loading}
            className="flex items-center gap-2 border-outline-variant/30 hover:bg-surface-container-low"
            aria-label="Refresh users list"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            <span>Refresh Feed</span>
          </Button>
          <Button
            variant="gradient"
            className="shadow-lg shadow-primary/20 hover:shadow-primary/40 text-white font-bold"
            aria-label="Export users report"
          >
            <Download className="w-4 h-4 mr-2" />
            <span>Export Data</span>
          </Button>
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

            {/* Navigation Filter Tabs */}
            <div className="flex flex-wrap items-center bg-surface-container-low/50 p-1.5 rounded-2xl border border-outline-variant/10">
              {[
                { id: 'ALL USERS', label: 'ALL USERS', badge: null },
                { id: 'ACTIVE', label: 'ACTIVE', badge: null },
                { id: 'SUSPENDED', label: 'SUSPENDED', badge: suspendedCount },
                { id: 'DEACTIVATED', label: 'DEACTIVATED', badge: null }
              ].map((tab) => (
                <button
                  key={tab.id}
                  disabled={loading}
                  onClick={() => {
                    setActiveTab(tab.id);
                  }}
                  className={cn(
                    "px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer",
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
                  placeholder="Search name or email..."
                  value={searchQuery}
                  disabled={loading}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full xl:w-64 pl-10 pr-4 py-3 bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl text-sm focus:outline-none focus:border-primary/50 text-on-surface placeholder-on-surface-variant/40 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

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
              { header: 'Email' },
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
                      <div className={cn(
                        "w-12 h-12 rounded-full border flex items-center justify-center font-black text-base uppercase shrink-0 transition-transform group-hover:scale-105 bg-gradient-to-br text-white",
                        getGradient(user._id)
                      )}>
                        {getInitials(user.fullname)}
                      </div>
                      <div className="min-w-0">
                        <p
                          onClick={() => setViewingUser(user)}
                          className="font-black text-on-surface hover:text-primary transition-colors cursor-pointer truncate text-base leading-tight mb-0.5"
                        >
                          {user.fullname || '—'}
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

                  {/* Email */}
                  <td className="py-5">
                    <span className="text-xs font-semibold text-on-surface-variant/80 tracking-tight break-all">
                      {user.email}
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
                        : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
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

                  {/* Actions Column */}
                  <td className="py-5 text-right pr-4">
                    <div className="flex justify-end items-center gap-2.5">
                      <button
                        onClick={() => setViewingUser(user)}
                        className="p-1.5 text-on-surface-variant/60 hover:text-primary transition-all hover:scale-110 active:scale-95 cursor-pointer"
                        title="View Profile Details"
                      >
                        <Eye className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingUser(user);
                          setEditRole(user.role);
                          setEditPremium(!!user.isPremium);
                        }}
                        className="p-1.5 text-on-surface-variant/60 hover:text-secondary transition-all hover:scale-110 active:scale-95 cursor-pointer"
                        title="Edit Role & Plan"
                      >
                        <Edit3 className="w-4.5 h-4.5" />
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

      {/* ── User Detail View Modal ── */}
      {viewingUser && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 md:p-8">
          {/* Backdrop */}
          <div
            onClick={() => setViewingUser(null)}
            className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm transition-opacity duration-300"
          />

          {/* Container */}
          <div className="relative w-full max-w-2xl bg-card border border-outline-variant/30 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent pointer-events-none" />
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-outline-variant/10">
              <h3 className="text-xl font-black text-on-surface flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" /> User Details
              </h3>
              <button
                onClick={() => setViewingUser(null)}
                className="p-1.5 rounded-xl text-on-surface-variant/60 hover:text-on-surface hover:bg-surface-container-low dark:hover:bg-zinc-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-outline-variant/10">
                <div className={cn(
                  "w-20 h-20 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-3xl font-black shadow-lg shrink-0",
                  getGradient(viewingUser._id)
                )}>
                  {getInitials(viewingUser.fullname)}
                </div>
                <div className="text-center sm:text-left space-y-2">
                  <h4 className="text-2xl font-black text-on-surface">{viewingUser.fullname || '—'}</h4>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border",
                      viewingUser.role === 'admin'
                        ? "bg-primary/10 text-primary border-primary/20"
                        : viewingUser.role === 'recruiter'
                        ? "bg-secondary/10 text-secondary border-secondary/20"
                        : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
                    )}>
                      {viewingUser.role === 'admin' ? (
                        <ShieldCheck className="w-3 h-3" />
                      ) : viewingUser.role === 'recruiter' ? (
                        <Briefcase className="w-3 h-3" />
                      ) : (
                        <User className="w-3 h-3" />
                      )}
                      {viewingUser.role}
                    </span>
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border",
                      viewingUser.isActive !== false
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : "bg-red-500/10 text-red-500 border-red-500/20"
                    )}>
                      {viewingUser.isActive !== false ? 'ACTIVE' : 'SUSPENDED'}
                    </span>
                    {viewingUser.isPremium && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        <Crown className="w-2.5 h-2.5" /> Premium
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-4.5 h-4.5 text-on-surface-variant/60 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant/50">Email Address</p>
                      <p className="text-sm font-bold text-on-surface break-all">{viewingUser.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-4.5 h-4.5 text-on-surface-variant/60 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant/50">Phone Number</p>
                      <p className="text-sm font-bold text-on-surface">
                        {viewingUser.countryCode ? `${viewingUser.countryCode} ` : ''}{viewingUser.phoneNumber || '—'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4.5 h-4.5 text-on-surface-variant/60 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant/50">Location</p>
                      <p className="text-sm font-bold text-on-surface">{viewingUser.location || 'Remote'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4.5 h-4.5 text-on-surface-variant/60 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant/50">Joined Date</p>
                      <p className="text-sm font-bold text-on-surface">{formatDate(viewingUser.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <RefreshCw className="w-4.5 h-4.5 text-on-surface-variant/60 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant/50">Last Updated</p>
                      <p className="text-sm font-bold text-on-surface">{formatDate(viewingUser.updatedAt)}</p>
                    </div>
                  </div>
                  {viewingUser.role === 'recruiter' && (
                    <div className="flex items-start gap-3">
                      <Briefcase className="w-4.5 h-4.5 text-on-surface-variant/60 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant/50">Department / Job Role</p>
                        <p className="text-sm font-bold text-on-surface">
                          {viewingUser.department || 'Talent Acquisition'} — {viewingUser.jobRole || 'Recruiter'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              {viewingUser.bio && (
                <div className="p-4 rounded-2xl bg-surface-container-low/50 border border-outline-variant/10">
                  <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant/50 mb-1.5">Biography</p>
                  <p className="text-sm text-on-surface leading-relaxed">{viewingUser.bio}</p>
                </div>
              )}

              {/* Skills */}
              {viewingUser.skills && viewingUser.skills.length > 0 && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant/50 mb-2.5">Key Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {viewingUser.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 bg-surface-container-high/50 border border-outline-variant/10 text-xs font-semibold text-on-surface rounded-lg uppercase tracking-tight"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-outline-variant/10 bg-surface-container-low/50">
              <Button variant="outline" size="md" onClick={() => setViewingUser(null)}>
                Close Details
              </Button>
              {viewingUser.isActive !== false ? (
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    handleSuspendUser(viewingUser._id);
                  }}
                  className="text-orange-500 border-orange-500/20 hover:bg-orange-500/5"
                >
                  Suspend Account
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    handleActivateUser(viewingUser._id);
                  }}
                  className="text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/5"
                >
                  Activate Account
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── User Edit Modal ── */}
      {editingUser && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 md:p-8">
          {/* Backdrop */}
          <div
            onClick={() => setEditingUser(null)}
            className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm transition-opacity duration-300"
          />

          {/* Modal Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateUser();
            }}
            className="relative w-full max-w-lg bg-card border border-outline-variant/30 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-outline-variant/10">
              <h3 className="text-xl font-black text-on-surface flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-secondary" /> Edit User Role & Plan
              </h3>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-1.5 rounded-xl text-on-surface-variant/60 hover:text-on-surface hover:bg-surface-container-low dark:hover:bg-zinc-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Profile card summary (Read Only) */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low/50 border border-outline-variant/10">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-sm uppercase shrink-0",
                  getGradient(editingUser._id)
                )}>
                  {getInitials(editingUser.fullname)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-on-surface truncate leading-tight mb-0.5">{editingUser.fullname}</p>
                  <p className="text-xs text-on-surface-variant/75 truncate">{editingUser.email}</p>
                </div>
              </div>

              {/* Role Selection Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  User Role / Privilege
                </label>
                <div className="relative">
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as any)}
                    className="w-full appearance-none pl-4 pr-10 py-3 text-sm rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary transition-colors cursor-pointer font-semibold"
                  >
                    <option value="candidate">CANDIDATE</option>
                    <option value="recruiter">RECRUITER</option>
                    <option value="admin">ADMINISTRATOR (ADMIN)</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" aria-hidden="true" />
                </div>
              </div>

              {/* Premium membership toggle slider */}
              <div className="flex items-center justify-between p-4 rounded-2xl border border-outline-variant/10 bg-surface-container-low/30">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <Crown className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Premium Membership</p>
                    <p className="text-xs text-on-surface-variant/75">Grant premium access privileges</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditPremium(!editPremium)}
                  className={cn(
                    "relative inline-flex h-6.5 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                    editPremium ? "bg-amber-500" : "bg-outline-variant/30"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-5.5 w-5.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      editPremium ? "translate-x-5.5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-outline-variant/10 bg-surface-container-low/50">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setEditingUser(null)}
                disabled={updating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gradient"
                size="md"
                isLoading={updating}
                className="text-white font-bold"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      )}

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
