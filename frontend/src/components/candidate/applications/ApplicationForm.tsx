'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  CheckCircle2, 
  AlertTriangle,
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  ArrowLeft,
  FileText,
  ExternalLink,
  Briefcase,
  Sparkles,
  BrainCircuit,
  GraduationCap,
  Loader2
} from 'lucide-react';
import { jobService, Job } from '@/lib/services/job.services';
import { applicationService } from '@/lib/services/application.services';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/common/Button';
import ProfileWizardModal from '@/components/candidate/dashboard/ProfileWizardModal';

const ApplicationForm = () => {
  const { id: jobId } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const res = await jobService.getJobById(jobId as string);
      if (res.success) {
        setJob(res.data);
      }
    } catch (error) {
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  // Profile completeness checker logic
  const checkProfileCompleteness = (u: any) => {
    const missing = [];
    if (!u?.fullname) missing.push('Full Name');
    if (!u?.phoneNumber) missing.push('Phone Number');
    if (!u?.skills || u.skills.length === 0) missing.push('Skills Badges');
    if (u?.experience !== 0 && !u?.isFresher) {
      if (!u?.workExperience || u.workExperience.length === 0 || !u.workExperience[0]?.company) {
        missing.push('Work Experience');
      }
    }
    if (!u?.education || u.education.length === 0 || !u.education[0]?.university) {
      missing.push('Education Info');
    }
    if (!u?.resume) missing.push('Resume File (PDF)');
    
    return {
      isComplete: missing.length === 0,
      missingFields: missing
    };
  };

  const { isComplete, missingFields } = checkProfileCompleteness(user);

  const handleApply = async () => {
    if (!isComplete) {
      toast.error('Please complete your profile details and upload a resume before applying!');
      setIsWizardOpen(true);
      return;
    }
    
    try {
      setSubmitting(true);
      const applyToast = toast.loading('Submitting application...');
      const res = await applicationService.applyJob(jobId as string);
      if (res.success) {
        toast.success('Application submitted successfully!', { id: applyToast });
        router.push('/candidate/applications');
      } else {
        toast.error('Failed to submit application', { id: applyToast });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-on-surface-variant font-bold uppercase tracking-widest text-xs">Preparing Application Portal...</p>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Base Gradient Background */}
      <div 
        className="fixed inset-0 pointer-events-none -z-20 opacity-50"
        style={{
          backgroundImage: `radial-gradient(circle at 15% 50%, rgba(70, 72, 212, 0.05), transparent 40%),
                            radial-gradient(circle at 85% 30%, rgba(129, 39, 207, 0.05), transparent 40%)`
        }}
      ></div>

      {/* Back Button */}
      <button 
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors group cursor-pointer outline-none border-none bg-transparent"
        aria-label="Go back to previous page"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
        Back to previous page
      </button>

      {/* Application Header */}
      <header className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-2 border border-primary/20">
          Application Portal
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-on-surface tracking-tight">
          Apply for {job?.title || 'Job Role'}
        </h1>
        <p className="text-lg text-on-surface-variant font-bold flex items-center justify-center gap-2">
          <Building2 className="w-5 h-5 text-primary animate-pulse" aria-hidden="true" />
          {job?.companyId?.name || 'Company'} 
          <span className="w-1 h-1 rounded-full bg-outline-variant" aria-hidden="true"></span>
          <MapPin className="w-5 h-5 text-secondary" aria-hidden="true" />
          {job?.location || 'Remote'}
        </p>
      </header>

      {/* Dynamic Main Flow Panel */}
      <section role="region" aria-label="Application credentials form" className="bg-surface-container-lowest/90 backdrop-blur-3xl border border-outline-variant/30 shadow-2xl rounded-[40px] p-8 md:p-12 relative overflow-hidden">
        
        {isComplete ? (
          /* CASE A: Profile Completed Screen */
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-[2.5rem]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-on-surface">Profile Completed! ✅</h3>
                  <p className="text-xs font-bold text-on-surface-variant">Your profile details and professional resume are 100% ready.</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-2xl border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-500 shrink-0 font-bold"
                onClick={() => setIsWizardOpen(true)}
              >
                Update Profile / Resume
              </Button>
            </div>

            {/* Profile Preview Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="space-y-6">
                <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <User className="w-4 h-4" aria-hidden="true" /> Personal Information
                </h4>
                <div className="space-y-3 p-6 rounded-3xl bg-surface-container-low border border-outline-variant/10">
                  <p className="text-sm text-on-surface font-black">{user?.fullname}</p>
                  <p className="text-xs text-on-surface-variant flex items-center gap-2"><Mail className="w-3.5 h-3.5" aria-hidden="true" /> {user?.email}</p>
                  {user?.phoneNumber && <p className="text-xs text-on-surface-variant flex items-center gap-2"><Phone className="w-3.5 h-3.5" aria-hidden="true" /> {user.phoneNumber}</p>}
                  {user?.location && <p className="text-xs text-on-surface-variant flex items-center gap-2"><MapPin className="w-3.5 h-3.5" aria-hidden="true" /> {user.location}</p>}
                </div>

                <h4 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <Briefcase className="w-4 h-4" aria-hidden="true" /> Latest Experience
                </h4>
                <div className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/10 space-y-2">
                  {user?.experience === 0 || user?.isFresher ? (
                    <div className="flex items-center gap-2 p-2 bg-primary/5 rounded-2xl border border-primary/10">
                      <Sparkles className="w-4 h-4 text-primary animate-pulse" aria-hidden="true" />
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest">Fresher (Ready to start career)</p>
                    </div>
                  ) : user?.workExperience?.[0] ? (
                    <>
                      <p className="text-sm text-on-surface font-black">{user.workExperience[0].role}</p>
                      <p className="text-xs text-on-surface-variant">{user.workExperience[0].company} • {user.workExperience[0].duration}</p>
                    </>
                  ) : (
                    <p className="text-xs text-on-surface-variant">No experience listed.</p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-xs font-black uppercase tracking-widest text-secondary flex items-center gap-2">
                  <Sparkles className="w-4 h-4" aria-hidden="true" /> Professional Credentials
                </h4>
                
                {/* Resume Card Preview */}
                <div className="p-6 rounded-3xl bg-surface-container-low border border-outline-variant/10 flex items-center justify-between gap-4 group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                      <FileText className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-on-surface">Attached Resume PDF</p>
                      <p className="text-[10px] text-on-surface-variant">Cloud Storage Sync Active</p>
                    </div>
                  </div>
                  <a 
                    href={user?.resume} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="p-2 rounded-xl bg-surface-container-lowest hover:bg-primary hover:text-white transition-all text-on-surface flex items-center justify-center border border-outline-variant/20 shadow-md group-hover:scale-105"
                    aria-label="View uploaded resume PDF"
                  >
                    <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  </a>
                </div>

                <h4 className="text-xs font-black uppercase tracking-widest text-secondary flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4" aria-hidden="true" /> Core Skill Badges
                </h4>
                <div className="flex flex-wrap gap-2 p-6 rounded-3xl bg-surface-container-low border border-outline-variant/10">
                  {user?.skills?.map((skill: string) => (
                    <span 
                      key={skill} 
                      className="px-3 py-1 rounded-xl bg-surface-container-lowest text-on-surface text-[10px] font-black uppercase tracking-widest border border-outline-variant/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-8 border-t border-outline-variant/20 flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                Review your credentials before hitting submit
              </span>
              <Button 
                variant="gradient" 
                size="lg" 
                className="w-full sm:w-auto px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20"
                onClick={handleApply}
                disabled={submitting}
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" aria-hidden="true" /> : '🚀 Apply to this Job'}
              </Button>
            </div>
          </div>
        ) : (
          /* CASE B: Profile Incomplete Screen */
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-6">
            <div className="w-20 h-20 rounded-[2rem] bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-2 border border-amber-500/20 animate-pulse">
              <AlertTriangle className="w-9 h-9" aria-hidden="true" />
            </div>
            
            <div className="space-y-3 max-w-xl mx-auto">
              <h2 className="text-3xl font-black text-on-surface tracking-tight">Profile Incomplete! ⚠️</h2>
              <p className="text-base text-on-surface-variant leading-relaxed font-bold">
                To maintain our quality standards and secure interviews with top companies, candidates are required to complete their profile and upload an active Resume PDF.
              </p>
            </div>

            {/* List of Missing Fields */}
            <div className="max-w-md mx-auto p-6 rounded-[2.5rem] bg-surface-container-low border border-outline-variant/20 text-left space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 block mb-2">Required items missing:</span>
              <div className="grid grid-cols-2 gap-3">
                {missingFields.map((field) => (
                  <div key={field} className="flex items-center gap-2 p-3 bg-white dark:bg-black/10 border border-outline-variant/10 rounded-2xl">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-xs font-bold text-on-surface">{field}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-8 border-t border-outline-variant/20 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button 
                variant="gradient" 
                size="lg" 
                className="w-full sm:w-auto px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20"
                onClick={() => setIsWizardOpen(true)}
              >
                🛠️ Complete Profile & Apply
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Render the Wizard Modal pre-filled */}
      <ProfileWizardModal 
        isOpen={isWizardOpen} 
        onClose={() => setIsWizardOpen(false)} 
        jobId={jobId as string}
      />
    </main>
  );
};

export default ApplicationForm;
