"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  BrainCircuit,
  Video,
  Rocket,
  FileEdit,
  BarChart3
} from 'lucide-react';

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
    <section
      className="py-13 md:py-32 px-6 max-w-7xl mx-auto"
      aria-labelledby="features-heading"
      role="region"
    >
      {/* SEO Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 md:mb-24 max-w-3xl mx-auto"
      >
        <h2
          id="features-heading"
          className="text-4xl md:text-6xl font-extrabold text-on-surface mb-6 leading-tight"
        >
          Everything you need to{" "}
          <span className="text-gradient">
            break through.
          </span>
        </h2>

        <p className="text-xl text-on-surface-variant">
          Advanced AI-powered career tools for resume analysis,
          smart job matching, interview preparation, and career growth.
        </p>
      </motion.div>

      {/* FEATURE GRID */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"
      >
        {/* Large Feature 1 */}
        <motion.article
          variants={itemVariants}
          className="glass-card rounded-[32px] md:rounded-[40px] p-6 md:p-10 flex flex-col justify-between border-t-2 border-primary/20 hover:scale-[1.02] transition-transform"
          aria-labelledby="resume-analysis-heading"
        >
          <div className="mb-12">
            <div
              className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center text-primary mb-8 border border-primary/10"
              aria-hidden="true"
            >
              <BrainCircuit className="w-8 h-8" />
            </div>

            <h3
              id="resume-analysis-heading"
              className="text-3xl font-bold text-on-surface mb-4"
            >
              AI Resume Analysis
            </h3>

            <p className="text-lg text-on-surface-variant max-w-xl">
              Our AI-powered resume analyzer scans your resume against
              thousands of successful profiles and ATS systems to improve
              job application success rates.
            </p>
          </div>

          <div className="rounded-2xl shadow-xl w-full relative overflow-hidden h-[300px] md:h-[400px]">
            <Image
              className="object-cover"
              src="https://lh3.googleusercontent.com/aida/ADBb0uiRJe08cdOz4VqKpgRjNlP3VqMLzXUa75tanYzFWZwjg0aCQ-S8ZGidI6Lh_o-QN8UoZIY0VC0k0tgIQ5HaBjajUW_Gkt1W9bmxxGWwCRMGWk7pss5zDjP4243pfxGROAaOp9B0or92owMBh-eazep47MAeHzJn5_gIXQrkUHw05-WyNy0azVsRhz6SKafTVyJb8H-ChLfSXxnMH1pvAsey-ZMzeMbqB8jHZrjbJxV-QSEOsg85LETaQ3Aw48aLNhzWlxpIKrFy"
              alt="AI-powered resume analysis dashboard for ATS optimization"
              fill
              priority
              unoptimized
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </motion.article>

        {/* Large Feature 2 */}
        <motion.article
          variants={itemVariants}
          className="glass-card rounded-[32px] md:rounded-[40px] p-6 md:p-10 flex flex-col justify-between border-t-2 border-secondary/20 hover:scale-[1.02] transition-transform"
          aria-labelledby="mock-interview-heading"
        >
          <div className="mb-12">
            <div
              className="w-16 h-16 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl flex items-center justify-center text-secondary mb-8 border border-secondary/10"
              aria-hidden="true"
            >
              <Video className="w-8 h-8" />
            </div>

            <h3
              id="mock-interview-heading"
              className="text-2xl md:text-3xl font-bold text-on-surface mb-4"
            >
              AI Mock Interview
            </h3>

            <p className="text-lg text-on-surface-variant max-w-xl">
              Practice interviews with AI and receive real-time feedback on
              communication, confidence, body language, and answer quality.
            </p>
          </div>

          <div className="rounded-2xl shadow-xl w-full relative overflow-hidden h-[300px] md:h-[400px]">
            <Image
              className="object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgX7ICjQ4vt7AG_OJiexzs_hnmAZui3lArTS2Lu4qSgMa3Dh0KYOx59XM2uynRTUpYedy52Shsr3kZMnsuSD28jMw-oqBHEDTGsYPvxyvjds8EGl-XXHHDaGmjQrSS-XlCw2qNNh8Ru59hlFYbKYir6MVYLnwOowOfbehMLPQE5URzs3j91h-os71Qt9jEnn0m16uctwgUI2ie95MElutYXA3_noUa1iKuACdUjAG-8hChiR2NwBf0xTE2K8JDcIU-Fny0An3Ah5Q"
              alt="AI mock interview practice platform with real-time feedback"
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </motion.article>
      </motion.div>

      {/* SECOND ROW */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {/* Feature 3 */}
        <motion.article
          variants={itemVariants}
          className="glass-card rounded-[32px] md:rounded-[40px] p-6 md:p-10 border-t-2 border-tertiary-container/20 hover:bg-white/50 transition-colors"
          aria-labelledby="job-matching-heading"
        >
          <div
            className="w-16 h-16 bg-gradient-to-br from-tertiary-container/10 to-tertiary-container/5 rounded-2xl flex items-center justify-center text-tertiary mb-8 border border-tertiary-container/10"
            aria-hidden="true"
          >
            <Rocket className="w-8 h-8" />
          </div>

          <h3
            id="job-matching-heading"
            className="text-2xl font-bold text-on-surface mb-4"
          >
            Smart Job Matching
          </h3>

          <p className="text-on-surface-variant">
            AI-driven job recommendations based on your skills,
            experience, salary expectations, and career goals.
          </p>
        </motion.article>

        {/* Feature 4 */}
        <motion.article
          variants={itemVariants}
          className="glass-card rounded-[32px] md:rounded-[40px] p-6 md:p-10 border-t-2 border-primary/20 hover:bg-white/50 transition-colors"
          aria-labelledby="resume-optimization-heading"
        >
          <div
            className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center text-primary mb-8 border border-primary/10"
            aria-hidden="true"
          >
            <FileEdit className="w-8 h-8" />
          </div>

          <h3
            id="resume-optimization-heading"
            className="text-2xl font-bold text-on-surface mb-4"
          >
            Resume Optimization
          </h3>

          <p className="text-on-surface-variant">
            Improve resumes using recruiter-approved keywords,
            formatting, and ATS-friendly optimization techniques.
          </p>
        </motion.article>

        {/* Feature 5 */}
        <motion.article
          variants={itemVariants}
          className="glass-card rounded-[32px] md:rounded-[40px] p-6 md:p-10 border-t-2 border-secondary/20 hover:bg-white/50 transition-colors"
          aria-labelledby="career-analytics-heading"
        >
          <div
            className="w-16 h-16 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl flex items-center justify-center text-secondary mb-8 border border-secondary/10"
            aria-hidden="true"
          >
            <BarChart3 className="w-8 h-8" />
          </div>

          <h3
            id="career-analytics-heading"
            className="text-2xl font-bold text-on-surface mb-4"
          >
            Career Analytics
          </h3>

          <p className="text-on-surface-variant">
            Monitor application performance, interview progress,
            and hiring trends with advanced analytics.
          </p>
        </motion.article>
      </motion.div>
    </section>
  );
};

export default Features;