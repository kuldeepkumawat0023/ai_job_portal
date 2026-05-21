'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/lib/services/auth.services';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import { Bot, Sparkles, Mail, Lock, Eye, EyeOff, BrainCircuit } from 'lucide-react';
import AuthSplitLayout from './AuthSplitLayout';

/**
 * 🔒 Premium Login Form
 * Features: Glassmorphism design, Google OAuth, Validation, and Persistent Session.
 */
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
      } else if (!value.toLowerCase().endsWith('@gmail.com')) {
        error = 'Only @gmail.com is allowed';
      }
    } else if (name === 'password') {
      if (value.length < 6) {
        error = 'Min 6 characters required';
      } else if (value.length > 15) {
        error = 'Max 15 characters allowed';
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
    
    const normalizedEmail = formData.email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    // Final Validation
    const isEmailValid = normalizedEmail && emailRegex.test(normalizedEmail) && normalizedEmail.endsWith('@gmail.com');
    const isPasswordValid = formData.password && formData.password.length >= 6 && formData.password.length <= 15;

    if (!isEmailValid || !isPasswordValid) {
      let emailError = '';
      if (!formData.email) {
        emailError = 'Required';
      } else if (!emailRegex.test(formData.email)) {
        emailError = 'Invalid email';
      } else if (!formData.email.toLowerCase().endsWith('@gmail.com')) {
        emailError = 'Only @gmail.com is allowed';
      }

      let passwordError = '';
      if (!formData.password) {
        passwordError = 'Required';
      } else if (formData.password.length < 6) {
        passwordError = 'Min 6 characters required';
      } else if (formData.password.length > 15) {
        passwordError = 'Max 15 characters allowed';
      }

      setErrors({
        email: emailError,
        password: passwordError,
      });
      return toast.error('Please correct the errors');
    }

    setLoading(true);
    const toastId = toast.loading('Signing in...');

    try {
      const response = await authService.login({
        email: normalizedEmail,
        password: formData.password
      });
      if (response.success) {
        login(response.data.user, response.data.token);
        toast.success('Welcome back!', { id: toastId });
        
        const role = response.data.user.role;
        router.push(role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed';
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

            {/* Social Auth (Google Login Overlay Trick) */}
            <div className="relative mb-4">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 glass-input rounded-xl font-medium text-on-surface hover:bg-surface-container-high transition-all border border-white/5"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              {/* Actual Google Button (Invisible Overlay) */}
              <div className="absolute inset-0 opacity-0 cursor-pointer overflow-hidden rounded-xl">
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    if (credentialResponse.credential) {
                      const toastId = toast.loading('Verifying Google account...');
                      try {
                        const response = await authService.googleLogin(credentialResponse.credential);
                        if (response.success) {
                          login(response.data.user, response.data.token);
                          toast.success('Welcome back!', { id: toastId });
                          const role = response.data.user.role;
                          router.push(role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard');
                        }
                      } catch (error: any) {
                        toast.error(error.message || 'Verification failed', { id: toastId });
                      }
                    }
                  }}
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

            <div className="relative flex items-center mb-4">
              <div className="flex-grow border-t border-outline-variant/30"></div>
              <span className="flex-shrink mx-4 text-[10px] font-bold text-outline uppercase tracking-widest">OR EMAIL</span>
              <div className="flex-grow border-t border-outline-variant/30"></div>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-widest" htmlFor="email">EMAIL ADDRESS</label>
                <div className="relative">
                  <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 z-10 transition-colors ${errors.email ? 'text-red-500' : 'text-primary/70'}`} />
                  <input 
                    className={`w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-0 transition-all ${errors.email ? '!border-red-500 !ring-red-500/10' : ''}`} 
                    id="email" 
                    placeholder="alex.chen@aijobfit.com" 
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                {errors.email && <p className="text-[10px] text-red-500 mt-1 font-bold tracking-tight px-1">{errors.email}</p>}
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest" htmlFor="password">PASSWORD</label>
                  <Link className="text-[10px] font-bold text-primary hover:opacity-80 transition-opacity" href="/forgot-password">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 z-10 transition-colors ${errors.password ? 'text-red-500' : 'text-primary/70'}`} />
                  <input 
                    className={`w-full glass-input rounded-xl pl-10 pr-10 py-2.5 text-sm focus:ring-0 transition-all ${errors.password ? '!border-red-500 !ring-red-500/10' : ''}`} 
                    id="password" 
                    placeholder="••••••••" 
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    maxLength={15}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-red-500 hover:text-red-600' : 'text-primary/70 hover:text-primary'}`}
                  >
                    {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-[10px] text-red-500 mt-1 font-bold tracking-tight px-1">{errors.password}</p>}
              </div>
              <button 
                disabled={loading}
                className="w-full gradient-button text-white font-bold py-2.5 px-4 rounded-xl shadow-md hover:opacity-90 active:scale-[0.98] transition-all hover:shadow-lg disabled:opacity-50" 
                type="submit"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
              
              <div className="mt-3 flex items-center justify-center gap-2 px-4 py-1.5 bg-primary/5 backdrop-blur-sm rounded-lg border border-primary/10">
                <BrainCircuit className="text-primary w-4 h-4" />
                <p className="text-[11px] leading-tight text-on-surface-variant italic">
                  <span className="font-semibold text-primary">AI Insight:</span> AI JobFit uses neural matching to find your perfect role.
                </p>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-on-surface-variant">
                New to the platform? 
                <Link className="text-primary font-semibold hover:underline ml-1" href="/register">Create account</Link>
              </p>
            </div>
    </AuthSplitLayout>
  );
};

export default LoginForm;
