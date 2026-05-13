"use client";

import React from 'react';
import { motion } from 'framer-motion';

const Process = () => {
  const steps = [
    { number: 1, title: 'Upload', description: 'Drop your current resume and LinkedIn profile.' },
    { number: 2, title: 'Optimize', description: 'Let AI rewrite and polish every section for impact.' },
    { number: 3, title: 'Match', description: 'Connect with exclusive job openings tailored for you.' },
    { number: 4, title: 'Hired', description: 'Ace the interview and negotiate like a professional.' },
  ];

  return (
    <section className="py-13 md:py-32 px-6 bg-surface-container-low/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-on-surface mb-6">Simple Path to Success</h2>
          <p className="text-lg md:text-xl text-on-surface-variant">Four steps to transform your career from stagnant to stellar.</p>
        </motion.div>
        
        <div className="relative mt-12 md:mt-24">
          <div className="hidden md:block path-line"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div 
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative glass-card p-10 rounded-3xl text-center hover:scale-[1.05] transition-transform"
              >
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-4xl font-black text-white shadow-lg shadow-primary/20 -mt-16 mb-8">
                  {step.number}
                </div>
                <h4 className="text-2xl font-bold mb-4">{step.title}</h4>
                <p className="text-on-surface-variant">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
