'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  UploadCloud,
  FolderOpen,
  ArrowRight,
  FileText,
  Sparkles,
  Calendar,
  Download,
  TerminalSquare,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  BrainCircuit,
  Target,
  Trophy,
  Trash2,
  FileSearch,
  MessageSquare,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { resumeService, Resume } from '@/lib/services/resume.services';
import { aiService } from '@/lib/services/ai.services';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import DeleteModal from '@/components/common/DeleteModal';
import { toast } from 'react-hot-toast';
import { cn } from '@/utils/cn';

import { jsPDF } from 'jspdf';

const ResumeAnalysisView = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [history, setHistory] = useState<Resume[]>([]);
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const [interviewQuestions, setInterviewQuestions] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Custom Delete Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const generatePDFReport = async (data: Resume) => {
    toast.loading('Generating AI Analysis Report...', { id: 'pdf-gen' });
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth(); // 210
      const pageHeight = doc.internal.pageSize.getHeight(); // 297
      const margin = 15;
      const contentWidth = pageWidth - margin * 2; // 180

      const userName = user?.fullname || 'Candidate';
      const rawFileName = data.fileUrl ? data.fileUrl.split('/').pop() || 'resume.pdf' : 'resume.pdf';
      const cleanFileName = rawFileName.replace(/^[a-f0-9]+_/gi, '');

      // ─── Header: Premium Deep Navy Block ───
      doc.setFillColor(70, 72, 212); // Primary app color
      doc.rect(0, 0, pageWidth, 35, 'F');

      // Accent line
      doc.setFillColor(129, 39, 207); // Secondary app color
      doc.rect(0, 34, pageWidth, 1, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('AI RESUME SCAN & ATS ANALYSIS', margin, 14);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(200, 210, 230);
      doc.text(`CANDIDATE: ${userName.toUpperCase()}   |   FILE: ${cleanFileName.toUpperCase()}`, margin, 21);
      doc.text(`DATE GENERATED: ${new Date(data.updatedAt || Date.now()).toLocaleDateString()}   |   POWERED BY AI JOB PORTAL`, margin, 26);

      // Right-aligned status badge in header
      doc.setFillColor(129, 39, 207, 0.2);
      doc.setDrawColor(129, 39, 207);
      doc.roundedRect(pageWidth - margin - 32, 10, 32, 7, 1.5, 1.5, 'FD');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'bold');
      doc.text('SCAN COMPLETE', pageWidth - margin - 16, 14.8, { align: 'center' });

      // ─── Background Watermark Image ───
      const logoImg = new Image();
      logoImg.src = '/images/logo/logoimage.png';
      await new Promise((resolve) => {
        logoImg.onload = resolve;
        logoImg.onerror = resolve;
      });

      if (logoImg.complete && logoImg.naturalWidth > 0) {
        doc.saveGraphicsState();
        doc.setGState(new (doc as any).GState({ opacity: 0.1 }));
        const imgWidth = 140;
        const imgHeight = (logoImg.naturalHeight / logoImg.naturalWidth) * imgWidth;
        doc.addImage(logoImg, 'PNG', (pageWidth - imgWidth) / 2, (pageHeight - imgHeight) / 2 + 10, imgWidth, imgHeight);
        doc.restoreGraphicsState();
      } else {
        // Fallback
        doc.saveGraphicsState();
        doc.setGState(new (doc as any).GState({ opacity: 0.1 }));
        doc.setTextColor(239, 68, 68);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(110);
        doc.text('AI Job Fit', pageWidth / 2, pageHeight / 2 + 10, { align: 'center', angle: 45 });
        doc.restoreGraphicsState();
      }

      let yPos = 46;

      // ─── Row 1: ATS Score & Executive Summary ───
      // Left: ATS Score Block
      doc.setFillColor(243, 246, 252);
      doc.setDrawColor(220, 228, 242);
      doc.roundedRect(margin, yPos, 45, 26, 2, 2, 'FD');

      doc.setTextColor(71, 85, 105);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text('ATS READINESS SCORE', margin + 22.5, yPos + 6, { align: 'center' });

      const score = data.score || 0;
      if (score >= 80) doc.setTextColor(22, 163, 74);
      else if (score >= 60) doc.setTextColor(217, 119, 6);
      else doc.setTextColor(220, 38, 38);

      doc.setFontSize(26);
      doc.text(`${score}%`, margin + 22.5, yPos + 18, { align: 'center' });

      // Right: Executive Summary Block
      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.text('EXECUTIVE AI SUMMARY', margin + 53, yPos + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);

      const summaryText = data.summary || 'Resume successfully scanned and parsed by AI JobFit engine.';
      const summaryLines = doc.splitTextToSize(summaryText, contentWidth - 53);
      doc.text(summaryLines, margin + 53, yPos + 11);

      yPos += 34;

      // Divider Line
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, yPos, pageWidth - margin, yPos);

      yPos += 6;

      // ─── Row 2: Strengths & Weaknesses (2-column layout) ───
      const colWidth = (contentWidth - 8) / 2; // 86mm each

      // Column Left: Key Strengths
      doc.setTextColor(70, 72, 212);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.text('KEY STRENGTHS', margin, yPos);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);

      let strengthY = yPos + 6;
      const strengthsList = data.strengths && data.strengths.length > 0 ? data.strengths : ['Standard Resume Formatting', 'Structured Layout', 'Parsed Core Competencies'];
      strengthsList.slice(0, 3).forEach((strength) => {
        doc.setFillColor(129, 39, 207);
        doc.circle(margin + 2, strengthY - 1, 0.8, 'F');

        const wrappedStr = doc.splitTextToSize(strength, colWidth - 6);
        doc.text(wrappedStr, margin + 5, strengthY);
        strengthY += wrappedStr.length * 4 + 2;
      });

      // Column Right: Areas to Improve
      doc.setTextColor(70, 72, 212);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.text('AREAS TO IMPROVE', margin + colWidth + 8, yPos);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);

      let weaknessY = yPos + 6;
      const weaknessesList = data.weaknesses && data.weaknesses.length > 0 ? data.weaknesses : ['Include Quantifiable Metrics', 'Keyword Placement', 'ATS Formatting Alignment'];
      weaknessesList.slice(0, 3).forEach((weakness) => {
        doc.setFillColor(239, 68, 68);
        doc.circle(margin + colWidth + 10, weaknessY - 1, 0.8, 'F');

        const wrappedWeak = doc.splitTextToSize(weakness, colWidth - 6);
        doc.text(wrappedWeak, margin + colWidth + 13, weaknessY);
        weaknessY += wrappedWeak.length * 4 + 2;
      });

      yPos = Math.max(strengthY, weaknessY) + 4;

      // Divider Line
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, yPos, pageWidth - margin, yPos);

      yPos += 6;

      // ─── Row 3: Recommended Roles & Top Skills (2-column layout) ───
      // Column Left: Recommended Roles
      doc.setTextColor(70, 72, 212);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.text('RECOMMENDED CAREER PATHS', margin, yPos);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);

      let rolesY = yPos + 6;
      const rolesList = data.recommendedRoles && data.recommendedRoles.length > 0 ? data.recommendedRoles : ['Software Engineer', 'Full Stack Developer'];
      rolesList.slice(0, 3).forEach((role) => {
        doc.setFillColor(70, 72, 212);
        doc.circle(margin + 2, rolesY - 1, 0.8, 'F');
        doc.text(role, margin + 5, rolesY);
        rolesY += 5;
      });

      // Column Right: Top Skills
      doc.setTextColor(70, 72, 212);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.text('DETECTED PRIMARY SKILLS', margin + colWidth + 8, yPos);

      let skillsY = yPos + 5;
      const skillsList = data.skills && data.skills.length > 0 ? data.skills : ['JavaScript', 'React', 'Node.js', 'HTML5', 'CSS3'];

      let chipX = margin + colWidth + 8;
      let chipY = skillsY;
      doc.setFontSize(7.5);

      skillsList.slice(0, 10).forEach((skill) => {
        const textWidth = doc.getTextWidth(skill);
        const chipWidth = textWidth + 4;
        const chipHeight = 5.5;

        if (chipX + chipWidth > pageWidth - margin) {
          chipX = margin + colWidth + 8;
          chipY += chipHeight + 2;
        }

        doc.setFillColor(241, 245, 249);
        doc.setDrawColor(203, 213, 225);
        doc.roundedRect(chipX, chipY, chipWidth, chipHeight, 1, 1, 'FD');
        doc.setTextColor(51, 65, 85);
        doc.text(skill, chipX + 2, chipY + 4);

        chipX += chipWidth + 2;
      });

      yPos = Math.max(rolesY, chipY + 10) + 2;

      // Divider Line
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, yPos, pageWidth - margin, yPos);

      yPos += 6;



      // ─── Row 4: AI Coaching Path ───
      doc.setTextColor(70, 72, 212);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('AI COACHING ROADMAP & RECOMMENDATIONS', margin, yPos);

      yPos += 6;

      const coachingTipsList = data.coachingTips && data.coachingTips.length > 0 ? data.coachingTips : [
        'Incorporate quantifiable achievements under each experience role to prove business impact.',
        'Ensure primary industry keywords are placed naturally in the top third of your resume.',
        'Maintain clean layouts with standard section headings to optimize parsing by automated systems.'
      ];

      coachingTipsList.slice(0, 3).forEach((tip, idx) => {
        doc.setFillColor(243, 246, 252);
        doc.setDrawColor(70, 72, 212);
        doc.circle(margin + 3, yPos - 1, 2.5, 'FD');

        doc.setTextColor(70, 72, 212);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.text(`${idx + 1}`, margin + 3, yPos - 0.2, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);

        const wrappedTip = doc.splitTextToSize(tip, contentWidth - 10);
        doc.text(wrappedTip, margin + 8, yPos);

        yPos += wrappedTip.length * 4 + 4;
      });

      // ─── Page Footer ───
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text('CONFIDENTIAL • GENERATED BY AI JOBFIT ATS INTEGRATION ENGINE', pageWidth / 2, pageHeight - 8, { align: 'center' });
      doc.text('Page 1 of 1', pageWidth - margin, pageHeight - 8, { align: 'right' });

      const downloadName = `${userName.replace(/\s+/g, '_')}_AI_Analysis_Report.pdf`;
      doc.save(downloadName);
      toast.success('AI Analysis Report PDF Downloaded!', { id: 'pdf-gen' });
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate report', { id: 'pdf-gen' });
    }
  };

  const downloadOriginalResume = async (fileUrl: string) => {
    try {
      toast.loading('Starting resume download...', { id: 'resume-download' });

      // Attempt programmatic fetch to download as a Blob (mimics native library direct save)
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Network response was not ok');

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const fileName = fileUrl.split('/').pop()?.replace(/^[a-f0-9]+_/gi, '') || 'resume.pdf';

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
      toast.success('Resume downloaded successfully!', { id: 'resume-download' });
    } catch (error) {
      console.error('Fetch download failed, falling back to direct attachment URL:', error);
      // Fallback: Use Cloudinary fl_attachment flag to force direct download in a new window/tab
      let downloadUrl = fileUrl;
      if (fileUrl.includes('cloudinary.com') && fileUrl.includes('/upload/')) {
        downloadUrl = fileUrl.replace('/upload/', '/upload/fl_attachment/');
      }
      window.open(downloadUrl, '_blank');
      toast.success('Opening download link...', { id: 'resume-download' });
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await resumeService.getResumeHistory();
      if (res.success) setHistory(res.data);
    } catch (error) {
      console.error('History fetch failed:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('resume', file);

      const res = await resumeService.uploadResume(formData);
      if (res.success) {
        toast.success('Resume uploaded successfully!');
        setCurrentResume(res.data);
        handleStartAnalysis(res.data._id);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleStartAnalysis = async (resumeId: string) => {
    try {
      setAnalyzing(true);
      setCurrentStep(2);
      const res = await resumeService.analyzeResume(resumeId);
      if (res.success) {
        toast.success('AI Analysis Complete!');
        setCurrentResume(res.data);
        setCurrentStep(3);
        fetchHistory();
      }
    } catch (error: any) {
      toast.error('AI Analysis failed. Try again.');
      setCurrentStep(1);
    } finally {
      setAnalyzing(false);
    }
  };

  const fetchInterviewQuestions = async () => {
    if (!currentResume) return;
    try {
      toast.loading('Generating AI Interview Scripts...', { id: 'ai-scripts' });
      const res = await aiService.generateResumeQuestions(currentResume._id);
      if (res.success) {
        setInterviewQuestions(res.data);
        setCurrentStep(4);
        toast.success('Scripts Generated!', { id: 'ai-scripts' });
      }
    } catch (error) {
      toast.error('Failed to generate scripts', { id: 'ai-scripts' });
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      setIsDeleting(true);
      const res = await resumeService.deleteResume(deleteTargetId);
      if (res.success) {
        toast.success('Resume analysis deleted successfully!');
        fetchHistory();
      }
    } catch (error) {
      toast.error('Failed to delete resume analysis.');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* Stepper Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 pointer-events-none" />
        <div className="flex items-start justify-between relative px-2 sm:px-4 max-w-3xl mx-auto">
          {/* Connecting Lines */}
          <div className="absolute left-8 sm:left-14 right-8 sm:right-14 top-4 -translate-y-1/2 h-0.5 bg-surface-container-highest -z-10"></div>
          <div
            className="absolute left-8 sm:left-14 top-4 -translate-y-1/2 h-0.5 bg-primary transition-all duration-500 -z-10"
            style={{ width: `${(currentStep - 1) * 33.33}%` }}
          ></div>

          {[
            { step: 1, label: 'Upload', icon: UploadCloud },
            { step: 2, label: 'AI Scan', icon: BrainCircuit },
            { step: 3, label: 'Results', icon: Target },
            { step: 4, label: 'Scripts', icon: Sparkles },
          ].map((s) => (
            <div key={s.step} className="flex flex-col items-center gap-2 w-16 sm:w-24">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300",
                currentStep >= s.step ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-surface-container text-on-surface-variant border-2 border-outline-variant"
              )}>
                {currentStep > s.step ? <CheckCircle2 className="w-5 h-5" /> : s.step}
              </div>
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest text-center",
                currentStep >= s.step ? "text-primary" : "text-on-surface-variant/60"
              )}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: UPLOAD */}
        {currentStep === 1 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center border-2 border-dashed border-primary/20 hover:border-primary/50 transition-all cursor-pointer group relative overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
          >
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf,.docx" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
              <UploadCloud className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-3xl font-black text-on-surface mb-2 tracking-tight">
              {file ? file.name : "Analyze your resume with AI"}
            </h2>
            <p className="text-on-surface-variant text-lg mb-8 max-w-md">
              Our advanced AI engine will parse your experience and provide actionable feedback in seconds.
            </p>
            <div className="flex gap-4 relative z-10">
              <Button
                variant="gradient"
                size="lg"
                onClick={(e) => { e.stopPropagation(); if (file) handleUpload(); else fileInputRef.current?.click(); }}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : file ? "Analyze Now" : "Select File"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40">Supported: PDF, DOCX (Max 5MB)</p>
          </motion.section>
        )}

        {/* STEP 2: SCANNING ANIMATION */}
        {currentStep === 2 && (
          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-primary/[0.02] animate-pulse"></div>
            <div className="relative w-48 h-48 mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping"></div>
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-primary animate-spin-slow"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <BrainCircuit className="w-20 h-20 text-primary animate-bounce" />
              </div>
            </div>
            <h2 className="text-3xl font-black text-on-surface mb-4">AI Brain at Work...</h2>
            <p className="text-on-surface-variant text-lg max-w-sm">
              We are currently scanning your skills, calculating your market value, and identifying potential gaps.
            </p>
            <div className="mt-12 flex gap-2">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </motion.section>
        )}

        {/* STEP 3: RESULTS */}
        {currentStep === 3 && currentResume && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            <div className="lg:col-span-4 space-y-8">
              {/* Score Card */}
              <div className="glass-card rounded-3xl p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <Trophy className="w-8 h-8 text-yellow-500 opacity-20" />
                </div>
                <div className="text-sm font-black uppercase tracking-widest text-on-surface-variant mb-6">ATS Readiness Score</div>
                <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-surface-container-highest" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="16" fill="none"
                      className="stroke-primary"
                      strokeWidth="3"
                      strokeDasharray={`${currentResume.score || 0}, 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="flex flex-col items-center">
                    <span className="text-5xl font-black text-primary leading-none">{currentResume.score}</span>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase mt-1">Percentile</span>
                  </div>
                </div>
                <p className="mt-8 text-sm text-on-surface-variant font-medium leading-relaxed italic">
                  "{currentResume.summary || 'Analyze complete.'}"
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col gap-3">
                <Button variant="gradient" className="w-full animate-pulse-slow" onClick={fetchInterviewQuestions}>
                  Generate Interview Scripts
                  <Sparkles className="ml-2 w-4.5 h-4.5" />
                </Button>
                <Button
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-none shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all"
                  onClick={() => generatePDFReport(currentResume)}
                >
                  <Download className="w-4 h-4" />
                  AI Analysis Report
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setCurrentStep(1)}>
                  Analyze Another
                  <RefreshCw className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Skills Detected */}
                <div className="glass-card rounded-3xl p-8">
                  <h3 className="text-lg font-black text-on-surface mb-6 flex items-center gap-3">
                    <CheckCircle2 className="text-emerald-500 w-6 h-6" />
                    Top Skills Found
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentResume.skills?.map((s: string) => (
                      <span key={s} className="bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold px-3 py-1.5 rounded-xl border border-emerald-500/10 uppercase tracking-wider">{s}</span>
                    ))}
                  </div>
                </div>

                {/* Gaps Found */}
                <div className="glass-card rounded-3xl p-8">
                  <h3 className="text-lg font-black text-on-surface mb-6 flex items-center gap-3">
                    <AlertCircle className="text-red-500 w-6 h-6" />
                    Areas to Improve
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentResume.weaknesses?.map((w: string) => (
                      <span key={w} className="bg-red-500/5 text-red-600 dark:text-red-400 text-[11px] font-bold px-3 py-1.5 rounded-xl border border-red-500/10 uppercase tracking-wider">{w}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Coaching Tips */}
              <div className="glass-card rounded-3xl p-8 bg-primary/[0.02] border-primary/10">
                <h3 className="text-lg font-black text-on-surface mb-6 flex items-center gap-3">
                  <BrainCircuit className="text-primary w-6 h-6" />
                  AI Coaching Path
                </h3>
                <div className="space-y-4">
                  {currentResume.coachingTips?.map((tip: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900/50 border border-outline-variant/10 shadow-sm">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-black text-xs">
                        {idx + 1}
                      </div>
                      <p className="text-sm font-medium text-on-surface-variant pt-1">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* STEP 4: INTERVIEW SCRIPTS */}
        {currentStep === 4 && interviewQuestions && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <h2 className="text-3xl font-black text-on-surface">Interview Preparation</h2>
                <p className="text-on-surface-variant">AI-generated questions based on your resume and target roles.</p>
              </div>
              <div className="flex gap-4 w-full sm:w-auto">
                <Link href="/candidate/aimock-interview" className="flex-1 sm:flex-none gradient-button text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                  <Zap className="w-4 h-4" />
                  Start Live Interview
                </Link>
                <Button variant="outline" size="sm" onClick={() => setCurrentStep(3)} className="hidden sm:flex">Back to Analysis</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card rounded-3xl p-8 border-l-4 border-l-primary">
                <h3 className="text-lg font-black mb-6 flex items-center gap-3">
                  <TerminalSquare className="text-primary w-6 h-6" />
                  Technical Questions
                </h3>
                <div className="space-y-4">
                  {interviewQuestions.technical?.map((q: string, i: number) => (
                    <div key={i} className="p-4 bg-surface-container-low rounded-2xl text-sm font-medium border border-outline-variant/10">
                      <span className="text-primary font-black mr-2">Q{i + 1}:</span> {q}
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-3xl p-8 border-l-4 border-l-secondary">
                <h3 className="text-lg font-black mb-6 flex items-center gap-3">
                  <MessageSquare className="text-secondary w-6 h-6" />
                  Behavioral Questions
                </h3>
                <div className="space-y-4">
                  {interviewQuestions.behavioral?.map((q: string, i: number) => (
                    <div key={i} className="p-4 bg-surface-container-low rounded-2xl text-sm font-medium border border-outline-variant/10">
                      <span className="text-secondary font-black mr-2">Q{i + 1}:</span> {q}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* History Section */}
      <section className="pt-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-black text-on-surface tracking-tight">Analysis History</h2>
            <p className="text-on-surface-variant mt-1">Revisit your previously optimized documents.</p>
          </div>
          <button className="text-primary font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:opacity-80">
            View Archive
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.length === 0 ? (
            <div className="col-span-full h-40 glass-card rounded-3xl flex flex-col items-center justify-center opacity-40 border-dashed border-2">
              <FileSearch className="w-10 h-10 mb-2" />
              <p className="font-bold uppercase text-[10px] tracking-widest">No previous analyses found</p>
            </div>
          ) : (
            history.map((item) => (
              <motion.div
                key={item._id}
                whileHover={{ y: -5 }}
                className="glass-card rounded-3xl p-6 flex flex-col group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent pointer-events-none" />
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1.5 border border-primary/10">
                      <Sparkles className="w-3 h-3" />
                      {item.score}% ATS
                    </span>
                    <button
                      onClick={() => handleDeleteClick(item._id)}
                      className="p-1.5 text-on-surface-variant hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h4 className="text-base font-bold text-on-surface mb-1 truncate">{item.fileUrl.split('/').pop()?.substring(0, 20) || 'Resume_v1.pdf'}</h4>
                <p className="text-on-surface-variant text-xs mb-8 flex items-center gap-1.5 font-bold">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(item.updatedAt).toLocaleDateString()}
                </p>
                <div className="mt-auto flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCurrentResume(item);
                      setCurrentStep(3);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex-1 bg-primary text-white font-bold text-xs py-2.5 rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all text-center"
                  >
                    View Analysis
                  </button>
                  <button
                    onClick={() => generatePDFReport(item)}
                    title="Download AI Analysis Report"
                    className="p-2.5 bg-surface-container-high border border-outline-variant text-primary rounded-xl hover:bg-primary/10 transition-colors shrink-0"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>
      {/* Custom Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteTargetId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Analysis"
        message="Are you sure you want to permanently delete this resume analysis? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="No, Keep it"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ResumeAnalysisView;
