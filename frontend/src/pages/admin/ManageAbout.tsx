import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Save, 
  Plus, 
  Trash2, 
  BookOpen, 
  Briefcase, 
  Target, 
  GraduationCap, 
  CheckCircle2, 
  Award, 
  Languages, 
  Heart,
  X,
  Image as ImageIcon,
  History
} from 'lucide-react';
import api, { BASE_URL } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';

const ManageAbout = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: aboutData, isLoading } = useQuery(['about'], async () => {
    const { data } = await api.get('/about');
    return data;
  });

  useEffect(() => {
    if (aboutData) {
      setFormData({
        title: aboutData.title || '',
        subtitle: aboutData.subtitle || '',
        biography: aboutData.biography || '',
        aboutImage: aboutData.aboutImage || '',
        goals: aboutData.goals || '',
        education: aboutData.education || [],
        experience: aboutData.experience || [],
        interests: aboutData.interests || [],
        certifications: aboutData.certifications || [],
        languages: aboutData.languages || [],
        achievements: aboutData.achievements || []
      });
    } else {
      setFormData({
        title: '',
        subtitle: '',
        biography: '',
        aboutImage: '',
        goals: '',
        education: [],
        experience: [],
        interests: [],
        certifications: [],
        languages: [],
        achievements: []
      });
    }
  }, [aboutData]);

  const saveMutation = useMutation(
    (data: any) => api.put('/about', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['about']);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      },
    }
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    const uploadData = new FormData();
    uploadData.append('image', file);

    setUploading(true);
    try {
      const { data } = await api.post('/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ ...formData, aboutImage: data.url });
    } catch (error) {
      console.error('Upload failed', error);
    } finally {
      setUploading(false);
    }
  };

  const addItem = (field: string, template: any) => {
    setFormData({ ...formData, [field]: [...formData[field], template] });
  };

  const removeItem = (field: string, index: number) => {
    const newList = formData[field].filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, [field]: newList });
  };

  const updateNestedList = (field: string, index: number, subField: string, value: string) => {
    const newList = [...formData[field]];
    newList[index][subField] = value;
    setFormData({ ...formData, [field]: newList });
  };

  // Helper to get correct image URL
  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${BASE_URL}${path}`;
  };

  if (isLoading || !formData) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-primary to-gray-500 bg-clip-text text-transparent">
            Manage Professional Bio
          </h1>
          <p className="text-gray-400 mt-2">Update your journey, skills, and certifications.</p>
        </div>
        
        <button 
          onClick={() => saveMutation.mutate(formData)}
          disabled={saveMutation.isLoading}
          className="flex items-center gap-2 px-8 py-3 bg-primary text-black font-bold rounded-2xl hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all disabled:opacity-50"
        >
          {saveMutation.isLoading ? (
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <><Save size={20} /> Publish Profile</>
          )}
        </button>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 p-4 bg-secondary-success/20 border border-secondary-success/30 rounded-2xl flex items-center gap-3 text-secondary-success"
          >
            <CheckCircle2 size={20} />
            <span className="font-semibold">Profile updated successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-10">
        {/* Header Section */}
        <div className="glass-dark p-8 rounded-3xl border border-white/5 shadow-2xl space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-3 text-white">
            <ImageIcon size={22} className="text-primary" /> Profile Header
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2 block">Display Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50"
                  placeholder="e.g. About Esron"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2 block">Subtitle</label>
                <input 
                  type="text" 
                  value={formData.subtitle}
                  onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50"
                  placeholder="e.g. My Professional Journey"
                />
              </div>
            </div>
            
            <div className="relative group">
              <label className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2 block">About Image</label>
              <div className="aspect-video bg-black/40 rounded-2xl border-2 border-dashed border-white/10 overflow-hidden relative">
                {formData.aboutImage ? (
                  <img src={getImageUrl(formData.aboutImage)} alt="About" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <ImageIcon size={40} className="mb-2" />
                    <p className="text-sm">Click to upload image</p>
                  </div>
                )}
                <input 
                  type="file" 
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {uploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Biography & Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-dark p-8 rounded-3xl border border-white/5 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
              <BookOpen size={22} className="text-primary" /> Biography
            </h2>
            <textarea 
              rows={8}
              value={formData.biography}
              onChange={(e) => setFormData({...formData, biography: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-primary/50 transition-all text-gray-300 resize-none"
              placeholder="Tell your story..."
            ></textarea>
          </div>
          <div className="glass-dark p-8 rounded-3xl border border-white/5 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
              <Target size={22} className="text-primary" /> Career Goals
            </h2>
            <textarea 
              rows={8}
              value={formData.goals}
              onChange={(e) => setFormData({...formData, goals: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-primary/50 transition-all text-gray-300 resize-none"
              placeholder="What are your future aspirations?"
            ></textarea>
          </div>
        </div>

        {/* Experience Section */}
        <div className="glass-dark p-8 rounded-3xl border border-white/5 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold flex items-center gap-3 text-white">
              <Briefcase size={22} className="text-primary" /> Experience
            </h2>
            <button 
              onClick={() => addItem('experience', { company: '', position: '', duration: '', description: '' })}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <Plus size={16} /> Add Experience
            </button>
          </div>
          <div className="space-y-6">
            {formData.experience.map((exp: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 rounded-2xl border border-white/5 relative group">
                <button onClick={() => removeItem('experience', index)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <input placeholder="Company" value={exp.company} onChange={(e) => updateNestedList('experience', index, 'company', e.target.value)} className="bg-black/20 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-primary" />
                  <input placeholder="Position" value={exp.position} onChange={(e) => updateNestedList('experience', index, 'position', e.target.value)} className="bg-black/20 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-primary" />
                  <input placeholder="Duration" value={exp.duration} onChange={(e) => updateNestedList('experience', index, 'duration', e.target.value)} className="bg-black/20 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-primary" />
                </div>
                <textarea placeholder="Description" value={exp.description} onChange={(e) => updateNestedList('experience', index, 'description', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 h-24 outline-none focus:border-primary resize-none" />
              </div>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div className="glass-dark p-8 rounded-3xl border border-white/5 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold flex items-center gap-3 text-white">
              <GraduationCap size={22} className="text-primary" /> Education
            </h2>
            <button 
              onClick={() => addItem('education', { institution: '', degree: '', year: '', description: '' })}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <Plus size={16} /> Add Education
            </button>
          </div>
          <div className="space-y-6">
            {formData.education.map((edu: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 rounded-2xl border border-white/5 relative group">
                <button onClick={() => removeItem('education', index)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <input placeholder="Institution" value={edu.institution} onChange={(e) => updateNestedList('education', index, 'institution', e.target.value)} className="bg-black/20 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-primary" />
                  <input placeholder="Degree" value={edu.degree} onChange={(e) => updateNestedList('education', index, 'degree', e.target.value)} className="bg-black/20 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-primary" />
                  <input placeholder="Year" value={edu.year} onChange={(e) => updateNestedList('education', index, 'year', e.target.value)} className="bg-black/20 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-primary" />
                </div>
                <textarea placeholder="Description" value={edu.description} onChange={(e) => updateNestedList('education', index, 'description', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 h-24 outline-none focus:border-primary resize-none" />
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="glass-dark p-8 rounded-3xl border border-white/5 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold flex items-center gap-3 text-white">
              <Award size={22} className="text-primary" /> Key Achievements
            </h2>
            <button 
              onClick={() => addItem('achievements', { title: '', year: '', description: '' })}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <Plus size={16} /> Add Achievement
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formData.achievements.map((ach: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 rounded-2xl border border-white/5 relative group">
                <button onClick={() => removeItem('achievements', index)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <input placeholder="Title" value={ach.title} onChange={(e) => updateNestedList('achievements', index, 'title', e.target.value)} className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-primary" />
                    <input placeholder="Year" value={ach.year} onChange={(e) => updateNestedList('achievements', index, 'year', e.target.value)} className="w-24 bg-black/20 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-primary" />
                  </div>
                  <textarea placeholder="Description" value={ach.description} onChange={(e) => updateNestedList('achievements', index, 'description', e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 h-20 outline-none focus:border-primary resize-none" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Languages */}
          <div className="glass-dark p-8 rounded-3xl border border-white/5 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-3 text-white">
                <Languages size={22} className="text-primary" /> Languages
              </h2>
              <button onClick={() => addItem('languages', { name: '', proficiency: '' })} className="p-2 bg-white/5 rounded-xl hover:bg-white/10"><Plus size={18} /></button>
            </div>
            <div className="space-y-4">
              {formData.languages.map((lang: any, index: number) => (
                <div key={index} className="flex gap-3 items-center group">
                  <input placeholder="Language" value={lang.name} onChange={(e) => updateNestedList('languages', index, 'name', e.target.value)} className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-primary" />
                  <select value={lang.proficiency} onChange={(e) => updateNestedList('languages', index, 'proficiency', e.target.value)} className="bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-gray-400 outline-none focus:border-primary">
                    <option value="">Level</option>
                    <option value="Native">Native</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Basic">Basic</option>
                  </select>
                  <button onClick={() => removeItem('languages', index)} className="text-gray-600 hover:text-red-500"><X size={18} /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="glass-dark p-8 rounded-3xl border border-white/5 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-3 text-white">
                <Heart size={22} className="text-primary" /> Interests
              </h2>
              <button onClick={() => setFormData({...formData, interests: [...formData.interests, '']})} className="p-2 bg-white/5 rounded-xl hover:bg-white/10"><Plus size={18} /></button>
            </div>
            <div className="flex flex-wrap gap-3">
              {formData.interests.map((interest: string, index: number) => (
                <div key={index} className="flex items-center gap-2 bg-black/20 border border-white/10 rounded-full px-4 py-2 group">
                  <input value={interest} onChange={(e) => {
                    const newInterests = [...formData.interests];
                    newInterests[index] = e.target.value;
                    setFormData({...formData, interests: newInterests});
                  }} className="bg-transparent border-none outline-none w-24 text-sm" placeholder="Interest" />
                  <button onClick={() => removeItem('interests', index)} className="text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100"><X size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAbout;
