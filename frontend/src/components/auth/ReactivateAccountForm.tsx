'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/lib/services/auth.services';
import toast from 'react-hot-toast';
import { RefreshCcw, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

/**
 * 🔒 Premium Reactivate Account Form (Full Validation)
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
    } else if (name === 'newPassword' && value.length < 6) {
      error = 'Minimum 6 characters';
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
    const nErr = !formData.newPassword || formData.newPassword.length < 6;
    const cErr = !formData.confirmPassword || formData.confirmPassword !== formData.newPassword;

    if (nErr || cErr) {
      setErrors({
        newPassword: nErr ? (formData.newPassword ? 'Min 6 chars' : 'Required') : '',
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
    <section className="w-full max-w-[480px] p-8 md:p-12 glass-card rounded-3xl z-10 relative shadow-xl">
      <div className="w-full mx-auto">
        <div className="mb-8 text-center">
          <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
            <RefreshCcw className="text-primary w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">Reactivate Account</h2>
          <p className="text-sm text-on-surface-variant opacity-70">Welcome back! Set a new password to reactivate your AI JobFit profile.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant mb-2 uppercase tracking-widest" htmlFor="newPassword">NEW PASSWORD</label>
            <div className="relative">
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.newPassword ? 'text-red-500' : 'text-primary/70'}`} />
              <input 
                className={`w-full glass-input rounded-xl px-4 pl-12 pr-12 py-4 text-sm focus:ring-0 transition-all ${errors.newPassword ? '!border-red-500 !ring-red-500/10' : ''}`} 
                id="newPassword" 
                placeholder="••••••••" 
                type={showPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={handleChange}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${errors.newPassword ? 'text-red-500' : 'text-primary/70 hover:text-primary'}`}
              >
                {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
            {errors.newPassword && <p className="text-[10px] text-red-500 mt-1 font-bold px-1">{errors.newPassword}</p>}
          </div>
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant mb-2 uppercase tracking-widest" htmlFor="confirmPassword">CONFIRM PASSWORD</label>
            <div className="relative">
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.confirmPassword ? 'text-red-500' : 'text-primary/70'}`} />
              <input 
                className={`w-full glass-input rounded-xl px-4 pl-12 pr-12 py-4 text-sm focus:ring-0 transition-all ${errors.confirmPassword ? '!border-red-500 !ring-red-500/10' : ''}`} 
                id="confirmPassword" 
                placeholder="••••••••" 
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${errors.confirmPassword ? 'text-red-500' : 'text-primary/70 hover:text-primary'}`}
              >
                {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-[10px] text-red-500 mt-1 font-bold px-1">{errors.confirmPassword}</p>}
          </div>

          <button 
            disabled={loading}
            className="w-full gradient-button text-white font-bold py-4 px-4 rounded-xl shadow-md hover:opacity-90 active:scale-[0.98] transition-all hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2" 
            type="submit"
          >
            {loading ? 'Reactivating...' : 'Reactivate & Login'}
            {!loading && <CheckCircle2 className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ReactivateAccountForm;
