'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Video,
  Star,
  Check,
  Building2,
  Loader2,
  CheckCircle,
  ExternalLink,
  User,
  PartyPopper,
  Sparkles,
  X,
  MapPin,
  Briefcase,
  Tag,
  IndianRupee
} from 'lucide-react';
import { interviewService, Interview } from '@/lib/services/interview.services';
import { toast } from 'react-hot-toast';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';

const InterviewsView = () => {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');

  // Feedback Modal States
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<any | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Tips Accordion State
  const [openTipsId, setOpenTipsId] = useState<string | null>(null);

  // ✅ I'm Interested Confirmation Flow
  const searchParams = useSearchParams();
  const router = useRouter();
  const [confirmInterview, setConfirmInterview] = useState<any | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    fetchInterviews();
  }, []);

  // Detect ?confirm=<id> from email link
  useEffect(() => {
    const confirmId = searchParams.get('confirm');
    if (confirmId) {
      fetchConfirmInterview(confirmId);
    }
  }, [searchParams]);

  const fetchConfirmInterview = async (id: string) => {
    try {
      // Find from existing interviews list once loaded, or trigger a load
      const res = await interviewService.getMyInterviews();
      if (res.success && res.data) {
        const found = res.data.find((iv: any) => iv._id === id);
        if (found) {
          setConfirmInterview(found);
          setConfirmed(!!found.candidateConfirmed);
          setShowConfirmModal(true);
        } else {
          toast.error('Interview not found or you are not authorized.');
        }
      }
    } catch {
      toast.error('Could not load interview details.');
    }
  };

  const handleConfirmInterest = async () => {
    if (!confirmInterview) return;
    try {
      setConfirming(true);
      const res = await interviewService.confirmInterest(confirmInterview._id);
      if (res.success) {
        setConfirmed(true);
        toast.success('🎉 Interest confirmed! See you at the interview.');
        fetchInterviews();
        // Remove ?confirm param from URL cleanly
        router.replace('/candidate/interviews');
      } else {
        toast.error(res.message || 'Could not confirm. Please try again.');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setConfirming(false);
    }
  };

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const res = await interviewService.getMyInterviews();
      if (res.success) {
        setInterviews(res.data);
      }
    } catch (error) {
      toast.error('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a star rating');
      return;
    }

    try {
      setSubmittingFeedback(true);
      const res = await interviewService.submitFeedback(selectedInterview._id, feedback, rating);
      if (res.success) {
        toast.success('Thank you for rating your interview experience!');
        setShowFeedbackModal(false);
        setRating(0);
        setFeedback('');
        setSelectedInterview(null);
        fetchInterviews(); // Refresh interviews
      }
    } catch (error) {
      toast.error('Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const getInterviewsByTab = () => {
    return interviews.filter(item => {
      if (activeTab === 'upcoming') return item.status === 'scheduled';
      if (activeTab === 'completed') return item.status === 'completed';
      return item.status === 'cancelled';
    });
  };

  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return dateString;
    }
  };

  const currentTabInterviews = getInterviewsByTab();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-on-surface-variant font-bold uppercase tracking-widest text-xs">Loading schedules...</p>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Dynamic Radial Background */}
      <div
        className="fixed inset-0 pointer-events-none -z-20 opacity-40"
        style={{
          backgroundImage: `radial-gradient(circle at 10% 30%, rgba(70, 72, 212, 0.05), transparent 45%),
                            radial-gradient(circle at 90% 70%, rgba(129, 39, 207, 0.05), transparent 45%)`
        }}
      ></div>

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
        <div>
          <h1 className="text-4xl font-black text-on-surface mb-2 tracking-tight">Interview Center</h1>
          <p className="text-lg text-on-surface-variant font-medium">Join upcoming sessions and evaluate company interview consistency.</p>
        </div>
      </header>

      {/* Tab Switcher */}
      <nav aria-label="Interview categories" className="flex items-center gap-3 p-1.5 bg-surface-container/20 rounded-2xl md:rounded-full border border-outline-variant/10 max-w-md">
        {(['upcoming', 'completed', 'cancelled'] as const).map((tab) => {
          const count = interviews.filter(item => {
            if (tab === 'upcoming') return item.status === 'scheduled';
            if (tab === 'completed') return item.status === 'completed';
            return item.status === 'cancelled';
          }).length;
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setOpenTipsId(null); }}
              className={cn(
                "px-6 py-3 rounded-xl md:rounded-full flex items-center justify-center gap-2 transition-all relative group overflow-hidden flex-1",
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20 z-10 scale-[1.02]"
                  : "text-on-surface-variant hover:bg-primary/5 hover:text-primary"
              )}
            >
              <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                {tab}
              </span>
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[9px] font-black transition-colors shrink-0",
                isActive ? "bg-white/20 text-white" : "bg-surface-container text-on-surface-variant/40"
              )}>
                {count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Interview Cards Grid */}
      <section aria-label="Scheduled interviews" className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {currentTabInterviews.map((item) => {
          const jobTitle = item.jobId?.title || 'Job Role';
          const companyName = item.companyId?.name || 'Company Name';
          const isGoogleMeet = item.mode === 'Google Meet';
          const meetingLink = item.meetingLink || '#';
          const isUpcoming = activeTab === 'upcoming';
          const isCompleted = activeTab === 'completed';

          return (
            <article
              key={item._id}
              className="bg-surface-container-lowest/80 backdrop-blur-md border border-outline-variant/30 rounded-[40px] p-8 hover:shadow-[0_20px_50px_-12px_rgba(70,72,212,0.12)] transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Dynamic decorative backdrop highlight */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-700 pointer-events-none"></div>

              <div>
                {/* Upper row: Company details */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-[24px] bg-surface-container/50 flex items-center justify-center border border-outline-variant/10 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                      {item.companyId?.logo ? (
                        <img src={item.companyId.logo} alt={companyName} className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-8 h-8 text-primary" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-on-surface group-hover:text-primary transition-colors leading-tight">
                        {jobTitle}
                      </h4>
                      <p className="text-sm font-bold text-on-surface-variant mt-1">
                        {companyName}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <div className={cn(
                      "px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm",
                      isUpcoming ? "bg-primary/10 text-primary border border-primary/20" :
                        isCompleted ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                          "bg-red-500/10 text-red-500 border border-red-500/20"
                    )}>
                      {item.status}
                    </div>
                    {isUpcoming && (
                      item.candidateConfirmed ? (
                        <div className="px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          Confirmed
                        </div>
                      ) : (
                        <div className="px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse">
                          Pending Info
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Details list */}
                <div className="space-y-4 my-6 py-4 border-y border-outline-variant/10">
                  <div className="flex items-center gap-3 text-sm font-semibold text-on-surface-variant">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span>{formatDate(item.date)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-semibold text-on-surface-variant">
                    <Clock className="w-5 h-5 text-secondary" />
                    <span>{item.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-semibold text-on-surface-variant">
                    <Video className="w-5 h-5 text-emerald-500" />
                    <span className="flex items-center gap-2">
                      {item.mode}
                      {isUpcoming && isGoogleMeet && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      )}
                    </span>
                  </div>
                  {item.interviewer && (
                    <div className="flex items-center gap-3 text-sm font-semibold text-on-surface-variant">
                      <User className="w-5 h-5 text-secondary" />
                      <span>Interviewer: {item.interviewer}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex flex-col gap-4">
                {isUpcoming && (
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-3">
                      {item.candidateConfirmed ? (
                        <a
                          href={meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 gradient-button text-white font-black text-xs py-4 rounded-[20px] shadow-lg shadow-primary/15 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-center flex items-center justify-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Join Google Meet
                        </a>
                      ) : (
                        <button
                          onClick={() => fetchConfirmInterview(item._id)}
                          className="flex-1 gradient-button text-white font-black text-xs py-4 rounded-[20px] shadow-lg shadow-primary/15 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-center flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Confirm Interest (I'm Interested)
                        </button>
                      )}

                      <button
                        onClick={() => setOpenTipsId(openTipsId === item._id ? null : item._id)}
                        className="px-6 py-4 rounded-[20px] text-xs font-black uppercase tracking-widest text-on-surface border-2 border-outline-variant/30 hover:bg-surface-container transition-all"
                      >
                        Prep Tips
                      </button>
                    </div>

                    {/* Accordion preparation tips */}
                    <AnimatePresence>
                      {openTipsId === item._id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden bg-primary/5 rounded-[24px] border border-primary/10 p-5 mt-2"
                        >
                          <h5 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 animate-pulse" /> AI Interview Prep Tips
                          </h5>
                          <ul className="space-y-2.5 text-xs text-on-surface-variant font-medium">
                            <li className="flex gap-2.5 items-start">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                              <span>Study the role profile: **{jobTitle}** requires deep technical command and strong communication.</span>
                            </li>
                            <li className="flex gap-2.5 items-start">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                              <span>Have a scaling or technical project example ready to discuss in depth.</span>
                            </li>
                            <li className="flex gap-2.5 items-start">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                              <span>Ensure your camera, lighting, and microphone are fully functional before joining the Google Meet.</span>
                            </li>
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {isCompleted && (
                  <div>
                    {item.rating ? (
                      <div className="bg-surface-container/50 border border-outline-variant/10 rounded-[24px] p-5 flex flex-col gap-2 animate-in fade-in">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Your Rating:</span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={cn(
                                  "w-4 h-4 shrink-0",
                                  star <= item.rating ? "text-amber-500 fill-amber-500" : "text-outline-variant/40"
                                )}
                              />
                            ))}
                          </div>
                        </div>
                        {item.feedback && (
                          <p className="text-xs text-on-surface font-semibold leading-relaxed italic border-t border-outline-variant/10 pt-3 mt-1">
                            "{item.feedback}"
                          </p>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => { setSelectedInterview(item); setShowFeedbackModal(true); }}
                        className="w-full bg-on-surface text-surface-container-lowest font-black text-xs py-4 rounded-[20px] hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 group/btn shadow-md"
                      >
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400 group-hover/btn:scale-110 transition-transform" />
                        Share Experience & Rate Company
                      </button>
                    )}
                  </div>
                )}
              </div>
            </article>
          );
        })}

        {currentTabInterviews.length === 0 && (
          <div className="col-span-full border-4 border-dashed border-outline-variant/10 rounded-[48px] p-24 flex flex-col items-center justify-center text-center opacity-40 bg-surface-container/10">
            <Calendar className="w-16 h-16 text-outline-variant mb-6" aria-hidden="true" />
            <h3 className="text-xl font-black text-on-surface uppercase tracking-widest">No Interviews</h3>
            <p className="text-sm font-bold text-on-surface-variant mt-2">You don't have any scheduled sessions in this category.</p>
          </div>
        )}
      </section>

      {/* FEEDBACK MODAL */}
      {showFeedbackModal && selectedInterview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-surface-container-lowest w-full max-w-2xl rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden border border-white/10 max-h-[90vh] overflow-y-auto">
            <div className="absolute top-0 right-0 p-8">
              <button
                onClick={() => { setShowFeedbackModal(false); setRating(0); setFeedback(''); }}
                className="text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="text-3xl">&times;</span>
              </button>
            </div>

            <div className="mb-8">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3 block">Evaluate Interview Process</span>
              <h2 className="text-3xl font-black text-on-surface leading-tight">Rate Your Experience</h2>
              <p className="text-on-surface-variant font-medium mt-2">
                Provide valuable feedback for **{selectedInterview.companyId?.name}** on the role **{selectedInterview.jobId?.title}**.
              </p>
            </div>

            <div className="space-y-8">
              {/* Star Rating Selector */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant px-2 block">
                  Overall Company & Process Rating
                </label>
                <div className="flex items-center gap-3 bg-surface-container/40 p-6 rounded-3xl border border-outline-variant/10 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={cn(
                          "w-10 h-10 transition-colors shrink-0",
                          star <= (hoverRating || rating)
                            ? "text-amber-500 fill-amber-500"
                            : "text-outline-variant/30"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Feedback */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant px-2 block">
                  Provide Detailed Feedback (Optional)
                </label>
                <textarea
                  placeholder="Share details about the interview questions, atmosphere, communication speed, consistency, etc..."
                  className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-3xl p-6 text-on-surface placeholder:text-on-surface-variant/40 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none min-h-[140px] font-semibold"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleFeedbackSubmit}
                disabled={submittingFeedback}
                className="w-full gradient-button text-white font-black text-sm py-5 rounded-[24px] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-primary/20"
              >
                {submittingFeedback ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <CheckCircle className="w-6 h-6" />
                )}
                Submit Candidate Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ I'M INTERESTED CONFIRMATION MODAL */}
      <AnimatePresence>
        {showConfirmModal && confirmInterview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-surface-container-lowest w-full max-w-lg rounded-[32px] border border-white/10 shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="relative bg-gradient-to-br from-primary to-secondary p-6 text-center">
                <button
                  onClick={() => { setShowConfirmModal(false); router.replace('/candidate/interviews'); }}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                >
                  <X className="w-4 h-4" />
                </button>
                <p className="text-white/70 text-[10px] font-bold uppercase tracking-[0.25em]">AI JobFit — Interview Invitation</p>
                <h2 className="text-white text-2xl font-black mt-1">
                  {confirmed ? '🎉 You\'re Confirmed!' : 'You\'re Invited to Interview!'}
                </h2>
              </div>

              <div className="p-6 space-y-5">
                {/* Company Row */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-surface-container overflow-hidden border border-white/10 shrink-0 flex items-center justify-center">
                    {confirmInterview.companyId?.logo
                      ? <img src={confirmInterview.companyId.logo} alt="" className="w-full h-full object-cover" />
                      : <Building2 className="w-7 h-7 text-primary" />
                    }
                  </div>
                  <div>
                    <p className="text-on-surface font-black text-lg">{confirmInterview.companyId?.name || 'Company'}</p>
                    <p className="text-amber-400 text-xs font-bold">⭐ AI-Verified Company</p>
                  </div>
                </div>

                {/* Job Title */}
                <h3 className="text-on-surface font-black text-xl leading-snug">
                  {typeof confirmInterview.jobId === 'object' ? confirmInterview.jobId.title : 'Interview'}
                </h3>

                {/* Job Detail Pills */}
                <div className="flex flex-wrap gap-2">
                  {confirmInterview.jobId?.location && (
                    <span className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-full text-xs font-semibold text-on-surface-variant">
                      <MapPin className="w-3 h-3 text-primary" /> {confirmInterview.jobId.location}
                    </span>
                  )}
                  {confirmInterview.jobId?.experience !== undefined && (
                    <span className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-full text-xs font-semibold text-on-surface-variant">
                      <Briefcase className="w-3 h-3 text-primary" /> {confirmInterview.jobId.experience}+ yrs
                    </span>
                  )}
                  {confirmInterview.jobId?.salary && (
                    <span className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-full text-xs font-semibold text-on-surface-variant">
                      <IndianRupee className="w-3 h-3 text-primary" /> {confirmInterview.jobId.salary}
                    </span>
                  )}
                  {confirmInterview.jobId?.category && (
                    <span className="flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-full text-xs font-semibold text-on-surface-variant">
                      <Tag className="w-3 h-3 text-primary" /> {confirmInterview.jobId.category}
                    </span>
                  )}
                </div>

                {/* Schedule Box */}
                <div className="bg-primary/8 border border-primary/20 rounded-2xl p-4">
                  <p className="text-[10px] font-black text-primary/70 uppercase tracking-widest mb-1">Interview Schedule</p>
                  <p className="text-on-surface font-black text-base">
                    📅 {new Date(confirmInterview.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    &nbsp;|&nbsp;
                    🕐 {confirmInterview.time}
                  </p>
                  <p className="text-on-surface-variant text-xs mt-1">
                    Mode: Google Meet &nbsp;•&nbsp; Interviewer: {confirmInterview.interviewer || 'Recruiter'}
                  </p>
                </div>

                {/* Action Buttons */}
                {confirmed ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500 font-black text-sm">
                      <Check className="w-5 h-5" /> Attendance Confirmed!
                    </div>
                    {confirmInterview.meetingLink && (
                      <a
                        href={confirmInterview.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-primary to-secondary text-white font-black text-sm rounded-2xl hover:scale-[1.02] transition-all shadow-lg shadow-primary/20"
                      >
                        <ExternalLink className="w-4 h-4" /> Join Google Meet
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={handleConfirmInterest}
                      disabled={confirming}
                      className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-60"
                    >
                      {confirming ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                      I'm Interested — Confirm Attendance
                    </button>
                    <p className="text-center text-xs text-on-surface-variant">
                      You will get a reminder mail for this interview
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default InterviewsView;
