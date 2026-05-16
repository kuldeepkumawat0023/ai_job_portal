'use client';

import React, { useState } from 'react';
import { Bot, X, Send, Sparkles, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

const AIFloatingAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: 'Hi! I am your AI Career Coach. How can I help you accelerate your career today?' }
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    setChat([...chat, { role: 'user', content: message }]);
    setMessage('');
    
    // Simulate AI thinking
    setTimeout(() => {
      setChat(prev => [...prev, { 
        role: 'ai', 
        content: "That's a great question! Based on your profile and current market trends, I recommend focusing on System Design patterns and updating your portfolio with your recent React projects. Would you like me to generate a study plan for you?" 
      }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[500px] glass-card flex flex-col shadow-2xl border-primary/20 overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-primary to-secondary flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Bot size={20} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">AI Career Coach</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Online & Ready</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-surface-container-low/30">
              {chat.map((msg, i) => (
                <motion.div
                  initial={{ opacity: 0, x: msg.role === 'ai' ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className={cn(
                    "max-w-[85%] p-4 rounded-2xl text-sm shadow-sm",
                    msg.role === 'ai' 
                      ? "bg-white dark:bg-zinc-900 text-on-surface self-start rounded-tl-none border border-outline-variant/10" 
                      : "bg-primary text-white self-end rounded-tr-none ml-auto"
                  )}
                >
                  {msg.content}
                </motion.div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-zinc-900 border-t border-outline-variant/10">
              <div className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about your career, resume, or jobs..."
                  className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-primary transition-all"
                />
                <button
                  onClick={handleSend}
                  className="absolute right-2 top-1.5 p-2 bg-primary text-white rounded-lg hover:opacity-90 transition-all active:scale-95"
                >
                  <Send size={16} />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-center gap-2 opacity-40">
                <Sparkles size={10} className="text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Powered by GPT-4o</span>
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
          "w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 relative group ai-pulse",
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
            <X size={28} className="rotate-90" />
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
