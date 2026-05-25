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
  X,
  Plus,
  Briefcase,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { companyService } from '@/lib/services/company.services';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import { cn } from '@/utils/cn';

const CompanyProfileView = () => {
  const { user, updateUser } = useAuth();
  
  // State variables for workspaces
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);

  // State variables for form inputs
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
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSwitchingWorkspace, setIsSwitchingWorkspace] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch company details on mount
  const fetchCompanyData = async (selectCompanyId?: string) => {
    try {
      setIsLoading(true);
      const response = await companyService.getCompanies();
      if (response.success && response.data) {
        setCompanies(response.data);
        if (response.data.length > 0) {
          // Select: 1. Specified id, 2. Active company, 3. First company
          let target = response.data[0];
          if (selectCompanyId) {
            target = response.data.find(c => c._id === selectCompanyId) || response.data[0];
          } else if (user?.companyId) {
            target = response.data.find(c => c._id === user.companyId) || response.data[0];
          }
          
          setSelectedCompany(target);
          populateForm(target);
          setIsRegisterMode(false);
          setIsEditing(false);
        } else {
          setIsRegisterMode(true);
          setIsEditing(true);
          clearForm();
        }
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

  const populateForm = (company: any) => {
    setName(company.name || '');
    setWebsite(company.website || '');
    setLocation(company.location || '');
    setIndustry(company.industry || 'Artificial Intelligence');
    setDescription(company.description || '');
    setLogoUrl(company.logo || '');
    setOriginalData(company);
  };

  const clearForm = () => {
    setName('');
    setWebsite('');
    setLocation('');
    setIndustry('Artificial Intelligence');
    setDescription('');
    setLogoUrl('');
    setOriginalData(null);
  };

  const handleSelectCompany = (company: any) => {
    setSelectedCompany(company);
    populateForm(company);
    setIsRegisterMode(false);
    setIsEditing(false);
  };

  const handleAddNewWorkspaceClick = () => {
    setIsRegisterMode(true);
    setIsEditing(true);
    setSelectedCompany(null);
    clearForm();
  };

  const handleSwitchWorkspace = async (companyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsSwitchingWorkspace(companyId);
      const response = await companyService.switchCompany(companyId);
      if (response.success && response.data) {
        toast.success(`Switched active workspace to ${response.data.company.name}`);
        updateUser({ companyId: response.data.company._id });
        
        // Re-fetch company data to update UI highlights
        await fetchCompanyData(companyId);
        
        // Force refresh to reload all recruiter data metrics in dashboard
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        toast.error(response.message || 'Failed to switch workspace');
      }
    } catch (err) {
      console.error('Error switching workspace:', err);
      toast.error('Error switching workspace context');
    } finally {
      setIsSwitchingWorkspace(null);
    }
  };

  // Reset form to original fetched values
  const handleCancelEdit = () => {
    if (isRegisterMode) {
      if (companies.length > 0) {
        // Return to viewing active/first company
        const target = companies.find(c => c._id === user?.companyId) || companies[0];
        handleSelectCompany(target);
      } else {
        toast.error('Register at least one workspace to continue.');
      }
    } else {
      if (originalData) {
        populateForm(originalData);
      }
      setIsEditing(false);
      toast.success('Changes discarded');
    }
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
      const payload = { name, website, location, industry, description };
      if (isRegisterMode) {
        // Register new company
        const response = await companyService.registerCompany(payload);
        
        if (response.success && response.data) {
          const registered = response.data;
          
          // Update local authentication context
          updateUser({ 
            hasCompanyProfile: true, 
            companyId: registered._id 
          });

          toast.success('Company workspace registered successfully!');
          
          await fetchCompanyData(registered._id);
          
          setTimeout(() => {
            window.location.reload();
          }, 800);
        } else {
          toast.error(response.message || 'Failed to register company');
        }
      } else if (selectedCompany) {
        // Update existing company profile details
        const response = await companyService.updateCompany(selectedCompany._id, payload);
        
        if (response.success && response.data) {
          const updated = response.data;
          toast.success('Company settings updated successfully!');
          await fetchCompanyData(updated._id);
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

    if (isRegisterMode || !selectedCompany) {
      toast.error('Please register your company details first before uploading a logo.');
      return;
    }

    try {
      setIsUploadingLogo(true);
      const formData = new FormData();
      formData.append('logo', file);

      const response = await companyService.updateCompany(selectedCompany._id, formData);
      if (response.success && response.data) {
        const updated = response.data;
        setLogoUrl(updated.logo || '');
        toast.success('Company logo uploaded successfully!');
        await fetchCompanyData(updated._id);
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
        <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest animate-pulse">Loading Workspace Management...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight mb-2">Workspace Settings</h1>
          <p className="text-on-surface-variant font-medium">
            Manage your company workspaces, switch contexts, or add new corporate entities under your recruiter account.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Workspaces Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/10 pb-3">
              <span className="text-[10px] font-black text-on-surface uppercase tracking-[0.2em] flex items-center gap-1.5">
                <Layers size={14} className="text-primary" /> Owned Workspaces ({companies.length})
              </span>
            </div>

            <div className="space-y-3">
              {companies.map((company) => {
                const isActiveWorkspace = user?.companyId === company._id;
                const isSelected = selectedCompany?._id === company._id && !isRegisterMode;
                return (
                  <div
                    key={company._id}
                    onClick={() => handleSelectCompany(company)}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group",
                      isSelected 
                        ? "bg-primary/5 border-primary shadow-sm" 
                        : "border-outline-variant/30 bg-surface-container/30 hover:bg-surface-container/80"
                    )}
                  >
                    <div className="flex items-center gap-3 truncate">
                      {company.logo ? (
                        <img src={company.logo} alt={company.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-black text-lg text-white shrink-0">
                          {company.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="truncate">
                        <h4 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                          {company.name}
                        </h4>
                        <p className="text-[10px] text-on-surface-variant font-medium truncate">
                          {company.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isActiveWorkspace ? (
                        <span className="text-[8px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                          Active
                        </span>
                      ) : (
                        <button
                          onClick={(e) => handleSwitchWorkspace(company._id, e)}
                          disabled={isSwitchingWorkspace !== null}
                          className="text-[8px] font-black uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded-md hover:bg-primary hover:text-white transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1"
                        >
                          {isSwitchingWorkspace === company._id ? (
                            <Loader2 size={8} className="animate-spin" />
                          ) : (
                            'Switch'
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              <button
                onClick={handleAddNewWorkspaceClick}
                className={cn(
                  "w-full flex items-center justify-center gap-2 p-4 border border-dashed rounded-2xl transition-all cursor-pointer text-xs font-black uppercase tracking-widest",
                  isRegisterMode 
                    ? "border-primary bg-primary/5 text-primary" 
                    : "border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary"
                )}
              >
                <Plus size={14} /> Add Company Profile
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Info Form */}
        <div className="lg:col-span-8 space-y-6">
          {/* Editor Header Card */}
          <div className="glass-card rounded-3xl p-8 border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="relative inline-block group">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleLogoUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <div 
                  onClick={() => isEditing && !isRegisterMode && fileInputRef.current?.click()}
                  className={cn(
                    "w-20 h-20 rounded-2xl bg-surface-container flex items-center justify-center border-2 border-dashed transition-all overflow-hidden relative",
                    isRegisterMode || !isEditing
                      ? 'border-outline-variant/30 cursor-not-allowed opacity-80' 
                      : 'border-outline-variant hover:border-primary cursor-pointer'
                  )}
                >
                  {isUploadingLogo ? (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white gap-2">
                      <Loader2 size={16} className="animate-spin text-primary" />
                    </div>
                  ) : logoUrl ? (
                    <img 
                      src={logoUrl} 
                      alt={`${name || 'Company'} Logo`} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-black text-2xl text-white">
                      {name ? name.charAt(0).toUpperCase() : <Building size={24} />}
                    </div>
                  )}
                  
                  {isEditing && !isRegisterMode && !isUploadingLogo && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1">
                      <Upload size={14} />
                      <span className="text-[7px] font-black uppercase tracking-widest">Update Logo</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-on-surface mb-1">
                  {isRegisterMode ? 'New Workspace Registration' : (name || 'Workspace Profile')}
                </h3>
                <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest italic">
                  {isRegisterMode ? 'Define brand details' : (location || 'Location Not Specified')}
                </p>
              </div>
            </div>

            {!isRegisterMode && website && (
              <a 
                href={website.startsWith('http') ? website : `https://${website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-outline-variant/10 flex items-center gap-1.5"
              >
                <Globe size={12} /> Visit Site
              </a>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSaveCompany}>
            <div className="glass-card rounded-3xl p-8 border border-white/10 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {/* Company Name */}
                <div className="space-y-2">
                  <label htmlFor="company-name-input" className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Company Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant/70" size={18} aria-hidden="true" />
                    <input 
                      id="company-name-input"
                      className={cn(
                        "w-full bg-transparent border-b pl-7 py-3 font-medium transition-all focus:outline-none",
                        isEditing 
                          ? 'border-outline-variant focus:border-primary focus:ring-0 text-on-surface' 
                          : 'border-transparent text-on-surface-variant cursor-not-allowed'
                      )} 
                      placeholder="e.g. Acme Corporation"
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
                  <label htmlFor="company-website-input" className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Website URL</label>
                  <div className="relative">
                    <Globe className="absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant/70" size={18} aria-hidden="true" />
                    <input 
                      id="company-website-input"
                      className={cn(
                        "w-full bg-transparent border-b pl-7 py-3 font-medium transition-all focus:outline-none",
                        isEditing 
                          ? 'border-outline-variant focus:border-primary focus:ring-0 text-on-surface' 
                          : 'border-transparent text-on-surface-variant cursor-not-allowed'
                      )} 
                      placeholder="https://acme.org"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      type="url" 
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {/* Headquarters */}
                <div className="space-y-2">
                  <label htmlFor="company-location-input" className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Headquarters</label>
                  <div className="relative">
                    <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant/70" size={18} aria-hidden="true" />
                    <input 
                      id="company-location-input"
                      className={cn(
                        "w-full bg-transparent border-b pl-7 py-3 font-medium transition-all focus:outline-none",
                        isEditing 
                          ? 'border-outline-variant focus:border-primary focus:ring-0 text-on-surface' 
                          : 'border-transparent text-on-surface-variant cursor-not-allowed'
                      )} 
                      placeholder="e.g. Austin, TX"
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
                  <label htmlFor="company-industry-select" className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Industry</label>
                  <select 
                    id="company-industry-select"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    disabled={!isEditing}
                    className={cn(
                      "w-full bg-transparent border-b py-3 font-medium transition-all focus:outline-none",
                      isEditing 
                        ? 'border-outline-variant focus:border-primary focus:ring-0 text-on-surface cursor-pointer' 
                        : 'border-transparent text-on-surface-variant cursor-not-allowed appearance-none'
                    )}
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
                <label htmlFor="company-description-textarea" className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Company Description</label>
                <textarea 
                  id="company-description-textarea"
                  className={cn(
                    "w-full bg-transparent border rounded-2xl p-4 font-medium transition-all resize-none min-h-[120px] focus:outline-none",
                    isEditing 
                      ? 'border-outline-variant/30 focus:border-primary focus:ring-0 text-on-surface' 
                      : 'border-transparent bg-surface-container/30 text-on-surface-variant cursor-not-allowed'
                  )}
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
                    <div key="register-actions" className="flex items-center gap-3">
                      {companies.length > 0 && (
                        <button 
                          type="button"
                          onClick={handleCancelEdit}
                          disabled={isUpdating}
                          className="px-6 py-3.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                        >
                          <X size={12} /> Cancel
                        </button>
                      )}

                      <button 
                        type="submit"
                        disabled={isUpdating}
                        className="gradient-button text-white font-black text-[10px] uppercase tracking-widest px-8 py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 size={12} className="animate-spin" /> Registering...
                          </>
                        ) : (
                          'Register Workspace'
                        )}
                      </button>
                    </div>
                  ) : !isEditing ? (
                    <button 
                      key="edit-btn"
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-3.5 bg-primary hover:bg-primary/95 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-md shadow-primary/10 flex items-center gap-2 cursor-pointer"
                    >
                      <Pencil size={12} /> Edit Workspace Profile
                    </button>
                  ) : (
                    <div key="edit-actions" className="flex items-center gap-3">
                      <button 
                        type="button"
                        onClick={handleCancelEdit}
                        disabled={isUpdating}
                        className="px-6 py-3.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <X size={12} /> Cancel
                      </button>

                      <button 
                        type="submit"
                        disabled={isUpdating}
                        className="gradient-button text-white font-black text-[10px] uppercase tracking-widest px-8 py-3.5 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 size={12} className="animate-spin" /> Saving...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfileView;
