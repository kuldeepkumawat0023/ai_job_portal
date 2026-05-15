'use client';

import React from 'react';
import {
  UploadCloud,
  FolderOpen,
  ArrowRight,
  FileText,
  Sparkles,
  Calendar,
  Download,
  Frown,
  TerminalSquare,
  Bug,
  RefreshCw
} from 'lucide-react';

const ResumeAnalysisView = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Stepper Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 max-w-5xl mx-auto mb-10 sm:mb-16 shadow-sm">
        <div className="flex items-start justify-between relative px-2 sm:px-4 max-w-3xl mx-auto">
          {/* Connecting Lines */}
          <div className="absolute left-8 sm:left-14 right-8 sm:right-14 top-3 sm:top-4 -translate-y-1/2 h-0.5 bg-surface-variant -z-10"></div>
          <div className="absolute left-8 sm:left-14 top-3 sm:top-4 -translate-y-1/2 w-[25%] h-0.5 bg-primary -z-10"></div>

          {/* Step 1 */}
          <div className="flex flex-col items-center gap-1.5 sm:gap-2 w-16 sm:w-24">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs sm:text-sm shadow-[0_0_10px_rgba(70,72,212,0.4)]">1</div>
            <span className="text-[9px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest text-primary text-center leading-tight">Upload</span>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center gap-1.5 sm:gap-2 w-16 sm:w-24">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-surface text-on-surface-variant border-2 border-surface-variant flex items-center justify-center font-bold text-xs sm:text-sm">2</div>
            <span className="text-[9px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest text-on-surface-variant text-center leading-tight">Results</span>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center gap-1.5 sm:gap-2 w-16 sm:w-24">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-surface text-on-surface-variant border-2 border-surface-variant flex items-center justify-center font-bold text-xs sm:text-sm">3</div>
            <span className="text-[9px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest text-on-surface-variant text-center leading-tight">AI Suggestions</span>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center gap-1.5 sm:gap-2 w-16 sm:w-24">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-surface text-on-surface-variant border-2 border-surface-variant flex items-center justify-center font-bold text-xs sm:text-sm">4</div>
            <span className="text-[9px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest text-on-surface-variant text-center leading-tight">Interview Scripts</span>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <section className="glass-card rounded-2xl p-10 flex flex-col items-center justify-center text-center border-2 border-dashed border-primary/30 hover:border-primary transition-colors cursor-pointer group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="w-20 h-20 rounded-full bg-primary-container/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <UploadCloud className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-on-surface mb-2">Upload your resume</h2>
        <p className="text-on-surface-variant text-lg mb-8">Drag & drop your PDF or DOCX file here, or click to browse.</p>
        <button className="bg-surface border border-outline-variant text-primary font-medium text-sm px-8 py-3 rounded-xl hover:bg-surface-variant transition-colors shadow-sm flex items-center gap-2 relative z-10">
          <FolderOpen className="w-5 h-5" />
          Browse Files
        </button>
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant/70">Supported formats: PDF, DOCX (Max 5MB)</p>
      </section>

      {/* History Section */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-3xl font-bold text-on-surface">Resume History</h2>
            <p className="text-on-surface-variant text-base mt-1">Your previously analyzed documents.</p>
          </div>
          <button className="text-primary font-medium text-sm flex items-center gap-1 hover:underline">
            View All
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* History Card 1 */}
          <div className="glass-card rounded-xl p-6 flex flex-col hover:-translate-y-1 transition-transform cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
              <span className="bg-secondary-container/20 text-secondary text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                92% Match
              </span>
            </div>
            <h4 className="text-base font-bold text-on-surface mb-1 truncate">JSmith_Senior_Dev_2024.pdf</h4>
            <p className="text-on-surface-variant text-sm mb-6 flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Oct 24, 2024
            </p>
            <div className="mt-auto flex gap-2">
              <button className="flex-1 bg-primary text-on-primary font-medium text-xs py-2 rounded-lg hover:bg-primary/90 transition-colors">View Analysis</button>
              <button className="p-2 border border-outline-variant text-on-surface-variant rounded-lg hover:bg-surface-variant transition-colors" title="Download">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* History Card 2 */}
          <div className="glass-card rounded-xl p-6 flex flex-col hover:-translate-y-1 transition-transform cursor-pointer group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
              <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                78% Match
              </span>
            </div>
            <h4 className="text-base font-bold text-on-surface mb-1 truncate">Jane_Doe_Product_Manager_v2.docx</h4>
            <p className="text-on-surface-variant text-sm mb-6 flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Oct 15, 2024
            </p>
            <div className="mt-auto flex gap-2">
              <button className="flex-1 bg-surface border border-outline-variant text-primary font-medium text-xs py-2 rounded-lg hover:bg-surface-variant transition-colors">Re-analyze</button>
              <button className="p-2 border border-outline-variant text-on-surface-variant rounded-lg hover:bg-surface-variant transition-colors" title="Download">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Add a third card to show empty state/new upload prompt elegantly */}
          <div className="glass-card rounded-xl p-6 flex flex-col items-center justify-center text-center border-2 border-dashed border-outline-variant/50 hover:border-primary/50 transition-colors cursor-pointer opacity-70 hover:opacity-100 group">
            <div className="w-12 h-12 bg-surface-variant rounded-full flex items-center justify-center mb-3 text-on-surface-variant group-hover:text-primary transition-colors">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-on-surface mb-1">Analyze New Resume</h4>
            <p className="text-on-surface-variant text-xs">Upload another document</p>
          </div>
        </div>
      </section>

      {/* Diagnostics Panel */}
      <section className="glass-card rounded-xl p-6 border-l-4 border-l-secondary bg-surface-container-low mt-16 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <TerminalSquare className="w-5 h-5 text-secondary" />
              Resume History Debug
            </h3>
            <p className="text-on-surface-variant text-sm mt-1">System diagnostics and manual cache controls for AI parsing engine.</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-surface border border-outline-variant text-on-surface font-medium text-sm px-4 py-2 rounded-lg hover:bg-surface-variant transition-colors flex items-center gap-2 shadow-sm">
              <Bug className="w-4 h-4" />
              Run Diagnostics
            </button>
            <button className="bg-secondary/10 text-secondary font-medium text-sm px-4 py-2 rounded-lg hover:bg-secondary/20 transition-colors flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Force Refresh
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResumeAnalysisView;

