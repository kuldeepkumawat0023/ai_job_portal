'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  Briefcase,
  User,
  Mail,
  Search,
  RefreshCw,
  ChevronDown,
  X,
  Send,
  Eye,
  Pencil,
  Trash2,
  Crown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';

// Common Components — same as UsersView pattern
import StatsCard from '@/components/common/StatsCard';
import DataTable from '@/components/common/DataTable';
import DeleteModal from '@/components/common/DeleteModal';
import Button from '@/components/common/Button';
import Pagination from '@/components/common/Pagination';

import { userService } from '@/lib/services/user.services';
import toast from 'react-hot-toast';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getInitials = (name?: string) => {
  if (!name) return '??';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};

const formatDate = (date?: string) => {
  if (!date) return '—';
  return new Date(date)
    .toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    .toUpperCase();
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

// ─── Invite Modal ─────────────────────────────────────────────────────────────

interface InviteModalProps {
  onClose: () => void;
  onSuccess: (newMember: any) => void;
}

function InviteModal({ onClose, onSuccess }: InviteModalProps) {
  const [form, setForm] = useState({ name: '', email: '', role: 'recruiter' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      return toast.error('Name and email are required');
    }
    setLoading(true);
    try {
      const res = await userService.inviteTeamMember({
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
      });
      if (res.success) {
        toast.success(`${form.name} invited successfully!`);
        onSuccess(res.data);
        onClose();
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to invite member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-lg bg-card border border-outline-variant/30 rounded-3xl shadow-2xl z-10 overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary" />

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-black text-on-surface">Invite Team Member</h3>
              <p className="text-xs text-on-surface-variant/60 font-medium">
                Add a new admin or recruiter
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-on-surface-variant/60 hover:text-on-surface hover:bg-surface-container-low transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-on-surface-variant/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl text-sm focus:outline-none focus:border-primary/50 text-on-surface placeholder-on-surface-variant/30 transition-all font-medium"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-on-surface-variant/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="e.g. rahul@company.com"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl text-sm focus:outline-none focus:border-primary/50 text-on-surface placeholder-on-surface-variant/30 transition-all font-medium"
                required
              />
            </div>
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">
              Assign Role
            </label>
            <div className="relative">
              <ShieldCheck className="w-4 h-4 text-on-surface-variant/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={form.role}
                onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                className="w-full pl-10 pr-10 py-3 bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl text-sm focus:outline-none focus:border-primary/50 text-on-surface transition-all font-medium appearance-none cursor-pointer"
              >
                <option value="recruiter">Recruiter</option>
                <option value="admin">Super Admin</option>
              </select>
              <ChevronDown className="w-4 h-4 text-on-surface-variant/40 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" size="md" type="button" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="gradient"
              size="md"
              type="submit"
              isLoading={loading}
              className="flex-1 font-black"
            >
              {!loading && <Send className="w-4 h-4 mr-2" />}
              Send Invite
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TeamView() {
  const router = useRouter();

  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [removeId, setRemoveId] = useState<string | null>(null);
  const [removing, setRemoving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 10;
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  // ─── Fetch ──────────────────────────────────────────────────────────────────

  const fetchTeam = async () => {
    setLoading(true);
    const startTime = Date.now();
    try {
      const res = await userService.getTeamMembers();
      const elapsed = Date.now() - startTime;
      if (elapsed < 2000) await new Promise((r) => setTimeout(r, 2000 - elapsed));
      if (res.success) setMembers(res.data || []);
    } catch (err) {
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTeam(); }, []);

  // ─── Stats ──────────────────────────────────────────────────────────────────

  const stats = useMemo(() => ({
    total: members.length,
    admins: members.filter((m) => m.role === 'admin').length,
    recruiters: members.filter((m) => m.role === 'recruiter').length,
  }), [members]);

  // ─── Filter + Pagination ────────────────────────────────────────────────────

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      if (roleFilter !== 'all' && m.role !== roleFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return m.fullname?.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q);
      }
      return true;
    });
  }, [members, roleFilter, searchQuery]);

  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);
  const currentMembers = useMemo(() =>
    filteredMembers.slice((currentPage - 1) * membersPerPage, currentPage * membersPerPage),
    [filteredMembers, currentPage]
  );

  useEffect(() => { setCurrentPage(1); }, [searchQuery, roleFilter]);

  // ─── Remove ─────────────────────────────────────────────────────────────────

  const handleRemove = async () => {
    if (!removeId) return;
    setRemoving(true);
    try {
      const res = await userService.removeTeamMember(removeId);
      if (res.success) {
        setMembers((prev) => prev.filter((m) => m._id !== removeId));
        toast.success('Team member removed successfully');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to remove member');
    } finally {
      setRemoving(false);
      setRemoveId(null);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <main
      className="w-full space-y-10 animate-in fade-in duration-700"
      id="main-team-management"
      aria-label="Team Management Dashboard"
    >
      {/* ── Page Header ── */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight mb-2">Team Management</h1>
          <p className="text-on-surface-variant font-medium">
            Manage administrators, assign roles, and invite new members to the platform.
          </p>
        </div>
        <Button
          variant="gradient"
          onClick={() => setShowInviteModal(true)}
          className="shadow-lg shadow-primary/20 hover:shadow-primary/40 text-white font-black"
          aria-label="Invite team member"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </header>

      {/* ── Stats Cards — using StatsCard component ── */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6" aria-label="Team Statistics Overview">
        <StatsCard
          label="Total Members"
          value={loading ? '—' : stats.total.toLocaleString()}
          icon={Users}
          lineClass="bg-primary"
          iconBg="bg-primary/10"
          iconColor="text-primary"
          progressPercent={100}
        />
        <StatsCard
          label="Super Admins"
          value={loading ? '—' : stats.admins.toLocaleString()}
          icon={ShieldCheck}
          lineClass="bg-indigo-500"
          iconBg="bg-indigo-500/10"
          iconColor="text-indigo-500"
          progressPercent={stats.total ? Math.round((stats.admins / stats.total) * 100) : 0}
        />
        <StatsCard
          label="Recruiters"
          value={loading ? '—' : stats.recruiters.toLocaleString()}
          icon={Briefcase}
          lineClass="bg-secondary"
          iconBg="bg-secondary/10"
          iconColor="text-secondary"
          progressPercent={stats.total ? Math.round((stats.recruiters / stats.total) * 100) : 0}
        />
      </section>

      {/* ── Team Directory ── */}
      <section aria-label="Team Members Directory">
        <div className="bg-surface-container-low/80 backdrop-blur-md rounded-[2.5rem] border border-outline-variant/10 p-6 md:p-10 shadow-2xl space-y-8">

          {/* Toolbar */}
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-on-surface tracking-tight">Active Members</h2>
                <span className="h-4 w-1 bg-gradient-to-b from-primary to-secondary rounded-full" />
                {!loading && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                    {filteredMembers.length} {roleFilter === 'all' ? 'TOTAL' : roleFilter.toUpperCase()}
                  </span>
                )}
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 mt-1 flex items-center gap-1.5">
                <span className={cn('w-2 h-2 rounded-full bg-emerald-500', loading ? 'animate-pulse' : 'animate-ping')} />
                {loading ? 'Syncing Team...' : 'Directory Active'}
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto shrink-0">
              {/* Role filter */}
              <div className="relative flex-1 xl:flex-none">
                <select
                  value={roleFilter}
                  disabled={loading}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="appearance-none w-full xl:w-44 pl-4 pr-10 py-3 bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl text-sm focus:outline-none focus:border-primary/50 text-on-surface transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <option value="all">ALL ROLES</option>
                  <option value="admin">SUPER ADMINS</option>
                  <option value="recruiter">RECRUITERS</option>
                </select>
                <ChevronDown className="w-4 h-4 text-on-surface-variant/60 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Search */}
              <div className="relative flex-1 xl:flex-none">
                <Search className="w-4 h-4 text-on-surface-variant/60 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchQuery}
                  disabled={loading}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full xl:w-64 pl-10 pr-4 py-3 bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl text-sm focus:outline-none focus:border-primary/50 text-on-surface placeholder-on-surface-variant/40 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Refresh */}
              <button
                onClick={fetchTeam}
                disabled={loading}
                className="p-3 rounded-2xl bg-surface-container-low/50 hover:bg-surface-container-high border border-outline-variant/20 text-on-surface-variant transition-all hover:scale-105 active:scale-95 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                title="Refresh Team"
              >
                <RefreshCw className={cn('w-4.5 h-4.5', loading && 'animate-spin')} />
              </button>

              {/* Clear filters */}
              {(searchQuery || roleFilter !== 'all') && (
                <button
                  onClick={() => { setSearchQuery(''); setRoleFilter('all'); }}
                  className="p-3 text-xs font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* ── DataTable — using DataTable component ── */}
          <DataTable
            columns={[
              { header: 'Member' },
              { header: 'Role' },
              { header: 'Status' },
              { header: 'Joined' },
              { header: 'Actions', className: 'text-right pr-4' },
            ]}
            isLoading={false}
            isEmpty={!loading && filteredMembers.length === 0}
            emptyTitle="No Team Members Found"
            emptyDesc={
              searchQuery || roleFilter !== 'all'
                ? 'Try adjusting your search or role filter.'
                : 'Invite your first team member using the button above.'
            }
          >
            {loading ? (
              // Skeleton rows
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={`sk-${idx}`} className="animate-pulse border-b border-outline-variant/5 last:border-0">
                  {/* Member */}
                  <td className="py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-on-surface/10 shrink-0" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4.5 bg-on-surface/10 rounded-md w-32" />
                        <div className="h-3 bg-on-surface/5 rounded-md w-44" />
                      </div>
                    </div>
                  </td>
                  <td className="py-5"><div className="h-6 bg-on-surface/10 rounded-lg w-20" /></td>
                  <td className="py-5"><div className="h-6 bg-on-surface/10 rounded-full w-24" /></td>
                  <td className="py-5"><div className="h-3.5 bg-on-surface/10 rounded-md w-24" /></td>
                  <td className="py-5 text-right pr-4">
                    <div className="flex justify-end gap-2.5">
                      <div className="w-7 h-7 bg-on-surface/10 rounded-lg" />
                      <div className="w-7 h-7 bg-on-surface/10 rounded-lg" />
                      <div className="w-7 h-7 bg-on-surface/10 rounded-lg" />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              currentMembers.map((member) => (
                <tr
                  key={member._id}
                  className="group hover:bg-surface-container-low/20 transition-all border-b border-outline-variant/5 last:border-0"
                >
                  {/* Member column */}
                  <td className="py-5">
                    <div className="flex items-center gap-4">
                      {member.profilePhoto && !brokenImages[member._id] ? (
                        <img
                          src={member.profilePhoto}
                          alt={member.fullname}
                          onError={() => setBrokenImages((p) => ({ ...p, [member._id]: true }))}
                          className="w-12 h-12 rounded-full object-cover shrink-0 border border-outline-variant/20 transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className={cn(
                          'w-12 h-12 rounded-full border flex items-center justify-center font-black text-base uppercase shrink-0 transition-transform group-hover:scale-105 bg-gradient-to-br text-white',
                          getGradient(member._id)
                        )}>
                          {getInitials(member.fullname)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-black text-on-surface truncate text-base leading-tight mb-0.5">
                          {member.fullname || '—'}
                        </p>
                        <p className="text-xs text-on-surface-variant/60 font-semibold truncate select-all">
                          {member.email}
                        </p>
                        {member.isMock && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-black text-amber-500 uppercase tracking-widest">
                            <Crown className="w-2.5 h-2.5" /> Sample
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Role badge */}
                  <td className="py-5">
                    <span className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border',
                      member.role === 'admin'
                        ? 'bg-primary/10 text-primary border-primary/20'
                        : member.role === 'recruiter'
                          ? 'bg-secondary/10 text-secondary border-secondary/20'
                          : 'bg-sky-500/10 text-sky-500 border-sky-500/20'
                    )}>
                      {member.role === 'admin' ? (
                        <ShieldCheck className="w-3 h-3" />
                      ) : member.role === 'recruiter' ? (
                        <Briefcase className="w-3 h-3" />
                      ) : (
                        <User className="w-3 h-3" />
                      )}
                      {member.role === 'admin' ? 'Super Admin' : (member.role || 'recruiter')}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-5">
                    <span className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border',
                      member.isActive !== false
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : 'bg-red-500/10 text-red-500 border-red-500/20'
                    )}>
                      <span className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        member.isActive !== false ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                      )} />
                      {member.isActive !== false ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>

                  {/* Joined date */}
                  <td className="py-5">
                    <span className="text-xs font-black text-on-surface-variant/75 tracking-tight uppercase">
                      {formatDate(member.createdAt)}
                    </span>
                  </td>

                  {/* Actions — View, Edit, Remove */}
                  <td className="py-5 text-right pr-4">
                    <div className="flex justify-end items-center gap-2.5">
                      {/* View */}
                      <button
                        onClick={() => router.push(`/team/${member._id}`)}
                        className="p-1.5 text-on-surface-variant/60 hover:text-primary transition-all hover:scale-110 active:scale-95 cursor-pointer"
                        title="View Member Details"
                      >
                        <Eye className="w-4.5 h-4.5" />
                      </button>

                      {/* Edit — hidden for mock members */}
                      {!member.isMock && (
                        <button
                          onClick={() => router.push(`/team/${member._id}/edit`)}
                          className="p-1.5 text-on-surface-variant/60 hover:text-amber-500 transition-all hover:scale-110 active:scale-95 cursor-pointer"
                          title="Edit Member Role"
                        >
                          <Pencil className="w-4.5 h-4.5" />
                        </button>
                      )}

                      {/* Remove */}
                      <button
                        onClick={() => setRemoveId(member._id)}
                        className="p-1.5 text-on-surface-variant/60 hover:text-red-500 transition-all hover:scale-110 active:scale-95 cursor-pointer"
                        title="Remove Member"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </DataTable>

          {/* ── Pagination — using Pagination component ── */}
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

      {/* ── Delete Confirmation — using DeleteModal component ── */}
      <DeleteModal
        isOpen={!!removeId}
        onClose={() => setRemoveId(null)}
        onConfirm={handleRemove}
        isLoading={removing}
        title="Remove Team Member"
        message="Are you sure you want to remove this team member? They will lose all admin/recruiter access. This action cannot be undone."
        confirmText="Yes, Remove"
      />

      {/* ── Invite Modal ── */}
      <AnimatePresence>
        {showInviteModal && (
          <InviteModal
            onClose={() => setShowInviteModal(false)}
            onSuccess={(newMember) => setMembers((prev) => [...prev, newMember])}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
