'use client';

import React, { useState } from 'react';
import {
  Search,
  Edit3,
  MoreVertical,
  User,
  Download,
  Paperclip,
  Smile,
  Send,
  Sparkles,
  CheckCheck,
  Info,
  Calendar,
  X,
  Bot,
  BrainCircuit,
  FileText,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  Circle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

const RecruiterMessagesView = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [showChat, setShowChat] = useState(false);
  const [showAiSuggestions, setShowAiSuggestions] = useState(true);
  const [showContextSidebar, setShowContextSidebar] = useState(false);

  const conversations = [
    {
      id: 1,
      name: 'Elena Rodriguez',
      role: 'Senior Frontend Dev',
      lastMessage: "I've attached my updated portfolio. Let me know what you think!",
      time: '10:42 AM',
      matchScore: 94,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
      online: true,
      unread: 1,
      isTyping: true
    },
    {
      id: 2,
      name: 'Marcus Kim',
      role: 'Product Designer',
      lastMessage: "Thanks for the update. I'm available for a call next week.",
      time: 'Yesterday',
      matchScore: 88,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
      online: false
    },
    {
      id: 3,
      name: 'Sarah Jenkins',
      role: 'Data Scientist',
      lastMessage: "Here are the answers to the technical assessment...",
      time: 'Mon',
      matchScore: 82,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150',
      online: true
    }
  ];

  const handleSelectChat = (id: number) => {
    setSelectedChat(id);
    setShowChat(true);
  };

  return (
    <div className="flex h-[calc(100dvh-100px)] -m-4 md:-m-8 bg-surface-container-lowest dark:bg-background overflow-hidden animate-in fade-in duration-700">

      {/* Left Pane: Conversation List */}
      <section className={cn(
        "w-full md:w-[360px] lg:w-[400px] border-r border-outline-variant/20 flex-col h-full bg-surface-container-low/50 dark:bg-surface-container-lowest/30 backdrop-blur-md shadow-2xl",
        showChat ? "hidden md:flex" : "flex"
      )}>
        <div className="p-6 border-b border-outline-variant/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-black text-on-surface dark:text-foreground tracking-tight">Inbox</h2>
            <button className="p-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-2xl transition-all shadow-sm group">
              <Edit3 size={20} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container/50 dark:bg-surface-container-high/50 rounded-full border-none focus:ring-2 focus:ring-primary text-sm placeholder-outline transition-all dark:text-on-surface"
              placeholder="Search conversations..."
              type="text"
            />
          </div>

        </div>

        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-3 flex flex-col gap-2">
          {conversations.map((chat) => (
            <button
              key={chat.id}
              onClick={() => handleSelectChat(chat.id)}
              className={cn(
                "w-full text-left p-4 rounded-2xl transition-all relative group border",
                selectedChat === chat.id
                  ? "bg-white dark:bg-primary/10 border-primary/40 shadow-xl shadow-primary/10"
                  : "bg-transparent border-transparent hover:bg-white/40 dark:hover:bg-primary/5"
              )}
            >
              <div className="flex gap-4 items-start">
                <div className="relative">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl overflow-hidden shadow-sm transition-transform duration-300 group-hover:scale-105 border-2",
                    selectedChat === chat.id ? "border-primary/40" : "border-outline-variant/10"
                  )}>
                    <img
                      alt={chat.name}
                      className={cn(
                        "w-full h-full object-cover transition-all duration-500",
                        !chat.online && "grayscale-[0.5]"
                      )}
                      src={chat.avatar}
                    />
                  </div>
                  {chat.online && (
                    <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-white dark:bg-surface-container-high rounded-full flex items-center justify-center border border-outline-variant/20 shadow-lg">
                      <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={cn(
                      "text-base font-black truncate pr-2",
                      selectedChat === chat.id ? "text-on-surface dark:text-foreground" : "text-on-surface/80 dark:text-foreground/80"
                    )}>{chat.name}</h3>
                    <span className="text-[10px] font-black text-on-surface-variant/60 dark:text-muted-foreground/60 whitespace-nowrap">{chat.time}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <p className={cn(
                      "text-[10px] font-black uppercase tracking-[0.15em] truncate flex-1",
                      selectedChat === chat.id ? "text-primary" : "text-on-surface-variant/70 dark:text-muted-foreground/70"
                    )}>{chat.role}</p>
                    <div className={cn(
                      "flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black",
                      selectedChat === chat.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-primary/10 text-primary"
                    )}>
                      <Sparkles size={10} fill="currentColor" />
                      {chat.matchScore}%
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn(
                      "text-xs truncate font-bold",
                      chat.isTyping ? "text-primary italic animate-pulse" : (chat.unread ? "text-on-surface dark:text-foreground" : "text-on-surface-variant/60 dark:text-muted-foreground/60")
                    )}>
                      {chat.isTyping ? "Typing..." : chat.lastMessage}
                    </p>
                    {chat.unread !== undefined && chat.unread > 0 && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Right Pane: Active Chat Window */}
      <section className={cn(
        "flex-1 flex-col h-full bg-surface-container-lowest dark:bg-background relative min-w-0",
        showChat ? "flex" : "hidden md:flex"
      )}>
        {/* Chat Header */}
        <header className="h-20 md:h-24 border-b border-outline-variant/20 px-4 md:px-8 flex items-center justify-between bg-white/80 dark:bg-background/80 backdrop-blur-xl sticky top-0 z-10">
          <div className="flex items-center gap-3 md:gap-5 overflow-hidden">
            <button
              className="md:hidden p-2 -ml-2 rounded-full hover:bg-surface-container transition-colors flex-shrink-0"
              onClick={() => setShowChat(false)}
            >
              <ArrowLeft className="w-6 h-6 text-on-surface" />
            </button>
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-3xl border-2 border-primary/20 p-0.5 shadow-sm flex-shrink-0 relative">
              <img
                alt="Elena Rodriguez"
                className="w-full h-full rounded-2xl object-cover"
                src={conversations[0].avatar}
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-surface-container rounded-full flex items-center justify-center border border-outline-variant/20 shadow-sm">
                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-2xl font-black text-on-surface dark:text-foreground tracking-tight truncate">
                  Elena Rodriguez
                </h2>
                <span className="hidden sm:flex px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest border border-emerald-100 items-center gap-1">
                  <Sparkles size={10} fill="currentColor" />
                  94%
                </span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant dark:text-muted-foreground text-[11px] md:text-[13px] font-bold uppercase tracking-widest mt-1 truncate">
                <span className="truncate">Senior Frontend Developer</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                <span className="text-emerald-600">Online</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <button
              onClick={() => setShowContextSidebar(!showContextSidebar)}
              className={cn(
                "px-4 md:px-6 py-2.5 md:py-3 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all border flex items-center gap-2 shadow-sm",
                showContextSidebar ? "bg-primary text-white border-primary shadow-primary/20" : "border-outline-variant/30 text-on-surface hover:bg-surface-container"
              )}
            >
              <User size={16} className="hidden sm:block" />
              {showContextSidebar ? "Close" : "Profile"}
            </button>
          </div>
        </header>

        {/* Messages Feed Area */}
        <div 
          className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-3 md:p-8 flex flex-col gap-4 md:gap-10 bg-surface-bright/30"
          style={{
            backgroundImage: `radial-gradient(var(--outline-variant) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
            backgroundPosition: '0 0'
          }}
        >
          <div className="flex justify-center">
            <span className="px-4 py-1.5 md:px-5 md:py-2 rounded-full bg-white/80 dark:bg-surface-container-high/50 backdrop-blur-md text-on-surface-variant dark:text-muted-foreground font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] border border-outline-variant/10 shadow-sm">Today, 9:00 AM</span>
          </div>

          {/* Recruiter Message */}
          <div className="flex flex-col gap-2 md:gap-4 max-w-[95%] md:max-w-[80%] self-end items-end group">
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <span className="text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">9:05 AM</span>
              <CheckCheck size={14} className="text-primary" />
            </div>
            <div className="space-y-2 md:space-y-3">
              <div className="gradient-button text-white px-4 py-3 md:px-6 md:py-4 rounded-2xl md:rounded-3xl rounded-tr-sm shadow-xl shadow-primary/10 text-[13px] md:text-[15px] leading-relaxed font-medium">
                Hi Elena! Thanks for applying for the Senior Frontend Dev position. Your background at TechFlow is really impressive.
              </div>
              <div className="gradient-button text-white px-4 py-3 md:px-6 md:py-4 rounded-2xl md:rounded-3xl shadow-xl shadow-primary/10 text-[13px] md:text-[15px] leading-relaxed font-medium">
                I'd love to schedule a quick 15-minute chat this week. Are you available Thursday or Friday morning?
              </div>
            </div>
          </div>

          {/* Candidate Message */}
          <div className="flex gap-2 md:gap-5 max-w-[95%] md:max-w-[80%] self-start group">
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl overflow-hidden flex-shrink-0 mt-auto border-2 border-primary/10 shadow-lg">
              <img src={conversations[0].avatar} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest ml-1 opacity-0 group-hover:opacity-100 transition-opacity">Elena Rodriguez • 10:42 AM</span>
              <div className="space-y-2 md:space-y-3">
                <div className="bg-white dark:bg-zinc-800 border border-outline-variant/20 p-4 md:p-6 rounded-2xl md:rounded-3xl rounded-tl-sm shadow-xl shadow-surface-container/5 text-[13px] md:text-[15px] leading-relaxed text-on-surface dark:text-foreground">
                  Hi there! Thanks so much for reaching out. I'm very excited about the opportunity.
                </div>
                <div className="bg-white dark:bg-zinc-800 border border-outline-variant/20 p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-xl shadow-surface-container/5 text-[13px] md:text-[15px] leading-relaxed text-on-surface dark:text-foreground">
                  Thursday morning works perfectly for me. Anytime between 9 AM and 11 AM EST is great.
                </div>

                {/* Attachment */}
                <div className="bg-white dark:bg-zinc-800 border border-primary/20 p-3 md:p-4 rounded-xl md:rounded-2xl flex items-center gap-3 md:gap-4 w-full sm:w-80 hover:bg-primary/5 transition-all cursor-pointer group/file shadow-lg">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
                    <FileText size={20} className="md:w-6 md:h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] md:text-xs font-black text-on-surface truncate group-hover/file:text-primary transition-colors">E_Rodriguez_Portfolio.pdf</p>
                    <p className="text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">2.4 MB • PDF</p>
                  </div>
                  <Download size={16} className="md:w-[18px] md:h-[18px] text-on-surface-variant group-hover/file:text-primary transition-colors shrink-0" />
                </div>
              </div>
            </div>
          </div>

          {/* Typing Indicator */}
          <div className="flex items-center gap-3 self-start animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="w-10 md:w-12 flex-shrink-0" />
            <div className="bg-white/80 dark:bg-surface-container/80 backdrop-blur-sm border border-outline-variant/10 px-5 py-3 rounded-2xl flex items-center gap-1.5 shadow-md">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
            </div>
          </div>
        </div>

        {/* Improved Input Area */}
        <footer className="p-3 md:p-8 bg-white dark:bg-background border-t border-outline-variant/10 z-20 shrink-0">
          <div className="max-w-5xl mx-auto flex flex-col gap-2 md:gap-4">
            <div className="relative group">
              <div className="bg-surface-container-low/50 dark:bg-surface-container-high/30 rounded-2xl md:rounded-[2rem] border border-outline-variant/20 focus-within:border-primary/40 transition-all p-1.5 md:p-2 flex items-end gap-2 md:gap-3 shadow-inner">
                <button className="w-12 h-12 flex-shrink-0 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-white dark:hover:bg-surface-container rounded-full transition-all shadow-sm">
                  <Paperclip size={22} />
                </button>
                <textarea
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none resize-none max-h-40 min-h-[48px] py-4 text-base font-bold text-on-surface placeholder:text-on-surface-variant/50"
                  rows={1}
                />
                <button className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-white rounded-full hover:shadow-2xl hover:shadow-primary/30 transition-all transform hover:scale-110 active:scale-95 shadow-xl">
                  <Send size={22} className="ml-1" />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center px-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-emerald-600">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest">Elena is typing...</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-on-surface-variant/40">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Press Enter to send</span>
                </div>
              </div>
            </div>
          </div>
        </footer>

        {/* Context Sidebar (Overlay) */}
        <AnimatePresence>
          {showContextSidebar && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute top-0 right-0 w-full sm:w-[400px] h-full bg-white dark:bg-zinc-900 border-l border-outline-variant/10 z-50 shadow-[-20px_0_40px_rgba(0,0,0,0.1)] p-8 overflow-y-auto no-scrollbar"
            >
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-sm font-black text-on-surface uppercase tracking-[0.2em] flex items-center gap-3">
                  <User size={18} className="text-primary" />
                  Candidate Profile
                </h3>
                <button onClick={() => setShowContextSidebar(false)} className="p-2.5 hover:bg-surface-container rounded-2xl transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-10">
                {/* Profile Summary */}
                <div className="text-center group">
                  <div className="relative inline-block">
                    <img src={conversations[0].avatar} alt="" className="w-28 h-28 md:w-32 md:h-32 rounded-[2.5rem] object-cover mx-auto mb-6 border-4 border-primary/5 shadow-2xl transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center border border-outline-variant/10 shadow-lg">
                      <Circle size={14} className="fill-emerald-500 text-emerald-500" />
                    </div>
                  </div>
                  <h4 className="text-xl md:text-2xl font-black text-on-surface">Elena Rodriguez</h4>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em] mt-2">Senior Frontend Developer</p>
                </div>

                {/* AI Reasoning */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="text-[11px] font-black text-primary uppercase tracking-[0.15em] flex items-center gap-2">
                      <BrainCircuit size={16} />
                      Match Analysis
                    </h5>
                    <span className="text-2xl font-black text-primary">94%</span>
                  </div>
                  <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4 shadow-inner">
                    <p className="text-[13px] text-on-surface leading-relaxed font-bold">
                      Top-tier expertise in React, TypeScript, and high-scale design systems. Matches 100% of required technical skills.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {['React', 'TypeScript', 'Next.js', 'System Design'].map(skill => (
                        <span key={skill} className="px-3 py-1 rounded-full bg-white/50 text-[10px] font-black text-primary uppercase tracking-widest border border-primary/10">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pipeline Actions */}
                <div className="space-y-4">
                  <h5 className="text-[11px] font-black text-on-surface-variant uppercase tracking-[0.15em]">Hiring Pipeline</h5>
                  <div className="grid grid-cols-1 gap-3">
                    <button className="w-full flex items-center justify-between p-5 rounded-3xl border border-outline-variant/10 bg-emerald-50/30 hover:bg-emerald-50 hover:border-emerald-200 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-2xl text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
                          <CheckCheck size={20} />
                        </div>
                        <div className="text-left">
                          <span className="block text-[11px] font-black text-on-surface uppercase tracking-widest">Schedule Interview</span>
                          <span className="text-[10px] font-bold text-on-surface-variant uppercase opacity-60">Next Stage: Technical</span>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-on-surface-variant group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button className="w-full flex items-center justify-between p-5 rounded-3xl border border-outline-variant/10 bg-red-50/30 hover:bg-red-50 hover:border-red-200 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-2xl text-red-600 shadow-sm group-hover:scale-110 transition-transform">
                          <X size={20} />
                        </div>
                        <div className="text-left">
                          <span className="block text-[11px] font-black text-on-surface uppercase tracking-widest">Reject Application</span>
                          <span className="text-[10px] font-bold text-on-surface-variant uppercase opacity-60">Send rejection mail</span>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-on-surface-variant group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};

export default RecruiterMessagesView;
