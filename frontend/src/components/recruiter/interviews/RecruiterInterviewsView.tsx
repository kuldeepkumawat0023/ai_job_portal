'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  Share2, 
  ChevronRight, 
  Lightbulb, 
  Search, 
  Plus, 
  Sparkles,
  Bot,
  User,
  ExternalLink,
  Coffee,
  X,
  Loader2,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { interviewService, Interview } from '@/lib/services/interview.services';
import { applicationService } from '@/lib/services/application.services';

/**
 * 🗓️ InterviewsView - Premium Recruiter Interview Scheduler (Google Meet Exclusive)
 */
const InterviewsView = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 📝 Scheduling Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [interviewerName, setInterviewerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // 🔄 Fetch recruiter's company interviews
  const fetchInterviews = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await interviewService.getMyInterviews();
      if (res.success && res.data) {
        setInterviews(res.data);
      } else {
        setError(res.message || 'Failed to retrieve scheduled interviews.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading interviews.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 🔄 Fetch active applicants for dropdown selection
  const loadRecruiterApplicants = useCallback(async () => {
    try {
      const res = await applicationService.getRecruiterApplications();
      if (res.success && res.data) {
        // Keep applicants who have active screening/interview pipelines
        setApplications(res.data);
      }
    } catch (err) {
      console.error('Error fetching applicants:', err);
    }
  }, []);

  useEffect(() => {
    fetchInterviews();
    loadRecruiterApplicants();
  }, [fetchInterviews, loadRecruiterApplicants]);

  // 📅 Handlers
  const handleOpenScheduleModal = () => {
    setSelectedAppId('');
    setInterviewDate('');
    setStartTime('');
    setEndTime('');
    setInterviewerName('');
    setSubmitSuccess(false);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleCreateInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppId || !interviewDate || !startTime || !endTime) {
      setModalError('Please fill in all required fields.');
      return;
    }

    // 1. Date Validation (Ensure date is not in the past)
    const today = new Date();
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);

    const selectedDate = new Date(interviewDate);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < todayMidnight) {
      setModalError('Interview date cannot be in the past.');
      return;
    }

    // 2. Time Validation (Ensure end time is after start time)
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;

    if (endTotal <= startTotal) {
      setModalError('End time must be after the start time.');
      return;
    }

    // 3. Current Time Validation (If selected date is today, start time must not be in the past)
    if (selectedDate.getTime() === todayMidnight.getTime()) {
      const currentHours = today.getHours();
      const currentMinutes = today.getMinutes();
      const currentTotal = currentHours * 60 + currentMinutes;
      if (startTotal <= currentTotal) {
        setModalError('Interview start time cannot be in the past.');
        return;
      }
    }

    const selectedApp = applications.find(app => app._id === selectedAppId);
    if (!selectedApp) {
      setModalError('Selected application profile not found.');
      return;
    }

    try {
      setIsSubmitting(true);
      setModalError(null);

      // Parse candidate, job, and company IDs
      const candidateId = typeof selectedApp.applicantId === 'object' ? selectedApp.applicantId._id : selectedApp.applicantId;
      const jobId = typeof selectedApp.jobId === 'object' ? selectedApp.jobId._id : selectedApp.jobId;
      const companyId = typeof selectedApp.jobId === 'object' && selectedApp.jobId.companyId 
        ? (typeof selectedApp.jobId.companyId === 'object' ? selectedApp.jobId.companyId._id : selectedApp.jobId.companyId)
        : null;

      if (!companyId) {
        setModalError('Company profile association missing on job post.');
        setIsSubmitting(false);
        return;
      }

      // Convert 24h start/end times to 12h AM/PM format (e.g. 10:00 AM - 11:00 AM)
      const formatTimeToAMPM = (time24: string) => {
        if (!time24) return '';
        const [hoursStr, minutesStr] = time24.split(':');
        let hours = parseInt(hoursStr, 10);
        const minutes = minutesStr;
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
      };

      const timeSlot = `${formatTimeToAMPM(startTime)} - ${formatTimeToAMPM(endTime)}`;

      const postData = {
        jobId,
        candidateId,
        companyId,
        date: interviewDate,
        time: timeSlot,
        mode: 'Google Meet', // Enforced Exclusively
        interviewer: interviewerName || 'Recruiter'
      };

      const res = await interviewService.scheduleInterview(postData);
      if (res.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setIsModalOpen(false);
          fetchInterviews();
        }, 1500);
      } else {
        setModalError(res.message || 'Failed to schedule interview.');
      }
    } catch (err: any) {
      setModalError(err.message || 'An error occurred during interview submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: 'scheduled' | 'completed' | 'cancelled') => {
    try {
      const res = await interviewService.updateStatus(id, newStatus);
      if (res.success) {
        setInterviews(prev => prev.map(item => item._id === id ? { ...item, status: newStatus } : item));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // 🔍 Filter based on tab selection
  const filteredInterviews = interviews.filter(item => {
    if (activeTab === 'upcoming') {
      return item.status === 'scheduled';
    } else {
      return ['completed', 'cancelled'].includes(item.status);
    }
  });

  // 📊 Generate agenda metrics based on today's scheduled interviews
  const agendaItems = interviews
    .filter(item => item.status === 'scheduled')
    .slice(0, 4)
    .map(item => {
      const cand = typeof item.candidateId === 'object' ? (item.candidateId as any) : null;
      const job = typeof item.jobId === 'object' ? (item.jobId as any) : null;
      return {
        time: item.time,
        name: cand?.fullname || 'Applicant',
        role: job?.title || 'Applied Position',
        active: true
      };
    });

  return (
    <div className="space-y-10 animate-in fade-in duration-700" id="interviews-management-container">
      
      {/* 🚀 SEO Friendly Header Layout */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6" id="interviews-header">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight mb-2" id="interviews-main-title">
            Interview Management
          </h1>
          <p className="text-on-surface-variant font-medium" id="interviews-sub-title">
            Enforced exclusively via <strong>Google Meet</strong> for lightning-fast premium calls.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            id="btn-schedule-new"
            onClick={handleOpenScheduleModal}
            className="gradient-button text-white font-bold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 group"
          >
            <Plus className="w-5 h-5" />
            <span>Schedule New</span>
          </button>
        </div>
      </header>

      <div className="flex flex-col xl:flex-row gap-8">
        
        {/* 📋 Section 1: Dynamic Tab Roster */}
        <section className="flex-1 space-y-6" aria-label="Scheduled Meetings" id="scheduled-meetings-section">
          
          <div className="flex border-b border-outline-variant/30 mb-8" id="interviews-tab-bar">
            {[
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'completed', label: 'Completed & History' }
            ].map(tab => (
              <button 
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-8 py-4 font-black text-[10px] uppercase tracking-[0.2em] transition-all relative",
                  activeTab === tab.id ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
                )}
                aria-label={`Show ${tab.label}`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="interviewTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>

          <div className="space-y-4" id="interviews-list-container">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4" id="spinner-loader">
                <Loader2 className="animate-spin text-primary w-12 h-12" />
                <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant animate-pulse">Syncing call channels...</p>
              </div>
            ) : error ? (
              <div className="glass-card p-8 text-center space-y-4 border-red-500/10" id="error-alert">
                <p className="text-sm font-bold text-red-500">{error}</p>
                <button 
                  id="btn-retry-interviews"
                  onClick={fetchInterviews}
                  className="px-6 py-2 bg-primary text-white rounded-xl text-xs font-bold"
                >
                  Retry Loading
                </button>
              </div>
            ) : filteredInterviews.length === 0 ? (
              <div className="glass-card p-12 text-center space-y-4 border-white/5" id="no-sessions-card">
                <Video className="w-12 h-12 mx-auto text-primary opacity-40 animate-bounce" />
                <h2 className="text-xl font-black text-on-surface">No Interviews Booked</h2>
                <p className="text-xs text-on-surface-variant max-w-md mx-auto">
                  No sessions registered under the "{activeTab}" pipeline at this moment. Click "Schedule New" to construct a new Google Meet channel.
                </p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredInterviews.map((item, i) => {
                  const cand = typeof item.candidateId === 'object' ? (item.candidateId as any) : null;
                  const job = typeof item.jobId === 'object' ? (item.jobId as any) : null;
                  const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  return (
                    <motion.div 
                      key={item._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: Math.min(i * 0.05, 0.4) }}
                      className={cn(
                        "glass-card p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:translate-y-[-4px] transition-all duration-300 border border-white/5",
                        item.status === 'completed' && "opacity-60"
                      )}
                      id={`interview-card-${item._id}`}
                    >
                      <div className="flex items-center gap-5 flex-1">
                        <div className="relative shrink-0">
                          <img 
                            src={cand?.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150'} 
                            alt={cand?.fullname || 'Candidate'} 
                            className="w-14 h-14 rounded-full object-cover border-2 border-primary/20 shadow-lg" 
                          />
                          {item.status === 'scheduled' && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary border-2 border-white rounded-full animate-pulse flex items-center justify-center">
                              <Video size={10} className="text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-black text-on-surface">{cand?.fullname || 'Anonymous Candidate'}</h3>
                            <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest">
                              {job?.title || 'Role Position'}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-[11px] font-semibold text-on-surface-variant">
                            <span className="flex items-center gap-1.5"><Clock size={14} className="text-primary" /> {formattedDate} at {item.time}</span>
                            <span className="flex items-center gap-1.5"><User size={14} className="text-secondary" /> {item.interviewer ? `Interviewer: ${item.interviewer}` : 'Technical Interview'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                        
                        {/* 🖥️ Locked Google Meet Badge */}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/5 border border-primary/15 text-[10px] font-black text-primary uppercase tracking-widest">
                          <Video size={14} /> Google Meet
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                          {item.status === 'scheduled' ? (
                            <>
                              <button 
                                id={`btn-cancel-${item._id}`}
                                onClick={() => handleUpdateStatus(item._id, 'cancelled')}
                                className="flex-1 md:flex-none px-4 py-2.5 bg-red-500/10 text-red-600 rounded-xl hover:bg-red-500/25 transition-all text-[10px] font-black uppercase tracking-wider"
                                title="Cancel Scheduled Interview"
                              >
                                Cancel
                              </button>
                              
                              <button 
                                id={`btn-complete-${item._id}`}
                                onClick={() => handleUpdateStatus(item._id, 'completed')}
                                className="flex-1 md:flex-none px-4 py-2.5 bg-emerald-500/10 text-emerald-600 rounded-xl hover:bg-emerald-500/25 transition-all text-[10px] font-black uppercase tracking-wider"
                                title="Mark session completed"
                              >
                                Done
                              </button>

                              {item.meetingLink && (
                                <a 
                                  id={`btn-join-${item._id}`}
                                  href={item.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 md:flex-none px-6 py-2.5 gradient-button text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2"
                                >
                                  Join Call
                                  <ExternalLink size={14} />
                                </a>
                              )}
                            </>
                          ) : (
                            <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/75 bg-surface-container px-4 py-2 rounded-xl">
                              Status: {item.status}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </section>

        {/* 🧳 Section 2: Sidebar Area */}
        <aside className="w-full xl:w-80 shrink-0 space-y-6" aria-label="Agenda Summary" id="interviews-aside">
          
          {/* Quick Agenda */}
          <div className="glass-card rounded-3xl p-8 relative overflow-hidden" id="widget-quick-agenda">
            <h4 className="text-sm font-black text-on-surface mb-8 uppercase tracking-[0.2em]" id="agenda-heading">
              Quick Agenda
            </h4>
            <div className="relative border-l-2 border-outline-variant/20 ml-3 space-y-10 pb-4">
              {agendaItems.length === 0 ? (
                <div className="text-xs text-on-surface-variant text-center py-6 border border-dashed border-outline-variant/20 rounded-2xl">
                  No active agenda slots scheduled.
                </div>
              ) : (
                agendaItems.map((item, i) => (
                  <div key={i} className="relative pl-8" id={`agenda-node-${i}`}>
                    <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-white shadow-sm transition-all bg-primary scale-125 animate-pulse" />
                    <div className="text-[10px] font-black uppercase tracking-widest mb-2 text-primary">
                      {item.time}
                    </div>
                    <div className="p-4 rounded-2xl border transition-all bg-primary/5 border-primary/20 shadow-md shadow-primary/5">
                      <div className="font-black text-on-surface text-sm">{item.name}</div>
                      <div className="text-[10px] font-medium text-on-surface-variant mt-1">{item.role}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* AI Prep Note Widget */}
          <div className="glass-card rounded-3xl p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10 relative overflow-hidden group cursor-pointer" id="widget-ai-prep">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-primary/20 transition-colors" />
            <div className="flex items-start gap-4 relative z-10">
              <div className="p-2.5 bg-white rounded-xl shadow-sm text-primary">
                <Lightbulb size={20} />
              </div>
              <div>
                <h5 className="text-xs font-black text-on-surface mb-2 uppercase tracking-widest">AI Prep Note</h5>
                <p className="text-[11px] text-on-surface-variant leading-relaxed font-medium">
                  Dynamic analysis suggests focusing interview rounds around **Technical Coding Standards** & core team leadership potentials.
                </p>
              </div>
            </div>
          </div>

          {/* AI Autonomous Mode */}
          <div className="glass-card rounded-3xl p-6 flex items-center justify-between border-l-4 border-l-primary group" id="widget-ai-bot">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Bot size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black text-on-surface uppercase tracking-widest">AI Autonomous Mode</p>
                <p className="text-[9px] text-on-surface-variant font-medium">Let AI conduct 1st round</p>
              </div>
            </div>
            <div className="w-10 h-5 bg-surface-container rounded-full relative p-1 cursor-pointer transition-colors group-hover:bg-primary/20">
              <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
            </div>
          </div>
        </aside>
      </div>

      {/* 🔮 Scheduling Glassmorphic Dialog Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6" id="schedule-dialog-overlay">
            
            {/* Backdrop Blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md" 
            />

            {/* Modal Body Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card w-full max-w-lg rounded-3.5xl p-6 md:p-8 relative z-10 border border-white/10 shadow-2xl overflow-hidden"
              id="schedule-dialog-card"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

              {/* Close Button */}
              <button 
                id="btn-close-modal"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-xl transition-all"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                  <CalendarIcon size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-on-surface leading-tight" id="modal-primary-title">
                    Schedule Interview
                  </h2>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Select candidate, pick dates, and locking to Google Meet.
                  </p>
                </div>
              </div>

              {submitSuccess ? (
                <div className="text-center py-8 space-y-4" id="modal-success-screen">
                  <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-lg font-black text-on-surface">Scheduled Successfully!</h3>
                  <p className="text-xs text-on-surface-variant">Candidate invited via auto-triggered Google Meet invite mail.</p>
                </div>
              ) : (
                <form onSubmit={handleCreateInterview} className="space-y-5" id="interview-schedule-form">
                  
                  {modalError && (
                    <div className="p-3.5 rounded-xl bg-red-500/5 border border-red-500/10 text-red-500 text-xs font-semibold" id="modal-form-error">
                      {modalError}
                    </div>
                  )}

                  {/* Candidate selection dropdown */}
                  <div className="space-y-2">
                    <label htmlFor="select-candidate" className="block text-[10px] font-black uppercase tracking-wider text-on-surface-variant">
                      Select Active Candidate *
                    </label>
                    <select 
                      id="select-candidate"
                      value={selectedAppId}
                      onChange={(e) => setSelectedAppId(e.target.value)}
                      className="w-full bg-surface-container/60 hover:bg-surface-container border border-outline-variant/10 px-4 py-3.5 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-on-surface cursor-pointer"
                      required
                    >
                      <option value="">-- Choose active job applicant --</option>
                      {applications.map(app => {
                        const applicant = typeof app.applicantId === 'object' ? app.applicantId : null;
                        const job = typeof app.jobId === 'object' ? app.jobId : null;
                        return (
                          <option key={app._id} value={app._id}>
                            {applicant?.fullname || 'Applicant'} - {job?.title || 'Position'}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Timing split inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="input-date" className="block text-[10px] font-black uppercase tracking-wider text-on-surface-variant">
                        Interview Date *
                      </label>
                      <input 
                        type="date"
                        id="input-date"
                        min={new Date().toISOString().split('T')[0]}
                        value={interviewDate}
                        onChange={(e) => setInterviewDate(e.target.value)}
                        className="w-full bg-surface-container/60 hover:bg-surface-container border border-outline-variant/10 px-4 py-3.5 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-on-surface"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="input-start-time" className="block text-[10px] font-black uppercase tracking-wider text-on-surface-variant">
                        Start Time *
                      </label>
                      <input 
                        type="time"
                        id="input-start-time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full bg-surface-container/60 hover:bg-surface-container border border-outline-variant/10 px-4 py-3.5 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-on-surface"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="input-end-time" className="block text-[10px] font-black uppercase tracking-wider text-on-surface-variant">
                        End Time *
                      </label>
                      <input 
                        type="time"
                        id="input-end-time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full bg-surface-container/60 hover:bg-surface-container border border-outline-variant/10 px-4 py-3.5 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-on-surface"
                        required
                      />
                    </div>
                  </div>

                  {/* Interviewer Name input */}
                  <div className="space-y-2">
                    <label htmlFor="input-interviewer" className="block text-[10px] font-black uppercase tracking-wider text-on-surface-variant">
                      Interviewer / Recruiter Name
                    </label>
                    <input 
                      type="text"
                      id="input-interviewer"
                      placeholder="e.g. Kuldeep Kumawat"
                      value={interviewerName}
                      onChange={(e) => setInterviewerName(e.target.value)}
                      className="w-full bg-surface-container/60 hover:bg-surface-container border border-outline-variant/10 px-4 py-3.5 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-on-surface"
                    />
                  </div>

                  {/* Channel type locked selection info */}
                  <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-between" id="locked-medium-container">
                    <div className="flex items-center gap-2">
                      <Video className="text-primary shrink-0" size={18} />
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-primary block">
                          Video Conferencing
                        </span>
                        <span className="text-xs text-on-surface font-semibold">
                          Google Meet Channel (Auto-link)
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] font-black text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded uppercase tracking-widest">
                      LOCKED
                    </span>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/10">
                    <button 
                      type="button"
                      id="btn-cancel-modal"
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-3 bg-surface-container hover:bg-surface-container-high rounded-xl text-xs font-bold text-on-surface-variant transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      id="btn-submit-modal"
                      disabled={isSubmitting}
                      className="px-8 py-3 gradient-button text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" size={14} />
                          <span>Scheduling...</span>
                        </>
                      ) : (
                        <span>Generate Schedule</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InterviewsView;
