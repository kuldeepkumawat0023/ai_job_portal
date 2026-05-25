'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  CheckCircle2,
  AlertCircle,
  User,
  Sparkles,
  Plus,
  Trash2,
  Briefcase,
  GraduationCap,
  FolderOpen,
  Award,
  Globe,
  Loader2,
  Code2,
  Calendar,
  ChevronRight,
  ChevronDown,
  Sparkle,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { userService } from '@/lib/services/user.services';

import { cn } from '@/utils/cn';
import { useAuth } from '@/hooks/useAuth';

interface ProfileEditViewProps {
  profile: any;
  onClose: () => void;
}






// Helper to format any date string into standard HTML date input format YYYY-MM-DD
const formatDateForInput = (dateStr: string) => {
  if (!dateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
  } catch (e) {
    // Ignore invalid formats and return as-is
  }
  return '';
};

const getGenderStyles = (gender: string) => {
  const g = (gender || 'Male').toLowerCase();
  if (g === 'male') {
    return 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/30 dark:border-blue-500/40 text-blue-600 dark:text-blue-400 focus:border-blue-500';
  }
  if (g === 'female') {
    return 'bg-pink-500/5 dark:bg-pink-500/10 border-pink-500/30 dark:border-pink-500/40 text-pink-600 dark:text-pink-400 focus:border-pink-500';
  }
  return 'bg-purple-500/5 dark:bg-purple-500/10 border-purple-500/30 dark:border-purple-500/40 text-purple-600 dark:text-purple-400 focus:border-purple-500';
};

export const ProfileEditView = ({ profile, onClose }: ProfileEditViewProps) => {
  const router = useRouter();
  const { updateUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Custom Gender Dropdown State & Ref
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const genderDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (genderDropdownRef.current && !genderDropdownRef.current.contains(event.target as Node)) {
        setIsGenderOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBack = () => {
    if (onClose) {
      onClose();
    }
    router.push('/candidate/settings/profile');
  };

  // Form State
  const [editForm, setEditForm] = useState<any>({
    fullname: '',
    bio: '',
    experience: 0,
    skills: [],
    location: '',
    phoneNumber: '',
    countryCode: '+91',
    education: [],
    workExperience: [],
    projects: [],
    certificates: [],
    skillGroups: [] as Array<{ title: string; skills: string[] }>,
    personalDetail: {
      dob: '',
      gender: 'Male',
      languages: '',
      hobbies: ''
    }
  });

  // Initialize edit form from profile prop
  useEffect(() => {
    if (profile) {
      // Migrate old categorizedSkills object → new array format if needed
      const rawCats = profile.categorizedSkills;
      let initialSkillGroups: Array<{ title: string; skills: string[] }> = [];

      if (Array.isArray(rawCats) && rawCats.length > 0) {
        // New dynamic array format — load as-is
        initialSkillGroups = rawCats.map((g: any) => ({ title: g.title || '', skills: Array.isArray(g.skills) ? g.skills : [] }));
      }

      // If no categorized skill groups but has a flat skills array, put them in one group
      if (initialSkillGroups.length === 0 && profile.skills?.length > 0) {
        initialSkillGroups = [{ title: '', skills: profile.skills }];
      }

      const newForm = {
        fullname: profile.fullname || '',
        bio: profile.bio || '',
        experience: profile.experience !== undefined ? profile.experience : 0,
        skills: profile.skills || [],
        skillGroups: initialSkillGroups,
        location: profile.location || '',
        phoneNumber: profile.phoneNumber || '',
        countryCode: profile.countryCode || '+91',
        education: profile.education || [],
        workExperience: profile.workExperience || [],
        projects: profile.projects || [],
        certificates: profile.certificates || [],
        personalDetail: {
          dob: profile.personalDetail?.dob ? formatDateForInput(profile.personalDetail.dob) : '',
          gender: profile.personalDetail?.gender || 'Male',
          languages: profile.personalDetail?.languages || '',
          hobbies: profile.personalDetail?.hobbies || ''
        }
      };

      setEditForm(newForm);
      setErrors({});
    }
  }, [profile]);



  // Nest item manipulation helpers
  const addItem = (field: string, template: any) => {
    setEditForm((prev: any) => {
      const newList = [...(prev[field] || []), template];
      const newIndex = newList.length - 1;

      // Add errors immediately for the new empty fields so they render in red instantly
      // Removed initial pre-population of errors on add to match MatrimonialCreate.tsx
      return {
        ...prev,
        [field]: newList
      };
    });
  };

  const removeItem = (field: string, index: number) => {
    setEditForm((prev: any) => {
      const newList = prev[field].filter((_: any, i: number) => i !== index);

      // Shift remaining items' errors to their new indices
      setErrors((prevErrors: any) => {
        const updated: Record<string, string> = {};
        // Keep unrelated errors
        Object.keys(prevErrors).forEach((key) => {
          if (!key.startsWith(`${field}_`)) {
            updated[key] = prevErrors[key];
          }
        });

        // Map errors for remaining shifted indices
        newList.forEach((_: any, i: number) => {
          const oldIndex = i < index ? i : i + 1;
          const subKeys = field === 'workExperience'
            ? ['role', 'company', 'duration', 'description']
            : field === 'projects'
              ? ['title', 'description', 'link', 'stack']
              : field === 'education'
                ? ['degree', 'university', 'board', 'cgpa', 'year']
                : field === 'certificates'
                  ? ['name', 'issuer', 'year']
                  : [];

          subKeys.forEach((subKey) => {
            const oldErrorKey = `${field}_${oldIndex}_${subKey}`;
            const newErrorKey = `${field}_${i}_${subKey}`;
            if (prevErrors[oldErrorKey]) {
              updated[newErrorKey] = prevErrors[oldErrorKey];
            }
          });
        });

        return updated;
      });

      return {
        ...prev,
        [field]: newList
      };
    });
  };

  const updateItem = (field: string, index: number, key: string, value: any) => {
    const newItems = [...editForm[field]];
    newItems[index] = { ...newItems[index], [key]: value };
    setEditForm((prev: any) => ({ ...prev, [field]: newItems }));

    const errorKey = `${field}_${index}_${key}`;

    let isRequired = false;
    let requiredMsg = '';

    if (field === 'workExperience') {
      if (key === 'role') { isRequired = true; requiredMsg = 'Role title is required'; }
      if (key === 'company') { isRequired = true; requiredMsg = 'Company name is required'; }
      if (key === 'duration') { isRequired = true; requiredMsg = 'Duration is required'; }
      if (key === 'description') { isRequired = true; requiredMsg = 'Responsibilities description is required'; }
    } else if (field === 'projects') {
      if (key === 'title') { isRequired = true; requiredMsg = 'Project name is required'; }
      if (key === 'description') { isRequired = true; requiredMsg = 'Project description is required'; }
      if (key === 'stack') { isRequired = true; requiredMsg = 'Tech stack is required'; }
    } else if (field === 'education') {
      if (key === 'degree') { isRequired = true; requiredMsg = 'Degree is required'; }
      if (key === 'university') { isRequired = true; requiredMsg = 'University/College is required'; }
      if (key === 'year') { isRequired = true; requiredMsg = 'Year of completion is required'; }
    } else if (field === 'certificates') {
      if (key === 'name') { isRequired = true; requiredMsg = 'Certificate title is required'; }
      if (key === 'issuer') { isRequired = true; requiredMsg = 'Issuing organization is required'; }
      if (key === 'year') { isRequired = true; requiredMsg = 'Year achieved is required'; }
    }

    const isEmpty = typeof value === 'string' ? value.trim() === '' : (!value || (Array.isArray(value) && value.filter(Boolean).length === 0));

    setErrors((prev: any) => {
      const updated = { ...prev };
      if (isRequired && isEmpty) {
        updated[errorKey] = requiredMsg;
      } else {
        delete updated[errorKey];
      }
      return updated;
    });
  };

  // Skill Group helpers (dynamic categorized skills)
  const addSkillGroup = () => {
    setEditForm((prev: any) => ({
      ...prev,
      skillGroups: [...(prev.skillGroups || []), { title: '', skills: [] }]
    }));
  };

  const removeSkillGroup = (index: number) => {
    setEditForm((prev: any) => ({
      ...prev,
      skillGroups: (prev.skillGroups || []).filter((_: any, i: number) => i !== index)
    }));
  };

  const updateSkillGroupTitle = (index: number, title: string) => {
    setEditForm((prev: any) => {
      const updated = [...(prev.skillGroups || [])];
      updated[index] = { ...updated[index], title };
      return { ...prev, skillGroups: updated };
    });
  };

  const addSkillToGroup = (groupIndex: number, skill: string) => {
    const val = skill.trim();
    if (!val) return;
    setEditForm((prev: any) => {
      const updated = [...(prev.skillGroups || [])];
      const currentSkills = updated[groupIndex]?.skills || [];
      if (!currentSkills.includes(val)) {
        updated[groupIndex] = { ...updated[groupIndex], skills: [...currentSkills, val] };
      }
      return { ...prev, skillGroups: updated };
    });
  };

  const removeSkillFromGroup = (groupIndex: number, skill: string) => {
    setEditForm((prev: any) => {
      const updated = [...(prev.skillGroups || [])];
      updated[groupIndex] = { ...updated[groupIndex], skills: (updated[groupIndex]?.skills || []).filter((s: string) => s !== skill) };
      return { ...prev, skillGroups: updated };
    });
  };

  // Dynamic Validation Engine
  const validateForm = () => {
    const errs: Record<string, string> = {};

    // 1. Basic Info Validation
    if (!editForm.fullname?.trim()) {
      errs.fullname = 'Full name is required';
    } else if (editForm.fullname.length > 50) {
      errs.fullname = 'Full name must not exceed 50 characters';
    }

    if (!editForm.location?.trim()) {
      errs.location = 'Location is required';
    } else if (editForm.location.length > 50) {
      errs.location = 'Location must not exceed 50 characters';
    }

    if (!editForm.countryCode?.trim()) {
      errs.countryCode = 'Country code is required';
    } else if (editForm.countryCode.length > 6) {
      errs.countryCode = 'Country code must not exceed 6 characters';
    }

    if (!editForm.phoneNumber?.trim()) {
      errs.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(editForm.phoneNumber)) {
      errs.phoneNumber = 'Phone number must be exactly 10 digits';
    }

    if (editForm.experience === undefined || editForm.experience === null || isNaN(Number(editForm.experience))) {
      errs.experience = 'Experience is required';
    } else {
      const expNum = Number(editForm.experience);
      if (expNum < 0 || expNum > 100) {
        errs.experience = 'Experience must be between 0 and 100 years';
      }
    }

    if (!editForm.bio?.trim()) {
      errs.bio = 'Professional bio is required';
    } else if (editForm.bio.length < 10) {
      errs.bio = 'Bio must be at least 10 characters long';
    } else if (editForm.bio.length > 500) {
      errs.bio = 'Bio must not exceed 500 characters';
    }

    // 2. Work Experience Validation
    if (Array.isArray(editForm.workExperience)) {
      editForm.workExperience.forEach((exp: any, i: number) => {
        if (!exp.role?.trim()) {
          errs[`workExperience_${i}_role`] = 'Role title is required';
        } else if (exp.role.length > 50) {
          errs[`workExperience_${i}_role`] = 'Role title must not exceed 50 characters';
        }

        if (!exp.company?.trim()) {
          errs[`workExperience_${i}_company`] = 'Company name is required';
        } else if (exp.company.length > 50) {
          errs[`workExperience_${i}_company`] = 'Company name must not exceed 50 characters';
        }

        if (!exp.duration?.trim()) {
          errs[`workExperience_${i}_duration`] = 'Duration is required';
        } else if (exp.duration.length > 50) {
          errs[`workExperience_${i}_duration`] = 'Duration must not exceed 50 characters';
        }

        if (!exp.description?.trim()) {
          errs[`workExperience_${i}_description`] = 'Responsibilities description is required';
        } else if (exp.description.length < 10) {
          errs[`workExperience_${i}_description`] = 'Description must be at least 10 characters long';
        }
      });
    }

    // 3. Projects Validation
    if (Array.isArray(editForm.projects)) {
      editForm.projects.forEach((proj: any, i: number) => {
        if (!proj.title?.trim()) {
          errs[`projects_${i}_title`] = 'Project name is required';
        } else if (proj.title.length > 50) {
          errs[`projects_${i}_title`] = 'Project name must not exceed 50 characters';
        }

        if (proj.link?.trim()) {
          if (proj.link.length > 100) {
            errs[`projects_${i}_link`] = 'Project link must not exceed 100 characters';
          } else {
            const urlPattern = /^(https?:\/\/)?([\w\-]+(\.[\w\-]+)+)([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?$/i;
            if (!urlPattern.test(proj.link.trim())) {
              errs[`projects_${i}_link`] = 'Please enter a valid URL';
            }
          }
        }

        if (!proj.description?.trim()) {
          errs[`projects_${i}_description`] = 'Project description is required';
        } else if (proj.description.length < 10) {
          errs[`projects_${i}_description`] = 'Description must be at least 10 characters';
        }

        const stackArr = Array.isArray(proj.stack) ? proj.stack : (proj.stack ? proj.stack.split(',') : []);
        const filteredStack = stackArr.map((s: any) => typeof s === 'string' ? s.trim() : '').filter(Boolean);
        if (filteredStack.length === 0) {
          errs[`projects_${i}_stack`] = 'Tech stack is required';
        }
      });
    }

    // 4. Education Validation
    if (Array.isArray(editForm.education)) {
      editForm.education.forEach((edu: any, i: number) => {
        if (!edu.degree?.trim()) {
          errs[`education_${i}_degree`] = 'Degree is required';
        } else if (edu.degree.length > 50) {
          errs[`education_${i}_degree`] = 'Degree must not exceed 50 characters';
        }

        if (!edu.university?.trim()) {
          errs[`education_${i}_university`] = 'University/College is required';
        } else if (edu.university.length > 50) {
          errs[`education_${i}_university`] = 'University must not exceed 50 characters';
        }

        if (edu.board?.trim() && edu.board.length > 50) {
          errs[`education_${i}_board`] = 'Board must not exceed 50 characters';
        }

        if (edu.cgpa?.trim() && edu.cgpa.length > 10) {
          errs[`education_${i}_cgpa`] = 'CGPA must not exceed 10 characters';
        }

        if (!edu.year || !edu.year.toString().trim()) {
          errs[`education_${i}_year`] = 'Year of completion is required';
        } else if (!/^\d{4}$/.test(edu.year.toString().trim())) {
          errs[`education_${i}_year`] = 'Year must be a 4-digit number';
        } else {
          const yr = Number(edu.year);
          if (yr < 1900 || yr > 2100) {
            errs[`education_${i}_year`] = 'Please enter a valid year between 1900 and 2100';
          }
        }
      });
    }

    // 5. Certifications Validation
    if (Array.isArray(editForm.certificates)) {
      editForm.certificates.forEach((cert: any, i: number) => {
        if (!cert.name?.trim()) {
          errs[`certificates_${i}_name`] = 'Certificate title is required';
        } else if (cert.name.length > 50) {
          errs[`certificates_${i}_name`] = 'Certificate name must not exceed 50 characters';
        }

        if (!cert.issuer?.trim()) {
          errs[`certificates_${i}_issuer`] = 'Issuing organization is required';
        } else if (cert.issuer.length > 50) {
          errs[`certificates_${i}_issuer`] = 'Issuer name must not exceed 50 characters';
        }

        if (!cert.year || !cert.year.toString().trim()) {
          errs[`certificates_${i}_year`] = 'Year achieved is required';
        } else if (!/^\d{4}$/.test(cert.year.toString().trim())) {
          errs[`certificates_${i}_year`] = 'Year must be a 4-digit number';
        } else {
          const yr = Number(cert.year);
          if (yr < 1900 || yr > 2100) {
            errs[`certificates_${i}_year`] = 'Please enter a valid year between 1900 and 2100';
          }
        }
      });
    }

    // 6. Personal Details Validation
    const pd = editForm.personalDetail || {};
    if (!pd.dob?.trim()) {
      errs.dob = 'Date of birth is required';
    } else {
      const birthDate = new Date(pd.dob);
      const today = new Date();
      if (isNaN(birthDate.getTime())) {
        errs.dob = 'Please enter a valid date';
      } else if (birthDate > today) {
        errs.dob = 'Date of birth cannot be in the future';
      }
    }

    if (!pd.gender?.trim()) {
      errs.gender = 'Gender is required';
    }

    if (!pd.languages?.trim()) {
      errs.languages = 'Languages are required';
    } else if (pd.languages.length > 50) {
      errs.languages = 'Languages must not exceed 50 characters';
    }

    if (!pd.hobbies?.trim()) {
      errs.hobbies = 'Hobbies are required';
    } else if (pd.hobbies.length > 50) {
      errs.hobbies = 'Hobbies must not exceed 50 characters';
    }

    setErrors(errs);
    return errs;
  };

  // Save profile to database
  const handleSaveProfile = async (e: React.FormEvent) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    // Clear old errors and validate
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      // Dynamic scroll to the first invalid field
      const firstErrorKey = Object.keys(validationErrors)[0];
      const errorEl = document.getElementById(firstErrorKey);
      if (errorEl) {
        errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (errorEl.tagName === 'INPUT' || errorEl.tagName === 'TEXTAREA' || errorEl.tagName === 'SELECT') {
          errorEl.focus();
        }
      }
      return;
    }

    setSaving(true);
    try {
      // Build flat skills array from all skill groups
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
        toast.success('Your professional portfolio has been saved successfully!');
        // Update local storage to keep candidate data synchronized
        localStorage.setItem('portal_user', JSON.stringify(res.data));
        updateUser(res.data);
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update portfolio settings.');
    } finally {
      setSaving(false);
    }
  };



  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-20 px-4 md:px-0 animate-fadeIn">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="glass-card p-3 rounded-2xl text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all border-outline-variant/20 cursor-pointer flex items-center justify-center shadow-md hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-on-surface uppercase tracking-widest flex items-center gap-2">
              Edit Profile <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            </h1>
            <p className="text-sm text-on-surface-variant font-medium">Detailed configuration of your professional identity</p>
          </div>
        </div>
        <div>
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="gradient-button text-white px-6 py-2.5 rounded-2xl text-sm font-black shadow-xl hover:scale-[1.02] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            Save Changes
          </button>
        </div>
      </div>

      {/* Unified Form Card Container */}
      <div className="glass-card rounded-[32px] p-8 md:p-12 border-outline-variant/10 shadow-xl relative overflow-hidden bg-surface-container/5 space-y-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div>
          {/* 2. Basic Information Section */}
          <h3 className="text-lg font-black text-on-surface flex items-center gap-3 mb-6 uppercase tracking-widest">
            <User className="w-5 h-5 text-primary" /> Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-1.5">
              <label className={cn("text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1.5", errors.fullname && "!text-red-500")}>Full Name</label>
              <input
                id="fullname"
                maxLength={50}
                className={cn(
                  "w-full bg-surface-container/40 border rounded-2xl px-4 py-3.5 focus:outline-none transition-all font-medium capitalize text-sm text-on-surface",
                  errors.fullname ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/20 focus:border-primary"
                )}
                placeholder="John Doe"
                value={editForm.fullname}
                onChange={e => {
                  setEditForm({ ...editForm, fullname: e.target.value });
                  if (e.target.value.trim() === '') {
                    setErrors(prev => ({ ...prev, fullname: 'Full name is required' }));
                  } else {
                    setErrors(prev => {
                      const updated = { ...prev };
                      delete updated.fullname;
                      return updated;
                    });
                  }
                }}
              />
              {errors.fullname && <p className="text-[10px] !text-red-500 font-bold ml-1.5 mt-1 uppercase tracking-widest">{errors.fullname}</p>}
            </div>
            <div className="space-y-1.5">
              <label className={cn("text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1.5", errors.location && "!text-red-500")}>Location (e.g. Jaipur, India)</label>
              <input
                id="location"
                maxLength={50}
                className={cn(
                  "w-full bg-surface-container/40 border rounded-2xl px-4 py-3.5 focus:outline-none transition-all font-medium text-sm text-on-surface",
                  errors.location ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/20 focus:border-primary"
                )}
                placeholder="Jaipur, India"
                value={editForm.location}
                onChange={e => {
                  setEditForm({ ...editForm, location: e.target.value });
                  if (e.target.value.trim() === '') {
                    setErrors(prev => ({ ...prev, location: 'Location is required' }));
                  } else {
                    setErrors(prev => {
                      const updated = { ...prev };
                      delete updated.location;
                      return updated;
                    });
                  }
                }}
              />
              {errors.location && <p className="text-[10px] !text-red-500 font-bold ml-1.5 mt-1 uppercase tracking-widest">{errors.location}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="space-y-1.5">
              <label className={cn("text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1.5", errors.countryCode && "!text-red-500")}>Country Code</label>
              <input
                id="countryCode"
                maxLength={6}
                className={cn(
                  "w-full bg-surface-container/40 border rounded-2xl px-4 py-3.5 focus:outline-none transition-all font-medium text-sm text-on-surface",
                  errors.countryCode ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/20 focus:border-primary"
                )}
                placeholder="+91"
                value={editForm.countryCode}
                onChange={e => {
                  setEditForm({ ...editForm, countryCode: e.target.value });
                  if (e.target.value.trim() === '') {
                    setErrors(prev => ({ ...prev, countryCode: 'Country code is required' }));
                  } else {
                    setErrors(prev => {
                      const updated = { ...prev };
                      delete updated.countryCode;
                      return updated;
                    });
                  }
                }}
              />
              {errors.countryCode && <p className="text-[10px] !text-red-500 font-bold ml-1.5 mt-1 uppercase tracking-widest">{errors.countryCode}</p>}
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className={cn("text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1.5", errors.phoneNumber && "!text-red-500")}>Phone Number (10 Digits)</label>
              <input
                id="phoneNumber"
                type="text"
                maxLength={10}
                className={cn(
                  "w-full bg-surface-container/40 border rounded-2xl px-4 py-3.5 focus:outline-none transition-all font-medium text-sm text-on-surface",
                  errors.phoneNumber ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/20 focus:border-primary"
                )}
                placeholder="9876543210"
                value={editForm.phoneNumber}
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.length <= 10) {
                    setEditForm({ ...editForm, phoneNumber: val });
                    if (val.trim() === '') {
                      setErrors(prev => ({ ...prev, phoneNumber: 'Phone number is required' }));
                    } else if (val.length !== 10) {
                      setErrors(prev => ({ ...prev, phoneNumber: 'Phone number must be exactly 10 digits' }));
                    } else {
                      setErrors(prev => {
                        const updated = { ...prev };
                        delete updated.phoneNumber;
                        return updated;
                      });
                    }
                  }
                }}
              />
              {errors.phoneNumber && <p className="text-[10px] !text-red-500 font-bold ml-1.5 mt-1 uppercase tracking-widest">{errors.phoneNumber}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-1.5">
              <label className={cn("text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1.5", errors.experience && "!text-red-500")}>Experience (Years)</label>
              <input
                id="experience"
                type="number"
                className={cn(
                  "w-full bg-surface-container/40 border rounded-2xl px-4 py-3.5 focus:outline-none transition-all font-medium text-sm text-on-surface",
                  errors.experience ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/20 focus:border-primary"
                )}
                value={editForm.experience}
                onChange={e => {
                  const val = e.target.value;
                  setEditForm({ ...editForm, experience: val === '' ? '' : parseInt(val) || 0 });
                  if (val === '') {
                    setErrors(prev => ({ ...prev, experience: 'Experience is required' }));
                  } else {
                    const expNum = parseInt(val);
                    if (isNaN(expNum) || expNum < 0 || expNum > 100) {
                      setErrors(prev => ({ ...prev, experience: 'Experience must be between 0 and 100 years' }));
                    } else {
                      setErrors(prev => {
                        const updated = { ...prev };
                        delete updated.experience;
                        return updated;
                      });
                    }
                  }
                }}
              />
              {errors.experience && <p className="text-[10px] !text-red-500 font-bold ml-1.5 mt-1 uppercase tracking-widest">{errors.experience}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className={cn("text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1.5", errors.bio && "!text-red-500")}>Professional Bio</label>
              <span className="text-[10px] text-on-surface-variant opacity-60 font-bold uppercase tracking-wider">{editForm.bio?.length || 0} / 500 characters</span>
            </div>
            <textarea
              id="bio"
              rows={4}
              maxLength={500}
              className={cn(
                "w-full bg-surface-container/40 border rounded-2xl px-4 py-3.5 focus:outline-none transition-all font-medium resize-none text-sm text-on-surface leading-relaxed",
                errors.bio ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/20 focus:border-primary"
              )}
              value={editForm.bio}
              onChange={e => {
                setEditForm({ ...editForm, bio: e.target.value });
                if (e.target.value.trim() === '') {
                  setErrors(prev => ({ ...prev, bio: 'Professional bio is required' }));
                } else if (e.target.value.length < 10) {
                  setErrors(prev => ({ ...prev, bio: 'Bio must be at least 10 characters long' }));
                } else {
                  setErrors(prev => {
                    const updated = { ...prev };
                    delete updated.bio;
                    return updated;
                  });
                }
              }}
              placeholder="Write a brief, impactful introductory bio about your career path..."
            />
            {errors.bio && <p className="text-[10px] !text-red-500 font-bold ml-1.5 mt-1 uppercase tracking-widest">{errors.bio}</p>}
          </div>
        </div>

        <div className="border-t border-outline-variant/10 pt-10">
          {/* 3. Skill Galaxy Section */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black text-on-surface flex items-center gap-3 uppercase tracking-widest">
              <Code2 className="w-5 h-5 text-primary" /> Skill Galaxy
            </h3>
            <button
              type="button"
              onClick={addSkillGroup}
              className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary/20 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Skill Group
            </button>
          </div>

          <div className="space-y-6">
            {(editForm.skillGroups || []).map((group: any, gi: number) => {
              // Cycle through distinct colors per group
              const groupColors = [
                { dot: 'bg-blue-500', tag: 'bg-blue-500/10 border-blue-500/20 text-blue-500', inputFocus: 'focus:border-blue-400', border: 'border-blue-500/20 hover:border-blue-400/40' },
                { dot: 'bg-purple-500', tag: 'bg-purple-500/10 border-purple-500/20 text-purple-500', inputFocus: 'focus:border-purple-400', border: 'border-purple-500/20 hover:border-purple-400/40' },
                { dot: 'bg-emerald-500', tag: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500', inputFocus: 'focus:border-emerald-400', border: 'border-emerald-500/20 hover:border-emerald-400/40' },
                { dot: 'bg-amber-500', tag: 'bg-amber-500/10 border-amber-500/20 text-amber-500', inputFocus: 'focus:border-amber-400', border: 'border-amber-500/20 hover:border-amber-400/40' },
                { dot: 'bg-rose-500', tag: 'bg-rose-500/10 border-rose-500/20 text-rose-500', inputFocus: 'focus:border-rose-400', border: 'border-rose-500/20 hover:border-rose-400/40' },
                { dot: 'bg-cyan-500', tag: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-500', inputFocus: 'focus:border-cyan-400', border: 'border-cyan-500/20 hover:border-cyan-400/40' },
              ];
              const col = groupColors[gi % groupColors.length];

              return (
                <div key={gi} className={cn(
                  "p-6 bg-surface-container/20 rounded-3xl border relative group transition-all duration-300",
                  col.border
                )}>
                  {/* Delete Group Button */}
                  <button
                    type="button"
                    onClick={() => removeSkillGroup(gi)}
                    className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Group Title */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn("w-3 h-3 rounded-full shrink-0", col.dot)}></div>
                    <input
                      type="text"
                      maxLength={40}
                      placeholder="Group title (e.g. Marketing, Development, Design...)"
                      value={group.title}
                      onChange={e => updateSkillGroupTitle(gi, e.target.value)}
                      className="flex-1 bg-transparent border-b border-outline-variant/20 px-1 py-1 text-sm font-black text-on-surface uppercase tracking-widest focus:outline-none focus:border-primary placeholder:normal-case placeholder:tracking-normal placeholder:font-medium placeholder:text-on-surface-variant/40 transition-colors"
                    />
                  </div>

                  {/* Tag Input */}
                  <input
                    className={cn(
                      "w-full bg-white dark:bg-black/15 border border-outline-variant/15 rounded-xl px-3 py-2.5 text-xs mb-3 outline-none transition-all",
                      col.inputFocus
                    )}
                    placeholder="Type a skill and press Enter to add..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const target = e.target as HTMLInputElement;
                        if (target.value.trim()) {
                          addSkillToGroup(gi, target.value);
                          target.value = '';
                        }
                      }
                    }}
                  />

                  {/* Skill Tags */}
                  <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                    {group.skills?.map((skill: string) => (
                      <span key={skill} className={cn(
                        "flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-lg border group/tag cursor-default",
                        col.tag
                      )}>
                        {skill}
                        <X
                          className="w-2.5 h-2.5 cursor-pointer opacity-60 group-hover/tag:opacity-100 shrink-0"
                          onClick={() => removeSkillFromGroup(gi, skill)}
                        />
                      </span>
                    ))}
                    {(!group.skills || group.skills.length === 0) && (
                      <span className="text-[10px] text-on-surface-variant opacity-40 font-bold italic py-1">No skills added yet. Type above and press Enter.</span>
                    )}
                  </div>
                </div>
              );
            })}

            {(!editForm.skillGroups || editForm.skillGroups.length === 0) && (
              <div className="py-10 text-center text-on-surface-variant/40 font-bold italic text-sm border border-dashed border-outline-variant/20 rounded-2xl">
                No skill groups yet. Click &quot;Add Skill Group&quot; to create your first category.
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-outline-variant/10 pt-10">
          {/* 4. Work History Section */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black text-on-surface flex items-center gap-3 uppercase tracking-widest">
              <Briefcase className="w-5 h-5 text-primary" /> Work History
            </h3>
            <button
              type="button"
              onClick={() => addItem('workExperience', { role: '', company: '', duration: '', description: '' })}
              className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary/20 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Experience
            </button>
          </div>

          <div className="space-y-6">
            {editForm.workExperience?.map((exp: any, i: number) => {
              const roleError = errors[`workExperience_${i}_role`];
              const companyError = errors[`workExperience_${i}_company`];
              const durationError = errors[`workExperience_${i}_duration`];
              const descError = errors[`workExperience_${i}_description`];

              return (
                <div key={i} className="p-6 bg-surface-container/20 rounded-3xl border border-outline-variant/10 relative group hover:border-primary/20 transition-all duration-300">
                  <button
                    type="button"
                    onClick={() => removeItem('workExperience', i)}
                    className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-1">
                      <label className={cn("text-[9px] font-black uppercase tracking-widest text-on-surface-variant ml-1", roleError && "!text-red-500")}>Role Title</label>
                      <input
                        id={`workExperience_${i}_role`}
                        maxLength={50}
                        placeholder="e.g. Senior Software Engineer"
                        className={cn(
                          "w-full bg-white dark:bg-black/15 border rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none transition-all font-semibold",
                          roleError ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/15 focus:border-primary"
                        )}
                        value={exp.role}
                        onChange={e => updateItem('workExperience', i, 'role', e.target.value)}
                      />
                      {roleError && <p className="text-[9px] !text-red-500 font-bold ml-1.5 mt-1 uppercase tracking-widest">{roleError}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className={cn("text-[9px] font-black uppercase tracking-widest text-on-surface-variant ml-1", companyError && "!text-red-500")}>Company Name</label>
                      <input
                        id={`workExperience_${i}_company`}
                        maxLength={50}
                        placeholder="e.g. Google"
                        className={cn(
                          "w-full bg-white dark:bg-black/15 border rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none transition-all font-semibold",
                          companyError ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/15 focus:border-primary"
                        )}
                        value={exp.company}
                        onChange={e => updateItem('workExperience', i, 'company', e.target.value)}
                      />
                      {companyError && <p className="text-[9px] !text-red-500 font-bold ml-1.5 mt-1 uppercase tracking-widest">{companyError}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className={cn("text-[9px] font-black uppercase tracking-widest text-on-surface-variant ml-1", durationError && "!text-red-500")}>Duration</label>
                      <input
                        id={`workExperience_${i}_duration`}
                        maxLength={50}
                        placeholder="e.g. 2023 - Present"
                        className={cn(
                          "w-full bg-white dark:bg-black/15 border rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none transition-all font-semibold",
                          durationError ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/15 focus:border-primary"
                        )}
                        value={exp.duration}
                        onChange={e => updateItem('workExperience', i, 'duration', e.target.value)}
                      />
                      {durationError && <p className="text-[9px] !text-red-500 font-bold ml-1.5 mt-1 uppercase tracking-widest">{durationError}</p>}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className={cn("text-[9px] font-black uppercase tracking-widest text-on-surface-variant ml-1", descError && "!text-red-500")}>Responsibilities & Achievements</label>
                    <textarea
                      id={`workExperience_${i}_description`}
                      placeholder="Detail your key objectives, achievements, and responsibilities in STAR format..."
                      className={cn(
                        "w-full bg-white dark:bg-black/15 border rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none transition-all font-medium resize-none leading-relaxed",
                        descError ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/15 focus:border-primary"
                      )}
                      rows={3}
                      value={exp.description}
                      onChange={e => updateItem('workExperience', i, 'description', e.target.value)}
                    />
                    {descError && <p className="text-[9px] !text-red-500 font-bold ml-1.5 mt-1 uppercase tracking-widest">{descError}</p>}
                  </div>
                </div>
              );
            })}
            {(!editForm.workExperience || editForm.workExperience.length === 0) && (
              <div className="py-8 text-center text-on-surface-variant/40 font-bold italic text-sm border border-dashed border-outline-variant/20 rounded-2xl">
                No work experience listed yet. Click "Add Experience" to begin.
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-outline-variant/10 pt-10">
          {/* 5. Key Projects Section */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black text-on-surface flex items-center gap-3 uppercase tracking-widest">
              <FolderOpen className="w-5 h-5 text-primary" /> Key Projects
            </h3>
            <button
              type="button"
              onClick={() => addItem('projects', { title: '', description: '', link: '', stack: [] })}
              className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary/20 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Project
            </button>
          </div>

          <div className="space-y-6">
            {editForm.projects?.map((proj: any, i: number) => {
              const titleError = errors[`projects_${i}_title`];
              const linkError = errors[`projects_${i}_link`];
              const descError = errors[`projects_${i}_description`];
              const stackError = errors[`projects_${i}_stack`];

              return (
                <div key={i} className="bg-surface-container/30 border border-outline-variant/30 rounded-2xl p-6 relative overflow-hidden space-y-4 group">
                  <div className="flex justify-between items-center border-b border-outline-variant/10 pb-3 mb-2">
                    <h4 className="text-sm font-bold text-on-surface uppercase tracking-wider">Project {i + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeItem('projects', i)}
                      className="text-on-surface-variant hover:text-error hover:bg-error/5 p-1.5 rounded-lg transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={cn("text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block mb-1", titleError && "!text-red-500")}>Project Title</label>
                      <input
                        id={`projects_${i}_title`}
                        maxLength={50}
                        placeholder="e.g. Lumina Dashboard"
                        className={cn(
                          "w-full bg-surface-container border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all text-on-surface",
                          titleError ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/30 focus:border-primary"
                        )}
                        value={proj.title}
                        onChange={e => updateItem('projects', i, 'title', e.target.value)}
                      />
                      {titleError && <p className="text-[10px] !text-red-500 font-bold mt-1 uppercase tracking-widest">{titleError}</p>}
                    </div>

                    <div>
                      <label className={cn("text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block mb-1", stackError && "!text-red-500")}>Tech Stack (comma separated)</label>
                      <input
                        id={`projects_${i}_stack`}
                        placeholder="e.g. React, Node.js, AWS"
                        className={cn(
                          "w-full bg-surface-container border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all text-on-surface",
                          stackError ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/30 focus:border-primary"
                        )}
                        value={Array.isArray(proj.stack) ? proj.stack.join(', ') : proj.stack || ''}
                        onChange={e => updateItem('projects', i, 'stack', e.target.value.split(',').map(s => s.trim()))}
                      />
                      {stackError && <p className="text-[10px] !text-red-500 font-bold mt-1 uppercase tracking-widest">{stackError}</p>}
                    </div>
                  </div>

                  <div>
                    <label className={cn("text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block mb-1", linkError && "!text-red-500")}>Project Link (Optional)</label>
                    <input
                      id={`projects_${i}_link`}
                      type="url"
                      maxLength={100}
                      placeholder="e.g. https://github.com/alexrivera/lumina"
                      className={cn(
                        "w-full bg-surface-container border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all text-on-surface",
                        linkError ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/30 focus:border-primary"
                      )}
                      value={proj.link}
                      onChange={e => updateItem('projects', i, 'link', e.target.value)}
                    />
                    {linkError && <p className="text-[10px] !text-red-500 font-bold mt-1 uppercase tracking-widest">{linkError}</p>}
                  </div>

                  <div>
                    <label className={cn("text-[10px] uppercase font-bold text-on-surface-variant tracking-wider block mb-1", descError && "!text-red-500")}>Project Description (What did you build? What were the achievements?)</label>
                    <textarea
                      id={`projects_${i}_description`}
                      placeholder="e.g. Architected a real-time data visualization platform..."
                      className={cn(
                        "w-full bg-surface-container border rounded-xl p-4 text-sm focus:outline-none transition-all min-h-[100px] resize-none text-on-surface",
                        descError ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/30 focus:border-primary"
                      )}
                      rows={3}
                      value={proj.description}
                      onChange={e => updateItem('projects', i, 'description', e.target.value)}
                    />
                    {descError && <p className="text-[10px] !text-red-500 font-bold mt-1 uppercase tracking-widest">{descError}</p>}
                  </div>
                </div>
              );
            })}
            {(!editForm.projects || editForm.projects.length === 0) && (
              <div className="py-8 text-center text-on-surface-variant/40 font-bold italic text-sm border border-dashed border-outline-variant/20 rounded-2xl">
                No personal projects listed yet. Click "Add Project" to begin.
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-outline-variant/10 pt-10">
          {/* 6. Education Section */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black text-on-surface flex items-center gap-3 uppercase tracking-widest">
              <GraduationCap className="w-5 h-5 text-primary" /> Education
            </h3>
            <button
              type="button"
              onClick={() => addItem('education', { degree: '', university: '', cgpa: '', year: '', board: '' })}
              className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary/20 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Education
            </button>
          </div>

          <div className="space-y-6">
            {editForm.education?.map((edu: any, i: number) => {
              const degreeError = errors[`education_${i}_degree`];
              const univError = errors[`education_${i}_university`];
              const boardError = errors[`education_${i}_board`];
              const cgpaError = errors[`education_${i}_cgpa`];
              const yearError = errors[`education_${i}_year`];

              return (
                <div key={i} className="p-6 bg-surface-container/20 rounded-3xl border border-outline-variant/10 relative group hover:border-primary/20 transition-all duration-300">
                  <button
                    type="button"
                    onClick={() => removeItem('education', i)}
                    className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                      <label className={cn("text-[9px] font-black uppercase tracking-widest text-on-surface-variant ml-1", degreeError && "!text-red-500")}>Degree / Course</label>
                      <input
                        id={`education_${i}_degree`}
                        maxLength={50}
                        placeholder="e.g. B.Tech in Computer Science"
                        className={cn(
                          "w-full bg-white dark:bg-black/15 border rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none transition-all font-bold",
                          degreeError ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/15 focus:border-primary"
                        )}
                        value={edu.degree}
                        onChange={e => updateItem('education', i, 'degree', e.target.value)}
                      />
                      {degreeError && <p className="text-[9px] !text-red-500 font-bold ml-1.5 mt-1 uppercase tracking-widest">{degreeError}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className={cn("text-[9px] font-black uppercase tracking-widest text-on-surface-variant ml-1", univError && "!text-red-500")}>University / College</label>
                      <input
                        id={`education_${i}_university`}
                        maxLength={50}
                        placeholder="e.g. Rajasthan Technical University"
                        className={cn(
                          "w-full bg-white dark:bg-black/15 border rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none transition-all font-semibold",
                          univError ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/15 focus:border-primary"
                        )}
                        value={edu.university}
                        onChange={e => updateItem('education', i, 'university', e.target.value)}
                      />
                      {univError && <p className="text-[9px] !text-red-500 font-bold ml-1.5 mt-1 uppercase tracking-widest">{univError}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className={cn("text-[9px] font-black uppercase tracking-widest text-on-surface-variant ml-1", boardError && "!text-red-500")}>Board (e.g. CBSE)</label>
                      <input
                        id={`education_${i}_board`}
                        maxLength={50}
                        placeholder="e.g. CBSE"
                        className={cn(
                          "w-full bg-white dark:bg-black/15 border rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none transition-all font-semibold",
                          boardError ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/15 focus:border-primary"
                        )}
                        value={edu.board || ''}
                        onChange={e => updateItem('education', i, 'board', e.target.value)}
                      />
                      {boardError && <p className="text-[9px] !text-red-500 font-bold ml-1.5 mt-1 uppercase tracking-widest">{boardError}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className={cn("text-[9px] font-black uppercase tracking-widest text-on-surface-variant ml-1", cgpaError && "!text-red-500")}>CGPA / Grade</label>
                      <input
                        id={`education_${i}_cgpa`}
                        maxLength={10}
                        placeholder="e.g. 8.4"
                        className={cn(
                          "w-full bg-white dark:bg-black/15 border rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none transition-all font-semibold",
                          cgpaError ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/15 focus:border-primary"
                        )}
                        value={edu.cgpa}
                        onChange={e => updateItem('education', i, 'cgpa', e.target.value)}
                      />
                      {cgpaError && <p className="text-[9px] !text-red-500 font-bold ml-1.5 mt-1 uppercase tracking-widest">{cgpaError}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className={cn("text-[9px] font-black uppercase tracking-widest text-on-surface-variant ml-1", yearError && "!text-red-500")}>Year of Completion</label>
                      <input
                        id={`education_${i}_year`}
                        maxLength={4}
                        placeholder="e.g. 2025"
                        className={cn(
                          "w-full bg-white dark:bg-black/15 border rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none transition-all font-semibold",
                          yearError ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/15 focus:border-primary"
                        )}
                        value={edu.year}
                        onChange={e => updateItem('education', i, 'year', e.target.value)}
                      />
                      {yearError && <p className="text-[9px] !text-red-500 font-bold ml-1.5 mt-1 uppercase tracking-widest">{yearError}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
            {(!editForm.education || editForm.education.length === 0) && (
              <div className="py-8 text-center text-on-surface-variant/40 font-bold italic text-sm border border-dashed border-outline-variant/20 rounded-2xl">
                No educational records listed yet. Click "Add Education" to begin.
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-outline-variant/10 pt-10">
          {/* 7. Certifications Section */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black text-on-surface flex items-center gap-3 uppercase tracking-widest">
              <Award className="w-5 h-5 text-primary" /> Certifications & Awards
            </h3>
            <button
              type="button"
              onClick={() => addItem('certificates', { name: '', issuer: '', year: '' })}
              className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary/20 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Certificate
            </button>
          </div>

          <div className="space-y-6">
            {editForm.certificates?.map((cert: any, i: number) => {
              const nameError = errors[`certificates_${i}_name`];
              const issuerError = errors[`certificates_${i}_issuer`];
              const yearError = errors[`certificates_${i}_year`];

              return (
                <div key={i} className="p-6 bg-surface-container/20 rounded-3xl border border-outline-variant/10 relative group hover:border-primary/20 transition-all duration-300">
                  <button
                    type="button"
                    onClick={() => removeItem('certificates', i)}
                    className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className={cn("text-[9px] font-black uppercase tracking-widest text-on-surface-variant ml-1", nameError && "!text-red-500")}>Certificate Title</label>
                      <input
                        id={`certificates_${i}_name`}
                        maxLength={50}
                        placeholder="e.g. AWS Certified Developer"
                        className={cn(
                          "w-full bg-white dark:bg-black/15 border rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none transition-all font-bold",
                          nameError ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/15 focus:border-primary"
                        )}
                        value={cert.name}
                        onChange={e => updateItem('certificates', i, 'name', e.target.value)}
                      />
                      {nameError && <p className="text-[9px] !text-red-500 font-bold ml-1.5 mt-1 uppercase tracking-widest">{nameError}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className={cn("text-[9px] font-black uppercase tracking-widest text-on-surface-variant ml-1", issuerError && "!text-red-500")}>Issuing Org</label>
                      <input
                        id={`certificates_${i}_issuer`}
                        maxLength={50}
                        placeholder="e.g. Amazon Web Services"
                        className={cn(
                          "w-full bg-white dark:bg-black/15 border rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none transition-all font-semibold",
                          issuerError ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/15 focus:border-primary"
                        )}
                        value={cert.issuer}
                        onChange={e => updateItem('certificates', i, 'issuer', e.target.value)}
                      />
                      {issuerError && <p className="text-[9px] !text-red-500 font-bold ml-1.5 mt-1 uppercase tracking-widest">{issuerError}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className={cn("text-[9px] font-black uppercase tracking-widest text-on-surface-variant ml-1", yearError && "!text-red-500")}>Year Achieved</label>
                      <input
                        id={`certificates_${i}_year`}
                        maxLength={4}
                        placeholder="e.g. 2024"
                        className={cn(
                          "w-full bg-white dark:bg-black/15 border rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none transition-all font-semibold",
                          yearError ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/15 focus:border-primary"
                        )}
                        value={cert.year}
                        onChange={e => updateItem('certificates', i, 'year', e.target.value)}
                      />
                      {yearError && <p className="text-[9px] !text-red-500 font-bold ml-1.5 mt-1 uppercase tracking-widest">{yearError}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
            {(!editForm.certificates || editForm.certificates.length === 0) && (
              <div className="py-8 text-center text-on-surface-variant/40 font-bold italic text-sm border border-dashed border-outline-variant/20 rounded-2xl">
                No certifications listed yet. Click "Add Certificate" to begin.
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-outline-variant/10 pt-10">
          {/* 8. Personal Details Section */}
          <h3 className="text-lg font-black text-on-surface flex items-center gap-3 mb-6 uppercase tracking-widest">
            <Globe className="w-5 h-5 text-primary" /> Personal Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-1.5">
              <label className={cn("text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1.5", errors.dob && "!text-red-500")}>Date of Birth</label>
              <input
                id="dob"
                type="date"
                className={cn(
                  "w-full bg-surface-container/40 border rounded-2xl px-4 py-3.5 focus:outline-none transition-all font-medium text-sm text-on-surface",
                  errors.dob ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500" : "border-outline-variant/20 focus:border-primary"
                )}
                value={editForm.personalDetail?.dob || ''}
                onChange={e => {
                  setEditForm({ ...editForm, personalDetail: { ...editForm.personalDetail, dob: e.target.value } });
                  if (e.target.value.trim() === '') {
                    setErrors(prev => ({ ...prev, dob: 'Date of birth is required' }));
                  } else {
                    setErrors(prev => {
                      const updated = { ...prev };
                      delete updated.dob;
                      return updated;
                    });
                  }
                }}
              />
              {errors.dob && <p className="text-[10px] !text-red-500 font-bold ml-1.5 mt-1 uppercase tracking-widest">{errors.dob}</p>}
            </div>

            <div className="space-y-1.5" ref={genderDropdownRef}>
              <label className={cn("text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1.5", errors.gender && "!text-red-500")}>Gender</label>
              <div className="relative">
                <button
                  type="button"
                  id="gender"
                  onClick={() => setIsGenderOpen(!isGenderOpen)}
                  className={cn(
                    "w-full border rounded-2xl pl-12 pr-10 py-3.5 focus:outline-none transition-all font-bold text-sm cursor-pointer text-left flex items-center justify-between",
                    errors.gender ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500" : getGenderStyles(editForm.personalDetail?.gender)
                  )}
                >
                  <span>{editForm.personalDetail?.gender || 'Male'}</span>
                  <ChevronDown className={cn("w-4 h-4 transition-transform duration-350 ease-out", isGenderOpen && "rotate-180")} />
                </button>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                  <User className={cn(
                    "w-5 h-5 transition-colors duration-300",
                    (editForm.personalDetail?.gender?.toLowerCase() === 'female') ? "text-pink-500" :
                    (editForm.personalDetail?.gender?.toLowerCase() === 'other') ? "text-purple-500" : "text-blue-500"
                  )} />
                </div>

                {isGenderOpen && (
                  <div className="absolute z-50 left-0 right-0 mt-2 bg-white/90 dark:bg-zinc-900/95 backdrop-blur-xl border border-outline-variant/30 rounded-2xl shadow-2xl p-2 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button
                      type="button"
                      onClick={() => {
                        setEditForm({
                          ...editForm,
                          personalDetail: { ...editForm.personalDetail, gender: 'Male' }
                        });
                        setIsGenderOpen(false);
                        if (errors.gender) {
                          setErrors(prev => {
                            const updated = { ...prev };
                            delete updated.gender;
                            return updated;
                          });
                        }
                      }}
                      className={cn(
                        "w-full px-4 py-3 text-left rounded-xl font-bold text-sm flex items-center justify-between transition-all cursor-pointer border",
                        editForm.personalDetail?.gender === 'Male'
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
                          : "bg-transparent border-transparent text-on-surface-variant hover:bg-blue-500/5 hover:text-blue-500 hover:border-blue-500/20"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                        Male ♂
                      </span>
                      <span className="text-[10px] opacity-60 uppercase font-black tracking-widest">Gentleman</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditForm({
                          ...editForm,
                          personalDetail: { ...editForm.personalDetail, gender: 'Female' }
                        });
                        setIsGenderOpen(false);
                        if (errors.gender) {
                          setErrors(prev => {
                            const updated = { ...prev };
                            delete updated.gender;
                            return updated;
                          });
                        }
                      }}
                      className={cn(
                        "w-full px-4 py-3 text-left rounded-xl font-bold text-sm flex items-center justify-between transition-all cursor-pointer border",
                        editForm.personalDetail?.gender === 'Female'
                          ? "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/30"
                          : "bg-transparent border-transparent text-on-surface-variant hover:bg-pink-500/5 hover:text-pink-500 hover:border-pink-500/20"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse"></span>
                        Female ♀
                      </span>
                      <span className="text-[10px] opacity-60 uppercase font-black tracking-widest">Lady</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditForm({
                          ...editForm,
                          personalDetail: { ...editForm.personalDetail, gender: 'Other' }
                        });
                        setIsGenderOpen(false);
                        if (errors.gender) {
                          setErrors(prev => {
                            const updated = { ...prev };
                            delete updated.gender;
                            return updated;
                          });
                        }
                      }}
                      className={cn(
                        "w-full px-4 py-3 text-left rounded-xl font-bold text-sm flex items-center justify-between transition-all cursor-pointer border",
                        editForm.personalDetail?.gender === 'Other'
                          ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30"
                          : "bg-transparent border-transparent text-on-surface-variant hover:bg-purple-500/5 hover:text-purple-500 hover:border-purple-500/20"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse"></span>
                        Other ⚧
                      </span>
                      <span className="text-[10px] opacity-60 uppercase font-black tracking-widest">Diverse</span>
                    </button>
                  </div>
                )}
              </div>
              {errors.gender && <p className="text-[10px] !text-red-500 font-bold ml-1.5 mt-1 uppercase tracking-widest">{errors.gender}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className={cn("text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1.5", errors.languages && "!text-red-500")}>Languages Known</label>
              <input
                id="languages"
                maxLength={50}
                className={cn(
                  "w-full bg-surface-container/40 border rounded-2xl px-4 py-3.5 focus:outline-none transition-all font-medium text-sm text-on-surface",
                  errors.languages ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/20 focus:border-primary"
                )}
                placeholder="e.g. English, Hindi"
                value={editForm.personalDetail?.languages || ''}
                onChange={e => {
                  setEditForm({ ...editForm, personalDetail: { ...editForm.personalDetail, languages: e.target.value } });
                  if (e.target.value.trim() === '') {
                    setErrors(prev => ({ ...prev, languages: 'Languages are required' }));
                  } else {
                    setErrors(prev => {
                      const updated = { ...prev };
                      delete updated.languages;
                      return updated;
                    });
                  }
                }}
              />
              {errors.languages && <p className="text-[10px] !text-red-500 font-bold ml-1.5 mt-1 uppercase tracking-widest">{errors.languages}</p>}
            </div>

            <div className="space-y-1.5">
              <label className={cn("text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1.5", errors.hobbies && "!text-red-500")}>Hobbies</label>
              <input
                id="hobbies"
                maxLength={50}
                className={cn(
                  "w-full bg-surface-container/40 border rounded-2xl px-4 py-3.5 focus:outline-none transition-all font-medium text-sm text-on-surface",
                  errors.hobbies ? "!border-red-500 focus:!border-red-500 !bg-red-500/5 !text-red-500 placeholder:!text-red-500/45" : "border-outline-variant/20 focus:border-primary"
                )}
                placeholder="e.g. Coding, Chess, Reading"
                value={editForm.personalDetail?.hobbies || ''}
                onChange={e => {
                  setEditForm({ ...editForm, personalDetail: { ...editForm.personalDetail, hobbies: e.target.value } });
                  if (e.target.value.trim() === '') {
                    setErrors(prev => ({ ...prev, hobbies: 'Hobbies are required' }));
                  } else {
                    setErrors(prev => {
                      const updated = { ...prev };
                      delete updated.hobbies;
                      return updated;
                    });
                  }
                }}
              />
              {errors.hobbies && <p className="text-[10px] !text-red-500 font-bold ml-1.5 mt-1 uppercase tracking-widest">{errors.hobbies}</p>}
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar (Non-Sticky, Flows naturally at the end) */}
        <div className="flex gap-4 pt-8 border-t border-outline-variant/10">
          <button
            type="button"
            onClick={handleBack}
            className="flex-1 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest border border-outline-variant/25 hover:bg-surface-container/50 text-on-surface transition-all cursor-pointer text-center flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="flex-[2.5] gradient-button text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.01] transition-transform"
          >
            {saving ? (
              <>
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
                Saving Profile Properties...
              </>
            ) : (
              <>
                <Sparkles className="w-4.5 h-4.5" />
                Save & Apply Changes
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
};
