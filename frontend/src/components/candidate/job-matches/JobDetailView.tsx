'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Briefcase,
  MapPin,
  Clock,
  Sparkles,
  Zap,
  Layers,
  Globe,
  TrendingUp,
  BrainCircuit,
  ShieldCheck,
  ArrowLeft,
  X,
  ArrowRight,
  Award,
  CheckCircle2,
  FileText,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';
import { jobService, Job } from '@/lib/services/job.services';
import { aiService } from '@/lib/services/ai.services';
import { userService } from '@/lib/services/user.services';
import { resumeService } from '@/lib/services/resume.services';
import { Button } from '@/components/common/Button';
import { toast } from 'react-hot-toast';
import { cn } from '@/utils/cn';

interface JobDetailViewProps {
  jobId?: string;
}

const JobDetailView = ({ jobId: propJobId }: JobDetailViewProps) => {
  const router = useRouter();
  const params = useParams();
  const jobId = propJobId || (params?.id as string | undefined);

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiMatchLoading, setAiMatchLoading] = useState(false);
  const [aiMatchData, setAiMatchData] = useState<any>(null);

  // Profile & Resume States
  const [profile, setProfile] = useState<any>(null);
  const [defaultResume, setDefaultResume] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const fetchJobAndMatchData = async () => {
      if (!jobId) return;
      try {
        setLoading(true);
        // 1. Fetch Job details
        const jobRes = await jobService.getJobById(jobId);
        if (jobRes.success && jobRes.data) {
          setJob(jobRes.data);
          
          // 2. Fetch AI Match details
          setAiMatchLoading(true);
          try {
            const matchRes = await aiService.matchJob(jobId);
            if (matchRes.success) {
              setAiMatchData(matchRes.data);
            } else {
              setAiMatchData({
                error: true,
                message: matchRes.message || 'Please upload a resume or complete your profile first'
              });
            }
          } catch (matchErr: any) {
            console.error('AI Match failed:', matchErr);
            setAiMatchData({
              error: true,
              message: matchErr.response?.data?.message || 'Please upload a resume or complete your profile first'
            });
          } finally {
            setAiMatchLoading(false);
          }
        } else {
          toast.error(jobRes.message || 'Failed to load job details');
          router.push('/candidate/job-matches');
        }
      } catch (err) {
        console.error('Failed to load job details:', err);
        toast.error('Failed to load job details');
        router.push('/candidate/job-matches');
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndMatchData();
  }, [jobId, router]);

  useEffect(() => {
    const fetchProfileAndResumes = async () => {
      try {
        setProfileLoading(true);
        const userStr = localStorage.getItem('portal_user');
        if (!userStr) {
          setProfileLoading(false);
          return;
        }
        const user = JSON.parse(userStr);
        const userId = user._id || user.id;
        if (!userId) {
          setProfileLoading(false);
          return;
        }

        const [profileRes, resumesRes] = await Promise.all([
          userService.getProfile(userId),
          resumeService.getMyResumes()
        ]);
        if (profileRes.success) {
          setProfile(profileRes.data);
        }
        if (resumesRes.success) {
          const list = resumesRes.data;
          const def = list.find((r: any) => r.isDefault) || list[0] || null;
          setDefaultResume(def);
        }
      } catch (err) {
        console.error('Failed to load profile or resumes:', err);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfileAndResumes();
  }, []);

  const getCandidateSkills = () => {
    const skillsSet = new Set<string>();
    if (profile?.skills) {
      profile.skills.forEach((s: string) => skillsSet.add(s.toLowerCase()));
    }
    // Also check categorizedSkills from profile
    if (profile?.categorizedSkills) {
      profile.categorizedSkills.forEach((cat: any) => {
        if (cat.skills) {
          cat.skills.forEach((s: string) => skillsSet.add(s.toLowerCase()));
        }
      });
    }
    if (defaultResume?.skills) {
      defaultResume.skills.forEach((s: string) => skillsSet.add(s.toLowerCase()));
    }
    return Array.from(skillsSet);
  };

  const getMatchScore = (targetJob: Job): number | null => {
    const candSkills = getCandidateSkills();
    const jobReqs = targetJob.requirements || [];

    // If user has no skills at all (profile not completed, no resume), return null
    if (candSkills.length === 0) return null;
    if (jobReqs.length === 0) return 75;

    let matchesCount = 0;
    jobReqs.forEach(req => {
      const lowerReq = req.toLowerCase();
      if (candSkills.some(skill => lowerReq.includes(skill) || skill.includes(lowerReq))) {
        matchesCount++;
      }
    });

    const percent = Math.round((matchesCount / jobReqs.length) * 100);
    return Math.min(percent, 98);
  };

  const handleApply = () => {
    if (job) router.push(`/candidate/applications/${job._id}`);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest animate-pulse">Syncing Job Details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Briefcase className="w-16 h-16 text-on-surface-variant/20 animate-bounce" aria-hidden="true" />
        <h2 className="text-2xl font-black text-on-surface">Job Not Found</h2>
        <Button variant="gradient" onClick={() => router.push('/candidate/job-matches')}>
          Back to Job Matches
        </Button>
      </div>
    );
  }

  const score = getMatchScore(job);

  return (
    <main className="max-w-7xl mx-auto space-y-10 pb-16 animate-in fade-in duration-700">
      {/* Dynamic Header Actions */}
      <header className="flex items-center justify-between">
        <button
          onClick={() => router.push('/candidate/job-matches')}
          className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-all cursor-pointer"
          aria-label="Back to job matches list"
        >
          <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center border border-outline-variant/10 group-hover:border-primary/20 group-hover:bg-primary/5 transition-all">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" />
          </div>
          <span>Back to Matches</span>
        </button>
      </header>

      {/* Premium Hero Card */}
      <section className="glass-card rounded-[2.5rem] p-8 md:p-12 border border-white/10 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
        
        <div className="flex gap-6 relative z-10 max-w-3xl">
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-3xl bg-surface-container flex items-center justify-center border border-outline-variant/20 shrink-0 overflow-hidden">
            {job.companyId?.logo ? (
              <img src={job.companyId.logo} alt={job.companyId.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-3xl font-black text-primary uppercase">
                {(job as any).companyId?.name?.[0] || 'J'}
              </div>
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <span className="px-3.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                {Array.isArray(job.jobType) ? job.jobType.join(' • ') : job.jobType}
              </span>
              <span className="px-3.5 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                {job.location}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-on-surface tracking-tight leading-tight">
              {job.title}
            </h1>
            <p className="text-lg text-on-surface-variant font-bold mt-1.5">{job.companyId?.name || 'Company Name'}</p>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-stretch sm:flex-row gap-4 min-w-[200px] w-full md:w-auto">
          <Button
            variant="gradient"
            onClick={handleApply}
            className="flex-1 px-8 py-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20"
          >
            <span>Apply Now</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Button>
        </div>
      </section>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Job & Match Info */}
        <article className="lg:col-span-8 space-y-8" aria-label="Job Requirements and Description">
          
          {/* AI Match Insight Box */}
          <div className="p-8 rounded-[2rem] bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 border border-primary/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <BrainCircuit className="w-20 h-20 text-primary" aria-hidden="true" />
            </div>
            <h4 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                <Sparkles className="w-4 h-4 text-primary" aria-hidden="true" />
              </div>
              AI Match Insight
            </h4>

            {aiMatchLoading ? (
              <div className="flex items-center gap-4 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-primary/10 animate-ping" />
                <div className="h-4 w-48 bg-surface-container-high rounded" />
              </div>
            ) : aiMatchData?.error ? (
              <div className="space-y-4">
                {score !== null ? (
                  <>
                    <div className="flex items-end gap-3">
                      <span className="text-5xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{score}%</span>
                      <span className="text-xs font-black text-on-surface-variant/60 mb-2 uppercase tracking-widest">Compatibility</span>
                    </div>
                    <p className="text-base text-on-surface-variant leading-relaxed font-medium">
                      Based on your profile, you have a {score}% compatibility match for this position. To generate a fully customized AI analysis, upload your resume PDF.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl">Complete Your Profile</div>
                    </div>
                    <p className="text-base text-on-surface-variant leading-relaxed font-medium">
                      Add your skills or upload your resume to see how well you match this position.
                    </p>
                  </>
                )}
                <div className="pt-2">
                  <Button
                    onClick={() => router.push('/candidate/resume-analysis')}
                    className="bg-gradient-to-r from-primary to-secondary text-white text-xs font-black shadow-lg"
                  >
                    Upload Resume PDF
                  </Button>
                </div>
              </div>
            ) : aiMatchData ? (
              <div className="space-y-4">
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{aiMatchData.score}%</span>
                  <span className="text-xs font-black text-on-surface-variant/60 mb-2 uppercase tracking-widest">Compatibility</span>
                </div>
                <p className="text-base text-on-surface-variant leading-relaxed font-medium">
                  {aiMatchData.reasoning || "Your profile and experience align significantly with this role's requirements."}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {aiMatchData.missingSkills?.map((s: string) => (
                    <span key={s} className="px-3 py-1 rounded-lg bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest border border-red-500/20">Missing: {s}</span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-on-surface-variant font-medium">Analysis is being processed for this role.</p>
            )}
          </div>

          {/* Description */}
          <section className="glass-card rounded-[2rem] p-8 md:p-10 border border-white/10 space-y-6">
            <h2 className="text-xl font-black text-on-surface flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
                <Layers className="text-secondary w-5 h-5" aria-hidden="true" />
              </div>
              Description
            </h2>
            <div className="h-px bg-outline-variant/10" />
            <p className="text-base text-on-surface-variant leading-[1.8] whitespace-pre-wrap font-medium">
              {job.description}
            </p>
          </section>

          {/* Requirements */}
          <section className="glass-card rounded-[2rem] p-8 md:p-10 border border-white/10 space-y-6">
            <h2 className="text-xl font-black text-on-surface flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <ShieldCheck className="text-emerald-500 w-5 h-5" aria-hidden="true" />
              </div>
              Requirements
            </h2>
            <div className="h-px bg-outline-variant/10" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {job.requirements.map((req, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/10 hover:border-emerald-500/20 transition-all">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-sm font-bold text-on-surface-variant leading-normal">{req}</span>
                </div>
              ))}
            </div>
          </section>
        </article>

        {/* Right Column: Actions & Sidebar Widgets */}
        <aside className="lg:col-span-4 space-y-6" aria-label="Salary, Stats, and Resume Highlights">
          {/* Salary Card */}
          <div className="glass-card rounded-3xl p-8 border border-white/10 bg-gradient-to-b from-surface-container-low to-surface-container-lowest space-y-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                <DollarSign className="w-6 h-6 text-emerald-500" aria-hidden="true" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60 mb-0.5">Estimated Salary</div>
                <div className="text-2xl font-black text-on-surface leading-tight">{job.salary}</div>
              </div>
            </div>
            <div className="h-px bg-outline-variant/10" />
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20 shrink-0">
                <Globe className="w-6 h-6 text-sky-500" aria-hidden="true" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60 mb-0.5">Location</div>
                <div className="text-sm font-black text-on-surface">{job.location}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shrink-0">
                <TrendingUp className="w-6 h-6 text-amber-500" aria-hidden="true" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60 mb-0.5">Experience</div>
                <div className="text-sm font-black text-on-surface">{job.experience} Years Required</div>
              </div>
            </div>
          </div>

          {/* Matching Stats */}
          <section className="glass-card rounded-[32px] p-8 border-primary/10">
            <h4 className="text-lg font-black text-on-surface mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 shrink-0">
                <Zap className="text-yellow-500 w-4 h-4" aria-hidden="true" />
              </div>
              Matching Stats
            </h4>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex justify-between items-center">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-0.5">Average Match</div>
                  <div className="text-2xl font-black text-primary">87.5%</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                  87%
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex justify-between items-center">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-0.5">Market Demand</div>
                  <div className="text-2xl font-black text-secondary">High</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                  <TrendingUp className="w-5 h-5" aria-hidden="true" />
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-outline-variant/20">
              <p className="text-[10px] text-on-surface-variant leading-relaxed">
                Matches are refreshed every 24 hours based on your latest skill updates.
              </p>
            </div>
          </section>

          {/* Resume & ATS Status */}
          <section className="glass-card rounded-[32px] p-8 border border-primary/10">
            <h4 className="text-lg font-black text-on-surface mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shrink-0">
                <BrainCircuit className="text-purple-500 w-4 h-4 animate-pulse" aria-hidden="true" />
              </div>
              Resume & ATS Status
            </h4>
            {profileLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-6 w-3/4 bg-surface-container rounded" />
                <div className="h-12 bg-surface-container rounded-2xl" />
                <div className="h-12 bg-surface-container rounded-2xl" />
              </div>
            ) : defaultResume ? (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shrink-0">
                    <FileText className="w-5 h-5 text-purple-500" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-0.5">Active Resume</div>
                    <div className="text-sm font-bold text-on-surface truncate">{defaultResume.fileName}</div>
                  </div>
                  <span className="px-2.5 py-1 text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    Active
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">ATS Compatibility Score</div>
                    <div className="text-lg font-black text-primary">{defaultResume.score || 85}%</div>
                  </div>
                  <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                      style={{ width: `${defaultResume.score || 85}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-3">
                  <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">ATS Highlights</div>
                  <div className="flex flex-wrap gap-1.5">
                    {defaultResume.skills && defaultResume.skills.length > 0 ? (
                      defaultResume.skills.slice(0, 5).map((skill: string) => (
                        <span key={skill} className="px-2 py-0.5 rounded-lg bg-primary/5 text-primary text-[10px] font-bold border border-primary/10">{skill}</span>
                      ))
                    ) : (
                      <span className="text-xs text-on-surface-variant italic">No skills extracted yet</span>
                    )}
                  </div>
                </div>
              </div>
            ) : profile?.resume ? (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Resume File</div>
                    <div className="text-sm font-bold text-on-surface">PDF Uploaded</div>
                  </div>
                  <span className="px-2.5 py-1 text-[9px] font-black uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full">
                    Pending Analysis
                  </span>
                </div>
                <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white" onClick={() => router.push('/candidate/resume-analysis')}>
                  Analyze Resume Now
                </Button>
              </div>
            ) : (
              <div className="space-y-6 text-center py-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-2">
                  <Sparkles className="w-8 h-8 text-amber-500 animate-pulse" aria-hidden="true" />
                </div>
                <div>
                  <h5 className="text-sm font-black text-on-surface uppercase tracking-wider mb-1">Profile Fallback Mode</h5>
                  <p className="text-xs text-on-surface-variant max-w-[240px] mx-auto leading-relaxed">
                    No resume PDF uploaded. We are matching jobs using your dynamic profile skills & experiences.
                  </p>
                </div>
                <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white" onClick={() => router.push('/candidate/resume-analysis')}>
                  Upload Resume PDF
                </Button>
              </div>
            )}
          </section>
        </aside>
      </div>
    </main>
  );
};

export default JobDetailView;
