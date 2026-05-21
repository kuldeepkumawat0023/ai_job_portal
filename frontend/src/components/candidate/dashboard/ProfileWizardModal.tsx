'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Globe,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { userService } from '@/lib/services/user.services';
import { applicationService } from '@/lib/services/application.services';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';

import { jsPDF } from 'jspdf';
import { cn } from '@/utils/cn';

const categorizeSkills = (skillsArray: string[]) => {
  const categories: { technologies: string[], frameworks: string[], developerTools: string[], databases: string[] } = {
    technologies: [],
    frameworks: [],
    developerTools: [],
    databases: []
  };

  const databaseKeywords = ['db', 'database', 'mongo', 'mysql', 'postgres', 'sql', 'redis', 'cassandra', 'sqlite', 'oracle', 'mariadb', 'dynamodb', 'firebase', 'supabase', 'prisma', 'mongoose'];
  const devToolsKeywords = ['git', 'docker', 'kubernetes', 'postman', 'vs code', 'vscode', 'figma', 'xampp', 'webpack', 'vite', 'jenkins', 'aws', 'azure', 'gcp', 'github', 'gitlab', 'bitbucket', 'jira', 'npm', 'yarn', 'pnpm', 'eslint', 'prettier', 'cicd', 'ci/cd', 'ansible', 'terraform', 'postgressql'];
  const frameworkKeywords = ['react', 'vue', 'angular', 'next.js', 'nextjs', 'nuxt', 'svelte', 'node', 'express', 'django', 'flask', 'spring', 'laravel', 'bootstrap', 'tailwind', 'jquery', 'fastify', 'nest', 'rails', 'asp.net', 'net core', 'libraries', 'library', 'framework'];

  (skillsArray || []).forEach(skill => {
    const s = skill.toLowerCase().trim();
    if (databaseKeywords.some(k => s.includes(k))) {
      categories.databases.push(skill);
    } else if (devToolsKeywords.some(k => s.includes(k))) {
      categories.developerTools.push(skill);
    } else if (frameworkKeywords.some(k => s.includes(k))) {
      categories.frameworks.push(skill);
    } else {
      categories.technologies.push(skill);
    }
  });

  return categories;
};

interface ProfileWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId?: string;
  onApplicationSubmit?: () => void;
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
    technologies: string[];
    frameworks: string[];
    developerTools: string[];
    databases: string[];
  };
  projects: { title: string; stack: string[]; description: string; link: string }[];
  resumeStyle: string;
  isFresher?: boolean;
  experience?: number;
}

const ProfileWizardModal: React.FC<ProfileWizardModalProps> = ({
  isOpen,
  onClose,
  jobId,
  onApplicationSubmit
}) => {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadedResumeName, setUploadedResumeName] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});


  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are supported');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB Limit
      toast.error('File size must be under 5MB');
      return;
    }

    setUploadingResume(true);
    const uploadToast = toast.loading('Uploading resume...');
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('resume', file);

      const res = await userService.updateResume(user?._id || '', formDataUpload);
      if (res.success) {
        setUploadedResumeName(file.name);
        if (res.data) {
          updateUser(res.data);
        }
        toast.success('Resume uploaded successfully!', { id: uploadToast });
      } else {
        toast.error('Failed to upload resume', { id: uploadToast });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Resume upload failed', { id: uploadToast });
    } finally {
      setUploadingResume(false);
    }
  };

  const [submittingApplication, setSubmittingApplication] = useState(false);

  const handleSubmitApplication = async () => {
    if (!jobId) return;
    setSubmittingApplication(true);
    const applyToast = toast.loading('Submitting application...');
    try {
      const res = await applicationService.applyJob(jobId);
      if (res.success) {
        toast.success('Application submitted successfully!', { id: applyToast });
        if (onApplicationSubmit) {
          onApplicationSubmit();
        }
        onClose();
        router.push('/candidate/applications');
      } else {
        toast.error('Failed to submit application', { id: applyToast });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Application submission failed', { id: applyToast });
    } finally {
      setSubmittingApplication(false);
    }
  };



  // Form State with explicit typing
  const [formData, setFormData] = useState<WizardData>({
    fullname: user?.fullname || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    location: user?.location || '',
    bio: user?.bio || '',
    education: user?.education?.length ? user.education : [{ degree: '', university: '', cgpa: '', year: '' }],
    workExperience: user?.workExperience?.length ? user.workExperience : [{ role: '', company: '', duration: '', description: '' }],
    skills: (() => {
      const rawCats = (user?.categorizedSkills || {}) as any;
      const parsedSkillsObj = {
        technologies: rawCats.technologies || rawCats.frontend || [],
        frameworks: rawCats.frameworks || rawCats.backend || [],
        developerTools: rawCats.developerTools || rawCats.tools || [],
        databases: rawCats.databases || rawCats.soft || []
      };
      const hasExistingCategorized = Object.values(parsedSkillsObj).some(arr => arr && arr.length > 0);
      return hasExistingCategorized ? parsedSkillsObj : categorizeSkills(user?.skills || []);
    })(),
    projects: user?.projects?.length ? user.projects : [{ title: '', stack: [], description: '', link: '' }],
    resumeStyle: 'modern',
    isFresher: user?.isFresher || false,
    experience: user?.experience || 0
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
        skills: (() => {
          const rawCats = (user.categorizedSkills || {}) as any;
          const parsedSkillsObj = {
            technologies: rawCats.technologies || rawCats.frontend || [],
            frameworks: rawCats.frameworks || rawCats.backend || [],
            developerTools: rawCats.developerTools || rawCats.tools || [],
            databases: rawCats.databases || rawCats.soft || []
          };
          const hasExistingCategorized = Object.values(parsedSkillsObj).some(arr => arr && arr.length > 0);
          return hasExistingCategorized ? parsedSkillsObj : categorizeSkills(user.skills || []);
        })(),
        projects: user.projects?.length ? [...user.projects] : [{ title: '', stack: [], description: '', link: '' }],
        resumeStyle: 'modern',
        isFresher: user.isFresher || false,
        experience: user.experience || 0
      });
    }
  }, [user, isOpen]);

  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullname?.trim()) {
        errs.fullname = 'Full name is required';
      } else if (formData.fullname.length > 50) {
        errs.fullname = 'Full name must not exceed 50 characters';
      }

      if (!formData.location?.trim()) {
        errs.location = 'Location is required';
      } else if (formData.location.length > 50) {
        errs.location = 'Location must not exceed 50 characters';
      }

      if (!formData.phoneNumber?.trim()) {
        errs.phoneNumber = 'Phone number is required';
      } else if (!/^\+?\d{10,14}$/.test(formData.phoneNumber.replace(/\s+/g, ''))) {
        errs.phoneNumber = 'Phone number must be a valid number (e.g. 10 digits)';
      }

      if (!formData.bio?.trim()) {
        errs.bio = 'Professional bio is required';
      } else if (formData.bio.length < 10) {
        errs.bio = 'Bio must be at least 10 characters long';
      } else if (formData.bio.length > 500) {
        errs.bio = 'Bio must not exceed 500 characters';
      }
    }

    if (step === 2) {
      formData.education.forEach((edu, idx) => {
        if (!edu.degree?.trim()) {
          errs[`education_${idx}_degree`] = 'Degree is required';
        } else if (edu.degree.length > 50) {
          errs[`education_${idx}_degree`] = 'Degree must not exceed 50 characters';
        }

        if (!edu.university?.trim()) {
          errs[`education_${idx}_university`] = 'University/College is required';
        } else if (edu.university.length > 50) {
          errs[`education_${idx}_university`] = 'University must not exceed 50 characters';
        }

        if (!edu.year || !edu.year.toString().trim()) {
          errs[`education_${idx}_year`] = 'Year of completion is required';
        } else if (!/^\d{4}$/.test(edu.year.toString().trim())) {
          errs[`education_${idx}_year`] = 'Year must be a 4-digit number';
        } else {
          const yr = Number(edu.year);
          if (yr < 1900 || yr > 2100) {
            errs[`education_${idx}_year`] = 'Please enter a valid year between 1900 and 2100';
          }
        }

        if (edu.cgpa?.trim() && edu.cgpa.length > 10) {
          errs[`education_${idx}_cgpa`] = 'CGPA must not exceed 10 characters';
        }
      });
    }

    if (step === 3 && !formData.isFresher) {
      formData.workExperience.forEach((work, idx) => {
        if (!work.role?.trim()) {
          errs[`workExperience_${idx}_role`] = 'Role title is required';
        } else if (work.role.length > 50) {
          errs[`workExperience_${idx}_role`] = 'Role title must not exceed 50 characters';
        }

        if (!work.company?.trim()) {
          errs[`workExperience_${idx}_company`] = 'Company name is required';
        } else if (work.company.length > 50) {
          errs[`workExperience_${idx}_company`] = 'Company name must not exceed 50 characters';
        }

        if (!work.duration?.trim()) {
          errs[`workExperience_${idx}_duration`] = 'Duration is required';
        } else if (work.duration.length > 50) {
          errs[`workExperience_${idx}_duration`] = 'Duration must not exceed 50 characters';
        }

        if (!work.description?.trim()) {
          errs[`workExperience_${idx}_description`] = 'Responsibilities description is required';
        } else if (work.description.length < 10) {
          errs[`workExperience_${idx}_description`] = 'Description must be at least 10 characters long';
        }
      });
    }

    if (step === 5) {
      formData.projects.forEach((proj, idx) => {
        if (!proj.title?.trim()) {
          errs[`projects_${idx}_title`] = 'Project name is required';
        } else if (proj.title.length > 50) {
          errs[`projects_${idx}_title`] = 'Project name must not exceed 50 characters';
        }

        if (proj.link?.trim()) {
          if (proj.link.length > 100) {
            errs[`projects_${idx}_link`] = 'Project link must not exceed 100 characters';
          } else {
            const urlPattern = /^(https?:\/\/)?([\w\-]+(\.[\w\-]+)+)([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?$/i;
            if (!urlPattern.test(proj.link.trim())) {
              errs[`projects_${idx}_link`] = 'Please enter a valid URL';
            }
          }
        }

        if (!proj.description?.trim()) {
          errs[`projects_${idx}_description`] = 'Project description is required';
        } else if (proj.description.length < 10) {
          errs[`projects_${idx}_description`] = 'Description must be at least 10 characters';
        }
      });
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 7) {
        setCurrentStep((prev) => (prev + 1) as WizardStep);
      }
    }
  };

  const updateEducation = (index: number, key: string, value: string) => {
    const newList = [...formData.education];
    newList[index] = { ...newList[index], [key]: value };
    setFormData({ ...formData, education: newList });

    const errorKey = `education_${index}_${key}`;
    setErrors(prev => {
      const updated = { ...prev };
      if (!value.trim()) {
        if (key === 'degree') updated[errorKey] = 'Degree is required';
        if (key === 'university') updated[errorKey] = 'University/College is required';
        if (key === 'year') updated[errorKey] = 'Year of completion is required';
      } else {
        if (key === 'degree' && value.length > 50) {
          updated[errorKey] = 'Degree must not exceed 50 characters';
        } else if (key === 'university' && value.length > 50) {
          updated[errorKey] = 'University must not exceed 50 characters';
        } else if (key === 'year') {
          if (!/^\d{4}$/.test(value.trim())) {
            updated[errorKey] = 'Year must be a 4-digit number';
          } else {
            const yr = Number(value.trim());
            if (yr < 1900 || yr > 2100) {
              updated[errorKey] = 'Please enter a valid year between 1900 and 2100';
            } else {
              delete updated[errorKey];
            }
          }
        } else if (key === 'cgpa') {
          if (value.trim().length > 10) {
            updated[errorKey] = 'CGPA must not exceed 10 characters';
          } else {
            delete updated[errorKey];
          }
        } else {
          delete updated[errorKey];
        }
      }
      return updated;
    });
  };

  const updateWorkExperience = (index: number, key: string, value: string) => {
    const newList = [...formData.workExperience];
    newList[index] = { ...newList[index], [key]: value };
    setFormData({ ...formData, workExperience: newList });

    const errorKey = `workExperience_${index}_${key}`;
    setErrors(prev => {
      const updated = { ...prev };
      if (!value.trim()) {
        if (key === 'role') updated[errorKey] = 'Role title is required';
        if (key === 'company') updated[errorKey] = 'Company name is required';
        if (key === 'duration') updated[errorKey] = 'Duration is required';
        if (key === 'description') updated[errorKey] = 'Responsibilities description is required';
      } else {
        if (key === 'role' && value.length > 50) {
          updated[errorKey] = 'Role title must not exceed 50 characters';
        } else if (key === 'company' && value.length > 50) {
          updated[errorKey] = 'Company name must not exceed 50 characters';
        } else if (key === 'duration' && value.length > 50) {
          updated[errorKey] = 'Duration must not exceed 50 characters';
        } else if (key === 'description' && value.length < 10) {
          updated[errorKey] = 'Description must be at least 10 characters long';
        } else {
          delete updated[errorKey];
        }
      }
      return updated;
    });
  };

  const updateProject = (index: number, key: string, value: any) => {
    const newList = [...formData.projects];
    newList[index] = { ...newList[index], [key]: value };
    setFormData({ ...formData, projects: newList });

    const errorKey = `projects_${index}_${key}`;
    setErrors(prev => {
      const updated = { ...prev };
      if (typeof value === 'string' && !value.trim()) {
        if (key === 'title') updated[errorKey] = 'Project name is required';
        if (key === 'description') updated[errorKey] = 'Project description is required';
      } else {
        if (key === 'title' && typeof value === 'string' && value.length > 50) {
          updated[errorKey] = 'Project name must not exceed 50 characters';
        } else if (key === 'description' && typeof value === 'string' && value.length < 10) {
          updated[errorKey] = 'Description must be at least 10 characters';
        } else if (key === 'link' && typeof value === 'string' && value.trim()) {
          if (value.length > 100) {
            updated[errorKey] = 'Project link must not exceed 100 characters';
          } else {
            const urlPattern = /^(https?:\/\/)?([\w\-]+(\.[\w\-]+)+)([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?$/i;
            if (!urlPattern.test(value.trim())) {
              updated[errorKey] = 'Please enter a valid URL';
            } else {
              delete updated[errorKey];
            }
          }
        } else {
          delete updated[errorKey];
        }
      }
      return updated;
    });
  };

  const generatePDF = async () => {
    toast.loading('Generating PDF Resume...', { id: 'wizard-pdf-gen' });

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      let yPosition = 20;

      // ─────────────────────────────────────
      // WATERMARK LOGO
      // ─────────────────────────────────────
      const logoImg = new window.Image();
      logoImg.src = '/images/logo/logoimage.png';

      await new Promise((resolve) => {
        logoImg.onload = resolve;
        logoImg.onerror = resolve;
      });

      if (logoImg.complete && logoImg.naturalWidth > 0) {
        doc.saveGraphicsState();

        // Watermark opacity
        doc.setGState(new (doc as any).GState({ opacity: 0.08 }));

        const imgWidth = 130;
        const imgHeight =
          (logoImg.naturalHeight / logoImg.naturalWidth) * imgWidth;

        doc.addImage(
          logoImg,
          'PNG',
          (pageWidth - imgWidth) / 2,
          (pageHeight - imgHeight) / 2,
          imgWidth,
          imgHeight
        );

        doc.restoreGraphicsState();
      } else {
        // Fallback watermark text
        doc.saveGraphicsState();

        doc.setGState(new (doc as any).GState({ opacity: 0.08 }));

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(80);
        doc.setTextColor(200, 200, 200);

        doc.text('AI Job Fit', pageWidth / 2, pageHeight / 2, {
          align: 'center',
          angle: 45
        });

        doc.restoreGraphicsState();
      }

      // Color theme based on selected style
      const style = formData.resumeStyle || 'modern';
      let primaryColor = [70, 72, 212];
      let secondaryColor = [129, 39, 207];

      if (style === 'ats') {
        primaryColor = [15, 23, 42];
        secondaryColor = [71, 85, 105];
      } else if (style === 'simple') {
        primaryColor = [63, 63, 70];
        secondaryColor = [113, 113, 122];
      }

      const textColor = [51, 65, 85]; // Slate 600
      const grayTextColor = [100, 116, 139]; // Slate 500

      // Calculate display role
      const getDisplayRole = () => {
        if (formData.workExperience && formData.workExperience.length > 0 && formData.workExperience[0].role) {
          return formData.workExperience[0].role;
        }
        const bioStr = formData.bio?.toLowerCase() || '';
        if (bioStr.includes('full stack') || bioStr.includes('fullstack')) return 'Full Stack Developer';
        if (bioStr.includes('frontend') || bioStr.includes('front-end')) return 'Frontend Engineer';
        if (bioStr.includes('backend') || bioStr.includes('back-end')) return 'Backend Engineer';
        if (bioStr.includes('ui/ux') || bioStr.includes('designer')) return 'UI/UX Designer';
        if (bioStr.includes('data scientist') || bioStr.includes('data anal')) return 'Data Scientist';
        return 'Professional Candidate';
      };
      const targetRole = getDisplayRole();

      // Document Title/Name
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(24);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(formData.fullname || 'Resume', margin, yPosition);
      yPosition += 7;

      // Role
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
      doc.text(targetRole.toUpperCase(), margin, yPosition);
      yPosition += 7;

      // Contact Details Row
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      const locationText = `Location: ${formData.location || 'Remote'}`;
      const emailText = `Email: ${formData.email || 'N/A'}`;
      const countryCode = (user as any)?.countryCode || '+91';
      const phoneVal = formData.phoneNumber || 'N/A';
      const phoneText = `Phone: ${phoneVal.startsWith('+') ? '' : countryCode + ' '}${phoneVal}`;

      let personalInfoText = `${locationText}  |  ${emailText}  |  ${phoneText}`;

      const userPersonalDetail = (user as any)?.personalDetail || null;
      if (userPersonalDetail?.dob) {
        personalInfoText += `  |  DOB: ${userPersonalDetail.dob}`;
      }
      doc.text(personalInfoText, margin, yPosition);
      yPosition += 5;

      // Horizontal Divider
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition, 210 - margin, yPosition);
      yPosition += 8;

      const checkPageBreak = (neededHeight: number) => {
        if (yPosition + neededHeight > 275) {
          doc.addPage();
          yPosition = 20;
          return true;
        }
        return false;
      };

      // Summary/Bio
      if (formData.bio) {
        checkPageBreak(25);
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text('PROFESSIONAL SUMMARY', margin, yPosition);
        yPosition += 4;

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        const splitBio = doc.splitTextToSize(formData.bio, 210 - margin * 2);
        doc.text(splitBio, margin, yPosition);
        yPosition += (splitBio.length * 4.2) + 6;
      }

      // Work Experience
      const hasWorkExp = formData.workExperience && formData.workExperience.length > 0 && formData.workExperience.some(w => w.company || w.role);
      if (hasWorkExp && !formData.isFresher) {
        checkPageBreak(25);
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text('WORK EXPERIENCE', margin, yPosition);
        yPosition += 5;

        formData.workExperience.forEach((exp: any) => {
          if (!exp.role && !exp.company) return;
          checkPageBreak(22);

          // Role & Company
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(9.5);
          doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
          doc.text(`${exp.role || 'Role'} — ${exp.company || 'Company'}`, margin, yPosition);

          // Duration right-aligned
          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
          const durationStr = exp.duration || '';
          doc.text(durationStr, 210 - margin - doc.getTextWidth(durationStr), yPosition);
          yPosition += 4.5;

          // Exp Desc
          if (exp.description) {
            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            const splitExpDesc = doc.splitTextToSize(exp.description, 210 - margin * 2);
            doc.text(splitExpDesc, margin, yPosition);
            yPosition += (splitExpDesc.length * 4.2) + 5;
          } else {
            yPosition += 1;
          }
        });
        yPosition += 2;
      }

      // Projects Showcase
      const hasProjects = formData.projects && formData.projects.length > 0 && formData.projects.some(p => p.title);
      if (hasProjects) {
        checkPageBreak(25);
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text('PERSONAL PROJECTS', margin, yPosition);
        yPosition += 5;

        formData.projects.forEach((proj: any, index: number) => {
          if (!proj.title) return;
          checkPageBreak(22);

          // Project Title
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(9.5);
          doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
          doc.text(`${index + 1}. ${proj.title}`, margin, yPosition);

          if (proj.link) {
            const titleWidth = doc.getTextWidth(`${index + 1}. ${proj.title}`);
            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            const linkText = ` (${proj.link})`;
            doc.text(linkText, margin + titleWidth + 2, yPosition);
          }
          yPosition += 4.5;

          // Tech stack
          if (proj.stack && proj.stack.length > 0) {
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(8);
            doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
            const stackStr = Array.isArray(proj.stack) ? proj.stack.join(', ') : proj.stack;
            doc.text(`Technologies: ${stackStr}`, margin, yPosition);
            yPosition += 4;
          }

          // Description
          if (proj.description) {
            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            const splitProjDesc = doc.splitTextToSize(proj.description, 210 - margin * 2);
            doc.text(splitProjDesc, margin, yPosition);
            yPosition += (splitProjDesc.length * 4.2) + 5;
          } else {
            yPosition += 1;
          }
        });
        yPosition += 2;
      }

      // Skills & Expertise
      const pdfCats = {
        technologies: formData.skills.technologies || [],
        frameworks: formData.skills.frameworks || [],
        developerTools: formData.skills.developerTools || [],
        databases: formData.skills.databases || []
      };

      const hasAnySkills = Object.values(pdfCats).some(arr => arr.length > 0);

      if (hasAnySkills) {
        checkPageBreak(25);
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text('SKILLS & EXPERTISE', margin, yPosition);
        yPosition += 5;

        const categoriesList = [
          { label: 'Technologies', list: pdfCats.technologies },
          { label: 'Frameworks/Libraries', list: pdfCats.frameworks },
          { label: 'Developer Tools', list: pdfCats.developerTools },
          { label: 'Databases', list: pdfCats.databases }
        ];

        categoriesList.forEach((cat) => {
          if (cat.list.length > 0) {
            checkPageBreak(10);
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
            const labelText = `${cat.label}: `;
            const labelWidth = doc.getTextWidth(labelText);
            doc.text(labelText, margin, yPosition);

            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            const skillsLineText = cat.list.join(', ');
            const splitSkills = doc.splitTextToSize(skillsLineText, 210 - margin * 2 - labelWidth);

            doc.text(splitSkills, margin + labelWidth, yPosition);
            yPosition += (splitSkills.length * 4.2) + 1.5;
          }
        });
        yPosition += 4;
      }

      // Education Section
      const hasEducation = formData.education && formData.education.length > 0 && formData.education.some(e => e.degree);
      if (hasEducation) {
        checkPageBreak(25);
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text('EDUCATION', margin, yPosition);
        yPosition += 5;

        formData.education.forEach((edu: any) => {
          if (!edu.degree) return;
          checkPageBreak(15);

          // Degree & University
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(9.5);
          doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
          const boardText = edu.board ? ` (${edu.board})` : '';
          doc.text(`${edu.degree} — ${edu.university}${boardText}`, margin, yPosition);

          // Year right-aligned
          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
          const yearStr = edu.year || '';
          doc.text(yearStr, 210 - margin - doc.getTextWidth(yearStr), yPosition);
          yPosition += 4.5;

          // CGPA / Grade
          if (edu.cgpa) {
            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            doc.text(`CGPA/Grade: ${edu.cgpa}`, margin, yPosition);
            yPosition += 4.5;
          }
        });
        yPosition += 2;
      }

      // Certificates Section (Pulled from user profile since not in wizard form)
      const userCertificates = (user as any)?.certificates || [];
      if (userCertificates && userCertificates.length > 0) {
        checkPageBreak(25);
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text('CERTIFICATES & AWARDS', margin, yPosition);
        yPosition += 5;

        userCertificates.forEach((cert: any) => {
          checkPageBreak(10);
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
          doc.text(cert.name, margin, yPosition);

          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
          const certInfo = `${cert.issuer || ''} (${cert.year || ''})`;
          doc.text(certInfo, 210 - margin - doc.getTextWidth(certInfo), yPosition);
          yPosition += 4.5;
        });
        yPosition += 2;
      }

      // Personal Details Section (Pulled from user profile/personalDetails)
      const hasPersonalDetails = userPersonalDetail && (
        userPersonalDetail.dob ||
        userPersonalDetail.gender ||
        userPersonalDetail.languages ||
        userPersonalDetail.hobbies
      );

      if (hasPersonalDetails) {
        checkPageBreak(25);
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text('PERSONAL DETAILS', margin, yPosition);
        yPosition += 5;

        const details = [
          { label: 'Date of Birth', value: userPersonalDetail.dob },
          { label: 'Gender', value: userPersonalDetail.gender },
          { label: 'Languages Known', value: userPersonalDetail.languages },
          { label: 'Hobbies', value: userPersonalDetail.hobbies }
        ];

        details.forEach((d) => {
          if (d.value) {
            checkPageBreak(8);
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
            doc.text(`${d.label}: `, margin, yPosition);

            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            doc.text(d.value, margin + 40, yPosition);
            yPosition += 4.5;
          }
        });
      }

      // Save the generated document
      const filename = `${(formData.fullname || 'Resume').replace(/\s+/g, '_')}_Resume.pdf`;
      doc.save(filename);
      toast.success('Resume PDF downloaded!', { id: 'wizard-pdf-gen' });
    } catch (pdfErr: any) {
      console.error('PDF generation failed:', pdfErr);
      toast.error('Failed to compile PDF resume.', { id: 'wizard-pdf-gen' });
    }
  };


  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => (prev - 1) as WizardStep);
  };

  const handleSave = async () => {
    if (!user?._id) return;
    if (!validateStep(currentStep)) return;
    setIsSubmitting(true);
    try {
      // Merge all skill categories into one array for the backend
      const mergedSkills = [
        ...formData.skills.technologies,
        ...formData.skills.frameworks,
        ...formData.skills.developerTools,
        ...formData.skills.databases
      ];

      const payload = {
        ...formData,
        skills: mergedSkills,
        categorizedSkills: formData.skills
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

    setErrors(prev => {
      const updated: Record<string, string> = {};
      Object.keys(prev).forEach(key => {
        if (key.startsWith('education_')) {
          const parts = key.split('_'); // education_index_field
          const idx = parseInt(parts[1], 10);
          const field = parts.slice(2).join('_');
          if (idx < index) {
            updated[key] = prev[key];
          } else if (idx > index) {
            updated[`education_${idx - 1}_${field}`] = prev[key];
          }
        } else {
          updated[key] = prev[key];
        }
      });
      return updated;
    });
  };

  const addWork = () => setFormData({ ...formData, workExperience: [...formData.workExperience, { role: '', company: '', duration: '', description: '' }] });
  const removeWork = (index: number) => {
    const list = [...formData.workExperience];
    list.splice(index, 1);
    setFormData({ ...formData, workExperience: list });

    setErrors(prev => {
      const updated: Record<string, string> = {};
      Object.keys(prev).forEach(key => {
        if (key.startsWith('workExperience_')) {
          const parts = key.split('_'); // workExperience_index_field
          const idx = parseInt(parts[1], 10);
          const field = parts.slice(2).join('_');
          if (idx < index) {
            updated[key] = prev[key];
          } else if (idx > index) {
            updated[`workExperience_${idx - 1}_${field}`] = prev[key];
          }
        } else {
          updated[key] = prev[key];
        }
      });
      return updated;
    });
  };

  const addProject = () => setFormData({ ...formData, projects: [...formData.projects, { title: '', stack: [], description: '', link: '' }] });
  const removeProject = (index: number) => {
    const list = [...formData.projects];
    list.splice(index, 1);
    setFormData({ ...formData, projects: list });

    setErrors(prev => {
      const updated: Record<string, string> = {};
      Object.keys(prev).forEach(key => {
        if (key.startsWith('projects_')) {
          const parts = key.split('_'); // projects_index_field
          const idx = parseInt(parts[1], 10);
          const field = parts.slice(2).join('_');
          if (idx < index) {
            updated[key] = prev[key];
          } else if (idx > index) {
            updated[`projects_${idx - 1}_${field}`] = prev[key];
          }
        } else {
          updated[key] = prev[key];
        }
      });
      return updated;
    });
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
                              <label className={cn("text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1", errors.fullname && "!text-red-500")}>Full Name</label>
                              <div className="relative">
                                <User className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary", errors.fullname && "!text-red-500")} />
                                <input
                                  className={cn(
                                    "w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl pl-12 pr-4 py-4 text-on-surface focus:border-primary transition-all outline-none",
                                    errors.fullname ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/30 focus:border-primary"
                                  )}
                                  value={formData.fullname}
                                  onChange={e => {
                                    const val = e.target.value;
                                    setFormData({ ...formData, fullname: val });
                                    setErrors(prev => {
                                      const updated = { ...prev };
                                      if (!val.trim()) {
                                        updated.fullname = 'Full name is required';
                                      } else if (val.length > 50) {
                                        updated.fullname = 'Full name must not exceed 50 characters';
                                      } else {
                                        delete updated.fullname;
                                      }
                                      return updated;
                                    });
                                  }}
                                  placeholder="John Doe"
                                />
                              </div>
                              {errors.fullname && <p className="text-[9px] text-red-500 font-bold ml-1 mt-1 uppercase tracking-widest">{errors.fullname}</p>}
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
                              <label className={cn("text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1", errors.phoneNumber && "!text-red-500")}>Phone Number</label>
                              <div className="relative">
                                <Phone className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary", errors.phoneNumber && "!text-red-500")} />
                                <input
                                  className={cn(
                                    "w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl pl-12 pr-4 py-4 text-on-surface focus:border-primary transition-all outline-none",
                                    errors.phoneNumber ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/30 focus:border-primary"
                                  )}
                                  value={formData.phoneNumber}
                                  onChange={e => {
                                    const val = e.target.value;
                                    setFormData({ ...formData, phoneNumber: val });
                                    setErrors(prev => {
                                      const updated = { ...prev };
                                      if (!val.trim()) {
                                        updated.phoneNumber = 'Phone number is required';
                                      } else if (!/^\+?\d{10,14}$/.test(val.replace(/\s+/g, ''))) {
                                        updated.phoneNumber = 'Phone number must be a valid number (e.g. 10 digits)';
                                      } else {
                                        delete updated.phoneNumber;
                                      }
                                      return updated;
                                    });
                                  }}
                                  placeholder="+91 00000 00000"
                                />
                              </div>
                              {errors.phoneNumber && <p className="text-[9px] text-red-500 font-bold ml-1 mt-1 uppercase tracking-widest">{errors.phoneNumber}</p>}
                            </div>
                            <div className="space-y-1.5">
                              <label className={cn("text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1", errors.location && "!text-red-500")}>Location</label>
                              <div className="relative">
                                <MapPin className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500", errors.location && "!text-red-500")} />
                                <input
                                  className={cn(
                                    "w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl pl-12 pr-4 py-4 text-on-surface focus:border-primary transition-all outline-none",
                                    errors.location ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/30 focus:border-primary"
                                  )}
                                  value={formData.location}
                                  onChange={e => {
                                    const val = e.target.value;
                                    setFormData({ ...formData, location: val });
                                    setErrors(prev => {
                                      const updated = { ...prev };
                                      if (!val.trim()) {
                                        updated.location = 'Location is required';
                                      } else if (val.length > 50) {
                                        updated.location = 'Location must not exceed 50 characters';
                                      } else {
                                        delete updated.location;
                                      }
                                      return updated;
                                    });
                                  }}
                                  placeholder="City, Country"
                                />
                              </div>
                              {errors.location && <p className="text-[9px] text-red-500 font-bold ml-1 mt-1 uppercase tracking-widest">{errors.location}</p>}
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className={cn("text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1", errors.bio && "!text-red-500")}>Professional Bio</label>
                            <textarea
                              rows={4}
                              className={cn(
                                "w-full bg-surface-container-low border border-outline-variant/30 rounded-[2rem] px-6 py-4 text-on-surface focus:border-primary transition-all outline-none resize-none",
                                errors.bio ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/30 focus:border-primary"
                              )}
                              value={formData.bio}
                              onChange={e => {
                                const val = e.target.value;
                                setFormData({ ...formData, bio: val });
                                setErrors(prev => {
                                  const updated = { ...prev };
                                  if (!val.trim()) {
                                    updated.bio = 'Professional bio is required';
                                  } else if (val.length < 10) {
                                    updated.bio = 'Bio must be at least 10 characters long';
                                  } else if (val.length > 500) {
                                    updated.bio = 'Bio must not exceed 500 characters';
                                  } else {
                                    delete updated.bio;
                                  }
                                  return updated;
                                });
                              }}
                              placeholder="Describe your expertise and what you bring to the table..."
                            />
                            {errors.bio && <p className="text-[9px] text-red-500 font-bold ml-1 mt-1 uppercase tracking-widest">{errors.bio}</p>}
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
                                    <label className={cn("text-[9px] font-bold uppercase text-on-surface-variant ml-1", errors[`education_${idx}_degree`] && "!text-red-500")}>Degree / Course</label>
                                    <input
                                      className={cn(
                                        "w-full bg-white dark:bg-black/20 border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all",
                                        errors[`education_${idx}_degree`] ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/20 focus:border-primary"
                                      )}
                                      value={edu.degree}
                                      onChange={e => updateEducation(idx, 'degree', e.target.value)}
                                      placeholder="B.Tech Computer Science"
                                    />
                                    {errors[`education_${idx}_degree`] && <p className="text-[9px] text-red-500 font-bold ml-1 mt-1 uppercase tracking-widest">{errors[`education_${idx}_degree`]}</p>}
                                  </div>
                                  <div className="space-y-1">
                                    <label className={cn("text-[9px] font-bold uppercase text-on-surface-variant ml-1", errors[`education_${idx}_university`] && "!text-red-500")}>University / Institute</label>
                                    <input
                                      className={cn(
                                        "w-full bg-white dark:bg-black/20 border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all",
                                        errors[`education_${idx}_university`] ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/20 focus:border-primary"
                                      )}
                                      value={edu.university}
                                      onChange={e => updateEducation(idx, 'university', e.target.value)}
                                      placeholder="Stanford University"
                                    />
                                    {errors[`education_${idx}_university`] && <p className="text-[9px] text-red-500 font-bold ml-1 mt-1 uppercase tracking-widest">{errors[`education_${idx}_university`]}</p>}
                                  </div>
                                  <div className="space-y-1">
                                    <label className={cn("text-[9px] font-bold uppercase text-on-surface-variant ml-1", errors[`education_${idx}_cgpa`] && "!text-red-500")}>CGPA / Percentage</label>
                                    <input
                                      className={cn(
                                        "w-full bg-white dark:bg-black/20 border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all",
                                        errors[`education_${idx}_cgpa`] ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/20 focus:border-primary"
                                      )}
                                      value={edu.cgpa}
                                      onChange={e => updateEducation(idx, 'cgpa', e.target.value)}
                                      placeholder="9.5 or 95%"
                                    />
                                    {errors[`education_${idx}_cgpa`] && <p className="text-[9px] text-red-500 font-bold ml-1 mt-1 uppercase tracking-widest">{errors[`education_${idx}_cgpa`]}</p>}
                                  </div>
                                  <div className="space-y-1">
                                    <label className={cn("text-[9px] font-bold uppercase text-on-surface-variant ml-1", errors[`education_${idx}_year`] && "!text-red-500")}>Year of Completion</label>
                                    <input
                                      className={cn(
                                        "w-full bg-white dark:bg-black/20 border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all",
                                        errors[`education_${idx}_year`] ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/20 focus:border-primary"
                                      )}
                                      value={edu.year}
                                      onChange={e => updateEducation(idx, 'year', e.target.value)}
                                      placeholder="2024"
                                    />
                                    {errors[`education_${idx}_year`] && <p className="text-[9px] text-red-500 font-bold ml-1 mt-1 uppercase tracking-widest">{errors[`education_${idx}_year`]}</p>}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Step 3: Professional Path */}
                      {currentStep === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <h3 className="text-2xl font-black text-on-surface">Professional Path</h3>
                              <p className="text-sm text-on-surface-variant">Your career trajectory so far.</p>
                            </div>
                            <div className="flex items-center gap-3">
                              {/* Fresher Checkbox Option */}
                              <label className="flex items-center gap-2 cursor-pointer bg-surface-container-low border border-outline-variant/30 rounded-2xl px-4 py-3 hover:bg-surface-container-high transition-all">
                                <input
                                  type="checkbox"
                                  className="w-4.5 h-4.5 accent-primary rounded-lg cursor-pointer"
                                  checked={formData.isFresher || false}
                                  onChange={e => {
                                    const val = e.target.checked;
                                    setFormData({
                                      ...formData,
                                      isFresher: val,
                                      experience: val ? 0 : (formData.experience || 1)
                                    });
                                  }}
                                />
                                <span className="text-xs font-black text-on-surface select-none">I am a Fresher (No Experience)</span>
                              </label>

                              {!formData.isFresher && (
                                <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant/30 rounded-2xl px-4 py-2 hover:bg-surface-container-high transition-all">
                                  <span className="text-xs font-black text-on-surface select-none">Total Exp (Years):</span>
                                  <input
                                    type="number"
                                    min="1"
                                    className="w-12 bg-white dark:bg-black/20 border border-outline-variant/20 rounded-xl px-2 py-1 text-xs text-center focus:border-primary outline-none"
                                    value={formData.experience || 1}
                                    onChange={e => setFormData({ ...formData, experience: Math.max(0, Number(e.target.value)) })}
                                  />
                                </div>
                              )}

                              {!formData.isFresher && (
                                <Button variant="outline" size="sm" onClick={addWork} className="rounded-xl border-dashed">
                                  <Plus className="w-4 h-4 mr-2" /> Add More
                                </Button>
                              )}
                            </div>
                          </div>

                          {formData.isFresher ? (
                            <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/20 text-center space-y-4 max-w-xl mx-auto py-12 animate-in zoom-in-95 duration-300">
                              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                                <Sparkles className="w-8 h-8 animate-pulse" />
                              </div>
                              <div className="space-y-2">
                                <h4 className="text-lg font-black text-on-surface">Welcome to your Career Journey! 🌟</h4>
                                <p className="text-xs text-on-surface-variant leading-relaxed max-w-sm mx-auto">
                                  Since you are a fresher, we will skip the work experience requirement. We will showcase your projects and education to grab recruiters' attention!
                                </p>
                              </div>
                            </div>
                          ) : (
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
                                      <label className={cn("text-[9px] font-bold uppercase text-on-surface-variant ml-1", errors[`workExperience_${idx}_role`] && "!text-red-500")}>Job Role</label>
                                      <input
                                        className={cn(
                                          "w-full bg-white dark:bg-black/20 border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all",
                                          errors[`workExperience_${idx}_role`] ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/20 focus:border-primary"
                                        )}
                                        value={work.role}
                                        onChange={e => updateWorkExperience(idx, 'role', e.target.value)}
                                        placeholder="Software Engineer"
                                      />
                                      {errors[`workExperience_${idx}_role`] && <p className="text-[9px] text-red-500 font-bold ml-1 mt-1 uppercase tracking-widest">{errors[`workExperience_${idx}_role`]}</p>}
                                    </div>
                                    <div className="space-y-1">
                                      <label className={cn("text-[9px] font-bold uppercase text-on-surface-variant ml-1", errors[`workExperience_${idx}_company`] && "!text-red-500")}>Company</label>
                                      <input
                                        className={cn(
                                          "w-full bg-white dark:bg-black/20 border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all",
                                          errors[`workExperience_${idx}_company`] ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/20 focus:border-primary"
                                        )}
                                        value={work.company}
                                        onChange={e => updateWorkExperience(idx, 'company', e.target.value)}
                                        placeholder="Google Inc."
                                      />
                                      {errors[`workExperience_${idx}_company`] && <p className="text-[9px] text-red-500 font-bold ml-1 mt-1 uppercase tracking-widest">{errors[`workExperience_${idx}_company`]}</p>}
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                      <label className={cn("text-[9px] font-bold uppercase text-on-surface-variant ml-1", errors[`workExperience_${idx}_duration`] && "!text-red-500")}>Duration</label>
                                      <input
                                        className={cn(
                                          "w-full bg-white dark:bg-black/20 border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all",
                                          errors[`workExperience_${idx}_duration`] ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/20 focus:border-primary"
                                        )}
                                        value={work.duration}
                                        onChange={e => updateWorkExperience(idx, 'duration', e.target.value)}
                                        placeholder="Jan 2022 - Present"
                                      />
                                      {errors[`workExperience_${idx}_duration`] && <p className="text-[9px] text-red-500 font-bold ml-1 mt-1 uppercase tracking-widest">{errors[`workExperience_${idx}_duration`]}</p>}
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <label className={cn("text-[9px] font-bold uppercase text-on-surface-variant ml-1", errors[`workExperience_${idx}_description`] && "!text-red-500")}>Key Contributions</label>
                                    <textarea
                                      rows={3}
                                      className={cn(
                                        "w-full bg-white dark:bg-black/20 border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none resize-none transition-all",
                                        errors[`workExperience_${idx}_description`] ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/20 focus:border-primary"
                                      )}
                                      value={work.description}
                                      onChange={e => updateWorkExperience(idx, 'description', e.target.value)}
                                      placeholder="Developed AI matching algorithms, reduced latency by 40%..."
                                    />
                                    {errors[`workExperience_${idx}_description`] && <p className="text-[9px] text-red-500 font-bold ml-1 mt-1 uppercase tracking-widest">{errors[`workExperience_${idx}_description`]}</p>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
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
                            {/* Technologies Skills */}
                            <div className="space-y-4 p-6 rounded-3xl bg-surface-container-low border border-outline-variant/10 shadow-inner">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                  <Code2 className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-on-surface">Technologies</h4>
                              </div>
                              <input
                                className="w-full bg-white dark:bg-black/20 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    const val = (e.target as HTMLInputElement).value.trim();
                                    if (val && !formData.skills.technologies.includes(val)) {
                                      setFormData({ ...formData, skills: { ...formData.skills, technologies: [...formData.skills.technologies, val] } });
                                      (e.target as HTMLInputElement).value = '';
                                    }
                                  }
                                }}
                                placeholder="HTML5, CSS3, JavaScript, Java..."
                              />
                              <div className="flex flex-wrap gap-2">
                                {formData.skills.technologies.map(skill => (
                                  <span key={skill} className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/5 text-blue-500 text-[10px] font-bold rounded-lg border border-blue-500/10">
                                    {skill}
                                    <X className="w-3 h-3 cursor-pointer" onClick={() => setFormData({ ...formData, skills: { ...formData.skills, technologies: formData.skills.technologies.filter(s => s !== skill) } })} />
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Frameworks / Libraries Skills */}
                            <div className="space-y-4 p-6 rounded-3xl bg-surface-container-low border border-outline-variant/10 shadow-inner">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                                  <Code2 className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-on-surface">Frameworks / Libraries</h4>
                              </div>
                              <input
                                className="w-full bg-white dark:bg-black/20 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    const val = (e.target as HTMLInputElement).value.trim();
                                    if (val && !formData.skills.frameworks.includes(val)) {
                                      setFormData({ ...formData, skills: { ...formData.skills, frameworks: [...formData.skills.frameworks, val] } });
                                      (e.target as HTMLInputElement).value = '';
                                    }
                                  }
                                }}
                                placeholder="React.js, Node.js, Next.js, Express.js..."
                              />
                              <div className="flex flex-wrap gap-2">
                                {formData.skills.frameworks.map(skill => (
                                  <span key={skill} className="flex items-center gap-1.5 px-3 py-1 bg-purple-500/5 text-purple-500 text-[10px] font-bold rounded-lg border border-purple-500/10">
                                    {skill}
                                    <X className="w-3 h-3 cursor-pointer" onClick={() => setFormData({ ...formData, skills: { ...formData.skills, frameworks: formData.skills.frameworks.filter(s => s !== skill) } })} />
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Developer Tools */}
                            <div className="space-y-4 p-6 rounded-3xl bg-surface-container-low border border-outline-variant/10 shadow-inner">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                  <Globe className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-on-surface">Developer Tools</h4>
                              </div>
                              <input
                                className="w-full bg-white dark:bg-black/20 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    const val = (e.target as HTMLInputElement).value.trim();
                                    if (val && !formData.skills.developerTools.includes(val)) {
                                      setFormData({ ...formData, skills: { ...formData.skills, developerTools: [...formData.skills.developerTools, val] } });
                                      (e.target as HTMLInputElement).value = '';
                                    }
                                  }
                                }}
                                placeholder="Postman, VS Code, Figma, XAMPP..."
                              />
                              <div className="flex flex-wrap gap-2">
                                {formData.skills.developerTools.map(skill => (
                                  <span key={skill} className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/5 text-emerald-500 text-[10px] font-bold rounded-lg border border-emerald-500/10">
                                    {skill}
                                    <X className="w-3 h-3 cursor-pointer" onClick={() => setFormData({ ...formData, skills: { ...formData.skills, developerTools: formData.skills.developerTools.filter(s => s !== skill) } })} />
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Databases */}
                            <div className="space-y-4 p-6 rounded-3xl bg-surface-container-low border border-outline-variant/10 shadow-inner">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                                  <User className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-on-surface">Databases</h4>
                              </div>
                              <input
                                className="w-full bg-white dark:bg-black/20 border border-outline-variant/20 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    const val = (e.target as HTMLInputElement).value.trim();
                                    if (val && !formData.skills.databases.includes(val)) {
                                      setFormData({ ...formData, skills: { ...formData.skills, databases: [...formData.skills.databases, val] } });
                                      (e.target as HTMLInputElement).value = '';
                                    }
                                  }
                                }}
                                placeholder="MySQL, MongoDB, PostgreSQL..."
                              />
                              <div className="flex flex-wrap gap-2">
                                {formData.skills.databases.map(skill => (
                                  <span key={skill} className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/5 text-amber-500 text-[10px] font-bold rounded-lg border border-amber-500/10">
                                    {skill}
                                    <X className="w-3 h-3 cursor-pointer" onClick={() => setFormData({ ...formData, skills: { ...formData.skills, databases: formData.skills.databases.filter(s => s !== skill) } })} />
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
                                    <label className={cn("text-[9px] font-bold uppercase text-on-surface-variant ml-1", errors[`projects_${idx}_title`] && "!text-red-500")}>Project Title</label>
                                    <input
                                      className={cn(
                                        "w-full bg-white dark:bg-black/20 border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all",
                                        errors[`projects_${idx}_title`] ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/20 focus:border-primary"
                                      )}
                                      value={project.title}
                                      onChange={e => updateProject(idx, 'title', e.target.value)}
                                      placeholder="AI Job Portal"
                                    />
                                    {errors[`projects_${idx}_title`] && <p className="text-[9px] text-red-500 font-bold ml-1 mt-1 uppercase tracking-widest">{errors[`projects_${idx}_title`]}</p>}
                                  </div>
                                  <div className="space-y-1">
                                    <label className={cn("text-[9px] font-bold uppercase text-on-surface-variant ml-1", errors[`projects_${idx}_link`] && "!text-red-500")}>Live Link / Github</label>
                                    <div className="relative">
                                      <Globe className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary", errors[`projects_${idx}_link`] && "!text-red-500")} />
                                      <input
                                        className={cn(
                                          "w-full bg-white dark:bg-black/20 border rounded-xl pl-9 pr-4 py-3 text-sm focus:border-primary outline-none transition-all",
                                          errors[`projects_${idx}_link`] ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/20 focus:border-primary"
                                        )}
                                        value={project.link}
                                        onChange={e => updateProject(idx, 'link', e.target.value)}
                                        placeholder="https://..."
                                      />
                                    </div>
                                    {errors[`projects_${idx}_link`] && <p className="text-[9px] text-red-500 font-bold ml-1 mt-1 uppercase tracking-widest">{errors[`projects_${idx}_link`]}</p>}
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <label className={cn("text-[9px] font-bold uppercase text-on-surface-variant ml-1", errors[`projects_${idx}_description`] && "!text-red-500")}>Project Summary</label>
                                  <textarea
                                    rows={3}
                                    className={cn(
                                      "w-full bg-white dark:bg-black/20 border rounded-xl px-4 py-3 text-sm focus:border-primary outline-none resize-none transition-all",
                                      errors[`projects_${idx}_description`] ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/20 focus:border-primary"
                                    )}
                                    value={project.description}
                                    onChange={e => updateProject(idx, 'description', e.target.value)}
                                    placeholder="Briefly explain what you built and the impact..."
                                  />
                                  {errors[`projects_${idx}_description`] && <p className="text-[9px] text-red-500 font-bold ml-1 mt-1 uppercase tracking-widest">{errors[`projects_${idx}_description`]}</p>}
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
                        <div className="space-y-10 text-center py-6">
                          <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <FileCheck className="w-10 h-10" />
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-3xl font-black text-on-surface">All Set!</h3>
                            <p className="text-on-surface-variant text-sm max-w-md mx-auto">Your profile is now 100% complete and optimized. You can now download your professional resume or start applying for jobs.</p>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                            {jobId ? (
                              <>
                                <Button
                                  variant="gradient"
                                  className="flex-1 py-6 shadow-xl shadow-primary/20 font-black"
                                  onClick={handleSubmitApplication}
                                  disabled={submittingApplication}
                                >
                                  {submittingApplication ? (
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                  ) : (
                                    <FileCheck className="w-5 h-5 mr-2" />
                                  )}
                                  Submit Application
                                </Button>
                                <Button
                                  variant="outline"
                                  className="flex-1 py-6 border-2 font-bold"
                                  onClick={() => { generatePDF(); }}
                                >
                                  <Download className="w-4 h-4 mr-2" /> Download PDF
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="gradient"
                                  className="flex-1 py-6 shadow-xl shadow-primary/20"
                                  onClick={async () => {
                                    await generatePDF();
                                    onClose();
                                  }}
                                >
                                  <Download className="w-5 h-5 mr-2" /> Download Resume
                                </Button>
                                <Button variant="outline" className="flex-1 py-6 border-2" onClick={onClose}>
                                  Done
                                </Button>
                              </>
                            )}
                          </div>

                          {/* Dynamic Resume PDF File Uploader Card */}
                          <div className="mt-8 border-t border-outline-variant/10 pt-8 max-w-md mx-auto">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-4">
                              Or Upload Your Custom Resume File
                            </h4>

                            <div className="relative group border-2 border-dashed border-outline-variant/30 hover:border-primary/50 rounded-[2rem] p-6 bg-surface-container-low transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[140px]">
                              <input
                                type="file"
                                accept=".pdf"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleResumeUpload}
                                disabled={uploadingResume}
                              />
                              {uploadingResume ? (
                                <div className="flex flex-col items-center gap-2">
                                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                  <span className="text-xs font-bold text-on-surface-variant">Uploading your resume...</span>
                                </div>
                              ) : user?.resume ? (
                                <div className="flex flex-col items-center gap-3">
                                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                    <FileCheck className="w-6 h-6" />
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-xs font-black text-on-surface block">Resume Uploaded! ✅</span>
                                    {uploadedResumeName ? (
                                      <span className="text-[10px] font-bold text-on-surface-variant block truncate max-w-[200px]">{uploadedResumeName}</span>
                                    ) : (
                                      <a
                                        href={user.resume}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1.5 justify-center"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        View Current Resume
                                      </a>
                                    )}
                                  </div>
                                  <span className="text-[9px] font-bold text-on-surface-variant/60 uppercase tracking-widest block border border-outline-variant/30 px-3 py-1 rounded-full bg-surface-container-high">Click to Replace File</span>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center gap-3">
                                  <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Download className="w-6 h-6 rotate-180" />
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-xs font-black text-on-surface block">Drop your PDF resume here</span>
                                    <span className="text-[10px] font-bold text-on-surface-variant block">Max file size: 5MB</span>
                                  </div>
                                  <span className="text-[9px] font-bold text-primary uppercase tracking-widest block bg-primary/5 border border-primary/10 px-3 py-1 rounded-full group-hover:bg-primary group-hover:text-white transition-all">Browse File</span>
                                </div>
                              )}
                            </div>
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
