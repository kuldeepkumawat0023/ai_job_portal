'use client';

import React, { useState } from 'react';
import { 
  Briefcase, 
  Users, 
  Calendar, 
  Plus, 
  Sparkles, 
  Search, 
  MapPin, 
  Building2, 
  ArrowUpRight, 
  Edit3, 
  Lightbulb, 
  MoreVertical,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

const JobBoardView = () => {
  const [activeTab, setActiveTab] = useState('All Jobs');

  const stats = [
    { label: 'Total Open Roles', value: '12', icon: Briefcase, color: 'text-primary bg-primary/10' },
    { label: 'Active Candidates', value: '348', icon: Users, color: 'text-secondary bg-secondary/10' },
    { label: 'Pending Interviews', value: '24', icon: Calendar, color: 'text-tertiary bg-tertiary/10' },
  ];

  const jobs = [
    {
      id: 1,
      title: 'Senior Frontend Engineer',
      dept: 'Engineering',
      location: 'Remote',
      status: 'Active',
      applicants: 142,
      matchRate: 84,
      img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=200&h=200'
    },
    {
      id: 2,
      title: 'Product Designer',
      dept: 'Design',
      location: 'New York, NY',
      status: 'Active',
      applicants: 89,
      matchRate: 72,
      img: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=200&h=200'
    },
    {
      id: 3,
      title: 'Data Scientist',
      dept: 'Data',
      location: 'San Francisco, CA',
      status: 'Draft',
      applicants: 0,
      matchRate: null,
      img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=200&h=200'
    },
    {
      id: 4,
      title: 'Marketing Manager',
      dept: 'Marketing',
      location: 'Remote',
      status: 'Active',
      applicants: 215,
      matchRate: 91,
      img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=200&h=200'
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight mb-2">Job Board</h1>
          <p className="text-on-surface-variant font-medium">Manage active postings and optimize your hiring pipeline with AI.</p>
        </div>
        <button className="gradient-button text-white font-bold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 group">
          <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
          <span>Post a New Job</span>
        </button>
      </div>

      {/* Quick Stats Bento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 rounded-3xl flex items-center gap-5 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300"
          >
            <div className={`p-4 rounded-2xl ${stat.color} relative z-10 transition-transform group-hover:scale-110`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-on-surface">{stat.value}</h3>
            </div>
            <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors" />
          </motion.div>
        ))}
      </div>

      {/* AI JD Optimizer Banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-3xl p-8 flex flex-col lg:flex-row items-center justify-between border-l-4 border-l-secondary relative overflow-hidden shadow-sm"
      >
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-start gap-6 z-10 max-w-2xl">
          <div className="bg-secondary-container/20 p-3 rounded-2xl text-secondary animate-pulse">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-on-surface mb-2">AI JD Optimizer</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              2 active postings have lower than average engagement. Let AI refine the language to attract better candidates.
            </p>
          </div>
        </div>
        <button className="mt-6 lg:mt-0 px-6 py-3 bg-secondary/10 hover:bg-secondary/20 text-secondary font-bold text-xs rounded-xl transition-all border border-secondary/20 whitespace-nowrap z-10 uppercase tracking-widest active:scale-95">
          Review Suggestions
        </button>
      </motion.div>

      {/* Filters & Tabs */}
      <div className="flex border-b border-outline-variant/30 mb-8 overflow-x-auto no-scrollbar">
        {['All Jobs', 'Active', 'Drafts', 'Closed'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-8 py-4 font-black text-[10px] uppercase tracking-[0.2em] transition-all relative",
              activeTab === tab 
                ? "text-primary" 
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            {tab}
            {activeTab === tab && (
              <motion.div 
                layoutId="activeTab" 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" 
              />
            )}
          </button>
        ))}
      </div>

      {/* Job Listings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {jobs.map((job, i) => (
          <motion.div 
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-3xl p-8 flex flex-col group hover:bg-surface-container-low transition-all duration-500 relative overflow-hidden border border-white/10"
          >
            {/* Background Decorative Image */}
            <img 
              src={job.img} 
              alt="" 
              className="absolute top-0 right-0 w-40 h-40 object-cover opacity-[0.03] rounded-bl-full pointer-events-none group-hover:opacity-[0.06] transition-opacity" 
            />

            <div className="flex justify-between items-start mb-6">
              <div className="space-y-3">
                <h3 className="text-xl font-black text-on-surface group-hover:text-primary transition-colors">{job.title}</h3>
                <div className="flex flex-wrap items-center gap-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                  <div className="flex items-center gap-1.5 bg-surface-container px-2 py-1 rounded-lg">
                    <Building2 className="w-3.5 h-3.5" />
                    {job.dept}
                  </div>
                  <div className="flex items-center gap-1.5 bg-surface-container px-2 py-1 rounded-lg">
                    <MapPin className="w-3.5 h-3.5" />
                    {job.location}
                  </div>
                </div>
              </div>
              <span className={cn(
                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                job.status === 'Active' 
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                  : "bg-orange-500/10 text-orange-600 border-orange-500/20"
              )}>
                {job.status}
              </span>
            </div>

            <div className="flex gap-8 my-8 border-y border-outline-variant/10 py-6">
              <div>
                <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Applicants</p>
                <p className="text-2xl font-black text-on-surface">{job.applicants || '-'}</p>
              </div>
              <div className="border-l border-outline-variant/10 pl-8">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className={cn("w-3.5 h-3.5", job.matchRate ? "text-secondary" : "text-on-surface-variant/30")} />
                  <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">AI Match Rate</p>
                </div>
                <p className={cn("text-2xl font-black", job.matchRate ? "text-secondary" : "text-on-surface-variant/30")}>
                  {job.matchRate ? `${job.matchRate}% Avg` : 'Pending'}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-auto">
              <button className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary font-black text-[10px] uppercase tracking-widest py-3.5 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 group/btn">
                View Applicants
                <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </button>
              <button className="p-3 bg-surface-container hover:bg-surface-container-high rounded-xl text-on-surface-variant transition-colors" title="Edit Role">
                <Edit3 className="w-5 h-5" />
              </button>
              <button className="p-3 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-xl transition-colors" title="AI Insight">
                <Lightbulb className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default JobBoardView;
