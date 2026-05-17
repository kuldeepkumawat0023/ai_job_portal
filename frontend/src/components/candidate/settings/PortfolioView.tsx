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
  GraduationCap
} from 'lucide-react';
import { userService } from '@/lib/services/user.services';
import { toast } from 'react-hot-toast';
import { cn } from '@/utils/cn';
import { jsPDF } from 'jspdf';

const PortfolioView = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
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
    projects: []
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
        setProfile(res.data);
        // Initialize edit form with ALL fields
        setEditForm({
          fullname: res.data?.fullname || '',
          bio: res.data?.bio || '',
          experience: res.data?.experience || 0,
          skills: res.data?.skills?.join(', ') || '',
          location: res.data?.location || '',
          phoneNumber: res.data?.phoneNumber || '',
          countryCode: res.data?.countryCode || '+91',
          education: res.data?.education || [],
          workExperience: res.data?.workExperience || [],
          projects: res.data?.projects || []
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
      const margin = 20;
      let yPosition = 20;

      // Color theme
      const primaryColor = [70, 72, 212]; // #4648d4
      const secondaryColor = [39, 41, 109];
      const textColor = [33, 33, 33];
      const grayTextColor = [100, 116, 139];

      // Guess target role from bio or default
      const targetRole = profile.bio?.toLowerCase().includes('frontend') 
        ? 'Senior Frontend Engineer' 
        : profile.bio?.toLowerCase().includes('backend') 
          ? 'Senior Backend Engineer' 
          : 'Professional Candidate';

      // Document Title/Name
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(26);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(profile.fullname || 'Resume', margin, yPosition);
      yPosition += 8;

      // Role
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(14);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text(targetRole, margin, yPosition);
      yPosition += 8;

      // Contact Details Row
      doc.setFontSize(9);
      doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
      const locationText = `Location: ${profile.location || 'Remote'}`;
      const emailText = `Email: ${profile.email || 'N/A'}`;
      const phoneText = `Phone: ${profile.countryCode || '+91'} ${profile.phoneNumber || 'N/A'}`;
      doc.text(`${locationText}  |  ${emailText}  |  ${phoneText}`, margin, yPosition);
      yPosition += 6;

      // Horizontal Divider
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition, 210 - margin, yPosition);
      yPosition += 10;

      // Summary/Bio
      if (profile.bio) {
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text('PROFESSIONAL SUMMARY', margin, yPosition);
        yPosition += 5;

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        const splitBio = doc.splitTextToSize(profile.bio, 210 - margin * 2);
        doc.text(splitBio, margin, yPosition);
        yPosition += (splitBio.length * 5) + 6;
      }

      // Skills & Expertise
      if (profile.skills && profile.skills.length > 0) {
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text('SKILLS & EXPERTISE', margin, yPosition);
        yPosition += 6;

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        const skillsText = profile.skills.join(', ');
        const splitSkills = doc.splitTextToSize(skillsText, 210 - margin * 2);
        doc.text(splitSkills, margin, yPosition);
        yPosition += (splitSkills.length * 5) + 8;
      }

      // Projects Showcase
      if (profile.projects && profile.projects.length > 0) {
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text('FEATURED PROJECTS', margin, yPosition);
        yPosition += 8;

        profile.projects.forEach((proj: any, index: number) => {
          // Page boundary check
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }

          // Project Title
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(11);
          doc.setTextColor(textColor[0], textColor[1], textColor[2]);
          doc.text(`${index + 1}. ${proj.title}`, margin, yPosition);
          
          if (proj.link) {
            // Measure title width while current bold size 11 font is active
            const titleWidth = doc.getTextWidth(`${index + 1}. ${proj.title}`);
            
            doc.setFont('Helvetica', 'italic');
            doc.setFontSize(9);
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            const linkText = ` [Link: ${proj.link}]`;
            doc.text(linkText, margin + titleWidth + 2, yPosition);
          }
          yPosition += 5;

          // Tech stack
          if (proj.stack && proj.stack.length > 0) {
            doc.setFont('Helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
            doc.text(`Tech Stack: ${proj.stack.join(', ')}`, margin, yPosition);
            yPosition += 5;
          }

          // Description
          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(9.5);
          doc.setTextColor(textColor[0], textColor[1], textColor[2]);
          const splitProjDesc = doc.splitTextToSize(proj.description, 210 - margin * 2);
          doc.text(splitProjDesc, margin, yPosition);
          yPosition += (splitProjDesc.length * 4.5) + 6;
        });
      }

      // Work Experience
      if (profile.workExperience && profile.workExperience.length > 0) {
        if (yPosition > 230) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text('PROFESSIONAL EXPERIENCE', margin, yPosition);
        yPosition += 8;

        profile.workExperience.forEach((exp: any) => {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }

          // Role & Company
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(11);
          doc.setTextColor(textColor[0], textColor[1], textColor[2]);
          doc.text(`${exp.role} at ${exp.company}`, margin, yPosition);
          
          // Duration right-aligned
          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(9.5);
          doc.setTextColor(grayTextColor[0], grayTextColor[1], grayTextColor[2]);
          doc.text(exp.duration || '', 210 - margin - doc.getTextWidth(exp.duration || ''), yPosition);
          yPosition += 5;

          // Exp Desc
          if (exp.description) {
            doc.setFont('Helvetica', 'normal');
            doc.setFontSize(9.5);
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            const splitExpDesc = doc.splitTextToSize(exp.description, 210 - margin * 2);
            doc.text(splitExpDesc, margin, yPosition);
            yPosition += (splitExpDesc.length * 4.5) + 6;
          }
        });
      }

      // Save the generated document
      const filename = `${(profile.fullname || 'Resume').replace(/\s+/g, '_')}_Resume.pdf`;
      doc.save(filename);
      toast.success('Resume downloaded successfully!');
    } catch (pdfErr: any) {
      console.error('PDF generation failed:', pdfErr);
      toast.error('Failed to compile PDF resume.');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await userService.updateProfile(profile._id, editForm);
      if (res.success) {
        toast.success('Profile updated successfully!');
        setProfile(res.data);
        setIsEditModalOpen(false);
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

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-10 px-4 md:px-0">
      
      {/* Action Bar */}
      <div className="flex justify-between items-center gap-3 mb-4">
        <h2 className="text-xl font-black text-on-surface uppercase tracking-widest hidden md:block">Professional Portfolio</h2>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsEditModalOpen(true)}
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
              {profile.profilePhoto ? (
                <img alt={profile.fullname} className="w-full h-full object-cover" src={profile.profilePhoto} />
              ) : (
                <div className="text-primary font-black text-4xl">{profile.fullname?.charAt(0)}</div>
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
              <p className="text-xl md:text-2xl text-primary font-bold">{profile.role === 'candidate' ? 'Professional Candidate' : profile.role}</p>
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
            <div className="flex flex-wrap gap-2.5">
              {profile.skills?.length > 0 ? profile.skills.map((skill: string) => (
                <span key={skill} className="bg-surface-container-high px-4 py-2.5 rounded-2xl text-xs font-black text-on-surface border border-outline-variant/10 hover:border-primary/30 transition-all cursor-default shadow-sm">
                  {skill} 
                </span>
              )) : (
                <div className="text-on-surface-variant/50 font-bold italic text-sm">No skills added.</div>
              )}
            </div>
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
                  <p className="text-xs text-on-surface-variant font-medium">{edu.university}</p>
                  {edu.cgpa && <div className="text-[10px] font-bold text-emerald-600 uppercase mt-1">CGPA: {edu.cgpa}</div>}
                </div>
              )) : (
                <div className="text-on-surface-variant/50 font-bold italic text-sm">No education listed.</div>
              )}
            </div>
          </div>

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

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={() => setIsEditModalOpen(false)}></div>
          <div className="relative w-full max-w-4xl max-h-[90vh] glass-card rounded-[40px] shadow-2xl border-outline-variant/20 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center bg-surface-container/30">
              <div>
                <h2 className="text-2xl font-black text-on-surface tracking-tight uppercase">Update Profile</h2>
                <p className="text-sm text-on-surface-variant font-medium">Keep your professional identity fresh</p>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="p-3 hover:bg-error/10 hover:text-error rounded-2xl transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10">
              <form id="edit-profile-form" onSubmit={handleUpdateProfile} className="space-y-12">
                
                {/* Basic Section */}
                <section className="space-y-6">
                  <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                    <span className="w-8 h-[2px] bg-primary/30"></span> Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Full Name</label>
                      <input 
                        className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary transition-all font-medium capitalize"
                        placeholder="John Doe"
                        value={editForm.fullname}
                        onChange={e => setEditForm({...editForm, fullname: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Location (e.g. Remote, City)</label>
                      <input 
                        className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary transition-all font-medium"
                        placeholder="Jaipur, India"
                        value={editForm.location}
                        onChange={e => setEditForm({...editForm, location: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Country Code</label>
                      <input 
                        className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary transition-all font-medium"
                        placeholder="+91"
                        value={editForm.countryCode}
                        onChange={e => setEditForm({...editForm, countryCode: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Phone Number (10 Digits)</label>
                      <input 
                        type="text"
                        maxLength={10}
                        className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary transition-all font-medium"
                        placeholder="9876543210"
                        value={editForm.phoneNumber}
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, ''); // Only numbers
                          if (val.length <= 10) {
                            setEditForm({...editForm, phoneNumber: val});
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Experience (Years)</label>
                      <input 
                        type="number"
                        className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary transition-all font-medium"
                        value={editForm.experience}
                        onChange={e => setEditForm({...editForm, experience: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Professional Bio</label>
                    <textarea 
                      rows={4}
                      className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary transition-all font-medium resize-none"
                      value={editForm.bio}
                      onChange={e => setEditForm({...editForm, bio: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-2">Skills (Comma separated)</label>
                    <input 
                      className="w-full bg-surface-container/50 border border-outline-variant/20 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary transition-all font-medium"
                      placeholder="React, Node.js, TypeScript..."
                      value={editForm.skills}
                      onChange={e => setEditForm({...editForm, skills: e.target.value})}
                    />
                  </div>
                </section>

                {/* Experience Section */}
                <section className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                      <span className="w-8 h-[2px] bg-primary/30"></span> Work History
                    </h3>
                    <button 
                      type="button"
                      onClick={() => addItem('workExperience', { role: '', company: '', duration: '', description: '' })}
                      className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-all"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {editForm.workExperience.map((exp: any, i: number) => (
                      <div key={i} className="p-6 bg-surface-container/30 rounded-3xl border border-outline-variant/10 relative group">
                        <button 
                          type="button"
                          onClick={() => removeItem('workExperience', i)}
                          className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <input 
                            placeholder="Role (e.g. Senior Dev)"
                            className="bg-surface/50 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 ring-primary/30"
                            value={exp.role}
                            onChange={e => updateItem('workExperience', i, 'role', e.target.value)}
                          />
                          <input 
                            placeholder="Company"
                            className="bg-surface/50 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 ring-primary/30"
                            value={exp.company}
                            onChange={e => updateItem('workExperience', i, 'company', e.target.value)}
                          />
                          <input 
                            placeholder="Duration (e.g. 2021 - Present)"
                            className="bg-surface/50 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 ring-primary/30"
                            value={exp.duration}
                            onChange={e => updateItem('workExperience', i, 'duration', e.target.value)}
                          />
                        </div>
                        <textarea 
                          placeholder="Description of your responsibilities..."
                          className="w-full bg-surface/50 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 ring-primary/30 resize-none"
                          rows={2}
                          value={exp.description}
                          onChange={e => updateItem('workExperience', i, 'description', e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Projects Section */}
                <section className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                      <span className="w-8 h-[2px] bg-primary/30"></span> Projects
                    </h3>
                    <button 
                      type="button"
                      onClick={() => addItem('projects', { title: '', description: '', link: '', stack: [] })}
                      className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-all"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {editForm.projects.map((proj: any, i: number) => (
                      <div key={i} className="p-6 bg-surface-container/30 rounded-3xl border border-outline-variant/10 relative group">
                        <button 
                          type="button"
                          onClick={() => removeItem('projects', i)}
                          className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <input 
                          placeholder="Project Title"
                          className="w-full bg-surface/50 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 ring-primary/30 mb-3 font-bold"
                          value={proj.title}
                          onChange={e => updateItem('projects', i, 'title', e.target.value)}
                        />
                        <textarea 
                          placeholder="Description..."
                          className="w-full bg-surface/50 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 ring-primary/30 mb-3 resize-none"
                          rows={2}
                          value={proj.description}
                          onChange={e => updateItem('projects', i, 'description', e.target.value)}
                        />
                        <input 
                          placeholder="Project Link (URL)"
                          className="w-full bg-surface/50 border-none rounded-xl px-4 py-3 text-sm focus:ring-1 ring-primary/30"
                          value={proj.link}
                          onChange={e => updateItem('projects', i, 'link', e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Education Section */}
                <section className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                      <span className="w-8 h-[2px] bg-primary/30"></span> Education
                    </h3>
                    <button 
                      type="button"
                      onClick={() => addItem('education', { degree: '', university: '', cgpa: '', year: '' })}
                      className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-all"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {editForm.education.map((edu: any, i: number) => (
                      <div key={i} className="p-5 bg-surface-container/30 rounded-3xl border border-outline-variant/10 relative group">
                        <button type="button" onClick={() => removeItem('education', i)} className="absolute top-2 right-2 p-1 text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <input placeholder="Degree" className="w-full bg-transparent border-b border-outline-variant/20 mb-2 py-1 text-sm focus:outline-none" value={edu.degree} onChange={e => updateItem('education', i, 'degree', e.target.value)} />
                        <input placeholder="University" className="w-full bg-transparent border-b border-outline-variant/20 mb-2 py-1 text-sm focus:outline-none" value={edu.university} onChange={e => updateItem('education', i, 'university', e.target.value)} />
                        <div className="grid grid-cols-2 gap-2">
                          <input placeholder="Year" className="w-full bg-transparent border-b border-outline-variant/20 py-1 text-xs focus:outline-none" value={edu.year} onChange={e => updateItem('education', i, 'year', e.target.value)} />
                          <input placeholder="CGPA" className="w-full bg-transparent border-b border-outline-variant/20 py-1 text-xs focus:outline-none" value={edu.cgpa} onChange={e => updateItem('education', i, 'cgpa', e.target.value)} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-8 border-t border-outline-variant/10 bg-surface-container/30 flex gap-4">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 px-8 py-4 rounded-[20px] font-black text-sm uppercase tracking-widest border border-outline-variant/20 hover:bg-surface transition-all"
              >
                Cancel
              </button>
              <button 
                form="edit-profile-form"
                disabled={saving}
                className="flex-[2] gradient-button text-white px-8 py-4 rounded-[20px] font-black text-sm uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioView;
