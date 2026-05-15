'use client';

import React from 'react';
import {
  Bolt,
  TrendingUp,
  ArrowRight,
  Users,
  UserPlus,
  Radar,
  Mic,
  Play,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

const AISuggestionsView = () => {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-on-surface mb-2">AI Career Cockpit</h1>
        <p className="text-lg text-on-surface-variant">Intelligent recommendations to accelerate your professional growth.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Priority Recommendations */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-on-surface flex items-center gap-2">
            <Bolt className="w-6 h-6 text-primary" />
            Priority Actions
          </h2>

          {/* Suggestion Card 1 */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 border border-white/10 dark:border-white/5 shadow-sm">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>

            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-secondary bg-secondary/10 border border-secondary/20 px-2.5 py-1 rounded-lg mb-3">
                  <TrendingUp className="w-3.5 h-3.5" /> Skill Growth
                </span>
                <h3 className="text-2xl font-bold text-on-surface">Master Advanced React Hooks</h3>
              </div>
              <img
                alt="Tech visualization"
                className="w-20 h-20 rounded-xl object-cover shadow-sm border border-white/20 dark:border-white/10 shrink-0"
                src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=200&h=200"
              />
            </div>

            <div className="bg-surface-container rounded-xl p-4 mb-6 border border-outline-variant/20 flex gap-3 items-start">
              <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-on-surface font-bold mb-1">Why this helps:</p>
                <p className="text-sm text-on-surface-variant">78% of your 'Top Match' Senior Frontend roles explicitly require deep knowledge of custom hooks and performance optimization in React.</p>
              </div>
            </div>

            <button className="gradient-button text-white font-medium text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity w-fit shadow-md">
              View Recommended Courses
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Suggestion Card 2 */}
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 border border-white/10 dark:border-white/5 shadow-sm">
            <div className="absolute top-0 left-0 w-1 h-full bg-tertiary"></div>

            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-tertiary bg-tertiary/10 border border-tertiary/20 px-2.5 py-1 rounded-lg mb-3">
                  <Users className="w-3.5 h-3.5" /> Network Expansion
                </span>
                <h3 className="text-2xl font-bold text-on-surface">Connect with FinTech Engineers</h3>
              </div>
              <img
                alt="Network connections"
                className="w-20 h-20 rounded-xl object-cover shadow-sm border border-white/20 dark:border-white/10 shrink-0"
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=200&h=200"
              />
            </div>

            <div className="bg-surface-container rounded-xl p-4 mb-6 border border-outline-variant/20 flex gap-3 items-start">
              <Sparkles className="w-5 h-5 text-tertiary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-on-surface font-bold mb-1">Why this helps:</p>
                <p className="text-sm text-on-surface-variant">You've saved 5 roles at Stripe and Square. Expanding your network in this sector increases referral chances by 3x.</p>
              </div>
            </div>

            <button className="bg-transparent border border-outline-variant/50 text-on-surface font-medium text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-surface-container transition-colors w-fit">
              View Connection Suggestions
              <UserPlus className="w-4 h-4 text-tertiary" />
            </button>
          </div>

        </div>

        {/* Right Column: Insights & Simulation */}
        <div className="lg:col-span-4 flex flex-col gap-6">

          {/* Skill Gap Analysis */}
          <div className="glass-card rounded-2xl p-6 border border-white/10 dark:border-white/5 shadow-sm">
            <h3 className="text-2xl font-bold text-on-surface mb-4 flex items-center gap-2">
              <Radar className="w-5 h-5 text-outline" />
              Skill Radar
            </h3>

            <div className="mb-4">
              <div className="relative w-full h-40 rounded-xl border border-outline-variant/20 mb-4 overflow-hidden bg-surface-container flex items-center justify-center">
                {/* Simplified placeholder for a radar chart */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
                <div className="w-24 h-24 rounded-full border-2 border-primary/30 border-dashed animate-[spin_10s_linear_infinite]"></div>
                <div className="absolute w-16 h-16 rounded-full border-2 border-secondary/40 border-dotted animate-[spin_15s_linear_infinite_reverse]"></div>
                <Radar className="w-8 h-8 text-primary absolute opacity-50" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center bg-surface-container px-3 py-2 rounded-lg">
                  <span className="text-sm font-medium text-on-surface-variant">TypeScript</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-md border border-primary/20">Strong</span>
                </div>
                <div className="flex justify-between items-center bg-surface-container px-3 py-2 rounded-lg">
                  <span className="text-sm font-medium text-on-surface-variant">GraphQL</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-error bg-error/10 px-2 py-1 rounded-md border border-error/20">Gap Identified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interview Simulation */}
          <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-surface to-primary/5 border-primary/20 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors"></div>

            <h3 className="text-2xl font-bold text-on-surface mb-3 flex items-center gap-2 relative z-10">
              <Mic className="w-5 h-5 text-primary" />
              Prep Mode
            </h3>

            <p className="text-sm text-on-surface-variant mb-6 relative z-10 leading-relaxed">
              Your interview for 'Frontend Lead' at Vercel is likely soon based on typical timelines.
            </p>

            <div className="relative w-full h-32 mb-6 rounded-xl overflow-hidden border border-outline-variant/20 group-hover:border-primary/30 transition-colors shadow-inner">
              <img
                alt="Interview simulation preview"
                className="w-full h-full object-cover opacity-80"
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=300"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                <Link href="/candidate/aimock-interview">
                  <button className="h-12 w-12 rounded-full gradient-button text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-1" />
                  </button>
                </Link>
              </div>
            </div>

            <Link href="/candidate/aimock-interview" className="block relative z-10">
              <button className="w-full gradient-button text-white font-bold text-sm px-4 py-3 rounded-xl flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition-opacity">
                Start Mock Interview
              </button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AISuggestionsView;
