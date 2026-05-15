'use client';

import React from 'react';
import { 
  Search, 
  CheckCheck, 
  MessageSquare, 
  ExternalLink, 
  Send, 
  Paperclip, 
  Sparkles, 
  CheckCircle2, 
  MoreVertical,
  Building2,
  MoreHorizontal,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

const MessagesView = () => {
  const [selectedChat, setSelectedChat] = React.useState(1);
  const [showChat, setShowChat] = React.useState(false);

  const conversations = [
    {
      id: 1,
      name: 'Sarah Jenkins',
      role: 'Senior Software Engineer',
      lastMessage: "That works perfectly. I'll send the calendar invite...",
      time: '10:42 AM',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      unread: true,
      company: 'G',
      companyColor: 'bg-blue-600'
    },
    {
      id: 2,
      name: 'Michael Chang',
      role: 'Staff Frontend Engineer',
      lastMessage: "We reviewed your portfolio and would love to chat.",
      time: 'Yesterday',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
      company: 'S',
      companyColor: 'bg-indigo-600'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Product Manager, AI',
      lastMessage: "Thanks for your time today! Following up on...",
      time: 'Oct 12',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
      company: '∞',
      companyColor: 'bg-blue-500'
    }
  ];

  return (
    <div className="flex h-[calc(100dvh-100px)] -m-4 md:-m-8 bg-surface-container-lowest dark:bg-background overflow-hidden animate-in fade-in duration-700">
      {/* Left Pane: Conversation List */}
      <section className={cn(
        "w-full md:w-[360px] lg:w-[400px] border-r border-outline-variant/20 flex-col h-full bg-surface-container-low/50 dark:bg-surface-container-lowest/30 backdrop-blur-md shadow-2xl",
        showChat ? "hidden md:flex" : "flex"
      )}>
        <div className="p-6 border-b border-outline-variant/20">
          <h2 className="text-3xl font-black text-on-surface dark:text-foreground mb-4 tracking-tight">Messages</h2>
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
              onClick={() => {
                setSelectedChat(chat.id);
                setShowChat(true);
              }}
              className={cn(
                "w-full text-left p-4 rounded-2xl transition-all relative group border",
                selectedChat === chat.id
                  ? "bg-white dark:bg-primary/10 border-primary/40 shadow-xl shadow-primary/10"
                  : "bg-transparent border-transparent hover:bg-white/40 dark:hover:bg-primary/5"
              )}
            >
              {chat.unread && selectedChat !== chat.id && (
                <div className="absolute right-4 top-4 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"></div>
              )}
              <div className="flex gap-4 items-start">
                <div className="relative">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl overflow-hidden shadow-sm transition-transform duration-300 group-hover:scale-105 border-2",
                    selectedChat === chat.id ? "border-primary/40" : "border-outline-variant/10"
                  )}>
                    <img 
                      alt={chat.name} 
                      className="w-full h-full object-cover" 
                      src={chat.avatar} 
                    />
                  </div>
                  <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-white dark:bg-surface-container-high rounded-full flex items-center justify-center border border-outline-variant/20 shadow-lg">
                     <div className={cn("w-4 h-4 rounded-sm flex items-center justify-center text-[8px] text-white font-black italic", chat.companyColor)}>{chat.company}</div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className={cn(
                      "text-base font-black truncate pr-2",
                      selectedChat === chat.id ? "text-on-surface dark:text-foreground" : "text-on-surface/80 dark:text-foreground/80"
                    )}>{chat.name}</h3>
                    <span className="text-[10px] font-black text-on-surface-variant/60 dark:text-muted-foreground/60 whitespace-nowrap">{chat.time}</span>
                  </div>
                  <p className={cn(
                    "text-[10px] font-black uppercase tracking-[0.15em] mb-1 truncate",
                    selectedChat === chat.id ? "text-primary" : "text-on-surface-variant/70 dark:text-muted-foreground/70"
                  )}>{chat.role}</p>
                  <p className={cn(
                    "text-xs truncate font-bold",
                    selectedChat === chat.id ? "text-on-surface dark:text-foreground" : "text-on-surface-variant/60 dark:text-muted-foreground/60"
                  )}>{chat.lastMessage}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Right Pane: Active Chat Window */}
      <section className={`flex-1 flex-col h-full bg-surface-container-lowest dark:bg-background relative min-w-0 ${showChat ? 'flex' : 'hidden md:flex'}`}>
        {/* Chat Header */}
        <header className="h-20 md:h-24 border-b border-outline-variant/20 px-4 md:px-8 flex items-center justify-between bg-surface-container-lowest/80 dark:bg-background/80 backdrop-blur-xl sticky top-0 z-10">
          <div className="flex items-center gap-3 md:gap-5 overflow-hidden">
            <button 
              className="md:hidden p-2 -ml-2 rounded-full hover:bg-surface-container transition-colors flex-shrink-0"
              onClick={() => setShowChat(false)}
            >
              <ArrowLeft className="w-5 h-5 text-on-surface" />
            </button>
            <div className="w-10 h-10 md:w-16 md:h-16 rounded-full border-2 border-primary/20 p-0.5 shadow-sm flex-shrink-0">
              <img 
                alt="Sarah Jenkins" 
                className="w-full h-full rounded-full object-cover" 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" 
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg md:text-2xl font-bold text-on-surface dark:text-foreground flex items-center gap-2 tracking-tight truncate">
                Sarah Jenkins
                <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-primary fill-primary/10 flex-shrink-0" />
              </h2>
              <div className="flex items-center gap-2 text-on-surface-variant dark:text-muted-foreground text-[11px] md:text-[13px] font-medium mt-0.5 md:mt-1 truncate">
                <span className="truncate">Senior Recruiter @ Google</span>
                <span className="w-1 h-1 rounded-full bg-outline-variant hidden sm:block flex-shrink-0"></span>
                <button className="text-primary hover:underline items-center gap-1.5 font-bold tracking-tight hidden sm:flex flex-shrink-0">
                  Senior Software Engineer
                  <ExternalLink className="w-3 h-3 md:w-3.5 md:h-3.5" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <button className="hidden md:block px-6 py-2.5 rounded-full border border-outline-variant/30 text-on-surface dark:text-foreground font-bold text-sm hover:bg-surface-container transition-all shadow-sm ml-2">
              View Profile
            </button>
            <button className="sm:hidden p-2 text-on-surface-variant hover:text-on-surface transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Messages Area */}
        <div 
          className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-3 md:p-8 flex flex-col gap-4 md:gap-10 bg-surface-container-lowest dark:bg-background"
          style={{
            backgroundImage: `radial-gradient(var(--outline-variant) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0'
          }}
        >
          {/* Date Divider */}
          <div className="flex justify-center">
            <span className="px-4 py-1.5 md:px-5 md:py-2 rounded-full bg-surface-container/50 dark:bg-surface-container-high/30 backdrop-blur-sm text-on-surface-variant dark:text-muted-foreground font-bold text-[9px] md:text-[10px] uppercase tracking-widest border border-outline-variant/20 shadow-sm">Today, 9:30 AM</span>
          </div>

          {/* Recruiter Message (Received) */}
          <div className="flex gap-2 md:gap-4 max-w-[95%] md:max-w-[80%] group">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden flex-shrink-0 mt-auto border border-outline-variant/30 shadow-sm">
              <img 
                alt="Sarah" 
                className="w-full h-full object-cover" 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" 
              />
            </div>
            <div className="flex flex-col gap-1 md:gap-1.5">
              <span className="text-[9px] md:text-[11px] font-bold text-on-surface-variant dark:text-muted-foreground ml-2 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Sarah Jenkins</span>
              <div className="bg-white dark:bg-zinc-800 border border-outline-variant/30 p-4 md:p-5 rounded-2xl md:rounded-3xl rounded-bl-none shadow-md text-[13px] md:text-[15px] leading-relaxed text-on-surface dark:text-foreground">
                Hi there! Thanks for completing the initial coding assessment. The team was really impressed with your elegant solution to the graph problem.
              </div>
              <div className="bg-white dark:bg-zinc-800 border border-outline-variant/30 p-4 md:p-5 rounded-2xl md:rounded-3xl rounded-bl-none shadow-md text-[13px] md:text-[15px] leading-relaxed text-on-surface dark:text-foreground">
                We'd love to move forward and schedule a 60-minute system design round with one of our Staff Engineers. Do you have any availability this coming Thursday or Friday?
              </div>
            </div>
          </div>

          {/* Candidate Message (Sent) */}
          <div className="flex gap-2 md:gap-4 max-w-[95%] md:max-w-[80%] self-end flex-row-reverse group">
            <div className="flex flex-col gap-1 md:gap-1.5 items-end">
              <div className="flex items-center gap-2 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[9px] md:text-[11px] font-bold text-on-surface-variant dark:text-muted-foreground uppercase tracking-widest">10:15 AM</span>
                <CheckCheck className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-gradient-to-br from-primary to-secondary p-4 md:p-5 rounded-2xl md:rounded-3xl rounded-br-none shadow-lg text-[13px] md:text-[15px] leading-relaxed text-white">
                Hi Sarah, that's great news! I really enjoyed the assessment.
              </div>
              <div className="bg-gradient-to-br from-primary to-secondary p-4 md:p-5 rounded-2xl md:rounded-3xl rounded-br-none shadow-lg text-[13px] md:text-[15px] leading-relaxed text-white">
                I am available this Thursday after 2:00 PM PST, or anytime Friday morning before 11:00 AM PST. Let me know what works best for the team.
              </div>
            </div>
          </div>

          {/* Recruiter Message (Received) */}
          <div className="flex gap-2 md:gap-4 max-w-[95%] md:max-w-[80%] group">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden flex-shrink-0 mt-auto border border-outline-variant/30 shadow-sm">
              <img 
                alt="Sarah" 
                className="w-full h-full object-cover" 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" 
              />
            </div>
            <div className="flex flex-col gap-1 md:gap-1.5">
              <span className="text-[9px] md:text-[11px] font-bold text-on-surface-variant dark:text-muted-foreground ml-2 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Sarah Jenkins • 10:42 AM</span>
              <div className="bg-white dark:bg-zinc-800 border border-outline-variant/30 p-4 md:p-5 rounded-2xl md:rounded-3xl rounded-bl-none shadow-md text-[13px] md:text-[15px] leading-relaxed text-on-surface dark:text-foreground">
                That works perfectly. I'll send the calendar invite for Thursday at 3:00 PM PST shortly. Looking forward to it!
              </div>
            </div>
          </div>
        </div>
 
        {/* Input Area & AI Suggestions */}
        <div className="p-3 md:p-6 bg-surface-container-lowest dark:bg-background border-t border-outline-variant/20 flex flex-col gap-3 md:gap-5 w-full min-w-0">
          {/* AI Smart Replies */}
          <div className="flex items-center gap-2 md:gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-2 no-scrollbar">
            <div className="flex items-center gap-1.5 md:gap-2 text-primary px-1 md:px-2 flex-shrink-0">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 animate-pulse" />
              <span className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest whitespace-nowrap">AI Replies</span>
            </div>
            <button className="px-4 md:px-5 py-1.5 md:py-2 rounded-full border border-primary/20 bg-primary/5 dark:bg-primary/10 text-on-surface dark:text-foreground font-bold text-[12px] md:text-[13px] hover:bg-primary hover:text-white transition-all whitespace-nowrap shadow-sm flex items-center gap-2">
              Confirm Thursday at 3:00 PM
            </button>
            <button className="px-4 md:px-5 py-1.5 md:py-2 rounded-full border border-secondary/20 bg-secondary/5 dark:bg-secondary/10 text-on-surface dark:text-foreground font-bold text-[12px] md:text-[13px] hover:bg-secondary hover:text-white transition-all whitespace-nowrap shadow-sm flex items-center gap-2">
              Ask about the interviewer
            </button>
            <button className="px-4 md:px-5 py-1.5 md:py-2 rounded-full border border-outline-variant bg-surface-container dark:bg-surface-container-highest text-on-surface dark:text-foreground font-bold text-[12px] md:text-[13px] hover:bg-surface-container-high transition-all whitespace-nowrap shadow-sm flex items-center gap-2">
              Request preparation materials
            </button>
          </div>
 
          {/* Message Input */}
          <div className="flex items-end gap-2 md:gap-3 bg-surface-container-low/50 dark:bg-surface-container-high/30 p-1.5 md:p-2.5 rounded-2xl md:rounded-[2rem] border border-outline-variant/20 focus-within:border-primary/30 transition-colors shadow-inner">
            <button className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 flex items-center justify-center text-on-surface-variant dark:text-muted-foreground hover:text-primary hover:bg-surface-container-lowest dark:hover:bg-surface-container transition-all rounded-full">
              <Paperclip className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <textarea 
              className="flex-1 max-h-32 md:max-h-40 min-h-[40px] md:min-h-[48px] resize-none border-none focus:ring-0 bg-transparent text-sm md:text-base p-2 md:p-3 placeholder-outline-variant/80 dark:text-foreground [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] font-medium" 
              placeholder="Type your message..." 
              rows={1}
            ></textarea>
            <button className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-white rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all transform hover:scale-105 active:scale-95 shadow-md">
              <Send className="w-4 h-4 md:w-5 md:h-5 fill-current" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MessagesView;
