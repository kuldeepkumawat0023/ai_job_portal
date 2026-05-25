"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Play } from 'lucide-react';

const VideoWalkthrough = () => {
  return (
    <section
      className="py-13 md:py-32 px-6 bg-surface"
      aria-labelledby="video-walkthrough-heading"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-card rounded-[48px] p-6 sm:p-12 md:p-16 border-t-2 border-primary/20 overflow-hidden relative shadow-2xl"
        >
          {/* Section Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-8 md:mb-16 max-w-2xl mx-auto"
          >
            <h2
              id="video-walkthrough-heading"
              className="text-3xl md:text-5xl font-bold text-on-surface mb-6"
            >
              Experience the Future of Hiring
            </h2>

            <p className="text-lg md:text-xl text-on-surface-variant">
              Watch this 60-second walkthrough to see how AI JobFit transforms
              your career journey with AI resume optimization, mock interviews,
              and smart job matching.
            </p>
          </motion.div>

          {/* Video Preview */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.5 }}
            className="relative group cursor-pointer rounded-[32px] overflow-hidden shadow-2xl aspect-video"
            role="button"
            tabIndex={0}
            aria-label="Play AI JobFit platform walkthrough video"
          >
            {/* Video Thumbnail */}
            <motion.div
              initial={{ filter: 'grayscale(0.5)' }}
              whileInView={{ filter: 'grayscale(0)' }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="w-full h-full relative"
            >
              <Image
                alt="AI JobFit platform video walkthrough dashboard preview"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8pkbhWMLe8B-bxRozS38bms08pI4dmyPUPKzggcX2sNmU-1yyGvusPuDxEq9jzI63EDnLjaOFvNzbEl9aDwTrFr09-7spTzlQZFzb80dX7DnQAmRqxnAuEO_ZbXwNAL69iB3ZSVsiU63IrHwJ_JJDEK6pZNoQjUzfh-hFuTG2CK8mwd2ydSwfWsZMCDVxLEQlgj0PTQi0hk7w09cUJeyyurJd1MnidcEljhAbslqNXciwR90D9JYk-KhzUDM4MCq5cBb0rVgGnGE"
                fill
                priority
                unoptimized
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            </motion.div>

            {/* Play Button Overlay */}
            <div
              className="absolute inset-0 flex items-center justify-center bg-on-surface/20 group-hover:bg-on-surface/10 transition-colors"
              aria-hidden="true"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-20 h-20 md:w-24 md:h-24 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl transform transition-transform"
              >
                <Play className="w-10 h-10 md:w-12 md:h-12 text-primary fill-primary" />
              </motion.div>
            </div>

            {/* Duration */}
            <div
              className="absolute bottom-6 right-6 px-4 py-1 bg-on-surface/80 backdrop-blur text-white rounded-lg text-xs font-bold"
              aria-label="Video duration 1 minute"
            >
              1:00
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoWalkthrough;