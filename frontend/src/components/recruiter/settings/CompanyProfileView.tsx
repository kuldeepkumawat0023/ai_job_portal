'use client';

import React from 'react';
import { 
  Building2, 
  Globe, 
  MapPin, 
  Upload,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

const CompanyProfileView = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-on-surface tracking-tight mb-2">Company Profile</h1>
        <p className="text-on-surface-variant font-medium">Manage your public company presence and branding.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Branding */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card rounded-3xl p-8 text-center border border-white/10">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-[2rem] bg-surface-container flex items-center justify-center border-2 border-dashed border-outline-variant group cursor-pointer overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-black text-4xl text-white">S</div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2">
                  <Upload size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Update Logo</span>
                </div>
              </div>
            </div>
            <h3 className="text-xl font-black text-on-surface mb-1">Startup AI</h3>
            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest italic mb-6">San Francisco, CA</p>
            <button className="w-full py-3 bg-surface-container hover:bg-surface-container-high rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
              View Public Profile
            </button>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-white/10">
            <h4 className="text-[10px] font-black text-on-surface uppercase tracking-[0.2em] mb-4">Verification Status</h4>
            <div className="flex items-center gap-3 p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-600">
              <CheckCircle2 size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Fully Verified Entity</span>
            </div>
          </div>
        </div>

        {/* Right: Detailed Info Form */}
        <div className="lg:col-span-8">
          <div className="glass-card rounded-3xl p-8 border border-white/10 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Company Name</label>
                <div className="relative">
                  <Building2 className="absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                  <input className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 pl-7 py-3 font-medium text-on-surface transition-all" defaultValue="Startup AI" type="text" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Website URL</label>
                <div className="relative">
                  <Globe className="absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                  <input className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 pl-7 py-3 font-medium text-on-surface transition-all" defaultValue="https://startup.ai" type="url" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Headquarters</label>
                <div className="relative">
                  <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                  <input className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 pl-7 py-3 font-medium text-on-surface transition-all" defaultValue="San Francisco, CA" type="text" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Industry</label>
                <select className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 py-3 font-medium text-on-surface transition-all">
                  <option>Artificial Intelligence</option>
                  <option>Fintech</option>
                  <option>Healthcare</option>
                  <option>E-commerce</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Company Description</label>
              <textarea 
                className="w-full bg-transparent border border-outline-variant/30 rounded-2xl p-4 font-medium text-on-surface focus:border-primary focus:ring-0 transition-all resize-none min-h-[120px]"
                defaultValue="We are building the future of generative AI systems for enterprise scale applications."
              />
            </div>

            <div className="flex justify-end pt-4">
              <button className="gradient-button text-white font-black text-[10px] uppercase tracking-widest px-8 py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfileView;
