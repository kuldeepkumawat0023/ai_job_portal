"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/common/Button';

const Pricing = () => {
  return (
    <section
      className="py-13 md:py-32 px-6 max-w-7xl mx-auto"
      aria-labelledby="pricing-heading"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 md:mb-24"
      >
        <h2
          id="pricing-heading"
          className="text-4xl md:text-6xl font-bold text-on-surface mb-6"
        >
          Choose Your Career Growth Plan
        </h2>

        <p className="text-xl text-on-surface-variant">
          Select the best AI-powered job search and resume optimization plan for your career journey.
        </p>
      </motion.div>

      <div
        className="flex flex-col md:flex-row gap-12 justify-center items-stretch max-w-5xl mx-auto"
        role="list"
        aria-label="AIJobFit pricing plans"
      >
        {/* Free Plan */}
        <motion.article
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex-1 max-w-md glass-card rounded-[40px] p-10 flex flex-col justify-between my-8 hover:scale-[1.02] transition-transform"
          role="listitem"
          aria-labelledby="free-plan-heading"
        >
          <div>
            <header className="mb-12">
              <h3
                id="free-plan-heading"
                className="text-3xl font-bold mb-2"
              >
                Free Plan
              </h3>

              <p className="text-on-surface-variant text-lg">
                Perfect for beginners starting their AI-powered career journey.
              </p>
            </header>

            <div
              className="text-5xl md:text-6xl font-black mb-12"
              aria-label="Free pricing"
            >
              $0
              <span className="text-xl text-on-surface-variant font-normal">
                /mo
              </span>
            </div>

            <ul
              className="space-y-6 mb-12"
              aria-label="Free plan features"
            >
              <li className="flex items-center gap-4">
                <CheckCircle2
                  className="w-6 h-6 text-outline-variant"
                  aria-hidden="true"
                />
                <span className="text-lg">
                  3 AI Resume Scans per month
                </span>
              </li>

              <li className="flex items-center gap-4">
                <CheckCircle2
                  className="w-6 h-6 text-outline-variant"
                  aria-hidden="true"
                />
                <span className="text-lg">
                  Basic AI Job Matching
                </span>
              </li>

              <li className="flex items-center gap-4">
                <CheckCircle2
                  className="w-6 h-6 text-outline-variant"
                  aria-hidden="true"
                />
                <span className="text-lg">
                  Public Portfolio Profile
                </span>
              </li>
            </ul>
          </div>

          <Button
            variant="outline"
            size="lg"
            className="w-full"
            aria-label="Get started with free plan"
          >
            Get Started
          </Button>
        </motion.article>

        {/* Premium Plan */}
        <motion.article
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex-1 max-w-md bg-gradient-to-b from-surface to-primary/5 rounded-[40px] p-10 flex flex-col relative ai-pulse border-2 border-primary/30 shadow-2xl z-10 transform md:-translate-y-4 hover:scale-[1.05] transition-transform"
          role="listitem"
          aria-labelledby="premium-plan-heading"
        >
          <div
            className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-primary to-secondary text-on-primary rounded-full text-[12px] uppercase tracking-widest font-bold shadow-lg"
            aria-label="Most popular pricing plan"
          >
            Most Popular
          </div>

          <div>
            <header className="mb-12">
              <h3
                id="premium-plan-heading"
                className="text-3xl font-bold mb-2 text-primary"
              >
                Premium Plan
              </h3>

              <p className="text-on-surface-variant text-lg">
                Advanced AI tools to maximize your hiring success and career growth.
              </p>
            </header>

            <div
              className="text-5xl md:text-6xl font-black mb-12"
              aria-label="Premium pricing"
            >
              $97
              <span className="text-xl text-on-surface-variant font-normal">
                {" "}Lifetime
              </span>
            </div>

            <ul
              className="space-y-6 mb-12"
              aria-label="Premium plan features"
            >
              <li className="flex items-center gap-4">
                <CheckCircle2
                  className="w-6 h-6 text-primary"
                  aria-hidden="true"
                />
                <span className="font-semibold text-lg">
                  Unlimited AI Resume Optimization
                </span>
              </li>

              <li className="flex items-center gap-4">
                <CheckCircle2
                  className="w-6 h-6 text-primary"
                  aria-hidden="true"
                />
                <span className="text-lg">
                  Priority 99% AI Job Matching
                </span>
              </li>

              <li className="flex items-center gap-4">
                <CheckCircle2
                  className="w-6 h-6 text-primary"
                  aria-hidden="true"
                />
                <span className="text-lg">
                  Unlimited AI Mock Interviews
                </span>
              </li>

              <li className="flex items-center gap-4">
                <CheckCircle2
                  className="w-6 h-6 text-primary"
                  aria-hidden="true"
                />
                <span className="text-lg">
                  AI Salary Negotiation Assistant
                </span>
              </li>
            </ul>
          </div>

          <Button
            variant="gradient"
            size="lg"
            glow
            className="w-full mt-auto"
            aria-label="Upgrade to premium AIJobFit plan"
          >
            Upgrade Now
          </Button>
        </motion.article>
      </div>
    </section>
  );
};

export default Pricing;