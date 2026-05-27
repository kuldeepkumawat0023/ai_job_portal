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
  Pencil,
  Crown,
  Info,
  Clock,
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

// ─── Info Row Sub-Component ───────────────────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-on-surface-variant/60" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant/50 mb-0.5">
          {label}
        </p>
        <p className="text-sm font-bold text-on-surface">{value || '—'}</p>
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

  useEffect(() => {
    if (!id) return;
    const fetchMember = async () => {
      setLoading(true);
      try {
        const res = await userService.getProfile(id);
        if (res.success) {
          setMember(res.data);
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

  const roleColors: Record<string, string> = {
    admin: 'bg-primary/10 text-primary border-primary/20',
    recruiter: 'bg-secondary/10 text-secondary border-secondary/20',
    candidate: 'bg-sky-500/10 text-sky-500 border-sky-500/20',
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
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-on-surface/10 shrink-0" />
            <div className="space-y-3 flex-1">
              <div className="h-7 bg-on-surface/10 rounded-md w-48" />
              <div className="h-4 bg-on-surface/5 rounded-md w-32" />
              <div className="h-6 bg-on-surface/10 rounded-full w-20" />
            </div>
          </div>
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

  // ── Main View ───────────────────────────────────────────────────────────────
  return (
    <main
      className="w-full space-y-8 animate-in fade-in duration-500"
      aria-label="Team Member Detail View"
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/team/${id}/edit`)}
          className="border-amber-500/30 text-amber-600 hover:bg-amber-500/10 hover:border-amber-500/50 font-bold"
        >
          <Pencil className="w-3.5 h-3.5 mr-1.5" />
          Edit Member
        </Button>
      </header>

      {/* Main Card */}
      <div className="bg-surface-container-low/80 backdrop-blur-md rounded-[2.5rem] border border-outline-variant/10 p-6 md:p-10 shadow-2xl space-y-8">

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-outline-variant/10">
          {/* Avatar */}
          {member.profilePhoto && !brokenImage ? (
            <img
              src={member.profilePhoto}
              alt={member.fullname}
              onError={() => setBrokenImage(true)}
              className="w-24 h-24 rounded-3xl object-cover shadow-xl border border-outline-variant/20 shrink-0"
            />
          ) : (
            <div
              className={cn(
                'w-24 h-24 rounded-3xl bg-gradient-to-br flex items-center justify-center text-white text-3xl font-black shadow-xl shrink-0',
                getGradient(member._id)
              )}
            >
              {getInitials(member.fullname)}
            </div>
          )}

          {/* Identity */}
          <div className="text-center sm:text-left space-y-3">
            <div>
              <h1 className="text-2xl font-black text-on-surface tracking-tight">
                {member.fullname || '—'}
              </h1>
              <p className="text-sm text-on-surface-variant/60 font-semibold mt-0.5">
                {member.email}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              {/* Role badge */}
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border',
                  roleColors[member.role] ||
                    'bg-surface-container text-on-surface-variant border-outline-variant/30'
                )}
              >
                {member.role === 'admin' ? (
                  <ShieldCheck className="w-3 h-3" />
                ) : member.role === 'recruiter' ? (
                  <Briefcase className="w-3 h-3" />
                ) : (
                  <User className="w-3 h-3" />
                )}
                {member.role === 'admin' ? 'Super Admin' : member.role}
              </span>

              {/* Status badge */}
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border',
                  member.isActive !== false
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    : 'bg-red-500/10 text-red-500 border-red-500/20'
                )}
              >
                <span
                  className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    member.isActive !== false ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                  )}
                />
                {member.isActive !== false ? 'Active' : 'Inactive'}
              </span>

              {/* Premium badge */}
              {member.isPremium && (
                <span className="inline-flex items-center gap-1 text-[9px] font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  <Crown className="w-2.5 h-2.5" /> Premium
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <InfoRow icon={Mail} label="Email Address" value={member.email} />
            <InfoRow
              icon={Phone}
              label="Phone Number"
              value={
                member.countryCode
                  ? `${member.countryCode} ${member.phoneNumber}`
                  : member.phoneNumber
              }
            />
            <InfoRow icon={MapPin} label="Location" value={member.location || 'Remote'} />
          </div>
          <div className="space-y-5">
            <InfoRow icon={Calendar} label="Joined Date" value={formatDate(member.createdAt)} />
            <InfoRow icon={Clock} label="Last Updated" value={formatDate(member.updatedAt)} />
            {member.role === 'recruiter' && (
              <InfoRow
                icon={Briefcase}
                label="Department / Job Role"
                value={`${member.department || 'Talent Acquisition'} — ${member.jobRole || 'Recruiter'}`}
              />
            )}
          </div>
        </div>

        {/* Bio */}
        {member.bio && (
          <div className="p-5 rounded-2xl bg-surface-container/50 border border-outline-variant/10">
            <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant/50 mb-2 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" /> Biography
            </p>
            <p className="text-sm text-on-surface leading-relaxed">{member.bio}</p>
          </div>
        )}

        {/* Skills */}
        {member.skills && member.skills.length > 0 && (
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant/50 mb-3">
              Key Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {member.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-surface-container/60 border border-outline-variant/10 text-xs font-semibold text-on-surface rounded-lg uppercase tracking-tight"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex gap-3 pt-4 border-t border-outline-variant/10">
          <Button
            variant="outline"
            onClick={() => router.push('/team')}
            className="font-bold"
          >
            Back to Team
          </Button>
          <Button
            variant="gradient"
            onClick={() => router.push(`/team/${id}/edit`)}
            className="font-black text-white"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit Member Role
          </Button>
        </div>
      </div>
    </main>
  );
}
