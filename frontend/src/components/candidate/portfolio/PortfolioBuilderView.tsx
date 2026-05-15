'use client';

import React from 'react';
import { 
  Sparkles, 
  Eye, 
  Share2, 
  Download, 
  BadgeCheck, 
  MapPin, 
  Pencil, 
  Link2, 
  Code2, 
  Mail, 
  BrainCircuit, 
  Plus, 
  X, 
  AppWindow, 
  ArrowRight, 
  Bot, 
  Lightbulb, 
  Blocks, 
  CheckCircle2, 
  MoreHorizontal 
} from 'lucide-react';

const PortfolioBuilderView = () => {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      
      {/* Page Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full flex items-center gap-1 border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" /> AI-Assisted
            </span>
          </div>
          <h2 className="text-4xl font-bold text-on-surface mb-2">Portfolio Builder</h2>
          <p className="text-lg text-on-surface-variant max-w-2xl">
            Craft a standout digital presence. Our AI helps structure your projects and highlight skills that matter to top tech recruiters.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button className="glass-card px-4 py-2.5 rounded-xl text-sm font-medium text-on-surface flex items-center gap-2 hover:bg-surface-container transition-colors shadow-sm border border-outline-variant/20">
            <Eye className="w-4 h-4" /> Preview
          </button>
          <button className="glass-card px-4 py-2.5 rounded-xl text-sm font-medium text-on-surface flex items-center gap-2 hover:bg-surface-container transition-colors shadow-sm border border-outline-variant/20">
            <Share2 className="w-4 h-4" /> Share Link
          </button>
          <button className="gradient-button text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Main Profile & Content (Spans 8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Header Profile Card */}
          <div className="glass-card rounded-2xl p-8 relative overflow-hidden border border-white/10 dark:border-white/5 shadow-sm">
            {/* Decorative background blur */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-col sm:flex-row gap-8 relative z-10">
              {/* Profile Photo */}
              <div className="relative shrink-0">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-surface shadow-lg relative z-10">
                  <img 
                    alt="Alex Rivera" 
                    className="w-full h-full object-cover" 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400" 
                  />
                </div>
                {/* Verified Badge */}
                <div className="absolute -bottom-3 -right-3 bg-surface p-1 rounded-full shadow-md z-20">
                  <div className="bg-blue-500 text-white rounded-full p-1 flex items-center justify-center">
                    <BadgeCheck className="w-4 h-4" />
                  </div>
                </div>
              </div>
              
              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-3xl font-bold text-on-surface flex items-center gap-4">
                    Alex Rivera
                    <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
                      Open to Work
                    </span>
                  </h3>
                  <p className="text-lg text-primary font-medium mt-1">Senior Full-Stack Engineer</p>
                  <p className="text-sm text-on-surface-variant flex items-center gap-1.5 mt-2">
                    <MapPin className="w-4 h-4" /> San Francisco, CA (Remote)
                  </p>
                </div>
                
                <div className="relative">
                  <p className="text-sm text-on-surface-variant leading-relaxed max-w-xl">
                    Passionate engineer with 6+ years of experience building scalable web applications. Specializing in React ecosystem, Node.js microservices, and AI integration. Dedicated to writing clean, maintainable code and mentoring junior developers.
                  </p>
                  <button className="absolute -right-2 -top-2 p-1.5 text-outline hover:text-primary transition-colors bg-surface-container-lowest/50 rounded-lg">
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex gap-4 pt-2">
                  <a className="p-2 bg-surface-container rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors" href="#">
                    <Link2 className="w-5 h-5" />
                  </a>
                  <a className="p-2 bg-surface-container rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors" href="#">
                    <Code2 className="w-5 h-5" />
                  </a>
                  <a className="p-2 bg-surface-container rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors" href="#">
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="glass-card rounded-2xl p-8 border border-white/10 dark:border-white/5 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-on-surface flex items-center gap-2">
                <BrainCircuit className="w-6 h-6 text-primary" /> Skills & Expertise
              </h3>
              <button className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add Skill
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Frontend Engineering</p>
                <div className="flex flex-wrap gap-2">
                  {['React', 'TypeScript', 'Next.js', 'Tailwind CSS'].map(skill => (
                    <span key={skill} className="bg-surface-container-high border border-outline-variant/30 px-3.5 py-1.5 rounded-xl text-sm font-medium text-on-surface flex items-center gap-2 group cursor-pointer hover:border-primary transition-colors">
                      {skill} 
                      <X className="w-3.5 h-3.5 text-outline opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Backend & Cloud</p>
                <div className="flex flex-wrap gap-2">
                  {['Node.js', 'PostgreSQL', 'AWS'].map(skill => (
                    <span key={skill} className="bg-surface-container-high border border-outline-variant/30 px-3.5 py-1.5 rounded-xl text-sm font-medium text-on-surface flex items-center gap-2 group cursor-pointer hover:border-primary transition-colors">
                      {skill} 
                      <X className="w-3.5 h-3.5 text-outline opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-outline-variant/20">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-primary w-5 h-5" />
                <h4 className="text-sm font-bold text-on-surface">AI Skill Suggestions</h4>
              </div>
              <div className="flex flex-wrap gap-3 mb-6">
                <button className="bg-surface-container border border-dashed border-primary/40 hover:border-primary px-3.5 py-1.5 rounded-xl text-sm font-medium text-primary flex items-center gap-2 hover:bg-primary/10 transition-colors">
                  <Plus className="w-4 h-4" /> Cloud Architecture
                </button>
                <button className="bg-surface-container border border-dashed border-primary/40 hover:border-primary px-3.5 py-1.5 rounded-xl text-sm font-medium text-primary flex items-center gap-2 hover:bg-primary/10 transition-colors">
                  <Plus className="w-4 h-4" /> GraphQL
                </button>
                <button className="bg-surface-container border border-dashed border-primary/40 hover:border-primary px-3.5 py-1.5 rounded-xl text-sm font-medium text-primary flex items-center gap-2 hover:bg-primary/10 transition-colors">
                  <Plus className="w-4 h-4" /> System Design
                </button>
              </div>
              <div className="flex justify-end mt-4">
                <button className="gradient-button text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Generate AI Portfolio
                </button>
              </div>
            </div>
          </div>

          {/* Project Showcase Grid */}
          <div className="glass-card rounded-2xl p-8 border border-white/10 dark:border-white/5 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-on-surface flex items-center gap-2">
                <AppWindow className="w-6 h-6 text-primary" /> Project Showcase
              </h3>
              <button className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 hover:bg-primary/20 transition-colors">
                <Plus className="w-4 h-4" /> New Project
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Project Card 1 */}
              <div className="bg-surface-container-lowest dark:bg-background border border-outline-variant/30 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                <div className="h-48 w-full overflow-hidden relative">
                  <img 
                    alt="Dashboard project" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600&h=400" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <span className="bg-black/40 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-lg border border-white/20">AI Platform</span>
                    <button className="bg-black/40 backdrop-blur-md text-white p-1.5 rounded-lg hover:bg-white/30 transition-colors border border-white/20">
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="text-base font-bold text-on-surface mb-2">Lumina Analytics Dashboard</h4>
                  <p className="text-sm text-on-surface-variant line-clamp-2 mb-4 leading-relaxed">
                    Architected a real-time data visualization platform processing 1M+ events daily. Implemented predictive AI models for user behavior forecasting.
                  </p>
                  <div className="flex gap-2 mb-4">
                    <span className="text-[11px] font-bold px-2.5 py-1 bg-surface-container-high rounded-md text-on-surface-variant">React</span>
                    <span className="text-[11px] font-bold px-2.5 py-1 bg-surface-container-high rounded-md text-on-surface-variant">Python</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-outline-variant/20">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                      <Sparkles className="w-3.5 h-3.5" /> AI Enhanced
                    </div>
                    <a className="text-xs font-bold text-on-surface-variant hover:text-primary flex items-center gap-1 transition-colors" href="#">
                      View Details <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Project Card 2 */}
              <div className="bg-surface-container-lowest dark:bg-background border border-outline-variant/30 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                <div className="h-48 w-full overflow-hidden relative flex items-center justify-center">
                  <img 
                    alt="Cloud project" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600&h=400" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <span className="bg-black/40 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-lg border border-white/20">E-Commerce</span>
                    <button className="bg-black/40 backdrop-blur-md text-white p-1.5 rounded-lg hover:bg-white/30 transition-colors border border-white/20">
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="text-base font-bold text-on-surface mb-2">Global Payment Gateway</h4>
                  <p className="text-sm text-on-surface-variant line-clamp-2 mb-4 leading-relaxed">
                    Engineered a secure, scalable payment microservice handling multi-currency transactions with 99.99% uptime.
                  </p>
                  <div className="flex gap-2 mb-4">
                    <span className="text-[11px] font-bold px-2.5 py-1 bg-surface-container-high rounded-md text-on-surface-variant">Node.js</span>
                    <span className="text-[11px] font-bold px-2.5 py-1 bg-surface-container-high rounded-md text-on-surface-variant">Stripe API</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-outline-variant/20">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                      <Sparkles className="w-3.5 h-3.5" /> AI Enhanced
                    </div>
                    <a className="text-xs font-bold text-on-surface-variant hover:text-primary flex items-center gap-1 transition-colors" href="#">
                      View Details <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
        </div>

        {/* Right Column: AI Recommendations & Tools (Spans 4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AI Recommendations Sidebar */}
          <div className="glass-card rounded-2xl p-6 border-t-4 border-t-primary shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Bot className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-on-surface">AI Optimizer</h3>
            </div>
            
            <p className="text-sm text-on-surface-variant mb-6 leading-relaxed relative z-10">
              Based on your target role of <strong className="text-on-surface">Senior Frontend Engineer</strong>, AIHireX suggests the following enhancements to your portfolio.
            </p>
            
            <div className="space-y-4 relative z-10">
              {/* Suggestion 1 */}
              <div className="bg-surface-container-lowest dark:bg-background border border-primary/20 rounded-xl p-4 relative overflow-hidden group shadow-sm">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                <div className="flex gap-4">
                  <div className="mt-0.5">
                    <Lightbulb className="text-primary w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface mb-1.5">Quantify Project Impact</h4>
                    <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">Your 'Global Payment Gateway' description lacks metrics. Add percentage improvements in latency or volume handled.</p>
                    <button className="text-[11px] font-bold uppercase tracking-widest text-primary hover:text-primary-fixed-variant flex items-center gap-1.5 transition-colors">
                      Apply AI Rewrite <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Suggestion 2 */}
              <div className="bg-surface-container-lowest dark:bg-background border border-outline-variant/30 rounded-xl p-4 relative overflow-hidden group shadow-sm">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary"></div>
                <div className="flex gap-4">
                  <div className="mt-0.5">
                    <Blocks className="text-secondary w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface mb-1.5">Highlight GraphQL</h4>
                    <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">3 of your top job matches require GraphQL. Add it to your skills if you have experience.</p>
                    <button className="text-[11px] font-bold uppercase tracking-widest text-secondary hover:brightness-110 flex items-center gap-1.5 transition-colors">
                      Add Skill <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Suggestion 3 */}
              <div className="bg-surface-container-lowest dark:bg-background border border-outline-variant/30 rounded-xl p-4 relative overflow-hidden group opacity-60 grayscale-[0.5]">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-outline-variant"></div>
                <div className="flex gap-4">
                  <div className="mt-0.5">
                    <CheckCircle2 className="text-outline w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-outline mb-1.5 line-through">Add Profile Summary</h4>
                    <p className="text-xs text-outline mb-2">Completed. Summary is strong and keyword-optimized.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-outline-variant/20 relative z-10">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Portfolio Strength</span>
                <span className="text-sm text-primary font-bold">85%</span>
              </div>
              <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-primary to-secondary w-[85%] rounded-full relative">
                  <div className="absolute inset-0 bg-white/20 w-full animate-[pulse_2s_ease-in-out_infinite]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Skill Radar Widget */}
          <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px] relative border border-white/10 dark:border-white/5 shadow-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant absolute top-6 left-6">Skill Alignment Map</h3>
            <button className="absolute top-6 right-6 text-outline hover:text-primary transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
            
            {/* Abstract Representation of Radar Chart */}
            <div className="w-48 h-48 relative mt-4 opacity-90">
              {/* Concentric Hexagons */}
              <svg className="w-full h-full stroke-outline-variant/40 fill-transparent stroke-[1]" viewBox="0 0 100 100">
                <polygon points="50,5 90,25 90,75 50,95 10,75 10,25"></polygon>
                <polygon points="50,20 76,35 76,65 50,80 24,65 24,35"></polygon>
                <polygon points="50,35 63,42 63,58 50,65 37,58 37,42"></polygon>
                
                {/* Axes */}
                <line x1="50" x2="50" y1="50" y2="5"></line>
                <line x1="50" x2="90" y1="50" y2="25"></line>
                <line x1="50" x2="90" y1="50" y2="75"></line>
                <line x1="50" x2="50" y1="50" y2="95"></line>
                <line x1="50" x2="10" y1="50" y2="75"></line>
                <line x1="50" x2="10" y1="50" y2="25"></line>
                
                {/* Data Polygon (Filled) */}
                <polygon className="fill-primary/20 stroke-primary stroke-[1.5] drop-shadow-[0_0_8px_rgba(70,72,212,0.5)]" points="50,25 80,40 70,80 50,85 20,60 30,30"></polygon>
                
                {/* Data Points */}
                <circle className="fill-primary" cx="50" cy="25" r="3"></circle>
                <circle className="fill-primary" cx="80" cy="40" r="3"></circle>
                <circle className="fill-primary" cx="70" cy="80" r="3"></circle>
                <circle className="fill-primary" cx="50" cy="85" r="3"></circle>
                <circle className="fill-primary" cx="20" cy="60" r="3"></circle>
                <circle className="fill-primary" cx="30" cy="30" r="3"></circle>
              </svg>
              
              {/* Labels */}
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Frontend</span>
              <span className="absolute top-1/4 -right-12 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Backend</span>
              <span className="absolute bottom-1/4 -right-8 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Cloud</span>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">DevOps</span>
              <span className="absolute bottom-1/4 -left-10 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Testing</span>
              <span className="absolute top-1/4 -left-14 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Architecture</span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default PortfolioBuilderView;
