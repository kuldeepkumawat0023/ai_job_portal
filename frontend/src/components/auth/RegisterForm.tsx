'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/lib/services/auth.services';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  ChevronDown,
  Bot,
  Sparkles,
  BrainCircuit,
  Phone
} from 'lucide-react';

import AuthSplitLayout from './AuthSplitLayout';

/**
 * 🔒 Premium Register Form
 * SEO + Accessibility Optimized
 */

const RegisterForm = () => {
  const router = useRouter();

  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [errors, setErrors] = useState<
    Record<string, string>
  >({});

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    countryCode: '+91',
    password: '',
    confirmPassword: '',
  });

  const validateField = (
    name: string,
    value: string
  ) => {
    let error = '';

    if (!value) {
      error = 'Required field';
    } else {
      switch (name) {
        case 'fullname':
          if (!/^[a-zA-Z\s]+$/.test(value)) {
            error =
              'Name must contain only letters and spaces';
          }
          break;

        case 'email':
          const emailRegex =
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

          if (!emailRegex.test(value)) {
            error = 'Invalid email address';
          } else if (
            !value.toLowerCase().endsWith('@gmail.com') &&
            !value.toLowerCase().endsWith('@example.com')
          ) {
            error = 'Only @gmail.com or @example.com is allowed';
          }
          break;

        case 'phoneNumber':
          if (!/^\d{10}$/.test(value)) {
            error = 'Must be exactly 10 digits';
          }
          break;

        case 'password':
          if (value.length < 6) {
            error = 'Minimum 6 characters';
          } else if (value.length > 15) {
            error = 'Maximum 15 characters';
          }
          break;

        case 'confirmPassword':
          if (value !== formData.password) {
            error = 'Passwords mismatch';
          }
          break;
      }
    }

    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));

    return error === '';
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;

    if (id === 'phoneNumber') {
      const digitsOnly = value
        .replace(/\D/g, '')
        .slice(0, 10);

      setFormData(prev => ({
        ...prev,
        [id]: digitsOnly,
      }));

      validateField(id, digitsOnly);

      return;
    }

    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));

    validateField(id, value);
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    let isValid = true;

    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    Object.keys(formData).forEach(key => {
      const val =
        formData[key as keyof typeof formData];

      if (!val) {
        newErrors[key] = 'Required';

        isValid = false;
      } else {
        if (key === 'fullname') {
          if (!/^[a-zA-Z\s]+$/.test(val)) {
            newErrors[key] =
              'Name must contain only letters and spaces';

            isValid = false;
          }
        }

        if (key === 'email') {
          if (!emailRegex.test(val)) {
            newErrors[key] = 'Invalid email';

            isValid = false;
          } else if (
            !val.toLowerCase().endsWith('@gmail.com') &&
            !val.toLowerCase().endsWith('@example.com')
          ) {
            newErrors[key] =
              'Only @gmail.com or @example.com is allowed';

            isValid = false;
          }
        }

        if (
          key === 'phoneNumber' &&
          val.length !== 10
        ) {
          newErrors[key] = '10 digits required';

          isValid = false;
        }

        if (key === 'password') {
          if (val.length < 6) {
            newErrors[key] =
              'Minimum 6 characters';

            isValid = false;
          } else if (val.length > 15) {
            newErrors[key] =
              'Maximum 15 characters';

            isValid = false;
          }
        }

        if (
          key === 'confirmPassword' &&
          val !== formData.password
        ) {
          newErrors[key] = 'Mismatch';

          isValid = false;
        }
      }
    });

    if (!isValid) {
      setErrors(newErrors);

      return toast.error(
        'Please fix form errors'
      );
    }

    setLoading(true);

    const toastId =
      toast.loading('Creating account...');

    try {
      const normalizedEmail =
        formData.email.trim().toLowerCase();

      const response =
        await authService.register({
          ...formData,
          email: normalizedEmail,
        });

      if (response.success) {
        if (response.data?.isReactivation) {
          toast.success(
            'Verification OTP sent!',
            {
              id: toastId,
            }
          );

          router.push(
            `/verify-otp?email=${formData.email}&type=reactivate`
          );

          return;
        }

        if (
          response.data?.token &&
          response.data?.user
        ) {
          login(
            response.data.user,
            response.data.token
          );

          toast.success(
            'Welcome to AI JobFit!',
            {
              id: toastId,
            }
          );

          router.push(
            '/candidate/dashboard'
          );
        }
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Registration failed';

      toast.error(message, {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout>
      <section
        aria-labelledby="register-heading"
        className="w-full"
      >
        {/* SEO Hidden Heading */}
        <h1 className="sr-only">
          Create AI JobFit Account
        </h1>

        {/* Brand Header */}
        <header className="mb-6 text-center flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <Bot
              className="text-primary w-8 h-8"
              aria-hidden="true"
            />

            <span className="block text-2xl font-bold leading-none tracking-tight text-gradient-primary">
              AI JobFit
            </span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <Sparkles
              className="text-primary w-3 h-3"
              aria-hidden="true"
            />

            <span className="text-[10px] text-primary tracking-widest uppercase font-bold">
              AI Powered
            </span>
          </div>

          <p
            id="register-heading"
            className="sr-only"
          >
            Create your AI JobFit account to
            access AI-powered recruitment,
            resume optimization, smart job
            matching, and career tools.
          </p>
        </header>

        {/* Google Register */}
        <div
          className="relative mb-4"
          aria-label="Continue with Google"
        >
          <button
            type="button"
            aria-label="Continue with Google"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 glass-input rounded-xl font-medium text-on-surface hover:bg-surface-container-high transition-all border border-white/5"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
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
              onSuccess={async (
                credentialResponse
              ) => {
                if (
                  credentialResponse.credential
                ) {
                  const toastId =
                    toast.loading(
                      'Verifying Google account...'
                    );

                  try {
                    const response =
                      await authService.googleLogin(
                        credentialResponse.credential
                      );

                    if (response.success) {
                      login(
                        response.data.user,
                        response.data.token
                      );

                      toast.success(
                        'Registration Successful!',
                        {
                          id: toastId,
                        }
                      );

                      router.push(
                        response.data.user.role ===
                          'recruiter'
                          ? '/recruiter/dashboard'
                          : '/candidate/dashboard'
                      );
                    }
                  } catch (error: any) {
                    toast.error(
                      error.message ||
                      'Verification failed',
                      {
                        id: toastId,
                      }
                    );
                  }
                }
              }}
              onError={() => {
                toast.error(
                  'Google Sign In Failed'
                );
              }}
              theme="outline"
              size="large"
              shape="pill"
              width="100%"
            />
          </div>
        </div>

        {/* Divider */}
        <div
          className="relative flex items-center mb-4"
          aria-hidden="true"
        >
          <div className="flex-grow border-t border-outline-variant/30"></div>

          <span className="flex-shrink mx-4 text-[10px] font-bold text-outline uppercase tracking-widest">
            OR REGISTER
          </span>

          <div className="flex-grow border-t border-outline-variant/30"></div>
        </div>

        {/* Register Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          aria-label="Register form"
        >
          {/* Full Name */}
          <div>
            <label
              className="block text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-widest"
              htmlFor="fullname"
            >
              FULL NAME
            </label>

            <div className="relative">
              <User
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 z-10 transition-colors ${errors.fullname
                    ? 'text-red-500'
                    : 'text-primary/70'
                  }`}
                aria-hidden="true"
              />

              <input
                className={`w-full glass-input rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-0 transition-all ${errors.fullname
                    ? '!border-red-500 !ring-red-500/10'
                    : ''
                  }`}
                id="fullname"
                name="fullname"
                type="text"
                autoComplete="name"
                placeholder="Jane Doe"
                aria-invalid={
                  !!errors.fullname
                }
                aria-describedby={
                  errors.fullname
                    ? 'fullname-error'
                    : undefined
                }
                value={formData.fullname}
                onChange={handleChange}
                required
              />
            </div>

            {errors.fullname && (
              <p
                id="fullname-error"
                className="text-[10px] text-red-500 mt-1 font-bold px-1"
              >
                {errors.fullname}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              className="block text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-widest"
              htmlFor="email"
            >
              EMAIL ADDRESS
            </label>

            <div className="relative">
              <Mail
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 z-10 transition-colors ${errors.email
                    ? 'text-red-500'
                    : 'text-primary/70'
                  }`}
                aria-hidden="true"
              />

              <input
                className={`w-full glass-input rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-0 transition-all ${errors.email
                    ? '!border-red-500 !ring-red-500/10'
                    : ''
                  }`}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="jane@gmail.com"
                aria-invalid={!!errors.email}
                aria-describedby={
                  errors.email
                    ? 'email-error'
                    : undefined
                }
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {errors.email && (
              <p
                id="email-error"
                className="text-[10px] text-red-500 mt-1 font-bold px-1"
              >
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label
              className="block text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-widest"
              htmlFor="phoneNumber"
            >
              PHONE NUMBER
            </label>

            <div className="relative flex gap-2">
              <div className="relative w-24 shrink-0">
                <select
                  className="w-full glass-input rounded-xl py-2.5 pl-3 pr-8 text-sm focus:ring-0 transition-all appearance-none bg-surface/50"
                  id="countryCode"
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                >
                  <option value="+91">+91 (IN)</option>
                  <option value="+1">+1 (US)</option>
                  <option value="+44">+44 (UK)</option>
                  <option value="+61">+61 (AU)</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
              </div>
              <div className="relative flex-1">
                <Phone
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 z-10 transition-colors ${errors.phoneNumber
                      ? 'text-red-500'
                      : 'text-primary/70'
                    }`}
                  aria-hidden="true"
                />

                <input
                  className={`w-full glass-input rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-0 transition-all ${errors.phoneNumber
                      ? '!border-red-500 !ring-red-500/10'
                      : ''
                    }`}
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="9876543210"
                  aria-invalid={!!errors.phoneNumber}
                  aria-describedby={
                    errors.phoneNumber
                      ? 'phoneNumber-error'
                      : undefined
                  }
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {errors.phoneNumber && (
              <p
                id="phoneNumber-error"
                className="text-[10px] text-red-500 mt-1 font-bold px-1"
              >
                {errors.phoneNumber}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              className="block text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-widest"
              htmlFor="password"
            >
              PASSWORD
            </label>

            <div className="relative">
              <Lock
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 z-10 transition-colors ${errors.password
                    ? 'text-red-500'
                    : 'text-primary/70'
                  }`}
                aria-hidden="true"
              />

              <input
                className={`w-full glass-input rounded-xl py-2.5 pl-10 pr-10 text-sm focus:ring-0 transition-all ${errors.password
                    ? '!border-red-500 !ring-red-500/10'
                    : ''
                  }`}
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password
                    ? 'password-error'
                    : undefined
                }
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors z-10"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {errors.password && (
              <p
                id="password-error"
                className="text-[10px] text-red-500 mt-1 font-bold px-1"
              >
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              className="block text-[10px] font-bold text-on-surface-variant mb-1 uppercase tracking-widest"
              htmlFor="confirmPassword"
            >
              CONFIRM PASSWORD
            </label>

            <div className="relative">
              <ShieldCheck
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 z-10 transition-colors ${errors.confirmPassword
                    ? 'text-red-500'
                    : 'text-primary/70'
                  }`}
                aria-hidden="true"
              />

              <input
                className={`w-full glass-input rounded-xl py-2.5 pl-10 pr-10 text-sm focus:ring-0 transition-all ${errors.confirmPassword
                    ? '!border-red-500 !ring-red-500/10'
                    : ''
                  }`}
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={
                  errors.confirmPassword
                    ? 'confirmPassword-error'
                    : undefined
                }
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors z-10"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {errors.confirmPassword && (
              <p
                id="confirmPassword-error"
                className="text-[10px] text-red-500 mt-1 font-bold px-1"
              >
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-on-primary py-3 px-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></span>
                  Creating Account...
                </span>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-on-surface-variant">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline font-bold">
                Log In
              </Link>
            </p>
          </div>
        </form>
      </section>
    </AuthSplitLayout>
  );
};

export default RegisterForm;