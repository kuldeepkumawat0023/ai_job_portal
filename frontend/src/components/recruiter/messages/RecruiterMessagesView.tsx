'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search, Edit3, Paperclip, Send, CheckCheck,
  ArrowLeft, Bot, X, Briefcase, Star, Phone,
  Calendar, MoreHorizontal, Sparkles, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import {
  setConversations, setConversationsLoading,
  setMessages, setMessagesLoading,
  setActiveConversation, setSending,
} from '@/store/chatSlice';
import { chatService } from '@/lib/services/chat.services';
import { useChatSocket } from '@/hooks/useChatSocket';
import { useAuth } from '@/hooks/useAuth';
import { getBackendBaseUrl } from '@/lib/apiClient';

const AI_RECRUITER_REPLIES = [
  "Thank you for your interest! Let's schedule a call.",
  "I'd love to discuss your experience further. Are you available this week?",
  "Your profile looks great! Can you share more about your availability?",
  "We're moving forward with your application. Next steps coming soon.",
];

const RecruiterMessagesView = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const myId = user?._id || '';

  const { conversations, messages, activeConversationUserId, typingUsers, onlineUsers,
    isLoadingConversations, isLoadingMessages, isSending } =
    useSelector((state: RootState) => state.chat);

  const [showChat, setShowChat] = useState(false);
  const [showContextPanel, setShowContextPanel] = useState(true);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAiReplies, setShowAiReplies] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { sendTyping, stopTyping, markRead } = useChatSocket();

  // ─── Load conversations ────────────────────────────────────────────
  useEffect(() => {
    const loadChats = async () => {
      dispatch(setConversationsLoading(true));
      try {
        const res = await chatService.getMyChats();
        dispatch(setConversations(res.data || []));
      } catch (err) {
        console.error('Failed to load chats:', err);
        dispatch(setConversationsLoading(false));
      }
    };
    loadChats();
  }, [dispatch]);

  // ─── Load messages ──────────────────────────────────────────────────
  useEffect(() => {
    if (!activeConversationUserId) return;
    const loadMessages = async () => {
      dispatch(setMessagesLoading(true));
      try {
        const res = await chatService.getMessages(activeConversationUserId);
        dispatch(setMessages(res.data || []));
        markRead(activeConversationUserId);
      } catch (err) {
        console.error('Failed to load messages:', err);
        dispatch(setMessagesLoading(false));
      }
    };
    loadMessages();
  }, [activeConversationUserId, dispatch, markRead]);

  // ─── Auto-scroll ────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  // ─── Send message ───────────────────────────────────────────────────
  const handleSend = useCallback(async () => {
    if (!messageInput.trim() || !activeConversationUserId || isSending) return;
    const content = messageInput.trim();
    setMessageInput('');
    dispatch(setSending(true));
    stopTyping(activeConversationUserId);
    try {
      await chatService.sendMessage(activeConversationUserId, content);
    } catch (err) {
      console.error('Send failed:', err);
      dispatch(setSending(false));
    }
  }, [messageInput, activeConversationUserId, isSending, dispatch, stopTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value);
    if (!activeConversationUserId) return;
    sendTyping(activeConversationUserId);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => stopTyping(activeConversationUserId), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleSelectChat = (userId: string) => {
    dispatch(setActiveConversation(userId));
    setShowChat(true);
  };

  const getProfilePhoto = (photo?: string) => {
    if (!photo) return null;
    return photo.startsWith('http') ? photo : `${getBackendBaseUrl().replace('/api/v1', '')}${photo}`;
  };

  const activeConvo = conversations.find(c => c.user._id === activeConversationUserId);
  const isActiveOnline = activeConversationUserId ? onlineUsers.includes(activeConversationUserId) : false;
  const isActiveTyping = activeConversationUserId ? typingUsers.includes(activeConversationUserId) : false;

  const filteredConversations = conversations.filter(c =>
    c.user.fullname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const diff = new Date().getTime() - d.getTime();
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diff < 604800000) return d.toLocaleDateString([], { weekday: 'short' });
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex h-[calc(100dvh-100px)] -m-4 md:-m-8 overflow-hidden animate-in fade-in duration-700">

      {/* ── Left: Conversation List ──────────────────────────────────── */}
      <section className={cn(
        "w-full md:w-[340px] lg:w-[380px] border-r border-outline-variant/20 flex-col h-full glass-sidebar shrink-0",
        showChat ? "hidden md:flex" : "flex"
      )}>
        <div className="p-6 border-b border-outline-variant/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black text-on-surface tracking-tight">Talent Inbox</h2>
            <button className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all">
              <Edit3 size={18} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
            <input
              className="w-full pl-9 pr-4 py-2.5 bg-surface-container/50 rounded-full text-sm border-none focus:ring-2 focus:ring-primary placeholder-outline"
              placeholder="Search candidates..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden p-3 flex flex-col gap-1.5">
          {isLoadingConversations ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-3 rounded-xl animate-pulse flex gap-3">
                <div className="w-12 h-12 rounded-xl bg-surface-container" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-surface-container rounded w-3/4" />
                  <div className="h-2 bg-surface-container rounded w-1/2" />
                </div>
              </div>
            ))
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 py-16 gap-4 text-center">
              <div className="p-4 bg-surface-container rounded-full">
                <Edit3 className="w-7 h-7 text-on-surface-variant/30" />
              </div>
              <p className="text-sm font-bold text-on-surface-variant">No conversations yet</p>
            </div>
          ) : filteredConversations.map((chat) => {
            const isOnline = onlineUsers.includes(chat.user._id);
            const isTyping = typingUsers.includes(chat.user._id);
            const photo = getProfilePhoto(chat.user.profilePhoto);
            const isSelected = activeConversationUserId === chat.user._id;

            return (
              <button
                key={chat.user._id}
                onClick={() => handleSelectChat(chat.user._id)}
                className={cn(
                  "w-full text-left p-3.5 rounded-xl transition-all border",
                  isSelected
                    ? "bg-primary/10 border-primary/30 shadow-lg"
                    : "bg-transparent border-transparent hover:bg-surface-container/50"
                )}
              >
                <div className="flex gap-3 items-start">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-outline-variant/10">
                      {photo ? (
                        <img src={photo} alt={chat.user.fullname} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black">
                          {chat.user.fullname[0]}
                        </div>
                      )}
                    </div>
                    {isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center border border-outline-variant/10">
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h3 className="text-sm font-black text-on-surface truncate">{chat.user.fullname}</h3>
                      <span className="text-[10px] font-bold text-on-surface-variant/50 shrink-0">
                        {chat.lastMessage ? formatTime(chat.lastMessage.createdAt) : ''}
                      </span>
                    </div>
                    <p className={cn(
                      "text-xs truncate font-medium",
                      isTyping ? "text-primary animate-pulse italic" : "text-on-surface-variant/60"
                    )}>
                      {isTyping ? 'Typing...' : (chat.lastMessage?.content || 'Start a conversation')}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/40 bg-surface-container px-2 py-0.5 rounded-full">
                        {chat.user.role}
                      </span>
                      {chat.unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-primary text-white text-[9px] font-black flex items-center justify-center">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Center: Chat Window ──────────────────────────────────────── */}
      <section className={cn(
        "flex-1 flex-col h-full min-w-0 bg-surface-container-lowest/50",
        showChat ? "flex" : "hidden md:flex"
      )}>
        {!activeConversationUserId ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
            <div className="p-6 bg-primary/5 rounded-full border-2 border-dashed border-primary/20">
              <Briefcase className="w-12 h-12 text-primary/40" />
            </div>
            <div>
              <h3 className="text-xl font-black text-on-surface mb-2">Select a candidate</h3>
              <p className="text-sm text-on-surface-variant">Open a conversation from your Talent Inbox.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Header */}
            <header className="h-[70px] border-b border-outline-variant/20 px-4 md:px-6 flex items-center justify-between bg-white/80 dark:bg-background/80 backdrop-blur-xl z-10 shrink-0">
              <div className="flex items-center gap-3">
                <button className="md:hidden p-2 rounded-full hover:bg-surface-container" onClick={() => setShowChat(false)}>
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-primary/20 relative">
                  {getProfilePhoto(activeConvo?.user.profilePhoto) ? (
                    <img src={getProfilePhoto(activeConvo?.user.profilePhoto)!} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-sm">
                      {activeConvo?.user.fullname?.[0]}
                    </div>
                  )}
                  {isActiveOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div>
                  <h2 className="text-base font-black text-on-surface">{activeConvo?.user.fullname}</h2>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                    {isActiveTyping ? <span className="text-primary animate-pulse">Typing...</span>
                      : isActiveOnline ? <span className="text-emerald-600">● Online</span>
                      : '● Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-xl hover:bg-surface-container transition-all text-on-surface-variant hover:text-primary">
                  <Phone size={18} />
                </button>
                <button className="p-2 rounded-xl hover:bg-surface-container transition-all text-on-surface-variant hover:text-primary">
                  <Calendar size={18} />
                </button>
                <button
                  onClick={() => setShowContextPanel(v => !v)}
                  className={cn(
                    "p-2 rounded-xl transition-all",
                    showContextPanel ? "bg-primary/10 text-primary" : "hover:bg-surface-container text-on-surface-variant"
                  )}
                >
                  <Sparkles size={18} />
                </button>
                <button className="p-2 rounded-xl hover:bg-surface-container transition-all text-on-surface-variant">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </header>

            {/* Body: Messages + Context Panel */}
            <div className="flex flex-1 overflow-hidden">
              {/* Messages */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden p-4 md:p-6 flex flex-col gap-3"
                  style={{ backgroundImage: 'radial-gradient(var(--outline-variant) 1px, transparent 1px)', backgroundSize: '28px 28px' }}>
                  {isLoadingMessages ? (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      </div>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMine = msg.senderId === myId;
                      return (
                        <div key={msg._id} className={cn("flex gap-2 max-w-[75%]", isMine ? "self-end flex-row-reverse" : "self-start")}>
                          {!isMine && (
                            <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 mt-auto border border-primary/10">
                              {getProfilePhoto(activeConvo?.user.profilePhoto) ? (
                                <img src={getProfilePhoto(activeConvo?.user.profilePhoto)!} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-black">
                                  {activeConvo?.user.fullname?.[0]}
                                </div>
                              )}
                            </div>
                          )}
                          <div className={cn(
                            "px-4 py-2.5 rounded-2xl text-sm leading-relaxed font-medium shadow-sm max-w-full",
                            isMine
                              ? "gradient-button text-white rounded-tr-sm"
                              : "bg-white dark:bg-zinc-800 border border-outline-variant/20 text-on-surface rounded-tl-sm"
                          )}>
                            {msg.content}
                            {isMine && (
                              <div className="flex items-center justify-end gap-1 mt-0.5">
                                <CheckCheck size={11} className={msg.isRead ? "text-white/80" : "text-white/40"} />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}

                  {isActiveTyping && (
                    <div className="flex items-center gap-2 self-start animate-in fade-in slide-in-from-left-2 duration-300">
                      <div className="w-8 h-8 rounded-xl overflow-hidden border border-primary/10">
                        {getProfilePhoto(activeConvo?.user.profilePhoto) ? (
                          <img src={getProfilePhoto(activeConvo?.user.profilePhoto)!} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-black">
                            {activeConvo?.user.fullname?.[0]}
                          </div>
                        )}
                      </div>
                      <div className="bg-white/80 border border-outline-variant/10 px-4 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-md">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* AI Recruiter Replies */}
                <AnimatePresence>
                  {showAiReplies && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      className="px-4 py-2 border-t border-outline-variant/10 flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden bg-white/40 dark:bg-background/40 backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-1 text-primary shrink-0">
                        <Bot size={13} />
                        <span className="text-[9px] font-black uppercase tracking-widest">AI</span>
                      </div>
                      {AI_RECRUITER_REPLIES.map(reply => (
                        <button key={reply}
                          onClick={() => { setMessageInput(reply); setShowAiReplies(false); }}
                          className="shrink-0 px-3 py-1 bg-primary/5 border border-primary/15 rounded-full text-[11px] font-bold text-primary hover:bg-primary/10 transition-all whitespace-nowrap"
                        >
                          {reply}
                        </button>
                      ))}
                      <button onClick={() => setShowAiReplies(false)} className="shrink-0 text-on-surface-variant hover:text-error">
                        <X size={13} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Input */}
                <footer className="p-4 bg-white dark:bg-background border-t border-outline-variant/10 shrink-0">
                  <div className="flex items-end gap-2 bg-surface-container-low/60 rounded-2xl border border-outline-variant/20 focus-within:border-primary/30 transition-all p-2">
                    <button className="w-9 h-9 shrink-0 flex items-center justify-center text-on-surface-variant hover:text-primary rounded-full transition-all">
                      <Paperclip size={18} />
                    </button>
                    <textarea
                      placeholder="Message candidate..."
                      className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none resize-none max-h-32 min-h-[40px] py-2.5 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50"
                      rows={1}
                      value={messageInput}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!messageInput.trim() || isSending}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={16} className="ml-0.5" />
                    </button>
                  </div>
                </footer>
              </div>

              {/* ── Right: Candidate Context Panel ────────────────────── */}
              <AnimatePresence>
                {showContextPanel && (
                  <motion.aside
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 280, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-l border-outline-variant/20 h-full overflow-y-auto [&::-webkit-scrollbar]:hidden bg-surface-container-low/30 backdrop-blur-md flex-shrink-0 hidden lg:block"
                  >
                    <div className="p-5 space-y-5">
                      {/* Candidate Card */}
                      <div className="text-center space-y-3 pt-2">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto border-2 border-primary/20">
                          {getProfilePhoto(activeConvo?.user.profilePhoto) ? (
                            <img src={getProfilePhoto(activeConvo?.user.profilePhoto)!} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-xl">
                              {activeConvo?.user.fullname?.[0]}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-on-surface">{activeConvo?.user.fullname}</h3>
                          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                            {activeConvo?.user.role}
                          </p>
                          <div className={cn(
                            "mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                            isActiveOnline ? "bg-emerald-500/10 text-emerald-600" : "bg-surface-container text-on-surface-variant"
                          )}>
                            <div className={cn("w-1.5 h-1.5 rounded-full", isActiveOnline ? "bg-emerald-500 animate-pulse" : "bg-on-surface-variant/30")} />
                            {isActiveOnline ? 'Online Now' : 'Offline'}
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="space-y-2">
                        <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Quick Actions</p>
                        {[
                          { label: 'Schedule Interview', icon: Calendar, color: 'text-primary bg-primary/10' },
                          { label: 'Move to Shortlist', icon: Star, color: 'text-secondary bg-secondary/10' },
                          { label: 'View Application', icon: Briefcase, color: 'text-tertiary bg-tertiary/10' },
                        ].map(({ label, icon: Icon, color }) => (
                          <button key={label}
                            className={cn(
                              "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] border border-transparent hover:border-outline-variant/20",
                              color
                            )}
                          >
                            <Icon size={14} />
                            {label}
                            <ChevronRight size={12} className="ml-auto opacity-50" />
                          </button>
                        ))}
                      </div>

                      {/* AI Insights */}
                      <div className="glass-card rounded-2xl p-4 border border-primary/10 space-y-3">
                        <div className="flex items-center gap-2">
                          <Sparkles size={14} className="text-primary" />
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest">AI Insight</p>
                        </div>
                        <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
                          This candidate's profile matches the open Senior Engineer role at <strong className="text-on-surface">92%</strong>. Recommended for fast-track.
                        </p>
                      </div>
                    </div>
                  </motion.aside>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default RecruiterMessagesView;
