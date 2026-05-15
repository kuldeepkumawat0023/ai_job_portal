'use client';

import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  PhoneOff, 
  Bot, 
  Mic, 
  Video, 
  ClosedCaption,
  Activity,
  CheckCircle2,
  BrainCircuit,
  ListTodo,
  Upload,
  FileText,
  Trophy,
  Target,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Zap
} from 'lucide-react';

type InterviewStep = 'UPLOAD' | 'ANALYZING' | 'INTERVIEW' | 'RESULTS';

const MockInterviewView = () => {
  const [step, setStep] = useState<InterviewStep>('UPLOAD');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Timer logic for INTERVIEW step
  useEffect(() => {
    if (step === 'INTERVIEW') {
      const initialTime = Math.floor(Math.random() * (900 - 600 + 1)) + 600;
      setTimeLeft(initialTime);

      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step]);

  // Simulated analysis logic
  useEffect(() => {
    if (step === 'ANALYZING') {
      const interval = setInterval(() => {
        setAnalysisProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep('INTERVIEW'), 1000);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [step]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleStartAnalysis = () => {
    setStep('ANALYZING');
    setAnalysisProgress(0);
  };

  const renderUploadStep = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto text-center space-y-8">
      <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-4">
        <Upload className="w-10 h-10 text-primary" />
      </div>
      <div className="space-y-4">
        <h2 className="text-4xl font-bold text-on-background">Prep for your Dream Job</h2>
        <p className="text-on-surface-variant text-lg">
          Upload your resume and our AI will analyze your experience to conduct a personalized 15-minute mock interview.
        </p>
      </div>

      <div className="w-full p-10 border-2 border-dashed border-outline-variant/30 rounded-3xl bg-surface-container-lowest/50 backdrop-blur-xl hover:border-primary/50 transition-all group cursor-pointer">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-2xl bg-surface-container group-hover:bg-primary/10 transition-colors">
            <FileText className="w-8 h-8 text-on-surface-variant group-hover:text-primary transition-colors" />
          </div>
          <div className="space-y-1">
            <p className="font-bold text-on-surface">Click to upload or drag and drop</p>
            <p className="text-sm text-on-surface-variant">PDF, DOCX or TXT (Max 5MB)</p>
          </div>
        </div>
      </div>

      <button 
        onClick={handleStartAnalysis}
        className="gradient-button text-white px-10 py-4 rounded-2xl font-bold shadow-lg flex items-center gap-3 text-lg hover:scale-[1.02] transition-all"
      >
        <BrainCircuit className="w-6 h-6" />
        Analyze & Start Interview
      </button>

      <div className="flex gap-8 pt-8">
        <div className="flex items-center gap-2 text-sm text-on-surface-variant font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Secure & Private
        </div>
        <div className="flex items-center gap-2 text-sm text-on-surface-variant font-medium">
          <Sparkles className="w-4 h-4 text-primary" />
          AI-Tailored Questions
        </div>
      </div>
    </div>
  );

  const renderAnalyzingStep = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-10">
      <div className="relative">
        <div className="w-48 h-48 rounded-full border-4 border-primary/10 flex items-center justify-center overflow-hidden">
          <div 
            className="absolute bottom-0 w-full bg-primary/20 transition-all duration-300"
            style={{ height: `${analysisProgress}%` }}
          />
          <BrainCircuit className="w-20 h-20 text-primary animate-pulse z-10" />
        </div>
        <div className="absolute -top-4 -right-4 bg-surface rounded-2xl p-3 shadow-xl border border-outline-variant/20 animate-bounce">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
      </div>

      <div className="text-center space-y-4 max-w-md">
        <h3 className="text-2xl font-bold text-on-background">Aria is analyzing your resume</h3>
        <p className="text-on-surface-variant font-medium">
          {analysisProgress < 30 && "Extracting key technical skills..."}
          {analysisProgress >= 30 && analysisProgress < 60 && "Mapping experience to industry standards..."}
          {analysisProgress >= 60 && analysisProgress < 90 && "Generating personalized interview questions..."}
          {analysisProgress >= 90 && "Ready to start the session!"}
        </p>
        <div className="w-full bg-surface-container rounded-full h-2 mt-6 overflow-hidden">
          <div 
            className="bg-primary h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(70,72,212,0.5)]" 
            style={{ width: `${analysisProgress}%` }}
          />
        </div>
      </div>
    </div>
  );

  const renderInterviewStep = () => (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 rounded-full bg-error/10 text-error text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 border border-error/20">
              <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
              LIVE SESSION
            </span>
            <span className="text-primary font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              Tailored for Senior Full-Stack Developer Role
            </span>
          </div>
          <h2 className="text-3xl font-bold text-on-background mb-1">Mock Interview</h2>
          <p className="text-on-surface-variant">Practicing with Aria, your AI Career Coach</p>
        </div>
        
        <div className="flex gap-4">
          <button className="glass-card px-4 py-2 rounded-xl text-sm font-medium text-on-surface hover:bg-surface-variant/50 transition-colors flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-primary" />
            Request Hint
          </button>
          <button 
            onClick={() => setStep('RESULTS')}
            className="bg-error text-white px-6 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-error/90 transition-colors flex items-center gap-2"
          >
            <PhoneOff className="w-4 h-4" />
            End Interview
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Video Feed Area (Left - 8 cols) */}
        <div className="col-span-1 lg:col-span-8 flex flex-col gap-6">
          
          {/* AI Interviewer Video Card */}
          <div className="glass-card rounded-2xl overflow-hidden relative group aspect-video shadow-sm border border-white/10 dark:border-white/5">
            <img 
              alt="Aria AI Coach" 
              className="w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200&h=800" 
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
            
            {/* Top left labels */}
            <div className="absolute top-4 left-4 flex gap-2">
              <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl px-3 py-1.5 flex items-center gap-2 text-white shadow-lg">
                <Bot className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Aria - AI Coach</span>
              </div>
            </div>

            {/* Real-time Transcription Overlay (Bottom) */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl">
              <p className="text-white mb-3 font-medium leading-relaxed">
                "Given your background in scaling microservices, how would you approach debugging a distributed system where a single request fails intermittently across different services?"
              </p>
              <div className="flex items-center gap-3">
                <div className="flex gap-1 items-end h-4">
                  <div className="w-1.5 h-3 bg-primary rounded-full animate-[bounce_1s_infinite]"></div>
                  <div className="w-1.5 h-4 bg-primary rounded-full animate-[bounce_1.2s_infinite]"></div>
                  <div className="w-1.5 h-2 bg-primary rounded-full animate-[bounce_0.8s_infinite]"></div>
                </div>
                <span className="text-[10px] font-bold text-primary tracking-widest uppercase">
                  ARIA IS LISTENING...
                </span>
              </div>
            </div>
          </div>

          {/* User Camera Feed & Controls */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-48 h-32 rounded-2xl overflow-hidden border-2 border-primary/30 relative shrink-0 shadow-sm">
              <img 
                alt="User Feed" 
                className="w-full h-full object-cover" 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=300" 
              />
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm rounded px-2 py-0.5 border border-white/10">
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">You</span>
              </div>
            </div>

            <div className="flex-1 glass-card rounded-2xl p-4 flex items-center justify-between">
              <div className="flex gap-3">
                <button className="w-12 h-12 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors flex items-center justify-center text-on-surface">
                  <Mic className="w-5 h-5" />
                </button>
                <button className="w-12 h-12 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors flex items-center justify-center text-on-surface">
                  <Video className="w-5 h-5" />
                </button>
                <button className="w-12 h-12 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors flex items-center justify-center text-on-surface">
                  <ClosedCaption className="w-5 h-5" />
                </button>
              </div>
              
              <div className="text-center px-4 border-l border-outline-variant/30">
                <span className="block text-2xl font-bold text-on-surface tabular-nums">
                  {isClient ? formatTime(timeLeft) : '--:--'}
                </span>
                <span className="text-[10px] font-bold text-outline uppercase tracking-widest">
                  SESSION TIME
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
          <div className="glass-card rounded-2xl p-6 flex-1 border border-white/10 dark:border-white/5 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-on-surface">Live Metrics</h3>
              <Activity className="w-5 h-5 text-primary" />
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-on-surface-variant font-medium">Sentiment Analysis</span>
                  <span className="text-sm font-bold text-primary">Confident</span>
                </div>
                <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-secondary w-[85%] rounded-full"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-on-surface-variant font-medium">Speaking Pace</span>
                  <span className="text-sm font-bold text-tertiary">145 WPM</span>
                </div>
                <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden relative">
                  <div className="h-full bg-tertiary w-[60%] rounded-full absolute left-[20%]"></div>
                </div>
                <p className="text-[10px] font-bold text-outline mt-2 text-right uppercase tracking-widest">Optimal Range: 130-160</p>
              </div>
              
              <div className="pt-4 border-t border-outline-variant/20">
                <span className="text-sm font-medium text-on-surface-variant block mb-3">Matched Resume Skills</span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Microservices
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Node.js
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
                    Distributed Systems
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 dark:border-white/5 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-on-surface">Interview Framework</h3>
              <ListTodo className="w-5 h-5 text-outline" />
            </div>
            
            <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-[11px] before:w-0.5 before:bg-surface-container-highest">
              <div className="flex items-start gap-4 relative">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 z-10 border-2 border-background shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="pb-2">
                  <h4 className="text-sm font-medium text-outline line-through">Introduction</h4>
                </div>
              </div>
              <div className="flex items-start gap-4 relative">
                <div className="w-6 h-6 rounded-full bg-background border-2 border-primary flex items-center justify-center shrink-0 z-10 shadow-[0_0_10px_rgba(70,72,212,0.3)]">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <div className="pb-2">
                  <h4 className="text-sm font-bold text-primary">Technical: Distributed Systems</h4>
                </div>
              </div>
              <div className="flex items-start gap-4 relative">
                <div className="w-6 h-6 rounded-full bg-background border-2 border-surface-container-highest shrink-0 z-10"></div>
                <div className="pb-2">
                  <h4 className="text-sm font-medium text-outline">System Design Case Study</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderResultsStep = () => (
    <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in duration-500">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl mx-auto flex items-center justify-center border border-emerald-200">
          <Trophy className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-bold text-on-background">Interview Complete!</h2>
        <p className="text-on-surface-variant text-lg">Great job, Alex! You showed high proficiency in your technical domain.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 text-center border border-emerald-500/20 bg-emerald-500/5">
          <div className="text-4xl font-black text-emerald-600 mb-1">88%</div>
          <p className="text-xs font-bold text-outline uppercase tracking-widest">Confidence Score</p>
        </div>
        <div className="glass-card rounded-2xl p-6 text-center border border-primary/20 bg-primary/5">
          <div className="text-4xl font-black text-primary mb-1">15m</div>
          <p className="text-xs font-bold text-outline uppercase tracking-widest">Duration</p>
        </div>
        <div className="glass-card rounded-2xl p-6 text-center border border-secondary/20 bg-secondary/5">
          <div className="text-4xl font-black text-secondary mb-1">9/10</div>
          <p className="text-xs font-bold text-outline uppercase tracking-widest">Keyword Accuracy</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-bold text-on-surface flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" /> Key Strengths
          </h3>
          <ul className="space-y-4">
            {[
              "Strong understanding of microservices orchestration.",
              "Excellent clarity while explaining complex technical trade-offs.",
              "Great usage of STAR method in behavioral questions."
            ].map((s, i) => (
              <li key={i} className="flex gap-3 text-sm text-on-surface-variant leading-relaxed">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card rounded-2xl p-8 space-y-6">
          <h3 className="text-xl font-bold text-on-surface flex items-center gap-2">
            <Zap className="w-5 h-5 text-secondary" /> Areas for Improvement
          </h3>
          <ul className="space-y-4">
            {[
              "Try to keep system design answers more structured under constraints.",
              "Could provide more specific examples of stakeholder conflict.",
              "Speaking pace was slightly high during technical explanation."
            ].map((s, i) => (
              <li key={i} className="flex gap-3 text-sm text-on-surface-variant leading-relaxed">
                <ArrowRight className="w-5 h-5 text-secondary shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button 
          onClick={() => setStep('UPLOAD')}
          className="px-8 py-3 rounded-2xl border border-outline-variant text-on-surface font-bold hover:bg-surface-container transition-all"
        >
          Try Another Session
        </button>
        <button className="gradient-button text-white px-8 py-3 rounded-2xl font-bold shadow-lg flex items-center gap-2">
          Download Detailed Report <FileText className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {step === 'UPLOAD' && renderUploadStep()}
      {step === 'ANALYZING' && renderAnalyzingStep()}
      {step === 'INTERVIEW' && renderInterviewStep()}
      {step === 'RESULTS' && renderResultsStep()}
    </div>
  );
};

export default MockInterviewView;
