'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  X, 
  Check, 
  BrainCircuit, 
  Lightbulb, 
  Bookmark, 
  ArrowRight,
  Loader2,
  Building2,
  MapPin
} from 'lucide-react';
import { jobService, Job } from '@/lib/services/job.services';
import { applicationService } from '@/lib/services/application.services';
import { toast } from 'react-hot-toast';
import { cn } from '@/utils/cn';

const ApplicationForm = () => {
  const { id: jobId } = useParams();
  const router = useRouter();
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(3); // Starting at 3 for AI Screening as per original design
  
  // Form State
  const [formData, setFormData] = useState({
    experience: '',
    projects: '',
    screeningAnswers: {
      advocacy: '',
      scaling: '',
      tool: 'Figma'
    }
  });

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const res = await jobService.getJobById(jobId as string);
      if (res.success) {
        setJob(res.data);
      }
    } catch (error) {
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      setSubmitting(true);
      const res = await applicationService.applyJob(jobId as string);
      if (res.success) {
        toast.success('Application submitted successfully!');
        router.push('/candidate/applications');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-on-surface-variant font-bold uppercase tracking-widest text-xs">Preparing Application...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Base Gradient Background */}
      <div 
        className="fixed inset-0 pointer-events-none -z-20 opacity-50"
        style={{
          backgroundImage: `radial-gradient(circle at 15% 50%, rgba(70, 72, 212, 0.05), transparent 40%),
                            radial-gradient(circle at 85% 30%, rgba(129, 39, 207, 0.05), transparent 40%)`
        }}
      ></div>

      {/* Main Content */}
      <div className="flex flex-col gap-8">
        
        {/* Application Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-2 border border-primary/20">
            Application Portal
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-on-surface tracking-tight">
            Apply for {job?.title || 'Job Role'}
          </h1>
          <p className="text-lg text-on-surface-variant font-bold flex items-center justify-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            {job?.companyId?.name || 'Company'} 
            <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
            <MapPin className="w-5 h-5 text-secondary" />
            {job?.location || 'Remote'}
          </p>
        </div>

        {/* Glassmorphic Application Form Container */}
        <div className="bg-surface-container-lowest/90 backdrop-blur-3xl border border-outline-variant/30 shadow-2xl rounded-[40px] p-8 md:p-14 flex flex-col gap-12 relative overflow-hidden">
          
          {/* Progress Stepper */}
          <div className="relative w-full max-w-2xl mx-auto mb-4">
            <div className="absolute top-1/2 left-0 w-full h-[3px] bg-surface-container-high -translate-y-1/2 z-0 rounded-full"></div>
            <div 
              className="absolute top-1/2 left-0 h-[3px] bg-gradient-to-r from-primary to-secondary -translate-y-1/2 z-0 rounded-full transition-all duration-700 ease-in-out shadow-[0_0_10px_rgba(70,72,212,0.3)]"
              style={{ width: `${(currentStep - 1) * 33.33}%` }}
            ></div>
            
            <div className="flex justify-between relative z-10">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex flex-col items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all border-2",
                    currentStep > step ? "bg-primary border-primary text-white" : 
                    currentStep === step ? "bg-white border-primary text-primary shadow-xl scale-110" : 
                    "bg-surface-container-high border-transparent text-on-surface-variant"
                  )}>
                    {currentStep > step ? <Check className="w-5 h-5" /> : <span className="text-sm font-black">{step}</span>}
                  </div>
                  <span className={cn(
                    "text-[9px] font-black tracking-widest hidden md:block uppercase",
                    currentStep >= step ? "text-primary" : "text-on-surface-variant"
                  )}>
                    {step === 1 ? 'Personal' : step === 2 ? 'Experience' : step === 3 ? 'AI Screening' : 'Review'}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <hr className="border-outline-variant/20" />
          
          {/* Step Content: AI Screening Questions */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <BrainCircuit className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-on-surface tracking-tight">Role-Specific Assessment</h2>
                  <p className="text-base text-on-surface-variant font-bold">Smart assessment powered by AI JobFit Analysis.</p>
                </div>
              </div>
              
              <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg shrink-0">
                  <Lightbulb className="w-6 h-6 text-primary animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] block mb-2">AI Recommendation</span> 
                  <p className="text-base text-on-surface-variant font-bold leading-relaxed italic">
                    Focus on your experience with <span className="text-on-surface underline decoration-primary/40 underline-offset-4">cross-functional collaboration</span> and resolving <span className="text-on-surface underline decoration-secondary/40 underline-offset-4">design system conflicts</span>.
                  </p>
                </div>
              </div>
              
              <form className="space-y-12">
                <div className="space-y-4">
                  <label className="text-xl font-black text-on-surface block tracking-tight">
                    1. Describe a time you had to advocate for a design decision that contradicted technical constraints.
                  </label>
                  <textarea 
                    className="w-full min-h-[160px] rounded-3xl bg-surface-container/30 border-2 border-transparent focus:border-primary/40 focus:bg-white outline-none transition-all p-6 text-base font-bold text-on-surface placeholder:text-on-surface-variant/40" 
                    placeholder="Detail the situation, your approach, and the outcome..."
                    value={formData.screeningAnswers.advocacy}
                    onChange={(e) => setFormData({...formData, screeningAnswers: {...formData.screeningAnswers, advocacy: e.target.value}})}
                  ></textarea>
                </div>
                
                <div className="space-y-4">
                  <label className="text-xl font-black text-on-surface block tracking-tight">
                    2. How do you approach scaling a design system across multiple product lines?
                  </label>
                  <textarea 
                    className="w-full min-h-[160px] rounded-3xl bg-surface-container/30 border-2 border-transparent focus:border-primary/40 focus:bg-white outline-none transition-all p-6 text-base font-bold text-on-surface placeholder:text-on-surface-variant/40" 
                    placeholder="Explain your framework and past experiences..."
                    value={formData.screeningAnswers.scaling}
                    onChange={(e) => setFormData({...formData, screeningAnswers: {...formData.screeningAnswers, scaling: e.target.value}})}
                  ></textarea>
                </div>
                
                <div className="space-y-6">
                  <label className="text-xl font-black text-on-surface block tracking-tight">
                    3. Which tool is your primary instrument for high-fidelity interaction design?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {['Figma', 'Protopie', 'Framer', 'Other'].map((tool) => (
                      <button 
                        key={tool}
                        type="button"
                        onClick={() => setFormData({...formData, screeningAnswers: {...formData.screeningAnswers, tool}})}
                        className={cn(
                          "p-6 rounded-3xl border-2 transition-all font-black uppercase text-xs tracking-widest active:scale-95",
                          formData.screeningAnswers.tool === tool 
                            ? "bg-primary text-white border-primary shadow-xl shadow-primary/20" 
                            : "bg-surface-container/30 border-transparent text-on-surface-variant hover:bg-surface-container-high"
                        )}
                      >
                        {tool}
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            </div>
          )}

          {currentStep === 4 && (
            <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-10">
              <div className="w-24 h-24 rounded-[40px] bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <Check className="w-12 h-12" />
              </div>
              <h2 className="text-4xl font-black text-on-surface tracking-tight">Ready to Submit?</h2>
              <p className="text-lg text-on-surface-variant font-bold max-w-xl mx-auto">
                Please review your answers carefully. Once submitted, your profile and screening responses will be sent directly to the hiring team at {job?.companyId?.name}.
              </p>
            </div>
          )}
          
          {/* Action Area */}
          <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-6 pt-8 border-t border-outline-variant/20">
            <button className="w-full sm:w-auto px-10 py-5 rounded-[24px] text-xs font-black uppercase tracking-widest text-on-surface-variant hover:bg-surface-container transition-all flex items-center justify-center gap-3">
              <Bookmark className="w-5 h-5" />
              Save Draft
            </button>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button 
                onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
                className="w-full sm:w-auto px-10 py-5 rounded-[24px] text-xs font-black uppercase tracking-widest text-on-surface border-2 border-outline-variant/30 hover:bg-surface-container transition-all"
              >
                Back
              </button>
              {currentStep < 4 ? (
                <button 
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="w-full sm:w-auto px-12 py-5 rounded-[24px] text-xs font-black uppercase tracking-widest text-white bg-primary shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button 
                  onClick={handleApply}
                  disabled={submitting}
                  className="w-full sm:w-auto px-12 py-5 rounded-[24px] text-xs font-black uppercase tracking-widest text-white bg-gradient-to-r from-primary to-secondary shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Application'}
                  {!submitting && <ArrowRight className="w-5 h-5" />}
                </button>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;
