"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';

const Newsletter = () => {
  return (
    <section className="py-13 md:py-32 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto glass-card rounded-[32px] md:rounded-[48px] p-8 md:p-24 text-center bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 shadow-2xl"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-2xl md:text-5xl font-bold mb-6"
        >
          Ready to elevate your career?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-on-surface-variant mb-12 max-w-2xl mx-auto"
        >
          Join 50,000+ tech professionals getting weekly career insights and AI hacks.
        </motion.p>
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
        >
          <input
            className="flex-1 px-6 py-4 rounded-xl border-outline-variant bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-lg shadow-sm dark:bg-zinc-900"
            placeholder="Enter your email"
            type="email"
          />
          <Button variant="gradient" size="lg" glow className="w-full sm:w-auto shadow-lg shadow-primary/20">
            Subscribe
          </Button>
        </motion.form>
      </motion.div>
    </section>
  );
};

export default Newsletter;
