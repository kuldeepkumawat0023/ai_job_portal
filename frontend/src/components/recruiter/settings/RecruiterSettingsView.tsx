'use client';

import React, { useState } from 'react';
import { 
  Users, 
  CreditCard, 
  Mail, 
  Plus, 
  Shield, 
  MoreVertical, 
  Download,
  Trash2,
  ExternalLink,
  Zap,
  User,
  Bell,
  Lock,
  Camera,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

interface RecruiterSettingsViewProps {
  initialTab?: 'profile' | 'team' | 'notifications' | 'billing' | 'security';
}

const RecruiterSettingsView: React.FC<RecruiterSettingsViewProps> = ({ initialTab = 'team' }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'team' | 'notifications' | 'billing' | 'security'>(initialTab);

  const tabs = [
    { id: 'profile', label: 'Personal Profile', icon: User },
    { id: 'team', label: 'Team Management', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  const teamMembers = [
    { id: 1, name: 'Alex Rivera', role: 'Admin', email: 'alex@startup.ai', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100', status: 'Active' },
    { id: 2, name: 'Sarah Chen', role: 'Recruiter', email: 'sarah@startup.ai', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100', status: 'Active' },
    { id: 3, name: 'Marcus Kim', role: 'Interviewer', email: 'marcus@startup.ai', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100', status: 'Pending' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-on-surface tracking-tight mb-2">Recruiter Settings</h1>
        <p className="text-on-surface-variant font-medium">Manage your personal account, team access, and portal preferences.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-outline-variant/30 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "px-8 py-4 font-black text-[10px] uppercase tracking-[0.2em] transition-all relative flex items-center gap-2 whitespace-nowrap",
              activeTab === tab.id 
                ? "text-primary" 
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            <tab.icon size={16} />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="settingsTab" 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" 
              />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[600px]">
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="glass-card rounded-[2rem] p-8 md:p-10 border border-white/10">
                <div className="flex flex-col lg:flex-row gap-12">
                  {/* Avatar Upload */}
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative group">
                      <div className="w-40 h-40 rounded-[2.5rem] bg-surface-container overflow-hidden ring-4 ring-primary/5 shadow-2xl">
                        <img 
                          src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=300&h=300" 
                          alt="Profile" 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                          <Camera className="text-white" size={32} />
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <h4 className="text-sm font-black text-on-surface uppercase tracking-widest">Sarah Jenkins</h4>
                      <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest italic">Senior Lead Recruiter</p>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="flex-1 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Full Name</label>
                        <input className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 py-3 font-medium text-on-surface transition-all" defaultValue="Sarah Jenkins" type="text" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Email Address</label>
                        <input className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 py-3 font-medium text-on-surface transition-all" defaultValue="s.jenkins@startup.ai" type="email" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Job Role</label>
                        <input className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 py-3 font-medium text-on-surface transition-all" defaultValue="Senior Lead Recruiter" type="text" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Department</label>
                        <input className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 py-3 font-medium text-on-surface transition-all" defaultValue="Talent Acquisition" type="text" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Professional Bio</label>
                      <textarea 
                        className="w-full bg-transparent border border-outline-variant/30 rounded-2xl p-6 font-medium text-on-surface focus:border-primary focus:ring-0 transition-all resize-none min-h-[120px]"
                        defaultValue="Passionate about connecting world-class engineering talent with innovative AI startups."
                      />
                    </div>
                    <div className="flex justify-end">
                      <button className="gradient-button text-white font-black text-[10px] uppercase tracking-[0.2em] px-10 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all">
                        Update Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Email Notifications */}
                <div className="glass-card rounded-[2rem] p-8 border border-white/10 space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-on-surface uppercase tracking-widest">Email Alerts</h3>
                      <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest">Manage your inbox</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {[
                      { title: 'New Applications', desc: 'Weekly digest of all new candidates', default: true },
                      { title: 'AI Match Alerts', desc: 'Instant alerts for candidates > 90% fit', default: true },
                      { title: 'Market Trends', desc: 'Monthly hiring benchmark reports', default: false },
                    ].map((item) => (
                      <div key={item.title} className="flex items-center justify-between group">
                        <div className="space-y-1">
                          <p className="text-xs font-black text-on-surface">{item.title}</p>
                          <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest">{item.desc}</p>
                        </div>
                        <div className={cn(
                          "w-12 h-6 rounded-full transition-all cursor-pointer relative",
                          item.default ? "bg-primary" : "bg-surface-container"
                        )}>
                          <div className={cn(
                            "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                            item.default ? "right-1" : "left-1"
                          )} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* In-App Alerts */}
                <div className="glass-card rounded-[2rem] p-8 border border-white/10 space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary/10 text-secondary rounded-2xl">
                      <Bell size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-on-surface uppercase tracking-widest">System Alerts</h3>
                      <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest">Real-time notifications</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {[
                      { title: 'Interview Reminders', desc: 'Push notifications 15 mins before', default: true },
                      { title: 'Team Mentions', desc: 'When teammates tag you in comments', default: true },
                      { title: 'Candidate Activity', desc: 'When candidates message or update', default: true },
                    ].map((item) => (
                      <div key={item.title} className="flex items-center justify-between group">
                        <div className="space-y-1">
                          <p className="text-xs font-black text-on-surface">{item.title}</p>
                          <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest">{item.desc}</p>
                        </div>
                        <div className={cn(
                          "w-12 h-6 rounded-full transition-all cursor-pointer relative",
                          item.default ? "bg-secondary" : "bg-surface-container"
                        )}>
                          <div className={cn(
                            "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                            item.default ? "right-1" : "left-1"
                          )} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="max-w-3xl space-y-8">
                {/* 2FA Card */}
                <div className="glass-card rounded-[2rem] p-8 border-l-4 border-error/40 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-error/10 rounded-[1.5rem] flex items-center justify-center text-error">
                      <ShieldAlert size={32} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-black text-on-surface tracking-tight">Two-Factor Authentication</h4>
                      <p className="text-[11px] font-medium text-on-surface-variant uppercase tracking-widest">
                        Status: <span className="text-error font-black">Disabled</span> — High Risk
                      </p>
                    </div>
                  </div>
                  <button className="px-8 py-3 rounded-xl border-2 border-error text-error font-black text-[10px] uppercase tracking-widest hover:bg-error/5 transition-all">
                    Enable 2FA
                  </button>
                </div>

                {/* Password Change */}
                <div className="glass-card rounded-[2rem] p-8 border border-white/10 space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-on-surface/5 text-on-surface rounded-2xl">
                      <Lock size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-on-surface uppercase tracking-widest">Change Password</h3>
                      <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest">Ensure your account is safe</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Current Password</label>
                        <input className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 py-3 font-medium text-on-surface transition-all" type="password" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">New Password</label>
                        <input className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 py-3 font-medium text-on-surface transition-all" type="password" />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button className="px-8 py-3 bg-surface-container hover:bg-surface-container-high rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'team' && (
            <motion.div
              key="team"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Team Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { label: 'Active Seats', value: '4 / 10', icon: Users, color: 'text-primary' },
                  { label: 'Admin Access', value: '1', icon: Shield, color: 'text-secondary' },
                  { label: 'Invites Sent', value: '2', icon: Mail, color: 'text-tertiary' },
                ].map((stat) => (
                  <div key={stat.label} className="glass-card p-6 rounded-3xl border border-white/10 flex items-center gap-5">
                    <div className={cn("p-3 rounded-2xl bg-surface-container", stat.color)}>
                      <stat.icon size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-0.5">{stat.label}</p>
                      <h4 className="text-xl font-black text-on-surface">{stat.value}</h4>
                    </div>
                  </div>
                ))}
              </div>

              {/* Team Member List */}
              <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-outline-variant/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container/30">
                  <div>
                    <h3 className="text-lg font-black text-on-surface tracking-tight">Team Members</h3>
                    <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest">Manage access and roles</p>
                  </div>
                  <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95">
                    <Plus size={16} />
                    Invite Member
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-surface-container/10">
                        <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Member</th>
                        <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Role</th>
                        <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Status</th>
                        <th className="px-8 py-5 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                      {teamMembers.map((member) => (
                        <tr key={member.id} className="group hover:bg-surface-container-low transition-colors">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <img src={member.avatar} alt="" className="w-10 h-10 rounded-xl object-cover ring-2 ring-primary/5" />
                              <div>
                                <p className="text-sm font-bold text-on-surface">{member.name}</p>
                                <p className="text-[11px] font-medium text-on-surface-variant">{member.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className={cn(
                              "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                              member.role === 'Admin' ? "bg-primary/5 text-primary border-primary/20" : "bg-surface-container text-on-surface-variant border-outline-variant/20"
                            )}>
                              {member.role}
                            </span>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-2">
                              <div className={cn("w-1.5 h-1.5 rounded-full", member.status === 'Active' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-orange-500")} />
                              <span className="text-[10px] font-black text-on-surface uppercase tracking-widest">{member.status}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <button className="p-2 text-on-surface-variant hover:text-error transition-colors opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0">
                              <Trash2 size={16} />
                            </button>
                            <button className="p-2 text-on-surface-variant hover:text-on-surface">
                              <MoreVertical size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'billing' && (
            <motion.div
              key="billing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Plan Overview Card */}
              <div className="glass-card rounded-[2.5rem] p-8 md:p-12 border border-white/10 relative overflow-hidden group">
                {/* Decorative Elements */}
                <div className="absolute -right-24 -top-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/20 transition-all duration-700" />
                <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-secondary/20 transition-all duration-700" />
                
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-8">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 text-primary rounded-full border border-primary/20 animate-pulse">
                      <Zap size={16} fill="currentColor" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Scale Pro Plan</span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-on-surface tracking-tighter">
                      Scaling your <span className="gradient-text">Success</span>
                    </h3>
                    <p className="text-on-surface-variant text-lg font-medium leading-relaxed max-w-md">
                      You are currently on the <span className="text-on-surface font-black">Growth Accelerator</span> plan. Next billing cycle: <span className="text-primary font-black">Nov 24, 2023</span>.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <button className="gradient-button text-white font-black text-xs uppercase tracking-widest px-10 py-4 rounded-2xl shadow-xl shadow-primary/30 transform hover:scale-105 transition-all">
                        Upgrade Plan
                      </button>
                      <button className="px-10 py-4 glass-card text-on-surface font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-surface-container transition-all">
                        Manage Payment
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6 bg-white/40 dark:bg-black/20 backdrop-blur-xl p-8 rounded-[2rem] border border-white/40 shadow-2xl">
                    <h4 className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Usage This Month</h4>
                    <div className="space-y-8">
                      {[
                        { label: 'AI Match Analysis', value: 842, limit: 1000, color: 'bg-primary' },
                        { label: 'Candidate Messages', value: 2450, limit: 5000, color: 'bg-secondary' },
                        { label: 'Team Seats', value: 4, limit: 10, color: 'bg-tertiary' },
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="flex justify-between text-[11px] font-black uppercase tracking-widest mb-3">
                            <span className="text-on-surface">{item.label}</span>
                            <span className="text-on-surface-variant">{item.value} / {item.limit}</span>
                          </div>
                          <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(item.value / item.limit) * 100}%` }}
                              className={cn("h-full rounded-full shadow-[0_0_12px_rgba(var(--primary-rgb),0.3)]", item.color)} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Invoice History */}
              <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
                  <h3 className="text-sm font-black text-on-surface uppercase tracking-[0.2em]">Payment History</h3>
                  <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1">
                    Download All <ExternalLink size={12} />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-surface-container/10">
                        <th className="px-8 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Invoice Date</th>
                        <th className="px-8 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Amount</th>
                        <th className="px-8 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Status</th>
                        <th className="px-8 py-4 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                      {[
                        { date: 'Oct 24, 2023', amount: '$249.00', status: 'Paid' },
                        { date: 'Sep 24, 2023', amount: '$249.00', status: 'Paid' },
                        { date: 'Aug 24, 2023', amount: '$199.00', status: 'Paid' },
                      ].map((invoice, i) => (
                        <tr key={i} className="group hover:bg-surface-container-low transition-colors">
                          <td className="px-8 py-5 text-sm font-bold text-on-surface">{invoice.date}</td>
                          <td className="px-8 py-5 text-sm font-black text-primary">{invoice.amount}</td>
                          <td className="px-8 py-5">
                            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
                              {invoice.status}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <button className="text-on-surface-variant hover:text-primary transition-colors">
                              <Download size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RecruiterSettingsView;
