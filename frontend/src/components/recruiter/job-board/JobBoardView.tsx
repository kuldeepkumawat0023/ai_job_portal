'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  Users,
  Calendar,
  Plus,
  Sparkles,
  Search,
  MapPin,
  Building2,
  ArrowUpRight,
  Edit3,
  Eye,
  MoreVertical,
  ChevronRight,
  CheckCircle2,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

// Services
import { jobService, Job } from '@/lib/services/job.services';
import { dashboardService } from '@/lib/services/dashboard.services';

// Common Components
import { Button } from '@/components/common/Button';
import { Pagination } from '@/components/common/Pagination';
import DeleteModal from '@/components/common/DeleteModal';
import { toast } from 'react-hot-toast';

interface JobDisplay {
  id: string;
  title: string;
  dept: string;
  location: string;
  jobType: string[];
  status: string;
  applicants: number;
  matchRate: number | null;
  img: string;
  companyName: string;
  subLocation: string;
  postedDate: string;
}

const JobBoardView = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('ALL JOBS');
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic State
  const [jobs, setJobs] = useState<JobDisplay[]>([]);
  const [stats, setStats] = useState([
    { label: 'Total Open Roles', value: '0', icon: Briefcase, color: 'text-primary bg-primary/10' },
    { label: 'Active Candidates', value: '0', icon: Users, color: 'text-secondary bg-secondary/10' },
    { label: 'Pending Interviews', value: '0', icon: Calendar, color: 'text-tertiary bg-tertiary/10' },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [jobsRes, statsRes] = await Promise.all([
        jobService.getAdminJobs(),
        dashboardService.getRecruiterStats()
      ]);

      if (jobsRes.success) {
        const mappedJobs: JobDisplay[] = jobsRes.data.map((j: any) => {
          // Use backend status if available, fallback to internal mapping
          const calculatedStatus = (j.status || 'PENDING').toUpperCase();

          // Formatting date
          const rawDate = new Date(j.createdAt);
          const formattedDate = isNaN(rawDate.getTime())
            ? 'MAY 18, 2026'
            : rawDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();

          return {
            id: j._id,
            title: j.title,
            dept: j.category || 'General',
            location: j.location || 'Remote',
            jobType: Array.isArray(j.jobType) ? j.jobType : [j.jobType || 'Full-time'],
            status: calculatedStatus,
            applicants: j.applications?.length || 0,
            matchRate: null,
            img: j.companyId?.logo || '',
            companyName: j.companyId?.name || 'M.K. GROUP',
            subLocation: j.category || 'General',
            postedDate: formattedDate
          };
        });
        setJobs(mappedJobs);
      }

      if (statsRes.success && statsRes.data?.stats) {
        setStats([
          { label: 'Total Open Roles', value: statsRes.data.stats.activeJobs.toString(), icon: Briefcase, color: 'text-primary bg-primary/10' },
          { label: 'Active Candidates', value: statsRes.data.stats.totalApplicants.toString(), icon: Users, color: 'text-secondary bg-secondary/10' },
          { label: 'Pending Interviews', value: statsRes.data.stats.scheduledInterviews.toString(), icon: Calendar, color: 'text-tertiary bg-tertiary/10' },
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch job board data', error);
      toast.error('Failed to load jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteJob = async () => {
    if (!selectedJobId) return;
    try {
      await jobService.deleteJob(selectedJobId);
      toast.success('Job deleted successfully');
      setJobs(jobs.filter(j => j.id !== selectedJobId));
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error('Failed to delete job');
    }
  };

  // Approve pending job
  const handleApproveJob = async (id: string) => {
    try {
      await jobService.approveJob(id);
      toast.success('Job approved');
      // Refresh data after approval
      fetchData();
    } catch (error) {
      toast.error('Failed to approve job');
    }
  };

  // Helper styles for Table Row styling
  const getAvatarColor = (title: string) => {
    const colors = [
      'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      'bg-orange-500/10 text-orange-500 border-orange-500/20',
      'bg-pink-500/10 text-pink-500 border-pink-500/20',
      'bg-blue-500/10 text-blue-500 border-blue-500/20',
      'bg-purple-500/10 text-purple-500 border-purple-500/20'
    ];
    const code = title ? title.charCodeAt(0) : 0;
    return colors[code % colors.length];
  };

  const getAvatarLetter = (title: string) => {
    return title ? title.trim().charAt(0).toUpperCase() : 'J';
  };

  const getTypeStyles = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('full')) return 'bg-violet-500/10 text-violet-500 border-violet-500/20';
    if (lowerType.includes('part')) return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    if (lowerType.includes('hybrid')) return 'bg-sky-500/10 text-sky-500 border-sky-500/20';
    return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
  };

  const getStatusStyles = (status: string) => {
    if (status === 'APPROVED') return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    if (status === 'PENDING') return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    return 'bg-red-500/10 text-red-500 border-red-500/20';
  };

  // Filter and Pagination Logic
  const filteredJobs = jobs.filter(job => {
    // 1. Status Filter
    if (activeTab !== 'ALL JOBS') {
      if (job.status !== activeTab) return false;
    }
    // 2. Search Filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const titleMatches = job.title.toLowerCase().includes(query);
      const companyMatches = job.companyName.toLowerCase().includes(query);
      return titleMatches || companyMatches;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const currentJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  const pendingCount = jobs.filter(j => j.status === 'PENDING').length;

  return (
    <main className="space-y-10 animate-in fade-in duration-700">

      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight mb-2">Job Board</h1>
          <p className="text-on-surface-variant font-medium">Manage active postings and optimize your hiring pipeline with AI.</p>
        </div>
        <Button
          variant="gradient"
          onClick={() => router.push('/recruiter/job-board/new')}
          className="shadow-lg shadow-primary/20 hover:shadow-primary/40 group"
        >
          <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 mr-2" />
          <span>Post a New Job</span>
        </Button>
      </header>

      {/* Quick Stats Bento */}
      <section aria-label="Job Statistics" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.article
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 rounded-3xl flex items-center gap-5 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300"
          >
            <div className={`p-4 rounded-2xl ${stat.color} relative z-10 transition-transform group-hover:scale-110`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">{stat.label}</p>
              <div className="text-3xl font-black text-on-surface">{isLoading ? '-' : stat.value}</div>
            </div>
            <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors" />
          </motion.article>
        ))}
      </section>

      {/* AI JD Optimizer Banner */}
      <motion.section
        aria-label="AI Recommendations"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-3xl p-8 flex flex-col lg:flex-row items-center justify-between border-l-4 border-l-secondary relative overflow-hidden shadow-sm"
      >
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-start gap-6 z-10 max-w-2xl">
          <div className="bg-secondary-container/20 p-3 rounded-2xl text-secondary animate-pulse">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-on-surface mb-2">AI JD Optimizer</h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              2 active postings have lower than average engagement. Let AI refine the language to attract better candidates.
            </p>
          </div>
        </div>
        <Button variant="outline" className="mt-6 lg:mt-0 text-secondary border-secondary/20 hover:bg-secondary/10 uppercase tracking-widest text-xs z-10">
          Review Suggestions
        </Button>
      </motion.section>

      {/* Directory Archive Section */}
      <section aria-label="Job Postings Directory">
        <div className="bg-surface-container-low/80 backdrop-blur-md rounded-[2.5rem] border border-outline-variant/10 p-6 md:p-10 shadow-2xl space-y-8">
          {/* Header / Filter Toolbar inside directory */}
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-on-surface tracking-tight">Directory Archive</h2>
                <span className="h-4 w-1 bg-gradient-to-b from-primary to-secondary rounded-full" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 mt-1 flex items-center gap-1.5">
                <span className={cn("w-2 h-2 rounded-full bg-emerald-500", isLoading ? "animate-pulse" : "animate-ping")} />
                {isLoading ? "Syncing Feed..." : "Syncing Feed"}
              </p>
            </div>

            {/* Navigation Filter Tabs */}
            <div className="flex flex-wrap items-center bg-surface-container-low/50 p-1.5 rounded-2xl border border-outline-variant/10">
              {[
                { id: 'ALL JOBS', label: 'ALL JOBS', badge: null },
                { id: 'PENDING', label: 'PENDING', badge: pendingCount },
                { id: 'APPROVED', label: 'APPROVED', badge: null },
                { id: 'REJECTED', label: 'REJECTED', badge: null }
              ].map(tab => (
                <button
                  key={tab.id}
                  disabled={isLoading}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPage(1);
                  }}
                  className={cn(
                    "px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2",
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                      : "text-on-surface-variant/70 hover:text-on-surface disabled:opacity-50"
                  )}
                >
                  <span>{tab.label}</span>
                  {tab.badge !== null && tab.badge > 0 && (
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-black shrink-0",
                      activeTab === tab.id ? "bg-black text-primary" : "bg-orange-500/20 text-orange-500"
                    )}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search inputs */}
            <div className="flex items-center gap-4 w-full xl:w-auto shrink-0">
              <div className="relative flex-1 xl:flex-none">
                <Search className="w-4 h-4 text-on-surface-variant/60 absolute left-4 top-1/2 -translate-y-1/2" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search roles or companies..."
                  value={searchQuery}
                  disabled={isLoading}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full xl:w-64 pl-10 pr-4 py-3 bg-surface-container-low/50 border border-outline-variant/20 rounded-2xl text-sm focus:outline-none focus:border-primary/50 text-on-surface placeholder-on-surface-variant/40 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <button
                onClick={fetchData}
                disabled={isLoading}
                className="p-3 rounded-2xl bg-surface-container-low/50 hover:bg-surface-container-high border border-outline-variant/20 text-on-surface-variant transition-all hover:scale-105 active:scale-95 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh Feed"
              >
                <RefreshCw className={cn("w-4.5 h-4.5", isLoading && "animate-spin")} />
              </button>
            </div>
          </div>

          {/* List / Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/10">
                  <th className="pb-4 font-black text-[10px] text-on-surface-variant/60 uppercase tracking-widest w-[30%]">Company / Role</th>
                  <th className="pb-4 font-black text-[10px] text-on-surface-variant/60 uppercase tracking-widest w-[15%]">Type</th>
                  <th className="pb-4 font-black text-[10px] text-on-surface-variant/60 uppercase tracking-widest w-[20%]">Location</th>
                  <th className="pb-4 font-black text-[10px] text-on-surface-variant/60 uppercase tracking-widest w-[15%]">Posted</th>
                  <th className="pb-4 font-black text-[10px] text-on-surface-variant/60 uppercase tracking-widest w-[12%]">Status</th>
                  <th className="pb-4 font-black text-[10px] text-on-surface-variant/60 uppercase tracking-widest w-[8%] text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={`skeleton-${idx}`} className="animate-pulse">
                      {/* Company / Role */}
                      <td className="py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-muted/10 shrink-0" />
                          <div className="space-y-2 min-w-0 flex-1">
                            <div className="h-4 bg-muted/10 rounded-md w-32" />
                            <div className="h-3 bg-muted/5 rounded-md w-24" />
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-5">
                        <div className="flex gap-1.5">
                          <div className="h-6 bg-white/10 rounded-lg w-16" />
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-5">
                        <div className="flex items-start gap-2">
                          <div className="w-4 h-4 bg-muted/10 rounded-full shrink-0 mt-0.5" />
                          <div className="space-y-2 min-w-0 flex-1">
                            <div className="h-4 bg-muted/10 rounded-md w-24" />
                            <div className="h-3 bg-muted/5 rounded-md w-20" />
                          </div>
                        </div>
                      </td>

                      {/* Posted Date */}
                      <td className="py-5">
                        <div className="h-4 bg-white/10 rounded-md w-20" />
                      </td>

                      {/* Status */}
                      <td className="py-5">
                        <div className="h-6 bg-white/10 rounded-full w-20" />
                      </td>

                      {/* Actions */}
                      <td className="py-5 text-right pr-4">
                        <div className="flex justify-end items-center gap-3">
                          <div className="w-7 h-7 bg-muted/10 rounded-lg" />
                          <div className="w-7 h-7 bg-muted/10 rounded-lg" />
                          <div className="w-7 h-7 bg-white/10 rounded-lg" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <Briefcase className="w-12 h-12 text-on-surface-variant/30 mx-auto mb-4" />
                      <h3 className="text-xl font-black text-on-surface mb-2">No Jobs Found</h3>
                      <p className="text-sm text-on-surface-variant max-w-md mx-auto">
                        There are no jobs matching the "{activeTab}" filter.
                      </p>
                    </td>
                  </tr>
                ) : (
                  currentJobs.map((job) => (
                    <tr key={job.id} className="group hover:bg-surface-container-low/20 transition-all">
                      {/* Company / Role */}
                      <td className="py-5">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-12 h-12 rounded-full border flex items-center justify-center font-black text-base uppercase shrink-0 transition-transform group-hover:scale-105",
                            getAvatarColor(job.title)
                          )}>
                            {getAvatarLetter(job.title)}
                          </div>
                          <div className="min-w-0">
                            <p
                              onClick={() => router.push(`/recruiter/job-board/${job.id}`)}
                              className="font-black text-on-surface hover:text-primary transition-colors cursor-pointer truncate text-base leading-tight mb-0.5"
                            >
                              {job.title}
                            </p>
                            <p className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant/55 truncate">
                              {job.companyName}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-5">
                        <div className="flex flex-wrap gap-1.5">
                          {job.jobType.map((type: string) => (
                            <span key={type} className={cn(
                              "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border",
                              getTypeStyles(type)
                            )}>
                              {type}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-5">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-on-surface-variant/40 shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-on-surface truncate leading-tight mb-0.5">{job.location}</p>
                            <p className="text-[10px] font-medium text-on-surface-variant/50 truncate leading-none">{job.subLocation}</p>
                          </div>
                        </div>
                      </td>

                      {/* Posted Date */}
                      <td className="py-5">
                        <span className="text-xs font-black text-on-surface-variant/75 tracking-tight uppercase">
                          {job.postedDate}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-5">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border",
                          getStatusStyles(job.status)
                        )}>
                          <span className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            job.status === 'APPROVED' ? "bg-emerald-500" : job.status === 'PENDING' ? "bg-orange-500" : "bg-red-500"
                          )} />
                          {job.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-5 text-right pr-4">
                        <div className="flex justify-end items-center gap-3">
                          <button
                            onClick={() => router.push(`/recruiter/job-board/${job.id}`)}
                            className="p-1.5 text-on-surface-variant/60 hover:text-primary transition-all hover:scale-110 active:scale-95"
                            title="View Job Details"
                          >
                            <Eye className="w-4.5 h-4.5" />
                          </button>
                          <button
                            onClick={() => router.push(`/recruiter/job-board/${job.id}/edit`)}
                            className="p-1.5 text-on-surface-variant/60 hover:text-secondary transition-all hover:scale-110 active:scale-95"
                            title="Edit Job"
                          >
                            <Edit3 className="w-4.5 h-4.5" />
                          </button>
                          {job.status === 'PENDING' && (
                            <button
                              onClick={() => handleApproveJob(job.id)}
                              className="p-1.5 text-emerald-500 hover:text-emerald-600 transition-all hover:scale-110 active:scale-95"
                              title="Approve Job"
                            >
                              <CheckCircle2 className="w-4.5 h-4.5" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedJobId(job.id);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1.5 text-on-surface-variant/60 hover:text-error transition-all hover:scale-110 active:scale-95"
                            title="Delete Job"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {!isLoading && totalPages > 1 && (
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
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedJobId(null);
        }}
        onConfirm={handleDeleteJob}
        title="Delete Job Posting"
        message="Are you sure you want to delete this job posting? This action cannot be undone and will remove all associated applicant data."
      />
    </main>
  );
};

export default JobBoardView;
