'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Eye, 
  Share2, 
  Download, 
  BadgeCheck, 
  MapPin, 
  Pencil, 
  Link2, 
  Code2, 
  Mail, 
  BrainCircuit, 
  Plus, 
  X, 
  AppWindow, 
  ArrowRight, 
  Bot, 
  Lightbulb, 
  Blocks, 
  CheckCircle2, 
  MoreHorizontal,
  Check,
  Loader2,
  Phone,
  Briefcase
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { userService } from '@/lib/services/user.services';
import { aiService } from '@/lib/services/ai.services';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';

const PortfolioBuilderView = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // Bio Optimization State
  const [isBioEditing, setIsBioEditing] = useState(false);
  const [bioText, setBioText] = useState('');
  const [optimizingBio, setOptimizingBio] = useState(false);

  // Phone Editing State
  const [isPhoneEditing, setIsPhoneEditing] = useState(false);
  const [phoneText, setPhoneText] = useState('');
  const [countryCodeText, setCountryCodeText] = useState('+91');
  
  // Target Role
  const [targetRole, setTargetRole] = useState('Senior Full-Stack Engineer');
  const [isRoleEditing, setIsRoleEditing] = useState(false);

  // Skill states
  const [newSkillInput, setNewSkillInput] = useState('');
  
  // Projects states
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [optimizingProjectIdx, setOptimizingProjectIdx] = useState<number | null>(null);
  const [newProject, setNewProject] = useState({
    title: '',
    stackString: '',
    description: '',
    link: ''
  });

  // Fetch full user profile details on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?._id) return;
      try {
        setLoading(true);
        const response = await userService.getProfile(user._id);
        if (response.success && response.data) {
          setProfile(response.data);
          setBioText(response.data.bio || '');
          setPhoneText(response.data.phoneNumber || '');
          setCountryCodeText(response.data.countryCode || '+91');
          // Guess target role from bio or default
          if (response.data.bio?.toLowerCase().includes('frontend')) {
            setTargetRole('Senior Frontend Engineer');
          } else if (response.data.bio?.toLowerCase().includes('backend')) {
            setTargetRole('Senior Backend Engineer');
          }
        }
      } catch (error: any) {
        console.error('Error fetching candidate profile:', error);
        toast.error('Failed to load portfolio details');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?._id]);

  // General profile saver helper
  const saveProfileData = async (updatedFields: any) => {
    if (!user?._id) return;
    try {
      setUpdating(true);
      const response = await userService.updateProfile(user._id, updatedFields);
      if (response.success && response.data) {
        setProfile(response.data);
        toast.success('Portfolio updated successfully!');
      } else {
        toast.error('Failed to save updates');
      }
    } catch (error: any) {
      console.error('Error updating portfolio:', error);
      toast.error(error.message || 'Failed to save portfolio edits');
    } finally {
      setUpdating(false);
    }
  };

  // AI Bio Optimization Handler
  const handleAIBioOptimize = async () => {
    if (!bioText.trim()) {
      toast.error('Please enter a bio/summary first to optimize!');
      return;
    }
    try {
      setOptimizingBio(true);
      toast.loading('AI is crafting a professional, impact-driven bio...', { id: 'bio-opt' });
      
      const response = await aiService.optimizePortfolio(bioText, 'bio', targetRole);
      
      if (response.success && response.data) {
        setBioText(response.data);
        toast.success('Bio optimized! Click save to apply changes.', { id: 'bio-opt' });
      } else {
        toast.error('AI Optimization failed. Please try again.', { id: 'bio-opt' });
      }
    } catch (error: any) {
      console.error('AI optimization failed:', error);
      toast.error('Failed to connect to AI Optimizer', { id: 'bio-opt' });
    } finally {
      setOptimizingBio(false);
    }
  };

  // Bio save
  const handleBioSave = async () => {
    await saveProfileData({ bio: bioText });
    setIsBioEditing(false);
  };

  // Skills Management
  const handleAddSkill = async (skillToAdd: string) => {
    const trimmedSkill = skillToAdd.trim();
    if (!trimmedSkill) return;
    
    const currentSkills = profile?.skills || [];
    if (currentSkills.map((s: string) => s.toLowerCase()).includes(trimmedSkill.toLowerCase())) {
      toast.error('Skill already exists!');
      return;
    }

    const updatedSkills = [...currentSkills, trimmedSkill];
    await saveProfileData({ skills: updatedSkills });
    setNewSkillInput('');
  };

  const handleRemoveSkill = async (skillToRemove: string) => {
    const currentSkills = profile?.skills || [];
    const updatedSkills = currentSkills.filter((s: string) => s !== skillToRemove);
    await saveProfileData({ skills: updatedSkills });
  };

  // Project Management
  const handleAddProject = async () => {
    if (!newProject.title.trim() || !newProject.description.trim()) {
      toast.error('Project Title and Description are required!');
      return;
    }

    const stackArray = newProject.stackString
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const projectPayload = {
      title: newProject.title,
      description: newProject.description,
      stack: stackArray,
      link: newProject.link
    };

    const currentProjects = profile?.projects || [];
    const updatedProjects = [...currentProjects, projectPayload];
    
    await saveProfileData({ projects: updatedProjects });
    setIsAddProjectOpen(false);
    setNewProject({ title: '', stackString: '', description: '', link: '' });
  };

  const handleRemoveProject = async (index: number) => {
    if (!confirm('Are you sure you want to remove this project?')) return;
    const currentProjects = profile?.projects || [];
    const updatedProjects = currentProjects.filter((_: any, i: number) => i !== index);
    await saveProfileData({ projects: updatedProjects });
  };

  // Project AI Rewrite Handler
  const handleProjectAIRewrite = async (index: number) => {
    const currentProjects = profile?.projects || [];
    const project = currentProjects[index];
    if (!project) return;

    try {
      setOptimizingProjectIdx(index);
      toast.loading(`AI is rewriting ${project.title} with high-impact metrics...`, { id: 'proj-opt' });

      const response = await aiService.optimizePortfolio(project.description, 'project', targetRole);

      if (response.success && response.data) {
        const updatedProjects = [...currentProjects];
        updatedProjects[index] = {
          ...project,
          description: response.data
        };
        await saveProfileData({ projects: updatedProjects });
        toast.success('Project details optimized and saved!', { id: 'proj-opt' });
      } else {
        toast.error('Failed to optimize project description.', { id: 'proj-opt' });
      }
    } catch (error: any) {
      console.error('Project AI optimization failed:', error);
      toast.error('AI Gateway issue occurred.', { id: 'proj-opt' });
    } finally {
      setOptimizingProjectIdx(null);
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

      // Document Title/Name
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(26);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text(profile.fullname || user?.fullname || 'Resume', margin, yPosition);
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
      const emailText = `Email: ${profile.email || user?.email || 'N/A'}`;
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
      const filename = `${(profile.fullname || user?.fullname || 'Resume').replace(/\s+/g, '_')}_Resume.pdf`;
      doc.save(filename);
      toast.success('Resume downloaded successfully!');
    } catch (pdfErr: any) {
      console.error('PDF generation failed:', pdfErr);
      toast.error('Failed to compile PDF resume.');
    }
  };

  // Preview mock portfolio
  const handlePreview = () => {
    toast.success('Your public link is ready in preview mode! (Simulated)');
  };

  // Share profile link
  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Profile share link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-on-surface-variant font-medium animate-pulse">Compiling portfolio metrics...</p>
      </div>
    );
  }

  const portfolioStrength = Math.min(
    (profile?.bio ? 25 : 0) +
    (profile?.skills?.length > 0 ? 30 : 0) +
    (profile?.projects?.length > 0 ? 30 : 0) +
    (profile?.workExperience?.length > 0 ? 15 : 0),
    100
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-20 px-4 lg:px-0">
      
      {/* Page Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-full flex items-center gap-1 border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" /> AI-Assisted
            </span>
            {updating && (
              <span className="text-[10px] uppercase font-bold tracking-widest text-secondary bg-secondary/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> Saving changes...
              </span>
            )}
          </div>
          <h2 className="text-4xl font-bold text-on-surface mb-2">Portfolio Builder</h2>
          <p className="text-lg text-on-surface-variant max-w-2xl">
            Craft a standout digital presence. Our AI helps structure your projects and highlight skills that matter to top tech recruiters.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={exportToPDF}
            className="gradient-button text-white px-6 py-3 rounded-2xl text-sm font-black shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center gap-2.5 cursor-pointer relative overflow-hidden group hover:scale-[1.03] active:scale-95"
          >
            <div className="absolute inset-0 w-1/2 h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-[shimmer_0.8s_ease-in-out]"></div>
            <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" /> 
            Download Resume
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Main Profile & Content (Spans 8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Header Profile Card */}
          <div className="glass-card rounded-2xl p-8 relative overflow-hidden border border-white/10 dark:border-white/5 shadow-sm">
            {/* Decorative background blur */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-col sm:flex-row gap-8 relative z-10">
              {/* Profile Photo */}
              <div className="relative shrink-0 mx-auto sm:mx-0">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-surface shadow-lg relative z-10 bg-surface-container-high flex items-center justify-center">
                  {profile?.profilePhoto ? (
                    <img 
                      alt={profile?.fullname || user?.fullname} 
                      className="w-full h-full object-cover" 
                      src={profile.profilePhoto} 
                    />
                  ) : (
                    <span className="text-4xl font-bold text-primary">
                      {profile?.fullname?.[0] || user?.fullname?.[0] || 'U'}
                    </span>
                  )}
                </div>
                {/* Verified Badge */}
                <div className="absolute -bottom-3 -right-3 bg-surface p-1 rounded-full shadow-md z-20">
                  <div className="bg-blue-500 text-white rounded-full p-1 flex items-center justify-center">
                    <BadgeCheck className="w-4 h-4" />
                  </div>
                </div>
              </div>
              
              {/* Profile Info */}
              <div className="flex-1 space-y-4 text-center sm:text-left">
                <div>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <h3 className="text-3xl font-bold text-on-surface">
                      {profile?.fullname || user?.fullname || 'Alex Rivera'}
                    </h3>
                    <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
                      Open to Work
                    </span>
                  </div>
                  
                  {isRoleEditing ? (
                    <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                      <input 
                        type="text"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        className="bg-surface-container border border-outline-variant/30 text-sm font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:border-primary text-primary"
                      />
                      <button 
                        onClick={() => setIsRoleEditing(false)}
                        className="bg-primary text-white p-1.5 rounded-lg text-xs font-bold"
                      >
                        Set
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 justify-center sm:justify-start mt-1 group">
                      <p className="text-lg text-primary font-medium">{targetRole}</p>
                      <button 
                        onClick={() => setIsRoleEditing(true)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-surface-container rounded"
                      >
                        <Pencil className="w-3.5 h-3.5 text-on-surface-variant" />
                      </button>
                    </div>
                  )}

                  <p className="text-sm text-on-surface-variant flex items-center justify-center sm:justify-start gap-1.5 mt-2">
                    <MapPin className="w-4 h-4" /> {profile?.location || 'San Francisco, CA (Remote)'}
                  </p>
                </div>
                
                {/* BIO SECTION */}
                <div className="relative bg-surface-container/20 p-4 rounded-xl border border-outline-variant/10 text-left">
                  {isBioEditing ? (
                    <div className="space-y-4">
                      <textarea
                        value={bioText}
                        onChange={(e) => setBioText(e.target.value)}
                        className="w-full min-h-[120px] bg-surface-container-high border border-outline-variant/30 rounded-xl p-4 text-sm focus:outline-none focus:border-primary text-on-surface leading-relaxed resize-none"
                        placeholder="Write a short summary about your skills, engineering journey, and goals..."
                      />
                      <div className="flex justify-between items-center">
                        <button
                          disabled={optimizingBio}
                          onClick={handleAIBioOptimize}
                          className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                        >
                          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                          {optimizingBio ? 'AI Structuring...' : '✨ AI Optimize Bio'}
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setBioText(profile?.bio || '');
                              setIsBioEditing(false);
                            }}
                            className="bg-surface-container-high hover:bg-surface-container-highest px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleBioSave}
                            className="bg-primary text-white hover:bg-primary-fixed-variant px-5 py-2 rounded-xl text-xs font-bold transition-colors"
                          >
                            Save Bio
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-on-surface-variant leading-relaxed max-w-xl pr-6 font-medium">
                        {profile?.bio || "No summary added yet. Click edit to write a professional bio or let AI outline it for you!"}
                      </p>
                      <button 
                        onClick={() => setIsBioEditing(true)}
                        className="absolute right-3 top-3 p-1.5 text-outline hover:text-primary transition-colors bg-surface-container rounded-lg"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                {/* CONTACT INFORMATION ROW */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-center sm:justify-start pt-3 border-t border-outline-variant/15 w-full">
                  
                  {/* Email (Static / Read-only) */}
                  <div className="flex items-center gap-2.5 px-3.5 py-2 bg-surface-container/30 rounded-xl border border-outline-variant/5">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Email Address</p>
                      <p className="text-xs font-semibold text-on-surface select-all">{profile?.email || user?.email || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Phone Number (Editable) */}
                  <div className="flex items-center gap-2.5 px-3.5 py-2 bg-surface-container/30 rounded-xl border border-outline-variant/5 relative group/phone">
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                      <Phone className="w-4 h-4" />
                    </div>
                    
                    {isPhoneEditing ? (
                      <div className="flex items-center gap-1.5">
                        <input 
                          type="text" 
                          placeholder="+91" 
                          value={countryCodeText} 
                          onChange={(e) => setCountryCodeText(e.target.value)}
                          className="bg-surface-container-high border border-outline-variant/30 text-xs font-bold rounded-lg px-2 py-1 focus:outline-none focus:border-primary text-on-surface w-14"
                        />
                        <input 
                          type="text" 
                          placeholder="Phone Number" 
                          value={phoneText} 
                          onChange={(e) => setPhoneText(e.target.value)}
                          className="bg-surface-container-high border border-outline-variant/30 text-xs font-bold rounded-lg px-2 py-1 focus:outline-none focus:border-primary text-on-surface w-28"
                        />
                        <button 
                          onClick={async () => {
                            await saveProfileData({ phoneNumber: phoneText, countryCode: countryCodeText });
                            setIsPhoneEditing(false);
                          }}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white p-1 rounded-lg text-xs font-bold cursor-pointer"
                          title="Save Phone"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => {
                            setPhoneText(profile?.phoneNumber || '');
                            setCountryCodeText(profile?.countryCode || '+91');
                            setIsPhoneEditing(false);
                          }}
                          className="bg-surface-container-highest hover:bg-outline/25 text-on-surface-variant p-1 rounded-lg text-xs font-bold cursor-pointer"
                          title="Cancel"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="text-left">
                          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Phone Number</p>
                          <p className="text-xs font-semibold text-on-surface">
                            {profile?.phoneNumber ? `${profile.countryCode || '+91'} ${profile.phoneNumber}` : 'Not Added'}
                          </p>
                        </div>
                        <button 
                          onClick={() => setIsPhoneEditing(true)}
                          className="p-1 hover:bg-surface-container-high text-on-surface-variant hover:text-primary rounded-lg transition-colors cursor-pointer"
                          title="Edit Phone Number"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Resume / Portfolio Link (Read-only if present) */}
                  {profile?.resume && (
                    <a 
                      href={profile.resume} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 px-3.5 py-2 bg-surface-container/30 rounded-xl border border-outline-variant/5 hover:bg-primary/10 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <Code2 className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Original Resume</p>
                        <p className="text-xs font-semibold text-on-surface flex items-center gap-1">
                          View Uploaded <Sparkles className="w-3 h-3 text-amber-500" />
                        </p>
                      </div>
                    </a>
                  )}

                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="glass-card rounded-2xl p-8 border border-white/10 dark:border-white/5 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-on-surface flex items-center gap-2">
                <BrainCircuit className="w-6 h-6 text-primary" /> Skills & Expertise
              </h3>
              
              {/* Skill Add Input Inline */}
              <div className="flex items-center gap-2">
                <input 
                  type="text"
                  placeholder="e.g. Next.js"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(newSkillInput)}
                  className="bg-surface-container border border-outline-variant/30 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-primary max-w-[130px]"
                />
                <button 
                  onClick={() => handleAddSkill(newSkillInput)}
                  className="text-primary hover:bg-primary/10 p-2 rounded-xl transition-colors font-bold text-xs flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">Core Skills ({profile?.skills?.length || 0})</p>
                <div className="flex flex-wrap gap-2">
                  {profile?.skills && profile.skills.length > 0 ? (
                    profile.skills.map((skill: string) => (
                      <span key={skill} className="bg-surface-container-high border border-outline-variant/30 px-3.5 py-1.5 rounded-xl text-sm font-medium text-on-surface flex items-center gap-2 group hover:border-primary transition-all">
                        {skill} 
                        <button 
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-error rounded-full transition-colors"
                        >
                          <X className="w-3.5 h-3.5 text-outline cursor-pointer opacity-40 group-hover:opacity-100" />
                        </button>
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-on-surface-variant/60 italic">No skills listed yet. Click add or select from AI suggestions below.</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-outline-variant/20">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-primary w-5 h-5 animate-pulse" />
                <h4 className="text-sm font-bold text-on-surface">AI Recommended Skills</h4>
              </div>
              <div className="flex flex-wrap gap-3">
                {['System Design', 'Cloud Architecture', 'GraphQL', 'Docker', 'Kubernetes', 'CI/CD'].map((sSuggest) => {
                  const hasSkill = profile?.skills?.map((s: string) => s.toLowerCase()).includes(sSuggest.toLowerCase());
                  if (hasSkill) return null;
                  return (
                    <button 
                      key={sSuggest}
                      onClick={() => handleAddSkill(sSuggest)}
                      className="bg-surface-container border border-dashed border-primary/40 hover:border-primary px-3.5 py-1.5 rounded-xl text-xs font-semibold text-primary flex items-center gap-1.5 hover:bg-primary/10 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> {sSuggest}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Project Showcase Grid */}
          <div className="glass-card rounded-2xl p-8 border border-white/10 dark:border-white/5 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-on-surface flex items-center gap-2">
                <AppWindow className="w-6 h-6 text-primary" /> Project Showcase ({profile?.projects?.length || 0})
              </h3>
              <button 
                onClick={() => setIsAddProjectOpen(!isAddProjectOpen)}
                className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 hover:bg-primary/20 transition-colors"
              >
                {isAddProjectOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {isAddProjectOpen ? 'Close Editor' : 'New Project'}
              </button>
            </div>

            {/* ADD PROJECT FORM */}
            <AnimatePresence>
              {isAddProjectOpen && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-surface-container/30 border border-outline-variant/30 rounded-2xl p-6 mb-8 overflow-hidden space-y-4"
                >
                  <h4 className="text-sm font-bold text-on-surface uppercase tracking-wider">Add Feature Project</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block mb-1">Project Title</label>
                      <input 
                        type="text"
                        placeholder="e.g. Lumina Dashboard"
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-on-surface"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block mb-1">Tech Stack (comma separated)</label>
                      <input 
                        type="text"
                        placeholder="e.g. React, Node.js, AWS"
                        value={newProject.stackString}
                        onChange={(e) => setNewProject({ ...newProject, stackString: e.target.value })}
                        className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-on-surface"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block mb-1">Project Link (Optional)</label>
                    <input 
                      type="url"
                      placeholder="e.g. https://github.com/alexrivera/lumina"
                      value={newProject.link}
                      onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                      className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary text-on-surface"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block mb-1">Project Description (What did you build? What were the achievements?)</label>
                    <textarea 
                      placeholder="e.g. Architected a real-time data visualization platform..."
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      className="w-full bg-surface-container border border-outline-variant/30 rounded-xl p-4 text-sm focus:outline-none focus:border-primary text-on-surface min-h-[100px] resize-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => setIsAddProjectOpen(false)}
                      className="bg-surface-container-high hover:bg-surface-container-highest px-4 py-2 rounded-xl text-xs font-bold transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleAddProject}
                      className="bg-primary text-white hover:bg-primary-fixed-variant px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      Save Project
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile?.projects && profile.projects.length > 0 ? (
                profile.projects.map((proj: any, idx: number) => (
                  <div 
                    key={idx}
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
                        <button 
                          onClick={() => handleRemoveProject(idx)}
                          className="bg-error/10 hover:bg-error/30 text-error p-1.5 rounded-lg border border-error/20 backdrop-blur-sm cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-5 relative">
                      <h4 className="text-base font-bold text-on-surface mb-2">{proj.title}</h4>
                      <p className="text-sm text-on-surface-variant line-clamp-3 mb-4 leading-relaxed font-semibold">
                        {proj.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {proj.stack?.map((tech: string) => (
                          <span key={tech} className="text-[9px] font-bold px-2 py-0.5 bg-surface-container-high rounded text-on-surface-variant">
                            {tech}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center pt-3 border-t border-outline-variant/20">
                        <button
                          disabled={optimizingProjectIdx === idx}
                          onClick={() => handleProjectAIRewrite(idx)}
                          className="flex items-center gap-1.5 text-xs font-black text-amber-500 hover:text-amber-600 disabled:opacity-50"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          {optimizingProjectIdx === idx ? 'Optimizing...' : 'Apply AI Rewrite'}
                        </button>
                        {proj.link && (
                          <a 
                            className="text-xs font-bold text-on-surface-variant hover:text-primary flex items-center gap-1 transition-colors" 
                            href={proj.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            Live URL <ArrowRight className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 p-12 text-center border-2 border-dashed border-outline-variant/30 rounded-2xl">
                  <Sparkles className="w-10 h-10 text-primary/30 mx-auto mb-3" />
                  <p className="text-sm text-on-surface-variant/80 font-bold">No projects showcase added yet. Click New Project above to customize!</p>
                </div>
              )}
            </div>
          </div>
          
        </div>

        {/* Right Column: AI Recommendations & Tools (Spans 4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AI Recommendations Sidebar */}
          <div className="glass-card rounded-2xl p-6 border-t-4 border-t-primary shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Bot className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-on-surface">AI Optimizer</h3>
            </div>
            
            <p className="text-sm text-on-surface-variant mb-6 leading-relaxed relative z-10">
              Based on your target role of <strong className="text-on-surface">{targetRole}</strong>, AI suggests these structural enhancements.
            </p>
            
            <div className="space-y-4 relative z-10">
              {/* Suggestion 1 */}
              <div className="bg-surface-container-lowest dark:bg-background border border-primary/20 rounded-xl p-4 relative overflow-hidden group shadow-sm">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                <div className="flex gap-4">
                  <div className="mt-0.5 shrink-0">
                    <Lightbulb className="text-primary w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface mb-1.5">Quantify Project Impact</h4>
                    <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">Make sure project descriptions mention key engineering metrics (e.g. latency, reduced build times).</p>
                    <button 
                      onClick={() => {
                        if (profile?.projects?.length > 0) {
                          handleProjectAIRewrite(0);
                        } else {
                          toast.error('Add a project first to apply rewrite!');
                        }
                      }}
                      className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary-fixed-variant flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      Apply First Rewrite <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Suggestion 2 */}
              <div className="bg-surface-container-lowest dark:bg-background border border-outline-variant/30 rounded-xl p-4 relative overflow-hidden group shadow-sm">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary"></div>
                <div className="flex gap-4">
                  <div className="mt-0.5 shrink-0">
                    <Blocks className="text-secondary w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface mb-1.5">Focus Tech Skills</h4>
                    <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">Recruiters values advanced System Design and Kubernetes. Add them if you possess the skills.</p>
                    <button 
                      onClick={() => handleAddSkill('System Design')}
                      className="text-[10px] font-black uppercase tracking-widest text-secondary hover:brightness-110 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      Add System Design <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Suggestion 3 */}
              <div className="bg-surface-container-lowest dark:bg-background border border-outline-variant/30 rounded-xl p-4 relative overflow-hidden group opacity-60">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                <div className="flex gap-4">
                  <div className="mt-0.5 shrink-0">
                    <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface mb-1">Interactive Bio Summary</h4>
                    <p className="text-xs text-on-surface-variant">Completed. Summary is active and keyword-optimized.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-outline-variant/20 relative z-10">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Portfolio Strength</span>
                <span className="text-sm text-primary font-bold">{portfolioStrength}%</span>
              </div>
              <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full relative transition-all duration-1000"
                  style={{ width: `${portfolioStrength}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 w-full animate-[pulse_2s_ease-in-out_infinite]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Skill Radar Widget */}
          <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px] relative border border-white/10 dark:border-white/5 shadow-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant absolute top-6 left-6">Skill Alignment Map</h3>
            <button className="absolute top-6 right-6 text-outline hover:text-primary transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
            
            {/* Abstract Representation of Radar Chart */}
            <div className="w-48 h-48 relative mt-4 opacity-90">
              <svg className="w-full h-full stroke-outline-variant/40 fill-transparent stroke-[1]" viewBox="0 0 100 100">
                <polygon points="50,5 90,25 90,75 50,95 10,75 10,25"></polygon>
                <polygon points="50,20 76,35 76,65 50,80 24,65 24,35"></polygon>
                <polygon points="50,35 63,42 63,58 50,65 37,58 37,42"></polygon>
                
                {/* Axes */}
                <line x1="50" x2="50" y1="50" y2="5"></line>
                <line x1="50" x2="90" y1="50" y2="25"></line>
                <line x1="50" x2="90" y1="50" y2="75"></line>
                <line x1="50" x2="50" y1="50" y2="95"></line>
                <line x1="50" x2="10" y1="50" y2="75"></line>
                <line x1="50" x2="10" y1="50" y2="25"></line>
                
                {/* Data Polygon (Filled) */}
                <polygon className="fill-primary/20 stroke-primary stroke-[1.5] drop-shadow-[0_0_8px_rgba(70,72,212,0.5)]" points="50,25 80,40 70,80 50,85 20,60 30,30"></polygon>
                
                {/* Data Points */}
                <circle className="fill-primary" cx="50" cy="25" r="3"></circle>
                <circle className="fill-primary" cx="80" cy="40" r="3"></circle>
                <circle className="fill-primary" cx="70" cy="80" r="3"></circle>
                <circle className="fill-primary" cx="50" cy="85" r="3"></circle>
                <circle className="fill-primary" cx="20" cy="60" r="3"></circle>
                <circle className="fill-primary" cx="30" cy="30" r="3"></circle>
              </svg>
              
              {/* Labels */}
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Frontend</span>
              <span className="absolute top-1/4 -right-12 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Backend</span>
              <span className="absolute bottom-1/4 -right-8 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Cloud</span>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">DevOps</span>
              <span className="absolute bottom-1/4 -left-10 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Testing</span>
              <span className="absolute top-1/4 -left-14 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Architecture</span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default PortfolioBuilderView;
