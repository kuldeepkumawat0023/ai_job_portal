'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services/auth.services';
import toast from 'react-hot-toast';
import {
  KeyRound,
  Mail,
  ArrowLeft,
  ArrowRight,
  Bot,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import AdminAuthSplitLayout from './AdminAuthSplitLayout';

/**
 * 🔒 Admin Forgot Password Form
 * SEO + Accessibility Optimized
 */
const AdminForgotPasswordForm = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = (val: string) => {
    let err = '';
    if (!val) {
      err = 'Required field';
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(val)) {
        err = 'Invalid email address';
      }
    }
    setError(err);
    return err === '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!validate(normalizedEmail)) {
      return toast.error('Please enter a valid admin email address');
    }

    setLoading(true);
    const toastId = toast.loading('Sending reset code...');

    try {
      const response = await authService.forgotPassword(normalizedEmail);

      if (response.success) {
        toast.success('Reset code sent!', { id: toastId });
        router.push(`/verify-otp?email=${normalizedEmail}&type=reset`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Request failed';
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminAuthSplitLayout>
      <section aria-labelledby="admin-forgot-password-heading" className="w-full">
        {/* SEO Hidden H1 */}
        <h1 className="sr-only">Admin Forgot Password — AI JobFit Super Admin Panel</h1>

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

          <p id="admin-forgot-password-heading" className="sr-only">
            Reset your AI JobFit Admin account password securely using email OTP verification.
          </p>
        </header>

        {/* Header Description */}
        <div className="mb-6 text-center">
          <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-primary/20">
            <KeyRound className="text-primary w-6 h-6" aria-hidden="true" />
          </div>

          <h2 className="text-xl font-bold text-primary mb-1">Forgot Password?</h2>

          <p className="text-xs text-on-surface-variant opacity-70">
            Enter your admin email and we&apos;ll send you a 6-digit reset code.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" aria-label="Admin forgot password form">
          {/* Email */}
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-widest" htmlFor="admin-fp-email">
              Admin Email Address
            </label>

            <div className="relative">
              <Mail
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 z-10 transition-colors ${error ? 'text-red-500' : 'text-primary/70'}`}
                aria-hidden="true"
              />
              <input
                className={`w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm transition-all ${error ? '!border-red-500 !ring-red-500/10' : ''}`}
                id="admin-fp-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="admin@aijobfit.com"
                aria-invalid={!!error}
                aria-describedby={error ? 'admin-fp-email-error' : undefined}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validate(e.target.value);
                }}
                required
              />
            </div>

            {error && (
              <p id="admin-fp-email-error" className="text-[10px] text-red-500 mt-1 font-bold px-1">
                {error}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            aria-label="Send admin password reset code"
            className="w-full gradient-button text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 mt-2 relative overflow-hidden group disabled:opacity-50"
            type="submit"
          >
            <span className="relative z-10">{loading ? 'Sending...' : 'Send Reset Code'}</span>
            {!loading && <ArrowRight className="relative z-10 w-4 h-4" aria-hidden="true" />}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Security note */}
          <div className="mt-3 flex items-center justify-center gap-2 px-4 py-1.5 bg-primary/5 backdrop-blur-sm rounded-lg border border-primary/10">
            <ShieldCheck className="text-primary w-4 h-4" aria-hidden="true" />
            <p className="text-[11px] leading-tight text-on-surface-variant italic">
              <span className="font-semibold text-primary">Admin Security:</span>{' '}
              Reset codes expire in 10 minutes for maximum protection.
            </p>
          </div>
        </form>

        {/* Back to Login */}
        <footer className="mt-6 text-center">
          <Link
            className="text-sm font-semibold text-primary hover:underline flex items-center justify-center gap-1"
            href="/login"
            aria-label="Back to admin login page"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to login
          </Link>
        </footer>
      </section>
    </AdminAuthSplitLayout>
  );
};

export default AdminForgotPasswordForm;
