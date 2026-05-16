'use client';

import React, { useState, useEffect } from 'react';
import {
  Bolt,
  TrendingUp,
  ArrowRight,
  Users,
  UserPlus,
  Radar,
  FileText,
  Mic,
  Play,
  Sparkles,
  Loader2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { aiService } from '@/lib/services/ai.services';
import { toast } from 'react-hot-toast';

const AISuggestionsView = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await aiService.getCareerSuggestions();
        if (response.success) {
          setData(response.data);
        } else {
          setError(response.message || 'Failed to fetch suggestions');
        }
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
        toast.error('Failed to load career insights');
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-on-surface-variant font-medium animate-pulse">Analyzing your professional profile...</p>
      </div>
    );
  }

  if (error) {
    const isNoResume = error.toLowerCase().includes('resume');
    
    return (
      <div className="w-full max-w-2xl mx-auto mt-20 p-12 glass-card border-outline-variant/30 rounded-[48px] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none"></div>
        
        {isNoResume ? (
          <>
            <div className="w-24 h-24 bg-primary/10 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner">
              <FileText className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-3xl font-black text-on-surface mb-4">Resume Required</h3>
            <p className="text-on-surface-variant text-lg mb-10 leading-relaxed">
              To provide personalized career insights, our AI needs to analyze your background first.
            </p>
            <Link href="/candidate/resume-analysis">
              <button className="gradient-button text-white px-10 py-4 rounded-2xl font-black text-sm flex items-center gap-3 mx-auto hover:shadow-2xl hover:shadow-primary/30 transition-all active:scale-95">
                Upload Resume Now
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </>
        ) : (
          <>
            <AlertCircle className="w-16 h-16 text-error mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-on-surface mb-2 tracking-tight">Oops! Connection Issue</h3>
            <p className="text-on-surface-variant mb-8 font-medium">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-on-surface text-surface-container-lowest px-10 py-4 rounded-2xl font-black text-sm hover:bg-primary hover:text-white transition-all"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20 px-4 md:px-0">
      {/* Header Section */}
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-black text-on-surface mb-3 tracking-tight leading-tight">AI Career Cockpit</h1>
        <p className="text-base md:text-xl text-on-surface-variant font-medium max-w-2xl">Intelligent recommendations to accelerate your professional growth.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">

        {/* Left Column: Priority Recommendations */}
        <div className="lg:col-span-8 flex flex-col gap-6 md:gap-8">
          <h2 className="text-xl md:text-2xl font-black text-on-surface flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Bolt className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            Priority Actions
          </h2>

          {data?.priorityActions?.map((action: any, index: number) => (
            <div 
              key={index}
              className="glass-card rounded-[32px] p-6 md:p-10 relative overflow-hidden group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 border border-outline-variant/30 hover:border-primary/30"
            >
              <div className={cn(
                "absolute top-0 left-0 w-1.5 h-full transition-all duration-500",
                index === 0 ? "bg-primary" : "bg-secondary"
              )}></div>

              <div className="flex flex-col md:flex-row justify-between items-start gap-6 md:gap-10 mb-8">
                <div className="flex-1 order-2 md:order-1">
                  <span className={cn(
                    "inline-flex items-center gap-2 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-black px-4 py-1.5 rounded-full mb-4 border",
                    index === 0 ? "text-primary bg-primary/10 border-primary/20" : "text-secondary bg-secondary/10 border-secondary/20"
                  )}>
                    <TrendingUp className="w-3.5 h-3.5" /> {action.type}
                  </span>
                  <h3 className="text-xl md:text-3xl font-black text-on-surface mb-3 group-hover:text-primary transition-colors leading-tight">{action.title}</h3>
                  <p className="text-on-surface-variant leading-relaxed text-sm md:text-base font-medium">{action.description}</p>
                </div>
                {action.image && (
                  <div className="relative group/img order-1 md:order-2 w-full md:w-auto">
                    <img
                      alt={action.title}
                      className="w-full h-48 md:w-48 md:h-48 rounded-[24px] md:rounded-[32px] object-cover shadow-2xl border-4 border-white/5 grayscale group-hover/img:grayscale-0 transition-all duration-500"
                      src={action.image}
                    />
                    <div className="absolute inset-0 rounded-[24px] md:rounded-[32px] bg-primary/10 opacity-0 group-hover/img:opacity-100 transition-opacity"></div>
                  </div>
                )}
              </div>

              <div className="bg-surface-container/30 rounded-2xl p-5 md:p-8 mb-8 border border-outline-variant/20 flex gap-4 items-start group-hover:bg-primary/5 transition-colors">
                <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] md:text-xs text-on-surface font-black uppercase tracking-widest mb-1.5">Why this helps:</p>
                  <p className="text-sm md:text-base text-on-surface-variant leading-relaxed font-medium">{action.reason}</p>
                </div>
              </div>

              <Link href={action.actionLink || '#'}>
                <button className="w-full md:w-fit gradient-button text-white font-black text-sm px-8 py-4 md:py-5 rounded-2xl flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95">
                  {action.actionText}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          ))}

          {(!data?.priorityActions || data.priorityActions.length === 0) && (
            <div className="p-12 md:p-20 text-center glass-card rounded-[32px] border-dashed border-2 border-outline-variant/30">
              <Sparkles className="w-12 h-12 text-primary/30 mx-auto mb-4" />
              <p className="text-on-surface-variant font-bold text-lg">No priority actions identified yet. Keep updating your profile!</p>
            </div>
          )}
        </div>

        {/* Right Column: Insights & Simulation */}
        <div className="lg:col-span-4 flex flex-col gap-6 md:gap-10">

          {/* Skill Gap Analysis */}
          <div className="glass-card rounded-[32px] p-6 md:p-10 border border-outline-variant/30 shadow-xl shadow-surface-container/50">
            <h3 className="text-xl md:text-2xl font-black text-on-surface mb-8 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-outline/10 text-outline">
                <Radar className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              Skill Radar
            </h3>

            <div className="mb-6">
              <div className="relative w-full aspect-square rounded-[32px] border border-outline-variant/20 mb-8 overflow-hidden bg-surface-container/20 flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
                
                {/* Visual Radar Mock */}
                <div className="relative w-32 h-32 md:w-48 md:h-48 flex items-center justify-center">
                  <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-[ping_3s_linear_infinite]"></div>
                  <div className="absolute inset-4 border-2 border-secondary/20 rounded-full animate-[ping_4s_linear_infinite_reverse]"></div>
                  <div className="absolute inset-8 border-2 border-tertiary/20 rounded-full animate-[ping_5s_linear_infinite]"></div>
                  <div className="w-full h-full border border-outline-variant/30 rounded-full flex items-center justify-center">
                    <Radar className="w-8 h-8 md:w-12 md:h-12 text-primary opacity-50" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {data?.skillRadar?.map((skill: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center bg-surface-container/50 px-4 py-3 md:py-4 rounded-2xl border border-outline-variant/10 group hover:border-primary/30 transition-all">
                    <span className="text-sm font-bold text-on-surface-variant group-hover:text-on-surface">{skill.skill}</span>
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-full border shadow-sm",
                      skill.status === 'Strong' 
                        ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" 
                        : "text-amber-500 bg-amber-500/10 border-amber-500/20"
                    )}>
                      {skill.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interview Simulation */}
          <div className="glass-card rounded-[40px] p-6 md:p-10 bg-gradient-to-br from-surface to-primary/5 border-primary/20 shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700"></div>

            <h3 className="text-xl md:text-2xl font-black text-on-surface mb-4 flex items-center gap-3 relative z-10">
              <div className="p-2 rounded-xl bg-primary/20">
                <Mic className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              Prep Mode
            </h3>

            <p className="text-on-surface-variant mb-8 relative z-10 leading-relaxed font-semibold">
              Ready to ace your next round? Practice with roles like yours.
            </p>

            <div className="relative w-full aspect-video mb-8 rounded-[24px] md:rounded-3xl overflow-hidden border border-outline-variant/20 group-hover:border-primary/40 transition-all shadow-2xl">
              <img
                alt="Interview simulation preview"
                className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=300"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[4px] group-hover:backdrop-blur-none transition-all">
                <Link href="/candidate/aimock-interview">
                  <div className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center shadow-[0_0_30px_rgba(70,72,212,0.5)] hover:scale-110 transition-all cursor-pointer">
                    <Play className="w-6 h-6 ml-1" />
                  </div>
                </Link>
              </div>
            </div>

            <Link href="/candidate/aimock-interview" className="block relative z-10">
              <button className="w-full bg-on-surface text-surface-container-lowest font-black text-sm px-8 py-4 md:py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl hover:bg-primary hover:text-white transition-all">
                Start Mock Interview
              </button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

// Helper for conditional classes
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export default AISuggestionsView;
