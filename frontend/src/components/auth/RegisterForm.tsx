'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/lib/services/auth.services';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import { UserPlus, Sparkles, User, Mail, Lock, ShieldCheck, Eye, EyeOff, ArrowRight, ChevronDown } from 'lucide-react';

/**
 * 🔒 Premium Register Form (Full Validation + Fixed Icons)
 */
const RegisterForm = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    countryCode: '+91',
    password: '',
    confirmPassword: '',
  });

  const validateField = (name: string, value: string) => {
    let error = '';
    if (!value) {
      error = 'Required field';
    } else {
      switch (name) {
        case 'email':
          if (!/\S+@\S+\.\S+/.test(value)) error = 'Invalid email address';
          break;
        case 'phoneNumber':
          if (!/^\d{10}$/.test(value)) error = 'Must be exactly 10 digits';
          break;
        case 'password':
          if (value.length < 6) error = 'Minimum 6 characters';
          break;
        case 'confirmPassword':
          if (value !== formData.password) error = 'Passwords mismatch';
          break;
      }
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;

    if (id === 'phoneNumber') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [id]: digitsOnly }));
      validateField(id, digitsOnly);
      return;
    }

    setFormData(prev => ({ ...prev, [id]: value }));
    validateField(id, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(formData).forEach(key => {
      const val = formData[key as keyof typeof formData];
      if (!val) {
        newErrors[key] = 'Required';
        isValid = false;
      } else {
        if (key === 'email' && !/\S+@\S+\.\S+/.test(val)) {
          newErrors[key] = 'Invalid email';
          isValid = false;
        }
        if (key === 'phoneNumber' && val.length !== 10) {
          newErrors[key] = '10 digits required';
          isValid = false;
        }
        if (key === 'confirmPassword' && val !== formData.password) {
          newErrors[key] = 'Mismatch';
          isValid = false;
        }
      }
    });

    if (!isValid) {
      setErrors(newErrors);
      return toast.error('Please fix form errors');
    }

    setLoading(true);
    const toastId = toast.loading('Creating account...');

    try {
      const response = await authService.register(formData);
      if (response.success) {
        if (response.data?.isReactivation) {
          toast.success('Verification OTP sent!', { id: toastId });
          router.push(`/verify-otp?email=${formData.email}&type=reactivate`);
          return;
        }
        if (response.data?.token && response.data?.user) {
          login(response.data.user, response.data.token);
          toast.success('Welcome to AI JobFit!', { id: toastId });
          router.push('/candidate/dashboard');
        }
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };


  return (
    <section className="w-full max-w-[480px] z-10 relative">
      <div className="glass-card rounded-3xl p-8 md:p-10 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <UserPlus className="text-primary w-8 h-8 drop-shadow-sm" />
            <span className="text-3xl font-bold text-on-surface tracking-tight">AI JobFit</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 shadow-sm">
            <Sparkles className="text-primary w-3.5 h-3.5" />
            <span className="text-[10px] font-bold text-primary tracking-widest uppercase">AI POWERED TALENT</span>
          </div>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-on-surface mb-1">Create your account</h1>
          <p className="text-sm text-on-surface-variant opacity-70">Join the future of intelligent hiring.</p>
        </div>

        {/* Google Register Overlay Trick */}
        <div className="relative mb-8">
          <button
            type="button"
            className="w-full bg-white dark:bg-zinc-800 border border-outline-variant/30 text-on-surface font-medium py-3.5 px-4 rounded-xl hover:bg-surface-container-low transition-all flex justify-center items-center gap-3 shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
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
                      toast.success('Registration Successful!', { id: toastId });
                      router.push(response.data.user.role === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard');
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant mb-2 uppercase tracking-widest" htmlFor="fullname">Full Name</label>
            <div className="relative">
              <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.fullname ? 'text-red-500' : 'text-primary/70'}`} />
              <input
                className={`w-full glass-input rounded-xl py-3.5 pl-12 pr-4 text-sm focus:ring-0 transition-all ${errors.fullname ? '!border-red-500 !ring-red-500/10' : ''}`}
                id="fullname"
                placeholder="Jane Doe"
                type="text"
                value={formData.fullname}
                onChange={handleChange}
              />
            </div>
            {errors.fullname && <p className="text-[10px] text-red-500 mt-1 font-bold px-1">{errors.fullname}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant mb-2 uppercase tracking-widest" htmlFor="email">Email Address</label>
            <div className="relative">
              <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.email ? 'text-red-500' : 'text-primary/70'}`} />
              <input
                className={`w-full glass-input rounded-xl py-3.5 pl-12 pr-4 text-sm focus:ring-0 transition-all ${errors.email ? '!border-red-500 !ring-red-500/10' : ''}`}
                id="email"
                placeholder="jane@company.com"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && <p className="text-[10px] text-red-500 mt-1 font-bold px-1">{errors.email}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant mb-2 uppercase tracking-widest" htmlFor="phoneNumber">Phone Number</label>
            <div className={`flex glass-input rounded-xl overflow-hidden transition-all ${errors.phoneNumber ? '!border-red-500 !ring-red-500/10' : ''}`}>
              <div className="relative border-r border-outline-variant/30">
                <select
                  className="py-3.5 pl-4 pr-8 h-full text-sm appearance-none bg-transparent transition-all outline-none border-none focus:ring-0"
                  id="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                >
                  <option value="+91">+91</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-primary/70 w-5 h-5 pointer-events-none" />
              </div>
              <input
                className="flex-1 py-3.5 px-4 text-sm focus:ring-0 bg-transparent border-none"
                id="phoneNumber"
                placeholder="9876543210"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            {errors.phoneNumber && <p className="text-[10px] text-red-500 mt-1 font-bold px-1">{errors.phoneNumber}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant mb-2 uppercase tracking-widest" htmlFor="password">Password</label>
            <div className="relative">
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.password ? 'text-red-500' : 'text-primary/70'}`} />
              <input
                className={`w-full glass-input rounded-xl py-3.5 pl-12 pr-12 text-sm focus:ring-0 transition-all ${errors.password ? '!border-red-500 !ring-red-500/10' : ''}`}
                id="password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-red-500' : 'text-primary/70 hover:text-primary'}`}
              >
                {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-[10px] text-red-500 mt-1 font-bold px-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant mb-2 uppercase tracking-widest" htmlFor="confirmPassword">Confirm Password</label>
            <div className="relative">
              <ShieldCheck className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errors.confirmPassword ? 'text-red-500' : 'text-primary/70'}`} />
              <input
                className={`w-full glass-input rounded-xl py-3.5 pl-12 pr-12 text-sm focus:ring-0 transition-all ${errors.confirmPassword ? '!border-red-500 !ring-red-500/10' : ''}`}
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
            className="w-full gradient-button text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 mt-2 relative overflow-hidden group disabled:opacity-50"
            type="submit"
          >
            <span className="relative z-10">{loading ? 'Creating Account...' : 'Create Account'}</span>
            <ArrowRight className="relative z-10 w-5 h-5" />
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </form>


        <p className="text-center mt-6 text-sm text-on-surface-variant">
          Already have an account?
          <Link className="text-primary font-bold hover:underline ml-1" href="/login">Sign in</Link>
        </p>
      </div>


    </section>
  );
};

export default RegisterForm;
