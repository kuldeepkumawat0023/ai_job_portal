"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Sparkles, FileText, TrendingUp } from 'lucide-react';
import { Button } from '@/components/common/Button';

const Hero = () => {
  return (
    <section className="hero-gradient relative min-h-[90vh] flex flex-col justify-center items-center px-6 text-center overflow-hidden py-13 md:py-24">
      <div className="max-w-5xl z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1 bg-white/50 backdrop-blur-md border border-primary/20 rounded-full mb-8 shadow-sm dark:bg-white/5 dark:border-white/10"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-[12px] font-semibold tracking-wider text-primary uppercase">NEW: AI MOCK INTERVIEWS v2.0</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-7xl font-extrabold text-on-surface mb-8 tracking-tight leading-tight"
        >
          Land Your Dream Job <br />
          <span className="text-gradient italic pr-2">10x Faster</span> with AI
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-on-surface-variant mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          AI Resume Analysis, Smart Job Matching, Mock Interviews & Career Growth. Stop applying blindly—start winning with precision.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button variant="gradient" size="lg" glow className="w-full sm:w-auto gap-2">
            <FileText className="w-5 h-5" />
            Analyze Resume
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/50 backdrop-blur dark:bg-white/5">
            Sign Up Free
          </Button>
        </motion.div>
      </div>

      {/* Floating Mockup Area */}
      <div className="mt-12 md:mt-24 relative w-full max-w-5xl h-[250px] sm:h-[400px] md:h-[500px]">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none"></div>
        
        {/* Central Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute left-1/2 top-0 -translate-x-1/2 w-full md:w-[90%] rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl border border-white/40 aspect-video"
        >
          <Image 
            className="object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlmxSN9EF2eCAvEgZqiKuLMgL0w-XwdYtBpnhWTByRH6K0Z4WolKFuNZIZgoR5sjsN4TgUzHFFH_qQWIs2I0KiaxT4Rg68sT8dlgwsy4Ytmplq3vA55u629HuY0vB_tEkt3dJugItN5ZqvA_ZRjoS6I2MVUyqegDJCvxPnZn8xRwHdKYO-K7XQa-7OqGpJ6Wxye8xzTqremcVM23s06rgBuKC-VWqmNJZT8BUU3rcuGBapX4Je3HmmzWFVYx4Q5I2b3omXf1RVUy4" 
            alt="AI JobFit Dashboard"
            fill
            priority
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
          />
        </motion.div>

        {/* Floating Widget 1: Score */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute top-10 -left-4 md:-left-10 z-20 floating-widget hidden sm:block"
        >
          <div className="glass-card rounded-2xl p-6 w-64">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">RESUME SCORE</span>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div className="text-4xl font-bold text-primary">89<span className="text-base text-on-surface-variant font-normal">/100</span></div>
            <div className="w-full bg-surface-container-high h-2 rounded-full mt-4">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '89%' }}
                transition={{ duration: 1, delay: 2 }}
                className="bg-primary h-full rounded-full"
              ></motion.div>
            </div>
          </div>
        </motion.div>

        {/* Floating Widget 2: Match */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="absolute top-40 -right-4 md:-right-5 z-20 floating-widget-delayed hidden sm:block"
        >
          <div className="glass-card rounded-2xl p-6 border-l-4 border-secondary w-72 text-left">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 rounded-lg relative overflow-hidden">
                <Image 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDO6TfnkeSjxwBQYAC66bSf8ZjZdN2ZO_Foet2i9lYpQm6DyaEVTtJb7JjyAAz0WjqXwGkIrA5d5fPKDMgcFWZDbC8j-rDYZufmyBds7XuBXWXdVBheJZM45TWD2ukcVOb79ZhnhDCyidPJM519yQGUf1M6C2VjCdnAb3-TvGFwl1fQojrPp3PrmGrpgK7FyUl0WFsX6sUZmz-4Xy0YACXUJNC-KYJv0qN8CDqjGgNEVpf--ZxNemhRvj34C5Zpof04JC82Hq7S4bA" 
                  alt="Linear logo" 
                  fill
                  unoptimized
                  sizes="40px"
                />
              </div>
              <div>
                <div className="font-bold text-on-surface text-lg">Linear</div>
                <div className="text-[10px] uppercase font-semibold text-on-surface-variant tracking-wider">San Francisco, CA</div>
              </div>
            </div>
            <div className="text-xl font-bold text-on-surface mt-4">Product Designer</div>
            <div className="mt-4 flex gap-2">
              <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-md text-[10px] font-bold">96% MATCH</span>
              <span className="px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-md text-[10px] font-bold">REMOTE</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
