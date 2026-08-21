import React, { useState, useRef, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Globe, 
  Github, 
  Save, 
  X, 
  Image as ImageIcon, 
  Upload, 
  RefreshCcw, 
  Sparkles, 
  Search, 
  ExternalLink, 
  Check, 
  Star, 
  Code2, 
  Eye, 
  Layers, 
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { getAssetUrl } from '../../utils/url';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ProjectData } from '../../types';

const DEFAULT_PROJECT_IMAGE = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80';

const PRESET_TECHNOLOGIES = [
  'React',
  'TypeScript',
  'JavaScript',
  'Node.js',
  'Express',
  'MongoDB',
  'Tailwind CSS',
  'Next.js',
  'Python',
  'Docker',
  'Firebase',
  'PostgreSQL',
  'REST API',
  'GraphQL',
  'Figma'
];

const ManageProjects = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Component States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'featured'>('all');
  const [customTechInput, setCustomTechInput] = useState('');

  // Form State
  const [currentProject, setCurrentProject] = useState<Partial<ProjectData>>({
    title: '',
    description: '',
    technologies: [],
    image: '',
    githubLink: '',
    liveDemo: '',
    featured: false
  });

  const { data: projects = [], isLoading } = useQuery<ProjectData[]>(['projects'], async () => {
    const { data } = await api.get('/projects');
    return data;
  });

  const deleteMutation = useMutation(
    (id: string) => api.delete(`/projects/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['projects']);
      },
    }
  );

  const saveMutation = useMutation(
    (project: Partial<ProjectData>) => {
      if (project._id) {
        return api.put(`/projects/${project._id}`, project);
      }
      return api.post('/projects', project);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['projects']);
        setIsModalOpen(false);
        resetForm();
      },
    }
  );

  const resetForm = () => {
    setCurrentProject({
      title: '',
      description: '',
      technologies: [],
      image: '',
      githubLink: '',
      liveDemo: '',
      featured: false
    });
    setCustomTechInput('');
  };

  const handleEdit = (project: ProjectData) => {
    setCurrentProject({
      ...project,
      technologies: Array.isArray(project.technologies) ? [...project.technologies] : []
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, WebP).');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setIsUploading(true);
    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setCurrentProject(prev => ({ ...prev, image: data.url }));
    } catch (err) {
      console.error('Project image upload failed:', err);
      alert('Failed to upload image to Cloudinary. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleToggleTech = (techName: string) => {
    const existing = currentProject.technologies || [];
    if (existing.includes(techName)) {
      setCurrentProject(prev => ({
        ...prev,
        technologies: existing.filter(t => t !== techName)
      }));
    } else {
      setCurrentProject(prev => ({
        ...prev,
        technologies: [...existing, techName]
      }));
    }
  };

  const handleAddCustomTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = customTechInput.trim().replace(/^,|,$/g, '');
      if (val && !currentProject.technologies?.includes(val)) {
        setCurrentProject(prev => ({
          ...prev,
          technologies: [...(prev.technologies || []), val]
        }));
        setCustomTechInput('');
      }
    }
  };

  const handleRemoveTech = (techName: string) => {
    setCurrentProject(prev => ({
      ...prev,
      technologies: (prev.technologies || []).filter(t => t !== techName)
    }));
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  // Filtered projects for admin list
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesFilter = filterType === 'all' || (filterType === 'featured' && project.featured);
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.technologies?.some(t => t.toLowerCase().includes(query));

      return matchesFilter && matchesSearch;
    });
  }, [projects, filterType, searchQuery]);

  // Statistics
  const featuredCount = useMemo(() => projects.filter(p => p.featured).length, [projects]);
  const liveLinksCount = useMemo(() => projects.filter(p => p.liveDemo && p.liveDemo.trim() !== '').length, [projects]);
  const uniqueTechCount = useMemo(() => {
    const set = new Set<string>();
    projects.forEach(p => p.technologies?.forEach(t => t && set.add(t)));
    return set.size;
  }, [projects]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-8 pb-16">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Project Management</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Create, update, and manage your portfolio projects and live demos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/projects"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-bold border border-gray-200 dark:border-white/10 transition-all flex items-center gap-2"
          >
            <ExternalLink size={16} />
            <span>Public Page</span>
          </a>

          <button 
            onClick={handleAddNew}
            className="px-5 py-2.5 bg-primary text-black font-black text-sm rounded-xl hover:bg-cyan-300 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            <Plus size={18} />
            <span>Add New Project</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0A0A0A] p-5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Projects</span>
            <Layers size={18} className="text-primary" />
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-2">{projects.length}</p>
        </div>

        <div className="bg-white dark:bg-[#0A0A0A] p-5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Featured</span>
            <Star size={18} className="text-amber-400" />
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-2">{featuredCount}</p>
        </div>

        <div className="bg-white dark:bg-[#0A0A0A] p-5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Live Demos</span>
            <Globe size={18} className="text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-2">{liveLinksCount}</p>
        </div>

        <div className="bg-white dark:bg-[#0A0A0A] p-5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tech Stacks</span>
            <Code2 size={18} className="text-purple-400" />
          </div>
          <p className="text-2xl font-black text-gray-900 dark:text-white mt-2">{uniqueTechCount}</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#0A0A0A] p-4 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects by title or tech..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:border-primary transition-all placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              filterType === 'all'
                ? 'bg-primary text-black border-primary font-black'
                : 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-primary/40'
            }`}
          >
            All ({projects.length})
          </button>
          <button
            onClick={() => setFilterType('featured')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
              filterType === 'featured'
                ? 'bg-primary text-black border-primary font-black'
                : 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-primary/40'
            }`}
          >
            <Star size={14} className={filterType === 'featured' ? 'text-black fill-black' : 'text-amber-400'} />
            <span>Featured ({featuredCount})</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const imageUrl = getAssetUrl(project.image, DEFAULT_PROJECT_IMAGE);

          return (
            <motion.div
              layout
              key={project._id}
              className="bg-white dark:bg-[#0A0A0A] rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 hover:border-primary/40 transition-all duration-300 shadow-lg flex flex-col justify-between group"
            >
              <div>
                {/* Project Card Image Banner */}
                <div className="relative h-48 bg-gray-900 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={project.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = DEFAULT_PROJECT_IMAGE;
                    }}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Featured Badge */}
                  {project.featured && (
                    <div className="absolute top-3.5 left-3.5">
                      <span className="px-2.5 py-1 bg-primary text-black font-black text-[10px] uppercase tracking-wider rounded-lg shadow-md flex items-center gap-1">
                        <Sparkles size={11} /> Featured
                      </span>
                    </div>
                  )}

                  {/* Top Right Action Buttons */}
                  <div className="absolute top-3.5 right-3.5 flex gap-1.5">
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-2 bg-black/60 backdrop-blur-md rounded-xl text-white hover:text-primary hover:bg-black/90 transition-all"
                      title="Edit Project"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(project._id, project.title)}
                      className="p-2 bg-black/60 backdrop-blur-md rounded-xl text-red-400 hover:text-white hover:bg-red-600 transition-all"
                      title="Delete Project"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Bottom Title on Image */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-bold text-white truncate drop-shadow-md">
                      {project.title}
                    </h3>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 space-y-4">
                  <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies?.slice(0, 4).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 text-[10px] font-bold rounded-md border border-gray-200 dark:border-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies && project.technologies.length > 4 && (
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-md">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Links */}
              <div className="p-4 bg-gray-50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  {project.liveDemo ? (
                    <a
                      href={project.liveDemo}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline font-bold flex items-center gap-1"
                    >
                      <Globe size={14} />
                      <span>Live Demo</span>
                    </a>
                  ) : (
                    <span className="text-gray-400 text-[11px]">No live link</span>
                  )}

                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-500 hover:text-gray-900 dark:hover:text-white font-medium flex items-center gap-1"
                    >
                      <Github size={14} />
                      <span>Code</span>
                    </a>
                  )}
                </div>

                <button
                  onClick={() => handleEdit(project)}
                  className="text-gray-400 hover:text-primary font-semibold text-xs"
                >
                  Edit →
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-[#0A0A0A] rounded-3xl border border-gray-200 dark:border-white/10 p-8 space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 text-gray-400 rounded-2xl flex items-center justify-center mx-auto">
            <Layers size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">No projects found</h3>
          <p className="text-xs text-gray-500">
            {searchQuery ? 'Try clearing your search query.' : 'Click "Add New Project" to publish your first project.'}
          </p>
          <button
            onClick={handleAddNew}
            className="px-5 py-2.5 bg-primary text-black font-bold text-xs rounded-xl hover:bg-cyan-300 transition-all shadow-md inline-flex items-center gap-2"
          >
            <Plus size={16} /> Add First Project
          </button>
        </div>
      )}

      {/* Interactive Project Editor Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 sm:p-6 flex items-center justify-center overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-[#0C0C0C] w-full max-w-4xl rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50 dark:bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl text-primary">
                    <Code2 size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white">
                      {currentProject._id ? 'Edit Project' : 'Create New Project'}
                    </h2>
                    <p className="text-xs text-gray-500">
                      Configure your project details, live demo URL, and Cloudinary thumbnail.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Modal Scrollable Form */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Form Inputs (7 cols) */}
                  <div className="lg:col-span-7 space-y-5">
                    {/* Title */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. EduJobs Scholars Platform"
                        value={currentProject.title || ''}
                        onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary transition-all font-semibold"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                        Description *
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Describe the application features, architecture, and purpose..."
                        value={currentProject.description || ''}
                        onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-sm text-gray-900 dark:text-white outline-none focus:border-primary transition-all resize-none"
                      />
                    </div>

                    {/* Live Demo & GitHub URLs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                          Live Demo Website URL
                        </label>
                        <div className="relative">
                          <input
                            type="url"
                            placeholder="https://yourproject.com"
                            value={currentProject.liveDemo || ''}
                            onChange={(e) => setCurrentProject({ ...currentProject, liveDemo: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary transition-all"
                          />
                          <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                          GitHub Repository URL
                        </label>
                        <div className="relative">
                          <input
                            type="url"
                            placeholder="https://github.com/..."
                            value={currentProject.githubLink || ''}
                            onChange={(e) => setCurrentProject({ ...currentProject, githubLink: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-primary transition-all"
                          />
                          <Github size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    {/* Tech Stacks Tag Manager */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Technologies & Tools
                      </label>
                      
                      {/* Active Selected Tags */}
                      <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl">
                        {currentProject.technologies?.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 bg-primary text-black font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm"
                          >
                            <span>{tech}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTech(tech)}
                              className="hover:bg-black/20 rounded-full p-0.5 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                        <input
                          type="text"
                          placeholder="Type custom tech and press Enter..."
                          value={customTechInput}
                          onChange={(e) => setCustomTechInput(e.target.value)}
                          onKeyDown={handleAddCustomTech}
                          className="bg-transparent border-none outline-none text-xs text-gray-900 dark:text-white placeholder:text-gray-400 flex-1 min-w-[140px] px-2"
                        />
                      </div>

                      {/* Quick Presets */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] text-gray-400">Quick Select:</span>
                        <div className="flex flex-wrap gap-1">
                          {PRESET_TECHNOLOGIES.map((tech) => {
                            const isSelected = currentProject.technologies?.includes(tech);
                            return (
                              <button
                                key={tech}
                                type="button"
                                onClick={() => handleToggleTech(tech)}
                                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all border ${
                                  isSelected
                                    ? 'bg-primary/20 text-primary border-primary/40'
                                    : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-gray-400'
                                }`}
                              >
                                {tech}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Featured Toggle */}
                    <div className="flex items-center gap-3 p-3.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl">
                      <input
                        type="checkbox"
                        id="featured_toggle"
                        checked={Boolean(currentProject.featured)}
                        onChange={(e) => setCurrentProject({ ...currentProject, featured: e.target.checked })}
                        className="w-5 h-5 accent-primary cursor-pointer rounded"
                      />
                      <label htmlFor="featured_toggle" className="text-xs font-bold text-gray-800 dark:text-gray-200 cursor-pointer flex items-center gap-1.5">
                        <Sparkles size={14} className="text-amber-400" />
                        <span>Feature this project prominently on Home & Showcase</span>
                      </label>
                    </div>
                  </div>

                  {/* Right Column: Image Upload & Live Card Preview (5 cols) */}
                  <div className="lg:col-span-5 space-y-4">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Project Thumbnail Banner *
                    </label>

                    {/* Upload / Image Selector */}
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="https://... or click upload"
                          value={currentProject.image || ''}
                          onChange={(e) => setCurrentProject({ ...currentProject, image: e.target.value })}
                          className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white outline-none focus:border-primary"
                        />
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="px-3 py-2 bg-primary text-black font-bold text-xs rounded-xl hover:bg-cyan-300 transition-all flex items-center gap-1.5 disabled:opacity-50 shrink-0"
                          title="Upload image from computer"
                        >
                          {isUploading ? (
                            <RefreshCcw size={16} className="animate-spin" />
                          ) : (
                            <Upload size={16} />
                          )}
                          <span>Upload</span>
                        </button>
                      </div>

                      {/* Live Card Preview Box */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                          <Eye size={12} /> Live Card Preview
                        </span>

                        <div className="bg-white dark:bg-black rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-lg">
                          <div className="relative h-36 bg-gray-900">
                            <img
                              src={getAssetUrl(currentProject.image, DEFAULT_PROJECT_IMAGE)}
                              alt="Preview"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = DEFAULT_PROJECT_IMAGE;
                              }}
                              className="w-full h-full object-cover"
                            />
                            {currentProject.featured && (
                              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-primary text-black font-black text-[9px] uppercase tracking-wider rounded-md">
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="p-3.5 space-y-2">
                            <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
                              {currentProject.title || 'Untitled Project'}
                            </p>
                            <p className="text-xs text-gray-500 line-clamp-2">
                              {currentProject.description || 'Project description will appear here...'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="p-6 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.02] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!currentProject.title || !currentProject.description) {
                      alert('Please provide at least a project title and description.');
                      return;
                    }
                    saveMutation.mutate({
                      ...currentProject,
                      image: currentProject.image || DEFAULT_PROJECT_IMAGE
                    });
                  }}
                  disabled={saveMutation.isLoading || isUploading}
                  className="px-6 py-2.5 bg-primary text-black font-black text-xs rounded-xl hover:bg-cyan-300 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  {saveMutation.isLoading ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  <span>Save Project</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageProjects;
