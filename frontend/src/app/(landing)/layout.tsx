import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import Navbar from '@/components/landing/layout/Navbar';
import Footer from '@/components/landing/layout/Footer';


const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'AI JobFit - Land Your Dream Job 10x Faster',
  description: 'AI Resume Analysis, Smart Job Matching, Mock Interviews & Career Growth. Stop applying blindly—start winning with precision.',
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.variable} font-sans bg-background text-on-background`}>
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
}
