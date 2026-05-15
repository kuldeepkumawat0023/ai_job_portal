'use client';

import React, { useState } from 'react';
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
  TrendingUp,
  BrainCircuit,
  MoreVertical,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data
const pendingFeedback = [
  { id: 1, name: 'Sarah Jenkins', role: 'Senior UX Designer', date: 'Oct 24, 2023', score: 92, rating: 4.8, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100' },
  { id: 2, name: 'David Chen', role: 'Fullstack Developer', date: 'Oct 25, 2023', score: 88, rating: 4.2, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100' },
  { id: 3, name: 'Elena Rodriguez', role: 'Frontend Engineer', date: 'Oct 26, 2023', score: 94, rating: 4.9, img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100' },
];

const feedbackHistory = [
  { id: 101, name: 'Marcus Kim', role: 'Backend Lead', status: 'Hired', score: 96, rating: 4.9, date: 'Oct 20, 2023', comment: 'Exceptional system design skills.' },
  { id: 102, name: 'Lisa Wang', role: 'UI Designer', status: 'Rejected', score: 65, rating: 3.2, date: 'Oct 18, 2023', comment: 'Portfolio strong, but lacked collaborative experience.' },
  { id: 103, name: 'James Wilson', role: 'DevOps Engineer', status: 'Hired', score: 89, rating: 4.5, date: 'Oct 15, 2023', comment: 'Deep knowledge of Kubernetes and CI/CD.' },
];

const FeedbackForm = ({ 
  candidate, 
  onClose, 
  scores, 
  setScores, 
  rawNotes, 
  setRawNotes, 
  handleRefineAI, 
  isSubmitting, 
  refinedFeedback 
}: any) => (
  <div className="glass-card p-8 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden">
    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
    
    <div className="flex justify-between items-start mb-8 relative z-10">
      <div>
        <h2 className="text-2xl font-black text-on-surface tracking-tight">Submit Feedback</h2>
        <p className="text-xs font-medium text-on-surface-variant">Evaluating {candidate.name}</p>
      </div>
      <button 
        onClick={onClose}
        className="p-2 text-on-surface-variant hover:text-rose-500 transition-colors"
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
        <button className="flex items-center justify-center gap-2 py-3 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500/20 transition-all">
          <ThumbsUp className="w-4 h-4" />
          Recommend Hire
        </button>
        <button className="flex items-center justify-center gap-2 py-3 bg-rose-500/10 text-rose-600 border border-rose-500/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-500/20 transition-all">
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
            placeholder="Type raw notes here..."
            rows={3}
            value={rawNotes}
            onChange={(e) => setRawNotes(e.target.value)}
          />
        </div>

        <button 
          onClick={handleRefineAI}
          disabled={isSubmitting}
          className="w-full py-3 bg-primary/10 text-primary border border-primary/20 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/20 transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              Refining...
            </div>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Professional Refinement
            </>
          )}
        </button>

        {refinedFeedback && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-4 bg-primary/5 rounded-2xl border border-primary/10"
          >
            <p className="text-[11px] leading-relaxed text-on-surface font-medium italic">
              <span className="font-black text-primary uppercase not-italic mr-1 tracking-tighter">AI Output:</span>
              {refinedFeedback}
            </p>
          </motion.div>
        )}
      </div>

      <button className="w-full py-4 bg-primary text-on-primary rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[0.98] transition-all flex items-center justify-center gap-2">
        Submit Final Decision
        <CheckCircle2 className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const FeedbackView = () => {
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scores, setScores] = useState({ technical: 8, communication: 7, culture: 9 });
  const [rawNotes, setRawNotes] = useState('');
  const [refinedFeedback, setRefinedFeedback] = useState('');

  const handleRefineAI = () => {
    setIsSubmitting(true);
    // Simulate AI Refinement
    setTimeout(() => {
      setRefinedFeedback(`Great technical performance! Your understanding of system architecture is impressive. Communication was clear, though there is slight room for improvement in detailing complex edge cases. Overall, a strong fit for the team's culture.`);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-on-surface mb-2 tracking-tight">Interview Feedback</h1>
          <p className="text-on-surface-variant font-medium text-sm">Review performance and submit final decisions for interviewed candidates.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input 
              type="text" 
              placeholder="Search candidates..." 
              className="w-full bg-surface-container rounded-2xl py-2 pl-10 pr-4 text-sm font-medium border border-white/10 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            />
          </div>
          <button className="p-2.5 bg-surface-container rounded-2xl border border-white/10 text-on-surface-variant hover:bg-surface-container-high transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Pending Feedback */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-black text-on-surface flex items-center gap-2">
              <Clock className="w-5 h-5 text-secondary" />
              Pending Evaluation
              <span className="ml-2 px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] rounded-full uppercase font-black tracking-widest">{pendingFeedback.length}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {pendingFeedback.map((candidate, i) => (
              <React.Fragment key={candidate.id}>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`glass-card p-5 rounded-3xl border border-white/10 group cursor-pointer transition-all duration-300 ${selectedCandidate?.id === candidate.id ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-surface-container-low'}`}
                  onClick={() => setSelectedCandidate(selectedCandidate?.id === candidate.id ? null : candidate)}
                >
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <img src={candidate.img} alt={candidate.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/20" />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-lg flex items-center justify-center text-[10px] font-black text-white shadow-lg">
                        {candidate.score}%
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-black text-on-surface group-hover:text-primary transition-colors">{candidate.name}</h3>
                          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{candidate.role}</p>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-3 h-3 ${star <= Math.round((candidate as any).rating || 4.5) ? 'fill-amber-500 text-amber-500' : 'text-on-surface-variant/20'}`} 
                            />
                          ))}
                          <span className="ml-1.5 text-[10px] font-black text-amber-600">{(candidate as any).rating || 4.5}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-[10px] font-black text-on-surface-variant/60 flex items-center gap-1.5 uppercase">
                          <Clock className="w-3 h-3" />
                          Interviewed {candidate.date}
                        </span>
                      </div>
                    </div>
                    <button className={`p-3 bg-primary/10 text-primary rounded-2xl transition-all ${selectedCandidate?.id === candidate.id ? 'rotate-90 bg-primary text-white' : 'group-hover:scale-110 opacity-0 group-hover:opacity-100'}`}>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>

                {/* Mobile Inline Form */}
                <AnimatePresence>
                  {selectedCandidate?.id === candidate.id && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="lg:hidden overflow-hidden"
                    >
                      <div className="pt-2 pb-6">
                        <FeedbackForm 
                          candidate={candidate} 
                          onClose={() => setSelectedCandidate(null)}
                          scores={scores}
                          setScores={setScores}
                          rawNotes={rawNotes}
                          setRawNotes={setRawNotes}
                          handleRefineAI={handleRefineAI}
                          isSubmitting={isSubmitting}
                          refinedFeedback={refinedFeedback}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </div>

          {/* Feedback History Section */}
          <div className="pt-10">
            <h2 className="text-xl font-black text-on-surface flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-emerald-500" />
              Evaluation History
            </h2>
            <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-high/50 border-b border-outline-variant/10">
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Candidate</th>
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {feedbackHistory.map((history) => (
                    <tr key={history.id} className="hover:bg-surface-container-low transition-colors group">
                      <td className="px-6 py-5">
                        <div>
                          <p className="text-sm font-bold text-on-surface">{history.name}</p>
                          <p className="text-[10px] font-medium text-on-surface-variant">{history.role}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                          history.status === 'Hired' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                        }`}>
                          {history.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-0.5 mb-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`w-2.5 h-2.5 ${star <= Math.round((history as any).rating || 4.5) ? 'fill-amber-500 text-amber-500' : 'text-on-surface-variant/20'}`} 
                              />
                            ))}
                            <span className="ml-1 text-[10px] font-black text-on-surface">{(history as any).rating || 4.5}</span>
                          </div>
                          <span className="text-xs font-black text-on-surface">{history.score}% Match</span>
                          <span className="text-[9px] font-medium text-on-surface-variant italic">"{history.comment}"</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Feedback Form (Desktop Sidebar) */}
        <div className="hidden lg:block lg:col-span-4 sticky top-10">
          <AnimatePresence mode="wait">
            {selectedCandidate ? (
              <motion.div 
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <FeedbackForm 
                  candidate={selectedCandidate} 
                  onClose={() => setSelectedCandidate(null)}
                  scores={scores}
                  setScores={setScores}
                  rawNotes={rawNotes}
                  setRawNotes={setRawNotes}
                  handleRefineAI={handleRefineAI}
                  isSubmitting={isSubmitting}
                  refinedFeedback={refinedFeedback}
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
                  <BrainCircuit className="w-10 h-10 text-on-surface-variant/30" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-on-surface">No Selection</h3>
                  <p className="text-sm font-medium text-on-surface-variant max-w-[200px] mx-auto mt-2">Select a candidate from the left to start evaluation.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default FeedbackView;
