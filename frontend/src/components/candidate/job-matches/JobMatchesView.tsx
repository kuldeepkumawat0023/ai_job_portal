'use client';

import React from 'react';
import {
  Search,
  DollarSign,
  MapPin,
  Layers,
  ChevronDown,
  SlidersHorizontal,
  Sparkles,
  Clock,
  TrendingUp,
  BrainCircuit,
  Bookmark,
  Trash2,
  Code,
  Palette,
  Rocket
} from 'lucide-react';

const JobMatchesView = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-4xl font-bold text-on-surface tracking-tight mb-2">Job Matches</h2>
        <p className="text-lg text-on-surface-variant">AI-curated roles specifically for your profile.</p>
      </div>

      {/* Filters & Search */}
      <div className="glass-card rounded-[32px] p-4 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
          <input 
            className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:ring-0 text-base placeholder-on-surface-variant/50 outline-none" 
            placeholder="Job title, keywords, or company" 
            type="text"
          />
        </div>
        <div className="h-8 w-px bg-outline-variant/30 hidden md:block"></div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 rounded-full border border-outline-variant/50 flex items-center gap-2 hover:bg-surface-container-low transition-all">
            <DollarSign className="w-4 h-4 text-on-surface-variant" />
            <span className="text-sm font-medium">$120k - $180k</span>
            <ChevronDown className="w-4 h-4 text-on-surface-variant" />
          </button>
          <button className="px-4 py-2.5 rounded-full border border-outline-variant/50 flex items-center gap-2 hover:bg-surface-container-low transition-all">
            <MapPin className="w-4 h-4 text-on-surface-variant" />
            <span className="text-sm font-medium">Remote</span>
            <ChevronDown className="w-4 h-4 text-on-surface-variant" />
          </button>
          <button className="px-4 py-2.5 rounded-full border border-outline-variant/50 flex items-center gap-2 hover:bg-surface-container-low transition-all hidden lg:flex">
            <Layers className="w-4 h-4 text-on-surface-variant" />
            <span className="text-sm font-medium">Job Type</span>
            <ChevronDown className="w-4 h-4 text-on-surface-variant" />
          </button>
          <button className="p-2.5 rounded-full bg-primary-container text-on-primary-container hover:opacity-90 transition-opacity">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Featured & Grid */}
        <div className="lg:col-span-8 space-y-6">
          {/* Featured Match Hero */}
          <section className="glass-card rounded-[40px] p-6 overflow-hidden relative border-primary/20">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3 rounded-3xl overflow-hidden shadow-lg border border-white/40">
                <img className="w-full h-full object-cover min-h-[200px]" alt="Top AI Match" src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-sm backdrop-blur-md border border-white/20 mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-bold tracking-wide uppercase">98% AI Match</span>
                  </div>
                  <span className="text-xs text-secondary font-bold mb-1 block uppercase tracking-widest">Top AI Pick</span>
                  <h3 className="text-3xl font-bold text-on-surface">Senior Product Architect</h3>
                  <p className="text-lg text-on-surface-variant font-medium">Lumina Systems • <span className="text-primary">$175k - $210k</span></p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-lg bg-surface-container text-on-surface-variant text-xs border border-outline-variant/30 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> San Francisco, CA
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-surface-container text-on-surface-variant text-xs border border-outline-variant/30 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Full-time
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs border border-emerald-100 dark:border-emerald-800/50 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> High Growth
                  </span>
                </div>
                
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 relative">
                  <p className="text-xs text-primary font-bold mb-2 flex items-center gap-2 uppercase tracking-widest">
                    <BrainCircuit className="w-4 h-4" /> Why this fits you
                  </p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Your 6+ years in distributed systems aligns perfectly with Lumina's core infrastructure. The role requires experience with the exact technology stack mentioned in your profile (Rust, Go, Kubernetes).
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-4 pt-2">
                  <button className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-full font-medium shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">Apply Now</button>
                  <button className="px-8 py-3 rounded-full border border-outline-variant/50 font-medium hover:bg-surface-container-low transition-all text-on-surface">View Details</button>
                </div>
              </div>
            </div>
          </section>

          {/* Matches Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Card 1 */}
            <div className="glass-card rounded-[32px] p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform group">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center border border-outline-variant/20 overflow-hidden p-2">
                    <div className="w-full h-full bg-blue-500 rounded-md"></div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">92%</div>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant/60 tracking-tighter">Match Score</span>
                  </div>
                </div>
                <h4 className="text-xl font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">Staff Engineer</h4>
                <p className="text-base text-on-surface-variant mb-4">Quantom AI • Remote</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-2 py-0.5 rounded-md bg-secondary/5 text-secondary text-[11px] font-bold border border-secondary/10 uppercase">Machine Learning</span>
                  <span className="px-2 py-0.5 rounded-md bg-primary/5 text-primary text-[11px] font-bold border border-primary/10 uppercase">Series B</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
                <span className="text-base font-bold text-on-surface">$160k - $190k</span>
                <div className="flex gap-2">
                  <button className="p-2 rounded-full border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-all">
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-all">Details</button>
                </div>
              </div>
            </div>

            {/* Job Card 2 */}
            <div className="glass-card rounded-[32px] p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform group">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center border border-outline-variant/20 overflow-hidden p-2">
                    <div className="w-full h-full bg-purple-500 rounded-md"></div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">89%</div>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant/60 tracking-tighter">Match Score</span>
                  </div>
                </div>
                <h4 className="text-xl font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">Frontend Architect</h4>
                <p className="text-base text-on-surface-variant mb-4">Veloce Web • NY / Hybrid</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-2 py-0.5 rounded-md bg-secondary/5 text-secondary text-[11px] font-bold border border-secondary/10 uppercase">React / Next.js</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold border border-emerald-100 dark:border-emerald-800/50 uppercase">Immediate</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
                <span className="text-base font-bold text-on-surface">$155k - $200k</span>
                <div className="flex gap-2">
                  <button className="p-2 rounded-full border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-all">
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-all">Details</button>
                </div>
              </div>
            </div>

            {/* Job Card 3 */}
            <div className="glass-card rounded-[32px] p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform group">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center border border-outline-variant/20">
                    <div className="w-8 h-8 bg-on-surface-variant/10 rounded-full flex items-center justify-center font-bold text-primary">NV</div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">85%</div>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant/60 tracking-tighter">Match Score</span>
                  </div>
                </div>
                <h4 className="text-xl font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">Lead AI Researcher</h4>
                <p className="text-base text-on-surface-variant mb-4">NovaLabs • Remote</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-2 py-0.5 rounded-md bg-secondary/5 text-secondary text-[11px] font-bold border border-secondary/10 uppercase">NLP / LLM</span>
                  <span className="px-2 py-0.5 rounded-md bg-primary/5 text-primary text-[11px] font-bold border border-primary/10 uppercase">Top Talent</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
                <span className="text-base font-bold text-on-surface">$220k - $280k</span>
                <div className="flex gap-2">
                  <button className="p-2 rounded-full border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-all">
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-all">Details</button>
                </div>
              </div>
            </div>

            {/* Job Card 4 */}
            <div className="glass-card rounded-[32px] p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform group">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center border border-outline-variant/20 overflow-hidden p-2">
                    <div className="w-full h-full bg-orange-500 rounded-md"></div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">82%</div>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant/60 tracking-tighter">Match Score</span>
                  </div>
                </div>
                <h4 className="text-xl font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">Director of Engineering</h4>
                <p className="text-base text-on-surface-variant mb-4">CloudFlareX • Remote</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-2 py-0.5 rounded-md bg-secondary/5 text-secondary text-[11px] font-bold border border-secondary/10 uppercase">Leadership</span>
                  <span className="px-2 py-0.5 rounded-md bg-primary/5 text-primary text-[11px] font-bold border border-primary/10 uppercase">Enterprise</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-outline-variant/20">
                <span className="text-base font-bold text-on-surface">$200k+</span>
                <div className="flex gap-2">
                  <button className="p-2 rounded-full border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-all">
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-all">Details</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Saved Jobs */}
        <div className="lg:col-span-4">
          <section className="glass-card rounded-[32px] p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-bold text-on-surface">Saved Jobs</h4>
              <span className="bg-surface-container px-2 py-1 rounded text-xs font-bold text-primary">03</span>
            </div>
            
            <div className="space-y-4">
              {/* Saved Item 1 */}
              <div className="p-4 rounded-2xl hover:bg-surface-container-low transition-all border border-transparent hover:border-outline-variant/20 group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                    <Code className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm text-on-surface font-bold group-hover:text-primary transition-colors">Backend Developer</h5>
                    <p className="text-xs text-on-surface-variant mt-1">Stripe • $165k</p>
                  </div>
                  <button className="text-on-surface-variant/40 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Saved Item 2 */}
              <div className="p-4 rounded-2xl hover:bg-surface-container-low transition-all border border-transparent hover:border-outline-variant/20 group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                    <Palette className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm text-on-surface font-bold group-hover:text-primary transition-colors">UX Designer</h5>
                    <p className="text-xs text-on-surface-variant mt-1">Figma • $140k</p>
                  </div>
                  <button className="text-on-surface-variant/40 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Saved Item 3 */}
              <div className="p-4 rounded-2xl hover:bg-surface-container-low transition-all border border-transparent hover:border-outline-variant/20 group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                    <Rocket className="w-5 h-5 text-on-surface-variant" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm text-on-surface font-bold group-hover:text-primary transition-colors">VP of Product</h5>
                    <p className="text-xs text-on-surface-variant mt-1">Anthropic • $250k</p>
                  </div>
                  <button className="text-on-surface-variant/40 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-outline-variant/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Last AI update 2m ago</span>
              </div>
              <button className="w-full py-3 bg-surface-container text-on-surface font-medium text-sm rounded-xl hover:bg-surface-container-high transition-all">See All Favorites</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default JobMatchesView;
