"use client";

import React from 'react';
import { motion } from 'framer-motion';

const Process = () => {
  const steps = [
    {
      number: 1,
      title: 'Upload',
      description:
        'Upload your resume and LinkedIn profile to start AI-powered career optimization.',
    },
    {
      number: 2,
      title: 'Optimize',
      description:
        'Use AI resume optimization tools to improve ATS score and recruiter visibility.',
    },
    {
      number: 3,
      title: 'Match',
      description:
        'Get matched with personalized job opportunities based on your skills and experience.',
    },
    {
      number: 4,
      title: 'Hired',
      description:
        'Prepare for interviews and negotiate confidently with AI career assistance.',
    },
  ];

  return (
    <section
      className="py-13 md:py-32 px-6 bg-surface-container-low/30 relative overflow-hidden"
      aria-labelledby="career-process-heading"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* SECTION HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2
            id="career-process-heading"
            className="text-4xl md:text-6xl font-bold text-on-surface mb-6"
          >
            Simple AI Career Success Process
          </h2>

          <p className="text-lg md:text-xl text-on-surface-variant max-w-3xl mx-auto">
            Follow four simple steps to improve your resume, discover better job
            opportunities, and accelerate your career growth using AI technology.
          </p>
        </motion.div>

        {/* PROCESS STEPS */}
        <div
          className="relative mt-12 md:mt-24"
          role="list"
          aria-label="AIJobFit career process steps"
        >
          <div
            className="hidden md:block path-line"
            aria-hidden="true"
          ></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.article
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative glass-card p-10 rounded-3xl text-center hover:scale-[1.05] transition-transform"
                role="listitem"
                aria-labelledby={`process-step-${step.number}`}
              >
                {/* STEP NUMBER */}
                <div
                  className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-4xl font-black text-white shadow-lg shadow-primary/20 -mt-16 mb-8"
                  aria-label={`Step ${step.number}`}
                >
                  {step.number}
                </div>

                {/* STEP CONTENT */}
                <h3
                  id={`process-step-${step.number}`}
                  className="text-2xl font-bold mb-4"
                >
                  {step.title}
                </h3>

                <p className="text-on-surface-variant">
                  {step.description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;