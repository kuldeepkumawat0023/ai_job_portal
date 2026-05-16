'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Building2, 
  Globe, 
  MapPin, 
  FileText, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { companyService } from '@/lib/services/company.services';
import { userService } from '@/lib/services/user.services';
import { authService } from '@/lib/services/auth.services';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/Button';

interface HiringTransitionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalStep = 'INFO' | 'COMPANY_DETAILS' | 'OTP' | 'SUCCESS';

const HiringTransitionModal: React.FC<HiringTransitionModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<ModalStep>('INFO');
  const [loading, setLoading] = useState(false);
  const { user, updateUser } = useAuth();
  const router = useRouter();

  const [companyData, setCompanyData] = useState({
    name: '',
    website: '',
    location: '',
    description: ''
  });

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verifying, setVerifying] = useState(false);

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyData.name || !companyData.location || !companyData.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    try {
      const res = await authService.sendHiringOtp();
      if (res.success) {
        setStep('OTP');
        toast.success('Verification code sent to your email');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 6) {
      toast.error('Please enter complete 6-digit OTP');
      return;
    }

    setVerifying(true);
    try {
      // 1. Verify OTP
      const otpRes = await authService.verifyHiringOtp(enteredOtp);
      
      if (otpRes.success) {
        updateUser({ role: 'recruiter' }); // Update local auth state IMMEDIATELY
        // 2. Register Company (Backend already updated role)
        const companyRes = await companyService.registerCompany(companyData);
        
        if (companyRes.success) {
          setStep('SUCCESS');
          toast.success('You are now a Recruiter!');
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const handleFinish = () => {
    onClose();
    // Force a full reload to ensure all guards and middleware pick up the new role
    window.location.href = '/recruiter/dashboard';
  };

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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl bg-surface rounded-[40px] shadow-2xl overflow-hidden border border-outline-variant/20"
          >
            {/* Header */}
            <div className="p-8 border-b border-outline-variant/10 flex justify-between items-start bg-gradient-to-r from-primary/5 to-transparent">
              <div>
                <h2 className="text-2xl font-black text-on-surface">Become a Recruiter</h2>
                <p className="text-sm text-on-surface-variant font-medium">Start hiring top AI talent today.</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-xl transition-colors">
                <X className="w-6 h-6 text-on-surface-variant" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              {step === 'INFO' && (
                <div className="space-y-8 py-4">
                  <div className="grid gap-6">
                    <div className="flex gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Zap className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface">Post Jobs with AI</h4>
                        <p className="text-xs text-on-surface-variant leading-relaxed">Our AI helps you draft job descriptions and find perfectly matched candidates instantly.</p>
                      </div>
                    </div>
                    <div className="flex gap-4 p-4 rounded-2xl bg-secondary/5 border border-secondary/10">
                      <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface">Verified Profiles</h4>
                        <p className="text-xs text-on-surface-variant leading-relaxed">Access a pool of pre-vetted candidates with AI-verified skill scores.</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="gradient" className="w-full py-6" onClick={() => setStep('COMPANY_DETAILS')}>
                    Set Up My Company <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              )}

              {step === 'COMPANY_DETAILS' && (
                <form onSubmit={handleCompanySubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Company Name *</label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                        <input
                          required
                          className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl pl-12 pr-4 py-4 text-on-surface focus:border-primary transition-all outline-none"
                          placeholder="e.g. Acme Corp"
                          value={companyData.name}
                          onChange={e => setCompanyData({...companyData, name: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Website</label>
                        <div className="relative">
                          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                          <input
                            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl pl-12 pr-4 py-4 text-on-surface focus:border-primary transition-all outline-none"
                            placeholder="https://..."
                            value={companyData.website}
                            onChange={e => setCompanyData({...companyData, website: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Location *</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                          <input
                            required
                            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl pl-12 pr-4 py-4 text-on-surface focus:border-primary transition-all outline-none"
                            placeholder="City, Country"
                            value={companyData.location}
                            onChange={e => setCompanyData({...companyData, location: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Description *</label>
                      <div className="relative">
                        <FileText className="absolute left-4 top-6 w-5 h-5 text-amber-500" />
                        <textarea
                          required
                          rows={3}
                          className="w-full bg-surface-container-low border border-outline-variant/30 rounded-2xl pl-12 pr-4 py-4 text-on-surface focus:border-primary transition-all outline-none resize-none"
                          placeholder="Tell us about your company culture and mission..."
                          value={companyData.description}
                          onChange={e => setCompanyData({...companyData, description: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  <Button variant="gradient" className="w-full py-6" type="submit" disabled={loading}>
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Send Verification Code <ArrowRight className="ml-2 w-5 h-5" /></>}
                  </Button>
                </form>
              )}

              {step === 'OTP' && (
                <div className="space-y-8 text-center py-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-on-surface">Enter OTP</h3>
                    <p className="text-sm text-on-surface-variant">We've sent a 4-digit code to {user?.email}</p>
                  </div>
                  
                  <div className="flex justify-center gap-4">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        maxLength={1}
                        className="w-16 h-20 text-3xl font-black text-center bg-surface-container border-2 border-outline-variant/30 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                        value={digit}
                        onChange={e => handleOtpChange(i, e.target.value)}
                      />
                    ))}
                  </div>

                  <div className="space-y-4">
                    <Button 
                      variant="gradient" 
                      className="w-full py-6" 
                      onClick={handleVerifyOtp}
                      disabled={verifying}
                    >
                      {verifying ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShieldCheck className="w-6 h-6 mr-2" />}
                      Verify & Start Hiring
                    </Button>
                    <button 
                      onClick={() => setStep('COMPANY_DETAILS')}
                      className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors"
                    >
                      Change Company Details
                    </button>
                  </div>
                </div>
              )}

              {step === 'SUCCESS' && (
                <div className="space-y-8 text-center py-10 animate-in zoom-in duration-500">
                  <div className="w-24 h-24 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20 shadow-xl shadow-emerald-500/10">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-on-surface tracking-tight">Configuration Complete!</h3>
                    <p className="text-on-surface-variant font-medium">Welcome to the recruitment side of AI JobFit.</p>
                  </div>
                  <Button variant="gradient" className="w-full py-6" onClick={handleFinish}>
                    Go to Recruiter Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default HiringTransitionModal;
