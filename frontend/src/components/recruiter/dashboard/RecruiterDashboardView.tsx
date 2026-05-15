'use client';

import React from 'react';
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
  Search 
} from 'lucide-react';
import { motion } from 'framer-motion';

const RecruiterDashboardView = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* Welcome Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-on-surface mb-2 tracking-tight">Recruiter Dashboard</h1>
        <p className="text-on-surface-variant font-medium">Welcome back, Alex. Here's your hiring overview for today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Jobs', value: '24', change: '+12%', icon: Briefcase, color: 'text-primary bg-primary/10' },
          { label: 'Total Applicants', value: '1,482', change: '+154', icon: Users, color: 'text-secondary bg-secondary/10' },
          { label: 'Shortlisted', value: '86', change: 'Top 5%', icon: Star, color: 'text-tertiary bg-tertiary/10' },
          { label: 'Hired (MTD)', value: '12', change: '88% Goal', icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 rounded-3xl hover:-translate-y-1 transition-all duration-300 group shadow-sm border border-white/10"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${stat.color.split(' ')[0]}`}>{stat.change}</span>
            </div>
            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-on-surface">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-3xl border border-white/10 flex items-center justify-between group hover:bg-surface-container-low transition-colors">
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
        </div>

        <div className="glass-card p-6 rounded-3xl border border-white/10 flex items-center justify-between group hover:bg-surface-container-low transition-colors">
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
        </div>

        <div className="lg:col-span-2 flex items-start gap-3 bg-primary/5 p-4 rounded-2xl border border-primary/10">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-on-surface-variant leading-relaxed">
            <span className="font-bold text-primary">AI Impact:</span> Your reputation and responsiveness scores are currently improving your company's AI ranking by <span className="font-bold text-primary">14%</span>. This helps your job postings reach higher-quality talent faster.
          </p>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Section: AI Talent Matcher (8 cols) */}
        <div className="xl:col-span-8 space-y-8">
          <div className="glass-card rounded-3xl p-8 border border-white/10 shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h2 className="text-2xl font-black text-on-surface flex items-center gap-3">
                <BrainCircuit className="w-7 h-7 text-primary animate-pulse" />
                AI Talent Matcher
              </h2>
              <button className="text-xs font-black text-primary hover:underline uppercase tracking-widest">View All Candidates</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-outline-variant/30">
                    <th className="pb-4 font-black text-[10px] text-on-surface-variant uppercase tracking-widest">Candidate</th>
                    <th className="pb-4 font-black text-[10px] text-on-surface-variant uppercase tracking-widest">Match Score</th>
                    <th className="pb-4 font-black text-[10px] text-on-surface-variant uppercase tracking-widest">Top Skills</th>
                    <th className="pb-4 font-black text-[10px] text-on-surface-variant uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {[
                    { name: 'David Miller', role: 'Senior Frontend Dev', score: 98, skills: ['React', 'TS', 'Next.js'], img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100' },
                    { name: 'Sarah Jenkins', role: 'UX Engineer', score: 92, skills: ['Figma', 'A11y', 'Tailwind'], img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100' },
                    { name: 'James Wilson', role: 'Fullstack Developer', score: 89, skills: ['Node.js', 'SQL', 'Docker'], img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100' },
                  ].map((candidate, i) => (
                    <tr key={candidate.name} className="group hover:bg-surface-container-low transition-colors">
                      <td className="py-5">
                        <div className="flex items-center gap-4">
                          <img src={candidate.img} alt={candidate.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/5" />
                          <div>
                            <p className="text-sm font-bold text-on-surface">{candidate.name}</p>
                            <p className="text-[10px] font-medium text-on-surface-variant">{candidate.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-20 h-1.5 bg-surface-container rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${candidate.score}%` }}></div>
                          </div>
                          <span className="text-xs font-black text-primary">{candidate.score}%</span>
                        </div>
                      </td>
                      <td className="py-5">
                        <div className="flex gap-1.5">
                          {candidate.skills.map(skill => (
                            <span key={skill} className="px-2 py-0.5 bg-primary/5 text-primary rounded-md text-[9px] font-black border border-primary/10 uppercase">{skill}</span>
                          ))}
                        </div>
                      </td>
                      <td className="py-5 text-right">
                        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Draft Section */}
          <div className="glass-card rounded-3xl p-8 border border-white/10 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-on-surface tracking-tight">Draft New Opening</h2>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-primary/10 text-primary rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary/20 transition-all">
                <Sparkles className="w-4 h-4" />
                AI Generate JD
              </button>
            </div>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Job Title</label>
                  <input className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 px-0 py-2 font-medium text-on-surface transition-all placeholder:text-on-surface-variant/40" placeholder="e.g. Senior Staff Engineer" type="text"/>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Department</label>
                  <select className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 px-0 py-2 font-medium text-on-surface transition-all">
                    <option>Engineering</option>
                    <option>Product</option>
                    <option>Design</option>
                    <option>Marketing</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Key Requirements</label>
                <textarea className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 px-0 py-2 font-medium text-on-surface transition-all resize-none" placeholder="List 3-5 core skills or objectives..." rows={3}></textarea>
              </div>
            </form>
          </div>
        </div>

        {/* Right Section: Pipeline (4 cols) */}
        <div className="xl:col-span-4">
          <div className="glass-card rounded-3xl p-8 border border-white/10 h-full flex flex-col min-h-[600px]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-on-surface tracking-tight">Pipeline</h2>
              <span className="bg-surface-container-high px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest">14 Active</span>
            </div>
            
            <div className="space-y-8 overflow-y-auto pr-2 custom-scrollbar flex-1">
              {/* Interviewing Stage */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Interviewing (4)</span>
                </div>
                
                {[
                  { name: 'Elena Rodriguez', info: 'Matched 94% • 8y Exp', summary: 'Strong leadership in distributed teams. Expert in Go and Cloud Infra.', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100' },
                  { name: 'Marcus Kim', info: 'Matched 88% • 5y Exp', summary: 'Highly creative problem solver. Extensive background in WebGL.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100' }
                ].map(candidate => (
                  <div key={candidate.name} className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all cursor-grab active:cursor-grabbing group">
                    <div className="flex gap-4 mb-4">
                      <img src={candidate.img} alt={candidate.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <p className="text-sm font-bold text-on-surface">{candidate.name}</p>
                        <p className="text-[10px] font-medium text-on-surface-variant">{candidate.info}</p>
                      </div>
                    </div>
                    <div className="bg-primary/5 rounded-xl p-3 mb-4">
                      <p className="text-[11px] leading-relaxed text-on-surface">
                        <span className="font-black text-primary italic uppercase tracking-tighter mr-1">AI:</span> {candidate.summary}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full border-2 border-surface bg-surface-container-high flex items-center justify-center text-[8px] font-black">AC</div>
                        <div className="w-6 h-6 rounded-full border-2 border-surface bg-surface-container-high flex items-center justify-center text-[8px] font-black">MK</div>
                      </div>
                      <button className="text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                        Schedule <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Technical Test Stage */}
              <div className="space-y-4 pt-4 border-t border-outline-variant/20">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Technical Test (2)</span>
                </div>
                <div className="bg-surface-container-low/50 border border-dashed border-outline-variant/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                  <Users className="w-8 h-8 text-on-surface-variant/20 mb-2" />
                  <p className="text-[10px] font-bold text-on-surface-variant/40 italic uppercase tracking-widest">In progress</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboardView;
