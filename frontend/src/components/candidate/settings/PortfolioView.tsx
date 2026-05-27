'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  BadgeCheck,
  MapPin,
  Link2,
  Code2,
  Mail,
  BrainCircuit,
  AppWindow,
  ArrowRight,
  Sparkles,
  Download,
  Share2,
  Briefcase,
  Edit3,
  X,
  Plus,
  Trash2,
  Loader2,
  Camera,
  GraduationCap,
  Globe,
  User,
  Database
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { userService } from '@/lib/services/user.services';
import { resumeService } from '@/lib/services/resume.services';
import { aiService } from '@/lib/services/ai.services';
import { jsPDF } from 'jspdf';
import Image from 'next/image';
import { ProfileEditView } from './ProfileEditView';
import { useAuth } from '@/hooks/useAuth';



const PortfolioView = () => {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Edit Form States
  const [editForm, setEditForm] = useState<any>({
    fullname: '',
    bio: '',
    experience: 0,
    skills: '',
    location: '',
    phoneNumber: '',
    countryCode: '+91',
    education: [],
    workExperience: [],
    projects: [],
    certificates: [],
    personalDetail: {
      dob: '',
      gender: '',
      languages: '',
      hobbies: ''
    }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const userStr = localStorage.getItem('portal_user');
      if (!userStr) return;
      const user = JSON.parse(userStr);

      const res = await userService.getProfile(user._id || user.id);
      if (res.success) {
        let profileData: any = { ...res.data };

        // Auto-fill from AI Analyzed Resume if fields are empty
        try {
          const resumeRes = await resumeService.getResumeHistory();
          if (resumeRes.success && resumeRes.data.length > 0) {
            const latestResume = resumeRes.data[0];

            if (!profileData.bio && latestResume.summary) {
              profileData.bio = latestResume.summary;
            }
            if ((!profileData.skills || profileData.skills.length === 0) && latestResume.skills) {
              profileData.skills = latestResume.skills;
            }
            if ((!profileData.workExperience || profileData.workExperience.length === 0) && latestResume.recommendedRoles && latestResume.recommendedRoles.length > 0) {
              profileData.workExperience = [{
                role: latestResume.recommendedRoles[0],
                company: 'Based on Resume Analysis',
                duration: latestResume.experience ? `${latestResume.experience} Level` : 'Current',
                description: 'This role and experience was auto-detected by AI from your uploaded resume.'
              }];
            }
            if (!profileData.experience && latestResume.experience) {
              profileData.experience = latestResume.experience === 'Senior' ? 5 : latestResume.experience === 'Mid' ? 3 : 1;
            }
          }
        } catch (err) {
          console.log('No resume history to auto-fill from');
        }

        setProfile(profileData);
        setImageError(false);
        // Build initial skillGroups from new dynamic array format
        const rawCats = profileData.categorizedSkills;
        let skillGroups: Array<{ title: string; skills: string[] }> = [];
        if (Array.isArray(rawCats) && rawCats.length > 0) {
          skillGroups = rawCats.map((g: any) => ({ title: g.title || '', skills: Array.isArray(g.skills) ? g.skills : [] }));
        } else if (profileData.skills?.length > 0) {
          skillGroups = [{ title: '', skills: profileData.skills }];
        }

        setEditForm({
          fullname: profileData.fullname || '',
          bio: profileData.bio || '',
          experience: profileData.experience || 0,
          skills: profileData.skills || [],
          skillGroups,
          location: profileData.location || '',
          phoneNumber: profileData.phoneNumber || '',
          countryCode: profileData.countryCode || '+91',
          education: profileData.education || [],
          workExperience: profileData.workExperience || [],
          projects: profileData.projects || [],
          certificates: (profileData as any).certificates || [],
          personalDetail: (profileData as any).personalDetail || { dob: '', gender: '', languages: '', hobbies: '' }
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  // PDF Generation Engine using jsPDF
  const exportToPDF = async (dataToExport: any = profile) => {
    if (!dataToExport) {
      toast.error('Profile data not loaded yet');
      return;
    }

    toast.loading('Generating Professional Resume...', { id: 'portfolio-pdf-gen' });

    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;

      const targetRole = displayRole;
      const userName = dataToExport.fullname || 'Candidate Name';
      const email = dataToExport.email || '';
      const phone = dataToExport.phoneNumber ? `${dataToExport.countryCode || '+91'} ${dataToExport.phoneNumber}` : '';
      const location = dataToExport.location || '';
      const githubLink = 'github.com/profile';

      // ─── Background Watermark Image ───
      const logoImg = new window.Image();
      await new Promise((resolve) => {
        logoImg.onload = resolve;
        logoImg.onerror = resolve;
        logoImg.src = '/images/logo/logo.png';
        if (logoImg.complete) {
          resolve(true);
        }
      });

      const drawWatermark = () => {
        if (logoImg.complete && logoImg.naturalWidth > 0) {
          doc.saveGraphicsState();
          doc.setGState(new (doc as any).GState({ opacity: 0.1 }));
          const imgWidth = 140;
          const imgHeight = (logoImg.naturalHeight / logoImg.naturalWidth) * imgWidth;
          doc.addImage(logoImg, 'PNG', (pageWidth - imgWidth) / 2, (pageHeight - imgHeight) / 2, imgWidth, imgHeight);
          doc.restoreGraphicsState();
        }
      };

      // Draw watermark on Page 1
      drawWatermark();

      // ─── Header: Professional Blue Block ───
      const headerHeight = 35;
      doc.setFillColor(30, 64, 175); // Deep Blue (#1e40af)
      doc.rect(0, 0, pageWidth, headerHeight, 'F');

      // Left: Name & Title
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text(userName.toUpperCase(), margin, 18);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(220, 230, 255);
      doc.text(targetRole, margin, 26);

      // Right: Contact Info
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);

      let contactY = 16;
      if (phone || location) {
        const contactStr = [phone, location].filter(Boolean).join(' | ');
        doc.text(contactStr, pageWidth - margin, contactY, { align: 'right' });
        contactY += 5;
      }
      if (email) {
        doc.text(email, pageWidth - margin, contactY, { align: 'right' });
        contactY += 5;
      }
      doc.text(githubLink, pageWidth - margin, contactY, { align: 'right' });

      let yPos = headerHeight + 12;

      // Helper for Section Headers
      const drawSectionHeader = (title: string, y: number) => {
        doc.setTextColor(30, 64, 175);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text(title.toUpperCase(), margin, y);

        doc.setDrawColor(30, 64, 175);
        doc.setLineWidth(0.5);
        doc.line(margin, y + 2, pageWidth - margin, y + 2);
        return y + 8;
      };

      const checkPageBreak = (neededHeight: number) => {
        if (yPos + neededHeight > pageHeight - margin) {
          doc.addPage();
          drawWatermark(); // Draw watermark on new page
          yPos = margin + 5;
          return true;
        }
        return false;
      };

      // ─── PROFESSIONAL SUMMARY ───
      if (dataToExport.bio) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9.5);
        const bioLines = doc.splitTextToSize(dataToExport.bio, contentWidth - 12);
        checkPageBreak(bioLines.length * 5 + 10);
        yPos = drawSectionHeader('PROFESSIONAL SUMMARY', yPos);

        doc.setTextColor(50, 50, 50);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9.5);
        doc.text(bioLines, margin, yPos);
        yPos += bioLines.length * 5 + 6;
      }

      // ─── TECHNICAL SKILLS ───
      const hasCategorizedSkills = Array.isArray(dataToExport.categorizedSkills) && dataToExport.categorizedSkills.length > 0;
      const hasFlatSkills = dataToExport.skills && dataToExport.skills.length > 0;

      if (hasCategorizedSkills || hasFlatSkills) {
        checkPageBreak(20);
        yPos = drawSectionHeader('TECHNICAL SKILLS', yPos);

        if (hasCategorizedSkills) {
          dataToExport.categorizedSkills.forEach((g: any) => {
            if (Array.isArray(g.skills) && g.skills.length > 0) {
              const cleanSkills = g.skills.filter(Boolean);
              if (cleanSkills.length === 0) return;

              checkPageBreak(15);
              // Print Category Title
              doc.setFont('helvetica', 'bold');
              doc.setTextColor(30, 64, 175);
              doc.text(g.title ? g.title.toUpperCase() : 'SKILLS', margin, yPos);
              yPos += 5;

              doc.setFont('helvetica', 'normal');
              doc.setTextColor(50, 50, 50);
              doc.setFontSize(9.5);

              const skillsString = cleanSkills.join(', ');
              const skillsLines = doc.splitTextToSize(skillsString, contentWidth - 12);

              checkPageBreak(skillsLines.length * 5);
              doc.text(skillsLines, margin, yPos);
              yPos += skillsLines.length * 5 + 6;
            }
          });
        } else if (hasFlatSkills) {
          const cleanSkills = dataToExport.skills.filter(Boolean);
          if (cleanSkills.length > 0) {
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(50, 50, 50);
            doc.setFontSize(9.5);

            const skillsString = cleanSkills.join(', ');
            const skillsLines = doc.splitTextToSize(skillsString, contentWidth - 12);

            checkPageBreak(skillsLines.length * 5);
            doc.text(skillsLines, margin, yPos);
            yPos += skillsLines.length * 5 + 6;
          }
        }
      }

      // ─── EXPERIENCE ───
      if (dataToExport.workExperience && dataToExport.workExperience.length > 0) {
        checkPageBreak(20);
        yPos = drawSectionHeader('EXPERIENCE', yPos);

        dataToExport.workExperience.forEach((exp: any) => {
          checkPageBreak(25);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(30, 64, 175);
          doc.text(`${exp.role} / ${exp.company}`, margin, yPos);

          if (exp.duration) {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(30, 64, 175);
            doc.text(exp.duration, pageWidth - margin, yPos, { align: 'right' });
          }
          yPos += 5;

          if (exp.description) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9.5);
            doc.setTextColor(50, 50, 50);

            // Split the description by newlines to process individual bullet items
            const bulletItems = exp.description.split('\n').map((item: string) => item.trim()).filter(Boolean);

            bulletItems.forEach((bulletText: string) => {
              // Remove any existing bullet points to prevent double bullets
              const cleanText = bulletText.replace(/^[•\-\*\s\u2022]+/, '');

              // Wrap text with a safety margin
              const wrappedLines = doc.splitTextToSize(cleanText, contentWidth - 12);

              wrappedLines.forEach((line: string, index: number) => {
                checkPageBreak(5);
                if (index === 0) {
                  // Only draw a bullet on the first wrapped line of this bullet item
                  doc.text('•', margin + 2, yPos);
                }
                // Indent text properly to align with the bullet list style
                doc.text(line, margin + 6, yPos);
                yPos += 5;
              });
            });
          } else {
            yPos += 2;
          }
          yPos += 4;
        });
      }

      // ─── PROJECTS ───
      if (dataToExport.projects && dataToExport.projects.length > 0) {
        checkPageBreak(20);
        yPos = drawSectionHeader('PROJECTS', yPos);

        dataToExport.projects.forEach((proj: any) => {
          checkPageBreak(20);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(30, 64, 175);
          doc.text(proj.title, margin, yPos);

          if (proj.link) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(50, 50, 50);
            doc.text(proj.link, pageWidth - margin, yPos, { align: 'right' });
          }
          yPos += 5;

          if (proj.description) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9.5);
            doc.setTextColor(50, 50, 50);

            // Split the description by newlines to process individual bullet items
            const bulletItems = proj.description.split('\n').map((item: string) => item.trim()).filter(Boolean);

            bulletItems.forEach((bulletText: string) => {
              // Remove any existing bullet points to prevent double bullets
              const cleanText = bulletText.replace(/^[•\-\*\s\u2022]+/, '');

              // Wrap text with a safety margin
              const wrappedLines = doc.splitTextToSize(cleanText, contentWidth - 12);

              wrappedLines.forEach((line: string, index: number) => {
                checkPageBreak(5);
                if (index === 0) {
                  // Only draw a bullet on the first wrapped line of this bullet item
                  doc.text('•', margin + 2, yPos);
                }
                // Indent text properly to align with the bullet list style
                doc.text(line, margin + 6, yPos);
                yPos += 5;
              });
            });
          }
          yPos += 4;
        });
      }

      // ─── EDUCATION ───
      if (dataToExport.education && dataToExport.education.length > 0) {
        checkPageBreak(20);
        yPos = drawSectionHeader('EDUCATION', yPos);

        dataToExport.education.forEach((edu: any) => {
          checkPageBreak(15);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(50, 50, 50);
          const eduTitle = `${edu.degree}${edu.university ? ` - ${edu.university}` : ''}`;
          doc.text(eduTitle, margin, yPos);

          if (edu.year) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9.5);
            doc.text(edu.year, pageWidth - margin, yPos, { align: 'right' });
          }
          yPos += 5;

          if (edu.cgpa) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9.5);
            doc.text(`CGPA/Grade: ${edu.cgpa}`, margin, yPos);
            yPos += 6;
          } else {
            yPos += 2;
          }
        });
      }

      // ─── CERTIFICATES ───
      if (dataToExport.certificates && dataToExport.certificates.length > 0) {
        checkPageBreak(20);
        yPos = drawSectionHeader('CERTIFICATES & AWARDS', yPos);

        dataToExport.certificates.forEach((cert: any) => {
          checkPageBreak(15);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(50, 50, 50);
          doc.text(cert.name, margin, yPos);

          if (cert.year) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9.5);
            doc.text(cert.year.toString(), pageWidth - margin, yPos, { align: 'right' });
          }
          yPos += 5;

          if (cert.issuer) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9.5);
            doc.text(cert.issuer, margin, yPos);
            yPos += 6;
          } else {
            yPos += 2;
          }
        });
      }

      // ─── PERSONAL DETAILS ───
      const hasPersonalDetails = dataToExport.personalDetail && (
        dataToExport.personalDetail.dob ||
        dataToExport.personalDetail.gender ||
        dataToExport.personalDetail.languages ||
        dataToExport.personalDetail.hobbies
      );

      if (hasPersonalDetails) {
        checkPageBreak(25);
        yPos = drawSectionHeader('PERSONAL DETAILS', yPos);

        const details = [
          { label: 'Date of Birth', value: dataToExport.personalDetail.dob },
          { label: 'Gender', value: dataToExport.personalDetail.gender },
          { label: 'Languages', value: dataToExport.personalDetail.languages },
          { label: 'Hobbies', value: dataToExport.personalDetail.hobbies }
        ];

        details.forEach((d) => {
          if (d.value) {
            checkPageBreak(8);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9.5);
            doc.setTextColor(50, 50, 50);
            doc.text(`${d.label}: `, margin, yPos);

            doc.setFont('helvetica', 'normal');
            doc.text(d.value, margin + 35, yPos);
            yPos += 6;
          }
        });
        yPos += 2;
      }

      const filename = `${(userName).replace(/\s+/g, '_')}_Resume.pdf`;
      doc.save(filename);
      toast.success('Professional Resume Downloaded!', { id: 'portfolio-pdf-gen' });
    } catch (pdfErr: any) {
      console.error('PDF generation failed:', pdfErr);
      toast.error('Failed to compile PDF resume.', { id: 'portfolio-pdf-gen' });
    }
  };

  const exportEnhancedPDF = async () => {
    if (!profile) return;
    setIsEnhancing(true);
    toast.loading('AI is optimizing your resume...', { id: 'ai-enhance' });
    try {
      const response = await aiService.enhanceResume(profile);
      if (response.success && response.data) {
        toast.success('Resume enhanced! Generating PDF...', { id: 'ai-enhance' });
        await exportToPDF(response.data);
      } else {
        console.warn('AI enhance returned no data, using original profile.');
        toast.loading('Generating your resume...', { id: 'ai-enhance' });
        await exportToPDF();
        toast.success('Resume downloaded!', { id: 'ai-enhance' });
      }
    } catch (err: any) {
      console.error('AI Enhance Error:', err.response?.data?.message || err.message);
      toast.loading('Generating your resume...', { id: 'ai-enhance' });
      await exportToPDF();
      toast.success('Resume downloaded!', { id: 'ai-enhance' });
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Flatten all skill groups into a single skills[] array
      const allSkills: string[] = [];
      (editForm.skillGroups || []).forEach((g: any) => {
        (g.skills || []).forEach((s: string) => { if (s && !allSkills.includes(s)) allSkills.push(s); });
      });

      const payload = {
        ...editForm,
        skills: allSkills,
        categorizedSkills: editForm.skillGroups || []
      };
      delete payload.skillGroups;

      const res = await userService.updateProfile(profile._id, payload);
      if (res.success) {
        toast.success('Profile updated successfully!');
        setProfile(res.data);
        setIsEditing(false);
        // Update local storage to keep sync
        localStorage.setItem('portal_user', JSON.stringify(res.data));
      }
    } catch (error) {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePhoto', file);

    try {
      setSaving(true);
      const res = await userService.updateProfile(profile._id, formData);
      if (res.success) {
        setProfile(res.data);
        setImageError(false);
        localStorage.setItem('portal_user', JSON.stringify(res.data));
        updateUser(res.data);
        toast.success('Photo updated!');
      }
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setSaving(false);
    }
  };

  const addItem = (field: string, template: any) => {
    setEditForm((prev: any) => ({
      ...prev,
      [field]: [...prev[field], template]
    }));
  };

  const removeItem = (field: string, index: number) => {
    setEditForm((prev: any) => ({
      ...prev,
      [field]: prev[field].filter((_: any, i: number) => i !== index)
    }));
  };

  const updateItem = (field: string, index: number, key: string, value: any) => {
    const newItems = [...editForm[field]];
    newItems[index] = { ...newItems[index], [key]: value };
    setEditForm((prev: any) => ({ ...prev, [field]: newItems }));
  };

  const displayRole = React.useMemo(() => {
    if (!profile) return 'Professional Candidate';
    if (profile.role !== 'candidate') return profile.role;
    if (profile.workExperience && profile.workExperience.length > 0 && profile.workExperience[0].role) {
      return profile.workExperience[0].role;
    }
    const bioStr = profile.bio?.toLowerCase() || '';
    if (bioStr.includes('full stack') || bioStr.includes('fullstack')) return 'Full Stack Developer';
    if (bioStr.includes('frontend') || bioStr.includes('front-end')) return 'Frontend Engineer';
    if (bioStr.includes('backend') || bioStr.includes('back-end')) return 'Backend Engineer';
    if (bioStr.includes('ui/ux') || bioStr.includes('designer')) return 'UI/UX Designer';
    if (bioStr.includes('data scientist') || bioStr.includes('data anal')) return 'Data Scientist';
    return 'Professional Candidate';
  }, [profile]);

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-8 pb-10 animate-pulse">
        <div className="h-64 bg-surface-container rounded-3xl"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-surface-container rounded-3xl"></div>
          <div className="h-96 bg-surface-container rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (!profile) return <div className="text-center py-20 text-on-surface-variant font-bold">Please log in to view your portfolio.</div>;

  if (isEditing) {
    return (
      <ProfileEditView
        profile={profile}
        onClose={() => {
          setIsEditing(false);
          fetchProfile(); // Refresh profile values on close/save
        }}
      />
    );
  }

  return (
    <main className="w-full max-w-7xl mx-auto space-y-6 pb-10 px-4 md:px-0">

      {/* SEO Friendly Hidden Content */}
      <h1 className="sr-only">AIJobFit Professional Portfolio</h1>
      <p className="sr-only">
        Showcase your professional portfolio generated dynamically from your AI resume analysis. Highlight your skills, experiences, and projects to top recruiters effortlessly.
      </p>

      {/* Action Bar */}
      <section role="region" aria-label="Portfolio Actions" className="flex justify-between items-center gap-3 mb-6">
        <h2 className="text-2xl font-black text-on-surface uppercase tracking-widest hidden md:block">Professional Portfolio</h2>
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => setIsEditing(true)}
            className="flex-1 md:flex-none glass-card px-5 py-2.5 rounded-2xl text-sm font-bold text-primary flex items-center justify-center gap-2 hover:bg-primary/5 transition-all border-primary/20 whitespace-nowrap"
            aria-label="Edit Profile"
            disabled={isEnhancing}
          >
            <Edit3 className="w-4 h-4" aria-hidden="true" /> Edit Profile
          </button>

          <button
            onClick={exportEnhancedPDF}
            disabled={isEnhancing}
            className="flex-1 md:flex-none gradient-button text-white px-6 py-2.5 rounded-2xl text-sm font-black shadow-xl transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            aria-label="AI Enhance and Download"
          >
            {isEnhancing ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Enhancing...</>
            ) : (
              <><Sparkles className="w-4 h-4" aria-hidden="true" /> AI Enhance & Download</>
            )}
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Main Profile & Content (Spans 8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-6">

          {/* Main Profile Header */}
          <header className="bg-surface-container/30 border border-outline-variant/30 rounded-[40px] p-8 md:p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="flex flex-col md:flex-row gap-10 relative z-10 items-center md:items-start text-center md:text-left">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-44 h-44 rounded-[48px] overflow-hidden border-4 border-surface shadow-2xl relative z-10 bg-surface-container-high flex items-center justify-center">
                  {profile.profilePhoto && !imageError ? (
                    <Image
                      alt={profile.fullname || 'Avatar'}
                      className="object-cover"
                      src={profile.profilePhoto}
                      fill
                      sizes="(max-width: 768px) 176px, 176px"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full bg-primary flex items-center justify-center text-white font-black text-7xl uppercase">
                      {profile.fullname?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handlePhotoUpload} />
                <div className="absolute -bottom-4 -right-4 bg-surface p-2 rounded-[20px] shadow-2xl z-20">
                  <div className="bg-primary text-white rounded-[16px] p-2 flex items-center justify-center shadow-lg">
                    <BadgeCheck className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <h1 className="text-4xl md:text-5xl font-black text-on-surface flex flex-col md:flex-row items-center justify-center md:justify-start gap-4">
                    {profile.fullname}
                    <span className="text-[10px] uppercase font-black tracking-[0.2em] bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-2xl border border-emerald-500/20 shadow-sm whitespace-nowrap">
                      Available Now
                    </span>
                  </h1>
                  <p className="text-xl md:text-2xl text-primary font-bold capitalize">{displayRole}</p>
                  <p className="text-sm text-on-surface-variant flex items-center justify-center md:justify-start gap-2 font-bold uppercase tracking-widest opacity-70">
                    <MapPin className="w-4 h-4 text-primary" /> {profile.location || 'Remote'}
                  </p>
                </div>

                <p className="text-lg text-on-surface-variant leading-relaxed max-w-3xl font-medium">
                  {profile.bio || "No bio added yet. Click 'Edit Profile' to introduce yourself to recruiters!"}
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <button className="px-5 py-3 bg-surface-container-low border border-outline-variant/30 rounded-2xl text-on-surface font-bold text-xs uppercase tracking-widest hover:text-primary hover:border-primary/50 transition-all shadow-sm flex items-center gap-2">
                    <Mail className="w-4 h-4" /> {profile.email}
                  </button>
                  {profile.phoneNumber && (
                    <button className="px-5 py-3 bg-surface-container-low border border-outline-variant/30 rounded-2xl text-on-surface font-bold text-xs uppercase tracking-widest hover:text-primary hover:border-primary/50 transition-all shadow-sm flex items-center gap-2">
                      <span className="text-primary">{profile.countryCode}</span> {profile.phoneNumber}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Work Experience */}
          <section className="bg-surface-container/30 border border-outline-variant/30 rounded-[32px] p-8 md:p-10 shadow-xl">
            <h3 className="text-2xl font-black text-on-surface flex items-center gap-4 mb-10 uppercase tracking-tight">
              <Briefcase className="w-7 h-7 text-primary" /> Work History
            </h3>

            <div className="space-y-12 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-1 before:bg-gradient-to-b before:from-primary/40 before:to-transparent">
              {profile.workExperience?.length > 0 ? profile.workExperience.map((exp: any, i: number) => (
                <article key={i} className="relative pl-12 group">
                  <div className="absolute left-0 top-1 w-10 h-10 rounded-2xl bg-surface border-4 border-primary/20 flex items-center justify-center z-10 transition-transform group-hover:scale-110">
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <h4 className="font-black text-xl text-on-surface tracking-tight">{exp.role}</h4>
                      <span className="text-[10px] font-black px-3 py-1 bg-primary/5 text-primary rounded-lg border border-primary/10 uppercase tracking-widest">{exp.duration}</span>
                    </div>
                    <div className="text-sm font-black text-primary/80 uppercase tracking-widest">{exp.company}</div>
                    <p className="text-sm text-on-surface-variant leading-relaxed font-medium">
                      {exp.description}
                    </p>
                  </div>
                </article>
              )) : (
                <div className="pl-12 py-10 text-on-surface-variant/50 font-bold italic">No work history added yet.</div>
              )}
            </div>
          </section>

          {/* Projects */}
          <section className="bg-surface-container/30 border border-outline-variant/30 rounded-[32px] p-8 md:p-10 shadow-xl">
            <h3 className="text-2xl font-black text-on-surface flex items-center gap-4 mb-10 uppercase tracking-tight">
              <AppWindow className="w-7 h-7 text-primary" /> Key Projects
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.projects?.length > 0 ? profile.projects.map((proj: any, i: number) => (
                <article
                  key={i}
                  className="bg-surface-container-lowest dark:bg-background border border-outline-variant/30 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 relative"
                >
                  <div className="h-44 w-full overflow-hidden relative flex items-center justify-center bg-gradient-to-br from-surface-container to-surface-container-high/40">
                    {/* Decorative image/icon fallback */}
                    <AppWindow className="w-16 h-16 text-primary/10 absolute z-0 group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-10">
                      <span className="bg-black/40 backdrop-blur-md text-white text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-lg border border-white/20">
                        {proj.stack?.[0] || 'AI Platform'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 relative flex flex-col min-h-[160px]">
                    <h4 className="text-base font-bold text-on-surface mb-2">{proj.title}</h4>
                    <p className="text-sm text-on-surface-variant line-clamp-3 mb-4 leading-relaxed font-semibold flex-1">
                      {proj.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {proj.stack?.map((tech: string, j: number) => (
                        <span key={j} className="text-[9px] font-bold px-2 py-0.5 bg-surface-container-high rounded text-on-surface-variant">
                          {tech}
                        </span>
                      ))}
                    </div>

                    {proj.link && (
                      <div className="flex justify-end items-center pt-3 border-t border-outline-variant/20">
                        <a
                          className="text-xs font-bold text-on-surface-variant hover:text-primary flex items-center gap-1 transition-colors"
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Live URL <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                </article>
              )) : (
                <div className="col-span-full py-10 text-center text-on-surface-variant/50 font-bold italic">No projects added yet.</div>
              )}
            </div>
          </section>

        </div>

        {/* Right Column: Sidebar (Spans 4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-6">

          {/* Skills */}
          <div className="bg-surface-container/30 border border-outline-variant/30 rounded-[32px] p-8 shadow-xl">
            <h3 className="text-xl font-black text-on-surface flex items-center gap-3 mb-8 uppercase tracking-widest text-[13px]">
              <BrainCircuit className="w-5 h-5 text-primary" /> Core Expertise
            </h3>
            {(() => {
              const groups: Array<{ title: string; skills: string[] }> = Array.isArray(profile?.categorizedSkills) && profile.categorizedSkills.length > 0
                ? profile.categorizedSkills.map((g: any) => ({ title: g.title || '', skills: Array.isArray(g.skills) ? g.skills : [] }))
                : profile?.skills?.length > 0 ? [{ title: '', skills: profile.skills }] : [];

              const hasAnySkills = groups.some(g => g.skills.length > 0);
              if (!hasAnySkills) return <div className="text-on-surface-variant/50 font-bold italic text-sm">No skills added.</div>;

              const groupColors = [
                { tag: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 hover:border-blue-500/40' },
                { tag: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 hover:border-purple-500/40' },
                { tag: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:border-emerald-500/40' },
                { tag: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:border-amber-500/40' },
                { tag: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 hover:border-rose-500/40' },
                { tag: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20 hover:border-cyan-500/40' },
              ];

              return (
                <div className="space-y-5">
                  {groups.map((group, gi) => {
                    if (!group.skills || group.skills.length === 0) return null;
                    const col = groupColors[gi % groupColors.length];
                    return (
                      <div key={gi} className="space-y-2.5">
                        {group.title && (
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                            <Code2 className="w-3.5 h-3.5 text-primary" /> {group.title}
                          </h4>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {group.skills.map((skill: string) => (
                            <span key={skill} className={`border px-3 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-default shadow-sm ${col.tag}`}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          {/* Education */}
          <div className="bg-surface-container/30 border border-outline-variant/30 rounded-[32px] p-8 shadow-xl">
            <h3 className="text-xl font-black text-on-surface flex items-center gap-3 mb-8 uppercase tracking-widest text-[13px]">
              <GraduationCap className="w-5 h-5 text-primary" /> Education
            </h3>
            <div className="space-y-6">
              {profile.education?.length > 0 ? profile.education.map((edu: any, i: number) => (
                <div key={i} className="space-y-1 relative pl-4 border-l-2 border-primary/20">
                  <div className="text-[10px] font-black text-primary uppercase tracking-widest">{edu.year}</div>
                  <h4 className="text-sm font-bold text-on-surface leading-tight">{edu.degree}</h4>
                  <p className="text-xs text-on-surface-variant font-medium">
                    {edu.university} {edu.board && `(${edu.board})`}
                  </p>
                  {edu.cgpa && <div className="text-[10px] font-bold text-emerald-600 uppercase mt-1">CGPA: {edu.cgpa}</div>}
                </div>
              )) : (
                <div className="text-on-surface-variant/50 font-bold italic text-sm">No education listed.</div>
              )}
            </div>
          </div>

          {/* Certificates & Awards */}
          {profile.certificates?.length > 0 && (
            <div className="bg-surface-container/30 border border-outline-variant/30 rounded-[32px] p-8 shadow-xl">
              <h3 className="text-xl font-black text-on-surface flex items-center gap-3 mb-8 uppercase tracking-widest text-[13px]">
                <BadgeCheck className="w-5 h-5 text-primary" /> Certificates & Awards
              </h3>
              <div className="space-y-6">
                {profile.certificates.map((cert: any, i: number) => (
                  <div key={i} className="space-y-1 relative pl-4 border-l-2 border-primary/20">
                    <div className="text-[10px] font-black text-primary uppercase tracking-widest">{cert.year}</div>
                    <h4 className="text-sm font-bold text-on-surface leading-tight">{cert.name}</h4>
                    <p className="text-xs text-on-surface-variant font-medium">Issued by {cert.issuer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Personal Details */}
          {profile.personalDetail && (profile.personalDetail.dob || profile.personalDetail.gender || profile.personalDetail.languages || profile.personalDetail.hobbies) && (
            <div className="bg-surface-container/30 border border-outline-variant/30 rounded-[32px] p-8 shadow-xl">
              <h3 className="text-xl font-black text-on-surface flex items-center gap-3 mb-8 uppercase tracking-widest text-[13px]">
                <User className="w-5 h-5 text-primary" /> Personal Details
              </h3>
              <div className="space-y-4">
                {profile.personalDetail.dob && (
                  <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Date of Birth</span>
                    <span className="text-[11px] font-black text-on-surface">{profile.personalDetail.dob}</span>
                  </div>
                )}
                {profile.personalDetail.gender && (
                  <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Gender</span>
                    <span className="text-[11px] font-black text-on-surface">{profile.personalDetail.gender}</span>
                  </div>
                )}
                {profile.personalDetail.languages && (
                  <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Languages Known</span>
                    <span className="text-[11px] font-black text-on-surface text-right max-w-[120px] truncate">{profile.personalDetail.languages}</span>
                  </div>
                )}
                {profile.personalDetail.hobbies && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Hobbies</span>
                    <span className="text-[11px] font-black text-on-surface text-right max-w-[120px] truncate">{profile.personalDetail.hobbies}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="bg-surface-container/30 border border-outline-variant/30 rounded-[32px] p-8 shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/10 rounded-full blur-[50px] pointer-events-none"></div>
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="text-center p-4">
                <div className="text-4xl font-black text-primary drop-shadow-sm">{profile.experience || 0}+</div>
                <div className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mt-1">Years Exp</div>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl font-black text-primary drop-shadow-sm">{profile.projects?.length || 0}</div>
                <div className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant mt-1">Projects</div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </main>
  );
};

export default PortfolioView;
