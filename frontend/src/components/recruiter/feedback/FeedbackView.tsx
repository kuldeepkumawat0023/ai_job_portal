'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Star, 
  MessageSquare, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronRight, 
  Sparkles,
  Award,
  Zap,
  BrainCircuit,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { applicationService, Application } from '@/lib/services/application.services';
import { aiService } from '@/lib/services/ai.services';
import { toast } from 'react-hot-toast';
import { cn } from '@/utils/cn';

// Subcomponent: Feedback Evaluation Form
const FeedbackForm = ({ 
  application, 
  onClose, 
  scores, 
  setScores, 
  rawNotes, 
  setRawNotes, 
  handleRefineAI, 
  isRefining, 
  refinedFeedback,
  decision,
  setDecision,
  onSubmit,
  isSubmitting
}: any) => {
  const applicant = typeof application.applicantId === 'object' ? application.applicantId : null;
  
  return (
    <div className="glass-card p-8 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden" id={`feedback-form-${application._id}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <h2 className="text-2xl font-black text-on-surface tracking-tight">Submit Feedback</h2>
          <p className="text-xs font-medium text-on-surface-variant">Evaluating {applicant?.fullname || 'Applicant'}</p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 text-on-surface-variant hover:text-rose-500 transition-colors"
          id="btn-close-form"
        >
          <XCircle className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-8 relative z-10">
        {/* Skill Sliders */}
        <div className="space-y-6">
          {[
            { key: 'technical', label: 'Technical Proficiency', icon: Zap, color: 'text-amber-500' },
            { key: 'communication', label: 'Communication Skills', icon: MessageSquare, color: 'text-sky-500' },
            { key: 'culture', label: 'Cultural Alignment', icon: Users, color: 'text-indigo-500' },
          ].map((skill) => (
            <div key={skill.key} className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                  <skill.icon className={`w-3.5 h-3.5 ${skill.color}`} />
                  {skill.label}
                </label>
                <span className="text-xs font-black text-on-surface">{scores[skill.key]}/10</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="10" 
                value={scores[skill.key]}
                onChange={(e) => setScores({...scores, [skill.key]: parseInt(e.target.value)})}
                className="w-full h-1.5 bg-surface-container rounded-full appearance-none cursor-pointer accent-primary"
              />
            </div>
          ))}
        </div>

        {/* Decision Toggle */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            type="button"
            onClick={() => setDecision('hired')}
            className={cn(
              "flex items-center justify-center gap-2 py-3 border rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all",
              decision === 'hired'
                ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20 scale-[1.02]"
                : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20"
            )}
            id="btn-decision-hire"
          >
            <ThumbsUp className="w-4 h-4" />
            Recommend Hire
          </button>
          <button 
            type="button"
            onClick={() => setDecision('rejected')}
            className={cn(
              "flex items-center justify-center gap-2 py-3 border rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all",
              decision === 'rejected'
                ? "bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20 scale-[1.02]"
                : "bg-rose-500/10 text-rose-600 border-rose-500/20 hover:bg-rose-500/20"
            )}
            id="btn-decision-reject"
          >
            <ThumbsDown className="w-4 h-4" />
            Reject
          </button>
        </div>

        {/* Notes & AI Refinement */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Internal Notes</label>
            <textarea 
              className="w-full bg-surface-container/50 border border-outline-variant/30 rounded-2xl p-4 text-sm font-medium text-on-surface focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none"
              placeholder="Type raw assessment draft notes here..."
              rows={3}
              value={rawNotes}
              onChange={(e) => setRawNotes(e.target.value)}
              id="raw-notes-textarea"
            />
          </div>

          <button 
            type="button"
            onClick={handleRefineAI}
            disabled={isRefining || !rawNotes.trim()}
            className="w-full py-3 bg-primary/10 text-primary border border-primary/20 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/20 transition-all disabled:opacity-50"
            id="btn-refine-notes"
          >
            {isRefining ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                Refining...
              </div>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                AI Refine Summary
              </>
            )}
          </button>

          {refinedFeedback && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 bg-primary/5 rounded-2xl border border-primary/10"
              id="ai-refined-feedback-box"
            >
              <p className="text-[11px] leading-relaxed text-on-surface font-medium italic">
                <span className="font-black text-primary uppercase not-italic mr-1 tracking-tighter">AI Refined Evaluation:</span>
                "{refinedFeedback}"
              </p>
            </motion.div>
          )}
        </div>

        <button 
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || !decision}
          className="w-full py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
          id="btn-submit-evaluation"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          Submit Final Decision
        </button>
      </div>
    </div>
  );
};

const FeedbackView = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isRefining, setIsRefining] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [scores, setScores] = useState({ technical: 8, communication: 7, culture: 9 });
  const [rawNotes, setRawNotes] = useState('');
  const [refinedFeedback, setRefinedFeedback] = useState('');
  const [decision, setDecision] = useState<'hired' | 'rejected' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch applications on load
  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await applicationService.getRecruiterApplications();
      if (res.success && res.data) {
        setApplications(res.data);
      } else {
        setError(res.message || 'Failed to fetch candidate applications.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading feedback records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleRefineAI = async () => {
    if (!rawNotes.trim()) return;
    try {
      setIsRefining(true);
      const res = await aiService.refineFeedback(rawNotes, scores);
      if (res.success && res.data) {
        setRefinedFeedback(res.data);
        toast.success('Feedback successfully enhanced by AI!');
      }
    } catch (err) {
      toast.error('AI refinement was temporarily interrupted. Using manual text.');
      setRefinedFeedback(rawNotes);
    } finally {
      setIsRefining(false);
    }
  };

  const handleSubmitEvaluation = async () => {
    if (!selectedApplication || !decision) return;

    try {
      setIsSubmitting(true);
      const res = await applicationService.updateStatus(selectedApplication._id, decision, {
        technicalScore: scores.technical,
        communicationScore: scores.communication,
        cultureScore: scores.culture,
        recruiterNotes: rawNotes,
        recruiterRefinedNotes: refinedFeedback || rawNotes
      });

      if (res.success) {
        toast.success(`Candidate successfully ${decision === 'hired' ? 'recommended for hire' : 'rejected'}.`);
        setSelectedApplication(null);
        setDecision(null);
        setRawNotes('');
        setRefinedFeedback('');
        setScores({ technical: 8, communication: 7, culture: 9 });
        
        // Reload applications list to dynamically transfer state
        await loadApplications();
      } else {
        toast.error(res.message || 'Failed to update evaluation decision.');
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred during final submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter dynamic lists
  const pendingEvaluation = applications.filter(app => {
    const status = app.status || 'applied';
    return ['interview', 'interviewing'].includes(status);
  });

  const evaluationHistory = applications.filter(app => {
    const status = app.status || 'applied';
    return ['hired', 'rejected'].includes(status);
  });

  // Apply search query filter
  const filteredPending = pendingEvaluation.filter(app => {
    const applicant = typeof app.applicantId === 'object' ? app.applicantId : null;
    return applicant?.fullname?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4" id="feedback-loading-screen">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-on-surface-variant font-black uppercase tracking-widest text-xs">Loading Candidate Pipeline...</p>
      </div>
    );
  }

  return (
    <main className="space-y-10 animate-in fade-in duration-700" id="recruiter-feedback-container">
      
      {/* 🚀 SEO & Accessibility Friendly Header Area */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-on-surface mb-2 tracking-tight">Interview Evaluation</h1>
          <p className="text-on-surface-variant font-medium text-sm">Submit strategic evaluations and AI-polished assessments for interviewed candidates.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input 
              type="text" 
              placeholder="Search candidates..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container rounded-2xl py-2 pl-10 pr-4 text-sm font-medium border border-white/10 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              id="search-candidates-input"
            />
          </div>
          <button className="p-2.5 bg-surface-container rounded-2xl border border-white/10 text-on-surface-variant hover:bg-surface-container-high transition-all" id="btn-filter-toggle">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </header>

      {error && (
        <div className="p-5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-3xl flex items-center gap-3 text-sm font-semibold" id="feedback-error-banner">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Pending Feedback Cards */}
        <section className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-black text-on-surface flex items-center gap-2">
              <Clock className="w-5 h-5 text-secondary" />
              Pending Evaluation
              <span className="ml-2 px-2.5 py-0.5 bg-secondary/10 text-secondary text-[10px] rounded-full uppercase font-black tracking-widest">
                {filteredPending.length}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredPending.map((app, i) => {
              const applicant = typeof app.applicantId === 'object' ? app.applicantId : null;
              const job = typeof app.jobId === 'object' ? app.jobId : null;
              const isSelected = selectedApplication?._id === app._id;
              
              return (
                <React.Fragment key={app._id}>
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(i * 0.05, 0.4) }}
                    className={cn(
                      "glass-card p-5 rounded-3xl border border-white/10 group cursor-pointer transition-all duration-300",
                      isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-surface-container-low'
                    )}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedApplication(null);
                      } else {
                        setSelectedApplication(app);
                        setDecision(null);
                        setRawNotes('');
                        setRefinedFeedback('');
                        setScores({ technical: 8, communication: 7, culture: 9 });
                      }
                    }}
                    id={`candidate-row-${app._id}`}
                  >
                    <div className="flex items-center gap-5">
                      <div className="relative shrink-0">
                        <img 
                          src={applicant?.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150'} 
                          alt={applicant?.fullname || 'Candidate'} 
                          className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/20" 
                        />
                        {app.aiScore !== undefined && app.aiScore > 0 && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-lg flex items-center justify-center text-[10px] font-black text-white shadow-lg" title="AI Profile Score Match">
                            {app.aiScore}%
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="text-lg font-black text-on-surface truncate group-hover:text-primary transition-colors">
                              {applicant?.fullname || 'Anonymous Candidate'}
                            </h3>
                            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest truncate">
                              {job?.title || 'Applied Position'}
                            </p>
                          </div>
                          <div className="flex items-center shrink-0 gap-1.5 px-3 py-1 rounded-xl bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-wider">
                            <Clock size={12} />
                            <span>Interviewed</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-[10px] font-black text-on-surface-variant/60 uppercase">
                            Skills: {applicant?.skills?.slice(0, 3).join(', ') || 'General Profile'}
                          </span>
                        </div>
                      </div>
                      <button className={cn(
                        "p-3 bg-primary/10 text-primary rounded-2xl transition-all shrink-0",
                        isSelected ? 'rotate-90 bg-primary text-white' : 'group-hover:scale-110 opacity-0 group-hover:opacity-100'
                      )}>
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>

                  {/* Dynamic Mobile Form inline drop-down */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden overflow-hidden w-full mt-2"
                      >
                        <div className="pt-2 pb-6">
                          <FeedbackForm 
                            application={app} 
                            onClose={() => setSelectedApplication(null)}
                            scores={scores}
                            setScores={setScores}
                            rawNotes={rawNotes}
                            setRawNotes={setRawNotes}
                            handleRefineAI={handleRefineAI}
                            isRefining={isRefining}
                            refinedFeedback={refinedFeedback}
                            decision={decision}
                            setDecision={setDecision}
                            onSubmit={handleSubmitEvaluation}
                            isSubmitting={isSubmitting}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              );
            })}

            {filteredPending.length === 0 && (
              <div className="border-4 border-dashed border-outline-variant/10 rounded-[32px] p-20 flex flex-col items-center justify-center text-center opacity-45 bg-surface-container/10">
                <Users className="w-16 h-16 text-outline-variant mb-4" />
                <h3 className="text-lg font-black text-on-surface uppercase tracking-widest">No Pending Candidates</h3>
                <p className="text-xs font-bold text-on-surface-variant mt-1">There are currently no active applications in the interviewing state.</p>
              </div>
            )}
          </div>

          {/* Evaluation History Section */}
          <section className="pt-10">
            <h2 className="text-xl font-black text-on-surface flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-emerald-500" />
              Evaluation History
            </h2>
            <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface-container-high/50 border-b border-outline-variant/10">
                      <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Candidate</th>
                      <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">ATS Status</th>
                      <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest text-right">Result & Feedback</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {evaluationHistory.map((app) => {
                      const applicant = typeof app.applicantId === 'object' ? app.applicantId : null;
                      const job = typeof app.jobId === 'object' ? app.jobId : null;
                      const hasRating = app.technicalScore || app.communicationScore || app.cultureScore;
                      const avgRating = hasRating ? Math.round(((app.technicalScore || 0) + (app.communicationScore || 0) + (app.cultureScore || 0)) / 6) : 4;
                      
                      return (
                        <tr key={app._id} className="hover:bg-surface-container-low transition-colors group">
                          <td className="px-6 py-5">
                            <div>
                              <p className="text-sm font-bold text-on-surface">{applicant?.fullname || 'Anonymous Candidate'}</p>
                              <p className="text-[10px] font-medium text-on-surface-variant">{job?.title || 'Job Role'}</p>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className={cn(
                              "px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                              app.status === 'hired' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                            )}>
                              {app.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex flex-col items-end gap-1">
                              <div className="flex items-center gap-0.5 mb-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star 
                                    key={star} 
                                    className={cn(
                                      "w-2.5 h-2.5",
                                      star <= avgRating ? "fill-amber-500 text-amber-500" : "text-outline-variant/20"
                                    )} 
                                  />
                                ))}
                                <span className="ml-1 text-[10px] font-black text-on-surface">{avgRating} Stars</span>
                              </div>
                              {app.recruiterRefinedNotes && (
                                <span className="text-[10px] font-medium text-on-surface-variant italic max-w-xs truncate" title={app.recruiterRefinedNotes}>
                                  "{app.recruiterRefinedNotes}"
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {evaluationHistory.length === 0 && (
                      <tr>
                        <td colSpan={3} className="text-center py-10 opacity-55 text-xs font-bold text-on-surface-variant">
                          No evaluations logged in database history.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </section>

        {/* Right Column: Feedback Evaluation Form (Desktop Sidebar) */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-10">
          <AnimatePresence mode="wait">
            {selectedApplication ? (
              <motion.div 
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <FeedbackForm 
                  application={selectedApplication} 
                  onClose={() => setSelectedApplication(null)}
                  scores={scores}
                  setScores={setScores}
                  rawNotes={rawNotes}
                  setRawNotes={setRawNotes}
                  handleRefineAI={handleRefineAI}
                  isRefining={isRefining}
                  refinedFeedback={refinedFeedback}
                  decision={decision}
                  setDecision={setDecision}
                  onSubmit={handleSubmitEvaluation}
                  isSubmitting={isSubmitting}
                />
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-10 rounded-3xl border border-white/10 shadow-sm flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]"
              >
                <div className="p-5 bg-surface-container rounded-full">
                  <BrainCircuit className="w-10 h-10 text-on-surface-variant/30 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-on-surface">Select Candidate</h3>
                  <p className="text-sm font-medium text-on-surface-variant max-w-[200px] mx-auto mt-2">
                    Click an applicant from the left roster to initiate their feedback assessment panel.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </div>
    </main>
  );
};

export default FeedbackView;
