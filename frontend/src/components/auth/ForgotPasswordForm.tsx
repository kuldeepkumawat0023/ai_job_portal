'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services/auth.services';
import toast from 'react-hot-toast';
import { KeyRound, Mail, ArrowLeft, ArrowRight } from 'lucide-react';

/**
 * 🔒 Premium Forgot Password Form (Full Validation)
 */
const ForgotPasswordForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = (val: string) => {
    if (!val) {
      setError('Required field');
    } else if (!/\S+@\S+\.\S+/.test(val)) {
      setError('Invalid email address');
    } else {
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError(!email ? 'Required' : 'Invalid email');
      return toast.error('Please enter a valid email');
    }

    setLoading(true);
    const toastId = toast.loading('Sending reset code...');

    try {
      const response = await authService.forgotPassword(email);
      if (response.success) {
        toast.success('Reset code sent!', { id: toastId });
        router.push(`/verify-otp?email=${email}&type=reset`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Request failed';
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-[480px] p-8 md:p-12 glass-card rounded-3xl z-10 relative shadow-xl">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
            <KeyRound className="text-primary w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">Forgot Password?</h2>
          <p className="text-sm text-on-surface-variant opacity-70">No worries! Enter your email and we&apos;ll send you a 6-digit reset code.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-on-surface-variant mb-2 uppercase tracking-widest" htmlFor="email">EMAIL ADDRESS</label>
            <div className="relative">
              <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${error ? 'text-red-500' : 'text-primary/70'}`} />
              <input 
                className={`w-full glass-input rounded-xl px-4 pl-12 py-4 text-sm focus:ring-0 transition-all ${error ? '!border-red-500 !ring-red-500/10' : ''}`} 
                id="email" 
                placeholder="alex@aijobfit.com" 
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validate(e.target.value);
                }}
              />
            </div>
            {error && <p className="text-[10px] text-red-500 mt-1 font-bold px-1">{error}</p>}
          </div>

          <button 
            disabled={loading}
            className="w-full gradient-button text-white font-bold py-4 px-4 rounded-xl shadow-md hover:opacity-90 active:scale-[0.98] transition-all hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2" 
            type="submit"
          >
            {loading ? 'Sending...' : 'Send Reset Code'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link className="text-sm font-bold text-primary hover:underline flex items-center justify-center gap-1" href="/login">
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordForm;
