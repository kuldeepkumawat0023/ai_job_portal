'use client';

import React, { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Sparkles, 
  Plus, 
  X, 
  ChevronRight, 
  CheckCircle2, 
  BrainCircuit,
  Eye,
  Save,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

const PostJobView = () => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const steps = [
    { id: 1, label: 'Role Details' },
    { id: 2, label: 'Requirements' },
    { id: 3, label: 'Compensation' }
  ];

  const handleAiGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Board</span>
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-6 py-2.5 glass-card rounded-xl text-xs font-bold text-on-surface-variant hover:text-on-surface transition-all"
          >
            <Eye size={18} />
            {showPreview ? 'Edit Mode' : 'Preview'}
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-surface-container hover:bg-surface-container-high rounded-xl text-xs font-bold text-on-surface transition-all">
            <Save size={18} />
            Save Draft
          </button>
        </div>
      </div>

      {/* Main Title */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full border border-primary/20">
          <Sparkles size={14} className="animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">AI Assisted Posting</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-on-surface tracking-tighter">Create a New <span className="gradient-text">Opportunity</span></h1>
        <p className="text-on-surface-variant font-medium">Define your role requirements and let AI help you find the perfect match.</p>
      </div>

      {/* Progress Stepper */}
      <div className="flex justify-center items-center gap-4 py-6">
        {steps.map((s, i) => (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center gap-2">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500",
                step === s.id ? "bg-primary text-white shadow-lg shadow-primary/20 ring-4 ring-primary/10" : 
                step > s.id ? "bg-emerald-500 text-white" : "bg-surface-container text-on-surface-variant"
              )}>
                {step > s.id ? <CheckCircle2 size={20} /> : s.id}
              </div>
              <span className={cn(
                "text-[9px] font-black uppercase tracking-widest",
                step === s.id ? "text-primary" : "text-on-surface-variant opacity-60"
              )}>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn(
                "w-12 md:w-20 h-0.5 rounded-full",
                step > s.id ? "bg-emerald-500" : "bg-outline-variant/20"
              )} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Form Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Input Section */}
        <div className="lg:col-span-7 space-y-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-card rounded-[2rem] p-8 md:p-10 border border-white/10 space-y-8"
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Job Title</label>
                    <div className="relative">
                      <Briefcase className="absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                      <input className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 pl-7 py-3 font-medium text-on-surface transition-all placeholder:text-on-surface-variant/30" placeholder="e.g. Senior Staff Frontend Engineer" type="text" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Department</label>
                      <select className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 py-3 font-medium text-on-surface transition-all">
                        <option>Engineering</option>
                        <option>Product</option>
                        <option>Design</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                        <input className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 pl-7 py-3 font-medium text-on-surface transition-all placeholder:text-on-surface-variant/30" placeholder="Remote or City" type="text" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Job Description</label>
                      <button 
                        onClick={handleAiGenerate}
                        disabled={isGenerating}
                        className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all disabled:opacity-50"
                      >
                        {isGenerating ? <Clock size={12} className="animate-spin" /> : <Sparkles size={12} />}
                        {isGenerating ? 'Generating...' : 'AI Refine'}
                      </button>
                    </div>
                    <textarea 
                      className="w-full bg-transparent border border-outline-variant/30 rounded-2xl p-6 font-medium text-on-surface focus:border-primary focus:ring-0 transition-all resize-none min-h-[200px] leading-relaxed"
                      placeholder="Describe the role, impact, and day-to-day responsibilities..."
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-card rounded-[2rem] p-8 md:p-10 border border-white/10 space-y-8"
              >
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Required Skills</label>
                    <div className="flex flex-wrap gap-2">
                      {['React', 'TypeScript', 'System Design'].map(skill => (
                        <span key={skill} className="px-4 py-2 bg-primary/5 text-primary rounded-xl text-xs font-bold border border-primary/10 flex items-center gap-2 group">
                          {skill}
                          <button className="hover:text-error transition-colors"><X size={14} /></button>
                        </span>
                      ))}
                      <button className="px-4 py-2 border-2 border-dashed border-outline-variant/30 text-on-surface-variant hover:border-primary hover:text-primary rounded-xl text-xs font-bold transition-all flex items-center gap-2">
                        <Plus size={14} /> Add Skill
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Experience Level</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {['Entry', 'Junior', 'Mid', 'Senior'].map(level => (
                        <button key={level} className={cn(
                          "py-4 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all",
                          level === 'Senior' ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "border-outline-variant/10 text-on-surface-variant hover:border-primary/40 hover:text-on-surface"
                        )}>
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-outline-variant/10">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-on-surface">AI Matching Threshold</p>
                        <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest">Only notify for candidates above:</p>
                      </div>
                      <span className="text-2xl font-black text-primary">85%</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[85%] rounded-full shadow-[0_0_12px_rgba(var(--primary-rgb),0.3)]" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-card rounded-[2rem] p-8 md:p-10 border border-white/10 space-y-8"
              >
                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Annual Salary Range</label>
                      <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                          <DollarSign className="absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
                          <input className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 pl-6 py-3 font-black text-lg text-on-surface transition-all" defaultValue="120,000" type="text" />
                        </div>
                        <span className="text-on-surface-variant font-black">to</span>
                        <div className="relative flex-1">
                          <DollarSign className="absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
                          <input className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 pl-6 py-3 font-black text-lg text-on-surface transition-all" defaultValue="180,000" type="text" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Currency</label>
                      <select className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 py-4 font-black text-sm text-on-surface transition-all">
                        <option>USD - United States Dollar</option>
                        <option>EUR - Euro</option>
                        <option>INR - Indian Rupee</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Perks & Benefits</label>
                    <div className="grid grid-cols-2 gap-4">
                      {['Health Insurance', 'Equity/Stock', 'Unlimited PTO', 'Home Office Stipend'].map(perk => (
                        <div key={perk} className="flex items-center gap-3 p-4 rounded-2xl bg-surface-container/30 border border-outline-variant/10 group cursor-pointer hover:bg-surface-container/50 transition-all">
                          <div className="w-5 h-5 rounded border-2 border-outline-variant group-hover:border-primary transition-colors flex items-center justify-center">
                            <CheckCircle2 size={12} className="text-primary scale-0 group-hover:scale-100 transition-transform" />
                          </div>
                          <span className="text-xs font-bold text-on-surface">{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <button 
              onClick={() => setStep(Math.max(1, step - 1))}
              className={cn(
                "px-8 py-4 font-black text-[10px] uppercase tracking-[0.2em] transition-all",
                step === 1 ? "opacity-0 pointer-events-none" : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              Previous Step
            </button>
            {step < 3 ? (
              <button 
                onClick={() => setStep(step + 1)}
                className="gradient-button text-white font-black text-[10px] uppercase tracking-[0.2em] px-10 py-4 rounded-2xl shadow-xl shadow-primary/20 flex items-center gap-3 group"
              >
                Continue
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button 
                className="gradient-button text-white font-black text-[10px] uppercase tracking-[0.2em] px-10 py-4 rounded-2xl shadow-xl shadow-primary/30 flex items-center gap-3"
              >
                Publish Posting
                <Sparkles size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Right: AI Analysis Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-[2rem] p-8 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
            
            <div className="flex items-center gap-3 mb-8 relative z-10">
              <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                <BrainCircuit size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-on-surface uppercase tracking-widest">Posting Health</h3>
                <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest opacity-60">Real-time AI Insights</p>
              </div>
            </div>

            <div className="space-y-8 relative z-10">
              <div className="space-y-4">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                  <span className="text-on-surface-variant">Market Competitiveness</span>
                  <span className="text-emerald-500">Strong</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[92%] rounded-full shadow-[0_0_12px_rgba(16,185,129,0.3)]" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-surface-container/50 border border-outline-variant/10 space-y-4">
                <p className="text-[11px] font-bold text-on-surface leading-relaxed">
                  <span className="text-primary font-black uppercase italic mr-1">AI Recommendation:</span> 
                  Your salary range is in the **top 10%** for this role. Expect a high volume of quality applicants.
                </p>
                <div className="h-px bg-outline-variant/10" />
                <p className="text-[11px] font-bold text-on-surface leading-relaxed">
                  <span className="text-secondary font-black uppercase italic mr-1">JD Tip:</span> 
                  Adding a "Day in the life" section could increase candidate conversion by **14%**.
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <h4 className="text-[10px] font-black text-on-surface uppercase tracking-widest opacity-40">Talent Pool Estimate</h4>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black text-on-surface">1.2k+</span>
                  <span className="text-[10px] font-bold text-emerald-500 uppercase mb-1.5 tracking-widest">Potential Matches</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJobView;
