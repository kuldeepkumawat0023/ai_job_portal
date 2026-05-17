'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Send, 
  MessageSquare, 
  GraduationCap, 
  CheckCircle2, 
  BarChart3,
  Rocket,
  LayoutDashboard,
  Lightbulb,
  AlertTriangle,
  Target,
  Trophy
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { cn } from '@/utils/cn';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { dashboardService } from '@/lib/services/dashboard.services';
import { jobService, Job } from '@/lib/services/job.services';
import { applicationService } from '@/lib/services/application.services';
import ProfileWizardModal from './ProfileWizardModal';

interface DashboardStats {
  totalApplied: number;
  scheduledInterviews: number;
  mockInterviewsDone: number;
  resumeAnalysis: {
    score: number;
    skills: string[];
    weaknesses: string[];
    coachingTips: string[];
  } | null;
  activity: { _id: string; count: number }[];
}

const DashboardView = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProfileWizardOpen, setIsProfileWizardOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, jobsRes, appsRes] = await Promise.all([
          dashboardService.getCandidateStats(),
          jobService.getRecommendedJobs(),
          applicationService.getAppliedJobs()
        ]);

        if (statsRes?.success) setStats(statsRes.data);
        if (jobsRes?.success) setRecommendedJobs(jobsRes.data?.slice(0, 5) || []);
        if (appsRes?.success) setAppliedJobs(appsRes.data || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Profile Completion Logic
  const profileFields = ['bio', 'skills', 'education', 'workExperience', 'projects', 'resume'];
  const filledFields = user ? profileFields.filter(f => {
    const val = (user as any)[f];
    return val && (Array.isArray(val) ? val.length > 0 : true);
  }).length : 0;
  const completionRate = Math.round((filledFields / profileFields.length) * 100);
  const isProfileIncomplete = completionRate < 100;

  // Pipeline Logic
  const pipeline = [
    { 
      status: 'Applied', 
      key: 'pending', 
      count: appliedJobs.filter(a => !a.status || a.status === 'pending').length, 
      jobs: appliedJobs.filter(a => !a.status || a.status === 'pending').map(a => ({ 
        title: a.jobId?.title || 'Unknown Role', 
        company: a.jobId?.companyId?.name || 'Company', 
        time: a.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'Recently' 
      })) 
    },
    { 
      status: 'Shortlisted', 
      key: 'shortlisted', 
      count: appliedJobs.filter(a => a.status === 'shortlisted').length, 
      jobs: appliedJobs.filter(a => a.status === 'shortlisted').map(a => ({ 
        title: a.jobId?.title || 'Unknown Role', 
        company: a.jobId?.companyId?.name || 'Company',
        time: a.updatedAt ? new Date(a.updatedAt).toLocaleDateString() : 'Recently'
      })) 
    },
    { 
      status: 'Interview', 
      key: 'interview', 
      count: appliedJobs.filter(a => a.status === 'interview').length, 
      jobs: appliedJobs.filter(a => a.status === 'interview').map(a => ({ 
        title: a.jobId?.title || 'Unknown Role', 
        company: a.jobId?.companyId?.name || 'Company', 
        tag: 'Scheduled',
        time: a.updatedAt ? new Date(a.updatedAt).toLocaleDateString() : 'Recently'
      })) 
    },
    { 
      status: 'Offer', 
      key: 'hired', 
      count: appliedJobs.filter(a => a.status === 'hired').length, 
      jobs: appliedJobs.filter(a => a.status === 'hired').map(a => ({ 
        title: a.jobId?.title || 'Unknown Role', 
        company: a.jobId?.companyId?.name || 'Company', 
        highlight: true,
        time: a.updatedAt ? new Date(a.updatedAt).toLocaleDateString() : 'Recently'
      })) 
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8 pb-10 animate-pulse p-4">
        <div className="h-48 bg-surface-container-high rounded-[2.5rem]" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-surface-container-low rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Banner */}
      <section className="glass-card p-6 md:p-8 lg:p-10 relative overflow-hidden bg-gradient-to-r from-surface-container-high/50 to-surface-container/30 border-none shadow-xl">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-on-surface mb-2">
              Welcome back, {user?.fullname?.split(' ')[0] || 'User'} 👋
            </h1>
            <p className="text-sm md:text-base text-on-surface-variant max-w-md">
              {isProfileIncomplete 
                ? "Your profile is almost there! Complete it to unlock personalized AI matches."
                : "Your AI readiness score is looking strong today. We found new matches for your profile."}
            </p>
            {isProfileIncomplete && (
              <div className="relative inline-block mt-6 group">
                {/* Concentric sound wave/vibration ripples with dual-gradient energy */}
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/40 to-secondary/40 pointer-events-none blur-sm"
                  style={{ zIndex: 0 }}
                  animate={{
                    scale: [1, 1.45],
                    opacity: [0.8, 0]
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-secondary/30 to-tertiary/30 pointer-events-none blur-sm"
                  style={{ zIndex: 0 }}
                  animate={{
                    scale: [1, 1.85],
                    opacity: [0.6, 0]
                  }}
                  transition={{
                    duration: 1.8,
                    delay: 0.6,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
                
                <Button 
                  variant="gradient" 
                  size="sm" 
                  className="shadow-2xl shadow-primary/50 hover:shadow-secondary/50 active:scale-95 transition-all relative overflow-hidden flex items-center gap-2 font-black tracking-wide"
                  style={{ position: 'relative', zIndex: 1 }}
                  onClick={() => setIsProfileWizardOpen(true)}
                >
                  {/* Glowing shimmer reflection */}
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                  Complete Profile
                  <motion.span
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  >
                    🚀
                  </motion.span>
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-6 bg-white/40 dark:bg-black/20 p-6 rounded-3xl backdrop-blur-md border border-white/20">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-primary/10" strokeWidth="3" />
                <circle 
                  cx="18" cy="18" r="16" fill="none" 
                  className="stroke-primary" 
                  strokeWidth="3" 
                  strokeDasharray={`${stats?.resumeAnalysis?.score || 0}, 100`} 
                  strokeLinecap="round" 
                />
              </svg>
              <span className="text-xl font-bold text-primary">{stats?.resumeAnalysis?.score || 0}%</span>
            </div>
            <div>
              <div className="text-sm font-bold text-on-surface">AI Readiness</div>
              <div className="text-[10px] text-tertiary font-bold uppercase tracking-widest mt-1">
                {stats?.resumeAnalysis?.score && stats.resumeAnalysis.score > 80 ? 'Top 15% Globally' : 'Keep Improving'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { name: 'Applications Sent', value: stats?.totalApplied || 0, icon: Send, color: 'text-primary', bg: 'bg-primary/10' },
          { name: 'Interviews', value: stats?.scheduledInterviews || 0, icon: MessageSquare, color: 'text-secondary', bg: 'bg-secondary/10' },
          { name: 'Resume Score', value: stats?.resumeAnalysis?.score || 0, icon: GraduationCap, color: 'text-tertiary', bg: 'bg-tertiary/10' },
          { name: 'Profile Completion', value: `${completionRate}%`, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-4 md:p-6 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 md:gap-5 hover:-translate-y-1 cursor-pointer group"
          >
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110 shrink-0`}>
              <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div className="min-w-0">
              <div className="text-[9px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider truncate">{stat.name}</div>
              <div className="text-lg md:text-2xl font-bold text-on-surface mt-0.5">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Profile Wizard Modal */}
      <ProfileWizardModal 
        isOpen={isProfileWizardOpen} 
        onClose={() => setIsProfileWizardOpen(false)} 
      />

      {/* Bento Grid: Analysis & Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Resume Analysis */}
        <div className="lg:col-span-5 glass-card p-6 md:p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
              <Target className="text-primary w-6 h-6" />
              Resume Analysis
            </h2>
            <div className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full border border-primary/20 uppercase tracking-widest">
              Live Scan
            </div>
          </div>
          
          <div className="flex items-center gap-8 mb-8">
            <div className="relative w-28 h-28 flex items-center justify-center rounded-full bg-surface-container border-4 border-surface-container-highest shrink-0 shadow-[0_0_40px_rgba(70,72,212,0.1)]">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-surface-container-highest" strokeWidth="2.5" />
                <circle 
                  cx="18" cy="18" r="16" fill="none" 
                  className="stroke-primary" 
                  strokeWidth="2.5" 
                  strokeDasharray={`${stats?.resumeAnalysis?.score || 0}, 100`} 
                  strokeLinecap="round" 
                />
              </svg>
              <span className="text-3xl font-black text-primary tracking-tighter">{stats?.resumeAnalysis?.score || 0}</span>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <div className="text-[10px] font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Top Skills Detected</div>
                <div className="flex flex-wrap gap-1.5">
                  {(stats?.resumeAnalysis?.skills?.slice(0, 3) || ['No Data']).map(s => (
                    <span key={s} className="bg-primary/5 text-primary text-[10px] font-bold px-2.5 py-1 rounded-lg border border-primary/10">{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-on-surface-variant mb-2 uppercase tracking-widest text-error">Gap Found</div>
                <span className="bg-error/5 text-error text-[10px] font-bold px-2.5 py-1 rounded-lg border border-error/10">
                  {stats?.resumeAnalysis?.weaknesses?.[0] || 'Analyze Resume'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-auto grid grid-cols-2 gap-4 pt-6 border-t border-outline-variant/10">
            <Link href="/candidate/resume-analysis">
              <Button size="sm" className="w-full">Improve Score</Button>
            </Link>
            <Button variant="outline" size="sm" className="w-full">Re-analyze</Button>
          </div>
        </div>

        {/* Job Matches */}
        <div className="lg:col-span-7 glass-card p-6 md:p-8 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
              <Rocket className="text-tertiary w-6 h-6" />
              AI Job Matches
            </h2>
            <Link href="/candidate/job-matches">
              <button className="text-primary text-xs font-bold hover:underline">View All</button>
            </Link>
          </div>
          
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {recommendedJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full opacity-40">
                <Rocket className="w-12 h-12 mb-2" />
                <p className="text-xs font-bold uppercase tracking-widest">No matches found yet</p>
              </div>
            ) : (
              recommendedJobs.map((job) => (
                <div key={job._id} className="bg-surface-container-low/50 rounded-2xl p-4 border border-outline-variant/5 flex items-center gap-5 hover:bg-surface-container-high transition-colors group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center p-2 shrink-0 border border-outline-variant/10 shadow-sm transition-transform group-hover:scale-105 overflow-hidden">
                    <img src={(job.companyId as any)?.logo || 'https://api.dicebear.com/7.x/initials/svg?seed=' + job.title} alt="Company" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-on-surface truncate group-hover:text-primary transition-colors">{job.title}</h3>
                    <div className="text-xs text-on-surface-variant truncate">{(job.companyId as any)?.name} • {job.location}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="bg-tertiary/10 text-tertiary text-[10px] font-bold px-2 py-0.5 rounded-full border border-tertiary/20">AI Recommended</span>
                    <button className="text-xs font-bold text-primary hover:opacity-80">Apply Now</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Application Kanban */}
      <section className="mt-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
            <LayoutDashboard className="text-secondary w-6 h-6" />
            Application Pipeline
          </h2>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {pipeline.map((col, idx) => (
            <div key={col.status} className="flex flex-col gap-3">
              <div className="flex justify-between items-center px-2">
                <div className={`text-[9px] font-black uppercase tracking-[0.15em] ${idx === 2 ? 'text-secondary' : idx === 3 ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {col.status} ({col.count})
                </div>
              </div>
              
              <div className="space-y-3 p-4 bg-surface-container-low/40 rounded-3xl border border-outline-variant/10 h-full min-h-[140px] shadow-sm">
                {col.jobs.length === 0 ? (
                  <div className="h-20 border border-dashed border-outline-variant/20 rounded-2xl flex flex-col items-center justify-center text-[9px] font-bold text-on-surface-variant/30 uppercase tracking-widest gap-1.5">
                    No items
                  </div>
                ) : (
                  col.jobs.map((job, jidx) => (
                    <motion.div 
                      key={jidx} 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "p-3 bg-white dark:bg-zinc-900 rounded-xl border border-outline-variant/10 shadow-sm",
                        (job as any).urgent && "border-secondary/30 bg-secondary/[0.02]",
                        (job as any).highlight && "border-primary/30 bg-primary/[0.02]"
                      )}
                    >
                      <div className="font-bold text-[11px] mb-0.5 text-on-surface leading-tight truncate">{job.title}</div>
                      <div className="text-[10px] text-on-surface-variant truncate mb-2">{job.company || 'Company'}</div>
                      <div className="flex items-center justify-between">
                        {(job as any).tag ? (
                          <div className={cn(
                            "text-[8px] font-bold px-1.5 py-0.5 rounded border",
                            (job as any).urgent ? "bg-secondary/10 text-secondary border-secondary/20" : 
                            (job as any).highlight ? "bg-primary/10 text-primary border-primary/20" : "bg-surface-container text-on-surface-variant border-outline-variant/20"
                          )}>
                            {(job as any).tag}
                          </div>
                        ) : (
                          <div className="text-[8px] text-on-surface-variant/50 font-bold uppercase flex items-center gap-1">
                            Applied {(job as any).time}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Analytics & Coaching */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-6 md:p-8 flex flex-col h-56 md:h-64 relative overflow-hidden group">
          <div className="flex justify-between items-center mb-6 relative z-10">
            <h3 className="font-bold text-lg text-on-surface flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Application Activity
            </h3>
            <div className="flex gap-1 items-end h-12">
              {(stats?.activity || [0.4, 0.6, 0.3, 0.8, 1, 0.7, 0.9]).map((h: any, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: typeof h === 'object' ? `${Math.min(100, (h.count || 0) * 20)}%` : `${(h || 0) * 100}%` }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="w-1.5 bg-primary/20 group-hover:bg-primary/40 rounded-full transition-colors"
                />
              ))}
            </div>
          </div>
          <div className="mt-auto flex items-end justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-widest relative z-10">
            <span>Last 7 Days</span>
            <span className="text-primary">Live Activity</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary/[0.02] to-transparent pointer-events-none" />
        </div>

        <div className="glass-card p-6 md:p-8 flex flex-col bg-primary/[0.02] border-primary/20 border-dashed">
          <h3 className="font-bold text-lg text-on-surface mb-6 flex items-center gap-3">
            <Lightbulb className="text-primary w-6 h-6" />
            AI Coaching
          </h3>
          <div className="space-y-4 mb-6">
            {(stats?.resumeAnalysis?.coachingTips?.slice(0, 2) || ["Optimize LinkedIn", "Practice System Design"]).map((tip, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full ${idx === 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-secondary/10 text-secondary'} flex items-center justify-center shrink-0`}>
                  {idx === 0 ? <Trophy className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-sm font-bold">{tip}</div>
                  <div className="text-xs text-on-surface-variant">Recommended by AI based on your latest scan.</div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/candidate/aimock-interview" className="mt-auto">
            <Button variant="outline" size="sm" className="w-full font-bold border-dashed border-primary/30 text-primary hover:bg-primary/5">
              Start Practice Session
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
