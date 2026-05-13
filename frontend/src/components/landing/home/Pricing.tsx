"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/common/Button';

const Pricing = () => {
  return (
    <section className="py-13 md:py-32 px-6 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 md:mb-24"
      >
        <h2 className="text-4xl md:text-6xl font-bold text-on-surface mb-6">Choose Your Journey</h2>
        <p className="text-xl text-on-surface-variant">Scale your career with the right tools.</p>
      </motion.div>
      
      <div className="flex flex-col md:flex-row gap-12 justify-center items-stretch max-w-5xl mx-auto">
        {/* Free Plan */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex-1 max-w-md glass-card rounded-[40px] p-10 flex flex-col justify-between my-8 hover:scale-[1.02] transition-transform"
        >
          <div>
            <div className="mb-12">
              <h4 className="text-3xl font-bold mb-2">Free</h4>
              <p className="text-on-surface-variant text-lg">Perfect for getting started.</p>
            </div>
            <div className="text-5xl md:text-6xl font-black mb-12">$0<span className="text-xl text-on-surface-variant font-normal">/mo</span></div>
            <ul className="space-y-6 mb-12">
              <li className="flex items-center gap-4">
                <CheckCircle2 className="w-6 h-6 text-outline-variant" />
                <span className="text-lg">3 AI Resume Scans / mo</span>
              </li>
              <li className="flex items-center gap-4">
                <CheckCircle2 className="w-6 h-6 text-outline-variant" />
                <span className="text-lg">Basic Job Matching</span>
              </li>
              <li className="flex items-center gap-4">
                <CheckCircle2 className="w-6 h-6 text-outline-variant" />
                <span className="text-lg">Public Portfolio Page</span>
              </li>
            </ul>
          </div>
          <Button variant="outline" size="lg" className="w-full">
            Get Started
          </Button>
        </motion.div>

        {/* Premium Plan */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex-1 max-w-md bg-gradient-to-b from-surface to-primary/5 rounded-[40px] p-10 flex flex-col relative ai-pulse border-2 border-primary/30 shadow-2xl z-10 transform md:-translate-y-4 hover:scale-[1.05] transition-transform"
        >
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-primary to-secondary text-on-primary rounded-full text-[12px] uppercase tracking-widest font-bold shadow-lg">
            Most Popular
          </div>
          <div>
            <div className="mb-12">
              <h4 className="text-3xl font-bold mb-2 text-primary">Premium</h4>
              <p className="text-on-surface-variant text-lg">Everything you need to land it.</p>
            </div>
            <div className="text-5xl md:text-6xl font-black mb-12">$97<span className="text-xl text-on-surface-variant font-normal"> Lifetime</span></div>
            <ul className="space-y-6 mb-12">
              <li className="flex items-center gap-4">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                <span className="font-semibold text-lg">Unlimited Resume Optimization</span>
              </li>
              <li className="flex items-center gap-4">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                <span className="text-lg">Priority 99% Job Matching</span>
              </li>
              <li className="flex items-center gap-4">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                <span className="text-lg">AI Mock Interviews (Unlimited)</span>
              </li>
              <li className="flex items-center gap-4">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                <span className="text-lg">Salary Negotiation Assistant</span>
              </li>
            </ul>
          </div>
          <Button variant="gradient" size="lg" glow className="w-full mt-auto">
            Upgrade Now
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
