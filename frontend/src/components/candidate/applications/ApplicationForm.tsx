'use client';

import React from 'react';
import Link from 'next/link';
import { 
  X, 
  Check, 
  BrainCircuit, 
  Lightbulb, 
  Bookmark, 
  ArrowRight 
} from 'lucide-react';

const ApplicationForm = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Base Gradient Background */}
      <div 
        className="fixed inset-0 pointer-events-none -z-20 opacity-50 dark:opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 15% 50%, rgba(70, 72, 212, 0.1), transparent 40%),
                            radial-gradient(circle at 85% 30%, rgba(129, 39, 207, 0.1), transparent 40%)`
        }}
      ></div>

      {/* Main Content */}
      <div className="flex flex-col gap-8">
        
        {/* Application Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-2 border border-primary/20">
            Application Portal
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-on-background dark:text-foreground tracking-tight">Apply for Senior Product Designer</h1>
          <p className="text-lg text-on-surface-variant dark:text-muted-foreground font-medium">Lumina Technologies • San Francisco, CA (Remote)</p>
        </div>

        {/* Glassmorphic Application Form Container */}
        <div className="bg-surface-container-lowest/90 dark:bg-surface-container-low/80 backdrop-blur-3xl border border-white/60 dark:border-white/5 shadow-2xl rounded-[2.5rem] p-8 md:p-14 flex flex-col gap-12 relative overflow-hidden border-t-white dark:border-t-white/10">
          
          {/* Subtle Decorative Element */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary/5 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
          
          {/* Progress Stepper */}
          <div className="relative w-full max-w-2xl mx-auto mb-4">
            {/* Background Line */}
            <div className="absolute top-1/2 left-0 w-full h-[3px] bg-surface-container-high dark:bg-surface-container-highest -translate-y-1/2 z-0 rounded-full"></div>
            {/* Active Progress Line (66% for Step 3) */}
            <div className="absolute top-1/2 left-0 w-[66%] h-[3px] bg-gradient-to-r from-primary to-secondary -translate-y-1/2 z-0 rounded-full transition-all duration-700 ease-in-out shadow-[0_0_10px_rgba(70,72,212,0.3)]"></div>
            
            <div className="flex justify-between relative z-10">
              {/* Step 1: Completed */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 border-2 border-white dark:border-zinc-800 transition-transform hover:scale-110">
                  <Check className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold tracking-widest text-primary hidden md:block">PERSONAL</span>
              </div>
              
              {/* Step 2: Completed */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 border-2 border-white dark:border-zinc-800 transition-transform hover:scale-110">
                  <Check className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold tracking-widest text-primary hidden md:block">EXPERIENCE</span>
              </div>
              
              {/* Step 3: Active */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 text-primary flex items-center justify-center shadow-xl border-4 border-primary transition-transform hover:scale-110">
                  <span className="text-sm font-bold">3</span>
                </div>
                <span className="text-[10px] font-bold tracking-widest text-primary hidden md:block underline decoration-2 underline-offset-8">AI SCREENING</span>
              </div>
              
              {/* Step 4: Pending */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container-high dark:bg-surface-container-highest text-on-surface-variant dark:text-muted-foreground flex items-center justify-center border-2 border-transparent">
                  <span className="text-sm font-bold">4</span>
                </div>
                <span className="text-[10px] font-bold tracking-widest text-on-surface-variant dark:text-muted-foreground hidden md:block">REVIEW</span>
              </div>
            </div>
          </div>
          
          <hr className="border-outline-variant/20" />
          
          {/* Step Content: AI Screening Questions */}
          <div className="flex flex-col gap-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary/10 to-primary/10 flex items-center justify-center text-secondary border border-secondary/20 shadow-inner">
                <BrainCircuit className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-on-background dark:text-foreground tracking-tight">Role-Specific Assessment</h2>
                <p className="text-base text-on-surface-variant dark:text-muted-foreground font-medium">Smart assessment powered by AI JobFit Analysis.</p>
              </div>
            </div>
            
            {/* AI Insight Banner */}
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 border border-primary/20 rounded-2xl p-6 flex items-start gap-4 shadow-sm group hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm flex-shrink-0 border border-primary/20">
                <Lightbulb className="w-5 h-5 text-primary animate-pulse" />
              </div>
              <p className="text-[15px] text-on-surface-variant dark:text-muted-foreground leading-relaxed">
                <span className="font-bold text-primary uppercase tracking-widest text-xs block mb-1">AI Recommendation</span> 
                Focus on your experience with **cross-functional collaboration** and resolving **design system conflicts**, as these are critical for this specific role at Lumina.
              </p>
            </div>
            
            <form className="space-y-10">
              {/* Question 1 */}
              <div className="space-y-4">
                <label className="text-lg font-bold text-on-background dark:text-foreground block tracking-tight">
                  1. Describe a time you had to advocate for a design decision that contradicted technical constraints.
                </label>
                <textarea 
                  className="w-full min-h-[160px] rounded-2xl bg-surface-container/30 dark:bg-white/[0.05] border border-outline-variant/30 dark:border-white/10 focus:bg-white dark:focus:bg-white/[0.08] focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all p-5 text-base text-on-background dark:text-foreground resize-y placeholder:text-on-surface-variant/50 dark:placeholder:text-muted-foreground/40 font-medium shadow-inner" 
                  placeholder="Detail the situation, your approach, and the outcome..."
                ></textarea>
              </div>
              
              {/* Question 2 */}
              <div className="space-y-4">
                <label className="text-lg font-bold text-on-background dark:text-foreground block tracking-tight">
                  2. How do you approach scaling a design system across multiple product lines?
                </label>
                <textarea 
                  className="w-full min-h-[160px] rounded-2xl bg-surface-container/30 dark:bg-white/[0.05] border border-outline-variant/30 dark:border-white/10 focus:bg-white dark:focus:bg-white/[0.08] focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all p-5 text-base text-on-background dark:text-foreground resize-y placeholder:text-on-surface-variant/50 dark:placeholder:text-muted-foreground/40 font-medium shadow-inner" 
                  placeholder="Explain your framework and past experiences..."
                ></textarea>
              </div>
              
              {/* Question 3 (Multiple Choice) */}
              <div className="space-y-5">
                <label className="text-lg font-bold text-on-background dark:text-foreground block tracking-tight">
                  3. Which tool is your primary instrument for high-fidelity interaction design?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['Figma', 'Protopie', 'Framer', 'Other (Code)'].map((tool) => (
                    <label key={tool} className="flex items-center gap-4 p-5 rounded-2xl border-2 border-outline-variant/20 dark:border-white/5 cursor-pointer hover:bg-surface-container dark:hover:bg-surface-container-high/40 transition-all hover:scale-[1.02] active:scale-95 group has-[:checked]:border-primary has-[:checked]:bg-primary/5 dark:has-[:checked]:bg-primary/10 shadow-sm">
                      <input className="text-primary focus:ring-primary w-5 h-5 border-outline dark:border-outline-variant" name="tool" type="radio" />
                      <span className="text-base font-bold text-on-surface dark:text-foreground group-hover:text-primary transition-colors">{tool}</span>
                    </label>
                  ))}
                </div>
              </div>
            </form>
          </div>
          
          {/* Action Area */}
          <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-6 pt-8 mt-4 border-t border-outline-variant/20">
            <button className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest text-on-surface-variant dark:text-muted-foreground hover:text-primary dark:hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-3 border border-transparent hover:border-primary/20 active:scale-95">
              <Bookmark className="w-5 h-5" />
              Save for Later
            </button>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Link href="/candidate/applications" className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest text-on-surface dark:text-foreground hover:bg-surface-container dark:hover:bg-surface-container-high transition-all border border-outline-variant/50 text-center active:scale-95">
                Back
              </Link>
              <button className="w-full sm:w-auto px-10 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest text-white bg-gradient-to-r from-primary to-secondary hover:shadow-xl hover:shadow-primary/25 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-primary/15">
                Next: Review
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
