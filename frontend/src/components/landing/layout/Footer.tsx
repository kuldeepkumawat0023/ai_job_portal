"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="w-full py-13 md:py-24 px-6 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto border-t border-outline-variant/20 mt-13 md:mt-24"
    >
      <div className="flex flex-col items-center md:items-start gap-2 mb-12 md:mb-0">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20 transition-all duration-300">
            A
          </div>
          <span className="font-bold text-2xl tracking-tight text-gradient">
            AI JobFit
          </span>
        </Link>
        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] text-center md:text-left mt-4">
          © {new Date().getFullYear()} AI JobFit. Effortless Precision in Hiring.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-12">
        <Link href="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors font-medium">
          Privacy Policy
        </Link>
        <Link href="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors font-medium">
          Terms of Service
        </Link>
        <Link href="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors font-medium">
          Cookie Settings
        </Link>
        <Link href="#" className="text-sm text-on-surface-variant hover:text-primary transition-colors font-medium">
          Contact Us
        </Link>
      </div>
    </motion.footer>
  );
};

export default Footer;
