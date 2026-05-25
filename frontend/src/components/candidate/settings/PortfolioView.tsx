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
  const exportToPDF = async () => {
    if (!profile) {
      toast.error('Profile data not loaded yet');
      return;
    }

    toast.loading('Generating PDF Resume...', { id: 'portfolio-pdf-gen' });

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

      // Color theme based on profile.resumeStyle
      const style = profile.resumeStyle || 'modern';
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

      // Use dynamically calculated displayRole
      const targetRole = displayRole;

      // Document Title/Name
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(24);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(profile.fullname || 'Resume', margin, yPosition);
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
      const locationText = `Location: ${profile.location || 'Remote'}`;
      const emailText = `Email: ${profile.email || 'N/A'}`;
      const phoneText = `Phone: ${profile.countryCode || '+91'} ${profile.phoneNumber || 'N/A'}`;

      let personalInfoText = `${locationText}  |  ${emailText}  |  ${phoneText}`;
      if (profile.personalDetail?.dob) {
        personalInfoText += `  |  DOB: ${profile.personalDetail.dob}`;
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
      if (profile.bio) {
        checkPageBreak(25);
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text('PROFESSIONAL SUMMARY', margin, yPosition);
        yPosition += 4;

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        const splitBio = doc.splitTextToSize(profile.bio, 210 - margin * 2);
        doc.text(splitBio, margin, yPosition);
        yPosition += (splitBio.length * 4.2) + 6;
      }

      // Work Experience
      if (profile.workExperience && profile.workExperience.length > 0) {
        checkPageBreak(25);
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text('WORK EXPERIENCE', margin, yPosition);
        yPosition += 5;

        profile.workExperience.forEach((exp: any) => {
          checkPageBreak(22);

          // Role & Company
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(9.5);
          doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
          doc.text(`${exp.role} — ${exp.company}`, margin, yPosition);
          yPosition += 4.5;

          // Duration on next line (below role/company, left-aligned as subtitle)
          if (exp.duration) {
            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
            doc.text(exp.duration, margin, yPosition);
            yPosition += 4.5;
          }

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
      if (profile.projects && profile.projects.length > 0) {
        checkPageBreak(25);
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text('PERSONAL PROJECTS', margin, yPosition);
        yPosition += 5;

        profile.projects.forEach((proj: any, index: number) => {
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
          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(textColor[0], textColor[1], textColor[2]);
          const splitProjDesc = doc.splitTextToSize(proj.description, 210 - margin * 2);
          doc.text(splitProjDesc, margin, yPosition);
          yPosition += (splitProjDesc.length * 4.2) + 5;
        });
        yPosition += 2;
      }

      // Skills & Expertise
      const skillGroups: Array<{ title: string; skills: string[] }> = Array.isArray(profile?.categorizedSkills)
        ? profile.categorizedSkills.map((g: any) => ({ title: g.title || '', skills: Array.isArray(g.skills) ? g.skills : [] }))
        : profile?.skills?.length > 0 ? [{ title: '', skills: profile.skills }] : [];

      const hasAnySkills = skillGroups.some(g => g.skills.length > 0);

      if (hasAnySkills) {
        checkPageBreak(25);
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text('SKILLS & EXPERTISE', margin, yPosition);
        yPosition += 5;

        skillGroups.forEach((group) => {
          if (!group.skills || group.skills.length === 0) return;
          checkPageBreak(10);
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
          const labelText = group.title ? `${group.title}: ` : '';
          const labelWidth = labelText ? doc.getTextWidth(labelText) : 0;
          if (labelText) doc.text(labelText, margin, yPosition);

          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(textColor[0], textColor[1], textColor[2]);
          const skillsLineText = group.skills.join(', ');
          const splitSkills = doc.splitTextToSize(skillsLineText, 210 - margin * 2 - labelWidth);
          doc.text(splitSkills, margin + labelWidth, yPosition);
          yPosition += (splitSkills.length * 4.2) + 1.5;
        });
        yPosition += 4;
      }

      // Education Section
      if (profile.education && profile.education.length > 0) {
        checkPageBreak(25);
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text('EDUCATION', margin, yPosition);
        yPosition += 5;

        profile.education.forEach((edu: any) => {
          checkPageBreak(15);

          // Degree & University
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(9.5);
          doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
          const boardText = edu.board ? ` (${edu.board})` : '';
          doc.text(`${edu.degree} — ${edu.university}${boardText}`, margin, yPosition);
          yPosition += 4.5;

          // Year below degree & university
          if (edu.year) {
            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
            doc.text(edu.year, margin, yPosition);
            yPosition += 4.5;
          }

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

      // Certificates Section
      if (profile.certificates && profile.certificates.length > 0) {
        checkPageBreak(25);
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text('CERTIFICATES & AWARDS', margin, yPosition);
        yPosition += 5;

        profile.certificates.forEach((cert: any) => {
          checkPageBreak(10);
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
          doc.text(cert.name, margin, yPosition);
          yPosition += 4.5;

          // Issuer & Year below certificate name
          const infoParts = [];
          if (cert.issuer) infoParts.push(cert.issuer);
          if (cert.year) infoParts.push(`(${cert.year})`);
          const certInfo = infoParts.join(' ');

          if (certInfo) {
            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
            doc.text(certInfo, margin, yPosition);
            yPosition += 4.5;
          }
        });
        yPosition += 2;
      }

      // Personal Details Section
      const hasPersonalDetails = profile.personalDetail && (
        profile.personalDetail.dob ||
        profile.personalDetail.gender ||
        profile.personalDetail.languages ||
        profile.personalDetail.hobbies
      );

      if (hasPersonalDetails) {
        checkPageBreak(25);
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text('PERSONAL DETAILS', margin, yPosition);
        yPosition += 5;

        const details = [
          { label: 'Date of Birth', value: profile.personalDetail.dob },
          { label: 'Gender', value: profile.personalDetail.gender },
          { label: 'Languages Known', value: profile.personalDetail.languages },
          { label: 'Hobbies', value: profile.personalDetail.hobbies }
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
      const filename = `${(profile.fullname || 'Resume').replace(/\s+/g, '_')}_Resume.pdf`;
      doc.save(filename);
      toast.success('Resume PDF downloaded!', { id: 'portfolio-pdf-gen' });
    } catch (pdfErr: any) {
      console.error('PDF generation failed:', pdfErr);
      toast.error('Failed to compile PDF resume.', { id: 'portfolio-pdf-gen' });
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
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsEditing(true)}
            className="flex-1 md:flex-none glass-card px-5 py-2.5 rounded-2xl text-sm font-bold text-primary flex items-center justify-center gap-2 hover:bg-primary/5 transition-all border-primary/20"
            aria-label="Edit Profile"
          >
            <Edit3 className="w-4 h-4" aria-hidden="true" /> Edit Profile
          </button>
          <button
            onClick={exportToPDF}
            className="flex-1 md:flex-none gradient-button text-white px-6 py-2.5 rounded-2xl text-sm font-black shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            aria-label="Download Resume PDF"
          >
            <Download className="w-4 h-4" aria-hidden="true" /> Download Resume
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
