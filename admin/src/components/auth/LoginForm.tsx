'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/lib/services/auth.services';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import {
  Bot,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  KeyRound,
} from 'lucide-react';
import AdminAuthSplitLayout from './AdminAuthSplitLayout';

const LoginForm = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const validate = (name: string, value: string) => {
    let error = '';
    if (!value) {
      error = 'Required';
    } else if (name === 'email') {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) {
        error = 'Invalid email';
      }
    } else if (name === 'password') {
      if (value.length < 6) {
        error = 'Min 6 characters required';
      }
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
    validate(id, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEmailValid = validate('email', formData.email);
    const isPasswordValid = validate('password', formData.password);

    if (!isEmailValid || !isPasswordValid) {
      return toast.error('Please resolve validation errors');
    }

    setLoading(true);
    const toastId = toast.loading('Authenticating Super Admin...');

    try {
      const response = await authService.login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (response.success) {
        const { user, token } = response.data;

        if (user.role !== 'admin') {
          toast.error('Access Denied: Only administrators are authorized.', { id: toastId });
          setLoading(false);
          return;
        }

        login(user, token);
        toast.success('Welcome back, Admin!', { id: toastId });
        router.push('/');
      }
    } catch (error: any) {
      const message = error.message || 'Authentication failed';
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) return;
    setLoading(true);
    const toastId = toast.loading('Verifying Google account...');

    try {
      const response = await authService.googleLogin(credentialResponse.credential);

      if (response.success) {
        const { user, token } = response.data;

        if (user.role !== 'admin') {
          toast.error('Access Denied: Only administrators are authorized.', { id: toastId });
          setLoading(false);
          return;
        }

        login(user, token);
        toast.success('Welcome back, Admin!', { id: toastId });
        router.push('/');
      }
    } catch (error: any) {
      const message = error.message || 'Google verification failed';
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminAuthSplitLayout>
      <section aria-labelledby="admin-login-heading" className="w-full">
        {/* SEO Hidden H1 */}
        <h1 className="sr-only">Admin Login — AI JobFit Super Admin Panel</h1>

        {/* Brand Header */}
        <header className="text-center flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="text-primary w-8 h-8" aria-hidden="true" />
            <span className="text-2xl font-bold text-gradient-primary">
              AI JobFit
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest mb-4">
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            Super Admin Panel
          </div>

          <p id="admin-login-heading" className="text-on-surface-variant text-sm opacity-80">
            Please log in to manage users, recruiters, job postings, and analyze platform metrics.
          </p>
        </header>

        {/* Google Login */}
        <div className="relative mb-6" aria-label="Continue with Google">
          <button
            type="button"
            aria-label="Continue with Google"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 glass-input rounded-xl font-medium text-on-surface hover:bg-surface-container-high transition-all border border-white/5 cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          {/* Google Overlay */}
          <div className="absolute inset-0 opacity-0 cursor-pointer overflow-hidden rounded-xl">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                toast.error('Google Sign In Failed');
              }}
              theme="outline"
              size="large"
              shape="pill"
              width="100%"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center mb-6" aria-hidden="true">
          <div className="flex-grow border-t border-outline-variant/30"></div>
          <span className="flex-shrink mx-4 text-[10px] font-bold text-outline uppercase tracking-widest">
            OR SIGN IN WITH EMAIL
          </span>
          <div className="flex-grow border-t border-outline-variant/30"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" aria-label="Admin login form">
          {/* Email */}
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant mb-1.5 uppercase tracking-widest" htmlFor="email">
              Admin Email
            </label>
            <div className="relative">
              <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors z-10 ${errors.email ? 'text-red-500' : 'text-primary/70'}`} aria-hidden="true" />
              <input
                id="email"
                type="email"
                placeholder="admin@aijobfit.com"
                value={formData.email}
                onChange={handleChange}
                className={`w-full glass-input rounded-xl pl-11 pr-4 py-2.5 text-sm transition-all ${errors.email ? '!border-red-500 !ring-red-500/10' : ''}`}
                autoComplete="email"
                required
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
            </div>
            {errors.email && <p id="email-error" className="text-[10px] text-red-500 mt-1 font-bold px-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest" htmlFor="password">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                aria-label="Forgot your password? Reset it here"
              >
                <KeyRound className="w-3 h-3" aria-hidden="true" />
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors z-10 ${errors.password ? 'text-red-500' : 'text-primary/70'}`} aria-hidden="true" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={`w-full glass-input rounded-xl pl-11 pr-10 py-2.5 text-sm transition-all ${errors.password ? '!border-red-500 !ring-red-500/10' : ''}`}
                autoComplete="current-password"
                required
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p id="password-error" className="text-[10px] text-red-500 mt-1 font-bold px-1">{errors.password}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            aria-label="Sign in to admin panel"
            className="w-full gradient-button text-white font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 mt-2 relative overflow-hidden group disabled:opacity-50 disabled:pointer-events-none"
          >
            <span className="relative z-10">
              {loading ? 'Authenticating...' : 'Sign In to Admin Panel'}
            </span>
            {!loading && <ArrowRight className="relative z-10 w-4 h-4" aria-hidden="true" />}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </form>

        {/* Footer Info */}
        <footer className="mt-8 pt-6 border-t border-outline-variant/30 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-on-surface-variant opacity-50" aria-hidden="true" />
          <span className="text-[11px] text-on-surface-variant opacity-60 font-medium">Secured with enterprise SSL &amp; encryption.</span>
        </footer>
      </section>
    </AdminAuthSplitLayout>
  );
};

export default LoginForm;
