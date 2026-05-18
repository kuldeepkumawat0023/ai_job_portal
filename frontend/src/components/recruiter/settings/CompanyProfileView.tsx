'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  Globe, 
  MapPin, 
  Upload,
  CheckCircle2,
  Loader2,
  Building,
  Pencil,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { companyService } from '@/lib/services/company.services';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';

const CompanyProfileView = () => {
  const { user, updateUser } = useAuth();
  
  // State variables for form inputs
  const [companyId, setCompanyId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [industry, setIndustry] = useState<string>('Artificial Intelligence');
  const [description, setDescription] = useState<string>('');
  const [logoUrl, setLogoUrl] = useState<string>('');
  
  // Backup state to restore on Cancel
  const [originalData, setOriginalData] = useState<any>(null);

  // UI states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState<boolean>(false);
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch company details on mount
  const fetchCompanyData = async () => {
    try {
      setIsLoading(true);
      const response = await companyService.getCompanies();
      if (response.success && response.data && response.data.length > 0) {
        const company = response.data[0]; // Recruiter manages their main company profile
        setCompanyId(company._id);
        setName(company.name || '');
        setWebsite(company.website || '');
        setLocation(company.location || '');
        setIndustry(company.industry || 'Artificial Intelligence');
        setDescription(company.description || '');
        setLogoUrl(company.logo || '');
        setOriginalData(company);
        setIsRegisterMode(false);
        setIsEditing(false);
      } else {
        setIsRegisterMode(true);
        setIsEditing(true); // Automatically in edit/register mode if no company exists
      }
    } catch (err: any) {
      console.error('Error loading company profile:', err);
      toast.error('Failed to load company details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, []);

  // Reset form to original fetched values
  const handleCancelEdit = () => {
    if (originalData) {
      setName(originalData.name || '');
      setWebsite(originalData.website || '');
      setLocation(originalData.location || '');
      setIndustry(originalData.industry || 'Artificial Intelligence');
      setDescription(originalData.description || '');
      setLogoUrl(originalData.logo || '');
    }
    setIsEditing(false);
    toast.success('Changes discarded');
  };

  // Handler to register or update company
  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location) {
      toast.error('Company Name and Headquarters Location are required');
      return;
    }

    try {
      setIsUpdating(true);
      if (isRegisterMode) {
        // Register new company
        const payload = { name, website, location, industry, description };
        const response = await companyService.registerCompany(payload);
        
        if (response.success && response.data) {
          const registered = response.data;
          setCompanyId(registered._id);
          setLogoUrl(registered.logo || '');
          setOriginalData(registered);
          setIsRegisterMode(false);
          setIsEditing(false);
          
          // Update local authentication context
          updateUser({ 
            hasCompanyProfile: true, 
            companyId: registered._id 
          });

          toast.success('Company registered successfully!');
        } else {
          toast.error(response.message || 'Failed to register company');
        }
      } else {
        // Update existing company profile details
        const payload = { name, website, location, industry, description };
        const response = await companyService.updateCompany(companyId, payload);
        
        if (response.success && response.data) {
          const updated = response.data;
          setName(updated.name);
          setWebsite(updated.website);
          setLocation(updated.location);
          setIndustry(updated.industry || 'Artificial Intelligence');
          setDescription(updated.description || '');
          setLogoUrl(updated.logo || '');
          setOriginalData(updated);
          setIsEditing(false);
          
          toast.success('Company settings updated successfully!');
        } else {
          toast.error(response.message || 'Failed to save changes');
        }
      }
    } catch (err: any) {
      console.error('Error saving company profile:', err);
      toast.error(err.response?.data?.message || 'Error occurred while saving profile');
    } finally {
      setIsUpdating(false);
    }
  };

  // Upload/Change company logo to Cloudinary
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isRegisterMode) {
      toast.error('Please register your company details first before uploading a logo.');
      return;
    }

    try {
      setIsUploadingLogo(true);
      const formData = new FormData();
      formData.append('logo', file);

      const response = await companyService.updateCompany(companyId, formData);
      if (response.success && response.data) {
        const updated = response.data;
        setLogoUrl(updated.logo || '');
        setOriginalData(updated);
        toast.success('Company logo uploaded successfully!');
      } else {
        toast.error('Failed to upload logo');
      }
    } catch (err: any) {
      console.error('Logo upload error:', err);
      toast.error(err.response?.data?.message || 'Failed to update company logo');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest animate-pulse">Loading Workspace Branding...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight mb-2">Company Profile</h1>
          <p className="text-on-surface-variant font-medium">
            {isRegisterMode 
              ? 'Complete company setup to start recruiting candidates and inviting team members.' 
              : 'Manage your public company presence, industry category, and branding.'}
          </p>
        </div>
        {!isRegisterMode && (
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Workspace Configured
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Branding Box */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card rounded-3xl p-8 text-center border border-white/10 flex flex-col items-center justify-center">
            <div className="relative inline-block mb-6 group">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleLogoUpload} 
                accept="image/*" 
                className="hidden" 
              />
              <div 
                onClick={() => isEditing && !isRegisterMode && fileInputRef.current?.click()}
                className={`w-32 h-32 rounded-[2rem] bg-surface-container flex items-center justify-center border-2 border-dashed transition-all overflow-hidden relative ${
                  isRegisterMode || !isEditing
                    ? 'border-outline-variant/30 cursor-not-allowed opacity-80' 
                    : 'border-outline-variant hover:border-primary cursor-pointer'
                }`}
              >
                {isUploadingLogo ? (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white gap-2">
                    <Loader2 size={24} className="animate-spin text-primary" />
                    <span className="text-[8px] font-bold uppercase tracking-wider">Uploading...</span>
                  </div>
                ) : logoUrl ? (
                  <img 
                    src={logoUrl} 
                    alt={`${name || 'Company'} Logo`} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-black text-4xl text-white">
                    {name ? name.charAt(0).toUpperCase() : <Building size={36} />}
                  </div>
                )}
                
                {isEditing && !isRegisterMode && !isUploadingLogo && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2">
                    <Upload size={20} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Update Logo</span>
                  </div>
                )}
              </div>
            </div>

            <h3 className="text-xl font-black text-on-surface mb-1">
              {name || 'Startup Workspace'}
            </h3>
            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest italic mb-6">
              {location || 'Location Not Specified'}
            </p>
            
            <a 
              href={website ? (website.startsWith('http') ? website : `https://${website}`) : '#'}
              target={website ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className={`w-full py-3 text-center rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                !website 
                  ? 'bg-surface-container text-on-surface-variant/40 cursor-not-allowed pointer-events-none' 
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
              }`}
            >
              View Website
            </a>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-white/10">
            <h4 className="text-[10px] font-black text-on-surface uppercase tracking-[0.2em] mb-4">Verification Status</h4>
            {isRegisterMode ? (
              <div className="flex items-center gap-3 p-3 bg-error/10 rounded-2xl border border-error/20 text-error">
                <Building size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Setup Incomplete</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-600">
                <CheckCircle2 size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Fully Verified Entity</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Detailed Info Form */}
        <form onSubmit={handleSaveCompany} className="lg:col-span-8">
          <div className="glass-card rounded-3xl p-8 border border-white/10 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Company Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Company Name</label>
                <div className="relative">
                  <Building2 className="absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant/70" size={18} />
                  <input 
                    className={`w-full bg-transparent border-b pl-7 py-3 font-medium transition-all focus:outline-none ${
                      isEditing 
                        ? 'border-outline-variant focus:border-primary focus:ring-0 text-on-surface' 
                        : 'border-transparent text-on-surface-variant cursor-not-allowed'
                    }`} 
                    placeholder="Enter company name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text" 
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>

              {/* Website URL */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Website URL</label>
                <div className="relative">
                  <Globe className="absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant/70" size={18} />
                  <input 
                    className={`w-full bg-transparent border-b pl-7 py-3 font-medium transition-all focus:outline-none ${
                      isEditing 
                        ? 'border-outline-variant focus:border-primary focus:ring-0 text-on-surface' 
                        : 'border-transparent text-on-surface-variant cursor-not-allowed'
                    }`} 
                    placeholder="https://example.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    type="url" 
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {/* Headquarters */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Headquarters</label>
                <div className="relative">
                  <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant/70" size={18} />
                  <input 
                    className={`w-full bg-transparent border-b pl-7 py-3 font-medium transition-all focus:outline-none ${
                      isEditing 
                        ? 'border-outline-variant focus:border-primary focus:ring-0 text-on-surface' 
                        : 'border-transparent text-on-surface-variant cursor-not-allowed'
                    }`} 
                    placeholder="e.g. San Francisco, CA"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    type="text" 
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>

              {/* Industry Dropdown */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Industry</label>
                <select 
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full bg-transparent border-b py-3 font-medium transition-all focus:outline-none ${
                    isEditing 
                      ? 'border-outline-variant focus:border-primary focus:ring-0 text-on-surface cursor-pointer' 
                      : 'border-transparent text-on-surface-variant cursor-not-allowed appearance-none'
                  }`}
                >
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Fintech">Fintech</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Software Development">Software Development</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Technology">Technology</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Company Description</label>
              <textarea 
                className={`w-full bg-transparent border rounded-2xl p-4 font-medium transition-all resize-none min-h-[120px] focus:outline-none ${
                  isEditing 
                    ? 'border-outline-variant/30 focus:border-primary focus:ring-0 text-on-surface' 
                    : 'border-transparent bg-surface-container/30 text-on-surface-variant cursor-not-allowed'
                }`}
                placeholder="Describe your company, work culture, and domain expertise..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={!isEditing}
              />
            </div>

            {/* Action Buttons Panel */}
            <div className="flex justify-end pt-4 gap-4">
              <AnimatePresence mode="wait">
                {isRegisterMode ? (
                  <motion.button 
                    key="register-btn"
                    type="submit"
                    disabled={isUpdating}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="gradient-button text-white font-black text-[10px] uppercase tracking-widest px-8 py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 size={12} className="animate-spin" /> Saving Workspace...
                      </>
                    ) : (
                      'Register Workspace'
                    )}
                  </motion.button>
                ) : !isEditing ? (
                  <motion.button 
                    key="edit-btn"
                    type="button"
                    onClick={() => setIsEditing(true)}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="px-6 py-3.5 bg-primary hover:bg-primary/95 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-md shadow-primary/10 flex items-center gap-2 cursor-pointer"
                  >
                    <Pencil size={12} /> Edit Profile
                  </motion.button>
                ) : (
                  <div key="edit-actions" className="flex items-center gap-3">
                    <motion.button 
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={isUpdating}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="px-6 py-3.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <X size={12} /> Cancel
                    </motion.button>

                    <motion.button 
                      type="submit"
                      disabled={isUpdating}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="gradient-button text-white font-black text-[10px] uppercase tracking-widest px-8 py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 size={12} className="animate-spin" /> Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </motion.button>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyProfileView;
