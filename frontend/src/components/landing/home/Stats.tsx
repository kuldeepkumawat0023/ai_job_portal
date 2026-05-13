"use client";

import React from 'react';
import { motion } from 'framer-motion';

const Stats = () => {
  const stats = [
    { label: 'Candidates Placed', value: '50K+' },
    { label: 'Companies Hiring', value: '10K+' },
    { label: 'Apps Optimized', value: '1M+' },
    { label: 'AI PRECISION', value: '98%' },
  ];

  return (
    <section className="py-13 md:py-24 px-6 bg-surface-container-lowest border-y border-outline-variant/10">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="text-center"
          >
            <div className="text-5xl md:text-6xl font-black text-gradient mb-2 leading-none">
              {stat.value}
            </div>
            <div className="text-[12px] font-bold text-on-surface-variant uppercase tracking-[0.2em]">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
