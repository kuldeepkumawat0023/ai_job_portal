'use client';

import React from 'react';
import Link from 'next/link';
import {
  Filter,
  Plus,
  Zap,
  Clock,
  TrendingUp,
  Calendar,
  BrainCircuit,
  Archive,
  Sparkles,
  CheckSquare
} from 'lucide-react';

const ApplicationsView = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-on-surface dark:text-foreground mb-2 tracking-tight">My Applications</h1>
          <p className="text-lg text-on-surface-variant dark:text-muted-foreground">Track and manage your active job opportunities.</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-surface-container dark:bg-surface-container-high px-4 py-2 rounded-full font-medium text-sm text-on-surface dark:text-foreground flex items-center gap-2 hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors border border-outline-variant/30">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <Link href="/candidate/applications/new" className="bg-gradient-to-r from-primary to-secondary text-white px-5 py-2 rounded-full font-medium text-sm shadow-sm hover:shadow-md transition-all hover:scale-[1.02] flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Application
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Kanban Board (Spans 9 cols) */}
        <div className="xl:col-span-9 flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-outline-variant scrollbar-track-transparent">

          {/* Applied Column */}
          <div className="flex-none w-80 flex flex-col gap-4">
            <div className="flex items-center justify-between px-2 mb-2">
              <h3 className="text-xl font-bold text-on-surface dark:text-foreground flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-outline dark:bg-outline-variant"></span>
                Applied
              </h3>
              <span className="text-xs font-bold bg-surface-container dark:bg-surface-container-high text-on-surface-variant dark:text-muted-foreground px-2 py-1 rounded-full">2</span>
            </div>

            {/* Card 1 */}
            <div className="bg-surface-container-lowest dark:bg-surface-container-high/40 backdrop-blur-xl rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-outline-variant/30 group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center border border-blue-200/50 dark:border-blue-500/20 overflow-hidden group-hover:scale-105 transition-transform">
                  <div className="w-6 h-6 bg-blue-500 rounded-md"></div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-200/50 dark:border-emerald-500/20">
                  <Zap className="w-3 h-3" />
                  92% Match
                </span>
              </div>
              <h4 className="text-lg font-bold text-on-surface dark:text-foreground mb-1 leading-tight group-hover:text-primary transition-colors">Senior Product Designer</h4>
              <p className="text-sm text-on-surface-variant dark:text-muted-foreground mb-5">Lumina Tech • Remote</p>
              <div className="flex justify-between items-center border-t border-outline-variant/10 pt-4">
                <span className="text-[11px] font-bold uppercase tracking-widest text-outline dark:text-muted-foreground flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  2d ago
                </span>
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full border-2 border-surface-container-lowest dark:border-surface-container-high bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">SJ</div>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-surface-container-lowest dark:bg-surface-container-high/40 backdrop-blur-xl rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-outline-variant/30 group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center border border-purple-200/50 dark:border-purple-500/20 overflow-hidden group-hover:scale-105 transition-transform">
                  <div className="w-6 h-6 bg-purple-500 rounded-md"></div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2.5 py-1 rounded-full flex items-center gap-1 border border-orange-200/50 dark:border-orange-500/20">
                  <TrendingUp className="w-3 h-3" />
                  85% Match
                </span>
              </div>
              <h4 className="text-lg font-bold text-on-surface dark:text-foreground mb-1 leading-tight group-hover:text-primary transition-colors">UX Lead</h4>
              <p className="text-sm text-on-surface-variant dark:text-muted-foreground mb-5">Nexus Systems • San Francisco</p>
              <div className="flex justify-between items-center border-t border-outline-variant/10 pt-4">
                <span className="text-[11px] font-bold uppercase tracking-widest text-outline dark:text-muted-foreground flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  5d ago
                </span>
              </div>
            </div>
          </div>

          {/* Interviewing Column */}
          <div className="flex-none w-80 flex flex-col gap-4">
            <div className="flex items-center justify-between px-2 mb-2">
              <h3 className="text-xl font-bold text-on-surface dark:text-foreground flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary animate-pulse"></span>
                Interviewing
              </h3>
              <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded-full">1</span>
            </div>

            {/* Card 3 */}
            <div className="bg-surface-container-lowest dark:bg-surface-container-high/40 backdrop-blur-xl rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-2 border-primary/30 relative overflow-hidden group shadow-lg shadow-primary/5">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center border border-emerald-200/50 dark:border-emerald-500/20 overflow-hidden group-hover:scale-105 transition-transform">
                  <div className="w-6 h-6 bg-emerald-500 rounded-md"></div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary px-2.5 py-1 rounded-full flex items-center gap-1 border border-primary/20">
                  <Zap className="w-3 h-3" />
                  98% Match
                </span>
              </div>
              <h4 className="text-lg font-bold text-on-surface dark:text-foreground mb-1 leading-tight group-hover:text-primary transition-colors">Staff UI Engineer</h4>
              <p className="text-sm text-on-surface-variant dark:text-muted-foreground mb-4">FinServe • New York (Hybrid)</p>

              <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-3 mb-4 border border-primary/20">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1.5 opacity-80">Next Step</p>
                <p className="text-[13px] text-on-surface dark:text-foreground font-bold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Tech Screen: Tomorrow, 2 PM
                </p>
              </div>

              <div className="flex justify-between items-center border-t border-outline-variant/10 pt-4">
                <span className="text-[11px] font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
                  <BrainCircuit className="w-4 h-4 animate-pulse" />
                  AI Prep Ready
                </span>
              </div>
            </div>
          </div>

          {/* Offer Column */}
          <div className="flex-none w-80 flex flex-col gap-4">
            <div className="flex items-center justify-between px-2 mb-2">
              <h3 className="text-xl font-bold text-on-surface dark:text-foreground flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-secondary"></span>
                Offer
              </h3>
              <span className="text-xs font-bold bg-secondary/10 text-secondary px-2 py-1 rounded-full">0</span>
            </div>

            <div className="border-2 border-dashed border-outline-variant/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center h-48 opacity-40 bg-surface-container-lowest/30 dark:bg-transparent">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-3">
                <Archive className="w-6 h-6 text-outline" />
              </div>
              <p className="text-sm text-on-surface-variant dark:text-muted-foreground font-bold uppercase tracking-widest">No offers yet</p>
            </div>
          </div>

        </div>

        {/* Secondary Panel (Spans 3 cols) */}
        <div className="xl:col-span-3 flex flex-col gap-6">

          {/* AI Insights Bento Box */}
          <div className="bg-surface-container-lowest dark:bg-surface-container-high/40 backdrop-blur-xl rounded-3xl p-6 relative overflow-hidden border border-outline-variant/30 shadow-lg group">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-secondary/20 dark:bg-secondary/10 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-primary/20 dark:bg-primary/10 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tight">AI Insights</h3>
              </div>

              <div className="space-y-4">
                <div className="bg-white/40 dark:bg-white/5 rounded-2xl p-4 border border-white/20 dark:border-white/5 hover:bg-white/60 dark:hover:bg-white/10 transition-all cursor-pointer shadow-sm group/item">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">Action Required</p>
                  <p className="text-sm text-on-surface dark:text-foreground font-medium leading-relaxed group-hover/item:text-primary transition-colors">Review Lumina Tech's recent series B funding before your technical screen.</p>
                </div>
                <div className="bg-white/40 dark:bg-white/5 rounded-2xl p-4 border border-white/20 dark:border-white/5 hover:bg-white/60 dark:hover:bg-white/10 transition-all cursor-pointer shadow-sm group/item">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Skill Gap Alert</p>
                  <p className="text-sm text-on-surface dark:text-foreground font-medium leading-relaxed group-hover/item:text-primary transition-colors">Nexus Systems looks for 'Figma Prototyping'. Add relevant examples.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-surface-container-lowest dark:bg-surface-container-high/40 backdrop-blur-xl rounded-3xl p-6 border border-outline-variant/30 shadow-lg">
            <h3 className="text-xl font-bold text-on-surface dark:text-foreground mb-6 flex items-center gap-3 tracking-tight">
              <CheckSquare className="w-6 h-6 text-primary" />
              Tasks
            </h3>

            <ul className="space-y-4">
              <li className="flex items-start gap-4 group cursor-pointer">
                <div className="mt-1 w-5 h-5 rounded-md border-2 border-outline dark:border-outline-variant flex items-center justify-center group-hover:border-primary transition-all group-hover:scale-110">
                </div>
                <div className="flex-1">
                  <p className="text-sm text-on-surface dark:text-foreground font-bold leading-none">Complete Assessment</p>
                  <p className="text-[10px] font-bold text-red-500 dark:text-red-400 mt-1 uppercase tracking-widest">Due Today</p>
                </div>
              </li>
              <li className="flex items-start gap-4 group cursor-pointer">
                <div className="mt-1 w-5 h-5 rounded-md border-2 border-outline dark:border-outline-variant flex items-center justify-center group-hover:border-primary transition-all group-hover:scale-110">
                </div>
                <div className="flex-1">
                  <p className="text-sm text-on-surface dark:text-foreground font-bold leading-none">Schedule HR Interview</p>
                  <p className="text-[10px] font-bold text-on-surface-variant dark:text-muted-foreground mt-1 uppercase tracking-widest">FinServe</p>
                </div>
              </li>
            </ul>

            <button className="w-full mt-6 py-3 text-xs font-bold uppercase tracking-widest text-primary bg-primary/5 hover:bg-primary/10 rounded-xl transition-all active:scale-95">
              View All Tasks
            </button>
          </div>

          {/* Career Guide Banner */}
          <div className="rounded-3xl overflow-hidden relative h-40 group border border-outline-variant/30 cursor-pointer shadow-lg shadow-primary/5">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1)_0%,transparent_70%)]"></div>
            <div className="absolute inset-0 flex flex-col justify-end p-5 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/80 mb-1">Career Guide</p>
              <h4 className="text-lg font-bold text-white leading-tight">Ace the Technical Interview</h4>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ApplicationsView;
