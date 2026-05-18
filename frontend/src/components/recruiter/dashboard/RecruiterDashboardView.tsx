'use client';

import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Users, 
  Star, 
  CheckCircle2, 
  TrendingUp, 
  Bolt, 
  Info, 
  BrainCircuit, 
  MoreVertical, 
  Plus, 
  Sparkles, 
  ChevronRight, 
  Search,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { dashboardService } from '@/lib/services/dashboard.services';
import { jobService } from '@/lib/services/job.services';
import apiClient from '@/lib/apiClient';
import { toast } from 'react-hot-toast';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const RecruiterDashboardView = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [stats, setStats] = useState<any>(null);
  const [topCandidates, setTopCandidates] = useState<any[]>([]);
  const [pipeline, setPipeline] = useState<any[]>([]);
  const [company, setCompany] = useState<any>(null);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states for Draft Job
  const [draftTitle, setDraftTitle] = useState('');
  const [draftDepartment, setDraftDepartment] = useState('Engineering');
  const [draftRequirements, setDraftRequirements] = useState('');
  const [generatingJD, setGeneratingJD] = useState(false);
  const [publishingJob, setPublishingJob] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getRecruiterStats();
      if (res?.success) {
        setStats(res.data.stats);
        setTopCandidates(res.data.topCandidates || []);
        setPipeline(res.data.pipeline || []);
        setCompany(res.data.company);
        setTrendData(res.data.trend || []);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch recruiter metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAIGenerateJD = async () => {
    if (!draftTitle.trim()) {
      toast.error('Please enter a Job Title first to generate JD!');
      return;
    }
    try {
      setGeneratingJD(true);
      toast.loading('AI is crafting a high-impact job description...', { id: 'ai-jd' });
      const res = await apiClient.post('/ai/generate-job-desc', {
        title: draftTitle,
        companyName: company?.name || 'our company',
        industry: draftDepartment
      });
      if (res.data?.success) {
        const aiData = res.data.data;
        const requirementsText = Array.isArray(aiData.requirements) 
          ? aiData.requirements.join('\n') 
          : aiData.requirements || '';
        const combinedJD = `${aiData.description}\n\nRequirements:\n${requirementsText}`;
        setDraftRequirements(combinedJD);
        toast.success('AI Job Description generated successfully!', { id: 'ai-jd' });
      } else {
        toast.error('Failed to generate JD', { id: 'ai-jd' });
      }
    } catch (err: any) {
      toast.error(err.message || 'AI generation failed', { id: 'ai-jd' });
    } finally {
      setGeneratingJD(false);
    }
  };

  const handlePublishJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftTitle.trim()) {
      toast.error('Job Title is required!');
      return;
    }
    if (!draftRequirements.trim()) {
      toast.error('Key Requirements/Description are required!');
      return;
    }
    try {
      setPublishingJob(true);
      toast.loading('Publishing new job opening...', { id: 'pub-job' });
      
      const payload = {
        title: draftTitle,
        description: draftRequirements,
        requirements: draftRequirements.split('\n').filter(r => r.trim().length > 0),
        salary: 'Competitive',
        location: company?.location || 'Remote',
        jobType: 'Full-time' as const,
        experience: 2,
        category: draftDepartment,
        companyId: company?._id || '6646875084931a001b9fa7d1'
      };

      const res = await jobService.postJob(payload);
      if (res?.success) {
        toast.success(`Job opening for "${draftTitle}" is now live!`, { id: 'pub-job' });
        setDraftTitle('');
        setDraftRequirements('');
        fetchDashboardData();
      } else {
        toast.error(res?.message || 'Failed to post job opening', { id: 'pub-job' });
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to post job opening', { id: 'pub-job' });
    } finally {
      setPublishingJob(false);
    }
  };

  // Stage classification for Pipeline
  const interviewingCandidates = pipeline.filter(c => c.status === 'interviewing');
  const shortlistedCandidates = pipeline.filter(c => c.status === 'shortlisted');
  const appliedCandidates = pipeline.filter(c => c.status === 'applied');

  if (loading) {
    return (
      <div className="space-y-10 animate-in fade-in duration-500">
        {/* Welcome Header Skeleton */}
        <div className="mb-10 animate-pulse">
          <div className="h-9 w-64 bg-surface-container rounded-2xl mb-2"></div>
          <div className="h-4 w-96 bg-surface-container-high rounded-xl"></div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="glass-card p-6 rounded-3xl animate-pulse space-y-4">
              <div className="flex justify-between items-start">
                <div className="w-11 h-11 bg-surface-container rounded-2xl"></div>
                <div className="w-12 h-4 bg-surface-container-high rounded-lg"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-16 bg-surface-container rounded-md"></div>
                <div className="h-8 w-24 bg-surface-container-high rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid Content Skeleton */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-8 space-y-8 animate-pulse">
            <div className="glass-card rounded-3xl p-8 h-80 space-y-6">
              <div className="h-6 w-48 bg-surface-container rounded-lg"></div>
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-4 h-12 bg-surface-container rounded-2xl"></div>
                ))}
              </div>
            </div>
          </div>
          <div className="xl:col-span-4 animate-pulse">
            <div className="glass-card rounded-3xl p-8 h-80 bg-surface-container"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="space-y-10 animate-in fade-in duration-700">
      
      {/* Welcome Header */}
      <header className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-black text-on-surface mb-2 tracking-tight">Recruiter Dashboard</h1>
        <p className="text-sm sm:text-base text-on-surface-variant font-medium">Welcome back, {user?.fullname || 'Alex'}. Here's your hiring overview for today.</p>
      </header>

      {/* Stats Grid - 2x2 on Mobile, 1x4 on Desktop */}
      <section aria-label="Recruitment Overview" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {[
          { label: 'Active Jobs', value: stats?.activeJobs || 0, change: 'Total Postings', icon: Briefcase, color: 'text-primary bg-primary/10' },
          { label: 'Total Applicants', value: stats?.totalApplicants || 0, change: 'Submissions', icon: Users, color: 'text-secondary bg-secondary/10' },
          { label: 'Shortlisted', value: stats?.shortlisted || 0, change: 'Top Matches', icon: Star, color: 'text-tertiary bg-tertiary/10' },
          { label: 'Hired (MTD)', value: stats?.hired || 0, change: 'Hires Complete', icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' },
        ].map((stat, i) => (
          <motion.article 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl hover:-translate-y-1 transition-all duration-300 group shadow-sm border border-white/10 flex flex-col justify-between min-h-[140px] sm:min-h-[160px]"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start mb-3 sm:mb-4 gap-2 sm:gap-0">
              <div className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl w-fit ${stat.color}`}>
                <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className={`text-[8px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest ${stat.color.split(' ')[0]} sm:text-right w-full sm:w-auto`}>{stat.change}</span>
            </div>
            <div>
              <p className="text-[8px] sm:text-[10px] font-black text-on-surface-variant uppercase tracking-wider sm:tracking-widest mb-1 sm:mb-2">{stat.label}</p>
              <h3 className="text-2xl sm:text-3xl font-black text-on-surface leading-none">{stat.value}</h3>
            </div>
          </motion.article>
        ))}
      </section>

      {/* Insights Row */}
      <section aria-label="Quick Insights" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <article className="glass-card p-6 rounded-3xl border border-white/10 flex items-center justify-between group hover:bg-surface-container-low transition-colors">
          <div>
            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Market Reputation</p>
            <div className="flex items-center gap-3">
              <h3 className="text-3xl font-black text-on-surface">4.8/5</h3>
              <div className="flex text-tertiary">
                {[1, 2, 3, 4].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                <Star className="w-4 h-4" />
              </div>
            </div>
          </div>
          <div className="p-4 bg-tertiary/10 text-tertiary rounded-full group-hover:scale-110 transition-transform">
            <TrendingUp className="w-6 h-6" />
          </div>
        </article>

        <article className="glass-card p-6 rounded-3xl border border-white/10 flex items-center justify-between group hover:bg-surface-container-low transition-colors">
          <div>
            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Recruiter Responsiveness</p>
            <div className="flex items-center gap-3">
              <h3 className="text-3xl font-black text-on-surface">98%</h3>
              <span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg text-[9px] font-black border border-emerald-500/20 uppercase tracking-widest italic">Fast Responder</span>
            </div>
          </div>
          <div className="p-4 bg-primary/10 text-primary rounded-full group-hover:scale-110 transition-transform">
            <Bolt className="w-6 h-6" />
          </div>
        </article>

        <article className="lg:col-span-2 flex items-start gap-3 bg-primary/5 p-4 rounded-2xl border border-primary/10">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-on-surface-variant leading-relaxed">
            <span className="font-bold text-primary">AI Impact:</span> Your reputation and responsiveness scores are currently improving your company's AI ranking by <span className="font-bold text-primary">14%</span>. This helps your job postings reach higher-quality talent faster.
          </p>
        </article>
      </section>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Section: AI Talent Matcher (8 cols) */}
        <div className="xl:col-span-8 space-y-8">
          {/* Live Application Volume Trend Graph */}
          <section aria-label="Application Volume Trend" className="glass-card p-8 rounded-3xl border border-white/10 shadow-sm overflow-hidden bg-surface-container-lowest/50">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-on-surface flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-[#8127cf]" />
                Application Volume Trend
              </h3>
              <div className="flex items-center gap-4">
                <button className="text-[10px] font-black uppercase tracking-widest text-on-surface hover:text-primary transition-colors">Week</button>
                <button className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/40 hover:text-on-surface transition-colors">Month</button>
              </div>
            </div>

            <div className="h-[260px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData.length > 0 ? trendData : [
                  { day: 'Mon', applications: 0 },
                  { day: 'Tue', applications: 0 },
                  { day: 'Wed', applications: 0 },
                  { day: 'Thu', applications: 0 },
                  { day: 'Fri', applications: 0 },
                  { day: 'Sat', applications: 0 },
                  { day: 'Sun', applications: 0 },
                ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAppsDashboard" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8127cf" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8127cf" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--on-surface-variant)', fontSize: 10, fontWeight: 700 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--on-surface-variant)', fontSize: 10, fontWeight: 700 }}
                  />
                  <Tooltip 
                    cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '3 3' }}
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.85)', 
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#000'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="applications" 
                    stroke="#8127cf" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorAppsDashboard)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* AI Talent Matcher */}
          <section aria-label="AI Talent Matcher" className="glass-card rounded-3xl p-8 border border-white/10 shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h2 className="text-2xl font-black text-on-surface flex items-center gap-3">
                <BrainCircuit className="w-7 h-7 text-primary animate-pulse" />
                AI Talent Matcher
              </h2>
              <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Top Matches based on AI compatibility score</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-outline-variant/30">
                    <th className="pb-4 font-black text-[10px] text-on-surface-variant uppercase tracking-widest">Candidate</th>
                    <th className="pb-4 font-black text-[10px] text-on-surface-variant uppercase tracking-widest">Applied For</th>
                    <th className="pb-4 font-black text-[10px] text-on-surface-variant uppercase tracking-widest">Match Score</th>
                    <th className="pb-4 font-black text-[10px] text-on-surface-variant uppercase tracking-widest">Top Skills</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {topCandidates.length > 0 ? (
                    topCandidates.map((app, i) => {
                      const candidate = app.applicantId;
                      const job = app.jobId;
                      if (!candidate) return null;
                      const skills = candidate.skills?.slice(0, 3) || [];
                      const avatar = candidate.profilePhoto || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100`;
                      
                      return (
                        <tr key={app._id} className="group hover:bg-surface-container-low transition-colors">
                          <td className="py-5">
                            <div className="flex items-center gap-4">
                              <img src={avatar} alt={candidate.fullname} className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/5" />
                              <div>
                                <p className="text-sm font-bold text-on-surface">{candidate.fullname}</p>
                                <p className="text-[10px] font-medium text-on-surface-variant">{candidate.location || 'Remote'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-5 text-sm font-semibold text-on-surface-variant">
                            {job?.title || 'Job Opening'}
                          </td>
                          <td className="py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-20 h-1.5 bg-surface-container rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${app.aiScore || 0}%` }}></div>
                              </div>
                              <span className="text-xs font-black text-primary">{app.aiScore || 0}%</span>
                            </div>
                          </td>
                          <td className="py-5">
                            <div className="flex gap-1.5 flex-wrap">
                              {skills.length > 0 ? (
                                skills.map((skill: string) => (
                                  <span key={skill} className="px-2 py-0.5 bg-primary/5 text-primary rounded-md text-[9px] font-black border border-primary/10 uppercase">{skill}</span>
                                ))
                              ) : (
                                <span className="text-[9px] text-on-surface-variant/40 font-bold uppercase">No listed skills</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-on-surface-variant/60 font-medium italic">
                        No candidate applications match yet. Make sure candidates apply to your posted jobs!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Section: Pipeline (4 cols) */}
        <aside aria-label="Hiring Pipeline" className="xl:col-span-4">
          <div className="glass-card rounded-3xl p-8 border border-white/10 h-full flex flex-col min-h-[600px]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-on-surface tracking-tight">Pipeline</h2>
              <span className="bg-surface-container-high px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest">{pipeline.length} Active</span>
            </div>
            
            <div className="space-y-8 overflow-y-auto pr-2 custom-scrollbar flex-1">
              
              {/* Interviewing Stage */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Interviewing ({interviewingCandidates.length})</span>
                </div>
                
                {interviewingCandidates.length > 0 ? (
                  interviewingCandidates.map(app => {
                    const candidate = app.applicantId;
                    if (!candidate) return null;
                    const avatar = candidate.profilePhoto || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100`;
                    
                    return (
                      <div key={app._id} className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex gap-4 mb-4">
                          <img src={avatar} alt={candidate.fullname} className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <p className="text-sm font-bold text-on-surface">{candidate.fullname}</p>
                            <p className="text-[10px] font-medium text-on-surface-variant">Matched {app.aiScore || 0}% • {candidate.experience || 0}y Exp</p>
                          </div>
                        </div>
                        <div className="bg-primary/5 rounded-xl p-3 mb-2">
                          <p className="text-[11px] leading-relaxed text-on-surface">
                            <span className="font-black text-primary italic uppercase tracking-tighter mr-1">AI Recommendation:</span> 
                            {candidate.bio || 'Highly compatible profile matching core role attributes.'}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-[10px] text-on-surface-variant/40 italic uppercase tracking-widest text-center py-2">No candidates interviewing</div>
                )}
              </div>

              {/* Shortlisted Stage */}
              <div className="space-y-4 pt-4 border-t border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                  <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Shortlisted ({shortlistedCandidates.length})</span>
                </div>
                
                {shortlistedCandidates.length > 0 ? (
                  shortlistedCandidates.map(app => {
                    const candidate = app.applicantId;
                    if (!candidate) return null;
                    const avatar = candidate.profilePhoto || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100`;
                    
                    return (
                      <div key={app._id} className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex gap-4 mb-4">
                          <img src={avatar} alt={candidate.fullname} className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <p className="text-sm font-bold text-on-surface">{candidate.fullname}</p>
                            <p className="text-[10px] font-medium text-on-surface-variant">Matched {app.aiScore || 0}% • {candidate.experience || 0}y Exp</p>
                          </div>
                        </div>
                        <div className="bg-primary/5 rounded-xl p-3 mb-2">
                          <p className="text-[11px] leading-relaxed text-on-surface">
                            <span className="font-black text-tertiary italic uppercase tracking-tighter mr-1">Skills Profile:</span> 
                            {candidate.skills?.join(', ') || 'General profile match.'}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-[10px] text-on-surface-variant/40 italic uppercase tracking-widest text-center py-2">No candidates shortlisted</div>
                )}
              </div>

              {/* Applied/New Submissions Stage */}
              <div className="space-y-4 pt-4 border-t border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">New Applied ({appliedCandidates.length})</span>
                </div>
                
                {appliedCandidates.length > 0 ? (
                  appliedCandidates.map(app => {
                    const candidate = app.applicantId;
                    if (!candidate) return null;
                    const avatar = candidate.profilePhoto || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100`;
                    
                    return (
                      <div key={app._id} className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex gap-4 mb-4">
                          <img src={avatar} alt={candidate.fullname} className="w-12 h-12 rounded-xl object-cover" />
                          <div>
                            <p className="text-sm font-bold text-on-surface">{candidate.fullname}</p>
                            <p className="text-[10px] font-medium text-on-surface-variant">Matched {app.aiScore || 0}% • {candidate.experience || 0}y Exp</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-[10px] text-on-surface-variant/40 italic uppercase tracking-widest text-center py-2">No new applicants</div>
                )}
              </div>

            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default RecruiterDashboardView;
