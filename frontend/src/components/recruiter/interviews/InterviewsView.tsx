'use client';

import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  Share2, 
  ChevronRight, 
  Lightbulb, 
  Search, 
  Plus, 
  Sparkles,
  Bot,
  Activity,
  PlayCircle,
  FileText,
  User,
  ExternalLink,
  Coffee,
  MoreVertical
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

const InterviewsView = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const interviews = [
    {
      id: 1,
      candidate: 'Sarah Jenkins',
      role: 'Senior Designer',
      time: '10:00 AM - 11:00 AM',
      platform: 'Google Meet',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
      status: 'active',
      type: 'Face-to-Face'
    },
    {
      id: 2,
      candidate: 'David Chen',
      role: 'Product Manager',
      time: '01:30 PM - 02:15 PM',
      platform: 'Zoom Meeting',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
      status: 'upcoming',
      type: 'Technical'
    },
    {
      id: 3,
      candidate: 'Elena Rodriguez',
      role: 'Frontend Dev',
      time: '09:00 AM - 09:45 AM',
      platform: 'Microsoft Teams',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150',
      status: 'completed',
      type: 'Screening'
    }
  ];

  const agendaItems = [
    { time: '09:00 AM', name: 'Elena Rodriguez', role: 'Frontend Dev', completed: true },
    { time: '10:00 AM', name: 'Sarah Jenkins', role: 'Senior Designer', active: true },
    { time: '01:30 PM', name: 'David Chen', role: 'Product Manager' },
    { time: '03:00 PM', type: 'break', label: 'Focus Time' }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight mb-2">Interview Management</h1>
          <p className="text-on-surface-variant font-medium">Today's Schedule: Thursday, Oct 24</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3.5 glass-card rounded-2xl text-xs font-bold text-on-surface-variant hover:text-on-surface transition-all">
            <CalendarIcon size={18} />
            View Calendar
          </button>
          <button className="gradient-button text-white font-bold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 group">
            <Plus className="w-5 h-5" />
            <span>Schedule New</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        {/* Main List Column */}
        <div className="flex-1 space-y-6">
          <div className="flex border-b border-outline-variant/30 mb-8">
            {['Upcoming', 'Completed', 'Calendar View'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={cn(
                  "px-8 py-4 font-black text-[10px] uppercase tracking-[0.2em] transition-all relative",
                  activeTab === tab.toLowerCase() ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                {tab}
                {activeTab === tab.toLowerCase() && (
                  <motion.div layoutId="interviewTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {interviews.map((interview, i) => (
              <motion.div 
                key={interview.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "glass-card p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:translate-y-[-4px] transition-all duration-300 border border-white/5",
                  interview.status === 'completed' && "opacity-60"
                )}
              >
                <div className="flex items-center gap-5 flex-1">
                  <div className="relative shrink-0">
                    <img src={interview.avatar} alt={interview.candidate} className="w-14 h-14 rounded-full object-cover border-2 border-primary/20 shadow-lg" />
                    {interview.status === 'active' && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary border-2 border-white rounded-full animate-pulse flex items-center justify-center">
                        <Video size={10} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-black text-on-surface">{interview.candidate}</h3>
                      <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest">{interview.role}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-[11px] font-medium text-on-surface-variant">
                      <span className="flex items-center gap-1.5"><Clock size={14} className="text-primary" /> {interview.time}</span>
                      <span className="flex items-center gap-1.5"><User size={14} className="text-secondary" /> {interview.type}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container/50 border border-outline-variant/10 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                    <Video size={14} className="text-primary" /> {interview.platform}
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    {interview.status === 'completed' ? (
                      <button className="flex-1 md:flex-none px-6 py-2.5 bg-surface-container hover:bg-surface-container-high rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                        View Report
                      </button>
                    ) : (
                      <>
                        <button className="flex-1 md:flex-none px-4 py-2.5 glass-card rounded-xl text-primary hover:bg-primary/5 transition-all">
                          <Share2 size={18} />
                        </button>
                        <button className="flex-1 md:flex-none px-8 py-2.5 gradient-button text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center gap-2">
                          Join Call
                          <ExternalLink size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="w-full xl:w-80 shrink-0 space-y-6">
          {/* Quick Agenda */}
          <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
            <h3 className="text-sm font-black text-on-surface mb-8 uppercase tracking-[0.2em]">Quick Agenda</h3>
            <div className="relative border-l-2 border-outline-variant/20 ml-3 space-y-10 pb-4">
              {agendaItems.map((item, i) => (
                <div key={i} className="relative pl-8">
                  <div className={cn(
                    "absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-white shadow-sm transition-all",
                    item.active ? "bg-primary scale-125 animate-pulse" : item.completed ? "bg-emerald-500" : "bg-outline-variant"
                  )} />
                  <div className={cn("text-[10px] font-black uppercase tracking-widest mb-2", item.active ? "text-primary" : "text-on-surface-variant")}>
                    {item.time}
                  </div>
                  {item.type === 'break' ? (
                    <div className="flex items-center gap-3 text-on-surface-variant text-sm font-black italic">
                      <Coffee size={16} /> {item.label}
                    </div>
                  ) : (
                    <div className={cn(
                      "p-4 rounded-2xl border transition-all",
                      item.active ? "bg-primary/5 border-primary/20 shadow-md shadow-primary/5" : "bg-surface-container-low border-outline-variant/10 opacity-60"
                    )}>
                      <div className="font-black text-on-surface text-sm">{item.name}</div>
                      <div className="text-[10px] font-medium text-on-surface-variant mt-1">{item.role}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI Prep Note Widget */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="glass-card rounded-3xl p-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10 relative overflow-hidden group cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-primary/20 transition-colors" />
            <div className="flex items-start gap-4 relative z-10">
              <div className="p-2.5 bg-white rounded-xl shadow-sm text-primary">
                <Lightbulb size={20} />
              </div>
              <div>
                <h4 className="text-xs font-black text-on-surface mb-2 uppercase tracking-widest">AI Prep Note</h4>
                <p className="text-[11px] text-on-surface-variant leading-relaxed font-medium">
                  Sarah Jenkins mentioned an interest in design systems in her last email. Consider asking about her experience with **Figma variables** and team collaboration.
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-[9px] font-black text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              View Detailed Guide <ChevronRight size={12} />
            </div>
          </motion.div>

          {/* AI Interviewer Mode */}
          <div className="glass-card rounded-3xl p-6 flex items-center justify-between border-l-4 border-l-primary group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Bot size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black text-on-surface uppercase tracking-widest">AI Autonomous Mode</p>
                <p className="text-[9px] text-on-surface-variant font-medium">Let AI conduct 1st round</p>
              </div>
            </div>
            <div className="w-10 h-5 bg-surface-container rounded-full relative p-1 cursor-pointer transition-colors group-hover:bg-primary/20">
              <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewsView;
