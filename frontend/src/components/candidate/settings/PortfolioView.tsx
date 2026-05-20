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
  User
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { userService } from '@/lib/services/user.services';
import { resumeService } from '@/lib/services/resume.services';
import { cn } from '@/utils/cn';
import { jsPDF } from 'jspdf';
import Image from 'next/image';
import { ProfileEditView } from './ProfileEditView';

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

const PortfolioView = () => {
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
        // Initialize edit form with ALL fields
        const rawCats = (profileData.categorizedSkills || {}) as any;
        const parsedSkillsObj = {
          technologies: rawCats.technologies || rawCats.frontend || [],
          frameworks: rawCats.frameworks || rawCats.backend || [],
          developerTools: rawCats.developerTools || rawCats.tools || [],
          databases: rawCats.databases || rawCats.soft || []
        };
        const hasExistingCategorized = Object.values(parsedSkillsObj).some(arr => arr && arr.length > 0);
        const finalSkillsObj = hasExistingCategorized ? parsedSkillsObj : categorizeSkills(profileData.skills || []);

        setEditForm({
          fullname: profileData.fullname || '',
          bio: profileData.bio || '',
          experience: profileData.experience || 0,
          skills: profileData.skills || [],
          skillsObj: finalSkillsObj,
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
  const exportToPDF = () => {
    if (!profile) {
      toast.error('Profile data not loaded yet');
      return;
    }

    try {
      const doc = new jsPDF();
      const margin = 15;
      let yPosition = 20;

      // Color theme
      const primaryColor = [37, 99, 235]; // Modern Royal Blue
      const secondaryColor = [30, 41, 59]; // Slate 800
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
      const rawCatsForPDF = profile?.categorizedSkills || categorizeSkills(profile?.skills || []);
      const pdfCats = {
        technologies: rawCatsForPDF.technologies || rawCatsForPDF.frontend || [],
        frameworks: rawCatsForPDF.frameworks || rawCatsForPDF.backend || [],
        developerTools: rawCatsForPDF.developerTools || rawCatsForPDF.tools || [],
        databases: rawCatsForPDF.databases || rawCatsForPDF.soft || []
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

          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
          const certInfo = `${cert.issuer || ''} (${cert.year || ''})`;
          doc.text(certInfo, 210 - margin - doc.getTextWidth(certInfo), yPosition);
          yPosition += 4.5;
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
    } catch (pdfErr: any) {
      console.error('PDF generation failed:', pdfErr);
      toast.error('Failed to compile PDF resume.');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const mergedSkills = [
        ...(editForm.skillsObj?.technologies || []),
        ...(editForm.skillsObj?.frameworks || []),
        ...(editForm.skillsObj?.developerTools || []),
        ...(editForm.skillsObj?.databases || [])
      ];
      
      const payload = { 
        ...editForm, 
        skills: mergedSkills.length > 0 ? mergedSkills : editForm.skills,
        categorizedSkills: editForm.skillsObj 
      };
      delete payload.skillsObj; // Remove from payload

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
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-10 px-4 md:px-0">

      {/* Action Bar */}
      <div className="flex justify-between items-center gap-3 mb-4">
        <h2 className="text-xl font-black text-on-surface uppercase tracking-widest hidden md:block">Professional Portfolio</h2>
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsEditing(true)}
            className="flex-1 md:flex-none glass-card px-5 py-2.5 rounded-2xl text-sm font-bold text-primary flex items-center justify-center gap-2 hover:bg-primary/5 transition-all border-primary/20"
          >
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>
          <button
            onClick={exportToPDF}
            className="flex-1 md:flex-none gradient-button text-white px-6 py-2.5 rounded-2xl text-sm font-black shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Download Resume
          </button>
        </div>
      </div>

      {/* Main Profile Header */}
      <div className="glass-card rounded-[40px] p-8 md:p-12 relative overflow-hidden border-outline-variant/10 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
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
              <h1 className="text-4xl md:text-5xl font-black text-on-surface flex flex-col md:flex-row items-center gap-4">
                {profile.fullname}
                <span className="text-[10px] uppercase font-black tracking-[0.2em] bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-2xl border border-emerald-500/20 shadow-sm">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">

          {/* Work Experience */}
          <div className="glass-card rounded-[32px] p-8 md:p-10 border-outline-variant/10 shadow-xl">
            <h3 className="text-2xl font-black text-on-surface flex items-center gap-4 mb-10 uppercase tracking-tight">
              <Briefcase className="w-7 h-7 text-primary" /> Work History
            </h3>

            <div className="space-y-12 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-1 before:bg-gradient-to-b before:from-primary/40 before:to-transparent">
              {profile.workExperience?.length > 0 ? profile.workExperience.map((exp: any, i: number) => (
                <div key={i} className="relative pl-12 group">
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
                </div>
              )) : (
                <div className="pl-12 py-10 text-on-surface-variant/50 font-bold italic">No work history added yet.</div>
              )}
            </div>
          </div>

          {/* Projects */}
          <div className="glass-card rounded-[32px] p-8 md:p-10 border-outline-variant/10 shadow-xl">
            <h3 className="text-2xl font-black text-on-surface flex items-center gap-4 mb-10 uppercase tracking-tight">
              <AppWindow className="w-7 h-7 text-primary" /> Key Projects
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.projects?.length > 0 ? profile.projects.map((proj: any, i: number) => (
                <div key={i} className="bg-surface-container-low/80 dark:bg-surface-container-low/30 border border-outline-variant/30 dark:border-outline-variant/10 rounded-[32px] p-8 hover:shadow-xl dark:hover:shadow-2xl/20 transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between min-h-[220px] hover:border-primary/40 dark:hover:border-primary/40">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-inner">
                        <Code2 className="w-5 h-5" />
                      </div>
                      {proj.link ? (
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-primary/10 rounded-full transition-colors">
                          <ArrowRight className="w-5 h-5 text-primary/60 group-hover:text-primary transition-colors transform group-hover:translate-x-1 duration-300" />
                        </a>
                      ) : (
                        <div className="p-2">
                          <ArrowRight className="w-5 h-5 text-primary/20 transform group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      )}
                    </div>
                    <h4 className="text-xl font-bold text-on-surface mb-3 tracking-tight group-hover:text-primary transition-colors duration-300">{proj.title}</h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-3 mb-2 font-medium">
                      {proj.description}
                    </p>
                  </div>
                  {proj.stack && proj.stack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-outline-variant/20 dark:border-outline-variant/10">
                      {proj.stack.map((s: string, j: number) => (
                        <span key={j} className="text-[9px] font-black px-2.5 py-1 bg-primary-container/40 dark:bg-primary-container/20 text-primary border border-primary/10 dark:border-primary/5 rounded-lg uppercase tracking-widest">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )) : (
                <div className="col-span-full py-10 text-center text-on-surface-variant/50 font-bold italic">No projects added yet.</div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          {/* Skills */}
          <div className="glass-card rounded-[32px] p-8 border-outline-variant/10 shadow-xl">
            <h3 className="text-xl font-black text-on-surface flex items-center gap-3 mb-8 uppercase tracking-widest text-[13px]">
              <BrainCircuit className="w-5 h-5 text-primary" /> Core Expertise
            </h3>
            {profile.skills?.length > 0 ? (() => {
              const rawCats = (profile.categorizedSkills || {}) as any;
              const displaySkills = {
                technologies: rawCats.technologies || rawCats.frontend || [],
                frameworks: rawCats.frameworks || rawCats.backend || [],
                developerTools: rawCats.developerTools || rawCats.tools || [],
                databases: rawCats.databases || rawCats.soft || []
              };
              const hasSkills = Object.values(displaySkills).some(arr => arr && arr.length > 0);
              const finalDisplaySkills = hasSkills ? displaySkills : categorizeSkills(profile.skills);

              return (
                <div className="space-y-6">
                  {finalDisplaySkills.technologies && finalDisplaySkills.technologies.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                        <Code2 className="w-3.5 h-3.5 text-blue-500" /> Technologies
                      </h4>
                      <div className="flex flex-wrap gap-2.5">
                        {finalDisplaySkills.technologies.map((skill: string) => (
                          <span key={skill} className="bg-surface-container-high px-4 py-2.5 rounded-2xl text-xs font-black text-on-surface border border-outline-variant/10 hover:border-blue-500/30 transition-all cursor-default shadow-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {finalDisplaySkills.frameworks && finalDisplaySkills.frameworks.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                        <Code2 className="w-3.5 h-3.5 text-purple-500" /> Frameworks / Libraries
                      </h4>
                      <div className="flex flex-wrap gap-2.5">
                        {finalDisplaySkills.frameworks.map((skill: string) => (
                          <span key={skill} className="bg-surface-container-high px-4 py-2.5 rounded-2xl text-xs font-black text-on-surface border border-outline-variant/10 hover:border-purple-500/30 transition-all cursor-default shadow-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {finalDisplaySkills.developerTools && finalDisplaySkills.developerTools.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-emerald-500" /> Developer Tools
                      </h4>
                      <div className="flex flex-wrap gap-2.5">
                        {finalDisplaySkills.developerTools.map((skill: string) => (
                          <span key={skill} className="bg-surface-container-high px-4 py-2.5 rounded-2xl text-xs font-black text-on-surface border border-outline-variant/10 hover:border-emerald-500/30 transition-all cursor-default shadow-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {finalDisplaySkills.databases && finalDisplaySkills.databases.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-amber-500" /> Databases
                      </h4>
                      <div className="flex flex-wrap gap-2.5">
                        {finalDisplaySkills.databases.map((skill: string) => (
                          <span key={skill} className="bg-surface-container-high px-4 py-2.5 rounded-2xl text-xs font-black text-on-surface border border-outline-variant/10 hover:border-amber-500/30 transition-all cursor-default shadow-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })() : (
              <div className="text-on-surface-variant/50 font-bold italic text-sm">No skills added.</div>
            )}
          </div>

          {/* Education */}
          <div className="glass-card rounded-[32px] p-8 border-outline-variant/10 shadow-xl">
            <h3 className="text-xl font-black text-on-surface flex items-center gap-3 mb-8 uppercase tracking-widest text-[13px]">
              <GraduationCap className="w-5 h-5 text-primary" /> Education
            </h3>
            <div className="space-y-6">
              {profile.education?.length > 0 ? profile.education.map((edu: any, i: number) => (
                <div key={i} className="space-y-1 relative pl-4 border-l-2 border-primary/20">
                  <div className="text-xs font-black text-primary uppercase tracking-widest">{edu.year}</div>
                  <h4 className="font-bold text-on-surface leading-tight">{edu.degree}</h4>
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
          <div className="glass-card rounded-[32px] p-8 border-outline-variant/10 shadow-xl">
            <h3 className="text-xl font-black text-on-surface flex items-center gap-3 mb-8 uppercase tracking-widest text-[13px]">
              <BadgeCheck className="w-5 h-5 text-primary" /> Certificates & Awards
            </h3>
            <div className="space-y-6">
              {profile.certificates?.length > 0 ? profile.certificates.map((cert: any, i: number) => (
                <div key={i} className="space-y-1 relative pl-4 border-l-2 border-primary/20">
                  <div className="text-xs font-black text-primary uppercase tracking-widest">{cert.year}</div>
                  <h4 className="font-bold text-on-surface leading-tight">{cert.name}</h4>
                  <p className="text-xs text-on-surface-variant font-medium">Issued by {cert.issuer}</p>
                </div>
              )) : (
                <div className="text-on-surface-variant/50 font-bold italic text-sm">No certificates listed.</div>
              )}
            </div>
          </div>

          {/* Personal Details */}
          {profile.personalDetail && (profile.personalDetail.dob || profile.personalDetail.gender || profile.personalDetail.languages || profile.personalDetail.hobbies) && (
            <div className="glass-card rounded-[32px] p-8 border-outline-variant/10 shadow-xl">
              <h3 className="text-xl font-black text-on-surface flex items-center gap-3 mb-8 uppercase tracking-widest text-[13px]">
                <User className="w-5 h-5 text-primary" /> Personal Details
              </h3>
              <div className="space-y-4">
                {profile.personalDetail.dob && (
                  <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Date of Birth</span>
                    <span className="text-sm font-black text-on-surface">{profile.personalDetail.dob}</span>
                  </div>
                )}
                {profile.personalDetail.gender && (
                  <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Gender</span>
                    <span className="text-sm font-black text-on-surface">{profile.personalDetail.gender}</span>
                  </div>
                )}
                {profile.personalDetail.languages && (
                  <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Languages Known</span>
                    <span className="text-sm font-black text-on-surface">{profile.personalDetail.languages}</span>
                  </div>
                )}
                {profile.personalDetail.hobbies && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Hobbies</span>
                    <span className="text-sm font-black text-on-surface">{profile.personalDetail.hobbies}</span>
                  </div>
                )}
              </div>
            </div>
          )}


          {/* Stats */}
          <div className="glass-card rounded-[32px] p-8 border-outline-variant/10 shadow-xl bg-primary/5">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4">
                <div className="text-3xl font-black text-primary">{profile.experience || 0}+</div>
                <div className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant opacity-70">Years Exp</div>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-black text-primary">{profile.projects?.length || 0}</div>
                <div className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant opacity-70">Projects</div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default PortfolioView;
