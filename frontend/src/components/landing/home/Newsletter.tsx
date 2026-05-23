"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';

const Newsletter = () => {
  return (
    <section
      className="py-13 md:py-32 px-6"
      aria-labelledby="newsletter-heading"
      role="region"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto glass-card rounded-[32px] md:rounded-[48px] p-8 md:p-24 text-center bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 shadow-2xl"
      >
        {/* SEO Heading */}
        <motion.h2
          id="newsletter-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-2xl md:text-5xl font-bold mb-6"
        >
          Ready to elevate your career?
        </motion.h2>

        {/* SEO Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-on-surface-variant mb-12 max-w-2xl mx-auto"
        >
          Join 50,000+ professionals receiving AI career insights,
          resume tips, interview preparation strategies,
          and smart job matching updates from AIJobFit.
        </motion.p>

        {/* Newsletter Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
          role="form"
          aria-label="Newsletter subscription form"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Enter your email address
          </label>

          <input
            id="newsletter-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            aria-required="true"
            aria-label="Email address"
            placeholder="Enter your email"
            className="flex-1 px-6 py-4 rounded-xl border-outline-variant bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-lg shadow-sm dark:bg-zinc-900"
          />

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            glow
            aria-label="Subscribe to AIJobFit newsletter"
            className="w-full sm:w-auto shadow-lg shadow-primary/20"
          >
            Subscribe
          </Button>
        </motion.form>
      </motion.div>
    </section>
  );
};

export default Newsletter;