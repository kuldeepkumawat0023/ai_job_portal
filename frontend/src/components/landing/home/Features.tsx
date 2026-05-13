"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { BrainCircuit, Video, Rocket, FileEdit, BarChart3 } from 'lucide-react';

const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section className="py-13 md:py-32 px-6 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 md:mb-24 max-w-3xl mx-auto"
      >
        <h2 className="text-4xl md:text-6xl font-extrabold text-on-surface mb-6 leading-tight">
          Everything you need to <span className="text-gradient">break through.</span>
        </h2>
        <p className="text-xl text-on-surface-variant">Advanced AI tools built for the modern career journey.</p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"
      >
        {/* Large Feature 1 */}
        <motion.div variants={itemVariants} className="glass-card rounded-[32px] md:rounded-[40px] p-6 md:p-10 flex flex-col justify-between border-t-2 border-primary/20 hover:scale-[1.02] transition-transform">
          <div className="mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center text-primary mb-8 border border-primary/10">
              <BrainCircuit className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-bold text-on-surface mb-4">AI Resume Analysis</h3>
            <p className="text-lg text-on-surface-variant max-w-xl">Our neural network scans your resume against thousands of high-performing profiles to identify gaps and optimize for ATS algorithms instantly.</p>
          </div>
          <div className="rounded-2xl shadow-xl w-full relative overflow-hidden h-[300px] md:h-[400px]">
            <Image 
              className="object-cover" 
              src="https://lh3.googleusercontent.com/aida/ADBb0uiRJe08cdOz4VqKpgRjNlP3VqMLzXUa75tanYzFWZwjg0aCQ-S8ZGidI6Lh_o-QN8UoZIY0VC0k0tgIQ5HaBjajUW_Gkt1W9bmxxGWwCRMGWk7pss5zDjP4243pfxGROAaOp9B0or92owMBh-eazep47MAeHzJn5_gIXQrkUHw05-WyNy0azVsRhz6SKafTVyJb8H-ChLfSXxnMH1pvAsey-ZMzeMbqB8jHZrjbJxV-QSEOsg85LETaQ3Aw48aLNhzWlxpIKrFy" 
              alt="AI Resume Analysis"
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </motion.div>
        
        {/* Large Feature 2 */}
        <motion.div variants={itemVariants} className="glass-card rounded-[32px] md:rounded-[40px] p-6 md:p-10 flex flex-col justify-between border-t-2 border-secondary/20 hover:scale-[1.02] transition-transform">
          <div className="mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl flex items-center justify-center text-secondary mb-8 border border-secondary/10">
              <Video className="w-8 h-8" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-on-surface mb-4">Mock Interview</h3>
            <p className="text-lg text-on-surface-variant max-w-xl">Practice with our empathetic AI interviewer. Get real-time feedback on your tone, body language, and answer quality.</p>
          </div>
          <div className="rounded-2xl shadow-xl w-full relative overflow-hidden h-[300px] md:h-[400px]">
            <Image 
              className="object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgX7ICjQ4vt7AG_OJiexzs_hnmAZui3lArTS2Lu4qSgMa3Dh0KYOx59XM2uynRTUpYedy52Shsr3kZMnsuSD28jMw-oqBHEDTGsYPvxyvjds8EGl-XXHHDaGmjQrSS-XlCw2qNNh8Ru59hlFYbKYir6MVYLnwOowOfbehMLPQE5URzs3j91h-os71Qt9jEnn0m16uctwgUI2ie95MElutYXA3_noUa1iKuACdUjAG-8hChiR2NwBf0xTE2K8JDcIU-Fny0An3Ah5Q" 
              alt="Mock Interview"
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Row 2 */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <motion.div variants={itemVariants} className="glass-card rounded-[32px] md:rounded-[40px] p-6 md:p-10 border-t-2 border-tertiary-container/20 hover:bg-white/50 transition-colors">
          <div className="w-16 h-16 bg-gradient-to-br from-tertiary-container/10 to-tertiary-container/5 rounded-2xl flex items-center justify-center text-tertiary mb-8 border border-tertiary-container/10">
            <Rocket className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-on-surface mb-4">Smart Job Matching</h3>
          <p className="text-on-surface-variant">We don't just search; we match. Only see jobs that fit your skills, salary, and values.</p>
        </motion.div>
        <motion.div variants={itemVariants} className="glass-card rounded-[32px] md:rounded-[40px] p-6 md:p-10 border-t-2 border-primary/20 hover:bg-white/50 transition-colors">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center text-primary mb-8 border border-primary/10">
            <FileEdit className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-on-surface mb-4">Resume Optimization</h3>
          <p className="text-on-surface-variant">Auto-rephrase bullet points using industry-proven power words that recruiters love.</p>
        </motion.div>
        <motion.div variants={itemVariants} className="glass-card rounded-[32px] md:rounded-[40px] p-6 md:p-10 border-t-2 border-secondary/20 hover:bg-white/50 transition-colors">
          <div className="w-16 h-16 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl flex items-center justify-center text-secondary mb-8 border border-secondary/10">
            <BarChart3 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-on-surface mb-4">Career Analytics</h3>
          <p className="text-on-surface-variant">Track your application progress with data-driven insights and market trends.</p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Features;
