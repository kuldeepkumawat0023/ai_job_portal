'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  ShieldAlert,
  Loader2,
  Key,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import { useAuth } from '@/hooks/useAuth';
import { userService } from '@/lib/services/user.services';
import { toast } from 'react-hot-toast';

interface RecruiterSettingsViewProps {
  initialTab?: 'profile' | 'team' | 'notifications' | 'billing' | 'security';
}

const RecruiterSettingsView: React.FC<RecruiterSettingsViewProps> = ({ initialTab = 'profile' }) => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'team' | 'notifications' | 'billing' | 'security'>(initialTab);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    fullname: user?.fullname || '',
    email: user?.email || '',
    jobRole: user?.jobRole || 'Lead Recruiter',
    department: user?.department || 'Talent Acquisition',
    bio: user?.bio || '',
    profilePhoto: user?.profilePhoto || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=300&h=300'
  });

  // Team Management State
  const [team, setTeam] = useState<any[]>([]);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'Recruiter' });
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  // Billing State
  const [billingUsage, setBillingUsage] = useState<any>(null);

  // Security & Password Form State
  const [securityForm, setSecurityForm] = useState({ currentPassword: '', newPassword: '' });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled || false);

  // Notification Preferences State
  const [notificationPrefs, setNotificationPrefs] = useState({
    newApplications: user?.notificationPreferences?.newApplications ?? true,
    aiMatchAlerts: user?.notificationPreferences?.aiMatchAlerts ?? true,
    marketTrends: user?.notificationPreferences?.marketTrends ?? false,
    interviewReminders: user?.notificationPreferences?.interviewReminders ?? true,
    teamMentions: user?.notificationPreferences?.teamMentions ?? true,
    candidateActivity: user?.notificationPreferences?.candidateActivity ?? true
  });

  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load team, billing, and current profile settings on mount
  useEffect(() => {
    if (user) {
      setProfileData({
        fullname: user.fullname || '',
        email: user.email || '',
        jobRole: user.jobRole || 'Lead Recruiter',
        department: user.department || 'Talent Acquisition',
        bio: user.bio || '',
        profilePhoto: user.profilePhoto || 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=300&h=300'
      });
      setTwoFactorEnabled(user.twoFactorEnabled || false);
      setNotificationPrefs({
        newApplications: user.notificationPreferences?.newApplications ?? true,
        aiMatchAlerts: user.notificationPreferences?.aiMatchAlerts ?? true,
        marketTrends: user.notificationPreferences?.marketTrends ?? false,
        interviewReminders: user.notificationPreferences?.interviewReminders ?? true,
        teamMentions: user.notificationPreferences?.teamMentions ?? true,
        candidateActivity: user.notificationPreferences?.candidateActivity ?? true
      });
    }

    fetchTeamMembers();
    fetchBillingUsage();
  }, [user]);

  const fetchTeamMembers = async () => {
    try {
      const response = await userService.getTeamMembers();
      if (response.success && response.data) {
        setTeam(response.data);
      }
    } catch (err) {
      console.error('Error fetching team members:', err);
    }
  };

  const fetchBillingUsage = async () => {
    try {
      const response = await userService.getBillingUsage();
      if (response.success && response.data) {
        setBillingUsage(response.data);
      }
    } catch (err) {
      console.error('Error fetching billing usage:', err);
    }
  };

  // Profile Image Cloudinary Streaming
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?._id) return;

    try {
      setUpdating(true);
      const formData = new FormData();
      formData.append('profilePhoto', file);

      const response = await userService.updateProfile(user._id, formData);
      if (response.success && response.data) {
        setProfileData(prev => ({
          ...prev,
          profilePhoto: response.data.profilePhoto || prev.profilePhoto
        }));
        updateUser({ profilePhoto: response.data.profilePhoto });
        toast.success('Avatar updated on Cloudinary successfully!');
      } else {
        toast.error('Failed to upload profile photo');
      }
    } catch (err: any) {
      console.error('Error uploading photo:', err);
      toast.error(err.message || 'Error updating avatar photo');
    } finally {
      setUpdating(false);
    }
  };

  // Profile Information update handler
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) return;

    try {
      setUpdating(true);
      const response = await userService.updateProfile(user._id, {
        fullname: profileData.fullname,
        bio: profileData.bio,
        jobRole: profileData.jobRole,
        department: profileData.department
      });

      if (response.success && response.data) {
        updateUser({
          fullname: response.data.fullname,
          bio: response.data.bio,
          jobRole: response.data.jobRole,
          department: response.data.department
        });
        toast.success('Recruiter profile updated successfully!');
      } else {
        toast.error('Failed to save profile changes');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error updating profile settings');
    } finally {
      setUpdating(false);
    }
  };

  // Team Invite action handler
  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteForm.name || !inviteForm.email || !inviteForm.role) {
      toast.error('Please enter all teammate details');
      return;
    }

    try {
      setUpdating(true);
      const response = await userService.inviteTeamMember(inviteForm);
      if (response.success) {
        toast.success(`Success! Invited ${inviteForm.name} to team!`);
        setInviteForm({ name: '', email: '', role: 'Recruiter' });
        setInviteModalOpen(false);
        fetchTeamMembers();
        fetchBillingUsage();
      } else {
        toast.error(response.message || 'Failed to send teammate invitation');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'User with this email is already a teammate');
    } finally {
      setUpdating(false);
    }
  };

  // Team Remove member action handler
  const handleRemoveMember = async (id: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;

    try {
      setUpdating(true);
      const response = await userService.removeTeamMember(id);
      if (response.success) {
        toast.success('Teammate removed successfully');
        setTeam(prev => prev.filter(m => m._id !== id));
        fetchBillingUsage();
      } else {
        toast.error('Failed to remove team member');
      }
    } catch (err) {
      toast.error('Failed to revoke access');
    } finally {
      setUpdating(false);
    }
  };

  // Notification Preferences dynamic update
  const handleTogglePreference = async (key: string, value: boolean) => {
    if (!user?._id) return;
    try {
      setUpdating(true);
      const updatedPrefs = { ...notificationPrefs, [key]: value };
      setNotificationPrefs(updatedPrefs);

      const response = await userService.updateProfile(user._id, {
        notificationPreferences: updatedPrefs
      });
      if (response.success && response.data) {
        updateUser({ notificationPreferences: response.data.notificationPreferences });
        toast.success('Preference updated instantly!');
      }
    } catch (err) {
      toast.error('Failed to persist preference');
    } finally {
      setUpdating(false);
    }
  };

  // Two-factor authentication toggle handler
  const handleToggle2FA = async () => {
    if (!user?._id) return;
    try {
      setUpdating(true);
      const nextVal = !twoFactorEnabled;
      setTwoFactorEnabled(nextVal);

      const response = await userService.updateProfile(user._id, {
        twoFactorEnabled: nextVal
      });
      if (response.success && response.data) {
        updateUser({ twoFactorEnabled: response.data.twoFactorEnabled });
        toast.success(nextVal ? 'Two-Factor Authentication is now ENABLED!' : 'Two-Factor Authentication is DISABLED!');
      }
    } catch (err) {
      toast.error('Failed to update 2FA configuration');
    } finally {
      setUpdating(false);
    }
  };



  const tabs = [
    { id: 'profile', label: 'Personal Profile', icon: User },
    { id: 'team', label: 'Team Management', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  return (
    <main className="space-y-10 animate-in fade-in duration-700" id="settings-cockpit">
      {/* Robust Search-Engine Head Cockpit */}
      <span className="hidden" aria-hidden="true">
        <title>Recruiter Access Settings & Team Portal | AI Recruiting Hub</title>
        <meta name="description" content="Configure recruiter access control, invite teammates, adjust automated AI alerts, track billing plan consumption, and update 2FA security credentials." />
      </span>

      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight mb-2">Recruiter Settings</h1>
          <p className="text-on-surface-variant font-medium">Manage your personal account, team access, and portal preferences.</p>
        </div>
        {updating && (
          <span className="text-[10px] uppercase font-bold tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-primary/20">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving Session...
          </span>
        )}
      </header>

      {/* Tabs */}
      <nav className="flex border-b border-outline-variant/30 overflow-x-auto no-scrollbar" aria-label="Settings Navigation Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`tab-control-${tab.id}`}
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "px-8 py-4 font-black text-[10px] uppercase tracking-[0.2em] transition-all relative flex items-center gap-2 whitespace-nowrap cursor-pointer",
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
      </nav>

      {/* Content Area */}
      <div className="min-h-[600px]">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: Profile */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8 animate-in fade-in duration-500"
            >
              <section className="glass-card rounded-[2rem] p-8 md:p-10 border border-white/10" aria-labelledby="profile-title">
                <h2 className="sr-only" id="profile-title">Personal Profile Settings</h2>
                <div className="flex flex-col lg:flex-row gap-12">
                  {/* Avatar Upload */}
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <div className="w-40 h-40 rounded-[2.5rem] bg-surface-container overflow-hidden ring-4 ring-primary/5 shadow-2xl relative">
                        <img 
                          src={profileData.profilePhoto} 
                          alt="Recruiter Avatar" 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Camera className="text-white" size={32} />
                        </div>
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        accept="image/*" 
                        onChange={handlePhotoChange} 
                        className="hidden" 
                      />
                    </div>
                    <div className="text-center">
                      <h4 className="text-sm font-black text-on-surface uppercase tracking-widest">{profileData.fullname || 'Lead Recruiter'}</h4>
                      <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest italic">{profileData.jobRole}</p>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleUpdateProfile} className="flex-1 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Full Name</label>
                        <input 
                          className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 py-3 font-medium text-on-surface transition-all" 
                          value={profileData.fullname} 
                          onChange={(e) => setProfileData({...profileData, fullname: e.target.value})}
                          type="text" 
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Email Address</label>
                        <input 
                          className="w-full bg-transparent border-b border-outline-variant py-3 font-medium text-on-surface-variant opacity-75 cursor-not-allowed outline-none" 
                          value={profileData.email} 
                          type="email" 
                          disabled 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Job Role</label>
                        <input 
                          className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 py-3 font-medium text-on-surface transition-all" 
                          value={profileData.jobRole} 
                          onChange={(e) => setProfileData({...profileData, jobRole: e.target.value})}
                          type="text" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Department</label>
                        <input 
                          className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:ring-0 py-3 font-medium text-on-surface transition-all" 
                          value={profileData.department} 
                          onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                          type="text" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Professional Bio</label>
                      <textarea 
                        className="w-full bg-transparent border border-outline-variant/30 rounded-2xl p-6 font-medium text-on-surface focus:border-primary focus:ring-0 transition-all resize-none min-h-[120px]"
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        placeholder="Add a bio to show your recruiting background..."
                      />
                    </div>
                    <div className="flex justify-end">
                      <button 
                        type="submit"
                        disabled={updating}
                        className="gradient-button text-white font-black text-[10px] uppercase tracking-[0.2em] px-10 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {updating ? 'Saving...' : 'Update Profile'}
                      </button>
                    </div>
                  </form>
                </div>
              </section>
            </motion.div>
          )}

          {/* TAB 2: Notifications */}
          {activeTab === 'notifications' && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8" aria-labelledby="notification-title">
                <h2 className="sr-only" id="notification-title">Recruiter Notification Controls</h2>
                {/* Email Notifications */}
                <div className="glass-card rounded-[2rem] p-8 border border-white/10 space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-on-surface uppercase tracking-widest">Email Alerts</h3>
                      <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest">Manage your inbox digests</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {[
                      { key: 'newApplications', title: 'New Applications', desc: 'Weekly digest of all candidate submissions' },
                      { key: 'aiMatchAlerts', title: 'AI Match Alerts', desc: 'Instant alerts for candidates with matching index > 90%' },
                      { key: 'marketTrends', title: 'Market Trends', desc: 'Monthly hiring benchmark analysis reports' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between group">
                        <div className="space-y-1">
                          <p className="text-xs font-black text-on-surface">{item.title}</p>
                          <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest">{item.desc}</p>
                        </div>
                        <button 
                          onClick={() => handleTogglePreference(item.key, !((notificationPrefs as any)[item.key]))}
                          className={cn(
                            "w-12 h-6 rounded-full transition-all cursor-pointer relative outline-none",
                            (notificationPrefs as any)[item.key] ? "bg-primary" : "bg-surface-container"
                          )}
                          aria-label={`Toggle ${item.title}`}
                        >
                          <div className={cn(
                            "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                            (notificationPrefs as any)[item.key] ? "right-1" : "left-1"
                          )} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System / Push Alerts */}
                <div className="glass-card rounded-[2rem] p-8 border border-white/10 space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary/10 text-secondary rounded-2xl">
                      <Bell size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-on-surface uppercase tracking-widest">System Alerts</h3>
                      <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest">Real-time alerts inside app</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {[
                      { key: 'interviewReminders', title: 'Interview Reminders', desc: 'Alert notifications 15 mins before call times' },
                      { key: 'teamMentions', title: 'Team Mentions', desc: 'When teammate tags you in candidate records' },
                      { key: 'candidateActivity', title: 'Candidate Activity', desc: 'When candidates chat or modify portfolios' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between group">
                        <div className="space-y-1">
                          <p className="text-xs font-black text-on-surface">{item.title}</p>
                          <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest">{item.desc}</p>
                        </div>
                        <button 
                          onClick={() => handleTogglePreference(item.key, !((notificationPrefs as any)[item.key]))}
                          className={cn(
                            "w-12 h-6 rounded-full transition-all cursor-pointer relative outline-none",
                            (notificationPrefs as any)[item.key] ? "bg-secondary" : "bg-surface-container"
                          )}
                          aria-label={`Toggle ${item.title}`}
                        >
                          <div className={cn(
                            "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                            (notificationPrefs as any)[item.key] ? "right-1" : "left-1"
                          )} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {/* TAB 3: Security */}
          {activeTab === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <section className="glass-card rounded-[2rem] p-8 border border-white/10 space-y-8" aria-labelledby="security-title">
                <div className="mb-4 border-b border-outline-variant/20 pb-5">
                  <h2 className="text-2xl font-black text-on-surface flex items-center gap-3" id="security-title">
                    <Shield size={24} className="text-primary" />
                    Security & Privacy
                  </h2>
                  <p className="text-[11px] font-medium text-on-surface-variant uppercase tracking-widest mt-1">Manage your password, 2FA, and data privacy settings.</p>
                </div>

                {/* Password Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/10 pb-6">
                  <div>
                    <h3 className="text-sm font-black text-on-surface uppercase tracking-widest">Password</h3>
                    <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest mt-1">Set a unique password to protect your account.</p>
                  </div>
                  <a
                    href="/forgot-password"
                    className="px-6 py-3 bg-surface-container text-on-surface text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-surface-container-high transition-all border border-outline-variant/20 flex items-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <Key size={14} className="text-primary" /> Change Password
                  </a>
                </div>

                {/* Two-Factor Authentication */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/10 pb-6">
                  <div>
                    <h3 className="text-sm font-black text-on-surface uppercase tracking-widest">Two-Factor Authentication (2FA)</h3>
                    <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest mt-1">Add an extra layer of security with a device-based verification code.</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={cn(
                      "text-[9px] uppercase font-black tracking-widest px-3 py-1 rounded-full border",
                      twoFactorEnabled
                        ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/30"
                        : "text-error bg-error/10 border-error/20"
                    )}>
                      {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <button
                      onClick={handleToggle2FA}
                      disabled={updating}
                      className={cn(
                        "px-5 py-2.5 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap disabled:opacity-50",
                        twoFactorEnabled
                          ? "border-emerald-500 text-emerald-500 hover:bg-emerald-500/5"
                          : "border-primary text-primary hover:bg-primary/5"
                      )}
                    >
                      {twoFactorEnabled ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>

                {/* Data Privacy */}
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-black text-on-surface uppercase tracking-widest">Data Privacy & Analytics</h3>
                    <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest mt-1">Allow AI JobFit to use your anonymized data to improve AI match algorithms.</p>
                  </div>
                  <div className="flex items-center flex-shrink-0">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-surface-container peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {/* TAB 4: Team */}
          {activeTab === 'team' && (
            <motion.div
              key="team"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <section aria-labelledby="team-management-title" className="space-y-8">
                <h2 className="sr-only" id="team-management-title">Workspace Team Seats</h2>
                {/* Team Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { label: 'Active Seats Used', value: `${billingUsage?.activeSeats || team.length || 1} / ${billingUsage?.activeSeatsLimit || 10}`, icon: Users, color: 'text-primary' },
                    { label: 'Administrator Seats', value: team.filter(m => m.role?.toLowerCase() === 'admin').length || 1, icon: Shield, color: 'text-secondary' },
                    { label: 'Assigned Role Slots', value: team.filter(m => m.role?.toLowerCase() === 'recruiter').length || 2, icon: Mail, color: 'text-tertiary' },
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
                      <h3 className="text-lg font-black text-on-surface tracking-tight">Team Workspace Members</h3>
                      <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest">Invite and grant ATS portal access</p>
                    </div>
                    <button 
                      onClick={() => setInviteModalOpen(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95 cursor-pointer"
                    >
                      <Plus size={16} />
                      Invite Member
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-surface-container/10">
                          <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Workspace Teammate</th>
                          <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">ATS Authority Role</th>
                          <th className="px-8 py-5 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Connection Status</th>
                          <th className="px-8 py-5 text-right"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/10">
                        {team.map((member) => (
                          <tr key={member._id} className="group hover:bg-surface-container-low transition-colors">
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-4">
                                <img 
                                  src={member.profilePhoto || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100'} 
                                  alt="Teammate avatar" 
                                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-primary/5" 
                                />
                                <div>
                                  <p className="text-sm font-bold text-on-surface">{member.fullname}</p>
                                  <p className="text-[11px] font-medium text-on-surface-variant">{member.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <span className={cn(
                                "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                                member.role?.toLowerCase() === 'admin' ? "bg-primary/5 text-primary border-primary/20" : "bg-surface-container text-on-surface-variant border-outline-variant/20"
                              )}>
                                {member.role || 'Recruiter'}
                              </span>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-2">
                                <div className={cn("w-1.5 h-1.5 rounded-full", member.isActive !== false ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-orange-500")} />
                                <span className="text-[10px] font-black text-on-surface uppercase tracking-widest">
                                  {member.isActive !== false ? 'Active' : 'Pending'}
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-5 text-right">
                              {member._id !== user?._id && (
                                <button 
                                  onClick={() => handleRemoveMember(member._id)}
                                  className="p-2 text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                                  aria-label="Remove teammate from dashboard"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Teammate Invite Dialog Box Modal */}
              {inviteModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="glass-card rounded-[2rem] border border-white/10 p-8 w-full max-w-md space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
                    <button 
                      onClick={() => setInviteModalOpen(false)}
                      className="absolute right-6 top-6 text-on-surface-variant hover:text-on-surface cursor-pointer"
                    >
                      <X size={20} />
                    </button>
                    <div>
                      <h3 className="text-xl font-black text-on-surface tracking-tight">Invite Teammate</h3>
                      <p className="text-[11px] font-medium text-on-surface-variant uppercase tracking-widest mt-1">Grant recruit access control</p>
                    </div>
                    <form onSubmit={handleInviteMember} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Full Name</label>
                        <input 
                          type="text" 
                          className="w-full bg-surface-container border border-outline-variant/30 rounded-xl p-3 focus:border-primary focus:ring-0 text-on-surface"
                          value={inviteForm.name}
                          onChange={(e) => setInviteForm({...inviteForm, name: e.target.value})}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Email Address</label>
                        <input 
                          type="email" 
                          className="w-full bg-surface-container border border-outline-variant/30 rounded-xl p-3 focus:border-primary focus:ring-0 text-on-surface"
                          value={inviteForm.email}
                          onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Workspace Role</label>
                        <select 
                          className="w-full bg-surface-container border border-outline-variant/30 rounded-xl p-3 focus:border-primary focus:ring-0 text-on-surface"
                          value={inviteForm.role}
                          onChange={(e) => setInviteForm({...inviteForm, role: e.target.value})}
                        >
                          <option value="Recruiter">Recruiter</option>
                          <option value="Interviewer">Interviewer</option>
                          <option value="Admin">Administrator</option>
                        </select>
                      </div>
                      <div className="pt-4 flex gap-4">
                        <button 
                          type="button" 
                          onClick={() => setInviteModalOpen(false)}
                          className="flex-1 py-3 bg-surface-container hover:bg-surface-container-high rounded-xl font-black text-[10px] uppercase tracking-widest text-on-surface"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className="flex-1 py-3 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:shadow-lg hover:shadow-primary/30 transition-all"
                        >
                          Send Invitation
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 5: Billing & Plan */}
          {activeTab === 'billing' && (
            <motion.div
              key="billing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <section aria-labelledby="billing-cockpit-title" className="space-y-8">
                <h2 className="sr-only" id="billing-cockpit-title">Billing limits and subscription plan</h2>
                {/* Plan Overview Card */}
                <div className="glass-card rounded-[2.5rem] p-8 md:p-12 border border-white/10 relative overflow-hidden group">
                  {/* Decorative Elements */}
                  <div className="absolute -right-24 -top-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/20 transition-all duration-700" />
                  <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-secondary/20 transition-all duration-700" />
                  
                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                      <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 text-primary rounded-full border border-primary/20 animate-pulse">
                        <Zap size={16} fill="currentColor" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                          {billingUsage?.planName || (user?.isPremium ? 'Scale Pro Plan' : 'Free Trial')}
                        </span>
                      </div>
                      <h3 className="text-4xl md:text-5xl font-black text-on-surface tracking-tighter">
                        Scaling your <span className="gradient-text">Success</span>
                      </h3>
                      <p className="text-on-surface-variant text-lg font-medium leading-relaxed max-w-md">
                        Your enterprise runs on the <span className="text-on-surface font-black">Hiring Accelerator</span> program. Next invoice batching: <span className="text-primary font-black">Lifetime Premium License</span>.
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <button className="gradient-button text-white font-black text-xs uppercase tracking-widest px-10 py-4 rounded-2xl shadow-xl shadow-primary/30 transform hover:scale-105 transition-all cursor-pointer">
                          Upgrade Limits
                        </button>
                        <button className="px-10 py-4 glass-card text-on-surface font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-surface-container transition-all cursor-pointer">
                          Manage Invoices
                        </button>
                      </div>
                    </div>

                    <div className="space-y-6 bg-white/40 dark:bg-black/20 backdrop-blur-xl p-8 rounded-[2rem] border border-white/40 shadow-2xl">
                      <h4 className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Usage Tracker (This Month)</h4>
                      <div className="space-y-8">
                        {[
                          { label: 'AI Profile Analyses', value: billingUsage?.aiAnalysis || 12, limit: billingUsage?.aiAnalysisLimit || 100, color: 'bg-primary' },
                          { label: 'Candidate Messages Sent', value: billingUsage?.messagesCount || 148, limit: billingUsage?.messagesLimit || 500, color: 'bg-secondary' },
                          { label: 'Active Seat Assignments', value: billingUsage?.activeSeats || 4, limit: billingUsage?.activeSeatsLimit || 10, color: 'bg-tertiary' },
                        ].map((item) => (
                          <div key={item.label}>
                            <div className="flex justify-between text-[11px] font-black uppercase tracking-widest mb-3">
                              <span className="text-on-surface">{item.label}</span>
                              <span className="text-on-surface-variant">{item.value} / {item.limit}</span>
                            </div>
                            <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (item.value / item.limit) * 100)}%` }}
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
                    <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1 cursor-pointer">
                      Download All Statement <ExternalLink size={12} />
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-surface-container/10">
                          <th className="px-8 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Invoice Date</th>
                          <th className="px-8 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Total Price</th>
                          <th className="px-8 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Payment Status</th>
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
                              <button className="text-on-surface-variant hover:text-primary transition-colors p-2 cursor-pointer">
                                <Download size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
};

export default RecruiterSettingsView;
