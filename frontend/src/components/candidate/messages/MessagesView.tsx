'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search, Edit3, Paperclip, Send,
  CheckCheck, ArrowLeft, Bot, X
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

// AI Smart Reply suggestions
const AI_REPLIES = [
  'Thanks for reaching out! I\'m very interested.',
  'Could we schedule a call to discuss further?',
  'I\'m available for an interview next week.',
];

const MessagesView = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const myId = user?._id || '';

  const { conversations, messages, activeConversationUserId, typingUsers, onlineUsers,
    isLoadingConversations, isLoadingMessages, isSending } =
    useSelector((state: RootState) => state.chat);

  const [showChat, setShowChat] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAiReplies, setShowAiReplies] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { sendTyping, stopTyping, markRead } = useChatSocket();

  // ─── Load conversations on mount ───────────────────────────────────
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

  // ─── Load messages when active conversation changes ─────────────────
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

  // ─── Auto-scroll to bottom ──────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  // ─── Handle send message ────────────────────────────────────────────
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

  // ─── Typing indicator ───────────────────────────────────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value);
    if (!activeConversationUserId) return;
    sendTyping(activeConversationUserId);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      stopTyping(activeConversationUserId);
    }, 2000);
  };

  // ─── Handle Enter key ───────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ─── Select a chat ──────────────────────────────────────────────────
  const handleSelectChat = (userId: string) => {
    dispatch(setActiveConversation(userId));
    setShowChat(true);
  };

  // ─── Helpers ────────────────────────────────────────────────────────
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
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diff < 604800000) return d.toLocaleDateString([], { weekday: 'short' });
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex h-[calc(100dvh-100px)] -m-4 md:-m-8 bg-surface-container-lowest dark:bg-background overflow-hidden animate-in fade-in duration-700">

      {/* ── Left Pane: Conversation List ────────────────────────────── */}
      <section className={cn(
        "w-full md:w-[360px] lg:w-[400px] border-r border-outline-variant/20 flex-col h-full bg-surface-container-low/50 backdrop-blur-md shadow-2xl",
        showChat ? "hidden md:flex" : "flex"
      )}>
        <div className="p-6 border-b border-outline-variant/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-black text-on-surface tracking-tight">Messages</h2>
            <button className="p-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-2xl transition-all group">
              <Edit3 size={20} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container/50 rounded-full border-none focus:ring-2 focus:ring-primary text-sm placeholder-outline transition-all"
              placeholder="Search conversations..."
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden p-3 flex flex-col gap-2">
          {isLoadingConversations ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 rounded-2xl bg-surface-container/40 animate-pulse">
                <div className="flex gap-3 items-center">
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-high" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-surface-container-high rounded w-3/4" />
                    <div className="h-2 bg-surface-container-high rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center py-16">
              <div className="p-5 bg-surface-container rounded-full">
                <Edit3 className="w-8 h-8 text-on-surface-variant/30" />
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
                  "w-full text-left p-4 rounded-2xl transition-all relative group border",
                  isSelected
                    ? "bg-white dark:bg-primary/10 border-primary/40 shadow-xl shadow-primary/10"
                    : "bg-transparent border-transparent hover:bg-white/40 dark:hover:bg-primary/5"
                )}
              >
                <div className="flex gap-4 items-start">
                  <div className="relative">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl overflow-hidden border-2",
                      isSelected ? "border-primary/40" : "border-outline-variant/10"
                    )}>
                      {photo ? (
                        <img alt={chat.user.fullname} className="w-full h-full object-cover" src={photo} />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-xl">
                          {chat.user.fullname[0]}
                        </div>
                      )}
                    </div>
                    {isOnline && (
                      <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-white rounded-full flex items-center justify-center border border-outline-variant/20 shadow-lg">
                        <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={cn(
                        "text-base font-black truncate pr-2",
                        isSelected ? "text-on-surface" : "text-on-surface/80"
                      )}>{chat.user.fullname}</h3>
                      <span className="text-[10px] font-black text-on-surface-variant/60 whitespace-nowrap">
                        {chat.lastMessage ? formatTime(chat.lastMessage.createdAt) : ''}
                      </span>
                    </div>
                    <p className={cn(
                      "text-xs truncate font-bold",
                      isTyping ? "text-primary italic animate-pulse" : "text-on-surface-variant/60"
                    )}>
                      {isTyping ? 'Typing...' : (chat.lastMessage?.content || 'Start a conversation')}
                    </p>
                    {chat.unreadCount > 0 && (
                      <div className="mt-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center ml-auto">
                        <span className="text-[9px] font-black text-white">{chat.unreadCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Right Pane: Active Chat ──────────────────────────────────── */}
      <section className={cn(
        "flex-1 flex-col h-full bg-surface-container-lowest relative min-w-0",
        showChat ? "flex" : "hidden md:flex"
      )}>
        {!activeConversationUserId ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
            <div className="p-6 bg-surface-container rounded-full">
              <Edit3 className="w-12 h-12 text-on-surface-variant/30" />
            </div>
            <div>
              <h3 className="text-xl font-black text-on-surface mb-2">Select a conversation</h3>
              <p className="text-sm text-on-surface-variant">Choose from your existing conversations or start a new one.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <header className="h-20 border-b border-outline-variant/20 px-4 md:px-8 flex items-center justify-between bg-white/80 dark:bg-background/80 backdrop-blur-xl sticky top-0 z-10">
              <div className="flex items-center gap-3 overflow-hidden">
                <button className="md:hidden p-2 rounded-full hover:bg-surface-container" onClick={() => setShowChat(false)}>
                  <ArrowLeft className="w-6 h-6 text-on-surface" />
                </button>
                <div className="w-12 h-12 rounded-2xl border-2 border-primary/20 overflow-hidden relative">
                  {getProfilePhoto(activeConvo?.user.profilePhoto) ? (
                    <img alt={activeConvo?.user.fullname} className="w-full h-full object-cover"
                      src={getProfilePhoto(activeConvo?.user.profilePhoto)!} />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black">
                      {activeConvo?.user.fullname?.[0] || '?'}
                    </div>
                  )}
                  {isActiveOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-black text-on-surface">{activeConvo?.user.fullname}</h2>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                    {isActiveTyping ? (
                      <span className="text-primary animate-pulse">Typing...</span>
                    ) : isActiveOnline ? (
                      <span className="text-emerald-600">● Online</span>
                    ) : 'Offline'}
                  </p>
                </div>
              </div>
            </header>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden p-4 md:p-8 flex flex-col gap-4 bg-surface-bright/30"
              style={{ backgroundImage: 'radial-gradient(var(--outline-variant) 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
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
                    <div key={msg._id} className={cn("flex gap-3 max-w-[80%]", isMine ? "self-end flex-row-reverse" : "self-start")}>
                      {!isMine && (
                        <div className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0 mt-auto border-2 border-primary/10">
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
                        "px-5 py-3 rounded-2xl text-sm leading-relaxed font-medium shadow-sm",
                        isMine
                          ? "gradient-button text-white rounded-tr-sm"
                          : "bg-white dark:bg-zinc-800 border border-outline-variant/20 text-on-surface rounded-tl-sm"
                      )}>
                        {msg.content}
                        {isMine && (
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <CheckCheck size={12} className={msg.isRead ? "text-white/80" : "text-white/40"} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              {/* Typing Indicator */}
              {isActiveTyping && (
                <div className="flex items-center gap-3 self-start animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="w-8 flex-shrink-0" />
                  <div className="bg-white/80 border border-outline-variant/10 px-5 py-3 rounded-2xl flex items-center gap-1.5 shadow-md">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* AI Smart Replies */}
            <AnimatePresence>
              {showAiReplies && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="px-4 md:px-8 py-3 border-t border-outline-variant/10 flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden"
                >
                  <div className="flex items-center gap-1.5 text-primary shrink-0">
                    <Bot size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">AI</span>
                  </div>
                  {AI_REPLIES.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => { setMessageInput(reply); setShowAiReplies(false); }}
                      className="shrink-0 px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-full text-xs font-bold text-primary hover:bg-primary/15 transition-all whitespace-nowrap"
                    >
                      {reply}
                    </button>
                  ))}
                  <button onClick={() => setShowAiReplies(false)} className="shrink-0 p-1 text-on-surface-variant hover:text-error rounded-full">
                    <X size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Area */}
            <footer className="p-4 md:p-6 bg-white dark:bg-background border-t border-outline-variant/10 z-20 shrink-0">
              <div className="flex items-end gap-3 bg-surface-container-low/50 rounded-2xl border border-outline-variant/20 focus-within:border-primary/40 transition-all p-2">
                <button className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-on-surface-variant hover:text-primary rounded-full transition-all">
                  <Paperclip size={20} />
                </button>
                <textarea
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none resize-none max-h-40 min-h-[44px] py-3 text-sm font-medium text-on-surface placeholder:text-on-surface-variant/50"
                  rows={1}
                  value={messageInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={handleSend}
                  disabled={!messageInput.trim() || isSending}
                  className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-white rounded-full hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} className="ml-0.5" />
                </button>
              </div>
              <p className="text-[10px] text-on-surface-variant/40 font-bold text-center mt-2 uppercase tracking-widest">
                Press Enter to send · Shift+Enter for new line
              </p>
            </footer>
          </>
        )}
      </section>
    </div>
  );
};

export default MessagesView;
