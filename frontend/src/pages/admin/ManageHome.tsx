import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Save, 
  Image as ImageIcon, 
  Plus, 
  X, 
  Sparkles, 
  CheckCircle2, 
  BarChart3, 
  Share2,
  Upload,
  Terminal
} from 'lucide-react';
import api from '../../services/api';
import { getAssetUrl } from '../../utils/url';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

const ManageHome = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<any>({
    title: '',
    subtitle: '',
    description: '',
    profileImage: '',
    roles: [''],
    statistics: [],
    socialLinks: []
  });

  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: homeData, isLoading } = useQuery(['home'], async () => {
    const { data } = await api.get('/home');
    return data;
  });

  useEffect(() => {
    if (homeData) {
      setFormData({
        title: homeData.title || '',
        subtitle: homeData.subtitle || '',
        description: homeData.description || '',
        profileImage: homeData.profileImage || '',
        roles: homeData.roles && homeData.roles.length > 0 ? homeData.roles : [''],
        statistics: homeData.statistics || [],
        socialLinks: homeData.socialLinks || []
      });
    }
  }, [homeData]);

  const saveMutation = useMutation(
    (data: any) => api.put('/home', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['home']);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      },
       onError: (error) => {
        console.error('Save failed:', error);
      }
    }
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    setIsUploading(true);
    try {
      const { data } = await api.post('/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData({ ...formData, profileImage: data.url });
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const updateList = (field: string, index: number, subField: string, value: string) => {
    const newList = [...formData[field]];
    newList[index][subField] = value;
    setFormData({ ...formData, [field]: newList });
  };

  const updateRole = (index: number, value: string) => {
    const newRoles = [...formData.roles];
    newRoles[index] = value;
    setFormData({ ...formData, roles: newRoles });
  };

  const addItem = (field: string, template: any) => {
    setFormData({ ...formData, [field]: [...(formData[field] || []), template] });
  };

  const removeItem = (field: string, index: number) => {
    const newList = formData[field].filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, [field]: newList });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Manage Hero Section
          </h1>
          <p className="text-gray-400 mt-2">Craft the perfect landing experience for your visitors.</p>
        </div>

        <button
          onClick={() => saveMutation.mutate(formData)}
          disabled={saveMutation.isLoading || isUploading}
          className="flex items-center gap-2 px-8 py-3 bg-primary text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all disabled:opacity-50"
        >
          {saveMutation.isLoading ? (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <><Save size={20} /> Save Changes</>
          )}
        </button>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 p-4 bg-secondary-success/20 border border-secondary-success/30 rounded-xl flex items-center gap-3 text-secondary-success"
          >
            <CheckCircle2 size={20} />
            <span className="font-medium">Home page configuration updated successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="glass-dark p-8 rounded-3xl border border-white/5 shadow-2xl">
            <div className="flex items-center gap-3 mb-8 text-primary font-semibold uppercase tracking-wider text-sm">
              <Sparkles size={18} />
              <span>Primary Content</span>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Main Title</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-primary/50 transition-all text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Hero Description</label>
                <textarea
                  rows={4}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-primary/50 transition-all text-white resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="glass-dark p-8 rounded-3xl border border-white/5 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3 text-primary font-semibold uppercase tracking-wider text-sm">
                <Terminal size={18} />
                <span>Professional Roles (Typewriter)</span>
              </div>
              <button onClick={() => setFormData({...formData, roles: [...formData.roles, '']})} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                <Plus size={14} /> Add Role
              </button>
            </div>
            <div className="space-y-4">
              {formData.roles.map((role: string, index: number) => (
                <div key={index} className="flex gap-3 bg-white/5 p-4 rounded-2xl border border-white/5 items-center group">
                  <Terminal size={16} className="text-gray-600" />
                  <input type="text" value={role} onChange={(e) => updateRole(index, e.target.value)} className="flex-1 bg-transparent border-none outline-none text-gray-300" />
                  <button onClick={() => removeItem('roles', index)} className="p-2 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100"><X size={18} /></button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-dark p-8 rounded-3xl border border-white/5 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3 text-primary font-semibold uppercase tracking-wider text-sm">
                <BarChart3 size={18} />
                <span>Impact Statistics</span>
              </div>
              <button onClick={() => addItem('statistics', { label: '', value: '' })} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                <Plus size={14} /> Add Counter
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.statistics && formData.statistics.map((stat: any, index: number) => (
                <div key={index} className="flex gap-3 bg-white/5 p-4 rounded-2xl border border-white/5 items-center group">
                  <div className="flex-1 space-y-3">
                    <input type="text" value={stat.value || ''} placeholder="Value" onChange={(e) => updateList('statistics', index, 'value', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-1 text-sm outline-none focus:border-primary/50" />
                    <input type="text" value={stat.label || ''} placeholder="Label" onChange={(e) => updateList('statistics', index, 'label', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-1 text-xs outline-none focus:border-primary/50 text-gray-400" />
                  </div>
                  <button onClick={() => removeItem('statistics', index)} className="p-2 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100"><X size={18} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="glass-dark p-6 rounded-3xl border border-white/5 shadow-2xl">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Profile Identity</label>
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 mb-4 bg-white/5 group">
              <img
                src={getAssetUrl(formData.profileImage, 'https://via.placeholder.com/300')}
                alt="Identity"
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/300')}
              />
              <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <Upload className="text-primary" size={32} />
                <span className="text-white text-xs font-bold uppercase">Change Photo</span>
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
            </div>
          </div>

          <div className="glass-dark p-6 rounded-3xl border border-white/5 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-primary font-semibold uppercase tracking-wider text-[10px]"><Share2 size={14} /><span>Social Links</span></div>
              <button onClick={() => addItem('socialLinks', { platform: '', url: '' })} className="p-1 bg-white/5 rounded-lg hover:bg-white/10"><Plus size={14} /></button>
            </div>
            <div className="space-y-4">
              {formData.socialLinks && formData.socialLinks.map((social: any, index: number) => (
                <div key={index} className="space-y-2 p-3 bg-black/20 rounded-xl border border-white/5 group relative">
                  <input type="text" value={social.platform || ''} placeholder="Platform" onChange={(e) => updateList('socialLinks', index, 'platform', e.target.value)} className="w-full bg-transparent text-xs font-bold text-white border-none outline-none" />
                  <input type="text" value={social.url || ''} placeholder="URL" onChange={(e) => updateList('socialLinks', index, 'url', e.target.value)} className="w-full bg-transparent text-[10px] text-gray-500 border-none outline-none" />
                  <button onClick={() => removeItem('socialLinks', index)} className="absolute top-2 right-2 p-1 text-gray-700 hover:text-red-500 opacity-0 group-hover:opacity-100"><X size={12} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageHome;
