'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Filter,
  Plus,
  Zap,
  Clock,
  TrendingUp,
  Calendar,
  BrainCircuit,
  Archive,
  Sparkles,
  CheckSquare,
  Building2,
  MapPin,
  ChevronRight,
  Loader2,
  Video,
  ExternalLink,
  Check,
  AlertCircle
} from 'lucide-react';
import { applicationService, Application } from '@/lib/services/application.services';
import { aiService } from '@/lib/services/ai.services';
import { interviewService } from '@/lib/services/interview.services';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow, isValid } from 'date-fns';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

const getStatusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'applied':
    case 'pending':
      return (
        <span className="px-3 py-1 rounded-full bg-outline-variant/10 text-on-surface-variant/70 border border-outline-variant/20 text-[9px] font-black uppercase tracking-widest">
          Applied
        </span>
      );
    case 'shortlisted':
      return (
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest">
          Shortlisted
        </span>
      );
    case 'interview':
    case 'interviewing':
      return (
        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[9px] font-black uppercase tracking-widest animate-pulse">
          Interviewing
        </span>
      );
    case 'hired':
    case 'accepted':
      return (
        <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20 text-[9px] font-black uppercase tracking-widest">
          Hired
        </span>
      );
    case 'rejected':
      return (
        <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 text-[9px] font-black uppercase tracking-widest">
          Rejected
        </span>
      );
    default:
      return (
        <span className="px-3 py-1 rounded-full bg-outline-variant/10 text-on-surface-variant/70 border border-outline-variant/20 text-[9px] font-black uppercase tracking-widest">
          {status}
        </span>
      );
  }
};

const getStatusCardStyles = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'applied':
    case 'pending':
      return {
        borderClass: 'border-b-slate-400 dark:border-b-zinc-600',
        hoverShadow: 'hover:shadow-[0_20px_50px_-15px_rgba(148,163,184,0.12)]',
        bgClass: 'bg-surface-container-lowest',
        badgeText: 'Awaiting Recruiter Review',
        badgeColor: 'text-slate-500 bg-slate-500/10 border border-slate-500/20'
      };
    case 'shortlisted':
      return {
        borderClass: 'border-b-emerald-500',
        hoverShadow: 'hover:shadow-[0_20px_50px_-15px_rgba(16,185,129,0.15)]',
        bgClass: 'bg-surface-container-lowest/90 border-emerald-500/5',
        badgeText: 'Shortlisted for Interview',
        badgeColor: 'text-emerald-500 bg-emerald-500/10 border border-emerald-500/20'
      };
    case 'interview':
    case 'interviewing':
      return {
        borderClass: 'border-b-primary',
        hoverShadow: 'hover:shadow-[0_20px_50px_-15px_rgba(70,72,212,0.15)]',
        bgClass: 'bg-surface-container-lowest/90 border-primary/5',
        badgeText: 'Interview Stage',
        badgeColor: 'text-primary bg-primary/10 border border-primary/20'
      };
    case 'hired':
    case 'accepted':
      return {
        borderClass: 'border-b-secondary',
        hoverShadow: 'hover:shadow-[0_20px_50px_-15px_rgba(139,92,246,0.2)]',
        bgClass: 'bg-gradient-to-b from-surface-container-lowest to-secondary/5 border-secondary/20',
        badgeText: '🎉 Offer Received!',
        badgeColor: 'text-secondary bg-secondary/15 border border-secondary/30'
      };
    case 'rejected':
      return {
        borderClass: 'border-b-red-500',
        hoverShadow: 'hover:shadow-[0_20px_50px_-15px_rgba(239,68,68,0.1)]',
        bgClass: 'bg-surface-container-lowest/60 opacity-80 grayscale-[20%]',
        badgeText: 'Application Process Closed',
        badgeColor: 'text-red-500 bg-red-500/10 border border-red-500/20'
      };
    default:
      return {
        borderClass: 'border-b-primary',
        hoverShadow: 'hover:shadow-[0_20px_50px_-15px_rgba(70,72,212,0.15)]',
        bgClass: 'bg-surface-container-lowest',
        badgeText: status,
        badgeColor: 'text-primary bg-primary/10 border border-primary/20'
      };
  }
};

const ApplicationsView = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [feedbackData, setFeedbackData] = useState({ questions: '', experience: '' });
  const [feedbackResult, setFeedbackResult] = useState<any>(null);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsApp, setDetailsApp] = useState<Application | null>(null);

  const fetchApplications = async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      const [appsRes, interviewsRes] = await Promise.all([
        applicationService.getAppliedJobs(),
        interviewService.getMyInterviews()
      ]);
      if (appsRes.success) {
        setApplications(appsRes.data);
      }
      if (interviewsRes.success) {
        setInterviews(interviewsRes.data);
      }
    } catch (error) {
      if (showLoading) {
        toast.error('Failed to load applications');
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchApplications(true);

    // Poll every 5 seconds silently so it updates automatically in real-time
    const interval = setInterval(() => {
      fetchApplications(false);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Keep details modal in sync with background data changes
  useEffect(() => {
    if (detailsApp) {
      const updated = applications.find(a => a._id === detailsApp._id);
      if (updated && (
        updated.status !== detailsApp.status ||
        updated.aiScore !== detailsApp.aiScore ||
        updated.technicalScore !== detailsApp.technicalScore ||
        updated.communicationScore !== detailsApp.communicationScore ||
        updated.cultureScore !== detailsApp.cultureScore ||
        updated.recruiterNotes !== detailsApp.recruiterNotes ||
        updated.recruiterRefinedNotes !== detailsApp.recruiterRefinedNotes
      )) {
        setDetailsApp(updated);
      }
    }
  }, [applications, detailsApp]);


  const getAppsByStatus = (status: string | string[]) => {
    const statuses = Array.isArray(status) ? status : [status];
    return applications.filter(app => statuses.includes(app.status));
  };

  const statusColumns = [
    { title: 'All', iconColor: 'bg-primary/50', statuses: ['applied', 'pending', 'shortlisted', 'interview', 'interviewing', 'hired', 'accepted', 'rejected'] },
    { title: 'Applied', iconColor: 'bg-outline', statuses: ['applied', 'pending'] },
    { title: 'Shortlisted', iconColor: 'bg-emerald-500', statuses: ['shortlisted'] },
    { title: 'Interviewing', iconColor: 'bg-primary', statuses: ['interview', 'interviewing'], pulse: true },
    { title: 'Hired/Accepted', iconColor: 'bg-secondary', statuses: ['hired', 'accepted'] },
    { title: 'Rejected', iconColor: 'bg-red-500', statuses: ['rejected'] }
  ];

  const getStepIndex = (status: string) => {
    if (['applied', 'pending'].includes(status)) return 0;
    if (['shortlisted'].includes(status)) return 1;
    if (['interview', 'interviewing'].includes(status)) return 2;
    if (['hired', 'accepted'].includes(status)) return 3;
    return -1;
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackData.questions || !feedbackData.experience) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setSubmittingFeedback(true);
      const res = await aiService.analyzeRealInterviewFeedback({
        questions: feedbackData.questions,
        experience: feedbackData.experience,
        companyName: (selectedApp?.jobId as any)?.companyId?.name,
        role: (selectedApp?.jobId as any)?.title
      });

      if (res.success) {
        setFeedbackResult(res.data);
        toast.success('AI Analysis Complete!');
      }
    } catch (error) {
      toast.error('Failed to analyze feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-on-surface-variant font-bold uppercase tracking-widest text-xs">Loading Applications...</p>
      </div>
    );
  }

  const currentColumn = statusColumns.find(c => c.title === activeTab) || statusColumns[0];
  const filteredApps = getAppsByStatus(currentColumn.statuses);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black text-on-surface mb-2 tracking-tight">My Applications</h1>
          <p className="text-lg text-on-surface-variant font-medium">Track and manage your active job opportunities.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/candidate/job-matches" className="bg-primary text-white px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-xl transition-all hover:scale-[1.02] flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Find More Jobs
          </Link>
        </div>
      </div>

      {/* Dynamic Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-surface-container/20 rounded-2xl md:rounded-full border border-outline-variant/10 overflow-x-auto scrollbar-hide md:overflow-x-visible">
        {statusColumns.map((col) => {
          const count = getAppsByStatus(col.statuses).length;
          const isActive = activeTab === col.title;
          
          return (
            <button
              key={col.title}
              onClick={() => { setActiveTab(col.title); setFeedbackResult(null); }}
              className={cn(
                "px-5 py-3 rounded-xl md:rounded-full flex items-center justify-center gap-2 transition-all relative group overflow-hidden flex-shrink-0 md:flex-1",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/20 z-10 scale-[1.02] md:scale-105" 
                  : "text-on-surface-variant hover:bg-primary/5 hover:text-primary"
              )}
            >
              <span className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-500 shrink-0", 
                isActive ? "bg-white" : col.iconColor, 
                col.pulse && "animate-pulse"
              )}></span>
              <span className="text-[11px] md:text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                {col.title}
              </span>
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[9px] font-black transition-colors shrink-0",
                isActive ? "bg-white/20 text-white" : "bg-surface-container text-on-surface-variant/40 group-hover:bg-primary/10 group-hover:text-primary"
              )}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {filteredApps.map((app) => {
          const job = app.jobId as any;
          const isInterviewStage = app.status === 'interview';
          const styles = getStatusCardStyles(app.status);

          return (
            <div 
              key={app._id}
              className={cn(
                "border border-outline-variant/30 rounded-[48px] p-8 transition-all group relative border-b-8 flex flex-col justify-between",
                styles.bgClass,
                styles.borderClass,
                styles.hoverShadow
              )}
            >
              {/* Celebratory Sparkles for Hired status */}
              {(app.status === 'hired' || app.status === 'accepted') && (
                <div className="absolute top-6 right-6 text-secondary animate-bounce pointer-events-none">
                  <Sparkles className="w-5 h-5 fill-secondary" />
                </div>
              )}

              <div className="flex justify-between items-start mb-6">
                <div className="w-20 h-20 rounded-[28px] bg-surface-container flex items-center justify-center border border-outline-variant/10 overflow-hidden group-hover:bg-primary/5 group-hover:border-primary/20 transition-all shrink-0">
                  {job?.companyId?.logo ? (
                    <img src={job.companyId.logo} alt={job.companyId.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-2xl font-black text-primary/40 uppercase">{(job as any)?.companyId?.name?.[0] || 'J'}</div>
                  )}
                </div>
                {getStatusBadge(app.status)}
              </div>

              {/* Category & Job Type Badges */}
              <div className="flex items-center gap-2 mb-2">
                {job?.category && (
                  <span className="text-[9px] font-black uppercase tracking-widest text-secondary">{job.category}</span>
                )}
                {job?.category && job?.jobType && (
                  <span className="w-1 h-1 bg-outline-variant rounded-full" />
                )}
                {job?.jobType && (
                  <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60">
                    {Array.isArray(job.jobType) ? job.jobType.join(' • ') : job.jobType}
                  </span>
                )}
              </div>
              
              <h4 className="text-2xl font-black text-on-surface mb-2 group-hover:text-primary transition-colors leading-tight">
                {job?.title || 'Unknown Role'}
              </h4>
              <p className="text-base font-bold text-on-surface-variant mb-6 flex items-center gap-2 group-hover:text-on-surface transition-colors">
                {job?.companyId?.name || 'Unknown Company'} 
                <span className="w-1.5 h-1.5 rounded-full bg-outline-variant/30 group-hover:bg-primary/30 transition-colors"></span>
                {job?.location || 'Remote'}
              </p>

              {/* Requirements/Skills Badges */}
              {job?.requirements && job.requirements.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {job.requirements.slice(0, 3).map((req: string) => (
                    <span key={req} className="px-2.5 py-1 rounded-xl bg-surface-container-low text-on-surface-variant text-[10px] font-bold border border-outline-variant/20">
                      {req}
                    </span>
                  ))}
                </div>
              )}

              {(() => {
                const matchingInterview = interviews.find(
                  i => (i.jobId?._id === job?._id || i.jobId === job?._id) && i.status === 'scheduled'
                );
                // Show ONLY if active tab is 'Interviewing' and candidate interest is confirmed
                if (!matchingInterview || activeTab !== 'Interviewing' || !matchingInterview.candidateConfirmed) return null;
                return (
                  <div className="bg-primary/5 rounded-[24px] border border-primary/10 p-5 mb-6 flex flex-col gap-3 animate-in fade-in">
                    <div className="text-[9px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5" /> Scheduled Interview
                    </div>
                    <div className="text-xs font-bold text-on-surface-variant space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {new Date(matchingInterview.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-secondary" />
                        {matchingInterview.time}
                      </div>
                    </div>
                    <a 
                      href={matchingInterview.meetingLink || '#'} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-full text-center bg-primary text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-xl hover:bg-primary-dark transition-all flex items-center justify-center gap-1.5 shadow-md shadow-primary/10"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Join Meet
                    </a>
                  </div>
                );
              })()}

              <div className="flex justify-between items-center pt-6 border-t border-outline-variant/10">
                <div className="flex flex-col gap-1">
                  {job?.salary && (
                    <span className="text-sm font-black text-on-surface">{job.salary}</span>
                  )}
                  <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-on-surface-variant/50 group-hover:text-primary/70 transition-colors">
                    <Clock className="w-4 h-4" />
                    {app.createdAt && isValid(new Date(app.createdAt)) 
                      ? `${formatDistanceToNow(new Date(app.createdAt))} ago` 
                      : 'Recent'}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {isInterviewStage && (
                    <button 
                      onClick={() => { setSelectedApp(app); setShowFeedbackModal(true); setFeedbackResult(null); }}
                      className="px-5 py-3 rounded-2xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 shadow-sm hover:bg-primary hover:text-white transition-all flex items-center gap-1.5"
                    >
                      <BrainCircuit className="w-4 h-4" />
                      Feedback
                    </button>
                  )}
                  <button 
                    onClick={() => { setDetailsApp(app); setShowDetailsModal(true); }}
                    className="w-12 h-12 rounded-[20px] bg-surface-container flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:rotate-[-45deg] transition-all border-none outline-none cursor-pointer"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredApps.length === 0 && (
          <div className="col-span-full border-4 border-dashed border-outline-variant/10 rounded-[48px] p-24 flex flex-col items-center justify-center text-center opacity-40 bg-surface-container/10">
            <Archive className="w-16 h-16 text-outline-variant mb-6" />
            <h3 className="text-xl font-black text-on-surface uppercase tracking-widest">No Applications</h3>
            <p className="text-sm font-bold text-on-surface-variant mt-2">You haven't reached this stage for any job yet.</p>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedbackModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFeedbackModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-surface-container-lowest w-full max-w-2xl rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden border border-outline-variant/30 max-h-[90vh] overflow-y-auto z-10"
            >
              <div className="absolute top-0 right-0 p-8">
                <button onClick={() => setShowFeedbackModal(false)} className="text-on-surface-variant hover:text-on-surface transition-colors bg-transparent border-none outline-none cursor-pointer">
                  <Plus className="w-8 h-8 rotate-45" />
                </button>
              </div>

              <div className="mb-10">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3 block">Post-Interview Analysis</span>
                <h2 className="text-3xl font-black text-on-surface leading-tight">Share Your Experience</h2>
                <p className="text-on-surface-variant font-medium mt-2">Analyze your real-world interview with AI to improve your chances.</p>
              </div>

              {!feedbackResult ? (
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant px-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Questions Asked
                    </label>
                    <textarea 
                      placeholder="E.g. Tell me about a time you solved a complex bug..."
                      className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-3xl p-6 text-on-surface placeholder:text-on-surface-variant/40 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none min-h-[120px]"
                      value={feedbackData.questions}
                      onChange={(e) => setFeedbackData({...feedbackData, questions: e.target.value})}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant px-2 flex items-center gap-2">
                      <BrainCircuit className="w-4 h-4 text-secondary" />
                      Your Response/Experience
                    </label>
                    <textarea 
                      placeholder="Describe how you answered and how the interviewer reacted..."
                      className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-3xl p-6 text-on-surface placeholder:text-on-surface-variant/40 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none min-h-[150px]"
                      value={feedbackData.experience}
                      onChange={(e) => setFeedbackData({...feedbackData, experience: e.target.value})}
                    />
                  </div>

                  <button 
                    onClick={handleFeedbackSubmit}
                    disabled={submittingFeedback}
                    className="w-full gradient-button text-white font-black text-sm py-5 rounded-[24px] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-primary/20"
                  >
                    {submittingFeedback ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6" />}
                    Generate AI Report
                  </button>
                </div>
              ) : (
                <div className="space-y-10 animate-in zoom-in-95 duration-500">
                  <div className="flex flex-col items-center text-center p-8 bg-primary/5 rounded-[40px] border border-primary/10">
                    <div className="text-6xl font-black text-primary mb-2">{feedbackResult.readinessScore}%</div>
                    <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Interview Performance Score</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-sm font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> Strengths
                      </h4>
                      <ul className="space-y-3">
                        {feedbackResult.strengths?.map((s: string, i: number) => (
                          <li key={i} className="text-sm font-medium text-on-surface-variant flex gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-black uppercase tracking-widest text-red-500 flex items-center gap-2">
                        <Zap className="w-4 h-4" /> Identified Gaps
                      </h4>
                      <ul className="space-y-3">
                        {feedbackResult.weaknesses?.map((w: string, i: number) => (
                          <li key={i} className="text-sm font-medium text-on-surface-variant flex gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0"></span>
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-8 bg-surface-container rounded-[32px] border border-outline-variant/10">
                    <h4 className="text-sm font-black uppercase tracking-widest text-primary mb-4">Coach's Advice</h4>
                    <p className="text-on-surface-variant font-medium leading-relaxed italic">"{feedbackResult.overallAssessment}"</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {feedbackResult.improvementTips?.map((tip: string, i: number) => (
                        <span key={i} className="px-3 py-1.5 bg-white dark:bg-zinc-900 rounded-xl text-[11px] font-bold text-on-surface-variant border border-outline-variant/10">
                          {tip}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => { setFeedbackResult(null); setFeedbackData({ questions: '', experience: '' }); }}
                    className="w-full bg-on-surface text-surface-container-lowest font-black text-sm py-5 rounded-[24px] hover:bg-primary hover:text-white transition-all shadow-xl"
                  >
                    Analyze Another Interview
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Application Details Modal */}
      <AnimatePresence>
        {showDetailsModal && detailsApp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailsModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-surface-container-lowest w-full max-w-2xl rounded-[40px] p-8 md:p-12 shadow-2xl relative border border-outline-variant/30 max-h-[90vh] overflow-y-auto z-10"
            >
              <div className="absolute top-0 right-0 p-8">
                <button onClick={() => setShowDetailsModal(false)} className="text-on-surface-variant hover:text-on-surface transition-colors bg-transparent border-none outline-none cursor-pointer">
                  <Plus className="w-8 h-8 rotate-45" />
                </button>
              </div>

              <div className="mb-8">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3 block">Application Progress</span>
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-[24px] bg-surface-container flex items-center justify-center border border-outline-variant/10 overflow-hidden shrink-0">
                    {(detailsApp.jobId as any)?.companyId?.logo ? (
                      <img src={(detailsApp.jobId as any).companyId.logo} alt={(detailsApp.jobId as any).companyId.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-xl font-black text-primary/40 uppercase">{(detailsApp.jobId as any)?.companyId?.name?.[0] || 'J'}</div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-on-surface leading-tight">{(detailsApp.jobId as any)?.title || 'Unknown Role'}</h2>
                    <p className="text-sm font-bold text-on-surface-variant mt-1 flex items-center gap-1.5">
                      {(detailsApp.jobId as any)?.companyId?.name || 'Unknown Company'}
                      <span className="w-1.5 h-1.5 rounded-full bg-outline-variant/30"></span>
                      {(detailsApp.jobId as any)?.location || 'Remote'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stepper progress */}
              <div className="p-6 bg-surface-container/30 rounded-[32px] border border-outline-variant/15 mb-8">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-6">Pipeline Tracking</h3>
                {detailsApp.status === 'rejected' ? (
                  <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-500">
                    <AlertCircle className="w-6 h-6 shrink-0" />
                    <div>
                      <div className="text-sm font-black uppercase tracking-wider">Application Rejected</div>
                      <div className="text-xs font-semibold text-red-500/80 mt-0.5">The recruiter has decided not to proceed with your application at this time. Keep searching!</div>
                    </div>
                  </div>
                ) : (
                  <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-2">
                    {[
                      { label: 'Applied', key: ['applied', 'pending'] },
                      { label: 'Shortlisted', key: ['shortlisted'] },
                      { label: 'Interviewing', key: ['interview', 'interviewing'] },
                      { label: 'Hired / Accepted', key: ['hired', 'accepted'] }
                    ].map((step, idx) => {
                      const currentIdx = getStepIndex(detailsApp.status);
                      const isCompleted = idx < currentIdx;
                      const isActive = idx === currentIdx;
                      
                      return (
                        <div key={step.label} className="flex md:flex-col items-center gap-3 md:gap-2 flex-1 w-full relative">
                          {/* Line connector */}
                          {idx > 0 && (
                            <div className={cn(
                              "hidden md:block absolute top-4 right-[50%] translate-x-[-16px] w-[calc(100%-32px)] h-0.5 -z-10",
                              isCompleted || isActive ? "bg-primary" : "bg-outline-variant/20"
                            )} />
                          )}
                          
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all",
                            isCompleted ? "bg-primary text-white" :
                            isActive ? "bg-primary/20 text-primary border-2 border-primary animate-pulse" :
                            "bg-surface-container border border-outline-variant/30 text-on-surface-variant/40"
                          )}>
                            {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest text-center",
                            isActive ? "text-primary" : "text-on-surface-variant/60"
                          )}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* AI and Recruiter Scores (if evaluated) */}
              {((detailsApp.aiScore || 0) > 0 || (detailsApp.technicalScore || 0) > 0 || (detailsApp.communicationScore || 0) > 0 || (detailsApp.cultureScore || 0) > 0) && (
                <div className="mb-8">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-4 px-2">Evaluation Metrics</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: 'AI Score', val: detailsApp.aiScore, color: 'text-primary bg-primary/5' },
                      { label: 'Technical', val: detailsApp.technicalScore, color: 'text-secondary bg-secondary/5' },
                      { label: 'Communication', val: detailsApp.communicationScore, color: 'text-emerald-500 bg-emerald-500/5' },
                      { label: 'Culture Fit', val: detailsApp.cultureScore, color: 'text-amber-500 bg-amber-500/5' }
                    ].map(score => {
                      if (score.val === undefined || score.val === null || score.val === 0) return null;
                      return (
                        <div key={score.label} className={cn("p-4 rounded-3xl border border-outline-variant/10 text-center flex flex-col items-center justify-center gap-1", score.color)}>
                          <div className="text-2xl font-black">{score.val}%</div>
                          <div className="text-[9px] font-black uppercase tracking-wider text-on-surface-variant/50">{score.label}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Recruiter Notes */}
              {(detailsApp.recruiterNotes || detailsApp.recruiterRefinedNotes) && (
                <div className="p-6 bg-surface-container/50 rounded-[32px] border border-outline-variant/10 mb-8 space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-primary">Recruiter Assessment</h3>
                  {detailsApp.recruiterNotes && (
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60">Evaluation Summary</div>
                      <p className="text-sm font-medium text-on-surface-variant leading-relaxed mt-1 italic font-serif">"{detailsApp.recruiterNotes}"</p>
                    </div>
                  )}
                  {detailsApp.recruiterRefinedNotes && (
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60">AI-Refined Candidate Fit</div>
                      <p className="text-sm font-medium text-on-surface-variant leading-relaxed mt-1 italic font-serif">"{detailsApp.recruiterRefinedNotes}"</p>
                    </div>
                  )}
                </div>
              )}

              <button 
                onClick={() => setShowDetailsModal(false)}
                className="w-full bg-on-surface text-surface-container-lowest font-black text-sm py-5 rounded-[24px] hover:bg-primary hover:text-white transition-all shadow-xl"
              >
                Close Portal
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApplicationsView;
