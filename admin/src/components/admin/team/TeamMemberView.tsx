'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  Briefcase,
  User,
  Crown,
  Clock,
  Info,
  Pencil,
  Copy,
  Check,
  Globe,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import Button from '@/components/common/Button';
import { userService } from '@/lib/services/user.services';
import { AuthUser } from '@/lib/apiClient';
import toast from 'react-hot-toast';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getInitials = (name?: string) => {
  if (!name) return '??';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};

const formatDate = (date?: string) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
};

const AVATAR_GRADIENTS = [
  'from-violet-500 to-indigo-500',
  'from-fuchsia-500 to-pink-500',
  'from-cyan-500 to-blue-500',
  'from-amber-500 to-orange-500',
  'from-emerald-500 to-teal-500',
];

const getGradient = (id?: string) => {
  if (!id) return AVATAR_GRADIENTS[0];
  return AVATAR_GRADIENTS[id.charCodeAt(id.length - 1) % AVATAR_GRADIENTS.length];
};

// ─── Sub-Component for Grid Items ────────────────────────────────────────────

function DetailCardItem({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/10 shadow-sm transition-all hover:bg-surface-container-high/40 hover:border-outline-variant/20">
      <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0">
        <Icon className="w-4.5 h-4.5 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-[9px] font-black uppercase tracking-wider text-on-surface-variant/40 mb-0.5">
          {label}
        </p>
        <p className="text-sm font-bold text-on-surface truncate">{value || '—'}</p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TeamMemberView() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [member, setMember] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [brokenImage, setBrokenImage] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const fetchMember = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await userService.getProfile(id);
      if (res.success) {
        setMember(res.data);
      } else {
        toast.error('Team member not found');
        router.push('/team');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to load team member');
      router.push('/team');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMember();
  }, [id]);

  const handleCopyId = () => {
    if (!member) return;
    navigator.clipboard.writeText(member._id);
    setCopiedId(true);
    toast.success('Member ID copied to clipboard');
    setTimeout(() => setCopiedId(false), 2000);
  };

  // ── Skeleton Loading ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="w-full space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-on-surface/10 rounded-xl animate-pulse" />
          <div className="h-6 bg-on-surface/10 rounded-md w-40 animate-pulse" />
        </div>
        <div className="bg-surface-container-low/80 rounded-[2.5rem] border border-outline-variant/10 p-8 shadow-2xl animate-pulse space-y-8">
          <div className="h-32 bg-on-surface/10 rounded-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 bg-on-surface/10 rounded-xl" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-on-surface/5 rounded w-20" />
                  <div className="h-4 bg-on-surface/10 rounded w-36" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!member) return null;

  const roleColors: Record<string, string> = {
    admin: 'bg-purple-500/20 text-purple-200 border-purple-400/30',
    recruiter: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
    candidate: 'bg-sky-500/20 text-sky-200 border-sky-400/30',
  };

  // ── Main View ───────────────────────────────────────────────────────────────
  return (
    <main
      className="w-full space-y-8 animate-in fade-in duration-700"
      aria-label="Team Member Profile Detail View"
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
                  className="w-24 h-24 rounded-3xl object-cover ring-4 ring-white/20 shadow-xl shadow-purple-950/50"
                />
              ) : (
                <div
                  className={cn(
                    'w-24 h-24 rounded-3xl bg-gradient-to-br flex items-center justify-center text-white text-3xl font-black shadow-xl ring-4 ring-white/20 shadow-purple-950/50 uppercase',
                    getGradient(member._id)
                  )}
                >
                  {getInitials(member.fullname)}
                </div>
              )}
              {/* Active dot indicator overlay */}
              <span className={cn(
                "absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-indigo-700 flex items-center justify-center text-white shadow-lg",
                member.isActive !== false ? "bg-emerald-500" : "bg-red-500"
              )}>
                {member.isActive !== false ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </span>
            </div>

            {/* Title Identity */}
            <div className="space-y-2.5">
              <div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight drop-shadow-md">
                  {member.fullname || '—'}
                </h1>
                <p className="text-sm text-white/70 font-semibold mt-0.5">
                  {member.email}
                </p>
              </div>

              {/* Badges and ID Pill */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border backdrop-blur-md',
                    roleColors[member.role] || 'bg-sky-500/20 text-sky-200 border-sky-400/30'
                  )}
                >
                  {member.role === 'admin' ? (
                    <ShieldCheck className="w-3.5 h-3.5" />
                  ) : member.role === 'recruiter' ? (
                    <Briefcase className="w-3.5 h-3.5" />
                  ) : (
                    <User className="w-3.5 h-3.5" />
                  )}
                  {member.role === 'admin' ? 'Admin' : member.role}
                </span>

                <span className={cn(
                  'inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border backdrop-blur-md',
                  member.isActive !== false
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                    : 'bg-red-500/20 text-red-300 border-red-400/30'
                )}>
                  {member.isActive !== false ? '• ACTIVE' : '• SUSPENDED'}
                </span>

                {member.isPremium && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-black text-amber-300 bg-amber-500/20 border border-amber-400/30 px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                    <Crown className="w-3 h-3 text-amber-300" /> Premium
                  </span>
                )}

                {/* Copiable tag */}
                <button
                  onClick={handleCopyId}
                  className="inline-flex items-center gap-1.5 bg-black/20 hover:bg-black/30 border border-white/10 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                  title="Copy Member ID"
                >
                  <span className="text-white/50">ID:</span>
                  <span className="font-bold tracking-tight text-white/95">{member._id.slice(-8)}</span>
                  {copiedId ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-white/40 hover:text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Action buttons (from mockup 2 & 3) */}
          <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full md:w-auto">
            <button
              onClick={() => router.push(`/team/${id}/edit`)}
              className="px-5 py-2.5 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 font-black text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Pencil className="w-4 h-4" />
              Edit Member Role
            </button>
          </div>
        </div>
      </div>

      {/* ── Biography / Story Statement ── */}
      {member.bio && (
        <div className="bg-surface-container-low/80 backdrop-blur-md p-6 rounded-[2rem] border border-outline-variant/10 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3 bg-gradient-to-b from-primary to-secondary rounded-full" />
            <h3 className="text-xs font-black uppercase tracking-wider text-on-surface-variant/50">Biography</h3>
          </div>
          <p className="text-sm font-semibold text-on-surface leading-relaxed text-justify">
            {member.bio}
          </p>
        </div>
      )}

      {/* ── Primary Information Grid (Mockup 2 & 3: Demographics vs Core Assignment) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Demographics */}
        <div className="lg:col-span-2 bg-surface-container-low/80 backdrop-blur-md p-6 rounded-[2rem] border border-outline-variant/10 shadow-xl space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/10">
            <span className="w-1.5 h-3.5 bg-primary rounded-full" />
            <h3 className="text-sm font-black uppercase tracking-wider text-on-surface">Contact & Location</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailCardItem icon={Mail} label="Email Address" value={member.email} />
            <DetailCardItem
              icon={Phone}
              label="Phone Number"
              value={member.countryCode ? `${member.countryCode} ${member.phoneNumber}` : member.phoneNumber}
            />
            <DetailCardItem icon={MapPin} label="Workplace Location" value={member.location || 'Remote'} />
            <DetailCardItem icon={Globe} label="User Country Code" value={member.countryCode || '+91'} />
          </div>
        </div>

        {/* Right Column: Workforce Audit Details */}
        <div className="bg-surface-container-low/80 backdrop-blur-md p-6 rounded-[2rem] border border-outline-variant/10 shadow-xl space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/10">
            <span className="w-1.5 h-3.5 bg-secondary rounded-full" />
            <h3 className="text-sm font-black uppercase tracking-wider text-on-surface">Audit Trail</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-outline-variant/5">
              <span className="text-xs font-bold text-on-surface-variant/60">Member Since</span>
              <span className="text-xs font-black text-on-surface">{formatDate(member.createdAt)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-outline-variant/5">
              <span className="text-xs font-bold text-on-surface-variant/60">Last Modified</span>
              <span className="text-xs font-black text-on-surface">{formatDate(member.updatedAt)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-outline-variant/5">
              <span className="text-xs font-bold text-on-surface-variant/60">System Role</span>
              <span className="text-xs font-black text-primary uppercase tracking-wide">{member.role === 'admin' ? 'Admin' : member.role}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-xs font-bold text-on-surface-variant/60">Account Status</span>
              <span className={cn(
                "text-xs font-black uppercase tracking-wide",
                member.isActive !== false ? "text-emerald-500" : "text-red-500"
              )}>
                {member.isActive !== false ? 'ACTIVE' : 'SUSPENDED'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ── Recruiter Company Section ── */}
      {member.role === 'recruiter' && (
        <div className="bg-surface-container-low/80 backdrop-blur-md p-6 rounded-[2rem] border border-outline-variant/10 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/10">
            <span className="w-1.5 h-3.5 bg-amber-500 rounded-full" />
            <h3 className="text-sm font-black uppercase tracking-wider text-on-surface">Recruitment Core Assignment</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant/50">Department</p>
              <p className="text-sm font-black text-on-surface mt-1">{member.department || 'Talent Acquisition'}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant/50">Job Role</p>
              <p className="text-sm font-black text-on-surface mt-1">{member.jobRole || 'Lead Recruiter'}</p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant/50">Company Affiliation</p>
              <p className="text-sm font-black text-on-surface mt-1">
                {member.hasCompanyProfile ? 'Profile Integrated' : 'No integrated company details'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Professional Skills Section ── */}
      {member.skills && member.skills.length > 0 && (
        <div className="bg-surface-container-low/80 backdrop-blur-md p-6 rounded-[2rem] border border-outline-variant/10 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full" />
            <h3 className="text-xs font-black uppercase tracking-wider text-on-surface-variant/50">Verified Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {member.skills.map((skill) => (
              <span
                key={skill}
                className="px-3.5 py-2 bg-surface-container border border-outline-variant/10 text-xs font-black text-on-surface rounded-xl uppercase tracking-tight shadow-sm hover:scale-105 transition-transform"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Footer Actions Section ── */}
      <div className="flex gap-3 pt-6 border-t border-outline-variant/10">
        <Button
          variant="outline"
          onClick={() => router.push('/team')}
          className="font-bold shadow-sm"
        >
          Back to Team
        </Button>

        <Button
          variant="gradient"
          onClick={() => router.push(`/team/${id}/edit`)}
          className="font-black text-white shadow-lg shadow-indigo-500/10 ml-auto"
        >
          <Pencil className="w-4 h-4 mr-2" />
          Edit Member Role
        </Button>
      </div>
    </main>
  );
}
