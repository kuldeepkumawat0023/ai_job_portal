'use client';

import React from 'react';
import { Shield, Key, CreditCard, Receipt, Zap, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const PrivacySettingsView = () => {
  return (
    <div className="w-full max-w-7xl mx-auto pb-10">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-on-surface mb-2">Settings</h1>
        <p className="text-lg text-on-surface-variant">Manage your account preferences and AI settings.</p>
      </header>
      
      <div className="flex gap-8 flex-col md:flex-row">
        {/* Settings Navigation (Left Column) */}
        <nav className="w-full md:w-64 flex-shrink-0">
          <ul className="space-y-1">
            <li>
              <Link className="block px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors" href="/candidate/settings">
                Profile Settings
              </Link>
            </li>
            <li>
              <a className="block px-4 py-2 rounded-lg bg-surface-container text-primary font-medium border-l-2 border-primary transition-colors" href="#security">
                Account Security & Privacy
              </a>
            </li>
            <li>
              <a className="block px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors flex items-center justify-between" href="#ai">
                AI Preferences
              </a>
            </li>
            <li>
              <a className="block px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors" href="#notifications">
                Notifications
              </a>
            </li>
            <li>
              <a className="block px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors" href="#billing">
                Subscription & Billing
              </a>
            </li>
          </ul>
        </nav>
        
        {/* Settings Content (Right Column) */}
        <div className="flex-1 space-y-10">
          
          {/* Security & Privacy */}
          <section className="glass-card rounded-2xl p-8 border border-white/10 dark:border-white/5 shadow-sm" id="security">
            <div className="mb-6 border-b border-outline-variant/20 pb-4">
              <h2 className="text-3xl font-bold text-on-surface flex items-center gap-3">
                <Shield className="w-8 h-8 text-primary" />
                Security & Privacy
              </h2>
              <p className="text-base text-on-surface-variant mt-2">Manage your password, 2FA, and data privacy settings.</p>
            </div>
            
            <div className="space-y-8">
              {/* Password Section */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/10 pb-6">
                <div>
                  <h3 className="text-lg font-bold text-on-surface">Password</h3>
                  <p className="text-sm text-on-surface-variant">Set a unique password to protect your account.</p>
                </div>
                <button className="px-5 py-2.5 bg-surface-container-highest text-on-surface text-sm font-bold rounded-xl hover:bg-surface-container-highest/80 transition-all border border-outline-variant/30 flex items-center gap-2">
                  <Key className="w-4 h-4" /> Change Password
                </button>
              </div>

              {/* Two-Factor Authentication */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/10 pb-6">
                <div>
                  <h3 className="text-lg font-bold text-on-surface">Two-Factor Authentication (2FA)</h3>
                  <p className="text-sm text-on-surface-variant max-w-md">Add an extra layer of security to your account by requiring a code from your mobile device.</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] uppercase font-bold tracking-widest text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">Enabled</span>
                  <button className="px-5 py-2.5 bg-surface-container-lowest text-primary text-sm font-bold rounded-xl hover:bg-primary/10 transition-all border border-primary/30">
                    Manage
                  </button>
                </div>
              </div>

              {/* Data Privacy */}
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-on-surface">Data Privacy & Analytics</h3>
                  <p className="text-sm text-on-surface-variant max-w-md mt-1">Allow AI JobFit to use your anonymized data to improve AI suggestions and matchmaking algorithms.</p>
                </div>
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Subscription & Billing */}
          <section className="glass-card rounded-2xl p-8 border border-white/10 dark:border-white/5 shadow-sm" id="billing">
            <div className="mb-6 border-b border-outline-variant/20 pb-4">
              <h2 className="text-3xl font-bold text-on-surface flex items-center gap-3">
                <CreditCard className="w-8 h-8 text-primary" />
                Subscription & Billing
              </h2>
              <p className="text-base text-on-surface-variant mt-2">Manage your current plan, payment methods, and billing history.</p>
            </div>
            
            {/* Current Plan Card */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-6 mb-8 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-bold text-on-surface">AI Premium Plan</h3>
                    <span className="bg-primary text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Active
                    </span>
                  </div>
                  <p className="text-sm text-on-surface-variant font-medium">Your plan renews on <span className="font-bold text-on-surface">Oct 24, 2026</span> for $19.99/month.</p>
                  
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Unlimited AI Mock Interviews
                    </li>
                    <li className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Priority Job Matching
                    </li>
                    <li className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Advanced Portfolio Analytics
                    </li>
                  </ul>
                </div>
                
                <div className="flex flex-col gap-3 md:min-w-[140px]">
                  <button className="w-full px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md">
                    Upgrade Plan
                  </button>
                  <button className="w-full px-5 py-2.5 bg-surface-container-lowest text-error text-sm font-bold rounded-xl hover:bg-error/10 transition-all border border-error/20">
                    Cancel Plan
                  </button>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-on-surface border-b border-outline-variant/10 pb-2">Payment Method</h3>
              
              <div className="flex items-center justify-between p-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-surface-container-high rounded flex items-center justify-center border border-outline-variant/50">
                    <span className="font-bold text-primary italic text-sm">VISA</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Visa ending in 4242</p>
                    <p className="text-[12px] text-on-surface-variant">Expires 12/28</p>
                  </div>
                </div>
                <button className="text-sm font-bold text-primary hover:underline">Edit</button>
              </div>
              
              <button className="text-sm font-bold text-on-surface flex items-center gap-2 hover:text-primary transition-colors">
                + Add new payment method
              </button>
            </div>

            {/* Billing History */}
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-bold text-on-surface border-b border-outline-variant/10 pb-2">Billing History</h3>
              
              <div className="divide-y divide-outline-variant/10">
                {[
                  { date: 'Sep 24, 2026', amount: '$19.99', status: 'Paid', invoice: '#INV-2026-09' },
                  { date: 'Aug 24, 2026', amount: '$19.99', status: 'Paid', invoice: '#INV-2026-08' },
                  { date: 'Jul 24, 2026', amount: '$19.99', status: 'Paid', invoice: '#INV-2026-07' },
                ].map((bill, i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-bold text-on-surface">{bill.date}</p>
                      <p className="text-[12px] text-on-surface-variant">{bill.invoice}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-bold text-on-surface">{bill.amount}</p>
                        <p className="text-[12px] text-emerald-600 font-bold">{bill.status}</p>
                      </div>
                      <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors">
                        <Receipt className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </section>
          
        </div>
      </div>
    </div>
  );
};

export default PrivacySettingsView;
