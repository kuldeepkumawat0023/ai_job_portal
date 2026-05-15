'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Mail, 
  Calendar, 
  MoreVertical, 
  ChevronRight, 
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  LayoutGrid,
  List,
  ArrowUpRight,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

const RecruiterApplicationsView = () => {
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState('');

  const candidates = [
    {
      id: 1,
      name: 'Sarah Jenkins',
      role: 'Senior Frontend Engineer',
      matchScore: 96,
      appliedDate: 'Oct 24, 2023',
      status: 'Technical Interview',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
      reasoning: 'Expert-level React & TypeScript knowledge. Previous experience at Tier-1 tech firms.'
    },
    {
      id: 2,
      name: 'Michael Chang',
      role: 'Product Designer',
      matchScore: 88,
      appliedDate: 'Oct 23, 2023',
      status: 'Screening',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
      reasoning: 'Strong portfolio in B2B SaaS. Good cultural fit based on AI analysis.'
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      role: 'Data Scientist',
      matchScore: 45,
      appliedDate: 'Oct 20, 2023',
      status: 'Rejected',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150',
      reasoning: 'Lacks required Python experience. Background more suited for entry-level analyst roles.'
    }
  ];

  const topPicks = [
    {
      id: 4,
      name: 'David Kim',
      matchScore: 98,
      tag: 'BACKEND EXPERT',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight mb-2">Applications</h1>
          <p className="text-sm md:text-base text-on-surface-variant font-medium">Showing 124 total applicants across active roles.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-surface-container rounded-xl p-1 border border-outline-variant/10">
            <button 
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === 'list' ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              <List size={18} />
            </button>
            <button 
              onClick={() => setViewMode('kanban')}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === 'kanban' ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              <LayoutGrid size={18} />
            </button>
          </div>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 glass-card rounded-xl text-xs font-bold text-on-surface-variant hover:text-on-surface transition-all">
            <Filter size={16} />
            Filters
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 gradient-button text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors group-focus-within:text-primary" size={18} />
            <input 
              type="text" 
              placeholder="Search candidates..."
              className="w-full pl-12 pr-4 py-3.5 bg-surface-container/50 border border-outline-variant/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            {candidates.map((candidate, i) => (
              <motion.div 
                key={candidate.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-4 md:p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between hover:bg-surface-container-low transition-all duration-300 group cursor-pointer border border-white/5 gap-4"
              >
                {/* Candidate Profile */}
                <div className="flex items-center gap-4 md:w-1/3">
                  <div className="relative shrink-0">
                    <img src={candidate.avatar} alt={candidate.name} className="w-12 h-12 rounded-full object-cover border-2 border-primary/20" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors truncate">{candidate.name}</h3>
                    <p className="text-[10px] md:text-[11px] font-medium text-on-surface-variant uppercase tracking-wider truncate">{candidate.role}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:contents">
                  {/* AI Match Score */}
                  <div className="md:w-1/6 flex flex-col items-start gap-0.5">
                    <div className={cn(
                      "flex items-center gap-1.5",
                      candidate.matchScore >= 90 ? "text-emerald-600" : candidate.matchScore >= 70 ? "text-secondary" : "text-red-500"
                    )}>
                      <Sparkles size={16} fill="currentColor" className="opacity-80" />
                      <span className="text-lg md:text-xl font-black">{candidate.matchScore}%</span>
                    </div>
                    <button className="text-[8px] md:text-[9px] font-black text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest flex items-center gap-1">
                      Reasoning
                      <ArrowUpRight size={10} />
                    </button>
                  </div>

                  {/* Date - Hidden on small mobile, shown on tablet/desktop */}
                  <div className="hidden sm:block md:w-1/6">
                    <p className="text-xs font-bold text-on-surface-variant">{candidate.appliedDate}</p>
                  </div>

                  {/* Status */}
                  <div className="md:w-1/6 text-right md:text-left">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border whitespace-nowrap",
                      candidate.status === 'Technical Interview' ? "bg-primary/5 text-primary border-primary/10" :
                      candidate.status === 'Screening' ? "bg-secondary/5 text-secondary border-secondary/10" :
                      "bg-red-500/5 text-red-600 border-red-500/10"
                    )}>
                      {candidate.status}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 md:transform md:translate-x-4 md:group-hover:translate-x-0 border-t md:border-t-0 pt-3 md:pt-0 border-outline-variant/5">
                  <button className="p-2.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-xl transition-all" title="Message">
                    <MessageSquare size={18} />
                  </button>
                  <button className="p-2.5 text-on-surface-variant hover:text-secondary hover:bg-secondary/10 rounded-xl transition-all" title="Schedule">
                    <Calendar size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          {/* AI Top Picks */}
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
            
            <div className="flex items-center gap-2 mb-6 relative z-10">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Sparkles size={16} />
              </div>
              <h3 className="text-lg font-black text-on-surface">AI Top Picks</h3>
            </div>

            <p className="text-xs font-medium text-on-surface-variant mb-6 leading-relaxed relative z-10">
              Based on current pipeline requirements and role complexity.
            </p>

            <div className="space-y-3 relative z-10">
              {topPicks.map(pick => (
                <div key={pick.id} className="bg-white/50 hover:bg-white/80 rounded-2xl p-4 flex items-center gap-4 border border-white/60 shadow-sm cursor-pointer hover:border-primary/20 transition-all group">
                  <img src={pick.avatar} alt={pick.name} className="w-10 h-10 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  <div className="flex-1">
                    <p className="text-sm font-black text-on-surface">{pick.name}</p>
                    <p className="text-[9px] font-black text-primary mt-1 uppercase tracking-widest">{pick.tag}</p>
                  </div>
                  <ChevronRight size={16} className="text-on-surface-variant group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-3 bg-surface-container hover:bg-surface-container-high rounded-xl text-[10px] font-black uppercase tracking-widest text-on-surface-variant transition-all">
              View All Picks
            </button>
          </div>

          {/* Hiring Progress Widget */}
          <div className="glass-card rounded-3xl p-6">
            <h4 className="text-sm font-black text-on-surface mb-6 uppercase tracking-widest">Hiring Progress</h4>
            <div className="space-y-5">
              {[
                { label: 'Screening', count: 42, color: 'bg-primary' },
                { label: 'Technical', count: 18, color: 'bg-secondary' },
                { label: 'Cultural', count: 12, color: 'bg-tertiary' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                    <span className="text-on-surface-variant">{item.label}</span>
                    <span className="text-on-surface">{item.count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.count / 124) * 100}%` }}
                      className={cn("h-full rounded-full", item.color)} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterApplicationsView;
