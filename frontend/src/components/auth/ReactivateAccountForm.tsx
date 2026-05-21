'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/lib/services/auth.services';
import toast from 'react-hot-toast';
import { RefreshCcw, Lock, Eye, EyeOff, CheckCircle2, Bot, Sparkles, BrainCircuit } from 'lucide-react';
import AuthSplitLayout from './AuthSplitLayout';

/**
 * 🔒 Premium Reactivate Account Form (Full Validation & Split Layout)
 */
const ReactivateAccountForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (!email) router.push('/login');
  }, [email, router]);

  const validateField = (name: string, value: string) => {
    let error = '';
    if (!value) {
      error = 'Required';
    } else if (name === 'newPassword') {
      if (value.length < 6) {
        error = 'Minimum 6 characters';
      } else if (value.length > 15) {
        error = 'Maximum 15 characters';
      }
    } else if (name === 'confirmPassword' && value !== formData.newPassword) {
      error = 'Passwords do not match';
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    validateField(id, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final Validation
    const nErr = !formData.newPassword || formData.newPassword.length < 6 || formData.newPassword.length > 15;
    const cErr = !formData.confirmPassword || formData.confirmPassword !== formData.newPassword;

    if (nErr || cErr) {
      setErrors({
        newPassword: nErr ? (formData.newPassword ? (formData.newPassword.length < 6 ? 'Minimum 6 characters' : 'Maximum 15 characters') : 'Required') : '',
        confirmPassword: cErr ? (formData.confirmPassword ? 'Mismatch' : 'Required') : '',
      });
      return toast.error('Please correct errors');
    }

    setLoading(true);
    const toastId = toast.loading('Reactivating account...');

    try {
      const response = await authService.reactivateAccount({ email, ...formData });
      if (response.success) {
        toast.success('Welcome back! Reactivated.', { id: toastId });
        router.push('/login');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Reactivation failed';
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout>
      {/* Brand Header */}
            <div className="mb-6 text-center flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="text-primary w-8 h-8" />
                <span className="block text-2xl font-bold leading-none tracking-tight text-gradient-primary">AI JobFit</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                <Sparkles className="text-primary w-3 h-3" />
                <span className="text-[10px] text-primary tracking-widest uppercase font-bold">AI Powered</span>
              </div>
            </div>

            {/* Header Details */}
            <div className="mb-6 text-center">
              <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-primary/20">
                <RefreshCcw className="text-primary w-6 h-6 animate-spin-slow" />
              </div>
              <h2 className="text-xl font-bold text-primary mb-1">Reactivate Account</h2>
              <p className="text-xs text-on-surface-variant opacity-70">Welcome back! Set a new password to reactivate your AI JobFit profile.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-widest" htmlFor="newPassword">NEW PASSWORD</label>
                <div className="relative">
                  <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 z-10 transition-colors ${errors.newPassword ? 'text-red-500' : 'text-primary/70'}`} />
                  <input 
                    className={`w-full glass-input rounded-xl pl-10 pr-10 py-2.5 text-sm focus:ring-0 transition-all ${errors.newPassword ? '!border-red-500 !ring-red-500/10' : ''}`} 
                    id="newPassword" 
                    placeholder="••••••••" 
                    type={showPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleChange}
                    maxLength={15}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${errors.newPassword ? 'text-red-500 hover:text-red-600' : 'text-primary/70 hover:text-primary'}`}
                  >
                    {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
                {errors.newPassword && <p className="text-[10px] text-red-500 mt-1 font-bold px-1">{errors.newPassword}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-widest" htmlFor="confirmPassword">CONFIRM PASSWORD</label>
                <div className="relative">
                  <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 z-10 transition-colors ${errors.confirmPassword ? 'text-red-500' : 'text-primary/70'}`} />
                  <input 
                    className={`w-full glass-input rounded-xl pl-10 pr-10 py-2.5 text-sm focus:ring-0 transition-all ${errors.confirmPassword ? '!border-red-500 !ring-red-500/10' : ''}`} 
                    id="confirmPassword" 
                    placeholder="••••••••" 
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    maxLength={15}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${errors.confirmPassword ? 'text-red-500 hover:text-red-600' : 'text-primary/70 hover:text-primary'}`}
                  >
                    {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-[10px] text-red-500 mt-1 font-bold px-1">{errors.confirmPassword}</p>}
              </div>

              <button 
                disabled={loading}
                className="w-full gradient-button text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 mt-2 relative overflow-hidden group disabled:opacity-50" 
                type="submit"
              >
                <span className="relative z-10">{loading ? 'Reactivating...' : 'Reactivate & Login'}</span>
                {!loading && <CheckCircle2 className="relative z-10 w-4 h-4" />}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>

              <div className="mt-3 flex items-center justify-center gap-2 px-4 py-1.5 bg-primary/5 backdrop-blur-sm rounded-lg border border-primary/10">
                <BrainCircuit className="text-primary w-4 h-4" />
                <p className="text-[11px] leading-tight text-on-surface-variant italic">
                  <span className="font-semibold text-primary">AI Insight:</span> Reactivating reconstructs your profile vector in our job matching engine.
                </p>
              </div>
            </form>
    </AuthSplitLayout>
  );
};

export default ReactivateAccountForm;
