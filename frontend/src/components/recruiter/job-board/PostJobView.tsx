'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Sparkles, 
  Plus, 
  X, 
  ChevronRight, 
  CheckCircle2, 
  BrainCircuit,
  Eye,
  Save,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { toast } from 'react-hot-toast';

// Services
import { jobService } from '@/lib/services/job.services';
import { dashboardService } from '@/lib/services/dashboard.services';

// Components
import { Button } from '@/components/common/Button';

const PostJobView = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [companyId, setCompanyId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: '',
    dept: 'Engineering',
    location: '',
    description: '',
    skills: ['React', 'TypeScript', 'System Design'],
    experienceLevel: 'Mid Level',
    salaryMin: '120,000',
    salaryMax: '180,000',
    currency: 'USD',
    perks: [] as string[]
  });

  const [newSkill, setNewSkill] = useState('');

  const experienceMap: Record<string, number> = {
    'Internship': 0,
    'Entry Level': 0,
    'Junior': 1,
    'Mid Level': 3,
    'Senior': 5,
    'Lead / Manager': 7
  };

  const steps = [
    { id: 1, label: 'Role Details' },
    { id: 2, label: 'Requirements' },
    { id: 3, label: 'Compensation' }
  ];

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const statsRes = await dashboardService.getRecruiterStats();
        if (statsRes.success && statsRes.data?.company?._id) {
          setCompanyId(statsRes.data.company._id);
        }
      } catch (error) {
        console.error("Failed to fetch company info", error);
      }
    };
    fetchCompany();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleNextStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = 'Required';
      if (!formData.dept.trim()) newErrors.dept = 'Required';
      if (!formData.location.trim()) newErrors.location = 'Required';
      if (!formData.description.trim()) newErrors.description = 'Required';
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    } else if (step === 2) {
      if (formData.skills.length === 0) {
        newErrors.skills = 'Add at least one skill';
        setErrors(newErrors);
        return;
      }
    }
    
    setErrors({});
    setStep(step + 1);
  };

  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const skill = newSkill.trim();
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
      setNewSkill('');
      if (errors.skills) {
        setErrors(prev => {
          const newE = { ...prev };
          delete newE.skills;
          return newE;
        });
      }
    }
  };

  const handleKeyDownSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const togglePerk = (perk: string) => {
    setFormData(prev => ({
      ...prev,
      perks: prev.perks.includes(perk) 
        ? prev.perks.filter(p => p !== perk)
        : [...prev.perks, perk]
    }));
  };

  const handleAiGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        description: prev.description + "\n\nWe are looking for an exceptional candidate who can drive impact, lead by example, and thrive in a fast-paced environment. You will be responsible for architecture, mentoring junior devs, and collaborating cross-functionally."
      }));
      if (errors.description) {
        setErrors(prev => {
          const newE = { ...prev };
          delete newE.description;
          return newE;
        });
      }
      setIsGenerating(false);
      toast.success("AI refined your job description!");
    }, 2000);
  };

  const handlePublish = async () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Required';
    if (!formData.dept.trim()) newErrors.dept = 'Required';
    if (!formData.location.trim()) newErrors.location = 'Required';
    if (!formData.description.trim()) newErrors.description = 'Required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setStep(1);
      return;
    }
    
    if (formData.skills.length === 0) {
      setErrors({ skills: 'Required' });
      setStep(2);
      return;
    }
    
    if (!formData.salaryMin) newErrors.salaryMin = 'Required';
    if (!formData.salaryMax) newErrors.salaryMax = 'Required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!companyId) {
      toast.error('Company profile not found. Please ensure your recruiter profile is complete.');
      return;
    }

    setIsPublishing(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        requirements: formData.skills,
        salary: `${formData.salaryMin}-${formData.salaryMax} ${formData.currency.split(' ')[0]}`,
        location: formData.location,
        jobType: 'Full-time',
        experience: experienceMap[formData.experienceLevel] || 0,
        category: formData.dept,
        companyId: companyId
      };

      const res = await jobService.postJob(payload);
      if (res.success) {
        toast.success('Job posted successfully!');
        router.push('/recruiter/dashboard'); 
      } else {
        toast.error('Failed to post job');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to post job');
    } finally {
      setIsPublishing(false);
    }
  };

  // --- Dynamic AI Insights Logic ---
  const getCompetitiveness = () => {
    const maxSalary = parseInt(formData.salaryMax.replace(/,/g, '')) || 0;
    if (maxSalary >= 150000) return { label: 'Strong', percent: 92, textClass: 'text-emerald-500', bgClass: 'bg-emerald-500', shadowClass: 'shadow-[0_0_12px_rgba(16,185,129,0.3)]' };
    if (maxSalary >= 80000) return { label: 'Average', percent: 65, textClass: 'text-yellow-500', bgClass: 'bg-yellow-500', shadowClass: 'shadow-[0_0_12px_rgba(234,179,8,0.3)]' };
    return { label: 'Low', percent: 35, textClass: 'text-orange-500', bgClass: 'bg-orange-500', shadowClass: 'shadow-[0_0_12px_rgba(249,115,22,0.3)]' };
  };

  const getTalentPool = () => {
    const base = 5000;
    const skillReduction = formData.skills.length * 400;
    const experienceReduction = (experienceMap[formData.experienceLevel] || 0) * 300;
    const pool = Math.max(120, base - skillReduction - experienceReduction);
    return pool >= 1000 ? `${(pool/1000).toFixed(1)}k+` : `${pool}+`;
  };

  const getJDTip = () => {
    if (formData.description.length < 50) return "Your job description is quite short. Adding more details about day-to-day responsibilities increases applicant quality.";
    if (!formData.description.toLowerCase().includes('culture') && !formData.description.toLowerCase().includes('team')) {
      return "Consider adding a section about company culture and team dynamics to increase candidate conversion by up to 14%.";
    }
    return "Great job description! It's clear, detailed, and highlights your expectations perfectly.";
  };

  const competitiveness = getCompetitiveness();

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-700">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Board</span>
        </button>
      </div>

      {/* Main Title */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full border border-primary/20">
          <Sparkles size={14} className="animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">AI Assisted Posting</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-on-surface tracking-tighter">Create a New <span className="gradient-text">Opportunity</span></h1>
        <p className="text-on-surface-variant font-medium">Define your role requirements and let AI help you find the perfect match.</p>
      </div>

      {/* Progress Stepper */}
      <div className="flex justify-center items-center gap-4 py-6">
        {steps.map((s, i) => (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center gap-2">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-500",
                step === s.id ? "bg-primary text-white shadow-lg shadow-primary/20 ring-4 ring-primary/10" : 
                step > s.id ? "bg-emerald-500 text-white" : "bg-surface-container text-on-surface-variant"
              )}>
                {step > s.id ? <CheckCircle2 size={20} /> : s.id}
              </div>
              <span className={cn(
                "text-[9px] font-black uppercase tracking-widest",
                step === s.id ? "text-primary" : "text-on-surface-variant opacity-60"
              )}>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn(
                "w-12 md:w-20 h-0.5 rounded-full",
                step > s.id ? "bg-emerald-500" : "bg-outline-variant/20"
              )} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Form Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Input Section */}
        <div className="lg:col-span-7 space-y-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-card rounded-[2rem] p-8 md:p-10 border border-white/10 space-y-8"
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Job Title</label>
                      {errors.title && <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{errors.title}</span>}
                    </div>
                    <div className="relative">
                      <Briefcase className={cn("absolute left-0 top-1/2 -translate-y-1/2", errors.title ? "text-red-500" : "text-on-surface-variant")} size={18} />
                      <input 
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={cn(
                          "w-full bg-transparent border-b pl-7 py-3 font-medium text-on-surface transition-all placeholder:text-on-surface-variant/30 focus:ring-0",
                          errors.title ? "border-red-500 focus:border-red-500" : "border-outline-variant focus:border-primary"
                        )}
                        placeholder="e.g. Senior Staff Frontend Engineer" 
                        type="text" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Department</label>
                        {errors.dept && <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{errors.dept}</span>}
                      </div>
                      <input 
                        name="dept"
                        value={formData.dept}
                        onChange={handleChange}
                        className={cn(
                          "w-full bg-transparent border-b py-3 font-medium text-on-surface transition-all placeholder:text-on-surface-variant/30 focus:ring-0",
                          errors.dept ? "border-red-500 focus:border-red-500" : "border-outline-variant focus:border-primary"
                        )}
                        placeholder="e.g. Engineering"
                        type="text" 
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Location</label>
                        {errors.location && <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{errors.location}</span>}
                      </div>
                      <div className="relative">
                        <MapPin className={cn("absolute left-0 top-1/2 -translate-y-1/2", errors.location ? "text-red-500" : "text-on-surface-variant")} size={18} />
                        <input 
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className={cn(
                            "w-full bg-transparent border-b pl-7 py-3 font-medium text-on-surface transition-all placeholder:text-on-surface-variant/30 focus:ring-0",
                            errors.location ? "border-red-500 focus:border-red-500" : "border-outline-variant focus:border-primary"
                          )} 
                          placeholder="Remote or City" 
                          type="text" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Job Description</label>
                        {errors.description && <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{errors.description}</span>}
                      </div>
                      <button 
                        onClick={handleAiGenerate}
                        disabled={isGenerating}
                        className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all disabled:opacity-50"
                      >
                        {isGenerating ? <Clock size={12} className="animate-spin" /> : <Sparkles size={12} />}
                        {isGenerating ? 'Generating...' : 'AI Refine'}
                      </button>
                    </div>
                    <textarea 
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className={cn(
                        "w-full bg-transparent border rounded-2xl p-6 font-medium text-on-surface focus:ring-0 transition-all resize-none min-h-[200px] leading-relaxed",
                        errors.description ? "border-red-500 focus:border-red-500" : "border-outline-variant/30 focus:border-primary"
                      )}
                      placeholder="Describe the role, impact, and day-to-day responsibilities..."
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-card rounded-[2rem] p-8 md:p-10 border border-white/10 space-y-8"
              >
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Required Skills</label>
                      {errors.skills && <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{errors.skills}</span>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map(skill => (
                        <span key={skill} className="px-4 py-2 bg-primary/5 text-primary rounded-xl text-xs font-bold border border-primary/10 flex items-center gap-2 group">
                          {skill}
                          <button onClick={() => handleRemoveSkill(skill)} className="hover:text-error transition-colors"><X size={14} /></button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <input 
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={handleKeyDownSkill}
                        placeholder="Add a required skill..."
                        className={cn(
                          "flex-1 bg-transparent border-b py-2 font-medium text-sm text-on-surface transition-all placeholder:text-on-surface-variant/30 focus:ring-0",
                          errors.skills ? "border-red-500 focus:border-red-500" : "border-outline-variant focus:border-primary"
                        )}
                      />
                      <Button onClick={handleAddSkill} variant="outline" size="sm" className="rounded-xl flex items-center gap-2">
                        <Plus size={14} /> Add Skill
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Experience Level</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {['Internship', 'Entry Level', 'Junior', 'Mid Level', 'Senior', 'Lead / Manager'].map(level => (
                        <button 
                          key={level} 
                          onClick={() => setFormData(prev => ({ ...prev, experienceLevel: level }))}
                          className={cn(
                            "py-4 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all",
                            formData.experienceLevel === level 
                              ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                              : "border-outline-variant/10 text-on-surface-variant hover:border-primary/40 hover:text-on-surface"
                          )}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-outline-variant/10">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-on-surface">AI Matching Threshold</p>
                        <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest">Only notify for candidates above:</p>
                      </div>
                      <span className="text-2xl font-black text-primary">85%</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden cursor-pointer">
                      <div className="h-full bg-primary w-[85%] rounded-full shadow-[0_0_12px_rgba(var(--primary-rgb),0.3)]" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-card rounded-[2rem] p-8 md:p-10 border border-white/10 space-y-8"
              >
                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Annual Salary Range</label>
                        {(errors.salaryMin || errors.salaryMax) && <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Required</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                          <DollarSign className={cn("absolute left-0 top-1/2 -translate-y-1/2", errors.salaryMin ? "text-red-500" : "text-on-surface-variant")} size={16} />
                          <input 
                            name="salaryMin"
                            value={formData.salaryMin}
                            onChange={handleChange}
                            className={cn(
                              "w-full bg-transparent border-b pl-6 py-3 font-black text-lg text-on-surface transition-all focus:ring-0",
                              errors.salaryMin ? "border-red-500 focus:border-red-500" : "border-outline-variant focus:border-primary"
                            )} 
                            type="text" 
                          />
                        </div>
                        <span className="text-on-surface-variant font-black">to</span>
                        <div className="relative flex-1">
                          <DollarSign className={cn("absolute left-0 top-1/2 -translate-y-1/2", errors.salaryMax ? "text-red-500" : "text-on-surface-variant")} size={16} />
                          <input 
                            name="salaryMax"
                            value={formData.salaryMax}
                            onChange={handleChange}
                            className={cn(
                              "w-full bg-transparent border-b pl-6 py-3 font-black text-lg text-on-surface transition-all focus:ring-0",
                              errors.salaryMax ? "border-red-500 focus:border-red-500" : "border-outline-variant focus:border-primary"
                            )} 
                            type="text" 
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Currency</label>
                      <select 
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 py-4 font-black text-sm text-on-surface transition-all [&>option]:bg-surface"
                      >
                        <option value="USD">USD - United States Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="INR">INR - Indian Rupee</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Perks & Benefits</label>
                    <div className="grid grid-cols-2 gap-4">
                      {['Health Insurance', 'Equity/Stock', 'Unlimited PTO', 'Home Office Stipend'].map(perk => (
                        <div 
                          key={perk} 
                          onClick={() => togglePerk(perk)}
                          className={cn(
                            "flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer",
                            formData.perks.includes(perk)
                              ? "bg-primary/10 border-primary/30"
                              : "bg-surface-container/30 border-outline-variant/10 hover:bg-surface-container/50"
                          )}
                        >
                          <div className={cn(
                            "w-5 h-5 rounded border-2 transition-colors flex items-center justify-center",
                            formData.perks.includes(perk) ? "border-primary" : "border-outline-variant"
                          )}>
                            <CheckCircle2 size={12} className={cn(
                              "text-primary transition-transform",
                              formData.perks.includes(perk) ? "scale-100" : "scale-0"
                            )} />
                          </div>
                          <span className="text-xs font-bold text-on-surface">{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline"
              onClick={() => setStep(Math.max(1, step - 1))}
              className={cn(
                "px-8 py-4 font-black text-[10px] uppercase tracking-[0.2em] transition-all",
                step === 1 ? "opacity-0 pointer-events-none" : ""
              )}
            >
              Previous Step
            </Button>
            {step < 3 ? (
              <Button 
                variant="gradient"
                onClick={handleNextStep}
                className="px-10 py-4 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-xl shadow-primary/20"
              >
                Continue
                <ChevronRight size={16} />
              </Button>
            ) : (
              <Button 
                variant="gradient"
                isLoading={isPublishing}
                onClick={handlePublish}
                className="px-10 py-4 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-xl shadow-primary/30"
              >
                Publish Posting
                <Sparkles size={16} />
              </Button>
            )}
          </div>
        </div>

        {/* Right: AI Analysis Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-[2rem] p-8 border border-white/10 relative overflow-hidden transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
            
            <div className="flex items-center gap-3 mb-8 relative z-10">
              <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                <BrainCircuit size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-on-surface uppercase tracking-widest">Posting Health</h3>
                <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest opacity-60">Real-time AI Insights</p>
              </div>
            </div>

            <div className="space-y-8 relative z-10">
              <div className="space-y-4">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest transition-colors">
                  <span className="text-on-surface-variant">Market Competitiveness</span>
                  <span className={competitiveness.textClass}>{competitiveness.label}</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-1000", competitiveness.bgClass, competitiveness.shadowClass)} 
                    style={{ width: `${competitiveness.percent}%` }}
                  />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-surface-container/50 border border-outline-variant/10 space-y-4">
                <p className="text-[11px] font-bold text-on-surface leading-relaxed">
                  <span className="text-primary font-black uppercase italic mr-1">AI Recommendation:</span> 
                  {competitiveness.label === 'Strong' 
                    ? "Your salary range is highly competitive for this role. Expect a high volume of quality applicants."
                    : competitiveness.label === 'Average'
                    ? "Your salary is aligned with market averages. Adding more perks could boost your applicant pool."
                    : "Consider increasing the salary range to attract top-tier talent in the current market."}
                </p>
                <div className="h-px bg-outline-variant/10" />
                <p className="text-[11px] font-bold text-on-surface leading-relaxed">
                  <span className="text-secondary font-black uppercase italic mr-1">JD Tip:</span> 
                  {getJDTip()}
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <h4 className="text-[10px] font-black text-on-surface uppercase tracking-widest opacity-40">Talent Pool Estimate</h4>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black text-on-surface transition-all">{getTalentPool()}</span>
                  <span className="text-[10px] font-bold text-emerald-500 uppercase mb-1.5 tracking-widest">Potential Matches</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJobView;
