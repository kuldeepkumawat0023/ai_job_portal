'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Sparkles, 
  Plus, 
  X, 
  ChevronRight, 
  CheckCircle2, 
  BrainCircuit,
  Eye,
  Save,
  ArrowLeft,
  Calendar,
  Users,
  Edit3,
  Trash2,
  TrendingUp,
  Map,
  Shield,
  Layers,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { toast } from 'react-hot-toast';

// Services
import { jobService, Job } from '@/lib/services/job.services';
import { dashboardService } from '@/lib/services/dashboard.services';

// Components
import { Button } from '@/components/common/Button';
import DeleteModal from '@/components/common/DeleteModal';

interface JobDetailViewProps {
  jobId?: string;
}

const JobDetailView = ({ jobId: propJobId }: JobDetailViewProps) => {
  const router = useRouter();
  const params = useParams();
  const jobId = propJobId || (params?.id as string | undefined);

  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) return;
      setIsLoading(true);
      try {
        const res = await jobService.getJobById(jobId);
        if (res.success && res.data) {
          setJob(res.data);
        } else {
          toast.error(res.message || 'Failed to load job details');
          router.push('/recruiter/job-board');
        }
      } catch (error) {
        console.error('Failed to fetch job details', error);
        toast.error('Failed to load job details');
        router.push('/recruiter/job-board');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId, router]);

  const handleDeleteJob = async () => {
    if (!jobId) return;
    try {
      await jobService.deleteJob(jobId);
      toast.success('Job deleted successfully');
      router.push('/recruiter/job-board');
    } catch (error) {
      toast.error('Failed to delete job');
    }
  };

  // Approve pending job
  const handleApproveJob = async () => {
    if (!jobId) return;
    try {
      await jobService.approveJob(jobId);
      toast.success('Job approved');
      // Refresh or navigate back
      router.push('/recruiter/job-board');
    } catch (error) {
      toast.error('Failed to approve job');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Briefcase className="w-16 h-16 text-on-surface-variant/20 animate-bounce" />
        <h2 className="text-2xl font-black text-on-surface">Job Not Found</h2>
        <Button variant="gradient" onClick={() => router.push('/recruiter/job-board')}>
          Back to Job Board
        </Button>
      </div>
    );
  }

  // Pre-process perks list
  const standardPerks = [
    { name: 'Full Health/Dental/Vision insurance coverage', key: 'health' },
    { name: '401(k) Retirement Plan with 4% company match', key: 'retirement' },
    { name: 'Unlimited paid time off (PTO) + company holidays', key: 'pto' },
    { name: 'Annual learning budget & professional development stipend', key: 'learning' },
    { name: 'Complete premium workspace budget (desk, chair, tech)', key: 'workspace' },
    { name: 'Quarterly team offsites and wellness allowance', key: 'wellness' }
  ];

  const selectedPerks = job.perks || [];

  return (
    <main className="space-y-10 animate-in fade-in duration-700">
      {/* Top Header Actions */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.push('/recruiter/job-board')}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Job Board
        </button>

        <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => router.push(`/recruiter/job-board/${jobId}/edit`)}
              className="flex items-center gap-2 border-outline-variant/10 text-on-surface hover:bg-surface-container-high py-2.5 rounded-2xl"
            >
              <Edit3 size={16} />
              <span>Edit Role</span>
            </Button>
            {job && job.status === 'PENDING' && (
              <Button 
                variant="ghost" 
                onClick={handleApproveJob}
                className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 py-2.5 rounded-2xl"
              >
                <CheckCircle2 size={16} />
                <span>Approve Job</span>
              </Button>
            )}
            <Button 
              variant="ghost" 
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-2 bg-error/10 hover:bg-error/20 text-error py-2.5 rounded-2xl"
            >
              <Trash2 size={16} />
              <span>Delete Role</span>
            </Button>
        </div>
      </div>

      {/* Main Hero Card */}
      <section className="glass-card rounded-[2.5rem] p-8 md:p-12 border border-white/10 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
        
        <div className="space-y-4 relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
              Active Posting
            </span>
            <span className="px-3.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest">
              AI Matching Enabled
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-on-surface tracking-tight leading-tight">
            {job.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-on-surface-variant">
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-primary" />
              <span>{job.category || 'Engineering'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-secondary" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-tertiary" />
              <span>Posted {new Date(job.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-stretch sm:flex-row gap-4 min-w-[200px] w-full md:w-auto">
          <Button 
            variant="gradient" 
            onClick={() => router.push(`/recruiter/applications?jobId=${jobId}`)}
            className="flex-1 px-8 py-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest"
          >
            <span>Review Applicants</span>
            <ChevronRight size={16} />
          </Button>
        </div>
      </section>

      {/* Info Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <article className="glass-card p-6 rounded-3xl relative overflow-hidden group border border-white/5">
          <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Total Applicants</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-on-surface">{job.applications?.length || 0}</span>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-0.5">
              <TrendingUp size={12} />
              +12% this week
            </span>
          </div>
          <div className="absolute right-0 bottom-0 w-16 h-16 bg-primary/5 rounded-full -mr-4 -mb-4 blur-xl pointer-events-none" />
        </article>

        <article className="glass-card p-6 rounded-3xl relative overflow-hidden group border border-white/5">
          <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Job Types</p>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {Array.isArray(job.jobType) ? (
              job.jobType.map((type: string) => (
                <span key={type} className="px-2.5 py-1 bg-secondary/15 text-secondary border border-secondary/20 rounded-xl text-[10px] font-black uppercase tracking-widest">
                  {type}
                </span>
              ))
            ) : (
              <span className="px-2.5 py-1 bg-secondary/15 text-secondary border border-secondary/20 rounded-xl text-[10px] font-black uppercase tracking-widest">
                {job.jobType || 'Full-time'}
              </span>
            )}
          </div>
        </article>

        <article className="glass-card p-6 rounded-3xl relative overflow-hidden group border border-white/5">
          <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Salary Band</p>
          <div className="text-2xl font-black text-on-surface">{job.salary || 'Competitive'}</div>
          <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1">✓ Top 15% Market Rank</p>
        </article>

        <article className="glass-card p-6 rounded-3xl relative overflow-hidden group border border-white/5">
          <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Experience Required</p>
          <div className="text-2xl font-black text-on-surface">{job.experience || 0} Years</div>
          <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mt-1">Mid-to-Senior level</p>
        </article>
      </section>

      {/* Details Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left main column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Job Description */}
          <section className="glass-card rounded-[2rem] p-8 md:p-10 border border-white/10 space-y-6">
            <h2 className="text-xl font-black text-on-surface tracking-tight flex items-center gap-2.5">
              <Briefcase className="text-primary" size={20} />
              About the Role
            </h2>
            <div className="h-px bg-outline-variant/10" />
            <div className="text-on-surface-variant leading-relaxed font-medium text-sm space-y-4 whitespace-pre-line">
              {job.description}
            </div>
          </section>

          {/* Required Skills & Knowledge */}
          <section className="glass-card rounded-[2rem] p-8 md:p-10 border border-white/10 space-y-6">
            <h2 className="text-xl font-black text-on-surface tracking-tight flex items-center gap-2.5">
              <Award className="text-secondary" size={20} />
              Required Skills & Knowledge
            </h2>
            <div className="h-px bg-outline-variant/10" />
            <div className="flex flex-wrap gap-2.5">
              {job.requirements && job.requirements.map((skill: string) => (
                <span 
                  key={skill} 
                  className="px-4 py-2.5 bg-primary/5 hover:bg-primary/10 text-primary border border-primary/10 hover:border-primary/25 rounded-2xl text-xs font-extrabold transition-all hover:scale-105 cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Benefits & Perks */}
          {selectedPerks.length > 0 && (
            <section className="glass-card rounded-[2rem] p-8 md:p-10 border border-white/10 space-y-6">
              <h2 className="text-xl font-black text-on-surface tracking-tight flex items-center gap-2.5">
                <Shield className="text-tertiary" size={20} />
                Selected Perks & Benefits
              </h2>
              <div className="h-px bg-outline-variant/10" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedPerks.map((perkKey: string) => {
                  const perkObj = standardPerks.find(p => p.key === perkKey) || { name: perkKey };
                  return (
                    <div key={perkKey} className="flex items-start gap-3 bg-surface-container/30 p-4 rounded-2xl border border-outline-variant/5">
                      <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                      <span className="text-xs font-bold text-on-surface">{perkObj.name}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

        </div>

        {/* Right sidebar column */}
        <div className="space-y-8">
          
          {/* AI Optimizer & Metrics */}
          <section className="glass-card rounded-[2rem] p-8 border border-white/10 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BrainCircuit className="text-secondary shrink-0 animate-pulse" size={20} />
                <h2 className="text-xl font-black text-on-surface tracking-tight">AI Matching Score</h2>
              </div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest leading-relaxed">
                Applicant pool fitness metrics powered by deep learning analysis.
              </p>
            </div>

            <div className="h-px bg-outline-variant/10" />

            {/* Performance Stats */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-extrabold uppercase tracking-widest text-on-surface-variant">
                  <span>Market Competitiveness</span>
                  <span className="text-emerald-500">Strong (85%)</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" 
                    style={{ width: '85%' }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-extrabold uppercase tracking-widest text-on-surface-variant">
                  <span>Applicant Fit Rate</span>
                  <span className="text-secondary">Optimal (72%)</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-secondary/80 to-secondary rounded-full" 
                    style={{ width: '72%' }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-extrabold uppercase tracking-widest text-on-surface-variant">
                  <span>Talent Pool Depth</span>
                  <span className="text-primary">High (92%)</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full" 
                    style={{ width: '92%' }}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container-high/40 border border-outline-variant/15 text-[11px] font-bold text-on-surface leading-relaxed">
              <span className="text-secondary font-black uppercase italic mr-1">AI Insight:</span>
              Your posting ranks in the top tier. Market demand is exceptionally high for developers matching these requirements.
            </div>
          </section>

          {/* Action sidebar block */}
          <section className="glass-card rounded-[2rem] p-8 border border-white/10 space-y-4">
            <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Hiring Checklist</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs font-bold text-on-surface">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                <span>Job Posting Published</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-on-surface">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                <span>AI Matching Algorithm Set</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-on-surface-variant">
                <div className="w-4 h-4 border-2 border-outline-variant rounded-full shrink-0" />
                <span>Shortlist 5 Candidates</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-on-surface-variant">
                <div className="w-4 h-4 border-2 border-outline-variant rounded-full shrink-0" />
                <span>Schedule Initial Interviews</span>
              </div>
            </div>
          </section>

        </div>

      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteJob}
        title="Delete Job Posting"
        message="Are you sure you want to delete this job posting? This action cannot be undone and will remove all associated applicant data."
      />
    </main>
  );
};

export default JobDetailView;
