'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  ChevronRight, 
  Sparkles,
  List,
  LayoutGrid,
  ArrowUpRight,
  MessageSquare,
  Building2,
  MapPin,
  Clock,
  Briefcase,
  UserCheck2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { applicationService, Application } from '@/lib/services/application.services';

/**
 * 💼 RecruiterApplicationsView - Premium & SEO-friendly recruiter dashboard
 */
const RecruiterApplicationsView = () => {
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredReasoning, setHoveredReasoning] = useState<string | null>(null);

  // 🔄 Fetch all applications for the recruiter's company jobs
  const fetchApplications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await applicationService.getRecruiterApplications();
      if (res.success && res.data) {
        setApplications(res.data);
      } else {
        setError(res.message || 'Failed to fetch active applications.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading recruiter applications.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // 📝 Update candidate application status
  const handleStatusUpdate = async (appId: string, newStatus: string) => {
    try {
      const res = await applicationService.updateStatus(appId, newStatus);
      if (res.success) {
        setApplications(prev => 
          prev.map(app => app._id === appId ? { ...app, status: newStatus as any } : app)
        );
      }
    } catch (err: any) {
      console.error('Error updating application status:', err);
    }
  };

  // 🔍 Dynamic Search Filtering (Filters by candidate name, job title, and category)
  const filteredApplications = applications.filter(app => {
    const applicant = typeof app.applicantId === 'object' ? (app.applicantId as any) : null;
    const job = typeof app.jobId === 'object' ? (app.jobId as any) : null;
    if (!applicant && !job) return false;

    const query = searchQuery.toLowerCase();
    return (
      (applicant?.fullname || '').toLowerCase().includes(query) ||
      (job?.title || '').toLowerCase().includes(query) ||
      (job?.category || '').toLowerCase().includes(query) ||
      (app.status || '').toLowerCase().includes(query)
    );
  });

  // 📊 Calculate Dynamic Sidebar Stats
  const totalCount = applications.length;
  const screeningCount = applications.filter(app => ['applied', 'pending'].includes(app.status)).length;
  const technicalCount = applications.filter(app => app.status === 'interview').length;
  const shortlistedCount = applications.filter(app => app.status === 'shortlisted').length;
  const hiredCount = applications.filter(app => app.status === 'hired').length;

  // ✨ Generate AI Top Picks (Sorted by match score descending)
  const topPicks = [...applications]
    .filter(app => (app.aiScore ?? 0) >= 80)
    .sort((a, b) => (b.aiScore ?? 0) - (a.aiScore ?? 0))
    .slice(0, 3);

  // 📥 Export Applicants list to CSV format
  const handleExportCSV = () => {
    if (filteredApplications.length === 0) return;

    const headers = [
      'Application ID',
      'Applicant Name',
      'Email',
      'Applied Position',
      'Department/Category',
      'AI Match Score',
      'Date Applied',
      'Status'
    ];

    const rows = filteredApplications.map(app => {
      const applicant = typeof app.applicantId === 'object' ? (app.applicantId as any) : null;
      const job = typeof app.jobId === 'object' ? (app.jobId as any) : null;
      const score = app.aiScore ?? 0;
      const formattedDate = new Date(app.createdAt).toLocaleDateString('en-US');
      
      return [
        app._id,
        applicant?.fullname || 'Anonymous',
        applicant?.email || 'N/A',
        job?.title || 'Unknown Position',
        job?.category || 'General',
        `${score}%`,
        formattedDate,
        app.status
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `applicants_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="space-y-8 animate-in fade-in duration-700" id="recruiter-applications-main">
      
      {/* 🚀 Page Header (SEO Friendly Semantic Structure) */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6" id="recruiter-applications-header">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-on-surface tracking-tight mb-2" id="page-primary-heading">
            Recruiter Applications
          </h1>
          <p className="text-sm md:text-base text-on-surface-variant font-medium" id="page-subtitle">
            Showing {filteredApplications.length} total applicant{filteredApplications.length === 1 ? '' : 's'} across your active corporate roles.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            id="btn-export-applicants"
            onClick={handleExportCSV}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 gradient-button text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
            disabled={filteredApplications.length === 0}
            title={filteredApplications.length === 0 ? "No applicants to export" : "Export active list to CSV"}
          >
            <Download size={16} />
            Export Data
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* 📋 Section 1: Main Applicant Feed */}
        <section className="flex-1 space-y-6" aria-label="Applicant Roster">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors group-focus-within:text-primary" size={18} />
            <input 
              id="applicants-search-bar"
              type="text" 
              placeholder="Search by candidate name, role, department or pipeline status..."
              className="w-full pl-12 pr-4 py-3.5 bg-surface-container/50 border border-outline-variant/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search candidates"
            />
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4" id="loading-spinner-container">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-sm font-black uppercase tracking-widest text-on-surface-variant animate-pulse">Syncing corporate pipeline...</p>
            </div>
          ) : error ? (
            <div className="glass-card p-8 text-center space-y-4 border-red-500/10" id="error-card">
              <p className="text-sm font-bold text-red-500">{error}</p>
              <button 
                id="btn-retry-fetch"
                onClick={fetchApplications}
                className="px-6 py-2 bg-primary text-white rounded-xl text-xs font-bold"
              >
                Retry Loading
              </button>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="glass-card p-12 text-center space-y-4 border-white/5" id="empty-state-card">
              <Building2 className="w-12 h-12 mx-auto text-primary opacity-40 animate-bounce" />
              <h2 className="text-xl font-black text-on-surface">No Applications Found</h2>
              <p className="text-xs text-on-surface-variant max-w-md mx-auto">
                No job seekers have matched the active search criteria for your company jobs at this time.
              </p>
            </div>
          ) : (
            <div className="space-y-4" id="applicants-list-container">
              <AnimatePresence mode="popLayout">
                {filteredApplications.map((app, i) => {
                  const applicant = typeof app.applicantId === 'object' ? (app.applicantId as any) : null;
                  const job = typeof app.jobId === 'object' ? (app.jobId as any) : null;
                  const score = app.aiScore ?? 0;
                  const formattedDate = new Date(app.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  });

                  return (
                    <motion.div 
                      key={app._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: Math.min(i * 0.05, 0.4) }}
                      className="glass-card p-4 md:p-5 rounded-2.5xl flex flex-col md:flex-row md:items-center justify-between hover:bg-surface-container-low transition-all duration-300 group border border-white/5 gap-4"
                      id={`applicant-card-${app._id}`}
                    >
                      {/* Candidate Profile Details */}
                      <div className="flex items-center gap-4 md:w-1/3">
                        <div className="relative shrink-0">
                          <img 
                            src={applicant?.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150'} 
                            alt={`${applicant?.fullname || 'Applicant'} Avatar`} 
                            className="w-12 h-12 rounded-full object-cover border-2 border-primary/20" 
                          />
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                            {applicant?.fullname || 'Anonymous Applicant'}
                          </h3>
                          <div className="flex flex-col gap-1 mt-1">
                            <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider truncate flex items-center gap-1">
                              <Briefcase className="w-3 h-3 text-primary shrink-0" />
                              {job?.title || 'Applied Position'}
                            </span>
                            <span className="text-[9px] text-on-surface-variant/80 font-semibold truncate flex items-center gap-1">
                              <Building2 className="w-2.5 h-2.5 text-secondary shrink-0" />
                              {job?.category || 'General'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Info & Metrics Column */}
                      <div className="flex items-center justify-between md:contents">
                        
                        {/* AI Match Score */}
                        <div className="md:w-1/5 flex flex-col items-start gap-0.5 relative">
                          <div className={cn(
                            "flex items-center gap-1.5",
                            score >= 90 ? "text-emerald-600" : score >= 70 ? "text-secondary" : "text-red-500"
                          )}>
                            <Sparkles size={16} fill="currentColor" className="opacity-80 animate-pulse" />
                            <span className="text-lg md:text-xl font-black">{score}%</span>
                          </div>
                          
                          <div className="relative">
                            <button 
                              id={`reasoning-btn-${app._id}`}
                              onMouseEnter={() => setHoveredReasoning(app._id)}
                              onMouseLeave={() => setHoveredReasoning(null)}
                              className="text-[8px] md:text-[9px] font-black text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest flex items-center gap-1"
                            >
                              AI Match Info
                              <ArrowUpRight size={10} />
                            </button>
                            
                            {/* Glowing reasoning details panel */}
                            {hoveredReasoning === app._id && (
                              <div className="absolute z-20 top-6 left-0 bg-surface-container-high/95 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-xl w-60 text-[10px] font-medium text-on-surface leading-relaxed animate-in fade-in zoom-in duration-200">
                                <span className="font-black text-primary uppercase block mb-1">AI Reasoning Summary</span>
                                Candidate displays matching expertise with {applicant?.experience || 0} years verified professional experience. Skills: {applicant?.skills && applicant.skills.length > 0 ? applicant.skills.slice(0, 3).join(', ') : 'Aligned matches'}.
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Date applied */}
                        <div className="hidden sm:block md:w-1/6">
                          <div className="flex items-center gap-1 text-on-surface-variant">
                            <Clock className="w-3.5 h-3.5 opacity-60" />
                            <span className="text-xs font-bold">{formattedDate}</span>
                          </div>
                        </div>

                        {/* ATS Pipeline Status Selector */}
                        <div className="md:w-1/5 text-right md:text-left flex flex-col gap-1.5">
                          <span className={cn(
                            "inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border whitespace-nowrap self-start md:self-auto",
                            ['applied', 'pending'].includes(app.status) ? "bg-secondary/5 text-secondary border-secondary/10" :
                            app.status === 'interview' ? "bg-primary/5 text-primary border-primary/10" :
                            app.status === 'shortlisted' ? "bg-amber-500/5 text-amber-600 border-amber-500/10" :
                            app.status === 'hired' ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/10" :
                            "bg-red-500/5 text-red-600 border-red-500/10"
                          )}>
                            {app.status === 'applied' ? 'screening' : app.status}
                          </span>
                          
                          {/* Real-time Status Changer Selector */}
                          <select 
                            id={`status-select-${app._id}`}
                            value={app.status}
                            onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                            className="text-[9px] font-black uppercase tracking-widest bg-surface-container/60 hover:bg-surface-container border border-outline-variant/10 px-2 py-1 rounded-lg text-on-surface-variant focus:outline-none transition-all cursor-pointer w-full max-w-[120px]"
                            aria-label="Change candidate status"
                          >
                            <option value="applied">Screening</option>
                            <option value="shortlisted">Shortlist</option>
                            <option value="interview">Interview</option>
                            <option value="hired">Hire</option>
                            <option value="rejected">Reject</option>
                          </select>
                        </div>
                      </div>

                      {/* Quick Communication Actions */}
                      <div className="flex items-center justify-end gap-2 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 md:transform md:translate-x-4 md:group-hover:translate-x-0 border-t md:border-t-0 pt-3 md:pt-0 border-outline-variant/5">
                        <a 
                          href={`mailto:${applicant?.email || ''}`}
                          className="p-2.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-xl transition-all" 
                          title="Message Candidate"
                          id={`btn-email-${app._id}`}
                        >
                          <MessageSquare size={18} />
                        </a>
                        <button 
                          className="p-2.5 text-on-surface-variant hover:text-secondary hover:bg-secondary/10 rounded-xl transition-all" 
                          title="Schedule Interview"
                          id={`btn-schedule-${app._id}`}
                        >
                          <Calendar size={18} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* 🧳 Section 2: Sidebar Widgets (SEO Friendly Aside Structure) */}
        <aside className="w-full lg:w-80 shrink-0 space-y-6" aria-label="Pipeline Statistics & Insights" id="recruiter-applications-sidebar">
          
          {/* AI Top Picks */}
          <div className="bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-sm overflow-hidden relative" id="ai-picks-widget">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            
            <div className="flex items-center gap-2 mb-6 relative z-10">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Sparkles size={16} />
              </div>
              <h4 className="text-lg font-black text-on-surface" id="ai-picks-title">AI Top Picks</h4>
            </div>

            <p className="text-xs font-medium text-on-surface-variant mb-6 leading-relaxed relative z-10">
              Top corporate applicants analyzed and ranked by technical match score.
            </p>

            <div className="space-y-3 relative z-10" id="top-picks-list">
              {topPicks.length === 0 ? (
                <div className="text-center py-6 text-xs text-on-surface-variant font-medium bg-white/20 rounded-2xl border border-dashed border-outline-variant/20">
                  No matches with score &ge; 80% yet.
                </div>
              ) : (
                topPicks.map(pick => {
                  const applicant = typeof pick.applicantId === 'object' ? (pick.applicantId as any) : null;
                  return (
                    <div 
                      key={pick._id} 
                      className="bg-white/50 hover:bg-white/80 rounded-2xl p-4 flex items-center gap-4 border border-white/60 shadow-sm cursor-pointer hover:border-primary/20 transition-all group"
                      id={`top-pick-item-${pick._id}`}
                    >
                      <img 
                        src={applicant?.profilePhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150'} 
                        alt={applicant?.fullname || 'Candidate'} 
                        className="w-10 h-10 rounded-full object-cover border border-primary/20" 
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-on-surface truncate">{applicant?.fullname || 'Name'}</p>
                        <p className="text-[9px] font-black text-primary mt-1 uppercase tracking-widest flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          MATCH {pick.aiScore}%
                        </p>
                      </div>
                      <ChevronRight size={16} className="text-on-surface-variant group-hover:translate-x-1 transition-transform shrink-0" />
                    </div>
                  );
                })
              )}
            </div>

            <button 
              id="view-all-picks-btn"
              className="w-full mt-6 py-3 bg-surface-container hover:bg-surface-container-high rounded-xl text-[10px] font-black uppercase tracking-widest text-on-surface-variant transition-all"
            >
              Configure AI Weights
            </button>
          </div>

          {/* Hiring Progress Widget */}
          <div className="glass-card rounded-3xl p-6" id="hiring-progress-widget">
            <h4 className="text-sm font-black text-on-surface mb-6 uppercase tracking-widest" id="progress-widget-title">
              Hiring Pipeline
            </h4>
            
            <div className="space-y-5" id="progress-metrics-list">
              {[
                { label: 'Screening', count: screeningCount, color: 'bg-primary' },
                { label: 'Interviewing', count: technicalCount, color: 'bg-secondary' },
                { label: 'Shortlisted', count: shortlistedCount, color: 'bg-amber-500' },
                { label: 'Hired Candidates', count: hiredCount, color: 'bg-emerald-500' },
              ].map(item => (
                <div key={item.label} id={`progress-row-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                    <span className="text-on-surface-variant">{item.label}</span>
                    <span className="text-on-surface">{item.count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: totalCount > 0 ? `${(item.count / totalCount) * 100}%` : '0%' }}
                      className={cn("h-full rounded-full", item.color)} 
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-outline-variant/10 flex items-center justify-between" id="pipeline-total-bar">
              <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-1.5">
                <UserCheck2 className="w-3.5 h-3.5 text-primary" />
                Total Registered
              </span>
              <span className="text-xs font-black text-on-surface bg-primary/10 text-primary px-2.5 py-1 rounded-lg">
                {totalCount} Active
              </span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default RecruiterApplicationsView;
