'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ShieldCheck,
  Briefcase,
  User,
  ChevronDown,
  RefreshCw,
  Save,
  Crown,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import Button from '@/components/common/Button';
import { adminService } from '@/lib/services/admin.services';
import { userService } from '@/lib/services/user.services';
import { AuthUser } from '@/lib/apiClient';
import toast from 'react-hot-toast';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getInitials = (name?: string) => {
  if (!name) return '??';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
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

// ─── Role Options ─────────────────────────────────────────────────────────────

const ROLE_OPTIONS = [
  {
    value: 'admin',
    label: 'Admin',
    desc: 'Full access to platform management, users, analytics, and settings.',
    icon: ShieldCheck,
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/30',
    activeBorder: 'border-primary',
    activeBg: 'bg-primary/10',
  },
  {
    value: 'recruiter',
    label: 'Recruiter',
    desc: 'Can manage job posts, view candidates, and communicate with applicants.',
    icon: Briefcase,
    color: 'text-secondary',
    bg: 'bg-secondary/10',
    border: 'border-secondary/30',
    activeBorder: 'border-secondary',
    activeBg: 'bg-secondary/10',
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TeamMemberEdit() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [member, setMember] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('');
  const [saving, setSaving] = useState(false);
  const [brokenImage, setBrokenImage] = useState(false);

  // ─── Fetch Member ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    const fetchMember = async () => {
      setLoading(true);
      try {
        const res = await userService.getProfile(id);
        if (res.success) {
          setMember(res.data);
          setSelectedRole(res.data.role || 'recruiter');
        } else {
          toast.error('Member not found');
          router.push('/team');
        }
      } catch (err: any) {
        toast.error(err?.message || 'Failed to load member');
        router.push('/team');
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, [id]);

  // ─── Save Role ──────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!member || selectedRole === member.role) {
      toast('No changes to save.', { icon: 'ℹ️' });
      return;
    }
    setSaving(true);
    try {
      const res = await adminService.updateUser(id, { role: selectedRole });
      if (res.success) {
        toast.success(`Role updated to ${selectedRole} successfully!`);
        router.push('/team');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update role');
    } finally {
      setSaving(false);
    }
  };

  // ─── Skeleton ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="w-full space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-on-surface/10 rounded-xl animate-pulse" />
          <div className="h-6 bg-on-surface/10 rounded-md w-40 animate-pulse" />
        </div>
        <div className="bg-surface-container-low/80 rounded-[2.5rem] border border-outline-variant/10 p-8 shadow-2xl animate-pulse space-y-8">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-on-surface/10 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-on-surface/10 rounded-md w-40" />
              <div className="h-3.5 bg-on-surface/5 rounded-md w-28" />
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-on-surface/5 rounded-2xl" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!member) return null;

  const hasChanged = selectedRole !== member.role;

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <main
      className="w-full space-y-8 animate-in fade-in duration-500"
      aria-label="Edit Team Member Role"
    >
      {/* Back header */}
      <header className="flex items-center justify-between">
        <button
          onClick={() => router.push('/team')}
          className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Team
        </button>
      </header>

      {/* ── Visual Banner Header (Combined mockup design) ── */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-violet-600 via-indigo-700 to-purple-800 p-6 md:p-8 shadow-2xl shadow-purple-950/20 border border-outline-variant/10 text-white">
        {/* Decorative backdrop shapes */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -ml-16 -mb-16 w-60 h-60 bg-black/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 z-10">
          
          {/* Avatar and Identity */}
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:text-left text-center">
            {/* Avatar Frame with Glow */}
            <div className="relative shrink-0">
              {member.profilePhoto && !brokenImage ? (
                <img
                  src={member.profilePhoto}
                  alt={member.fullname}
                  onError={() => setBrokenImage(true)}
                  className="w-20 h-20 rounded-3xl object-cover ring-4 ring-white/20 shadow-xl shadow-purple-950/50"
                />
              ) : (
                <div
                  className={cn(
                    'w-20 h-20 rounded-3xl bg-gradient-to-br flex items-center justify-center text-white text-2xl font-black shadow-xl ring-4 ring-white/20 shadow-purple-950/50 uppercase',
                    getGradient(member._id)
                  )}
                >
                  {getInitials(member.fullname)}
                </div>
              )}
            </div>

            {/* Title Identity */}
            <div className="space-y-1.5">
              <div>
                <h1 className="text-xl md:text-2xl font-black tracking-tight drop-shadow-md">
                  {member.fullname || '—'}
                </h1>
                <p className="text-xs text-white/70 font-semibold mt-0.5">
                  {member.email}
                </p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">
                  Current Role:
                </span>
                <span className={cn(
                  'text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border backdrop-blur-md',
                  member.role === 'admin' ? 'bg-purple-500/20 text-purple-200 border-purple-400/30'
                    : member.role === 'recruiter' ? 'bg-amber-500/20 text-amber-200 border-amber-400/30'
                      : 'bg-sky-500/20 text-sky-200 border-sky-400/30'
                )}>
                  {member.role === 'admin' ? 'Admin' : member.role}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 shrink-0 w-full md:w-auto justify-center">
            <button
              onClick={() => router.push(`/team/${id}`)}
              className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/35 border border-white/10 text-white font-black text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer"
            >
              View Profile →
            </button>
          </div>
        </div>
      </div>

      {/* Role Selection Card */}
      <div className="bg-surface-container-low/80 backdrop-blur-md rounded-[2.5rem] border border-outline-variant/10 p-6 md:p-10 shadow-2xl space-y-8 relative overflow-hidden">
        
        {/* Role Selection */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-black text-on-surface mb-1">Assign New Role</h2>
            <p className="text-xs text-on-surface-variant/60 font-medium">
              Select the role you want to assign to this team member.
            </p>
          </div>

          <div className="space-y-3">
            {ROLE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selectedRole === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setSelectedRole(opt.value)}
                  className={cn(
                    'w-full flex items-start gap-4 p-4 rounded-2xl border-2 transition-all text-left cursor-pointer group',
                    isSelected
                      ? `${opt.activeBg} ${opt.activeBorder} shadow-sm`
                      : 'bg-surface-container/30 border-outline-variant/10 hover:border-outline-variant/40 hover:bg-surface-container/60'
                  )}
                >
                  {/* Icon */}
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-all',
                    isSelected ? opt.bg : 'bg-surface-container/80'
                  )}>
                    <Icon className={cn('w-5 h-5', isSelected ? opt.color : 'text-on-surface-variant/50')} />
                  </div>

                  {/* Text */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className={cn(
                        'font-black text-sm uppercase tracking-wider',
                        isSelected ? opt.color : 'text-on-surface'
                      )}>
                        {opt.label}
                      </p>
                      {isSelected && (
                        <span className={cn(
                          'text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full',
                          opt.bg, opt.color
                        )}>
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-on-surface-variant/60">{opt.desc}</p>
                  </div>

                  {/* Radio dot */}
                  <div className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all',
                    isSelected ? `${opt.activeBorder}` : 'border-outline-variant/30'
                  )}>
                    {isSelected && (
                      <div className={cn('w-2.5 h-2.5 rounded-full', opt.color.replace('text-', 'bg-'))} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-outline-variant/10">
          <Button
            variant="outline"
            onClick={() => router.push('/team')}
            className="font-bold flex-1"
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            onClick={handleSave}
            isLoading={saving}
            disabled={!hasChanged || saving}
            className={cn(
              'flex-1 font-black text-white',
              !hasChanged && 'opacity-50 cursor-not-allowed'
            )}
          >
            {!saving && <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>

        {!hasChanged && (
          <p className="text-center text-xs text-on-surface-variant/50 font-medium -mt-4">
            No changes detected — select a different role to enable save.
          </p>
        )}
      </div>
    </main>
  );
}
