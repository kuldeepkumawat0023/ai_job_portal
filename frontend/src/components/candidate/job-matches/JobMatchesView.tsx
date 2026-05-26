'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  DollarSign,
  MapPin,
  Layers,
  ChevronDown,
  SlidersHorizontal,
  Sparkles,
  Clock,
  TrendingUp,
  BrainCircuit,
  Bookmark,
  Trash2,
  Code,
  Palette,
  Rocket,
  X,
  Briefcase,
  Globe,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { jobService, Job } from '@/lib/services/job.services';
import { aiService } from '@/lib/services/ai.services';
import { applicationService } from '@/lib/services/application.services';
import { userService } from '@/lib/services/user.services';
import { resumeService } from '@/lib/services/resume.services';
import { Button } from '@/components/common/Button';
import { Pagination } from '@/components/common/Pagination';
import { toast } from 'react-hot-toast';
import { cn } from '@/utils/cn';

const JobMatchesView = () => {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [aiMatchLoading, setAiMatchLoading] = useState(false);
  const [aiMatchData, setAiMatchData] = useState<any>(null);
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const JOBS_PER_PAGE = Number(process.env.NEXT_PUBLIC_JOBS_PER_PAGE) || 10;

  // Profile & Resume States
  const [profile, setProfile] = useState<any>(null);
  const [defaultResume, setDefaultResume] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs();
    }, 500); // Debounce search
    return () => clearTimeout(timer);
  }, [searchQuery, selectedLocation]);

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
    if (defaultResume?.skills) {
      defaultResume.skills.forEach((s: string) => skillsSet.add(s.toLowerCase()));
    }
    return Array.from(skillsSet);
  };

  const getMatchScore = (job: Job) => {
    const candSkills = getCandidateSkills();
    const jobReqs = job.requirements || [];

    if (jobReqs.length === 0) return 75;
    if (candSkills.length === 0) return 65;

    let matchesCount = 0;
    jobReqs.forEach(req => {
      const lowerReq = req.toLowerCase();
      if (candSkills.some(skill => lowerReq.includes(skill) || skill.includes(lowerReq))) {
        matchesCount++;
      }
    });

    const percent = Math.round((matchesCount / jobReqs.length) * 100);
    return Math.min(Math.max(percent, 60), 98);
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchQuery) params.keyword = searchQuery;
      if (selectedLocation !== 'All') params.location = selectedLocation;

      const res = await jobService.getAllJobs(params); // Using getAllJobs for general search/filter
      if (res.success) {
        setJobs(res.data);
        setCurrentPage(1);
      }
    } catch (error) {
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (job: Job) => {
    router.push(`/candidate/job-matches/${job._id}`);
  };

  const handleApply = (jobId: string) => {
    router.push(`/candidate/applications/${jobId}`);
  };

  const indexOfLastJob = currentPage * JOBS_PER_PAGE;
  const indexOfFirstJob = indexOfLastJob - JOBS_PER_PAGE;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / JOBS_PER_PAGE);

  return (
    <main className="max-w-7xl mx-auto space-y-8 relative">
      {/* SEO Friendly Hidden Content */}
      <h1 className="sr-only">AIJobFit Job Matches</h1>
      <p className="sr-only">
        Discover highly tailored job matches generated by our AI engine based on your resume, skills, and preferences. Filter, search, and apply to roles with top employers instantly.
      </p>

      {/* Header */}
      <section role="region" aria-label="Job Matches Header" className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
        <div>
          <h2 className="text-4xl font-black text-on-surface mb-2 tracking-tight">AI Job Matches</h2>
          <p className="text-lg text-on-surface-variant font-medium">Curated opportunities based on your skills and preferences.</p>
        </div>
        <div className="hidden md:flex gap-2">
          <div className="px-4 py-2 rounded-2xl bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-3.5 h-3.5" />
            Live Matching
          </div>
        </div>
      </section>

      {/* Filters & Search */}
      <div role="search" aria-label="Job Search Filters" className="glass-card rounded-[32px] p-3 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[280px] relative">
          <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-primary" aria-hidden="true" />
          <input
            className="w-full pl-14 pr-4 py-4 bg-transparent border-none focus:ring-0 text-base font-medium placeholder-on-surface-variant/40 outline-none"
            placeholder="Job title, keywords, or company"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search job titles, keywords or companies"
          />
        </div>
        <div className="h-10 w-px bg-outline-variant/30 hidden lg:block" aria-hidden="true"></div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedLocation(selectedLocation === 'Remote' ? 'All' : 'Remote')}
            className={cn(
              "px-5 py-3 rounded-2xl border flex items-center gap-3 transition-all",
              selectedLocation === 'Remote'
                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                : "border-outline-variant/30 hover:bg-surface-container-low text-on-surface-variant"
            )}
            aria-pressed={selectedLocation === 'Remote'}
            aria-label="Filter by Remote jobs"
          >
            <MapPin className={cn("w-4 h-4", selectedLocation === 'Remote' ? "text-white" : "text-on-surface-variant")} aria-hidden="true" />
            <span className="text-sm font-bold">{selectedLocation === 'Remote' ? 'Remote Only' : 'Remote'}</span>
            <ChevronDown className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-8 space-y-6">
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 w-full bg-surface-container animate-pulse rounded-[40px]" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="glass-card rounded-[40px] p-20 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-6">
                <Briefcase className="w-10 h-10 text-on-surface-variant/20" />
              </div>
              <h3 className="text-xl font-bold text-on-surface">No matches yet</h3>
              <p className="text-on-surface-variant max-w-xs mt-2">Try updating your resume or profile to get personalized recommendations.</p>
            </div>
          ) : (
            <>
              {currentJobs.map((job, idx) => (
                <motion.article
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card rounded-[40px] p-6 hover:border-primary/40 transition-all border-2 border-transparent group"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-20 h-20 md:w-32 md:h-32 rounded-3xl bg-surface-container flex items-center justify-center border border-outline-variant/20 overflow-hidden shrink-0">
                      {job.companyId?.logo ? (
                        <img src={job.companyId.logo} alt={job.companyId.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-2xl font-black text-primary/40 uppercase">{(job as any).companyId?.name?.[0] || 'J'}</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-secondary">{job.category}</span>
                            <span className="w-1 h-1 bg-outline-variant rounded-full" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">
                              {Array.isArray(job.jobType) ? job.jobType.join(' • ') : job.jobType}
                            </span>
                          </div>
                          <h3 className="text-2xl font-black text-on-surface group-hover:text-primary transition-colors leading-tight">{job.title}</h3>
                          <p className="text-on-surface-variant font-bold text-sm mt-1">{job.companyId?.name || 'Company'} • {job.location}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="text-2xl font-black text-primary">{getMatchScore(job)}%</div>
                          <span className="text-[9px] font-black uppercase tracking-tighter text-on-surface-variant/40">AI Match</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {job.requirements.slice(0, 3).map(req => (
                          <span key={req} className="px-3 py-1 rounded-xl bg-surface-container text-on-surface-variant text-[11px] font-bold border border-outline-variant/30">{req}</span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-outline-variant/20">
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-black text-on-surface">{job.salary}</span>
                          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant/60 font-bold">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(job.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <motion.button
                            className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-black text-xs md:text-sm rounded-2xl relative overflow-hidden transition-all shadow-xl shadow-primary/20 hover:shadow-primary/30"
                            style={{ position: 'relative', zIndex: 1 }}
                            onClick={() => handleViewDetails(job)}
                            whileHover={{
                              scale: 1.05,
                              boxShadow: "0 15px 20px -5px rgba(59, 130, 246, 0.4), 0 8px 8px -5px rgba(59, 130, 246, 0.25)"
                            }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {/* Infinite looping glass highlight sweep from left to right */}
                            <motion.div
                              className="absolute inset-0 w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
                              style={{ zIndex: 0 }}
                              animate={{
                                x: ["-180%", "280%"]
                              }}
                              transition={{
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 2,
                                ease: "easeInOut",
                                repeatDelay: 1.2
                              }}
                            />

                            {/* Text and icon with relative layer to stay on top */}
                            <span className="relative z-10 flex items-center justify-center gap-1.5">
                              Details
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>

        {/* Saved & Quick Stats */}
        <div className="lg:col-span-4 space-y-6">
          <section className="glass-card rounded-[32px] p-8 border-primary/10">
            <h4 className="text-xl font-black text-on-surface mb-6 flex items-center gap-2">
              <Zap className="text-primary w-5 h-5" />
              Matching Stats
            </h4>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Average Match</div>
                <div className="text-2xl font-black text-primary">87.5%</div>
              </div>
              <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Market Demand</div>
                <div className="text-2xl font-black text-secondary">High</div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-outline-variant/20">
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Matches are refreshed every 24 hours based on your latest skill updates.
              </p>
            </div>
          </section>

          <section className="glass-card rounded-[32px] p-8 border border-primary/10">
            <h4 className="text-xl font-black text-on-surface mb-6 flex items-center gap-2">
              <BrainCircuit className="text-primary w-5 h-5 animate-pulse" />
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
                <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Active Resume</div>
                    <div className="text-sm font-bold text-on-surface truncate pr-2">{defaultResume.fileName}</div>
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
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    AI matched this resume with your profile. You can re-analyze in Resume Analysis page to update scores.
                  </p>
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
                <p className="text-xs text-on-surface-variant text-center leading-relaxed">
                  Please analyze your resume to get a detailed ATS Score and matching statistics.
                </p>
                <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white" onClick={() => router.push('/candidate/resume-analysis')}>
                  Analyze Resume Now
                </Button>
              </div>
            ) : (
              <div className="space-y-6 text-center py-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-2">
                  <Sparkles className="w-8 h-8 text-amber-500 animate-pulse" />
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
        </div>
      </div>

    </main>
  );
};

export default JobMatchesView;
