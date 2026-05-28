'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/lib/services/auth.services';
import toast from 'react-hot-toast';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Save,
  Bot,
  Sparkles,
} from 'lucide-react';
import AdminAuthSplitLayout from './AdminAuthSplitLayout';

/**
 * 🔒 Admin Reset Password Form
 * SEO + Accessibility Optimized
 */
const AdminResetPasswordForm = () => {
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
      if (value.length < 6) error = 'Minimum 6 characters';
      else if (value.length > 15) error = 'Maximum 15 characters';
    } else if (name === 'confirmPassword' && value !== formData.newPassword) {
      error = 'Passwords mismatch';
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    validateField(id, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nErr = !formData.newPassword || formData.newPassword.length < 6 || formData.newPassword.length > 15;
    const cErr = !formData.confirmPassword || formData.confirmPassword !== formData.newPassword;

    if (nErr || cErr) {
      setErrors({
        newPassword: nErr
          ? formData.newPassword
            ? formData.newPassword.length < 6 ? 'Minimum 6 characters' : 'Maximum 15 characters'
            : 'Required'
          : '',
        confirmPassword: cErr
          ? formData.confirmPassword ? 'Mismatch' : 'Required'
          : '',
      });
      return toast.error('Please fix errors');
    }

    setLoading(true);
    const toastId = toast.loading('Resetting password...');

    try {
      const response = await authService.resetPassword({ email, ...formData });

      if (response.success) {
        toast.success('Password updated!', { id: toastId });
        router.push('/login');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Reset failed';
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminAuthSplitLayout>
      <section className="w-full" aria-labelledby="admin-reset-password-heading">
        {/* SEO Hidden H1 */}
        <h1 className="sr-only">Reset Admin Password Securely — AI JobFit Admin Panel</h1>

        {/* Brand Header */}
        <header className="mb-6 text-center flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="text-primary w-8 h-8" aria-hidden="true" />
            <span className="block text-2xl font-bold leading-none tracking-tight text-gradient-primary">
              AI JobFit
            </span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <Sparkles className="text-primary w-3 h-3" aria-hidden="true" />
            <span className="text-[10px] text-primary tracking-widest uppercase font-bold">Admin Panel</span>
          </div>

          <p id="admin-reset-password-heading" className="sr-only">
            Create a new secure password to recover your AI JobFit Admin account safely.
          </p>
        </header>

        {/* Header Details */}
        <div className="mb-6 text-center">
          <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-primary/20">
            <ShieldCheck className="text-primary w-6 h-6" aria-hidden="true" />
          </div>

          <h2 className="text-xl font-bold text-primary mb-1">Set New Admin Password</h2>

          <p className="text-xs text-on-surface-variant opacity-70">
            Create a secure password for your admin account.
          </p>
        </div>

        {/* Reset Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4" aria-label="Admin reset password form">
          {/* New Password */}
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-widest" htmlFor="newPassword">
              New Password
            </label>

            <div className="relative">
              <Lock
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 z-10 transition-colors ${errors.newPassword ? 'text-red-500' : 'text-primary/70'}`}
                aria-hidden="true"
              />
              <input
                className={`w-full glass-input rounded-xl pl-10 pr-10 py-2.5 text-sm transition-all ${errors.newPassword ? '!border-red-500' : ''}`}
                id="newPassword"
                name="newPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                value={formData.newPassword}
                onChange={handleChange}
                maxLength={15}
                required
                aria-invalid={!!errors.newPassword}
                aria-describedby={errors.newPassword ? 'admin-new-password-error' : undefined}
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${errors.newPassword ? 'text-red-500 hover:text-red-600' : 'text-primary/70 hover:text-primary'}`}
              >
                {showPassword ? <Eye className="w-4 h-4" aria-hidden="true" /> : <EyeOff className="w-4 h-4" aria-hidden="true" />}
              </button>
            </div>

            {errors.newPassword && (
              <p id="admin-new-password-error" className="text-[10px] text-red-500 mt-1 font-bold px-1">
                {errors.newPassword}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-widest" htmlFor="confirmPassword">
              Confirm Password
            </label>

            <div className="relative">
              <Lock
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 z-10 transition-colors ${errors.confirmPassword ? 'text-red-500' : 'text-primary/70'}`}
                aria-hidden="true"
              />
              <input
                className={`w-full glass-input rounded-xl pl-10 pr-10 py-2.5 text-sm transition-all ${errors.confirmPassword ? '!border-red-500' : ''}`}
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                maxLength={15}
                required
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? 'admin-confirm-password-error' : undefined}
              />
              <button
                type="button"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${errors.confirmPassword ? 'text-red-500 hover:text-red-600' : 'text-primary/70 hover:text-primary'}`}
              >
                {showConfirmPassword ? <Eye className="w-4 h-4" aria-hidden="true" /> : <EyeOff className="w-4 h-4" aria-hidden="true" />}
              </button>
            </div>

            {errors.confirmPassword && (
              <p id="admin-confirm-password-error" className="text-[10px] text-red-500 mt-1 font-bold px-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            type="submit"
            aria-label="Update admin account password"
            className="w-full gradient-button text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 mt-2 relative overflow-hidden group disabled:opacity-50"
          >
            <span className="relative z-10">{loading ? 'Updating...' : 'Update Password'}</span>
            {!loading && <Save className="relative z-10 w-4 h-4" aria-hidden="true" />}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </form>
      </section>
    </AdminAuthSplitLayout>
  );
};

export default AdminResetPasswordForm;
