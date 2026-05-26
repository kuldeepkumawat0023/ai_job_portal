'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { useRouter, useParams } from 'next/navigation';

import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Sparkles,
  Plus,
  X,
  CheckCircle2,
  BrainCircuit,
  ArrowLeft,
} from 'lucide-react';

import { cn } from '@/utils/cn';
import { toast } from 'react-hot-toast';

// Services
import { jobService } from '@/lib/services/job.services';
import { dashboardService } from '@/lib/services/dashboard.services';

// Components
import { Button } from '@/components/common/Button';

const parseSalary = (salaryStr: string) => {
  if (!salaryStr)
    return {
      salaryMin: '',
      salaryMax: '',
      currency: 'USD',
    };

  let currency = 'USD';
  let cleanStr = salaryStr.trim();

  const parts = cleanStr.split(' ');

  if (parts.length > 1) {
    currency = parts[parts.length - 1];
    cleanStr = parts.slice(0, -1).join(' ').trim();
  }

  const rangeParts = cleanStr.split('-');

  return {
    salaryMin: rangeParts[0]?.trim() || '',
    salaryMax: rangeParts[1]?.trim() || '',
    currency,
  };
};

const getExperienceLevelFromYears = (years: number): string => {
  if (years === 0) return 'Entry Level';
  if (years === 1) return 'Junior';
  if (years === 3) return 'Mid Level';
  if (years === 5) return 'Senior';
  if (years >= 7) return 'Lead / Manager';

  return 'Mid Level';
};

interface PostJobViewProps {
  jobId?: string;
}

const PostJobView = ({ jobId: propJobId }: PostJobViewProps) => {
  const router = useRouter();
  const params = useParams();

  const jobId = propJobId || (params?.id as string | undefined);

  const [companyId, setCompanyId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: '',
    dept: 'Engineering',
    location: '',
    jobType: ['Full-time'] as string[],
    description: '',
    skills: ['React', 'TypeScript'],
    experienceLevel: 'Mid Level',
    salaryMin: '120000',
    salaryMax: '180000',
    currency: 'USD',
    perks: [] as string[],
  });

  const [newSkill, setNewSkill] = useState('');
  const [newJobType, setNewJobType] = useState('');

  const experienceMap: Record<string, number> = {
    Internship: 0,
    'Entry Level': 0,
    Junior: 1,
    'Mid Level': 3,
    Senior: 5,
    'Lead / Manager': 7,
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const statsRes = await dashboardService.getRecruiterStats();

        if (statsRes.success && statsRes.data?.company?._id) {
          setCompanyId(statsRes.data.company._id);
        }

        if (jobId) {
          const jobRes = await jobService.getJobById(jobId);

          if (jobRes.success && jobRes.data) {
            const job = jobRes.data;

            const parsedSalary = parseSalary(job.salary || '');

            setFormData({
              title: job.title || '',
              dept: job.category || 'Engineering',
              location: job.location || '',
              jobType: Array.isArray(job.jobType)
                ? job.jobType
                : [job.jobType || 'Full-time'],
              description: job.description || '',
              skills: Array.isArray(job.requirements)
                ? job.requirements
                : [],
              experienceLevel: getExperienceLevelFromYears(
                job.experience || 0
              ),
              salaryMin: parsedSalary.salaryMin,
              salaryMax: parsedSalary.salaryMax,
              currency: parsedSalary.currency,
              perks: Array.isArray(job.perks) ? job.perks : [],
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    loadData();
  }, [jobId]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      const updated = { ...errors };
      delete updated[name];
      setErrors(updated);
    }
  };

  const handleAddSkill = () => {
    const skill = newSkill.trim();

    if (!skill) return;

    if (!formData.skills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
    }

    setNewSkill('');
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const togglePerk = (perk: string) => {
    setFormData((prev) => ({
      ...prev,
      perks: prev.perks.includes(perk)
        ? prev.perks.filter((p) => p !== perk)
        : [...prev.perks, perk],
    }));
  };

  const toggleJobType = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      jobType: prev.jobType.includes(type)
        ? prev.jobType.filter((t) => t !== type)
        : [...prev.jobType, type],
    }));
  };

  const handleAddJobType = () => {
    const value = newJobType.trim();

    if (!value) return;

    if (!formData.jobType.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        jobType: [...prev.jobType, value],
      }));
    }

    setNewJobType('');
  };

  const handleRemoveJobType = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      jobType: prev.jobType.filter((t) => t !== type),
    }));
  };

  const handleAiGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        description:
          prev.description +
          '\n\nWe are looking for a talented engineer who can build scalable applications and collaborate with cross-functional teams.',
      }));

      setIsGenerating(false);

      toast.success('AI refined your description!');
    }, 1500);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Required';
    if (!formData.location.trim()) newErrors.location = 'Required';
    if (!formData.description.trim())
      newErrors.description = 'Required';

    if (formData.skills.length === 0)
      newErrors.skills = 'Add skills';

    if (!formData.salaryMin)
      newErrors.salaryMin = 'Required';

    if (!formData.salaryMax)
      newErrors.salaryMax = 'Required';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handlePublish = async () => {
    if (!validateForm()) return;

    if (!companyId) {
      toast.error('Company not found');
      return;
    }

    try {
      setIsPublishing(true);

      const payload = {
        title: formData.title,
        description: formData.description,
        requirements: formData.skills,
        salary: `${formData.salaryMin}-${formData.salaryMax} ${formData.currency}`,
        location: formData.location,
        jobType: formData.jobType,
        experience:
          experienceMap[formData.experienceLevel] || 0,
        category: formData.dept,
        companyId,
        perks: formData.perks,
      };

      const res = jobId
        ? await jobService.updateJob(jobId, payload)
        : await jobService.postJob(payload);

      if (res.success) {
        toast.success(
          jobId
            ? 'Job Updated Successfully'
            : 'Job Posted Successfully'
        );

        router.push('/recruiter/dashboard');
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        'Something went wrong'
      );
    } finally {
      setIsPublishing(false);
    }
  };

  const competitiveness = useMemo(() => {
    const maxSalary = Number(formData.salaryMax);

    if (maxSalary >= 150000) {
      return {
        label: 'Strong',
        percent: 90,
        textClass: 'text-emerald-500',
        bgClass: 'bg-emerald-500',
      };
    }

    if (maxSalary >= 80000) {
      return {
        label: 'Average',
        percent: 65,
        textClass: 'text-yellow-500',
        bgClass: 'bg-yellow-500',
      };
    }

    return {
      label: 'Low',
      percent: 35,
      textClass: 'text-orange-500',
      bgClass: 'bg-orange-500',
    };
  }, [formData.salaryMax]);

  const getTalentPool = () => {
    const total = 5000 - formData.skills.length * 400;

    return total >= 1000
      ? `${(total / 1000).toFixed(1)}k+`
      : `${total}+`;
  };

  return (
    <>
      <Head>
        <title>
          {jobId
            ? 'Edit Job Posting'
            : 'Create Job Posting'}
        </title>

        <meta
          name="description"
          content="AI powered recruiter dashboard for creating modern job postings."
        />

        <meta
          name="keywords"
          content="jobs, hiring, recruiter, careers"
        />
      </Head>

      <main className="min-h-screen bg-background text-on-surface flex items-center justify-center px-4 md:px-8 py-10 animate-in">

        <div className="max-w-7xl mx-auto space-y-10">
          {/* HEADER */}
          <header className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-all"
            >
              <ArrowLeft size={18} />

              <span className="uppercase text-xs font-bold tracking-widest">
                Back
              </span>
            </button>
          </header>

          {/* TITLE */}
          <section className="text-center space-y-5 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary">
              <Sparkles size={14} />

              <span className="text-xs font-bold uppercase tracking-widest">
                AI Assisted Posting
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black leading-tight">
              {jobId ? 'Edit Your' : 'Create New'}

              <span className="block bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-transparent bg-clip-text">
                {jobId
                  ? 'Job Posting'
                  : 'Career Opportunity'}
              </span>
            </h1>

            <p className="text-on-surface-variant text-lg">
              Create premium AI-powered job postings with
              better hiring conversion.
            </p>
          </section>

          {/* GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* LEFT */}
            <div className="lg:col-span-7 space-y-8">
              <div className="glass-card rounded-[2rem] p-8 border border-white/10 space-y-8">
                {/* JOB TITLE */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Job Title
                  </label>

                  <div className="relative">
                    <Briefcase
                      size={18}
                      className="absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant"
                    />

                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Senior Frontend Engineer"
                      className="w-full bg-transparent border-b border-muted pl-7 py-3 outline-none focus:border-primary"
                    />
                  </div>

                  {errors.title && (
                    <p className="text-red-500 text-xs">
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* DEPT + LOCATION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                      Department
                    </label>

                    <input
                      type="text"
                      name="dept"
                      value={formData.dept}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                      Location
                    </label>

                    <div className="relative">
                      <MapPin
                        size={18}
                        className="absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant"
                      />

                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Remote"
                        className="w-full bg-transparent border-b border-outline-variant pl-7 py-3 outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* JOB TYPES */}
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Job Types
                  </label>

                  <div className="flex flex-wrap gap-3">
                    {[
                      'Full-time',
                      'Part-time',
                      'Remote',
                      'Contract',
                      'Internship',
                    ].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleJobType(type)}
                        className={cn(
                          'px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all',
                          formData.jobType.includes(type) ? 'bg-primary border-primary text-black' : 'px-4 py-2 rounded-xl border-muted text-muted-foreground'
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {formData.jobType.map((type) => (
                      <span
                        key={type}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary text-sm"
                      >
                        {type}

                        <button
                          onClick={() =>
                            handleRemoveJobType(type)
                          }
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newJobType}
                      onChange={(e) =>
                        setNewJobType(e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddJobType();
                        }
                      }}
                      placeholder="Press Enter to add job type"
                      className="flex-1 bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary"
                    />

                    <button
                      type="button"
                      onClick={handleAddJobType}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary border-primary text-on-primary font-bold"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                      Job Description
                    </label>

                    <button
                      onClick={handleAiGenerate}
                      disabled={isGenerating}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold"
                    >
                      {isGenerating ? (
                        <Clock
                          size={14}
                          className="animate-spin"
                        />
                      ) : (
                        <Sparkles size={14} />
                      )}

                      AI Refine
                    </button>
                  </div>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full min-h-[220px] rounded-3xl border border-outline-variant bg-surface-container-low/5 p-6 outline-none focus:border-primary resize-none"
                    placeholder="Describe responsibilities..."
                  />
                </div>

                {/* SKILLS */}
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Skills
                  </label>

                  <div className="flex flex-wrap gap-3">
                    {formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary"
                      >
                        {skill}

                        <button
                          onClick={() =>
                            handleRemoveSkill(skill)
                          }
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) =>
                        setNewSkill(e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                      placeholder="Press Enter to add skill"
                      className="flex-1 bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary"
                    />

                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-5 py-3 rounded-xl bg-secondary"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* SALARY */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                      Salary
                    </label>

                    <div className="flex gap-3">
                      <input
                        type="number"
                        name="salaryMin"
                        value={formData.salaryMin}
                        onChange={handleChange}
                        placeholder="50000"
                        className="w-full bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary"
                      />

                      <input
                        type="number"
                        name="salaryMax"
                        value={formData.salaryMax}
                        onChange={handleChange}
                        placeholder="120000"
                        className="w-full bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                      Currency
                    </label>

                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-outline-variant py-3 outline-none focus:border-primary"
                    >
                      <option value="USD">USD</option>
                      <option value="INR">INR</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>

                {/* PERKS */}
                <div className="space-y-4">
                  <label className="text-xs uppercase tracking-widest text-on-surface-variant">
                    Perks & Benefits
                  </label>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      'Health Insurance',
                      'Remote Work',
                      'Stock Options',
                      'Unlimited PTO',
                    ].map((perk) => (
                      <div
                        key={perk}
                        onClick={() => togglePerk(perk)}
                        className={cn('flex items-center gap-3 rounded-2xl border p-4 cursor-pointer transition-all', formData.perks.includes(perk) ? 'bg-primary/10 border-primary/30' : 'bg-muted border-muted')}
                      >
                        <CheckCircle2
                          size={18}
                          className={
                            formData.perks.includes(perk)
                              ? 'text-on-surface-variant'
                              : 'text-on-surface-variant'
                          }
                        />

                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* BUTTON */}
                <div className="pt-6 flex justify-end">
                  <Button
                    onClick={handlePublish}
                    isLoading={isPublishing}
                    className="px-10 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-black uppercase tracking-widest shadow-2xl"
                  >
                    {jobId
                      ? 'Update Posting'
                      : 'Publish Posting'}
                  </Button>
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <aside className="lg:col-span-5 sticky top-6">
              <div className="glass-card rounded-[2rem] p-8 border border-white/10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                    <BrainCircuit size={24} />
                  </div>

                  <div>
                    <h2 className="font-black uppercase tracking-widest">
                      AI Insights
                    </h2>

                    <p className="text-xs text-on-surface-variant">
                      Real-time analysis
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs uppercase font-bold tracking-widest">
                    <span className="text-on-surface-variant">
                      Market Competitiveness
                    </span>

                    <span className={competitiveness.textClass}>
                      {competitiveness.label}
                    </span>
                  </div>

                  <div className="h-3 rounded-full bg-surface-container-low overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-700',
                        competitiveness.bgClass
                      )}
                      style={{
                        width: `${competitiveness.percent}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-4 rounded-2xl border border-white/10 bg-surface-container-low/5 p-5">
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Your posting is optimized for
                    high-quality applicants.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-on-surface-variant">
                    Talent Pool Estimate
                  </h3>

                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-black">
                      {getTalentPool()}
                    </span>

                    <span className="text-xs text-primary uppercase font-bold mb-2">
                      Candidates
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
};

export default PostJobView;