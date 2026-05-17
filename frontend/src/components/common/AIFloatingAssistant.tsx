'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Sparkles, MessageCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { aiService } from '@/lib/services/ai.services';
import { toast } from 'react-hot-toast';

const AIFloatingAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const fetchHistory = async () => {
    try {
      const res = await aiService.getChatHistory();
      if (res.success && res.data?.length) {
        setChat(res.data.map((msg: any) => ({
          role: msg.role,
          content: msg.content
        })));
      } else if (!res.data?.length) {
        setChat([{ role: 'ai', content: 'Hi! I am your AI Career Coach. How can I help you accelerate your career today?' }]);
      }
    } catch (error) {
      console.error('Failed to fetch chat history');
    }
  };

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;
    
    const userMessage = message.trim();
    setChat(prev => [...prev, { role: 'user', content: userMessage }]);
    setMessage('');
    setIsLoading(true);
    
    try {
      const res = await aiService.chat(userMessage);
      if (res.success) {
        setChat(prev => [...prev, { role: 'ai', content: res.data || '' }]);
      }
    } catch (error: any) {
      toast.error('AI is currently unavailable. Please try again later.');
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[550px] glass-card flex flex-col shadow-2xl border-primary/20 overflow-hidden rounded-[2.5rem]"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-primary via-secondary to-tertiary flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                  <Bot size={20} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight">AI Career Coach</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-90">Active Now</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-surface-container-low/30">
              {chat.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i}
                  className={cn(
                    "max-w-[85%] p-4 rounded-3xl text-[13px] leading-relaxed shadow-sm",
                    msg.role === 'ai' 
                      ? "bg-white dark:bg-zinc-900 text-on-surface self-start rounded-tl-none border border-outline-variant/10" 
                      : "bg-primary text-white self-end rounded-tr-none ml-auto shadow-lg shadow-primary/20"
                  )}
                >
                  {msg.content}
                </motion.div>
              ))}
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="flex items-center gap-2 p-4 bg-white/50 dark:bg-zinc-900/50 rounded-2xl w-fit border border-outline-variant/5"
                >
                  <Loader2 size={14} className="animate-spin text-primary" />
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Thinking...</span>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-5 bg-white dark:bg-zinc-900 border-t border-outline-variant/10">
              <div className="relative group">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl py-4 pl-5 pr-14 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                />
                <button
                  disabled={!message.trim() || isLoading}
                  onClick={handleSend}
                  className={cn(
                    "absolute right-2 top-2 p-3 rounded-xl transition-all active:scale-95",
                    message.trim() && !isLoading 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "bg-surface-container-high text-on-surface-variant cursor-not-allowed"
                  )}
                >
                  <Send size={18} />
                </button>
              </div>
              <div className="mt-4 flex items-center justify-between px-1">
                <div className="flex items-center gap-2 opacity-40">
                  <Sparkles size={10} className="text-primary" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">GPT-4o Enhanced</span>
                </div>
                <span className="text-[9px] font-bold text-on-surface-variant/40 italic">History auto-clears every 24h</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 relative group ai-pulse z-[110]",
          isOpen 
            ? "bg-zinc-900 text-white" 
            : "bg-gradient-to-br from-primary via-secondary to-tertiary shadow-primary/40"
        )}
      >
        {/* Outer Glowing Rings */}
        {!isOpen && (
          <>
            <div className="absolute inset-0 rounded-full bg-primary/40 animate-ping scale-110 pointer-events-none" />
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary via-secondary to-tertiary opacity-30 blur-md group-hover:opacity-60 transition-opacity animate-spin-slow" />
          </>
        )}

        <div className="relative z-10">
          {isOpen ? (
            <X size={28} className="rotate-90 transition-transform duration-500" />
          ) : (
            <div className="relative">
              <Bot size={32} className="text-white" />
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.5, 1]
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles size={14} className="text-white fill-white" />
              </motion.div>
            </div>
          )}
        </div>
      </motion.button>
    </div>
  );
};

export default AIFloatingAssistant;
