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
  TrendingUp,
  Trash2
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
}

const JobBoardView = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All Jobs');
  
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
  const jobsPerPage = 4;

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
        const mappedJobs: JobDisplay[] = jobsRes.data.map((j: any) => ({
          id: j._id,
          title: j.title,
          dept: j.category || 'General',
          location: j.location || 'Remote',
          jobType: Array.isArray(j.jobType) ? j.jobType : [j.jobType || 'Full-time'],
          status: 'Active', // Defaulting to Active since no status field in DB yet
          applicants: j.applications?.length || 0,
          matchRate: null, // Pending AI calculation feature
          img: j.companyId?.logo || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=200&h=200'
        }));
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

  // Filter and Pagination Logic
  const filteredJobs = jobs.filter(job => {
    if (activeTab === 'All Jobs') return true;
    return job.status === activeTab;
  });

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const currentJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

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

      {/* Filters & Tabs */}
      <nav aria-label="Job Filters" className="flex border-b border-outline-variant/30 mb-8 overflow-x-auto no-scrollbar">
        {['All Jobs', 'Active', 'Drafts', 'Closed'].map(tab => (
          <button 
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1); // Reset pagination on tab change
            }}
            className={cn(
              "px-8 py-4 font-black text-[10px] uppercase tracking-[0.2em] transition-all relative",
              activeTab === tab 
                ? "text-primary" 
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            {tab}
            {activeTab === tab && (
              <motion.div 
                layoutId="activeTab" 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" 
              />
            )}
          </button>
        ))}
      </nav>

      {/* Job Listings Grid */}
      <section aria-label="Job Postings">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="glass-card rounded-3xl p-16 text-center border-dashed border-2 border-outline-variant/50">
            <Briefcase className="w-12 h-12 text-on-surface-variant/30 mx-auto mb-4" />
            <h3 className="text-xl font-black text-on-surface mb-2">No Jobs Found</h3>
            <p className="text-sm text-on-surface-variant max-w-md mx-auto">
              There are no jobs matching the "{activeTab}" filter. 
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {currentJobs.map((job, i) => (
                <motion.article 
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-[2rem] p-8 flex flex-col group hover:bg-surface-container-low/70 transition-all duration-500 relative overflow-hidden border border-white/[0.08] hover:border-primary/20 shadow-lg hover:shadow-primary/5 hover:-translate-y-1.5"
                >
                  {/* Glowing background gradient on hover */}
                  <div className="absolute -right-10 -top-10 w-44 h-44 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  {/* Background Decorative Logo watermark */}
                  <img 
                    src={job.img} 
                    alt={`${job.title} company logo`} 
                    className="absolute top-0 right-0 w-36 h-36 object-cover opacity-[0.02] rounded-bl-full pointer-events-none group-hover:opacity-[0.04] transition-opacity duration-500" 
                  />

                  <div className="flex justify-between items-start gap-4 mb-6 relative z-10">
                    <div className="space-y-4">
                      <h3 
                        onClick={() => router.push(`/recruiter/job-board/${job.id}`)}
                        className="text-2xl font-black text-on-surface hover:text-primary tracking-tight leading-tight transition-colors cursor-pointer"
                      >
                        {job.title}
                      </h3>
                      <div className="space-y-2">
                        {/* Row 1: Dept & Location */}
                        <div className="flex flex-wrap items-center gap-2.5 text-[9px] font-black text-on-surface-variant uppercase tracking-widest">
                          <div className="flex items-center gap-1.5 bg-surface-container/60 px-3 py-1.5 rounded-xl border border-outline-variant/10">
                            <Building2 className="w-3.5 h-3.5 text-primary" />
                            <span>{job.dept}</span>
                          </div>
                          <div className="flex items-center gap-1.5 bg-surface-container/60 px-3 py-1.5 rounded-xl border border-outline-variant/10">
                            <MapPin className="w-3.5 h-3.5 text-secondary" />
                            <span>{job.location}</span>
                          </div>
                        </div>

                        {/* Row 2: Job Types (nicha set kar diya labels ke saath) */}
                        {job.jobType && job.jobType.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                            <span className="text-[9px] font-black text-on-surface-variant/70 uppercase tracking-widest mr-1 select-none">Job Types:</span>
                            {job.jobType.map((type: string) => (
                              <div key={type} className="flex items-center gap-1.5 bg-secondary/10 text-secondary px-3 py-1.5 rounded-xl border border-secondary/15">
                                <Briefcase className="w-3.5 h-3.5" />
                                <span>{type}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <span className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shrink-0",
                      job.status === 'Active' 
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                        : "bg-orange-500/10 text-orange-600 border-orange-500/20"
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", job.status === 'Active' ? "bg-emerald-500 animate-pulse" : "bg-orange-500")} />
                      {job.status}
                    </span>
                  </div>

                  {/* Micro-Bento Analytics Panel */}
                  <div className="grid grid-cols-2 gap-4 my-6 py-4 border-y border-outline-variant/10 relative z-10">
                    <div className="bg-surface-container/20 p-4 rounded-2xl border border-outline-variant/5 hover:bg-surface-container/40 transition-colors">
                      <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Total Applicants</p>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-black text-on-surface">{job.applicants || '0'}</span>
                        <span className="text-[9px] font-extrabold text-emerald-500 flex items-center gap-0.5">
                          <TrendingUp size={11} />
                          +8%
                        </span>
                      </div>
                    </div>
                    <div className="bg-surface-container/20 p-4 rounded-2xl border border-outline-variant/5 hover:bg-surface-container/40 transition-colors">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Sparkles className={cn("w-3.5 h-3.5", job.matchRate ? "text-secondary animate-pulse" : "text-on-surface-variant/30")} />
                        <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">AI Match Rate</p>
                      </div>
                      <p className={cn("text-3xl font-black", job.matchRate ? "text-secondary" : "text-on-surface-variant/30")}>
                        {job.matchRate ? `${job.matchRate}%` : 'Pending'}
                      </p>
                    </div>
                  </div>

                  {/* Modern Actions Controls Bar */}
                  <div className="flex gap-3 mt-auto relative z-10">
                    <Button 
                      variant="ghost" 
                      onClick={() => router.push(`/recruiter/applications?jobId=${job.id}`)}
                      className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary font-black text-[10px] uppercase tracking-widest py-3.5 rounded-2xl group/btn"
                    >
                      View Applicants
                      <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => router.push(`/recruiter/job-board/${job.id}/edit`)}
                      className="p-3.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant rounded-2xl transition-all hover:scale-[1.05] active:scale-[0.95]" 
                      title="Edit Role"
                    >
                      <Edit3 className="w-4.5 h-4.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => router.push(`/recruiter/job-board/${job.id}`)}
                      className="p-3.5 bg-secondary/15 hover:bg-secondary/25 text-secondary rounded-2xl transition-all hover:scale-[1.05] active:scale-[0.95]" 
                      title="View Job Details"
                    >
                      <Eye className="w-4.5 h-4.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="p-3.5 bg-error/10 hover:bg-error/20 text-error rounded-2xl transition-all hover:scale-[1.05] active:scale-[0.95]" 
                      title="Delete Role"
                      onClick={() => {
                        setSelectedJobId(job.id);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </Button>
                  </div>
                </motion.article>
              ))}
            </div>
            
            {totalPages > 1 && (
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={setCurrentPage} 
              />
            )}
          </>
        )}
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
