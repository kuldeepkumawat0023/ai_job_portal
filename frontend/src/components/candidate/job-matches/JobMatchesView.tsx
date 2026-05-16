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
import { Button } from '@/components/common/Button';
import { toast } from 'react-hot-toast';
import { cn } from '@/utils/cn';

const JobMatchesView = () => {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [aiMatchLoading, setAiMatchLoading] = useState(false);
  const [aiMatchData, setAiMatchData] = useState<any>(null);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs();
    }, 500); // Debounce search
    return () => clearTimeout(timer);
  }, [searchQuery, selectedLocation]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchQuery) params.keyword = searchQuery;
      if (selectedLocation !== 'All') params.location = selectedLocation;
      
      const res = await jobService.getAllJobs(params); // Using getAllJobs for general search/filter
      if (res.success) setJobs(res.data);
    } catch (error) {
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (job: Job) => {
    setSelectedJob(job);
    setAiMatchData(null);
    setAiMatchLoading(true);
    try {
      const res = await aiService.matchJob(job._id);
      if (res.success) setAiMatchData(res.data);
    } catch (error) {
      console.error('AI Match failed:', error);
    } finally {
      setAiMatchLoading(false);
    }
  };

  const handleApply = (jobId: string) => {
    router.push(`/candidate/applications/${jobId}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 relative">
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-on-surface tracking-tight mb-2">Job Matches</h2>
          <p className="text-lg text-on-surface-variant font-medium">AI-curated roles specifically for your profile.</p>
        </div>
        <div className="hidden md:flex gap-2">
          <div className="px-4 py-2 rounded-2xl bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-3.5 h-3.5" />
            Live Matching
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="glass-card rounded-[32px] p-3 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[280px] relative">
          <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-primary" />
          <input 
            className="w-full pl-14 pr-4 py-4 bg-transparent border-none focus:ring-0 text-base font-medium placeholder-on-surface-variant/40 outline-none" 
            placeholder="Job title, keywords, or company" 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="h-10 w-px bg-outline-variant/30 hidden lg:block"></div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSelectedLocation(selectedLocation === 'Remote' ? 'All' : 'Remote')}
            className={cn(
              "px-5 py-3 rounded-2xl border flex items-center gap-3 transition-all",
              selectedLocation === 'Remote' 
                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                : "border-outline-variant/30 hover:bg-surface-container-low text-on-surface-variant"
            )}
          >
            <MapPin className={cn("w-4 h-4", selectedLocation === 'Remote' ? "text-white" : "text-on-surface-variant")} />
            <span className="text-sm font-bold">{selectedLocation === 'Remote' ? 'Remote Only' : 'Remote'}</span>
            <ChevronDown className="w-4 h-4" />
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
            jobs.map((job, idx) => (
              <motion.div 
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
                          <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">{job.jobType}</span>
                        </div>
                        <h3 className="text-2xl font-black text-on-surface group-hover:text-primary transition-colors leading-tight">{job.title}</h3>
                        <p className="text-on-surface-variant font-bold text-sm mt-1">{job.companyId?.name || 'Company'} • {job.location}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-2xl font-black text-primary">90%+</div>
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
                        <button className="p-3 rounded-2xl border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container-low transition-all">
                          <Bookmark className="w-5 h-5" />
                        </button>
                        <Button variant="outline" onClick={() => handleViewDetails(job)}>
                          Details
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
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

          <section className="glass-card rounded-[32px] p-8">
            <h4 className="text-xl font-black text-on-surface mb-6 flex items-center gap-2">
              <Bookmark className="text-secondary w-5 h-5" />
              Saved for later
            </h4>
            <div className="space-y-4 opacity-40">
               <p className="text-center py-10 text-xs font-bold uppercase tracking-widest">No saved jobs</p>
            </div>
          </section>
        </div>
      </div>

      {/* JOB DETAIL OVERLAY (MODAL) */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl max-h-[90vh] bg-surface rounded-[40px] shadow-2xl overflow-hidden border border-outline-variant/20 flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 md:p-10 border-b border-outline-variant/10 flex justify-between items-start relative overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.03] to-transparent pointer-events-none" />
                <div className="flex gap-6 relative z-10">
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-3xl bg-surface-container flex items-center justify-center border border-outline-variant/20 shrink-0">
                    <Briefcase className="w-8 h-8 md:w-12 md:h-12 text-primary/40" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">{selectedJob.jobType}</span>
                      <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest">{selectedJob.location}</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-on-surface leading-tight">{selectedJob.title}</h3>
                    <p className="text-lg text-on-surface-variant font-bold mt-1">{selectedJob.companyId?.name || 'Company Name'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="p-3 rounded-2xl hover:bg-surface-container-low transition-all text-on-surface-variant relative z-10"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  {/* Left: Job Info */}
                  <div className="lg:col-span-8 space-y-10">
                    {/* AI Insight Box */}
                    <div className="p-8 rounded-[2rem] bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 border border-primary/10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-10">
                        <BrainCircuit className="w-20 h-20 text-primary" />
                      </div>
                      <h4 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                        <Sparkles className="w-4 h-4" />
                        AI Match Insight
                      </h4>
                      
                      {aiMatchLoading ? (
                        <div className="flex items-center gap-4 animate-pulse">
                          <div className="w-12 h-12 rounded-full bg-primary/10" />
                          <div className="h-4 w-48 bg-surface-container-high rounded" />
                        </div>
                      ) : aiMatchData ? (
                        <div className="space-y-4">
                          <div className="flex items-end gap-3">
                            <span className="text-5xl font-black text-primary">{aiMatchData.score}%</span>
                            <span className="text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Compatibility</span>
                          </div>
                          <p className="text-base text-on-surface-variant leading-relaxed font-medium">
                            {aiMatchData.reasoning || "Your profile and experience align significantly with this role's requirements."}
                          </p>
                          <div className="flex flex-wrap gap-2 pt-2">
                            {aiMatchData.missingSkills?.map((s: string) => (
                              <span key={s} className="px-3 py-1 rounded-lg bg-red-500/5 text-red-500 text-[10px] font-black uppercase tracking-widest border border-red-500/10">Missing: {s}</span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-on-surface-variant font-medium">Analysis is being processed for this role.</p>
                      )}
                    </div>

                    <div className="space-y-6">
                      <h4 className="text-xl font-black text-on-surface flex items-center gap-3">
                        <Layers className="text-secondary w-6 h-6" />
                        Description
                      </h4>
                      <p className="text-base text-on-surface-variant leading-[1.8] whitespace-pre-wrap font-medium">
                        {selectedJob.description}
                      </p>
                    </div>

                    <div className="space-y-6">
                      <h4 className="text-xl font-black text-on-surface flex items-center gap-3">
                        <ShieldCheck className="text-emerald-500 w-6 h-6" />
                        Requirements
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedJob.requirements.map((req, i) => (
                          <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/10">
                            <div className="w-2 h-2 rounded-full bg-primary/40" />
                            <span className="text-sm font-bold text-on-surface-variant">{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions & Sidebar */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="glass-card rounded-3xl p-8 border-primary/20 bg-primary/[0.02]">
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">Estimated Salary</div>
                      <div className="text-3xl font-black text-on-surface mb-8">{selectedJob.salary}</div>
                      
                      <div className="space-y-4">
                        <Button variant="gradient" size="lg" className="w-full py-4 shadow-xl shadow-primary/20" onClick={() => handleApply(selectedJob._id)}>
                          Apply Now
                        </Button>
                        <Button variant="outline" size="lg" className="w-full py-4">
                          <Bookmark className="mr-2 w-5 h-5" />
                          Save for later
                        </Button>
                      </div>
                      <p className="text-[10px] text-center text-on-surface-variant font-bold uppercase tracking-widest mt-6 opacity-60">
                        Applications close in 14 days
                      </p>
                    </div>

                    <div className="glass-card rounded-3xl p-6 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center">
                          <Globe className="w-5 h-5 text-on-surface-variant" />
                        </div>
                        <div>
                          <div className="text-[10px] font-black uppercase text-on-surface-variant/60">Location</div>
                          <div className="text-sm font-bold text-on-surface">{selectedJob.location}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-on-surface-variant" />
                        </div>
                        <div>
                          <div className="text-[10px] font-black uppercase text-on-surface-variant/60">Experience</div>
                          <div className="text-sm font-bold text-on-surface">{selectedJob.experience} Years Required</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobMatchesView;
