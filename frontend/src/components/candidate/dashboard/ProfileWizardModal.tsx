'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  GraduationCap, 
  Briefcase, 
  Code2, 
  FolderGit2, 
  Palette, 
  FileCheck,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  CheckCircle2,
  Download,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Globe
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { userService } from '@/lib/services/user.services';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';

import { jsPDF } from 'jspdf';

interface ProfileWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type WizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface WizardData {
  fullname: string;
  email: string;
  phoneNumber: string;
  location: string;
  bio: string;
  education: { degree: string; university: string; cgpa: string; year: string }[];
  workExperience: { role: string; company: string; duration: string; description: string }[];
  skills: {
    frontend: string[];
    backend: string[];
    tools: string[];
    soft: string[];
  };
  projects: { title: string; stack: string[]; description: string; link: string }[];
  resumeStyle: string;
}

const ProfileWizardModal: React.FC<ProfileWizardModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State with explicit typing
  const [formData, setFormData] = useState<WizardData>({
    fullname: user?.fullname || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    location: user?.location || '',
    bio: user?.bio || '',
    education: user?.education?.length ? user.education : [{ degree: '', university: '', cgpa: '', year: '' }],
    workExperience: user?.workExperience?.length ? user.workExperience : [{ role: '', company: '', duration: '', description: '' }],
    skills: {
      frontend: [],
      backend: [],
      tools: [],
      soft: user?.skills || []
    },
    projects: user?.projects?.length ? user.projects : [{ title: '', stack: [], description: '', link: '' }],
    resumeStyle: 'modern'
  });

  // Sync state with user data when modal opens
  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        fullname: user.fullname || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        location: user.location || '',
        bio: user.bio || '',
        education: user.education?.length ? [...user.education] : [{ degree: '', university: '', cgpa: '', year: '' }],
        workExperience: user.workExperience?.length ? [...user.workExperience] : [{ role: '', company: '', duration: '', description: '' }],
        skills: {
          frontend: [],
          backend: [],
          tools: [],
          soft: user.skills || []
        },
        projects: user.projects?.length ? [...user.projects] : [{ title: '', stack: [], description: '', link: '' }],
        resumeStyle: 'modern'
      });
    }
  }, [user, isOpen]);

  const generatePDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    let yPos = 20;

    // Header
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(formData.fullname.toUpperCase(), margin, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${formData.email} | ${formData.phoneNumber} | ${formData.location}`, margin, yPos);
    yPos += 15;

    // Bio
    if (formData.bio) {
      doc.setFont('helvetica', 'italic');
      const bioLines = doc.splitTextToSize(formData.bio, 170);
      doc.text(bioLines, margin, yPos);
      yPos += (bioLines.length * 5) + 10;
    }

    // Education
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('EDUCATION', margin, yPos);
    yPos += 7;
    doc.line(margin, yPos - 5, 190, yPos - 5);

    formData.education.forEach(edu => {
      if (edu.degree) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(edu.degree, margin, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(edu.year, 190, yPos, { align: 'right' });
        yPos += 5;
        doc.text(edu.university, margin, yPos);
        doc.text(`CGPA: ${edu.cgpa}`, 190, yPos, { align: 'right' });
        yPos += 8;
      }
    });

    // Experience
    if (formData.workExperience.some(w => w.company)) {
      yPos += 5;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('EXPERIENCE', margin, yPos);
      yPos += 7;
      doc.line(margin, yPos - 5, 190, yPos - 5);

      formData.workExperience.forEach(work => {
        if (work.company) {
          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.text(work.role, margin, yPos);
          doc.setFont('helvetica', 'normal');
          doc.text(work.duration, 190, yPos, { align: 'right' });
          yPos += 5;
          doc.setFont('helvetica', 'italic');
          doc.text(work.company, margin, yPos);
          yPos += 5;
          doc.setFont('helvetica', 'normal');
          const descLines = doc.splitTextToSize(work.description, 170);
          doc.text(descLines, margin, yPos);
          yPos += (descLines.length * 5) + 5;
        }
      });
    }

    // Skills
    yPos += 5;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('SKILLS', margin, yPos);
    yPos += 7;
    doc.line(margin, yPos - 5, 190, yPos - 5);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    const allSkills = [
      ...formData.skills.frontend,
      ...formData.skills.backend,
      ...formData.skills.tools,
      ...formData.skills.soft
    ].join(', ');
    
    const skillLines = doc.splitTextToSize(allSkills, 170);
    doc.setFont('helvetica', 'normal');
    doc.text(skillLines, margin, yPos);
    yPos += (skillLines.length * 5) + 10;

    // Projects
    if (formData.projects.some(p => p.title)) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('PROJECTS', margin, yPos);
      yPos += 7;
      doc.line(margin, yPos - 5, 190, yPos - 5);

      formData.projects.forEach(proj => {
        if (proj.title) {
          doc.setFontSize(11);
          doc.setFont('helvetica', 'bold');
          doc.text(proj.title, margin, yPos);
          yPos += 5;
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          const projLines = doc.splitTextToSize(proj.description, 170);
          doc.text(projLines, margin, yPos);
          yPos += (projLines.length * 5) + 5;
        }
      });
    }

    doc.save(`${formData.fullname.replace(' ', '_')}_Resume.pdf`);
  };

  const handleNext = () => {
    if (currentStep < 7) setCurrentStep((prev) => (prev + 1) as WizardStep);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => (prev - 1) as WizardStep);
  };

  const handleSave = async () => {
    if (!user?._id) return;
    setIsSubmitting(true);
    try {
      // Merge all skill categories into one array for the backend
      const mergedSkills = [
        ...formData.skills.frontend,
        ...formData.skills.backend,
        ...formData.skills.tools,
        ...formData.skills.soft
      ];

      const payload = {
        ...formData,
        skills: mergedSkills
      };

      const res = await userService.updateProfile(user._id, payload);
      if (res.success) {
        updateUser(payload);
        toast.success('Profile updated successfully!');
        handleNext(); 
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to add/remove dynamic fields
  const addEducation = () => setFormData({ ...formData, education: [...formData.education, { degree: '', university: '', cgpa: '', year: '' }] });
  const removeEducation = (index: number) => {
    const list = [...formData.education];
    list.splice(index, 1);
    setFormData({ ...formData, education: list });
  };

  const addWork = () => setFormData({ ...formData, workExperience: [...formData.workExperience, { role: '', company: '', duration: '', description: '' }] });
  const removeWork = (index: number) => {
    const list = [...formData.workExperience];
    list.splice(index, 1);
    setFormData({ ...formData, workExperience: list });
  };

  const addProject = () => setFormData({ ...formData, projects: [...formData.projects, { title: '', stack: [], description: '', link: '' }] });
  const removeProject = (index: number) => {
    const list = [...formData.projects];
    list.splice(index, 1);
    setFormData({ ...formData, projects: list });
  };

  const stepIcons = [
    { id: 1, icon: User, label: 'Personal' },
    { id: 2, icon: GraduationCap, label: 'Education' },
    { id: 3, icon: Briefcase, label: 'Experience' },
    { id: 4, icon: Code2, label: 'Skills' },
    { id: 5, icon: FolderGit2, label: 'Projects' },
    { id: 6, icon: Palette, label: 'Style' },
    { id: 7, icon: FileCheck, label: 'Finish' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-surface rounded-[40px] shadow-2xl overflow-hidden border border-outline-variant/20 flex flex-col max-h-[90vh]"
          >
            {/* Sidebar Navigation */}
            <div className="flex h-full">
              <div className="hidden md:flex w-64 bg-surface-container-low border-r border-outline-variant/10 flex-col p-8">
                <div className="mb-10">
                  <h2 className="text-xl font-black text-on-surface">Profile Wizard</h2>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">Build your legacy</p>
                </div>

                <div className="space-y-2 flex-1">
                  {stepIcons.map((step) => (
                    <div 
                      key={step.id}
                      className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${currentStep === step.id ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'text-on-surface-variant hover:bg-surface-container'}`}
                    >
                      <step.icon className={`w-5 h-5 ${currentStep === step.id ? 'text-white' : 'text-primary'}`} />
                      <span className="text-xs font-bold">{step.label}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  <div className="w-full bg-surface-container rounded-full h-1.5 mb-2">
                    <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${(currentStep / 7) * 100}%` }} />
                  </div>
                  <p className="text-[9px] font-bold text-center text-on-surface-variant uppercase tracking-tighter">Step {currentStep} of 7 Complete</p>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 flex flex-col bg-surface min-w-0">
                <div className="p-6 md:p-10 flex-1 overflow-y-auto custom-scrollbar">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      {/* Step 1: Personal Branding */}
                      {currentStep === 1 && (
                        <div className="space-y-6">
                          <div className="mb-8">
                            <h3 className="text-2xl font-black text-on-surface">Personal Branding</h3>
                            <p className="text-sm text-on-surface-variant">Your first impression matters. Make it count.</p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Full Name</label>
                              <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                                <input
                                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl pl-12 pr-4 py-4 text-on-surface focus:border-primary transition-all outline-none"
                                  value={formData.fullname}
                                  onChange={e => setFormData({ ...formData, fullname: e.target.value })}
                                  placeholder="John Doe"
                                />
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Email (Verified)</label>
                              <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/40" />
                                <input
                                  disabled
                                  className="w-full bg-surface-container/50 border border-outline-variant/10 rounded-2xl pl-12 pr-4 py-4 text-on-surface-variant/60 cursor-not-allowed outline-none"
                                  value={formData.email}
                                />
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Phone Number</label>
                              <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                                <input
                                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl pl-12 pr-4 py-4 text-on-surface focus:border-primary transition-all outline-none"
                                  value={formData.phoneNumber}
                                  onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                                  placeholder="+91 00000 00000"
                                />
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Location</label>
                              <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                                <input
                                  className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl pl-12 pr-4 py-4 text-on-surface focus:border-primary transition-all outline-none"
                                  value={formData.location}
                                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                                  placeholder="City, Country"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Professional Bio</label>
                            <textarea
                              rows={4}
                              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-[2rem] px-6 py-4 text-on-surface focus:border-primary transition-all outline-none resize-none"
                              value={formData.bio}
                              onChange={e => setFormData({ ...formData, bio: e.target.value })}
                              placeholder="Describe your expertise and what you bring to the table..."
                            />
                          </div>
                        </div>
                      )}

                      {/* Step 2: Academic Journey */}
                      {currentStep === 2 && (
                        <div className="space-y-6">
                          <div className="mb-8 flex justify-between items-end">
                            <div>
                              <h3 className="text-2xl font-black text-on-surface">Academic Journey</h3>
                              <p className="text-sm text-on-surface-variant">Add your degrees and certifications.</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={addEducation} className="rounded-xl border-dashed">
                              <Plus className="w-4 h-4 mr-2" /> Add More
                            </Button>
                          </div>
                          
                          <div className="space-y-8">
                            {formData.education.map((edu, idx) => (
                              <div key={idx} className="relative p-6 rounded-[2.5rem] bg-surface-container-low/50 border border-outline-variant/10 group animate-in slide-in-from-bottom-4 duration-300">
                                {formData.education.length > 1 && (
                                  <button 
                                    onClick={() => removeEducation(idx)}
                                    className="absolute -top-2 -right-2 p-2 bg-error text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold uppercase text-on-surface-variant ml-1">Degree / Course</label>
                                    <input
                                      className="w-full bg-white dark:bg-black/20 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                                      value={edu.degree}
                                      onChange={e => {
                                        const newList = [...formData.education];
                                        newList[idx].degree = e.target.value;
                                        setFormData({ ...formData, education: newList });
                                      }}
                                      placeholder="B.Tech Computer Science"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold uppercase text-on-surface-variant ml-1">University / Institute</label>
                                    <input
                                      className="w-full bg-white dark:bg-black/20 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                                      value={edu.university}
                                      onChange={e => {
                                        const newList = [...formData.education];
                                        newList[idx].university = e.target.value;
                                        setFormData({ ...formData, education: newList });
                                      }}
                                      placeholder="Stanford University"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold uppercase text-on-surface-variant ml-1">CGPA / Percentage</label>
                                    <input
                                      className="w-full bg-white dark:bg-black/20 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                                      value={edu.cgpa}
                                      onChange={e => {
                                        const newList = [...formData.education];
                                        newList[idx].cgpa = e.target.value;
                                        setFormData({ ...formData, education: newList });
                                      }}
                                      placeholder="9.5 or 95%"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold uppercase text-on-surface-variant ml-1">Year of Completion</label>
                                    <input
                                      className="w-full bg-white dark:bg-black/20 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                                      value={edu.year}
                                      onChange={e => {
                                        const newList = [...formData.education];
                                        newList[idx].year = e.target.value;
                                        setFormData({ ...formData, education: newList });
                                      }}
                                      placeholder="2024"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Step 3: Professional Path */}
                      {currentStep === 3 && (
                        <div className="space-y-6">
                          <div className="mb-8 flex justify-between items-end">
                            <div>
                              <h3 className="text-2xl font-black text-on-surface">Professional Path</h3>
                              <p className="text-sm text-on-surface-variant">Your career trajectory so far.</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={addWork} className="rounded-xl border-dashed">
                              <Plus className="w-4 h-4 mr-2" /> Add More
                            </Button>
                          </div>
                          
                          <div className="space-y-8">
                            {formData.workExperience.map((work, idx) => (
                              <div key={idx} className="relative p-6 rounded-[2.5rem] bg-surface-container-low/50 border border-outline-variant/10 group">
                                {formData.workExperience.length > 1 && (
                                  <button 
                                    onClick={() => removeWork(idx)}
                                    className="absolute -top-2 -right-2 p-2 bg-error text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold uppercase text-on-surface-variant ml-1">Job Role</label>
                                    <input
                                      className="w-full bg-white dark:bg-black/20 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                                      value={work.role}
                                      onChange={e => {
                                        const newList = [...formData.workExperience];
                                        newList[idx].role = e.target.value;
                                        setFormData({ ...formData, workExperience: newList });
                                      }}
                                      placeholder="Software Engineer"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold uppercase text-on-surface-variant ml-1">Company</label>
                                    <input
                                      className="w-full bg-white dark:bg-black/20 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                                      value={work.company}
                                      onChange={e => {
                                        const newList = [...formData.workExperience];
                                        newList[idx].company = e.target.value;
                                        setFormData({ ...formData, workExperience: newList });
                                      }}
                                      placeholder="Google Inc."
                                    />
                                  </div>
                                  <div className="col-span-2 space-y-1">
                                    <label className="text-[9px] font-bold uppercase text-on-surface-variant ml-1">Duration</label>
                                    <input
                                      className="w-full bg-white dark:bg-black/20 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                                      value={work.duration}
                                      onChange={e => {
                                        const newList = [...formData.workExperience];
                                        newList[idx].duration = e.target.value;
                                        setFormData({ ...formData, workExperience: newList });
                                      }}
                                      placeholder="Jan 2022 - Present"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold uppercase text-on-surface-variant ml-1">Key Contributions</label>
                                  <textarea
                                    rows={3}
                                    className="w-full bg-white dark:bg-black/20 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none resize-none"
                                    value={work.description}
                                    onChange={e => {
                                      const newList = [...formData.workExperience];
                                      newList[idx].description = e.target.value;
                                      setFormData({ ...formData, workExperience: newList });
                                    }}
                                    placeholder="Developed AI matching algorithms, reduced latency by 40%..."
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Step 4: Skill Galaxy */}
                      {currentStep === 4 && (
                        <div className="space-y-8">
                          <div className="mb-8">
                            <h3 className="text-2xl font-black text-on-surface">Skill Galaxy</h3>
                            <p className="text-sm text-on-surface-variant">Categorize your expertise for better AI matching.</p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Frontend Skills */}
                            <div className="space-y-4 p-6 rounded-3xl bg-surface-container-low border border-outline-variant/10 shadow-inner">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                  <Code2 className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-on-surface">Frontend</h4>
                              </div>
                              <input
                                className="w-full bg-white dark:bg-black/20 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    const val = (e.target as HTMLInputElement).value.trim();
                                    if (val && !formData.skills.frontend.includes(val)) {
                                      setFormData({ ...formData, skills: { ...formData.skills, frontend: [...formData.skills.frontend, val] } });
                                      (e.target as HTMLInputElement).value = '';
                                    }
                                  }
                                }}
                                placeholder="React, Vue, Next.js..."
                              />
                              <div className="flex flex-wrap gap-2">
                                {formData.skills.frontend.map(skill => (
                                  <span key={skill} className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/5 text-blue-500 text-[10px] font-bold rounded-lg border border-blue-500/10">
                                    {skill}
                                    <X className="w-3 h-3 cursor-pointer" onClick={() => setFormData({ ...formData, skills: { ...formData.skills, frontend: formData.skills.frontend.filter(s => s !== skill) } })} />
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Backend Skills */}
                            <div className="space-y-4 p-6 rounded-3xl bg-surface-container-low border border-outline-variant/10 shadow-inner">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                                  <Code2 className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-on-surface">Backend</h4>
                              </div>
                              <input
                                className="w-full bg-white dark:bg-black/20 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    const val = (e.target as HTMLInputElement).value.trim();
                                    if (val && !formData.skills.backend.includes(val)) {
                                      setFormData({ ...formData, skills: { ...formData.skills, backend: [...formData.skills.backend, val] } });
                                      (e.target as HTMLInputElement).value = '';
                                    }
                                  }
                                }}
                                placeholder="Node.js, Python, Go..."
                              />
                              <div className="flex flex-wrap gap-2">
                                {formData.skills.backend.map(skill => (
                                  <span key={skill} className="flex items-center gap-1.5 px-3 py-1 bg-purple-500/5 text-purple-500 text-[10px] font-bold rounded-lg border border-purple-500/10">
                                    {skill}
                                    <X className="w-3 h-3 cursor-pointer" onClick={() => setFormData({ ...formData, skills: { ...formData.skills, backend: formData.skills.backend.filter(s => s !== skill) } })} />
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Tools & Databases */}
                            <div className="space-y-4 p-6 rounded-3xl bg-surface-container-low border border-outline-variant/10 shadow-inner">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                  <Globe className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-on-surface">Tools & DB</h4>
                              </div>
                              <input
                                className="w-full bg-white dark:bg-black/20 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    const val = (e.target as HTMLInputElement).value.trim();
                                    if (val && !formData.skills.tools.includes(val)) {
                                      setFormData({ ...formData, skills: { ...formData.skills, tools: [...formData.skills.tools, val] } });
                                      (e.target as HTMLInputElement).value = '';
                                    }
                                  }
                                }}
                                placeholder="Git, Docker, MongoDB..."
                              />
                              <div className="flex flex-wrap gap-2">
                                {formData.skills.tools.map(skill => (
                                  <span key={skill} className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/5 text-emerald-500 text-[10px] font-bold rounded-lg border border-emerald-500/10">
                                    {skill}
                                    <X className="w-3 h-3 cursor-pointer" onClick={() => setFormData({ ...formData, skills: { ...formData.skills, tools: formData.skills.tools.filter(s => s !== skill) } })} />
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Soft Skills */}
                            <div className="space-y-4 p-6 rounded-3xl bg-surface-container-low border border-outline-variant/10 shadow-inner">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                                  <User className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-on-surface">Soft Skills</h4>
                              </div>
                              <input
                                className="w-full bg-white dark:bg-black/20 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    const val = (e.target as HTMLInputElement).value.trim();
                                    if (val && !formData.skills.soft.includes(val)) {
                                      setFormData({ ...formData, skills: { ...formData.skills, soft: [...formData.skills.soft, val] } });
                                      (e.target as HTMLInputElement).value = '';
                                    }
                                  }
                                }}
                                placeholder="Leadership, Communication..."
                              />
                              <div className="flex flex-wrap gap-2">
                                {formData.skills.soft.map(skill => (
                                  <span key={skill} className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/5 text-amber-500 text-[10px] font-bold rounded-lg border border-amber-500/10">
                                    {skill}
                                    <X className="w-3 h-3 cursor-pointer" onClick={() => setFormData({ ...formData, skills: { ...formData.skills, soft: formData.skills.soft.filter(s => s !== skill) } })} />
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Step 5: Masterpieces */}
                      {currentStep === 5 && (
                        <div className="space-y-6">
                          <div className="mb-8 flex justify-between items-end">
                            <div>
                              <h3 className="text-2xl font-black text-on-surface">Masterpieces</h3>
                              <p className="text-sm text-on-surface-variant">Showcase your best projects.</p>
                            </div>
                            <Button variant="outline" size="sm" onClick={addProject} className="rounded-xl border-dashed">
                              <Plus className="w-4 h-4 mr-2" /> Add More
                            </Button>
                          </div>
                          
                          <div className="space-y-8">
                            {formData.projects.map((project, idx) => (
                              <div key={idx} className="relative p-6 rounded-[2.5rem] bg-surface-container-low/50 border border-outline-variant/10 group">
                                {formData.projects.length > 1 && (
                                  <button 
                                    onClick={() => removeProject(idx)}
                                    className="absolute -top-2 -right-2 p-2 bg-error text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold uppercase text-on-surface-variant ml-1">Project Title</label>
                                    <input
                                      className="w-full bg-white dark:bg-black/20 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                                      value={project.title}
                                      onChange={e => {
                                        const newList = [...formData.projects];
                                        newList[idx].title = e.target.value;
                                        setFormData({ ...formData, projects: newList });
                                      }}
                                      placeholder="AI Job Portal"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold uppercase text-on-surface-variant ml-1">Live Link / Github</label>
                                    <div className="relative">
                                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                                      <input
                                        className="w-full bg-white dark:bg-black/20 border border-outline-variant/20 rounded-xl pl-9 pr-4 py-3 text-sm focus:border-primary outline-none"
                                        value={project.link}
                                        onChange={e => {
                                          const newList = [...formData.projects];
                                          newList[idx].link = e.target.value;
                                          setFormData({ ...formData, projects: newList });
                                        }}
                                        placeholder="https://..."
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold uppercase text-on-surface-variant ml-1">Project Summary</label>
                                  <textarea
                                    rows={3}
                                    className="w-full bg-white dark:bg-black/20 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none resize-none"
                                    value={project.description}
                                    onChange={e => {
                                      const newList = [...formData.projects];
                                      newList[idx].description = e.target.value;
                                      setFormData({ ...formData, projects: newList });
                                    }}
                                    placeholder="Briefly explain what you built and the impact..."
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Step 6: Resume Aesthetics */}
                      {currentStep === 6 && (
                        <div className="space-y-8">
                          <div className="mb-8">
                            <h3 className="text-2xl font-black text-on-surface">Resume Aesthetics</h3>
                            <p className="text-sm text-on-surface-variant">Choose a template style for your profile export.</p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                              { id: 'modern', name: 'Modern Premium', color: 'from-primary to-secondary', desc: 'Vibrant and bold design' },
                              { id: 'ats', name: 'ATS Optimized', color: 'from-slate-700 to-slate-900', desc: 'Strictly professional' },
                              { id: 'simple', name: 'Minimalist', color: 'from-zinc-400 to-zinc-600', desc: 'Clean and readable' },
                            ].map(style => (
                              <div 
                                key={style.id}
                                onClick={() => setFormData({ ...formData, resumeStyle: style.id })}
                                className={`relative group cursor-pointer p-6 rounded-[2.5rem] border-4 transition-all ${formData.resumeStyle === style.id ? 'border-primary bg-primary/5' : 'border-outline-variant/10 bg-surface-container-low hover:border-primary/40'}`}
                              >
                                <div className={`h-40 rounded-3xl bg-gradient-to-br ${style.color} mb-6 shadow-xl relative overflow-hidden`}>
                                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                </div>
                                <h4 className="font-black text-lg text-on-surface">{style.name}</h4>
                                <p className="text-xs text-on-surface-variant">{style.desc}</p>
                                {formData.resumeStyle === style.id && (
                                  <div className="absolute top-4 right-4 bg-primary text-white p-1 rounded-full">
                                    <CheckCircle2 className="w-5 h-5" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Step 7: Final Flourish */}
                      {currentStep === 7 && (
                        <div className="space-y-10 text-center py-10">
                          <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
                            <FileCheck className="w-12 h-12" />
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-3xl font-black text-on-surface">All Set!</h3>
                            <p className="text-on-surface-variant max-w-md mx-auto">Your profile is now 100% complete and optimized. You can now download your professional resume or start applying for jobs.</p>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                            <Button 
                              variant="gradient" 
                              className="flex-1 py-6 shadow-xl shadow-primary/20" 
                              onClick={() => {
                                generatePDF();
                                setTimeout(onClose, 1000); // Small delay to let download start
                              }}
                            >
                              <Download className="w-5 h-5 mr-2" /> Download Resume
                            </Button>
                            <Button variant="outline" className="flex-1 py-6 border-2" onClick={onClose}>
                              Done
                            </Button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Footer Controls */}
                {currentStep < 7 && (
                  <div className="p-6 md:p-8 bg-surface-container-high/30 border-t border-outline-variant/10 flex justify-between items-center">
                    <button 
                      onClick={handleBack}
                      disabled={currentStep === 1}
                      className={`flex items-center gap-2 font-bold text-sm px-4 py-2 transition-all ${currentStep === 1 ? 'opacity-0' : 'text-on-surface-variant hover:text-primary'}`}
                    >
                      <ChevronLeft className="w-5 h-5" /> Previous
                    </button>

                    {currentStep === 6 ? (
                      <Button variant="gradient" className="px-10 py-6" onClick={handleSave} disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Finalize & Save'}
                      </Button>
                    ) : (
                      <Button variant="gradient" className="px-10 py-6" onClick={handleNext}>
                        Next Step <ChevronRight className="ml-2 w-5 h-5" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Top Right Close Button */}
            <button 
              onClick={onClose} 
              className="absolute top-6 right-6 p-2 bg-surface-container/50 hover:bg-error hover:text-white rounded-full transition-all z-[110] group"
              title="Close Wizard"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProfileWizardModal;
