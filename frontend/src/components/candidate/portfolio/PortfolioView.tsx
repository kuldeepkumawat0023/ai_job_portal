'use client';

import React from 'react';
import { 
  BadgeCheck, 
  MapPin, 
  Link2, 
  Code2, 
  Mail, 
  BrainCircuit, 
  AppWindow, 
  ArrowRight, 
  Sparkles,
  Download,
  Share2,
  Briefcase
} from 'lucide-react';

const PortfolioView = () => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-10">
      
      {/* Action Bar */}
      <div className="flex justify-end gap-3 mb-4">
        <button className="glass-card px-4 py-2 rounded-xl text-sm font-medium text-on-surface flex items-center gap-2 hover:bg-surface-container transition-colors shadow-sm border border-outline-variant/20">
          <Share2 className="w-4 h-4" /> Share Profile
        </button>
        <button className="gradient-button text-white px-5 py-2 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
          <Download className="w-4 h-4" /> Download Resume
        </button>
      </div>

      {/* Main Profile Header */}
      <div className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden border border-white/10 dark:border-white/5 shadow-sm">
        {/* Decorative background blur */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row gap-8 relative z-10 items-center md:items-start text-center md:text-left">
          {/* Profile Photo */}
          <div className="relative shrink-0">
            <div className="w-40 h-40 rounded-3xl overflow-hidden border-4 border-surface shadow-xl relative z-10">
              <img 
                alt="Alex Rivera" 
                className="w-full h-full object-cover" 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400" 
              />
            </div>
            {/* Verified Badge */}
            <div className="absolute -bottom-3 -right-3 bg-surface p-1.5 rounded-full shadow-lg z-20">
              <div className="bg-blue-500 text-white rounded-full p-1 flex items-center justify-center">
                <BadgeCheck className="w-5 h-5" />
              </div>
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="flex-1 space-y-5 flex flex-col md:block items-center">
            <div>
              <h1 className="text-4xl font-bold text-on-surface flex flex-col md:flex-row items-center gap-4">
                Alex Rivera
                <span className="text-[11px] uppercase font-bold tracking-widest bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800/50 shadow-sm">
                  Open to Work
                </span>
              </h1>
              <p className="text-xl text-primary font-bold mt-2">Senior Full-Stack Engineer</p>
              <p className="text-sm text-on-surface-variant flex items-center gap-1.5 mt-2 font-medium">
                <MapPin className="w-4 h-4 text-outline" /> San Francisco, CA (Remote)
              </p>
            </div>
            
            <p className="text-base text-on-surface-variant leading-relaxed max-w-2xl">
              Passionate engineer with 6+ years of experience building scalable web applications. Specializing in React ecosystem, Node.js microservices, and AI integration. Dedicated to writing clean, maintainable code and mentoring junior developers.
            </p>
            
            <div className="flex gap-4 pt-2">
              <a className="px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-on-surface font-semibold hover:text-primary hover:border-primary/50 transition-all shadow-sm flex items-center gap-2" href="#">
                <Link2 className="w-5 h-5" /> Portfolio
              </a>
              <a className="px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-on-surface font-semibold hover:text-primary hover:border-primary/50 transition-all shadow-sm flex items-center gap-2" href="#">
                <Code2 className="w-5 h-5" /> GitHub
              </a>
              <a className="px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl text-on-surface font-semibold hover:text-primary hover:border-primary/50 transition-all shadow-sm flex items-center gap-2" href="#">
                <Mail className="w-5 h-5" /> Contact
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Experience & Projects */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Experience Timeline */}
          <div className="glass-card rounded-2xl p-8 border border-white/10 dark:border-white/5 shadow-sm">
            <h3 className="text-2xl font-bold text-on-surface flex items-center gap-3 mb-8">
              <Briefcase className="w-6 h-6 text-primary" /> Work Experience
            </h3>
            
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-outline-variant/30 before:to-transparent">
              
              {/* Job 1 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface bg-primary text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl glass-card shadow-sm border border-outline-variant/20">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-lg text-on-surface">Senior Software Engineer</h4>
                  </div>
                  <div className="text-sm font-bold text-primary mb-3">TechNova Solutions • 2021 - Present</div>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Led a team of 5 engineers to migrate legacy monolith to microservices architecture. Reduced load times by 40% and improved system reliability.
                  </p>
                </div>
              </div>
              
              {/* Job 2 */}
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface bg-surface-container-highest text-on-surface shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl glass-card shadow-sm border border-outline-variant/20">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-lg text-on-surface">Full Stack Developer</h4>
                  </div>
                  <div className="text-sm font-bold text-primary mb-3">InnoSoft Inc. • 2018 - 2021</div>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Developed scalable React frontends and Node.js backends. Implemented automated CI/CD pipelines using GitHub Actions.
                  </p>
                </div>
              </div>
              
            </div>
          </div>

          {/* Project Showcase */}
          <div className="glass-card rounded-2xl p-8 border border-white/10 dark:border-white/5 shadow-sm">
            <h3 className="text-2xl font-bold text-on-surface flex items-center gap-3 mb-8">
              <AppWindow className="w-6 h-6 text-primary" /> Featured Projects
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Project Card 1 */}
              <div className="bg-surface-container-lowest dark:bg-background border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className="h-48 w-full overflow-hidden relative">
                  <img 
                    alt="Dashboard project" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600&h=400" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="bg-black/40 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-lg border border-white/20">AI Platform</span>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="text-base font-bold text-on-surface mb-2">Lumina Analytics Dashboard</h4>
                  <p className="text-sm text-on-surface-variant line-clamp-2 mb-4 leading-relaxed">
                    Architected a real-time data visualization platform processing 1M+ events daily. Implemented predictive AI models.
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
              <div className="bg-surface-container-lowest dark:bg-background border border-outline-variant/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className="h-48 w-full overflow-hidden relative">
                  <img 
                    alt="Cloud project" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600&h=400" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="bg-black/40 backdrop-blur-md text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-lg border border-white/20">E-Commerce</span>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="text-base font-bold text-on-surface mb-2">CloudScale Microservices</h4>
                  <p className="text-sm text-on-surface-variant line-clamp-2 mb-4 leading-relaxed">
                    Designed and deployed a highly available cloud infrastructure capable of handling 50k+ concurrent users.
                  </p>
                  <div className="flex gap-2 mb-4">
                    <span className="text-[11px] font-bold px-2.5 py-1 bg-surface-container-high rounded-md text-on-surface-variant">Node.js</span>
                    <span className="text-[11px] font-bold px-2.5 py-1 bg-surface-container-high rounded-md text-on-surface-variant">AWS</span>
                    <span className="text-[11px] font-bold px-2.5 py-1 bg-surface-container-high rounded-md text-on-surface-variant">Docker</span>
                  </div>
                  <div className="flex justify-end pt-3 border-t border-outline-variant/20">
                    <a className="text-xs font-bold text-on-surface-variant hover:text-primary flex items-center gap-1 transition-colors" href="#">
                      View Details <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column: Skills & Stats */}
        <div className="space-y-8">
          
          {/* Skills Card */}
          <div className="glass-card rounded-2xl p-8 border border-white/10 dark:border-white/5 shadow-sm">
            <h3 className="text-2xl font-bold text-on-surface flex items-center gap-3 mb-6">
              <BrainCircuit className="w-6 h-6 text-primary" /> Core Skills
            </h3>
            
            <div className="space-y-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Frontend Engineering</p>
                <div className="flex flex-wrap gap-2">
                  {['React', 'TypeScript', 'Next.js', 'Tailwind CSS'].map(skill => (
                    <span key={skill} className="bg-surface-container-lowest dark:bg-surface-container-high border border-outline-variant/30 px-4 py-2 rounded-xl text-sm font-semibold text-on-surface shadow-sm hover:border-primary transition-colors cursor-default">
                      {skill} 
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Backend & Cloud</p>
                <div className="flex flex-wrap gap-2">
                  {['Node.js', 'PostgreSQL', 'GraphQL', 'AWS', 'Docker'].map(skill => (
                    <span key={skill} className="bg-surface-container-lowest dark:bg-surface-container-high border border-outline-variant/30 px-4 py-2 rounded-xl text-sm font-semibold text-on-surface shadow-sm hover:border-primary transition-colors cursor-default">
                      {skill} 
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">AI & Tools</p>
                <div className="flex flex-wrap gap-2">
                  {['OpenAI API', 'LangChain', 'Git', 'Figma'].map(skill => (
                    <span key={skill} className="bg-surface-container-lowest dark:bg-surface-container-high border border-outline-variant/30 px-4 py-2 rounded-xl text-sm font-semibold text-on-surface shadow-sm hover:border-primary transition-colors cursor-default">
                      {skill} 
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="glass-card rounded-2xl p-8 border border-white/10 dark:border-white/5 shadow-sm">
            <h3 className="text-lg font-bold text-on-surface mb-6">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-lowest p-4 rounded-xl text-center border border-outline-variant/20">
                <div className="text-2xl font-black text-primary mb-1">6+</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Years Exp.</div>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl text-center border border-outline-variant/20">
                <div className="text-2xl font-black text-primary mb-1">24</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Projects</div>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl text-center border border-outline-variant/20">
                <div className="text-2xl font-black text-primary mb-1">100%</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Job Match</div>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl text-center border border-outline-variant/20">
                <div className="text-2xl font-black text-primary mb-1">8</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Certificates</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PortfolioView;
