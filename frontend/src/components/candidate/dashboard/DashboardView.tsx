'use client';

import React from 'react';
import { 
  Send, 
  MessageSquare, 
  GraduationCap, 
  CheckCircle2, 
  BarChart3,
  Rocket,
  LayoutDashboard,
  Lightbulb,
  AlertTriangle,
  Target,
  Trophy
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { cn } from '@/utils/cn';

const stats = [
  { name: 'Applications Sent', value: '12', icon: Send, color: 'text-primary', bg: 'bg-primary/10' },
  { name: 'Interviews', value: '4', icon: MessageSquare, color: 'text-secondary', bg: 'bg-secondary/10' },
  { name: 'Resume Score', value: '92', icon: GraduationCap, color: 'text-tertiary', bg: 'bg-tertiary/10' },
  { name: 'Profile Completion', value: '78%', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
];

const jobMatches = [
  { id: 1, title: 'Senior AI Engineer', company: 'OpenAI', location: 'San Francisco (Hybrid)', match: '98%', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=OA' },
  { id: 2, title: 'Fullstack Developer', company: 'Stripe', location: 'Remote', match: '95%', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=ST' },
  { id: 3, title: 'ML Researcher', company: 'Anthropic', location: 'London', match: '91%', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=AN' },
];

interface PipelineJob {
  title: string;
  company: string;
  time?: string;
  tag?: string;
  urgent?: boolean;
  highlight?: boolean;
}

interface PipelineColumn {
  status: string;
  count: number;
  jobs: PipelineJob[];
}

const pipeline: PipelineColumn[] = [
  { status: 'Applied', count: 1, jobs: [{ title: 'Frontend Eng', company: 'Vercel', time: '2d ago' }] },
  { status: 'Shortlisted', count: 0, jobs: [] },
  { status: 'Interview', count: 2, jobs: [{ title: 'Software Eng', company: 'Google', tag: 'Tech Screen • Tomorrow', urgent: true }, { title: 'Fullstack Dev', company: 'Meta', tag: 'Scheduling' }] },
  { status: 'Offer', count: 1, jobs: [{ title: 'AI Researcher', company: 'DeepMind', tag: 'Decision by Fri', highlight: true }] },
];

const DashboardView = () => {
  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Banner */}
      <section className="glass-card p-6 md:p-8 lg:p-10 relative overflow-hidden bg-gradient-to-r from-surface-container-high/50 to-surface-container/30 border-none shadow-xl">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-on-surface mb-2">Welcome back, Alex 👋</h1>
            <p className="text-sm md:text-base text-on-surface-variant max-w-md">Your AI readiness score is looking strong today. We found 3 new matches for your profile.</p>
            <Button variant="gradient" size="sm" className="mt-6 shadow-lg shadow-primary/20">
              Complete Profile
            </Button>
          </div>
          
          <div className="flex items-center gap-6 bg-white/40 dark:bg-black/20 p-6 rounded-3xl backdrop-blur-md border border-white/20">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-primary/10" strokeWidth="3" />
                <circle 
                  cx="18" cy="18" r="16" fill="none" 
                  className="stroke-primary" 
                  strokeWidth="3" 
                  strokeDasharray="85, 100" 
                  strokeLinecap="round" 
                />
              </svg>
              <span className="text-xl font-bold text-primary">85%</span>
            </div>
            <div>
              <div className="text-sm font-bold text-on-surface">AI Readiness</div>
              <div className="text-[10px] text-tertiary font-bold uppercase tracking-widest mt-1">Top 15% Globally</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 flex items-center gap-5 hover:-translate-y-1 cursor-pointer group"
          >
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{stat.name}</div>
              <div className="text-2xl font-bold text-on-surface mt-0.5">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bento Grid: Analysis & Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Resume Analysis */}
        <div className="lg:col-span-5 glass-card p-6 md:p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
              <Target className="text-primary w-6 h-6" />
              Resume Analysis
            </h2>
            <div className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full border border-primary/20 uppercase tracking-widest">
              Live Scan
            </div>
          </div>
          
          <div className="flex items-center gap-8 mb-8">
            <div className="relative w-28 h-28 flex items-center justify-center rounded-full bg-surface-container border-4 border-surface-container-highest shrink-0 shadow-[0_0_40px_rgba(70,72,212,0.1)]">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-surface-container-highest" strokeWidth="2.5" />
                <circle 
                  cx="18" cy="18" r="16" fill="none" 
                  className="stroke-primary" 
                  strokeWidth="2.5" 
                  strokeDasharray="92, 100" 
                  strokeLinecap="round" 
                />
              </svg>
              <span className="text-3xl font-black text-primary tracking-tighter">92</span>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <div className="text-[10px] font-bold text-on-surface-variant mb-2 uppercase tracking-widest">Top Skills Detected</div>
                <div className="flex flex-wrap gap-1.5">
                  {['React', 'Node.js', 'AI Eng'].map(s => (
                    <span key={s} className="bg-primary/5 text-primary text-[10px] font-bold px-2.5 py-1 rounded-lg border border-primary/10">{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-on-surface-variant mb-2 uppercase tracking-widest text-error">Gap Found</div>
                <span className="bg-error/5 text-error text-[10px] font-bold px-2.5 py-1 rounded-lg border border-error/10">System Design</span>
              </div>
            </div>
          </div>
          
          <div className="mt-auto grid grid-cols-2 gap-4 pt-6 border-t border-outline-variant/10">
            <Button size="sm" className="w-full">Improve Score</Button>
            <Button variant="outline" size="sm" className="w-full">Re-analyze</Button>
          </div>
        </div>

        {/* Job Matches */}
        <div className="lg:col-span-7 glass-card p-6 md:p-8 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
              <Rocket className="text-tertiary w-6 h-6" />
              AI Job Matches
            </h2>
            <button className="text-primary text-xs font-bold hover:underline">View All</button>
          </div>
          
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {jobMatches.map((job) => (
              <div key={job.id} className="bg-surface-container-low/50 rounded-2xl p-4 border border-outline-variant/5 flex items-center gap-5 hover:bg-surface-container-high transition-colors group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center p-2 shrink-0 border border-outline-variant/10 shadow-sm transition-transform group-hover:scale-105">
                  <img src={job.logo} alt={job.company} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-on-surface truncate group-hover:text-primary transition-colors">{job.title}</h3>
                  <div className="text-xs text-on-surface-variant truncate">{job.company} • {job.location}</div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="bg-tertiary/10 text-tertiary text-[10px] font-bold px-2 py-0.5 rounded-full border border-tertiary/20">{job.match} Match</span>
                  <button className="text-xs font-bold text-primary hover:opacity-80">Apply Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Application Kanban */}
      <section>
        <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-3">
          <LayoutDashboard className="text-secondary w-6 h-6" />
          Application Pipeline
        </h2>
        <div className="flex gap-6 overflow-x-auto pb-6 -mx-6 px-6 no-scrollbar snap-x lg:grid lg:grid-cols-4 lg:overflow-visible">
          {pipeline.map((col, idx) => (
            <div key={col.status} className="min-w-[280px] snap-start flex flex-col gap-4">
              <div className="flex justify-between items-center px-2">
                <div className={`text-[10px] font-black uppercase tracking-[0.2em] ${idx === 2 ? 'text-secondary' : idx === 3 ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {col.status} ({col.count})
                </div>
                {idx === 2 && <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />}
              </div>
              
              <div className="space-y-3 p-4 bg-surface-container-low/40 rounded-[2rem] border border-outline-variant/10 h-full min-h-[160px]">
                {col.jobs.length === 0 ? (
                  <div className="h-20 border-2 border-dashed border-outline-variant/20 rounded-2xl flex items-center justify-center text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest">
                    Drop here
                  </div>
                ) : (
                  col.jobs.map((job, jidx) => (
                    <motion.div 
                      key={jidx} 
                      whileHover={{ scale: 1.02 }}
                      className={cn(
                        "p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-outline-variant/10 shadow-sm cursor-grab active:cursor-grabbing",
                        job.urgent && "border-secondary/30 bg-secondary/[0.02]",
                        job.highlight && "border-primary/30 bg-primary/[0.02]"
                      )}
                    >
                      <div className="font-bold text-sm mb-1">{job.title}</div>
                      <div className="text-xs text-on-surface-variant mb-3">{job.company}</div>
                      {job.tag && (
                        <div className={cn(
                          "text-[10px] font-bold px-2 py-1 rounded inline-block",
                          job.urgent ? "bg-secondary/10 text-secondary" : 
                          job.highlight ? "bg-primary/10 text-primary" : "bg-surface-container text-on-surface-variant"
                        )}>
                          {job.tag}
                        </div>
                      )}
                      {!job.tag && <div className="text-[10px] text-on-surface-variant/60 font-medium">Applied {job.time}</div>}
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Analytics & Coaching */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-6 md:p-8 flex flex-col h-56 md:h-64 relative overflow-hidden group">
          <div className="flex justify-between items-center mb-6 relative z-10">
            <h3 className="font-bold text-lg text-on-surface flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Application Activity
            </h3>
            <div className="flex gap-1">
              {[0.4, 0.6, 0.3, 0.8, 1, 0.7, 0.9].map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h * 100}%` }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="w-1.5 bg-primary/20 group-hover:bg-primary/40 rounded-full transition-colors"
                />
              ))}
            </div>
          </div>
          <div className="mt-auto flex items-end justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-widest relative z-10">
            <span>Last 7 Days</span>
            <span className="text-primary">+12% vs last week</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary/[0.02] to-transparent pointer-events-none" />
        </div>

        <div className="glass-card p-6 md:p-8 flex flex-col bg-primary/[0.02] border-primary/20 border-dashed">
          <h3 className="font-bold text-lg text-on-surface mb-6 flex items-center gap-3">
            <Lightbulb className="text-primary w-6 h-6" />
            AI Coaching
          </h3>
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold">Optimize LinkedIn</div>
                <div className="text-xs text-on-surface-variant">Your summary lacks key AI terminology detected in top jobs.</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-bold">Practice System Design</div>
                <div className="text-xs text-on-surface-variant">We noticed a gap in technical skills for your dream roles.</div>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full mt-auto font-bold border-dashed border-primary/30 text-primary hover:bg-primary/5">
            Start Practice Session
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
