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
  Loader2
} from 'lucide-react';
import { applicationService, Application } from '@/lib/services/application.services';
import { aiService } from '@/lib/services/ai.services';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow, isValid } from 'date-fns';
import { cn } from '@/utils/cn';

const ApplicationsView = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Applied');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await applicationService.getAppliedJobs();
      if (res.success) {
        setApplications(res.data);
      }
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const getAppsByStatus = (status: string | string[]) => {
    const statuses = Array.isArray(status) ? status : [status];
    return applications.filter(app => statuses.includes(app.status));
  };

  const statusColumns = [
    { title: 'Applied', iconColor: 'bg-outline', statuses: ['pending'] },
    { title: 'Shortlisted', iconColor: 'bg-emerald-500', statuses: ['shortlisted'] },
    { title: 'Interviewing', iconColor: 'bg-primary', statuses: ['interview'], pulse: true },
    { title: 'Hired/Accepted', iconColor: 'bg-secondary', statuses: ['hired', 'accepted'] },
    { title: 'Rejected', iconColor: 'bg-red-500', statuses: ['rejected'] }
  ];

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [feedbackData, setFeedbackData] = useState({ questions: '', experience: '' });
  const [feedbackResult, setFeedbackResult] = useState<any>(null);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

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

          return (
            <div 
              key={app._id}
              className="bg-surface-container-lowest border border-outline-variant/30 rounded-[48px] p-8 hover:shadow-[0_20px_60px_-15px_rgba(70,72,212,0.15)] transition-all group relative border-b-8 border-b-transparent hover:border-b-primary"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="w-20 h-20 rounded-[32px] bg-surface-container/50 flex items-center justify-center border border-outline-variant/10 overflow-hidden group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
                  <Building2 className="w-10 h-10 text-primary transition-transform group-hover:scale-110" />
                </div>
                {isInterviewStage && (
                  <button 
                    onClick={() => { setSelectedApp(app); setShowFeedbackModal(true); setFeedbackResult(null); }}
                    className="px-5 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 shadow-sm hover:bg-primary hover:text-white transition-all flex items-center gap-2"
                  >
                    <BrainCircuit className="w-4 h-4" />
                    Interview Feedback
                  </button>
                )}
              </div>
              
              <h4 className="text-2xl font-black text-on-surface mb-2 group-hover:text-primary transition-colors leading-tight">
                {job?.title || 'Unknown Role'}
              </h4>
              <p className="text-lg font-bold text-on-surface-variant mb-10 flex items-center gap-2 group-hover:text-on-surface transition-colors">
                {job?.companyId?.name || 'Unknown Company'} 
                <span className="w-2 h-2 rounded-full bg-outline-variant/30 group-hover:bg-primary/30 transition-colors"></span>
                {job?.location || 'Remote'}
              </p>

              <div className="flex justify-between items-center pt-8 border-t border-outline-variant/10">
                <div className="flex items-center gap-3 text-[12px] font-black uppercase tracking-widest text-on-surface-variant/60 group-hover:text-primary/70 transition-colors">
                  <Clock className="w-5 h-5" />
                  {app.createdAt && isValid(new Date(app.createdAt)) 
                    ? `${formatDistanceToNow(new Date(app.createdAt))} ago` 
                    : 'Recent'}
                </div>
                <Link href={`/candidate/applications/${app._id}`} className="w-12 h-12 rounded-[20px] bg-surface-container flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:rotate-[-45deg] transition-all">
                  <ChevronRight className="w-6 h-6" />
                </Link>
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
      {showFeedbackModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-surface-container-lowest w-full max-w-2xl rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden border border-white/10 max-h-[90vh] overflow-y-auto">
            <div className="absolute top-0 right-0 p-8">
              <button onClick={() => setShowFeedbackModal(false)} className="text-on-surface-variant hover:text-on-surface transition-colors">
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
                  <p className="text-on-surface-variant font-medium leading-relaxed italic italic">"{feedbackResult.overallAssessment}"</p>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsView;
