'use client';

import React from 'react';
import { Camera, MapPin } from 'lucide-react';

const SettingsView = () => {
  return (
    <div className="w-full max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-on-surface mb-2">Settings</h1>
        <p className="text-lg text-on-surface-variant">Manage your account preferences and AI settings.</p>
      </header>

      <div className="flex gap-8 flex-col md:flex-row">
        {/* Settings Navigation (Left Column) */}
        <nav className="w-full md:w-64 flex-shrink-0">
          <ul className="space-y-1">
            <li>
              <a className="block px-4 py-2 rounded-lg bg-surface-container text-primary font-medium border-l-2 border-primary transition-colors" href="#profile">
                Profile Settings
              </a>
            </li>
            <li>
              <a className="block px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors" href="#security">
                Account Security
              </a>
            </li>
            <li>
              <a className="block px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors flex items-center justify-between" href="#ai">
                AI Preferences
                <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
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

          {/* Profile Settings */}
          <section className="glass-card rounded-2xl p-8 border border-white/10 dark:border-white/5 shadow-sm" id="profile">
            <div className="mb-6 border-b border-outline-variant/20 pb-4">
              <h2 className="text-3xl font-bold text-on-surface">Profile Settings</h2>
              <p className="text-base text-on-surface-variant mt-2">Update your personal information and professional details.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface-container-lowest shadow-md relative group">
                  <img
                    alt="Current Profile Photo"
                    className="w-full h-full object-cover"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="text-white w-6 h-6" />
                  </div>
                </div>
                <button className="text-sm font-bold text-primary hover:text-primary-container transition-colors">Change Photo</button>
              </div>

              <div className="flex-1 space-y-6 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[12px] uppercase font-bold tracking-widest text-on-surface-variant">First Name</label>
                    <input
                      className="w-full bg-transparent border-b border-outline-variant/50 focus:border-primary px-0 py-2 text-base text-on-surface border-t-0 border-l-0 border-r-0 focus:ring-0 transition-colors"
                      type="text"
                      defaultValue="Jane"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] uppercase font-bold tracking-widest text-on-surface-variant">Last Name</label>
                    <input
                      className="w-full bg-transparent border-b border-outline-variant/50 focus:border-primary px-0 py-2 text-base text-on-surface border-t-0 border-l-0 border-r-0 focus:ring-0 transition-colors"
                      type="text"
                      defaultValue="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[12px] uppercase font-bold tracking-widest text-on-surface-variant">Professional Headline</label>
                  <input
                    className="w-full bg-transparent border-b border-outline-variant/50 focus:border-primary px-0 py-2 text-base text-on-surface border-t-0 border-l-0 border-r-0 focus:ring-0 transition-colors"
                    type="text"
                    defaultValue="Senior UX Designer | AI Enthusiast"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[12px] uppercase font-bold tracking-widest text-on-surface-variant">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                    <input
                      className="w-full bg-transparent border-b border-outline-variant/50 focus:border-primary pl-8 py-2 text-base text-on-surface border-t-0 border-l-0 border-r-0 focus:ring-0 transition-colors"
                      type="text"
                      defaultValue="San Francisco, CA"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button className="px-8 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 hover:shadow-md transition-all">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default SettingsView;
