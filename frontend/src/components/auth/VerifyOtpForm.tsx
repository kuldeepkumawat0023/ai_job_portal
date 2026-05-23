'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/lib/services/auth.services';
import toast from 'react-hot-toast';
import {
  MailOpen,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

/**
 * 🔒 Premium OTP Verification Form
 * SEO + Accessibility Optimized
 */
const VerifyOtpForm = () => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const email = searchParams.get('email');

  const type = searchParams.get('type');

  const [otp, setOtp] = useState('');

  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      toast.error('Email missing. Redirecting...');
      router.push('/login');
    }
  }, [email, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value
      .replace(/\D/g, '')
      .slice(0, 6);

    setOtp(value);

    if (value.length > 0 && value.length < 6) {
      setError('6 digits required');
    } else {
      setError('');
    }
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (otp.length < 6) {
      setError('Required');

      return toast.error(
        'Please enter 6-digit code'
      );
    }

    setLoading(true);

    const toastId = toast.loading(
      'Verifying code...'
    );

    try {
      const response =
        await authService.verifyOtp({
          email: email!,
          otp
        });

      if (response.success) {
        toast.success('Verified!', {
          id: toastId
        });

        if (type === 'reactivate') {
          router.push(
            `/reactivate-account?email=${email}`
          );
        } else {
          router.push(
            `/reset-password?email=${email}`
          );
        }
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Invalid code';

      toast.error(message, {
        id: toastId
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="w-full max-w-[480px] p-8 md:p-12 glass-card rounded-3xl z-10 relative shadow-xl"
      aria-labelledby="verify-otp-heading"
    >
      {/* SEO Hidden H1 */}
      <h1 className="sr-only">
        Verify OTP Code for AI JobFit Account
      </h1>

      <div className="w-full mx-auto text-center">
        {/* Header */}
        <header className="mb-8">
          <div className="bg-primary/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-primary/20">
            <MailOpen
              className="text-primary w-10 h-10"
              aria-hidden="true"
            />
          </div>

          <h2
            id="verify-otp-heading"
            className="text-2xl font-bold text-primary mb-2"
          >
            Check Your Email
          </h2>

          <p className="text-sm text-on-surface-variant opacity-70">
            We&apos;ve sent a 6-digit verification
            code to <br />
            <span className="font-bold text-on-surface">
              {email}
            </span>
          </p>

          {/* SEO Description */}
          <p className="sr-only">
            Enter the OTP verification code sent
            to your email to securely verify your
            AI JobFit account and continue the
            password reset or account
            reactivation process.
          </p>
        </header>

        {/* OTP Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-8"
          aria-label="OTP verification form"
        >
          <div className="flex justify-center flex-col items-center">
            <div className="relative group">
              <ShieldCheck
                className={`absolute -left-10 top-1/2 -translate-y-1/2 w-6 h-6 transition-colors ${error
                  ? 'text-red-500'
                  : 'text-primary/70 group-focus-within:text-primary'
                  }`}
                aria-hidden="true"
              />

              <input
                className={`w-full max-w-[280px] glass-input rounded-2xl px-4 py-5 text-center text-4xl font-bold tracking-[0.5em] focus:ring-4 outline-none transition-all ${error
                  ? '!border-red-500 !ring-red-500/10'
                  : 'focus:ring-primary/10'
                  }`}
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                maxLength={6}
                value={otp}
                onChange={handleChange}
                autoFocus
                required
                aria-required="true"
                aria-invalid={!!error}
                aria-describedby={
                  error ? 'otp-error' : undefined
                }
                aria-label="Enter 6 digit OTP code"
              />
            </div>

            {error && (
              <p
                id="otp-error"
                className="text-[10px] text-red-500 mt-3 font-bold tracking-tight"
              >
                {error}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            type="submit"
            aria-label="Verify OTP code"
            className="w-full gradient-button text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading
              ? 'Verifying...'
              : 'Verify Code'}

            {!loading && (
              <ArrowRight
                className="w-5 h-5"
                aria-hidden="true"
              />
            )}
          </button>
        </form>

        {/* Resend OTP */}
        <footer className="mt-8">
          <p className="text-xs text-on-surface-variant">
            Didn&apos;t receive the code?
            <button
              type="button"
              aria-label="Resend OTP code"
              className="text-primary font-bold ml-1 hover:underline"
            >
              Resend OTP
            </button>
          </p>
        </footer>
      </div>
    </section>
  );
};

export default VerifyOtpForm;