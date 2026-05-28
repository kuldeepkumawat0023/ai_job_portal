'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Mail, 
  MapPin, 
  GraduationCap, 
  Code2, 
  Award, 
  BrainCircuit, 
  Save, 
  Sparkles,
  Briefcase,
  Building2,
  FileText,
  ExternalLink,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { applicationService, Application } from '@/lib/services/application.services';
import { aiService } from '@/lib/services/ai.services';
import { toast } from 'react-hot-toast';

interface CandidateDetailsViewProps {
  id: string;
}

/**
 * 🎓 CandidateDetailsView - Dynamic, premium recruiter page to evaluate applicants
 */
const CandidateDetailsView: React.FC<CandidateDetailsViewProps> = ({ id }) => {
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Score & Evaluation States
  const [technicalScore, setTechnicalScore] = useState<number>(0);
  const [communicationScore, setCommunicationScore] = useState<number>(0);
  const [cultureScore, setCultureScore] = useState<number>(0);
  const [recruiterNotes, setRecruiterNotes] = useState<string>('');
  const [recruiterRefinedNotes, setRecruiterRefinedNotes] = useState<string>('');
  const [isSavingEvaluation, setIsSavingEvaluation] = useState<boolean>(false);
  const [isRefiningNotes, setIsRefiningNotes] = useState<boolean>(false);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setIsLoading(true);
        const res = await applicationService.getRecruiterApplications();
        if (res.success && res.data) {
          const found = res.data.find((app: Application) => app._id === id);
          if (found) {
            setApplication(found);
            setTechnicalScore(found.technicalScore ?? 0);
            setCommunicationScore(found.communicationScore ?? 0);
            setCultureScore(found.cultureScore ?? 0);
            setRecruiterNotes(found.recruiterNotes ?? '');
            setRecruiterRefinedNotes(found.recruiterRefinedNotes ?? '');
          } else {
            setError('Application not found.');
          }
        } else {
          setError(res.message || 'Failed to fetch application details.');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while loading application details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [id]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!application) return;
    try {
      const res = await applicationService.updateStatus(application._id, newStatus);
      if (res.success && res.data) {
        setApplication(prev => prev ? { ...prev, status: res.data.status } : null);
        toast.success(`Application status updated to ${newStatus}`);
      } else {
        toast.error(res.message || 'Failed to update status.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error updating status.');
    }
  };

  const handleSaveEvaluation = async () => {
    if (!application) return;
    try {
      setIsSavingEvaluation(true);
      const res = await applicationService.updateStatus(application._id, application.status, {
        technicalScore,
        communicationScore,
        cultureScore,
        recruiterNotes,
        recruiterRefinedNotes
      });
      if (res.success) {
        toast.success('Candidate evaluation saved successfully!');
        setApplication(prev => prev ? { 
          ...prev, 
          technicalScore, 
          communicationScore, 
          cultureScore, 
          recruiterNotes, 
          recruiterRefinedNotes 
        } : null);
      } else {
        toast.error(res.message || 'Failed to save evaluation.');
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred while saving evaluation.');
    } finally {
      setIsSavingEvaluation(false);
    }
  };

  const handleRefineFeedback = async () => {
    if (!recruiterNotes.trim()) {
      toast.error('Please enter some raw feedback notes first.');
      return;
    }
    try {
      setIsRefiningNotes(true);
      const res = await aiService.refineFeedback(recruiterNotes, {
        technical: technicalScore,
        communication: communicationScore,
        culture: cultureScore
      });
      if (res.success && res.data) {
        setRecruiterNotes(res.data);
        setRecruiterRefinedNotes(res.data);
        toast.success('AI successfully refined evaluation notes!');
      } else {
        toast.error(res.message || 'Failed to refine notes.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error refining notes using AI.');
    } finally {
      setIsRefiningNotes(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Loading Candidate Profile...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center p-6">
        <div className="text-center space-y-4 glass-card p-8 rounded-3xl border border-white/5 max-w-md">
          <p className="text-sm font-bold text-red-500 uppercase tracking-widest">Error Loading Profile</p>
          <p className="text-xs text-on-surface-variant font-medium">{error || 'Candidate profile not found.'}</p>
          <button 
            onClick={() => router.push('/recruiter/applications')}
            className="px-5 py-2.5 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-primary-high transition-all"
          >
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  const applicant = typeof application.applicantId === 'object' ? (application.applicantId as any) : null;
  const job = typeof application.jobId === 'object' ? (application.jobId as any) : null;
  const score = application.aiScore ?? 0;
  const formattedDate = new Date(application.createdAt).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });

  return (
    <main className="min-h-screen bg-surface-container-lowest text-on-surface pb-16">
      {/* Dynamic Header / Navigation Panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/10 pb-6 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/recruiter/applications')}
              className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary hover:text-white transition-all flex items-center justify-center border-none outline-none cursor-pointer text-on-surface-variant shrink-0"
              title="Back to Applications"
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-on-surface">Candidate Evaluation</h1>
              <p className="text-xs text-on-surface-variant font-bold mt-1">Review {applicant?.fullname}'s profile, score alignment, and refine notes with AI.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn(
              "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border",
              ['applied', 'pending'].includes(application.status) ? "bg-secondary/5 text-secondary border-secondary/10" :
              application.status === 'interview' ? "bg-primary/5 text-primary border-primary/10" :
              application.status === 'shortlisted' ? "bg-amber-500/5 text-amber-600 border-amber-500/10" :
              application.status === 'hired' ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/10" :
              "bg-red-500/5 text-red-600 border-red-500/10"
            )}>
              Current: {application.status}
            </span>
          </div>
        </header>

        {/* Detailed Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Candidate Profile details */}
          <article className="space-y-6" aria-label="Candidate Profile Details">
            {/* Candidate Card Summary */}
            <div className="glass-card border border-outline-variant/10 rounded-3xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <img 
                src={applicant?.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150'} 
                alt={applicant?.fullname} 
                className="w-20 h-20 rounded-2xl object-cover border border-outline-variant/20"
              />
              <div className="text-center sm:text-left space-y-1.5 flex-1">
                <h3 className="text-xl font-black text-on-surface">{applicant?.fullname || 'Anonymous Candidate'}</h3>
                <p className="text-xs font-bold text-primary flex items-center justify-center sm:justify-start gap-1">
                  <Mail size={12} aria-hidden="true" /> {applicant?.email}
                </p>
                {applicant?.location && (
                  <p className="text-xs text-on-surface-variant font-semibold flex items-center justify-center sm:justify-start gap-1">
                    <MapPin size={12} aria-hidden="true" /> {applicant.location}
                  </p>
                )}
                {applicant?.experience !== undefined && (
                  <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest bg-surface-container px-2 py-0.5 rounded-lg inline-block">
                    {applicant.experience} Years Experience
                  </p>
                )}
              </div>
            </div>

            {/* Bio */}
            {applicant?.bio && (
              <div className="space-y-2">
                <h4 className="text-xs font-black text-on-surface uppercase tracking-widest">Bio</h4>
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed glass-card p-4 border border-outline-variant/10">
                  {applicant.bio}
                </p>
              </div>
            )}

            {/* Skills */}
            {applicant?.skills && applicant.skills.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black text-on-surface uppercase tracking-widest">Verified Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {applicant.skills.map((skill: string) => (
                    <span key={skill} className="px-3 py-1.5 rounded-xl bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/10">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Work Experience */}
            {applicant?.workExperience && applicant.workExperience.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-black text-on-surface uppercase tracking-widest">Work History</h4>
                <div className="space-y-3">
                  {applicant.workExperience.map((exp: any, idx: number) => (
                    <div key={idx} className="glass-card border border-outline-variant/10 rounded-2xl p-4 space-y-1.5">
                      <div className="flex justify-between items-start">
                        <h5 className="text-sm font-black text-on-surface">{exp.role}</h5>
                        <span className="text-[9px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md uppercase tracking-wider">{exp.duration}</span>
                      </div>
                      <p className="text-[10px] font-bold text-on-surface-variant">{exp.company}</p>
                      {exp.description && (
                        <p className="text-[10px] text-on-surface-variant/80 font-medium leading-relaxed mt-1">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {applicant?.education && applicant.education.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-black text-on-surface uppercase tracking-widest flex items-center gap-1.5">
                  <GraduationCap size={14} className="text-primary" aria-hidden="true" />
                  Education
                </h4>
                <div className="space-y-3">
                  {applicant.education.map((edu: any, idx: number) => (
                    <div key={idx} className="glass-card border border-outline-variant/10 rounded-2xl p-4 space-y-1">
                      <div className="flex justify-between items-start">
                        <h5 className="text-sm font-black text-on-surface">{edu.degree}</h5>
                        <span className="text-[9px] font-black text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-md">{edu.year}</span>
                      </div>
                      <p className="text-[10px] font-bold text-on-surface-variant">{edu.university}</p>
                      {edu.cgpa && (
                        <p className="text-[9px] font-black text-secondary mt-1 uppercase tracking-wider">GPA/CGPA: {edu.cgpa}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {applicant?.projects && applicant.projects.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-black text-on-surface uppercase tracking-widest flex items-center gap-1.5">
                  <Code2 size={14} className="text-primary" aria-hidden="true" />
                  Projects
                </h4>
                <div className="space-y-3">
                  {applicant.projects.map((proj: any, idx: number) => (
                    <div key={idx} className="glass-card border border-outline-variant/10 rounded-2xl p-4 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <h5 className="text-sm font-black text-on-surface">{proj.title}</h5>
                        {proj.link && (
                          <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-high transition-colors">
                            <ExternalLink size={14} aria-hidden="true" />
                          </a>
                        )}
                      </div>
                      <p className="text-[10px] text-on-surface-variant/80 font-medium leading-relaxed">{proj.description}</p>
                      {proj.stack && proj.stack.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {proj.stack.map((s: string) => (
                            <span key={s} className="px-1.5 py-0.5 rounded bg-surface-container text-[8px] font-black text-on-surface-variant uppercase tracking-wider">{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resume Preview */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-on-surface uppercase tracking-widest flex items-center gap-1.5">
                <FileText size={14} className="text-primary" aria-hidden="true" />
                Resume / CV Review
              </h4>
              {applicant?.resume ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <a 
                      href={`https://docs.google.com/gview?url=${encodeURIComponent(applicant.resume)}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-2 px-5 py-3 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-primary-high transition-all shadow-md shadow-primary/10 cursor-pointer"
                    >
                      <ExternalLink size={14} aria-hidden="true" />
                      Open PDF in New Tab
                    </a>
                  </div>
                  <div className="border border-outline-variant/20 rounded-2xl overflow-hidden h-[500px] bg-white relative">
                    <iframe 
                      src={`https://docs.google.com/gview?url=${encodeURIComponent(applicant.resume)}&embedded=true`}
                      className="w-full h-full border-none"
                      title="Resume PDF Preview"
                      aria-label="Resume Document Preview"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-8 border-2 border-dashed border-outline-variant/20 rounded-2xl text-center text-[11px] font-bold text-on-surface-variant/60 bg-surface-container/10">
                  No resume PDF uploaded by this applicant.
                </div>
              )}
            </div>
          </article>

          {/* Right Column: Recruiter Feedback Form */}
          <article className="space-y-6 lg:border-l lg:border-outline-variant/10 lg:pl-8" aria-label="Candidate Evaluation Form">
            {/* Job Application Match Overview */}
            <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-black text-primary uppercase tracking-widest">Job Applied</span>
                  <h4 className="text-lg font-black text-on-surface mt-1">{job?.title || 'Job Position'}</h4>
                  <p className="text-xs font-semibold text-on-surface-variant">{job?.category || 'Category'}</p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-black text-secondary uppercase tracking-widest block">AI Match Score</span>
                  <div className="flex items-center gap-1 mt-1 justify-end text-secondary font-black text-xl">
                    <Sparkles size={16} fill="currentColor" aria-hidden="true" />
                    {score}%
                  </div>
                </div>
              </div>
            </div>

            {/* Status Update Option */}
            <div className="space-y-2">
              <label htmlFor="pipeline-status-select" className="text-xs font-black text-on-surface uppercase tracking-widest block">Application Pipeline Status</label>
              <select 
                id="pipeline-status-select"
                value={application.status}
                onChange={(e) => handleStatusUpdate(e.target.value)}
                className="w-full bg-surface-container border border-outline-variant/20 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
              >
                <option value="applied">Screening</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interview">Interview Stage</option>
                <option value="hired">Hired / Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Recruiter Evaluation Scores sliders */}
            <div className="bg-surface-container/20 border border-outline-variant/10 rounded-3xl p-6 space-y-5">
              <h4 className="text-xs font-black text-on-surface uppercase tracking-widest flex items-center gap-1.5">
                <Award size={14} className="text-primary" aria-hidden="true" />
                Recruiter Scores (0 - 10)
              </h4>

              <div className="space-y-2">
                <label htmlFor="technical-score-input" className="flex justify-between text-[10px] font-black uppercase tracking-widest cursor-pointer">
                  <span className="text-on-surface-variant">Technical Alignment</span>
                  <span className="text-primary">{technicalScore} / 10</span>
                </label>
                <input 
                  id="technical-score-input"
                  type="range" 
                  min="0" 
                  max="10" 
                  value={technicalScore} 
                  onChange={(e) => setTechnicalScore(parseInt(e.target.value))}
                  className="w-full accent-primary bg-surface-container cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="communication-score-input" className="flex justify-between text-[10px] font-black uppercase tracking-widest cursor-pointer">
                  <span className="text-on-surface-variant">Communication Skills</span>
                  <span className="text-primary">{communicationScore} / 10</span>
                </label>
                <input 
                  id="communication-score-input"
                  type="range" 
                  min="0" 
                  max="10" 
                  value={communicationScore} 
                  onChange={(e) => setCommunicationScore(parseInt(e.target.value))}
                  className="w-full accent-primary bg-surface-container cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="culture-score-input" className="flex justify-between text-[10px] font-black uppercase tracking-widest cursor-pointer">
                  <span className="text-on-surface-variant">Culture Fit</span>
                  <span className="text-primary">{cultureScore} / 10</span>
                </label>
                <input 
                  id="culture-score-input"
                  type="range" 
                  min="0" 
                  max="10" 
                  value={cultureScore} 
                  onChange={(e) => setCultureScore(parseInt(e.target.value))}
                  className="w-full accent-primary bg-surface-container cursor-pointer"
                />
              </div>
            </div>

            {/* Evaluation Notes Area */}
            <div className="space-y-3">
              <label htmlFor="recruiter-notes-textarea" className="text-xs font-black text-on-surface uppercase tracking-widest block">Recruiter Evaluation Notes</label>
              <textarea 
                id="recruiter-notes-textarea"
                value={recruiterNotes}
                onChange={(e) => setRecruiterNotes(e.target.value)}
                placeholder="Enter raw feedback notes about the candidate's skills, interview performance, strengths, or flags..."
                className="w-full bg-surface-container border border-outline-variant/10 focus:ring-2 focus:ring-primary/20 transition-all rounded-2xl p-4 text-xs font-medium focus:outline-none min-h-[120px]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
              <button
                type="button"
                onClick={handleRefineFeedback}
                disabled={isRefiningNotes}
                className="w-full sm:w-auto flex items-center justify-center gap-2 py-4 px-6 bg-amber-500/5 hover:bg-amber-500/10 active:bg-amber-500/20 text-amber-500 transition-all text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-md disabled:opacity-50 cursor-pointer border border-amber-500/30 shrink-0"
              >
                <BrainCircuit size={16} className={cn(isRefiningNotes && "animate-spin")} aria-hidden="true" />
                {isRefiningNotes ? "Refining..." : "Refine with AI"}
              </button>

              <button
                type="button"
                onClick={handleSaveEvaluation}
                disabled={isSavingEvaluation}
                className="flex-1 w-full flex items-center justify-center gap-2 py-4 bg-primary text-white hover:bg-primary-high transition-all text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg shadow-primary/20 disabled:opacity-50 cursor-pointer"
              >
                <Save size={16} aria-hidden="true" />
                {isSavingEvaluation ? "Saving Evaluation..." : "Save Evaluation"}
              </button>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
};

export default CandidateDetailsView;
