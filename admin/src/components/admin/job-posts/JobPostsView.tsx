'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Briefcase,
  Search,
  Download,
  Trash2,
  Eye,
  Check,
  X,
  RefreshCw,
  Plus,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  Award,
  ChevronDown,
  Upload,
  Info,
  Sparkles,
  Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { jsPDF } from 'jspdf';
import { useRouter } from 'next/navigation';

// Services
import { adminService } from '@/lib/services/admin.services';
import { jobService, Job } from '@/lib/services/job.services';
import { AuthUser } from '@/lib/apiClient';
import { useAuth } from '@/hooks/useAuth';

// Common Components
import StatsCard from '@/components/common/StatsCard';
import DataTable from '@/components/common/DataTable';
import Pagination from '@/components/common/Pagination';
import DeleteModal from '@/components/common/DeleteModal';
import Button from '@/components/common/Button';
import StatusBadge from '@/components/common/StatusBadge';
import toast from 'react-hot-toast';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatDate = (date?: string) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();
};

const CATEGORIES = [
  'Software Engineering',
  'Data Science',
  'UI/UX Design',
  'DevOps',
  'Product Management',
  'Marketing',
  'Finance',
  'Sales',
  'HR'
];

const JOB_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship'
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function JobPostsView() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [recruiters, setRecruiters] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Filters & Tabs
  const [activeTab, setActiveTab] = useState('ALL JOBS');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  // Modal States
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Form State
  const [form, setForm] = useState({
    title: '',
    description: '',
    requirements: '', // Comma separated
    salary: '',
    location: '',
    jobType: 'Full-time',
    experience: 0,
    category: 'Software Engineering',
    companyId: '',
    postedBy: '',
    perks: '' // Comma separated
  });

  // ─── Fetch Data ────────────────────────────────────────────────────────────

  const fetchData = async () => {
    setLoading(true);
    const startTime = Date.now();
    try {
      const [resJobs, resUsers] = await Promise.all([
        jobService.getAllJobs(),
        adminService.getAllUsers()
      ]);

      const elapsedTime = Date.now() - startTime;
      const minDelay = 1500;
      if (elapsedTime < minDelay) {
        await new Promise((resolve) => setTimeout(resolve, minDelay - elapsedTime));
      }

      if (resJobs.success) {
        setJobs(resJobs.data || []);
      }
      if (resUsers.success) {
        setRecruiters((resUsers.data || []).filter(u => u.role === 'recruiter' || u.role === 'admin'));
      }
    } catch (err) {
      toast.error('Failed to load job postings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Extract unique companies from recruiters list
  const companies = useMemo(() => {
    const companyMap = new Map<string, { _id: string; name: string; location: string; logo?: string }>();
    
    // Add default platform company
    companyMap.set('default', {
      _id: 'default',
      name: 'AIJobFit Core',
      location: 'San Francisco, CA',
      logo: '/images/logo/logo.png'
    });

    recruiters.forEach((u) => {
      if (u.companyId) {
        const comp = u.companyId as any;
        if (comp && comp._id) {
          companyMap.set(comp._id, {
            _id: comp._id,
            name: comp.name || 'Unassigned',
            location: comp.location || 'Remote',
            logo: comp.logo
          });
        }
      }
    });

    // Also parse from current jobs to catch any missing populated items
    jobs.forEach((j) => {
      if (j.companyId && typeof j.companyId === 'object' && j.companyId._id) {
        companyMap.set(j.companyId._id, {
          _id: j.companyId._id,
          name: j.companyId.name || 'Unassigned',
          location: j.companyId.location || j.location || 'Remote',
          logo: j.companyId.logo
        });
      }
    });

    return Array.from(companyMap.values());
  }, [recruiters, jobs]);

  // ─── Stats calculation ────────────────────────────────────────────────────

  const stats = useMemo(() => {
    const total = jobs.length;
    const active = jobs.filter(j => j.status?.toUpperCase() === 'APPROVED' || j.status?.toUpperCase() === 'ACTIVE').length;
    const pending = jobs.filter(j => j.status?.toUpperCase() === 'PENDING' || !j.status).length;
    const expired = jobs.filter(j => j.status?.toUpperCase() === 'REJECTED' || j.status?.toUpperCase() === 'EXPIRED').length;

    return { total, active, pending, expired };
  }, [jobs]);

  // ─── Filter & Paginated Logic ─────────────────────────────────────────────

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // 1. Status Tab Filter
      const status = job.status?.toUpperCase() || 'PENDING';
      if (activeTab === 'ACTIVE' && status !== 'APPROVED' && status !== 'ACTIVE') return false;
      if (activeTab === 'PENDING' && status !== 'PENDING') return false;
      if (activeTab === 'EXPIRED' && status !== 'REJECTED' && status !== 'EXPIRED') return false;

      // 2. Category Filter
      if (categoryFilter !== 'all' && job.category !== categoryFilter) return false;

      // 3. Search query (title, location, company name)
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const compName = typeof job.companyId === 'object' && job.companyId ? job.companyId.name || '' : '';
        const matchTitle = job.title?.toLowerCase().includes(query);
        const matchLocation = job.location?.toLowerCase().includes(query);
        const matchCompany = compName.toLowerCase().includes(query);
        return matchTitle || matchLocation || matchCompany;
      }

      return true;
    });
  }, [jobs, activeTab, categoryFilter, searchQuery]);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const currentJobs = useMemo(() => {
    return filteredJobs.slice(
      (currentPage - 1) * jobsPerPage,
      currentPage * jobsPerPage
    );
  }, [filteredJobs, currentPage, jobsPerPage]);

  // Reset page when tab/search/category filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, categoryFilter]);

  // Tab Badge counts
  const pendingCount = useMemo(() => jobs.filter(j => j.status?.toUpperCase() === 'PENDING' || !j.status).length, [jobs]);

  // ─── Add/Edit form helper ──────────────────────────────────────────────────

  const openAddModal = () => {
    setEditingJob(null);
    setForm({
      title: '',
      description: '',
      requirements: '',
      salary: '',
      location: '',
      jobType: 'Full-time',
      experience: 0,
      category: 'Software Engineering',
      companyId: companies[0]?._id || 'default',
      postedBy: currentUser?._id || '',
      perks: ''
    });
    setShowAddEditModal(true);
  };

  const openEditModal = (job: Job) => {
    setEditingJob(job);
    const compId = typeof job.companyId === 'object' ? job.companyId?._id : job.companyId;
    setForm({
      title: job.title || '',
      description: job.description || '',
      requirements: job.requirements ? job.requirements.join(', ') : '',
      salary: job.salary || '',
      location: job.location || '',
      jobType: job.jobType && job.jobType.length > 0 ? job.jobType[0] : 'Full-time',
      experience: job.experience || 0,
      category: job.category || 'Software Engineering',
      companyId: compId || 'default',
      postedBy: job.postedBy || currentUser?._id || '',
      perks: job.perks ? job.perks.join(', ') : ''
    });
    setShowAddEditModal(true);
  };

  // ─── Actions ──────────────────────────────────────────────────────────────

  const handleApproveJob = async (id: string) => {
    try {
      const res = await jobService.approveJob(id);
      if (res.success) {
        toast.success('Job posting approved successfully');
        setJobs(prev => prev.map(j => j._id === id ? { ...j, status: 'APPROVED' } : j));
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to approve job');
    }
  };

  const handleDeleteJob = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await jobService.deleteJob(deleteId);
      if (res.success) {
        setJobs(prev => prev.filter(j => j._id !== deleteId));
        toast.success('Job post deleted successfully');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete job');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.location.trim() || !form.category.trim()) {
      return toast.error('Please fill in all required fields');
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        requirements: form.requirements.split(',').map(r => r.trim()).filter(Boolean),
        perks: form.perks.split(',').map(p => p.trim()).filter(Boolean),
        jobType: [form.jobType],
        // If companyId is 'default', register company or link it
        companyId: form.companyId === 'default' ? recruiters[0]?.companyId || recruiters[0]?._id : form.companyId
      };

      if (editingJob) {
        const res = await jobService.updateJob(editingJob._id, payload);
        if (res.success) {
          toast.success('Job post updated successfully');
          fetchData(); // reload
          setShowAddEditModal(false);
        }
      } else {
        const res = await jobService.postJob(payload);
        if (res.success) {
          toast.success('Job posted successfully');
          fetchData(); // reload
          setShowAddEditModal(false);
        }
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save job post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkFile) return toast.error('Please select a CSV file');

    setImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', bulkFile);
      const res = await adminService.importBulkJobs(formData);
      if (res.success) {
        toast.success(res.message || 'Jobs imported successfully');
        fetchData();
        setShowBulkImportModal(false);
        setBulkFile(null);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to import bulk jobs');
    } finally {
      setImporting(false);
    }
  };

  // ─── Exports ──────────────────────────────────────────────────────────────

  const handleExportCSV = () => {
    if (jobs.length === 0) return toast.error('No data to export');
    
    const headers = ['Job Title', 'Company', 'Category', 'Job Type', 'Location', 'Salary', 'Experience (Years)', 'Applicants', 'Status', 'Date Posted'];
    const rows = jobs.map(j => {
      const compName = typeof j.companyId === 'object' ? j.companyId?.name || '' : '';
      const status = j.status || 'PENDING';
      const applicantsCount = j.applications ? j.applications.length : 0;
      return [
        `"${j.title || ''}"`,
        `"${compName || ''}"`,
        `"${j.category || ''}"`,
        `"${j.jobType ? j.jobType.join('/') : ''}"`,
        `"${j.location || ''}"`,
        `"${j.salary || ''}"`,
        `"${j.experience || 0}"`,
        `"${applicantsCount}"`,
        `"${status}"`,
        `"${j.createdAt ? new Date(j.createdAt).toLocaleDateString() : ''}"`
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `job_posts_export_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV downloaded successfully');
  };

  const handleExportPDF = async () => {
    if (jobs.length === 0) return toast.error('No data to export');
    
    const toastId = toast.loading('Generating PDF report...');
    try {
      const doc = new jsPDF('landscape', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Filter duplicates
      const uniqueJobs = Array.from(new Map(jobs.map(j => [j._id, j])).values());

      // Load watermark logo
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
        if (logoImg.complete && logoImg.naturalWidth > 0) {
          doc.saveGraphicsState();
          doc.setGState(new (doc as any).GState({ opacity: 0.06 }));
          const imgWidth = 140;
          const imgHeight = (logoImg.naturalHeight / logoImg.naturalWidth) * imgWidth;
          doc.addImage(logoImg, 'PNG', (pageWidth - imgWidth) / 2, (pageHeight - imgHeight) / 2, imgWidth, imgHeight);
          doc.restoreGraphicsState();
        }

        if (isFirstPage) {
          // Draw Banner Header
          doc.setFillColor(70, 72, 212); // Primary Theme Color
          doc.rect(0, 0, pageWidth, 26, 'F');

          // Accent strip
          doc.setFillColor(129, 39, 207); // Secondary Color
          doc.rect(0, 26, pageWidth, 1.5, 'F');

          doc.setTextColor(255, 255, 255);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(16);
          doc.text('AI JOBFIT - JOB POOL DIRECTORY AUDIT REPORT', 14, 11);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.5);
          doc.setTextColor(220, 230, 255);
          doc.text(`Generated on: ${new Date().toLocaleString()} | Total Job Posts: ${uniqueJobs.length} | Super Admin Operations`, 14, 18);
        } else {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(100, 100, 100);
          doc.text(`AI JOBFIT - JOB POOL DIRECTORY AUDIT REPORT (Page Header)`, 14, 10);
          
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text(`Total Job Posts: ${uniqueJobs.length}`, pageWidth - 14, 10, { align: 'right' });

          doc.setDrawColor(220, 220, 230);
          doc.setLineWidth(0.3);
          doc.line(14, 12, pageWidth - 14, 12);
        }
      };

      const drawTableHeader = (currentY: number) => {
        // Draw Header background
        doc.setFillColor(30, 27, 75); // Dark Navy
        doc.rect(14, currentY - 5, 269, 8, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(255, 255, 255);
        doc.text('#', 16, currentY);
        doc.text('Job Title', 24, currentY);
        doc.text('Company', 80, currentY);
        doc.text('Category', 135, currentY);
        doc.text('Location', 185, currentY);
        doc.text('Salary', 222, currentY);
        doc.text('Apps', 252, currentY);
        doc.text('Status', 266, currentY);
      };

      drawPageDecorations(true);
      let y = 42;
      drawTableHeader(y);
      y += 8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);

      uniqueJobs.forEach((job, index) => {
        if (y > 185) {
          doc.addPage();
          drawPageDecorations(false);
          y = 22;
          drawTableHeader(y);
          y += 8;
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
        }

        const title = (job.title || '').substring(0, 25);
        const company = (typeof job.companyId === 'object' ? job.companyId?.name || '' : '').substring(0, 22);
        const category = (job.category || '').substring(0, 22);
        const location = (job.location || '').substring(0, 16);
        const salary = (job.salary || '—').substring(0, 14);
        const apps = String(job.applications ? job.applications.length : 0);
        const status = job.status || 'PENDING';

        // Draw light bottom border
        doc.setDrawColor(230, 230, 240);
        doc.setLineWidth(0.2);
        doc.line(14, y + 2, 283, y + 2);

        doc.setTextColor(120, 120, 120);
        doc.text(String(index + 1), 16, y);

        doc.setTextColor(60, 60, 60);
        doc.text(title, 24, y);
        doc.text(company, 80, y);
        doc.text(category, 135, y);
        doc.text(location, 185, y);
        doc.text(salary, 222, y);
        doc.text(apps, 252, y);

        // Print status with custom color
        if (status.toUpperCase() === 'APPROVED' || status.toUpperCase() === 'ACTIVE') {
          doc.setTextColor(16, 185, 129); // Green
        } else if (status.toUpperCase() === 'PENDING') {
          doc.setTextColor(245, 158, 11); // Amber
        } else {
          doc.setTextColor(239, 68, 68); // Red
        }
        doc.text(status, 266, y);

        y += 8;
      });

      // Add page footers
      const pageCount = (doc.internal as any).getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 14, pageHeight - 8, { align: 'right' });
        doc.text('AI JobFit © 2026. Confidential Platform Directory Report.', 14, pageHeight - 8);
      }

      doc.save(`job_posts_report_${Date.now()}.pdf`);
      toast.success('PDF report downloaded successfully', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF report', { id: toastId });
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <main className="w-full space-y-10 animate-in fade-in duration-700 text-on-surface" id="main-job-posts-management" aria-label="Job Postings Audit Dashboard">
      
      {/* ── Page Header ── */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight mb-2">Job Postings Management</h1>
          <p className="text-on-surface-variant font-medium">Audit company job listings, approve pending postings, and moderate candidate search channels.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Post New Job Button */}
          <Button
            variant="gradient"
            onClick={openAddModal}
            className="shadow-lg shadow-primary/20 hover:shadow-primary/40 text-white font-black"
            aria-label="Post new job"
          >
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>

          {/* Bulk Import Button */}
          <Button
            variant="outline"
            onClick={() => setShowBulkImportModal(true)}
            className="border-outline-variant hover:bg-surface-container font-bold text-on-surface"
            aria-label="Bulk import jobs"
          >
            <Upload className="w-4 h-4 mr-2" />
            Bulk Import
          </Button>

          {/* Export Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="border-outline-variant hover:bg-surface-container font-bold text-on-surface"
              aria-label="Export job postings report"
            >
              <Download className="w-4 h-4 mr-2" />
              <span>Export</span>
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

      {/* ── Stats Bento Grid ── */}
      <section className="grid grid-cols-2 xl:grid-cols-4 gap-6" aria-label="Job Posting Pool Statistics">
        <StatsCard
          label="Total Job Posts"
          value={loading ? '—' : stats.total.toLocaleString()}
          icon={Briefcase}
          lineClass="bg-primary"
          iconBg="bg-primary/10"
          iconColor="text-primary"
          progressPercent={100}
        />
        <StatsCard
          label="Active Postings"
          value={loading ? '—' : stats.active.toLocaleString()}
          icon={Check}
          lineClass="bg-emerald-500"
          iconBg="bg-emerald-500/10"
          iconColor="text-emerald-500"
          progressPercent={stats.total ? Math.round((stats.active / stats.total) * 100) : 0}
        />
        <StatsCard
          label="Pending Approval"
          value={loading ? '—' : stats.pending.toLocaleString()}
          icon={Info}
          lineClass="bg-amber-500"
          iconBg="bg-amber-500/10"
          iconColor="text-amber-500"
          progressPercent={stats.total ? Math.round((stats.pending / stats.total) * 100) : 0}
        />
        <StatsCard
          label="Expired / Closed"
          value={loading ? '—' : stats.expired.toLocaleString()}
          icon={X}
          lineClass="bg-red-500"
          iconBg="bg-red-500/10"
          iconColor="text-red-500"
          progressPercent={stats.total ? Math.round((stats.expired / stats.total) * 100) : 0}
        />
      </section>

      {/* ── Main Dashboard Layout ── */}
      <section aria-label="Jobs Repository Table">
        <div className="bg-surface-container-low/80 backdrop-blur-md rounded-[2.5rem] border border-outline-variant/10 p-6 md:p-10 shadow-2xl space-y-8">
          
          {/* Header & Filter Toolbar */}
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-on-surface tracking-tight">Active Pools</h2>
                <span className="h-4 w-1 bg-gradient-to-b from-primary to-secondary rounded-full" />
                {!loading && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                    {filteredJobs.length} Posting{filteredJobs.length !== 1 && 's'}
                  </span>
                )}
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 mt-1 flex items-center gap-1.5">
                <span className={cn("w-2 h-2 rounded-full bg-emerald-500", loading ? "animate-pulse" : "animate-ping")} />
                {loading ? "Syncing Directory..." : "Job Feeds Live"}
              </p>
            </div>

            {/* Navigation Filter Tabs */}
            <div className="flex items-center overflow-x-auto flex-nowrap bg-surface-container-low/50 p-1.5 rounded-2xl border border-outline-variant/10 max-w-full no-scrollbar">
              {[
                { id: 'ALL JOBS', label: 'ALL JOBS', badge: null },
                { id: 'ACTIVE', label: 'ACTIVE', badge: stats.active },
                { id: 'PENDING', label: 'PENDING', badge: pendingCount > 0 ? pendingCount : null },
                { id: 'EXPIRED', label: 'EXPIRED / CLOSED', badge: null }
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
                  {tab.badge !== null && (
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-black shrink-0",
                      activeTab === tab.id ? "bg-black/20 text-white" : "bg-primary/10 text-primary"
                    )}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto shrink-0">
              {/* Category Filter Dropdown */}
              <div className="relative flex-1 xl:flex-none">
                <select
                  value={categoryFilter}
                  disabled={loading}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="appearance-none w-full xl:w-48 pl-4 pr-10 py-3 bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl text-sm focus:outline-none focus:border-primary/50 text-on-surface transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <option value="all">ALL CATEGORIES</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-on-surface-variant/60 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Search input */}
              <div className="relative flex-1 xl:flex-none">
                <Search className="w-4 h-4 text-on-surface-variant/60 absolute left-4 top-1/2 -translate-y-1/2" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search job titles, locations..."
                  value={searchQuery}
                  disabled={loading}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full xl:w-64 pl-10 pr-4 py-3 bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl text-sm focus:outline-none focus:border-primary/50 text-on-surface placeholder-on-surface-variant/40 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Refresh button */}
              <button
                onClick={fetchData}
                disabled={loading}
                className="p-3 rounded-2xl bg-surface-container-low/50 hover:bg-surface-container-high border border-outline-variant/20 text-on-surface-variant transition-all hover:scale-105 active:scale-95 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                title="Refresh feed"
              >
                <RefreshCw className={cn("w-4.5 h-4.5", loading && "animate-spin")} />
              </button>
            </div>
          </div>

          {/* DataTable */}
          <DataTable
            columns={[
              { header: 'Job Title & Company' },
              { header: 'Category' },
              { header: 'Status' },
              { header: 'Date Posted' },
              { header: 'Applicants', className: 'text-center' },
              { header: 'Actions', className: 'text-right pr-4' }
            ]}
            isLoading={false} // Custom skeletons
            isEmpty={!loading && filteredJobs.length === 0}
            emptyTitle="No Job Postings Found"
            emptyDesc="Try adjusting your search filters or status tab."
          >
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={`skeleton-${idx}`} className="animate-pulse border-b border-outline-variant/5 last:border-0">
                  <td className="py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-on-surface/10 shrink-0" />
                      <div className="space-y-2 min-w-0 flex-1">
                        <div className="h-4.5 bg-on-surface/10 rounded-md w-40" />
                        <div className="h-3 bg-on-surface/5 rounded-md w-28" />
                      </div>
                    </div>
                  </td>
                  <td className="py-5">
                    <div className="h-6 bg-on-surface/10 rounded-lg w-28" />
                  </td>
                  <td className="py-5">
                    <div className="h-6 bg-on-surface/10 rounded-full w-20" />
                  </td>
                  <td className="py-5">
                    <div className="h-3.5 bg-on-surface/10 rounded-md w-24" />
                  </td>
                  <td className="py-5">
                    <div className="h-6 bg-on-surface/10 rounded-full w-14 mx-auto" />
                  </td>
                  <td className="py-5 text-right pr-4">
                    <div className="flex justify-end items-center gap-3">
                      <div className="w-7 h-7 bg-on-surface/10 rounded-lg" />
                      <div className="w-7 h-7 bg-on-surface/10 rounded-lg" />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              currentJobs.map((job) => {
                const compObj = typeof job.companyId === 'object' ? job.companyId : null;
                const companyName = compObj ? compObj.name : 'Platform Admin Corp';
                const companyLogo = compObj?.logo || '/images/logo/logo.png';
                const status = job.status?.toUpperCase() || 'PENDING';
                const isPending = status === 'PENDING';
                const applicantsCount = job.applications ? job.applications.length : 0;

                return (
                  <tr
                    key={job._id}
                    className="group hover:bg-surface-container-low/20 transition-all border-b border-outline-variant/5 last:border-0"
                  >
                    {/* Title & Company */}
                    <td className="py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white border border-outline-variant/20 p-1 flex items-center justify-center">
                          <img
                            alt={`${companyName} Logo`}
                            src={companyLogo}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/logo/logo.png';
                            }}
                          />
                        </div>
                        <div>
                          <p
                            onClick={() => {
                              setSelectedJob(job);
                              setShowDetailModal(true);
                            }}
                            className="font-black text-on-surface hover:text-primary transition-colors cursor-pointer truncate text-base leading-tight mb-0.5"
                          >
                            {job.title}
                          </p>
                          <p className="text-xs text-on-surface-variant/60 font-semibold truncate select-all">
                            {companyName} • {job.location || 'Remote'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-lg">
                        {job.category || 'Software Engineering'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-5">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border",
                        (status === 'APPROVED' || status === 'ACTIVE')
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : isPending
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            : "bg-red-500/10 text-red-500 border-red-500/20"
                      )}>
                        <span className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          (status === 'APPROVED' || status === 'ACTIVE')
                            ? "bg-emerald-500 animate-pulse"
                            : isPending
                              ? "bg-amber-500"
                              : "bg-red-500"
                        )} />
                        {status}
                      </span>
                    </td>

                    {/* Date Posted */}
                    <td className="py-5 text-xs font-black text-on-surface-variant/75 uppercase">
                      {formatDate(job.createdAt)}
                    </td>

                    {/* Applicants Count */}
                    <td className="py-5 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 bg-surface-container rounded-full text-xs font-black text-primary border border-outline-variant/10">
                        {applicantsCount}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-5 text-right pr-4">
                      <div className="flex justify-end items-center gap-2.5">
                        <button
                          onClick={() => {
                            setSelectedJob(job);
                            setShowDetailModal(true);
                          }}
                          className="p-1.5 text-on-surface-variant/60 hover:text-primary transition-all hover:scale-110 active:scale-95 cursor-pointer"
                          title="View job details"
                        >
                          <Eye className="w-4.5 h-4.5" />
                        </button>

                        {isPending && (
                          <button
                            onClick={() => handleApproveJob(job._id)}
                            className="p-1.5 text-on-surface-variant/60 hover:text-emerald-500 transition-all hover:scale-110 active:scale-95 cursor-pointer"
                            title="Approve posting"
                          >
                            <Check className="w-4.5 h-4.5" />
                          </button>
                        )}

                        <button
                          onClick={() => openEditModal(job)}
                          className="p-1.5 text-on-surface-variant/60 hover:text-secondary transition-all hover:scale-110 active:scale-95 cursor-pointer"
                          title="Edit job details"
                        >
                          <Edit2 className="w-4.5 h-4.5" />
                        </button>

                        <button
                          onClick={() => setDeleteId(job._id)}
                          className="p-1.5 text-on-surface-variant/60 hover:text-red-500 transition-all hover:scale-110 active:scale-95 cursor-pointer"
                          title="Delete posting"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
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

      {/* ── Bottom Section Layout (AI Insights & Queues) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* AI Insight Card */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 bg-primary/10 rounded-bl-3xl flex items-center gap-1.5 text-[9px] font-black uppercase text-primary tracking-wider border-l border-b border-primary/20">
            <Sparkles className="w-3.5 h-3.5" /> AI Insight
          </div>
          <div className="w-full md:w-44 h-28 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 flex-shrink-0 flex items-center justify-center border border-outline-variant/20">
            <Briefcase className="w-12 h-12 text-primary" />
          </div>
          <div>
            <h4 className="text-xl font-black text-on-surface mb-2">Job Post Optimization Suggestion</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
              Your software engineering posts are receiving high bounce rates. Consider adding specific keyword filters (e.g. Next.js, Node.js) and clarifying day-to-day requirements to filter candidates more effectively.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success('AI Audit initialized in candidate portal.')}
              className="border-primary/20 hover:border-primary/40 hover:bg-primary/5 text-primary text-xs font-black"
            >
              Analyze Active Requirements
            </Button>
          </div>
        </div>

        {/* Approval Queue Summarizer */}
        <div className="glass-card rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-outline-variant/10 pb-3">
              <h4 className="font-black text-base text-on-surface uppercase tracking-wider">Approval Queue</h4>
              <span className="px-2 py-0.5 text-[10px] font-black bg-amber-500/10 text-amber-500 rounded-full">
                {pendingCount} Pending
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
              Moderate postings submitted by recruiters. Approved jobs are immediately displayed on the candidate web portal search engine.
            </p>
          </div>
          <Button
            variant="gradient"
            onClick={() => setActiveTab('PENDING')}
            className="w-full font-black text-white py-3 shadow-lg shadow-primary/10"
          >
            Review Pending Queue
          </Button>
        </div>
      </div>

      {/* ── Add / Edit Job Modal ── */}
      <AnimatePresence>
        {showAddEditModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div onClick={() => setShowAddEditModal(false)} className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="relative w-full max-w-2xl bg-card border border-outline-variant/30 rounded-3xl shadow-2xl z-10 overflow-hidden text-on-surface max-h-[90vh] flex flex-col"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-secondary" />

              <div className="flex items-center justify-between p-6 border-b border-outline-variant/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black">{editingJob ? 'Edit Job Posting' : 'Post New Job'}</h3>
                    <p className="text-xs text-on-surface-variant/60 font-medium">Define role requirements, location workspace, and salary details</p>
                  </div>
                </div>
                <button onClick={() => setShowAddEditModal(false)} className="p-1.5 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer">
                  <X className="w-5 h-5 text-on-surface-variant/60" />
                </button>
              </div>

              <form onSubmit={handleSubmitForm} className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Title & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Job Title *</label>
                    <input
                      type="text"
                      placeholder="e.g. Senior React Developer"
                      value={form.title}
                      onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                      className="w-full px-4 py-3 bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl text-sm focus:outline-none focus:border-primary/50 text-on-surface placeholder-on-surface-variant/30 transition-all font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Category *</label>
                    <div className="relative">
                      <select
                        value={form.category}
                        onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                        className="w-full pl-4 pr-10 py-3 bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl text-sm focus:outline-none focus:border-primary/50 text-on-surface transition-all font-medium cursor-pointer appearance-none"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-on-surface-variant/60 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Company & Recruiter */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Company *</label>
                    <div className="relative">
                      <select
                        value={form.companyId}
                        onChange={(e) => setForm((p) => ({ ...p, companyId: e.target.value }))}
                        className="w-full pl-4 pr-10 py-3 bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl text-sm focus:outline-none focus:border-primary/50 text-on-surface transition-all font-medium cursor-pointer appearance-none"
                      >
                        {companies.map(c => (
                          <option key={c._id} value={c._id}>{c.name} ({c.location})</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-on-surface-variant/60 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Assigned Recruiter / Owner *</label>
                    <div className="relative">
                      <select
                        value={form.postedBy}
                        onChange={(e) => setForm((p) => ({ ...p, postedBy: e.target.value }))}
                        className="w-full pl-4 pr-10 py-3 bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl text-sm focus:outline-none focus:border-primary/50 text-on-surface transition-all font-medium cursor-pointer appearance-none"
                      >
                        <option value={currentUser?._id}>SUPER ADMIN (Self)</option>
                        {recruiters.map(r => (
                          <option key={r._id} value={r._id}>{r.fullname} ({r.email})</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-on-surface-variant/60 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Location & Salary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Location *</label>
                    <input
                      type="text"
                      placeholder="e.g. Remote / Seattle, WA"
                      value={form.location}
                      onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                      className="w-full px-4 py-3 bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl text-sm focus:outline-none focus:border-primary/50 text-on-surface placeholder-on-surface-variant/30 transition-all font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Salary Range</label>
                    <input
                      type="text"
                      placeholder="e.g. $120k - $155k"
                      value={form.salary}
                      onChange={(e) => setForm((p) => ({ ...p, salary: e.target.value }))}
                      className="w-full px-4 py-3 bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl text-sm focus:outline-none focus:border-primary/50 text-on-surface placeholder-on-surface-variant/30 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Experience Needed (Years)</label>
                    <input
                      type="number"
                      placeholder="e.g. 3"
                      value={form.experience}
                      onChange={(e) => setForm((p) => ({ ...p, experience: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-3 bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl text-sm focus:outline-none focus:border-primary/50 text-on-surface placeholder-on-surface-variant/30 transition-all font-medium"
                      min={0}
                    />
                  </div>
                </div>

                {/* Job Type */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Job Type</label>
                  <div className="flex flex-wrap gap-2">
                    {JOB_TYPES.map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setForm(p => ({ ...p, jobType: type }))}
                        className={cn(
                          "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border cursor-pointer transition-all",
                          form.jobType === type
                            ? "bg-primary text-white border-primary shadow-md shadow-primary/10"
                            : "bg-surface-container-low/50 border-outline-variant/20 text-on-surface-variant hover:text-on-surface"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Job Description *</label>
                  <textarea
                    placeholder="Provide a detailed description of the role, expected deliverables, and team context..."
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl text-sm focus:outline-none focus:border-primary/50 text-on-surface placeholder-on-surface-variant/30 transition-all font-medium h-32 resize-none"
                    required
                  />
                </div>

                {/* Requirements */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Requirements (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. React, Node.js, TypeScript, Next.js"
                    value={form.requirements}
                    onChange={(e) => setForm((p) => ({ ...p, requirements: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl text-sm focus:outline-none focus:border-primary/50 text-on-surface placeholder-on-surface-variant/30 transition-all font-medium"
                  />
                </div>

                {/* Perks */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Perks & Benefits (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Health Insurance, Remote Workspace, Stock Options"
                    value={form.perks}
                    onChange={(e) => setForm((p) => ({ ...p, perks: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl text-sm focus:outline-none focus:border-primary/50 text-on-surface placeholder-on-surface-variant/30 transition-all font-medium"
                  />
                </div>
              </form>

              <div className="p-6 border-t border-outline-variant/10 flex gap-3 shrink-0">
                <Button variant="outline" size="md" type="button" onClick={() => setShowAddEditModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button variant="gradient" size="md" type="submit" onClick={handleSubmitForm} isLoading={submitting} className="flex-1 font-black text-white">
                  {editingJob ? 'Save Changes' : 'Create Job Post'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Detail View Modal ── */}
      <AnimatePresence>
        {showDetailModal && selectedJob && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div onClick={() => setShowDetailModal(false)} className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="relative w-full max-w-xl bg-card border border-outline-variant/30 rounded-3xl shadow-2xl z-10 overflow-hidden text-on-surface max-h-[85vh] flex flex-col"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-secondary" />

              <div className="flex items-center justify-between p-6 border-b border-outline-variant/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black">Role Specification</h3>
                    <p className="text-xs text-on-surface-variant/60 font-medium">Complete listing details registered on platform</p>
                  </div>
                </div>
                <button onClick={() => setShowDetailModal(false)} className="p-1.5 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer">
                  <X className="w-5 h-5 text-on-surface-variant/60" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Basic Meta Header */}
                <div className="bg-surface-container-low/50 p-5 rounded-2xl border border-outline-variant/10">
                  <h4 className="text-2xl font-black tracking-tight leading-tight">{selectedJob.title}</h4>
                  <p className="text-xs text-on-surface-variant/80 font-bold mt-1">
                    {typeof selectedJob.companyId === 'object' ? selectedJob.companyId?.name : 'Platform Admin Corp'}
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-outline-variant/10 text-xs text-on-surface-variant/90">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{selectedJob.location || 'Remote'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-emerald-500" />
                      <span>{selectedJob.salary || '—'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-secondary" />
                      <span>Posted: {formatDate(selectedJob.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <h5 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Job Description</h5>
                  <p className="text-sm leading-relaxed whitespace-pre-line text-on-surface/90 bg-surface-container-low/20 p-4 rounded-xl border border-outline-variant/5">
                    {selectedJob.description}
                  </p>
                </div>

                {/* Requirements */}
                {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Technical Requirements</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedJob.requirements.map((req, i) => (
                        <span key={i} className="px-3 py-1 bg-surface-container rounded-lg text-xs font-semibold text-on-surface">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Perks */}
                {selectedJob.perks && selectedJob.perks.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Perks & Benefits</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedJob.perks.map((perk, i) => (
                        <span key={i} className="px-3 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-lg text-xs font-semibold">
                          {perk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Audit Context */}
                <div className="grid grid-cols-2 gap-4 text-xs bg-surface-container-low/40 p-4 rounded-2xl border border-outline-variant/10 text-on-surface-variant/80">
                  <div>
                    <span className="block font-black text-[9px] uppercase tracking-wider text-on-surface-variant/40">Category Pool</span>
                    <span className="font-semibold text-on-surface">{selectedJob.category}</span>
                  </div>
                  <div>
                    <span className="block font-black text-[9px] uppercase tracking-wider text-on-surface-variant/40">Experience Required</span>
                    <span className="font-semibold text-on-surface">{selectedJob.experience || 0} Years</span>
                  </div>
                  <div>
                    <span className="block font-black text-[9px] uppercase tracking-wider text-on-surface-variant/40">Registered Applicants</span>
                    <span className="font-semibold text-on-surface">{selectedJob.applications ? selectedJob.applications.length : 0}</span>
                  </div>
                  <div>
                    <span className="block font-black text-[9px] uppercase tracking-wider text-on-surface-variant/40">Approval Status</span>
                    <span className="font-bold text-on-surface">{selectedJob.status || 'PENDING'}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-outline-variant/10 flex gap-3 shrink-0">
                <Button variant="outline" size="md" onClick={() => setShowDetailModal(false)} className="w-full">
                  Close
                </Button>
                {selectedJob.status?.toUpperCase() === 'PENDING' && (
                  <Button
                    variant="gradient"
                    size="md"
                    onClick={() => {
                      handleApproveJob(selectedJob._id);
                      setShowDetailModal(false);
                    }}
                    className="w-full font-black text-white"
                  >
                    Approve Post
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Bulk Import Modal ── */}
      <AnimatePresence>
        {showBulkImportModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div onClick={() => setShowBulkImportModal(false)} className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="relative w-full max-w-md bg-card border border-outline-variant/30 rounded-3xl shadow-2xl z-10 overflow-hidden text-on-surface"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-secondary" />

              <div className="flex items-center justify-between p-6 border-b border-outline-variant/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black">Bulk Import Job Posts</h3>
                    <p className="text-xs text-on-surface-variant/60 font-medium">Upload a CSV file containing job listings</p>
                  </div>
                </div>
                <button onClick={() => setShowBulkImportModal(false)} className="p-1.5 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer">
                  <X className="w-5 h-5 text-on-surface-variant/60" />
                </button>
              </div>

              <form onSubmit={handleBulkImport} className="p-6 space-y-6">
                
                {/* CSV File Upload Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Select CSV File *</label>
                  <div className="border-2 border-dashed border-outline-variant/40 rounded-2xl p-6 flex flex-col items-center justify-center bg-surface-container-low/20 transition-all hover:bg-surface-container-low/50">
                    <Upload className="w-8 h-8 text-on-surface-variant/50 mb-2" />
                    
                    {bulkFile ? (
                      <div className="text-center">
                        <p className="text-sm font-bold text-on-surface">{bulkFile.name}</p>
                        <p className="text-[10px] text-on-surface-variant/60">{(bulkFile.size / 1024).toFixed(1)} KB</p>
                        <button
                          type="button"
                          onClick={() => setBulkFile(null)}
                          className="mt-2 text-xs font-black text-red-500 hover:text-red-600 transition-colors uppercase tracking-wider"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <label className="cursor-pointer text-xs font-black text-primary hover:underline uppercase tracking-wider block">
                          Browse CSV File
                          <input
                            type="file"
                            accept=".csv"
                            onChange={(e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                setBulkFile(e.target.files[0]);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                        <p className="text-[10px] text-on-surface-variant/40 mt-1">Accepts standard .csv with columns: title, description, requirements (comma-separated), salary, location, jobType, experience, category, companyId</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" size="md" type="button" onClick={() => setShowBulkImportModal(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button variant="gradient" size="md" type="submit" isLoading={importing} className="flex-1 font-black text-white">
                    Import Jobs
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirmation Modal ── */}
      <DeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteJob}
        isLoading={deleting}
        title="Delete Job Posting"
        message="Are you sure you want to permanently delete this job posting? Candidates will no longer be able to discover or apply to this role. This action cannot be undone."
        confirmText="Delete Posting"
      />
    </main>
  );
}
