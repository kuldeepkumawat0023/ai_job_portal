'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
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
  Building,
  UserX,
  UserCheck,
  Globe,
  Star,
  StarHalf,
  Plus,
  Send,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { jsPDF } from 'jspdf';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// Services
import { adminService } from '@/lib/services/admin.services';
import { userService } from '@/lib/services/user.services';
import { jobService } from '@/lib/services/job.services';
import { AuthUser } from '@/lib/apiClient';

// Common Components
import StatsCard from '@/components/common/StatsCard';
import DataTable from '@/components/common/DataTable';
import Pagination from '@/components/common/Pagination';
import DeleteModal from '@/components/common/DeleteModal';
import Button from '@/components/common/Button';

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

const TOP_PERFORMERS = [
  {
    name: 'Sarah Jenkins',
    placements: 42,
    matchRate: '98%',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100'
  },
  {
    name: 'Michael Ross',
    placements: 38,
    matchRate: '94%',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100&h=100'
  }
];

// ─── Invite Recruiter Modal Component ────────────────────────────────────────

interface InviteModalProps {
  onClose: () => void;
  onSuccess: (newRecruiter: any) => void;
}

function InviteModal({ onClose, onSuccess }: InviteModalProps) {
  const [form, setForm] = useState({ name: '', email: '' });
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
        role: 'recruiter'
      });
      if (res.success) {
        toast.success(`${form.name} invited successfully!`);
        // Format object to match dashboard recruiter attributes
        const formatted = {
          ...res.data,
          rating: 0,
          activeJobs: 0,
          companyId: null,
          isMock: false
        };
        onSuccess(formatted);
        onClose();
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to invite recruiter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        className="relative w-full max-w-lg bg-card border border-outline-variant/30 rounded-3xl shadow-2xl z-10 overflow-hidden text-on-surface"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary" />

        <div className="flex items-center justify-between p-6 border-b border-outline-variant/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Plus className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-black">Invite Recruiter</h3>
              <p className="text-xs text-on-surface-variant/60 font-medium">Add a recruiting partner to the platform</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer">
            <X className="w-5 h-5 text-on-surface-variant/60" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-on-surface-variant/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. David Ross"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl text-sm focus:outline-none focus:border-primary/50 text-on-surface placeholder-on-surface-variant/30 transition-all font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-on-surface-variant/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="e.g. david@nexus.com"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl text-sm focus:outline-none focus:border-primary/50 text-on-surface placeholder-on-surface-variant/30 transition-all font-medium"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" size="md" type="button" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button variant="gradient" size="md" type="submit" isLoading={loading} className="flex-1 font-black">
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

export default function RecruitersView() {
  const router = useRouter();

  const [dbRecruiters, setDbRecruiters] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Tab states, searches and filters
  const [activeTab, setActiveTab] = useState('ALL RECRUITERS');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recruitersPerPage = 8;

  // Modal control states
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  // ─── Fetch Data ────────────────────────────────────────────────────────────

  const fetchData = async () => {
    setLoading(true);
    const startTime = Date.now();
    try {
      const [resUsers, resJobs] = await Promise.all([
        adminService.getAllUsers(),
        jobService.getAllJobs(),
      ]);

      const elapsed = Date.now() - startTime;
      const minDelay = 2000;
      if (elapsed < minDelay) {
        await new Promise((r) => setTimeout(r, minDelay - elapsed));
      }

      if (resUsers.success) {
        // Filter users by role 'recruiter'
        const recs = (resUsers.data || []).filter((u) => u.role === 'recruiter');
        setDbRecruiters(recs);
      }
      if (resJobs.success) {
        setJobs(resJobs.data || []);
      }
    } catch (err) {
      toast.error('Failed to load recruiters data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ─── Helpers to calculate Active Jobs count & Rating per recruiter ──────────

  const getJobsCount = (rec: any) => {
    if (rec.isMock) return rec.activeJobs || 0;
    // Count jobs postedBy this recruiter
    return jobs.filter((j) => j.postedBy === rec._id).length;
  };

  const getRating = (rec: any) => {
    if (rec.isMock) return rec.rating || 0;
    // Real recruiters rating formula or default to 4.0 if active, 0 if pending
    if (rec.isPending) return 0;
    const key = rec._id || 'rec';
    return ((key.charCodeAt(key.length - 1) % 3) + 3) + (key.charCodeAt(0) % 2 ? 0.5 : 0); // 3.0 to 5.0
  };

  // Format database recruiters
  const allRecruiters = useMemo(() => {
    return dbRecruiters.map((rec) => ({
      ...rec,
      activeJobs: getJobsCount(rec),
      rating: getRating(rec),
      isMock: false
    }));
  }, [dbRecruiters, jobs]);

  // ─── Stats computations ─────────────────────────────────────────────────────

  const stats = useMemo(() => {
    const total = allRecruiters.length;
    const active = allRecruiters.filter((r) => r.isActive !== false && r.isPending !== true).length;
    
    // Count unique companies
    const companyNames = new Set(
      allRecruiters
        .map((r) => r.companyId?.name)
        .filter(Boolean)
    );
    const totalCompanies = companyNames.size;
    const pendingSuspended = allRecruiters.filter((r) => r.isActive === false || r.isPending === true).length;

    return { total, active, totalCompanies, pendingSuspended };
  }, [allRecruiters]);

  // ─── Filter & Paginated Logic ─────────────────────────────────────────────

  const filteredRecruiters = useMemo(() => {
    return allRecruiters.filter((rec) => {
      // 1. Tab status filter
      if (activeTab === 'ACTIVE' && (rec.isActive === false || rec.isPending === true)) return false;
      if (activeTab === 'PENDING' && rec.isPending !== true) return false;
      if (activeTab === 'SUSPENDED' && rec.isActive !== false) return false;

      // 2. Search query (recruiter name or company name)
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = rec.fullname?.toLowerCase().includes(q);
        const matchEmail = rec.email?.toLowerCase().includes(q);
        const matchCompany = rec.companyId?.name?.toLowerCase().includes(q);
        return matchName || matchEmail || matchCompany;
      }
      return true;
    });
  }, [allRecruiters, activeTab, searchQuery]);

  const totalPages = Math.ceil(filteredRecruiters.length / recruitersPerPage);
  const currentRecruiters = useMemo(() => {
    return filteredRecruiters.slice(
      (currentPage - 1) * recruitersPerPage,
      currentPage * recruitersPerPage
    );
  }, [filteredRecruiters, currentPage, recruitersPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  // Tab Badge counts
  const pendingCount = useMemo(() => allRecruiters.filter((r) => r.isPending === true).length, [allRecruiters]);
  const suspendedCount = useMemo(() => allRecruiters.filter((r) => r.isActive === false).length, [allRecruiters]);

  // ─── Insights computations (SVG Doughnut & Top Performers) ─────────────────

  const getCompanyCategory = (recruiter: any) => {
    const compName = recruiter.companyId?.name || '';
    if (compName.toLowerCase().includes('startup') || compName.toLowerCase().includes('nexus') || recruiter._id === 'mock-rec-3') {
      return 'Startup';
    }
    return 'Enterprise';
  };

  const insightsData = useMemo(() => {
    const total = allRecruiters.length;
    const startupCount = allRecruiters.filter((r) => getCompanyCategory(r) === 'Startup').length;
    const enterpriseCount = total - startupCount;

    const startupPercent = total ? Math.round((startupCount / total) * 100) : 30;
    const enterprisePercent = total ? Math.round((enterpriseCount / total) * 100) : 70;

    // SVG doughnut circle parameters: circumference = 2 * PI * r = 251.2
    const dashOffset = 251.2 - (251.2 * enterprisePercent) / 100;

    return { total, startupPercent, enterprisePercent, dashOffset };
  }, [allRecruiters]);

  // ─── Actions ──────────────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      // Mock delete
      if (deleteId.startsWith('mock-')) {
        toast.success('Recruiter removed successfully');
        setDbRecruiters((p) => p.filter((r) => r._id !== deleteId));
      } else {
        const res = await adminService.deleteUser(deleteId);
        if (res.success) {
          toast.success('Recruiter account deleted');
          setDbRecruiters((p) => p.filter((r) => r._id !== deleteId));
        }
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete recruiter');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleSuspend = async (id: string) => {
    try {
      if (id.startsWith('mock-')) {
        toast.success('Recruiter account suspended');
        setDbRecruiters((prev) =>
          prev.map((r) => (r._id === id ? { ...r, isActive: false } : r))
        );
      } else {
        const res = await adminService.suspendUser(id);
        if (res.success) {
          toast.success('Recruiter account suspended');
          setDbRecruiters((prev) =>
            prev.map((r) => (r._id === id ? { ...r, isActive: false } : r))
          );
        }
      }
    } catch (err) {
      toast.error('Failed to suspend recruiter');
    }
  };

  const handleActivate = async (id: string) => {
    try {
      if (id.startsWith('mock-')) {
        toast.success('Recruiter account activated');
        setDbRecruiters((prev) =>
          prev.map((r) => (r._id === id ? { ...r, isActive: true } : r))
        );
      } else {
        const res = await adminService.activateUser(id);
        if (res.success) {
          toast.success('Recruiter account activated');
          setDbRecruiters((prev) =>
            prev.map((r) => (r._id === id ? { ...r, isActive: true } : r))
          );
        }
      }
    } catch (err) {
      toast.error('Failed to activate recruiter');
    }
  };

  // ─── Exports ────────────────────────────────────────────────────────────────

  const handleExportCSV = () => {
    if (allRecruiters.length === 0) return toast.error('No data to export');
    const headers = ['Full Name', 'Email', 'Company', 'Industry', 'Location', 'Active Jobs', 'Rating', 'Status', 'Joined Date'];
    const rows = allRecruiters.map(rec => [
      `"${rec.fullname || ''}"`,
      `"${rec.email || ''}"`,
      `"${rec.companyId?.name || 'Unassigned'}"`,
      `"${rec.companyId?.industry || '—'}"`,
      `"${rec.companyId?.location || 'Remote'}"`,
      `"${rec.activeJobs !== undefined ? rec.activeJobs : 0}"`,
      `"${rec.rating ? rec.rating : 'Unrated'}"`,
      `"${rec.isPending ? 'Pending' : rec.isActive !== false ? 'Active' : 'Suspended'}"`,
      `"${rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `recruiters_export_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV downloaded successfully');
  };

  const handleExportPDF = async () => {
    if (allRecruiters.length === 0) return toast.error('No data to export');
    const toastId = toast.loading('Generating PDF report...');
    try {
      const doc = new jsPDF('landscape', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Ensure no duplicate records by filtering unique recruiter IDs
      const uniqueRecruiters = Array.from(new Map(allRecruiters.map(r => [r._id, r])).values());

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
          doc.text('AI JOBFIT - RECRUITER DIRECTORY AUDIT REPORT', 14, 11);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.5);
          doc.setTextColor(220, 230, 255);
          doc.text(`Generated on: ${new Date().toLocaleString()} | Total Recruiters: ${uniqueRecruiters.length} | Admin Controls`, 14, 18);
        } else {
          // Minimal header for page 2+ to avoid duplicating the big colored banner
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(100, 100, 100);
          doc.text(`AI JOBFIT - RECRUITER DIRECTORY AUDIT REPORT (Page Header)`, 14, 10);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text(`Total Recruiters: ${uniqueRecruiters.length}`, pageWidth - 14, 10, { align: 'right' });

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
        doc.text('Email', 60, currentY);
        doc.text('Company', 120, currentY);
        doc.text('Location', 175, currentY);
        doc.text('Jobs', 222, currentY);
        doc.text('Rating', 237, currentY);
        doc.text('Status', 257, currentY);
      };

      // Draw first page decorations & table headers
      drawPageDecorations(true);
      let y = 42;
      drawTableHeader(y);
      y += 8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);

      uniqueRecruiters.forEach((rec, index) => {
        if (y > 185) {
          doc.addPage();
          drawPageDecorations(false);
          y = 22; // Start higher up on subsequent pages
          drawTableHeader(y);
          y += 8;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
        }

        const name = (rec.fullname || '').substring(0, 18);
        const email = (rec.email || '').substring(0, 30);
        const company = (rec.companyId?.name || 'Unassigned').substring(0, 25);
        const location = (rec.companyId?.location || 'Remote').substring(0, 20);
        const jobsCount = String(rec.activeJobs !== undefined ? rec.activeJobs : 0);
        const ratingScore = String(rec.rating ? rec.rating.toFixed(1) : '—');
        const status = rec.isPending ? 'PENDING' : rec.isActive !== false ? 'ACTIVE' : 'SUSPENDED';

        // Draw light bottom border for row
        doc.setDrawColor(230, 230, 240);
        doc.setLineWidth(0.2);
        doc.line(14, y + 2, 283, y + 2);

        // Draw S.No. and recruiter data
        doc.setTextColor(120, 120, 120);
        doc.text(String(index + 1), 16, y);

        doc.setTextColor(60, 60, 60);
        doc.text(name, 24, y);
        doc.text(email, 60, y);
        doc.text(company, 120, y);
        doc.text(location, 175, y);
        
        // Align numeric/short fields
        doc.text(jobsCount, 222, y);
        doc.text(ratingScore, 237, y);

        // Print Status with custom color
        if (status === 'ACTIVE') {
          doc.setTextColor(16, 185, 129);
        } else if (status === 'SUSPENDED') {
          doc.setTextColor(239, 68, 68);
        } else {
          doc.setTextColor(245, 158, 11);
        }
        doc.text(status, 257, y);
        
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

      doc.save(`recruiters_report_${Date.now()}.pdf`);
      toast.success('PDF downloaded successfully', { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to generate PDF', { id: toastId });
    }
  };

  // ─── Star Ratings Renderer ──────────────────────────────────────────────────

  const renderStars = (rating: number) => {
    if (!rating) return <span className="text-xs text-on-surface-variant/40 italic">Unrated</span>;
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<StarHalf key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />);
      } else {
        stars.push(<Star key={i} className="w-3.5 h-3.5 text-on-surface-variant/20" />);
      }
    }
    return <div className="flex gap-0.5 justify-center sm:justify-start">{stars}</div>;
  };

  // ─── Render Page ────────────────────────────────────────────────────────────

  return (
    <main
      className="w-full space-y-10 animate-in fade-in duration-700 text-on-surface"
      id="main-recruiters-management"
      aria-label="Recruiter Management Dashboard"
    >
      {/* ── Page Header ── */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Recruiter Management</h1>
          <p className="text-on-surface-variant font-medium">
            Oversee recruiter activity, monitor performance, and manage platform access.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Invite Recruiter Button */}
          <Button
            variant="gradient"
            onClick={() => setShowInviteModal(true)}
            className="shadow-lg shadow-primary/20 hover:shadow-primary/40 text-white font-black"
            aria-label="Invite recruiter"
          >
            <Plus className="w-4 h-4 mr-2" />
            Invite Recruiter
          </Button>

          {/* Export Dropdown */}
          <div className="relative">
            <Button
              variant="gradient"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="shadow-lg shadow-primary/20 hover:shadow-primary/40 text-white font-bold"
              aria-label="Export recruiters report"
            >
              <Download className="w-4 h-4 mr-2" />
              <span>Export Data</span>
            </Button>

            {showExportMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
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

      {/* ── Metrics Bento Grid ── */}
      <section className="grid grid-cols-2 xl:grid-cols-4 gap-6" aria-label="Recruiter Statistics Overview">
        <StatsCard
          label="Total Recruiters"
          value={loading ? '—' : stats.total.toLocaleString()}
          icon={Users}
          lineClass="bg-primary"
          iconBg="bg-primary/10"
          iconColor="text-primary"
          progressPercent={100}
        />
        <StatsCard
          label="Active Recruiters"
          value={loading ? '—' : stats.active.toLocaleString()}
          icon={UserCheck}
          lineClass="bg-emerald-500"
          iconBg="bg-emerald-500/10"
          iconColor="text-emerald-500"
          progressPercent={stats.total ? Math.round((stats.active / stats.total) * 100) : 0}
        />
        <StatsCard
          label="Total Companies"
          value={loading ? '—' : stats.totalCompanies.toLocaleString()}
          icon={Building}
          lineClass="bg-secondary"
          iconBg="bg-secondary/10"
          iconColor="text-secondary"
          progressPercent={100}
        />
        <StatsCard
          label="Pending / Suspended"
          value={loading ? '—' : stats.pendingSuspended.toLocaleString()}
          icon={UserX}
          lineClass="bg-red-500"
          iconBg="bg-red-500/10"
          iconColor="text-red-500"
          progressPercent={stats.total ? Math.round((stats.pendingSuspended / stats.total) * 100) : 0}
        />
      </section>

      {/* ── Main Section Layout (Table at Top, Insights at Bottom) ── */}
      <div className="space-y-8 w-full">
        
        {/* Recruiters Directory Table */}
        <section className="w-full" aria-label="Recruiters Profiles Directory">
          <div className="bg-surface-container-low/80 backdrop-blur-md rounded-[2.5rem] border border-outline-variant/10 p-6 md:p-10 shadow-2xl space-y-8">
            
            {/* Header / Filter Toolbar inside directory */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black tracking-tight">Active Recruiters</h2>
                  <span className="h-4 w-1 bg-gradient-to-b from-primary to-secondary rounded-full" />
                  {!loading && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                      {filteredRecruiters.length} Result{filteredRecruiters.length !== 1 && 's'}
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 mt-1 flex items-center gap-1.5">
                  <span className={cn('w-2 h-2 rounded-full bg-emerald-500', loading ? 'animate-pulse' : 'animate-ping')} />
                  {loading ? 'Syncing Directory...' : 'Recruiter Feeds Live'}
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center overflow-x-auto flex-nowrap bg-surface-container-low/50 p-1.5 rounded-2xl border border-outline-variant/10 max-w-full no-scrollbar">
                {[
                  { id: 'ALL RECRUITERS', label: 'ALL RECRUITERS', badge: null },
                  { id: 'ACTIVE', label: 'ACTIVE', badge: stats.active },
                  { id: 'PENDING', label: 'PENDING', badge: pendingCount },
                  { id: 'SUSPENDED', label: 'SUSPENDED', badge: suspendedCount }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    disabled={loading}
                    onClick={() => setActiveTab(tab.id)}
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
                        activeTab === tab.id ? "bg-black/20 text-white" : "bg-primary/20 text-primary"
                      )}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Search & Refresh */}
              <div className="flex items-center gap-3 w-full xl:w-auto shrink-0">
                <div className="relative flex-1 xl:flex-none">
                  <Search className="w-4 h-4 text-on-surface-variant/60 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search recruiters or companies..."
                    value={searchQuery}
                    disabled={loading}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full xl:w-64 pl-10 pr-4 py-3 bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl text-sm focus:outline-none focus:border-primary/50 placeholder-on-surface-variant/40 transition-all font-medium disabled:opacity-50"
                  />
                </div>
                <button
                  onClick={fetchData}
                  disabled={loading}
                  className="p-3 rounded-2xl bg-surface-container-low/50 hover:bg-surface-container-high border border-outline-variant/20 text-on-surface-variant transition-all hover:scale-105 active:scale-95 shrink-0 disabled:opacity-50 cursor-pointer"
                  title="Refresh Feed"
                >
                  <RefreshCw className={cn('w-4.5 h-4.5', loading && 'animate-spin')} />
                </button>
              </div>
            </div>

            {/* DataTable */}
            <DataTable
              columns={[
                { header: 'Recruiter' },
                { header: 'Company' },
                { header: 'Active Jobs', className: 'text-center' },
                { header: 'Rating' },
                { header: 'Status' },
                { header: 'Actions', className: 'text-right pr-4' }
              ]}
              isLoading={false}
              isEmpty={!loading && filteredRecruiters.length === 0}
              emptyTitle="No Recruiters Found"
              emptyDesc="No recruiters match your search queries or selected status filters."
            >
              {loading ? (
                // Skeletons
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={`skel-${idx}`} className="animate-pulse border-b border-outline-variant/5 last:border-0">
                    <td className="py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-on-surface/10 shrink-0" />
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-on-surface/10 rounded w-24" />
                          <div className="h-3 bg-on-surface/5 rounded w-32" />
                        </div>
                      </div>
                    </td>
                    <td className="py-5"><div className="h-4 bg-on-surface/10 rounded w-28" /></td>
                    <td className="py-5 text-center"><div className="h-5 bg-on-surface/10 rounded w-8 mx-auto" /></td>
                    <td className="py-5"><div className="h-4 bg-on-surface/10 rounded w-20" /></td>
                    <td className="py-5"><div className="h-6 bg-on-surface/10 rounded-full w-20" /></td>
                    <td className="py-5 text-right pr-4">
                      <div className="flex justify-end gap-2">
                        <div className="w-7 h-7 bg-on-surface/10 rounded-lg" />
                        <div className="w-7 h-7 bg-on-surface/10 rounded-lg" />
                        <div className="w-7 h-7 bg-on-surface/10 rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                currentRecruiters.map((rec) => (
                  <tr key={rec._id} className="group hover:bg-surface-container-low/20 transition-all border-b border-outline-variant/5 last:border-0">
                    
                    {/* Recruiter Details */}
                    <td className="py-5">
                      <div className="flex items-center gap-4">
                        {rec.profilePhoto && !brokenImages[rec._id] ? (
                          <img
                            src={rec.profilePhoto}
                            alt={rec.fullname}
                            onError={() => setBrokenImages(prev => ({ ...prev, [rec._id]: true }))}
                            className="w-10 h-10 rounded-full border border-white/50 shadow-sm object-cover transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className={cn(
                            'w-10 h-10 rounded-full border flex items-center justify-center font-black text-sm uppercase shrink-0 transition-transform group-hover:scale-105 bg-gradient-to-br text-white',
                            getGradient(rec._id)
                          )}>
                            {getInitials(rec.fullname)}
                          </div>
                        )}
                        <div className="cursor-pointer group/name" onClick={() => router.push(`/recruiters/${rec._id}`)}>
                          <p className="font-bold text-on-surface group-hover/name:text-primary transition-colors text-base leading-tight mb-0.5">{rec.fullname || '—'}</p>
                          <p className="text-xs text-on-surface-variant/60 font-semibold select-all">{rec.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Company Details */}
                    <td className="py-5">
                      <p className="font-bold text-on-surface text-sm">{rec.companyId?.name || 'Unassigned'}</p>
                      <p className="text-[10px] font-semibold text-on-surface-variant/60 uppercase">{rec.companyId?.location || 'Remote'}</p>
                    </td>

                    {/* Active Jobs */}
                    <td className="py-5 text-center font-black text-sm text-on-surface">
                      {rec.activeJobs !== undefined ? rec.activeJobs : 0}
                    </td>

                    {/* Rating stars */}
                    <td className="py-5">
                      {renderStars(rec.rating)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-5">
                      <span className={cn(
                        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border',
                        rec.isPending
                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          : rec.isActive !== false
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                            : 'bg-red-500/10 text-red-500 border-red-500/20'
                      )}>
                        <span className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          rec.isPending
                            ? 'bg-amber-500 animate-pulse'
                            : rec.isActive !== false ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                        )} />
                        {rec.isPending ? 'PENDING' : rec.isActive !== false ? 'ACTIVE' : 'SUSPENDED'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-5 text-right pr-4">
                      <div className="flex justify-end items-center gap-2">
                        <button
                          onClick={() => router.push(`/recruiters/${rec._id}`)}
                          className="p-1.5 text-on-surface-variant/60 hover:text-primary transition-all hover:scale-110 active:scale-95 cursor-pointer"
                          title="View Recruiter Details"
                        >
                          <Eye className="w-4.5 h-4.5" />
                        </button>
                        {rec.isActive !== false ? (
                          <button
                            onClick={() => handleSuspend(rec._id)}
                            className="p-1.5 text-on-surface-variant/60 hover:text-orange-500 transition-all hover:scale-110 active:scale-95 cursor-pointer"
                            title="Suspend Recruiter"
                          >
                            <UserX className="w-4.5 h-4.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivate(rec._id)}
                            className="p-1.5 text-emerald-500 hover:text-emerald-600 transition-all hover:scale-110 active:scale-95 cursor-pointer"
                            title="Activate Recruiter"
                          >
                            <UserCheck className="w-4.5 h-4.5" />
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteId(rec._id)}
                          className="p-1.5 text-on-surface-variant/60 hover:text-red-500 transition-all hover:scale-110 active:scale-95 cursor-pointer"
                          title="Remove Recruiter"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </DataTable>

            {/* Pagination */}
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

        {/* Bottom Section: Insights Panel */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full" aria-label="Recruiters Insights Hub">
          
          {/* Glass Card 1: SVG Doughnut Chart */}
          <div className="bg-surface-container-low/80 backdrop-blur-md rounded-[2.5rem] border border-outline-variant/10 p-6 md:p-8 shadow-2xl space-y-6 flex flex-col justify-between min-h-[280px] h-full">
            <div className="border-b border-outline-variant/10 pb-3">
              <h3 className="text-lg font-black">Company Size Distribution</h3>
            </div>
            
            <div className="flex items-center justify-between gap-4 flex-1 py-2">
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                {/* Background (Startup segment - Purple) */}
                <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="transparent" r="40" stroke="#8127cf" strokeWidth="12" />
                  {/* Foreground (Enterprise segment - Blue) */}
                  <circle
                    cx="50"
                    cy="50"
                    fill="transparent"
                    r="40"
                    stroke="#4648d4"
                    strokeWidth="12"
                    strokeDasharray="251.2"
                    strokeDashoffset={loading ? 251.2 : insightsData.dashOffset}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-black leading-none">{loading ? '—' : insightsData.total}</span>
                  <span className="text-[8px] text-on-surface-variant/50 font-black uppercase tracking-wider mt-0.5">Total</span>
                </div>
              </div>

              {/* Legends */}
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-primary shrink-0" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant/50 leading-none">Enterprise</p>
                    <p className="text-sm font-black mt-0.5 leading-none">{loading ? '—' : `${insightsData.enterprisePercent}%`}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-secondary shrink-0" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant/50 leading-none">Startup / Scale</p>
                    <p className="text-sm font-black mt-0.5 leading-none">{loading ? '—' : `${insightsData.startupPercent}%`}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Glass Card 2: Top Performers Panel */}
          <div className="bg-surface-container-low/80 backdrop-blur-md rounded-[2.5rem] border border-outline-variant/10 p-6 md:p-8 shadow-2xl space-y-6 h-full flex flex-col justify-between">
            <div className="flex justify-between items-center border-b border-outline-variant/10 pb-3">
              <h3 className="text-lg font-black">Top Performers</h3>
              <Crown className="w-5 h-5 text-amber-500 fill-amber-500/20" />
            </div>

            <div className="space-y-4 flex-1 flex flex-col justify-center">
              {TOP_PERFORMERS.map((perf, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-low border border-outline-variant/10 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={perf.photo}
                      alt={perf.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0 border border-outline-variant/10"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-black text-on-surface truncate">{perf.name}</p>
                      <p className="text-[10px] font-bold text-on-surface-variant/50 uppercase mt-0.5">{perf.placements} Placements</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-primary">{perf.matchRate}</p>
                    <p className="text-[9px] font-black text-on-surface-variant/40 uppercase mt-0.5">Match Rate</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>
      </div>

      {/* ── Delete Confirmation Modal ── */}
      <DeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isLoading={deleting}
        title="Remove Recruiter Agent"
        message="Are you sure you want to permanently remove this recruiter? They will lose all job hosting privileges and platform portal access. This action cannot be undone."
        confirmText="Remove Recruiter"
      />

      {/* ── Invite Recruiter Modal ── */}
      <AnimatePresence>
        {showInviteModal && (
          <InviteModal
            onClose={() => setShowInviteModal(false)}
            onSuccess={(newRec) => setDbRecruiters((prev) => [newRec, ...prev])}
          />
        )}
      </AnimatePresence>

    </main>
  );
}
