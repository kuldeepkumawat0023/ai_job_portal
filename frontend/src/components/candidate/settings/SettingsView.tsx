'use client';

import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Key, Sparkles, Loader2, BrainCircuit, Bell, CreditCard, Zap, CheckCircle2, Receipt, Shield } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { userService } from '@/lib/services/user.services';
import { toast } from 'react-hot-toast';

interface SettingsViewProps {
  defaultTab?: string;
}

const SettingsView = ({ defaultTab = 'profile' }: SettingsViewProps) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Tab State (defaults to prop, matches URL query if present)
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Form states (Profile)
  const [fullname, setFullname] = useState('');
  const [headline, setHeadline] = useState('');
  const [location, setLocation] = useState('');

  // Form states (AI Preferences)
  const [aiScoreThreshold, setAiScoreThreshold] = useState(75);
  const [aiFocus, setAiFocus] = useState('skills');
  const [autoOptimize, setAutoOptimize] = useState(true);

  // Form states (Notifications)
  const [notifyJobMatch, setNotifyJobMatch] = useState(true);
  const [notifyAppStatus, setNotifyAppStatus] = useState(true);
  const [notifyRecruiterMessage, setNotifyRecruiterMessage] = useState(true);
  const [notifyInterviewInvitation, setNotifyInterviewInvitation] = useState(true);

  // Fetch candidate profile on mount & handle tab search query
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && ['profile', 'security', 'ai', 'notifications', 'billing'].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }

    const fetchProfileDetails = async () => {
      if (!user?._id) return;
      try {
        setLoading(true);
        const response = await userService.getProfile(user._id);
        if (response.success && response.data) {
          setProfile(response.data);
          setFullname(response.data.fullname || user?.fullname || '');
          setHeadline(response.data.bio || '');
          setLocation(response.data.location || '');
        }
      } catch (err: any) {
        console.error('Error fetching settings profile:', err);
        toast.error('Failed to load profile details');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileDetails();
  }, [user?._id]);

  const handleSaveProfile = async () => {
    if (!user?._id) return;
    try {
      setUpdating(true);
      const payload = {
        fullname,
        bio: headline,
        location
      };
      const response = await userService.updateProfile(user._id, payload);
      if (response.success && response.data) {
        setProfile(response.data);
        toast.success('Profile settings updated successfully!');
      } else {
        toast.error('Failed to save settings updates');
      }
    } catch (error: any) {
      console.error('Error updating profile settings:', error);
      toast.error(error.message || 'Failed to save settings changes');
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveAIPrefs = () => {
    setUpdating(true);
    setTimeout(() => {
      setUpdating(false);
      toast.success('AI matchmaking preferences updated successfully!');
    }, 600);
  };

  const handleSaveNotifications = () => {
    setUpdating(true);
    setTimeout(() => {
      setUpdating(false);
      toast.success('Notification preferences updated successfully!');
    }, 600);
  };

  const handleSaveSecurity = () => {
    setUpdating(true);
    setTimeout(() => {
      setUpdating(false);
      toast.success('Security and privacy preferences updated successfully!');
    }, 600);
  };

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-on-surface-variant font-medium animate-pulse">Loading settings cockpit...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-0 pb-10">
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-4xl font-bold text-on-surface">Settings</h1>
          {updating && (
            <span className="text-[10px] uppercase font-bold tracking-widest text-secondary bg-secondary/10 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" /> Saving...
            </span>
          )}
        </div>
        <p className="text-lg text-on-surface-variant">Manage your account preferences and AI settings.</p>
      </header>

      <div className="flex gap-8 flex-col md:flex-row">
        {/* Settings Navigation (Left Column) */}
        <nav className="w-full md:w-64 flex-shrink-0">
          <ul className="space-y-1">
            <li>
              <button 
                onClick={() => { setActiveTab('profile'); window.history.pushState(null, '', '/candidate/settings?tab=profile'); }}
                className={`w-full text-left block px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'profile' 
                    ? 'bg-surface-container text-primary font-bold border-l-4 border-primary shadow-sm' 
                    : 'text-on-surface-variant hover:bg-surface-container/50 hover:text-on-surface font-medium'
                }`}
              >
                Profile Settings
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setActiveTab('security'); window.history.pushState(null, '', '/candidate/settings?tab=security'); }}
                className={`w-full text-left block px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'security' 
                    ? 'bg-surface-container text-primary font-bold border-l-4 border-primary shadow-sm' 
                    : 'text-on-surface-variant hover:bg-surface-container/50 hover:text-on-surface font-medium'
                }`}
              >
                Account Security & Privacy
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setActiveTab('ai'); window.history.pushState(null, '', '/candidate/settings?tab=ai'); }}
                className={`w-full text-left block px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'ai' 
                    ? 'bg-surface-container text-primary font-bold border-l-4 border-primary shadow-sm' 
                    : 'text-on-surface-variant hover:bg-surface-container/50 hover:text-on-surface font-medium'
                }`}
              >
                AI Preferences
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setActiveTab('notifications'); window.history.pushState(null, '', '/candidate/settings?tab=notifications'); }}
                className={`w-full text-left block px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'notifications' 
                    ? 'bg-surface-container text-primary font-bold border-l-4 border-primary shadow-sm' 
                    : 'text-on-surface-variant hover:bg-surface-container/50 hover:text-on-surface font-medium'
                }`}
              >
                Notifications
              </button>
            </li>
            <li>
              <button 
                onClick={() => { setActiveTab('billing'); window.history.pushState(null, '', '/candidate/settings?tab=billing'); }}
                className={`w-full text-left block px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === 'billing' 
                    ? 'bg-surface-container text-primary font-bold border-l-4 border-primary shadow-sm' 
                    : 'text-on-surface-variant hover:bg-surface-container/50 hover:text-on-surface font-medium'
                }`}
              >
                Subscription & Billing
              </button>
            </li>
          </ul>
        </nav>

        {/* Settings Content (Right Column) */}
        <div className="flex-1">

          {/* TAB 1: Profile Settings */}
          {activeTab === 'profile' && (
            <section className="glass-card rounded-2xl p-8 border border-white/10 dark:border-white/5 shadow-sm space-y-6 animate-fadeIn">
              <div className="mb-6 border-b border-outline-variant/20 pb-4">
                <h2 className="text-3xl font-bold text-on-surface">Profile Settings</h2>
                <p className="text-base text-on-surface-variant mt-2">Update your personal information and professional details.</p>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface-container-lowest shadow-md relative group bg-surface-container flex items-center justify-center">
                    {profile?.profilePhoto ? (
                      <img
                        alt="Current Profile Photo"
                        className="w-full h-full object-cover"
                        src={profile.profilePhoto}
                      />
                    ) : (
                      <span className="text-4xl font-bold text-primary">
                        {fullname?.[0] || 'U'}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="text-white w-6 h-6" />
                    </div>
                  </div>
                  <button className="text-sm font-bold text-primary hover:text-primary-container transition-colors">Change Photo</button>
                </div>

                <div className="flex-1 space-y-6 w-full">
                  <div className="space-y-2">
                    <label className="text-[12px] uppercase font-bold tracking-widest text-on-surface-variant">Full Name</label>
                    <input
                      className="w-full bg-transparent border-b border-outline-variant/50 focus:border-primary px-0 py-2 text-base text-on-surface border-t-0 border-l-0 border-r-0 focus:ring-0 transition-colors"
                      type="text"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] uppercase font-bold tracking-widest text-on-surface-variant">Professional Headline</label>
                    <input
                      className="w-full bg-transparent border-b border-outline-variant/50 focus:border-primary px-0 py-2 text-base text-on-surface border-t-0 border-l-0 border-r-0 focus:ring-0 transition-colors"
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder="e.g. Senior UX Designer | AI Enthusiast"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[12px] uppercase font-bold tracking-widest text-on-surface-variant">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                      <input
                        className="w-full bg-transparent border-b border-outline-variant/50 focus:border-primary pl-8 py-2 text-base text-on-surface border-t-0 border-l-0 border-r-0 focus:ring-0 transition-colors"
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. San Francisco, CA"
                      />
                    </div>
                  </div>

                  {/* Password Section */}
                  <div className="pt-6 border-t border-outline-variant/15 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-on-surface">Change Account Password</h3>
                      <p className="text-sm text-on-surface-variant mt-1">If you want to update or reset your login credentials, you can securely change your password via our recovery flow.</p>
                    </div>
                    <Link 
                      href="/forgot-password"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-container-highest hover:bg-outline/25 text-on-surface text-sm font-bold rounded-xl transition-all border border-outline-variant/30 cursor-pointer"
                    >
                      <Key className="w-4 h-4 text-primary" /> Change Password
                    </Link>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button 
                      onClick={handleSaveProfile}
                      disabled={updating}
                      className="px-8 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
                    >
                      {updating ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* TAB 2: Account Security & Privacy */}
          {activeTab === 'security' && (
            <section className="glass-card rounded-2xl p-8 border border-white/10 dark:border-white/5 shadow-sm space-y-8 animate-fadeIn" id="security">
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
                  <Link 
                    href="/forgot-password"
                    className="px-5 py-2.5 bg-surface-container-highest text-on-surface text-sm font-bold rounded-xl hover:bg-surface-container-highest/80 transition-all border border-outline-variant/30 flex items-center gap-2 cursor-pointer"
                  >
                    <Key className="w-4 h-4 text-primary" /> Change Password
                  </Link>
                </div>

                {/* Two-Factor Authentication */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/10 pb-6">
                  <div>
                    <h3 className="text-lg font-bold text-on-surface">Two-Factor Authentication (2FA)</h3>
                    <p className="text-sm text-on-surface-variant max-w-md">Add an extra layer of security to your account by requiring a code from your mobile device.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] uppercase font-bold tracking-widest text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">Enabled</span>
                    <button className="px-5 py-2.5 bg-surface-container-lowest text-primary text-sm font-bold rounded-xl hover:bg-primary/10 transition-all border border-primary/30 cursor-pointer">
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
                      <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <button 
                    onClick={handleSaveSecurity}
                    className="px-8 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 hover:shadow-md transition-all cursor-pointer"
                  >
                    Save Security Settings
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* TAB 3: AI Preferences */}
          {activeTab === 'ai' && (
            <section className="glass-card rounded-2xl p-8 border border-white/10 dark:border-white/5 shadow-sm space-y-8 animate-fadeIn">
              <div className="mb-6 border-b border-outline-variant/20 pb-4">
                <h2 className="text-3xl font-bold text-on-surface flex items-center gap-3">
                  <BrainCircuit className="w-8 h-8 text-primary" />
                  AI Preferences
                </h2>
                <p className="text-base text-on-surface-variant mt-2">Tailor the JobFit AI recommendation algorithms to your career goals.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[12px] uppercase font-bold tracking-widest text-on-surface-variant">Match Score Threshold</label>
                    <span className="text-sm font-bold text-primary">{aiScoreThreshold}% Score</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={aiScoreThreshold}
                    onChange={(e) => setAiScoreThreshold(Number(e.target.value))}
                    className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <p className="text-xs text-on-surface-variant mt-1">Only show job openings that match your profile at or above this score threshold.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[12px] uppercase font-bold tracking-widest text-on-surface-variant font-medium">Resume Analysis Focus</label>
                  <select
                    value={aiFocus}
                    onChange={(e) => setAiFocus(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant/30 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary text-on-surface"
                  >
                    <option value="skills">Technical Skill Coverage & Match</option>
                    <option value="experience">STAR Format Projects & Scope</option>
                    <option value="leadership">Leadership & Domain Impact</option>
                  </select>
                  <p className="text-xs text-on-surface-variant mt-1">Select the key resume facet our AI optimizer should prioritize during optimization.</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-surface-container/20 rounded-xl border border-outline-variant/10">
                  <div>
                    <h4 className="text-sm font-bold text-on-surface">Auto-Suggest Cover Letters</h4>
                    <p className="text-xs text-on-surface-variant mt-1">Allow JobFit AI to instantly draft high-relevance cover letters upon matching job postings.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={autoOptimize} 
                      onChange={(e) => setAutoOptimize(e.target.checked)} 
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    onClick={handleSaveAIPrefs}
                    className="px-8 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 hover:shadow-md transition-all cursor-pointer"
                  >
                    Save AI Preferences
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* TAB 4: Notifications */}
          {activeTab === 'notifications' && (
            <section className="glass-card rounded-2xl p-8 border border-white/10 dark:border-white/5 shadow-sm space-y-8 animate-fadeIn">
              <div className="mb-6 border-b border-outline-variant/20 pb-4">
                <h2 className="text-3xl font-bold text-on-surface flex items-center gap-3">
                  <Bell className="w-8 h-8 text-primary" />
                  Notifications
                </h2>
                <p className="text-base text-on-surface-variant mt-2">Control what updates you receive and how they are delivered.</p>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider text-primary border-b border-outline-variant/15 pb-2">Email Notifications</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-on-surface">New High-Match Job Openings</h4>
                      <p className="text-xs text-on-surface-variant mt-0.5">Daily digest email when jobs matching &gt;80% are found.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifyJobMatch} 
                        onChange={(e) => setNotifyJobMatch(e.target.checked)} 
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-on-surface">Application Status Alerts</h4>
                      <p className="text-xs text-on-surface-variant mt-0.5">Receive immediate notification updates when an application is reviewed or updated.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifyAppStatus} 
                        onChange={(e) => setNotifyAppStatus(e.target.checked)} 
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-on-surface">Recruiter Message Notifications</h4>
                      <p className="text-xs text-on-surface-variant mt-0.5">Get email alerts when a recruiter sends you a direct message or invitation.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifyRecruiterMessage} 
                        onChange={(e) => setNotifyRecruiterMessage(e.target.checked)} 
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-on-surface uppercase tracking-wider text-primary border-t border-b border-outline-variant/15 pt-6 pb-2">Browser Alerts</h3>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-on-surface">Interview Invitations & Reminders</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5">Receive browser alerts for scheduled live or mock interviews.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={notifyInterviewInvitation} 
                      onChange={(e) => setNotifyInterviewInvitation(e.target.checked)} 
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    onClick={handleSaveNotifications}
                    className="px-8 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 hover:shadow-md transition-all cursor-pointer"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* TAB 5: Subscription & Billing */}
          {activeTab === 'billing' && (
            <section className="glass-card rounded-2xl p-8 border border-white/10 dark:border-white/5 shadow-sm space-y-8 animate-fadeIn">
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
                        <Zap className="w-3 h-3 animate-pulse" /> Active
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
                    <button className="w-full px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-all shadow-md cursor-pointer">
                      Upgrade Plan
                    </button>
                    <button className="w-full px-5 py-2.5 bg-surface-container-lowest text-error text-sm font-bold rounded-xl hover:bg-error/10 transition-all border border-error/20 cursor-pointer">
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
                  <button className="text-sm font-bold text-primary hover:underline cursor-pointer">Edit</button>
                </div>
                
                <button className="text-sm font-bold text-on-surface flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
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
                        <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors cursor-pointer">
                          <Receipt className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  );
};

export default SettingsView;
