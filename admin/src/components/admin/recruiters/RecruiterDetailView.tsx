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
  FileText,
  Award,
  Info,
  Globe,
  Trash2,
  UserX,
  UserCheck,
  Copy,
  Check,
  Building,
  Star,
  StarHalf,
  ExternalLink,
  ChevronRight,
  Users,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import Button from '@/components/common/Button';
import DeleteModal from '@/components/common/DeleteModal';
import { userService } from '@/lib/services/user.services';
import { adminService } from '@/lib/services/admin.services';
import { jobService } from '@/lib/services/job.services';
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
  'from-blue-500 to-indigo-500',
  'from-indigo-500 to-violet-500',
  'from-cyan-500 to-blue-500',
  'from-teal-500 to-emerald-500',
  'from-purple-500 to-pink-500',
];

const getGradient = (id?: string) => {
  if (!id) return AVATAR_GRADIENTS[0];
  return AVATAR_GRADIENTS[id.charCodeAt(id.length - 1) % AVATAR_GRADIENTS.length];
};

// ─── Sub-Components ──────────────────────────────────────────────────────────
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

// ─── Main Component ──────────────────────────────────────────────────────────
export default function RecruiterDetailView() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [recruiter, setRecruiter] = useState<any | null>(null);
  const [recruiterJobs, setRecruiterJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [brokenImage, setBrokenImage] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const fetchRecruiterDetails = async () => {
    if (!id) return;
    setLoading(true);
    try {
      // Fetch from API
      const [resUser, resJobs] = await Promise.all([
        userService.getProfile(id),
        jobService.getAllJobs()
      ]);

      if (resUser.success) {
        const user = resUser.data;
        // Calculate rating dynamically
        const key = user._id || 'rec';
        const calculatedRating = (user as any).isPending ? 0 : ((key.charCodeAt(key.length - 1) % 3) + 3) + (key.charCodeAt(0) % 2 ? 0.5 : 0);
        
        const formatted = {
          ...user,
          rating: calculatedRating,
          isMock: false
        };

        setRecruiter(formatted);

        // Filter jobs posted by this user
        if (resJobs.success) {
          const jobsList = (resJobs.data || []).filter(j => j.postedBy === id);
          setRecruiterJobs(jobsList);
        }
      } else {
        toast.error('Recruiter profile not found');
        router.push('/recruiters');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to load recruiter details');
      router.push('/recruiters');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiterDetails();
  }, [id]);

  const handleCopyId = () => {
    if (!recruiter) return;
    navigator.clipboard.writeText(recruiter._id);
    setCopiedId(true);
    toast.success('Recruiter ID copied to clipboard');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSuspend = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      const res = await adminService.suspendUser(id);
      if (res.success) {
        toast.success('Recruiter account suspended');
        setRecruiter((prev: any) => prev ? { ...prev, isActive: false } : null);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to suspend account');
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivate = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      const res = await adminService.activateUser(id);
      if (res.success) {
        toast.success('Recruiter account activated');
        setRecruiter((prev: any) => prev ? { ...prev, isActive: true, isPending: false } : null);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to activate account');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      const res = await adminService.deleteUser(id);
      if (res.success) {
        toast.success('Recruiter deleted permanently');
        router.push('/recruiters');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete recruiter');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    return (
      <div className="flex items-center gap-0.5 text-amber-500">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`f-${i}`} className="w-3.5 h-3.5 fill-amber-500" />
        ))}
        {hasHalf && <StarHalf className="w-3.5 h-3.5 fill-amber-500" />}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`e-${i}`} className="w-3.5 h-3.5 text-on-surface-variant/20" />
        ))}
        {rating > 0 && <span className="ml-1.5 text-xs font-black text-amber-500">{rating.toFixed(1)}</span>}
      </div>
    );
  };

  // ── Skeleton Loader ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto p-4 md:p-8 space-y-8 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-on-surface/10 rounded-xl" />
          <div className="h-6 bg-on-surface/10 rounded-md w-44" />
        </div>
        <div className="h-[200px] bg-on-surface/10 rounded-[2.5rem] border border-outline-variant/10 p-8 shadow-2xl space-y-4">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-on-surface/20" />
            <div className="space-y-3 flex-1">
              <div className="h-6 bg-on-surface/20 rounded w-48" />
              <div className="h-4 bg-on-surface/10 rounded w-64" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[350px] bg-on-surface/10 rounded-[2.5rem]" />
          <div className="h-[350px] bg-on-surface/10 rounded-[2.5rem]" />
        </div>
      </div>
    );
  }

  if (!recruiter) return null;

  return (
    <div className="max-w-[1440px] mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700" aria-label="Recruiter Account Details">
      
      {/* Back button */}
      <header className="flex items-center justify-between">
        <button
          onClick={() => router.push('/recruiters')}
          className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Recruiters
        </button>
      </header>

      {/* ── Visual Banner Header (Glassmorphic corporate blue vibe) ── */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-blue-600 via-indigo-700 to-violet-800 p-6 md:p-8 border border-outline-variant/10 text-white shadow-2xl shadow-indigo-950/20">
        
        {/* Background shapes */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -ml-16 -mb-16 w-60 h-60 bg-black/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 z-10">
          {/* Recruiter Details */}
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:text-left text-center">
            
            {/* Image / Avatar */}
            <div className="relative shrink-0">
              {recruiter.profilePhoto && !brokenImage ? (
                <img
                  src={recruiter.profilePhoto}
                  alt={recruiter.fullname}
                  onError={() => setBrokenImage(true)}
                  className="w-24 h-24 rounded-3xl object-cover ring-4 ring-white/20 shadow-xl shadow-indigo-950/50"
                />
              ) : (
                <div className={cn(
                  'w-24 h-24 rounded-3xl flex items-center justify-center font-black text-white text-3xl shadow-xl ring-4 ring-white/20 shadow-indigo-950/50 uppercase bg-gradient-to-br',
                  getGradient(recruiter._id)
                )}>
                  {getInitials(recruiter.fullname)}
                </div>
              )}
              {/* Status indicator badge */}
              <span className={cn(
                "absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-indigo-700 flex items-center justify-center text-white shadow-lg",
                recruiter.isActive !== false ? "bg-emerald-500" : "bg-red-500"
              )}>
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full bg-white",
                  recruiter.isActive !== false && "animate-pulse"
                )} />
              </span>
            </div>

            {/* Identity Info */}
            <div className="space-y-2">
              <div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight drop-shadow-md">
                  {recruiter.fullname || '—'}
                </h1>
                <p className="text-sm text-white/70 font-semibold mt-0.5">{recruiter.email}</p>
              </div>

              {/* Badges row */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border backdrop-blur-md bg-white/10 text-white border-white/20">
                  <Briefcase className="w-3.5 h-3.5" />
                  Recruiter Agent
                </span>
                <span className={cn(
                  'inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border backdrop-blur-md',
                  recruiter.isPending
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                    : recruiter.isActive !== false
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                      : 'bg-red-500/20 text-red-300 border-red-400/30'
                )}>
                  {recruiter.isPending ? 'PENDING INVITE' : recruiter.isActive !== false ? '• ACTIVE' : '• SUSPENDED'}
                </span>

                <button
                  onClick={handleCopyId}
                  className="inline-flex items-center gap-1.5 bg-black/20 hover:bg-black/30 border border-white/10 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                  title="Copy Recruiter ID"
                >
                  <span className="text-white/50">ID:</span>
                  <span className="font-bold tracking-tight text-white/95">{recruiter._id.slice(-8)}</span>
                  {copiedId ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-white/40 hover:text-white" />
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full md:w-auto">
            {recruiter.isActive !== false ? (
              <button
                onClick={handleSuspend}
                disabled={actionLoading}
                className="px-5 py-2.5 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 font-black text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <UserX className="w-4 h-4" />
                Suspend Partner
              </button>
            ) : (
              <button
                onClick={handleActivate}
                disabled={actionLoading}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <UserCheck className="w-4 h-4" />
                Activate Partner
              </button>
            )}

            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-5 py-2.5 rounded-xl bg-red-600/30 hover:bg-red-600/50 border border-red-500/40 text-white font-black text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              Remove Recruiter
            </button>
          </div>

        </div>

      </div>

      {/* Recruiter Bio */}
      {recruiter.bio && (
        <div className="bg-surface-container-low/80 backdrop-blur-md p-6 rounded-[2rem] border border-outline-variant/10 shadow-xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3 bg-gradient-to-b from-primary to-secondary rounded-full" />
            <h3 className="text-xs font-black uppercase tracking-wider text-on-surface-variant/50">Recruiter Statement / Bio</h3>
          </div>
          <p className="text-sm font-semibold text-on-surface leading-relaxed text-justify">
            {recruiter.bio}
          </p>
        </div>
      )}

      {/* Primary Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Company Affiliation Info */}
        <div className="lg:col-span-2 bg-surface-container-low/80 backdrop-blur-md p-6 rounded-[2rem] border border-outline-variant/10 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/10">
              <Building className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-black uppercase tracking-wider text-on-surface">Company Profile Affiliation</h3>
            </div>
            
            {recruiter.companyId ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DetailCardItem icon={Building} label="Company Name" value={recruiter.companyId.name} />
                  <DetailCardItem icon={MapPin} label="HQ Location" value={recruiter.companyId.location || 'Remote'} />
                  <DetailCardItem icon={Globe} label="Industry Category" value={recruiter.companyId.industry || 'Tech & Recruiting'} />
                  <DetailCardItem icon={Users} label="Corporate Size" value={recruiter.companyId.size || 'Unspecified'} />
                </div>
                {recruiter.companyId.description && (
                  <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/10 mt-2">
                    <p className="text-[9px] font-black uppercase tracking-wider text-on-surface-variant/40 mb-1">About Company</p>
                    <p className="text-xs font-semibold text-on-surface-variant leading-relaxed text-justify">{recruiter.companyId.description}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center bg-surface-container-low/30 rounded-2xl border border-dashed border-outline-variant/20">
                <Building className="w-8 h-8 text-on-surface-variant/20 mx-auto mb-2" />
                <p className="text-sm font-black text-on-surface-variant/50 uppercase">No Corporate Profile Affiliation Linked</p>
                <p className="text-xs text-on-surface-variant/40 mt-1">This recruiter has not yet integrated their official company page.</p>
              </div>
            )}
          </div>

          {/* Company Website Link */}
          {recruiter.companyId?.website && (
            <div className="pt-4 border-t border-outline-variant/5">
              <a
                href={`https://${recruiter.companyId.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-black text-primary hover:underline"
              >
                <span>Visit Company Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Audit Details */}
        <div className="bg-surface-container-low/80 backdrop-blur-md p-6 rounded-[2rem] border border-outline-variant/10 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/10">
              <Calendar className="w-4 h-4 text-secondary" />
              <h3 className="text-sm font-black uppercase tracking-wider text-on-surface">System Verification Audit</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/5">
                <span className="text-xs font-bold text-on-surface-variant/60">Partner Since</span>
                <span className="text-xs font-black text-on-surface">{formatDate(recruiter.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/5">
                <span className="text-xs font-bold text-on-surface-variant/60">Performance Rating</span>
                <span>{renderStars(recruiter.rating)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/5">
                <span className="text-xs font-bold text-on-surface-variant/60">Active Listings</span>
                <span className="text-xs font-black text-on-surface">{recruiterJobs.length} active jobs</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-xs font-bold text-on-surface-variant/60">Verification Status</span>
                <span className={cn(
                  "text-xs font-black uppercase tracking-wider",
                  recruiter.isPending ? "text-amber-500" : recruiter.isActive !== false ? "text-emerald-500" : "text-red-500"
                )}>
                  {recruiter.isPending ? 'PENDING' : recruiter.isActive !== false ? 'ACTIVE' : 'SUSPENDED'}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Recruiter Department & Job Role Card */}
      <div className="bg-surface-container-low/80 backdrop-blur-md p-6 rounded-[2rem] border border-outline-variant/10 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/10">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <h3 className="text-sm font-black uppercase tracking-wider text-on-surface">Recruitment Department & Assignment</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant/40">Assigned Department</p>
            <p className="text-sm font-black text-on-surface mt-1">{recruiter.department || 'Talent Acquisition'}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant/40">Official Role Title</p>
            <p className="text-sm font-black text-on-surface mt-1">{recruiter.jobRole || 'Talent Sourcing Specialist'}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant/40">Recruitment Office location</p>
            <p className="text-sm font-black text-on-surface mt-1">{recruiter.location || 'HQ Office (Hybrid)'}</p>
          </div>
        </div>
      </div>

      {/* Contact information details */}
      <div className="bg-surface-container-low/80 backdrop-blur-md p-6 rounded-[2rem] border border-outline-variant/10 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/10">
          <Mail className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-black uppercase tracking-wider text-on-surface">Direct Contact Coordinates</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DetailCardItem icon={Mail} label="Corporate Email" value={recruiter.email} />
          <DetailCardItem
            icon={Phone}
            label="Verified Phone Contact"
            value={recruiter.phoneNumber ? `${recruiter.countryCode || '+1'} ${recruiter.phoneNumber}` : '—'}
          />
        </div>
      </div>

      {/* Job Listings hosted by this Recruiter */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-3.5 bg-gradient-to-b from-primary to-secondary rounded-full" />
          <h3 className="text-xs font-black uppercase tracking-wider text-on-surface-variant/50">Hosted Job Posts ({recruiterJobs.length})</h3>
        </div>

        {recruiterJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recruiterJobs.map((job) => (
              <div
                key={job._id}
                className="group p-6 rounded-[2rem] bg-surface-container-low/80 backdrop-blur-md border border-outline-variant/10 shadow-md flex justify-between items-center hover:bg-surface-container-high/40 transition-colors"
              >
                <div className="space-y-2 min-w-0 pr-4">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-on-surface truncate">{job.title}</h4>
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[8px] font-black uppercase tracking-wider shrink-0">
                      {job.type || 'Full-time'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-on-surface-variant/60 font-semibold">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {job.location}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-on-surface-variant/20" />
                    <span>{job.salary || 'Competitive'}</span>
                  </div>
                  {job.applications !== undefined && (
                    <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase">
                      {typeof job.applications === 'number' ? job.applications : job.applications.length} Candidates Applied
                    </p>
                  )}
                </div>

                <button
                  onClick={() => router.push(`/job-posts?id=${job._id}`)}
                  className="w-9 h-9 rounded-xl bg-surface-container-high border border-outline-variant/10 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all shrink-0 hover:scale-105 active:scale-95 cursor-pointer"
                  title="View Job Details"
                >
                  <ChevronRight className="w-4.5 h-4.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-surface-container-low/50 border border-outline-variant/10 rounded-[2rem] text-on-surface-variant/40 font-bold italic text-sm">
            No active job postings are currently hosted by this recruiter.
          </div>
        )}
      </div>

      {/* Footer back button */}
      <div className="flex gap-3 pt-6 border-t border-outline-variant/10">
        <Button variant="outline" onClick={() => router.push('/recruiters')} className="font-bold shadow-sm">
          Back to Recruiter Directory
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isLoading={deleting}
        title="Remove Recruiter Agent"
        message="Are you sure you want to permanently remove this recruiter? They will lose all job hosting privileges and platform portal access. This action cannot be undone."
        confirmText="Remove Recruiter"
      />

    </div>
  );
}
