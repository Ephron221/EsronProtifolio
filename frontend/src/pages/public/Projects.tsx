import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjects } from '../../hooks/usePortfolio';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  Github, 
  ExternalLink, 
  Search, 
  Sparkles, 
  Code2, 
  Globe, 
  Layers, 
  ArrowUpRight, 
  X, 
  CheckCircle, 
  LayoutGrid, 
  ListFilter
} from 'lucide-react';
import { getAssetUrl } from '../../utils/url';
import { ProjectData } from '../../types';

const DEFAULT_PROJECT_IMAGE = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80';

const Projects = () => {
  const { data: rawProjects, isLoading } = useProjects();
  const [selectedTech, setSelectedTech] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [viewLayout, setViewLayout] = useState<'grid' | 'compact'>('grid');

  // Fallback demo projects if database is empty
  const fallbackProjects: ProjectData[] = [
    {
      _id: '1',
      title: 'EduJobs Scholars Platform',
      description: 'A modern full-stack educational and career advancement portal connecting African scholars with global tech jobs, scholarships, and mentorship opportunities.',
      technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
      githubLink: 'https://github.com/Ephron221',
      liveDemo: 'https://esron-portfolio.vercel.app',
      featured: true
    },
    {
      _id: '2',
      title: 'RASA UR Nyarugenge Portal',
      description: 'Academic community management and event broadcasting platform engineered for University of Rwanda student association with role-based member portals.',
      technologies: ['React', 'Tailwind CSS', 'Node.js', 'MongoDB', 'REST API'],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      githubLink: 'https://github.com/Ephron221',
      liveDemo: 'https://esron-portfolio.vercel.app',
      featured: true
    },
    {
      _id: '3',
      title: 'AI Smart Assistant & Chatbot',
      description: 'Context-aware interactive AI portfolio assistant with retrieval-augmented knowledge base to provide instantaneous answers to recruiter inquiries.',
      technologies: ['React', 'Node.js', 'Gemini AI', 'Tailwind CSS', 'Express'],
      image: 'https://images.unsplash.com/photo-1675271591211-126ad94e495d?w=800&q=80',
      githubLink: 'https://github.com/Ephron221',
      liveDemo: 'https://esron-portfolio.vercel.app',
      featured: false
    }
  ];

  const projects = (rawProjects && rawProjects.length > 0) ? rawProjects : fallbackProjects;

  // Extract all unique technologies
  const allTechnologies = useMemo(() => {
    const set = new Set<string>();
    projects.forEach(p => {
      if (Array.isArray(p.technologies)) {
        p.technologies.forEach(t => t && set.add(t.trim()));
      }
    });
    return ['All', ...Array.from(set)];
  }, [projects]);

  // Filter projects by search term and technology
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesTech = selectedTech === 'All' || 
        (Array.isArray(project.technologies) && project.technologies.some(t => t.toLowerCase() === selectedTech.toLowerCase()));
      
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        (Array.isArray(project.technologies) && project.technologies.some(t => t.toLowerCase().includes(query)));

      return matchesTech && matchesSearch;
    });
  }, [projects, selectedTech, searchQuery]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest"
        >
          <Sparkles size={14} /> Portfolio Showcase
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tight"
        >
          Featured <span className="text-primary">Projects & Works</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 dark:text-gray-400 text-base sm:text-lg leading-relaxed"
        >
          Explore real-world production systems, modern full-stack web applications, and digital tools built with clean architecture and responsive design.
        </motion.p>
      </div>

      {/* Interactive Controls Bar: Search & Tech Filters */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl p-4 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, tech or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 outline-none focus:border-primary transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Result Count & View Layout Switcher */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
              Showing <span className="text-primary font-black">{filteredProjects.length}</span> of {projects.length} Projects
            </span>

            <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/10">
              <button
                onClick={() => setViewLayout('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewLayout === 'grid' 
                    ? 'bg-white dark:bg-white/10 text-primary shadow-sm' 
                    : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                title="Grid View"
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewLayout('compact')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewLayout === 'compact' 
                    ? 'bg-white dark:bg-white/10 text-primary shadow-sm' 
                    : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                title="Compact List View"
              >
                <ListFilter size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Technology Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {allTechnologies.map((tech) => {
            const isSelected = selectedTech.toLowerCase() === tech.toLowerCase();
            const count = tech === 'All' 
              ? projects.length 
              : projects.filter(p => p.technologies?.some(t => t.toLowerCase() === tech.toLowerCase())).length;

            return (
              <button
                key={tech}
                onClick={() => setSelectedTech(tech)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all border flex items-center gap-2 ${
                  isSelected
                    ? 'bg-primary text-black border-primary shadow-lg shadow-primary/25 scale-105'
                    : 'bg-white/70 dark:bg-white/[0.03] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-primary/50 hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
              >
                <span>{tech}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                  isSelected ? 'bg-black/20 text-black' : 'bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Display Grid */}
      <motion.div
        layout
        className={`grid gap-8 ${
          viewLayout === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}
      >
        <AnimatePresence>
          {filteredProjects.map((project, index) => {
            const projectImageUrl = getAssetUrl(project.image, DEFAULT_PROJECT_IMAGE);

            return (
              <motion.div
                layout
                key={project._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className={`group bg-white dark:bg-[#0A0A0A] rounded-[32px] overflow-hidden border border-gray-200 dark:border-white/10 hover:border-primary/50 dark:hover:border-primary/40 shadow-xl hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col ${
                  viewLayout === 'compact' ? 'md:flex-row' : ''
                }`}
              >
                {/* Project Image & Live Overlay */}
                <div className={`relative overflow-hidden bg-gray-900 ${
                  viewLayout === 'compact' ? 'md:w-72 h-56 md:h-auto shrink-0' : 'h-56'
                }`}>
                  <img
                    src={projectImageUrl}
                    alt={project.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = DEFAULT_PROJECT_IMAGE;
                    }}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                  
                  {/* Featured Badge */}
                  {project.featured && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1 bg-primary text-black font-black text-[10px] uppercase tracking-wider rounded-full shadow-lg flex items-center gap-1.5">
                        <Sparkles size={11} /> Featured
                      </span>
                    </div>
                  )}

                  {/* Gradient Shadow Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

                  {/* Hover Quick Action Buttons */}
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 p-4">
                    {project.liveDemo && (
                      <a
                        href={project.liveDemo}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 bg-primary text-black rounded-2xl hover:scale-110 hover:shadow-lg hover:shadow-primary/40 transition-all font-bold text-xs flex items-center gap-1.5"
                        title="Open Live Website Demo"
                      >
                        <Globe size={18} />
                        <span>Live Demo</span>
                      </a>
                    )}
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noreferrer"
                        className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl hover:scale-110 transition-all font-bold text-xs flex items-center gap-1.5"
                        title="View Source Code"
                      >
                        <Github size={18} />
                        <span>Code</span>
                      </a>
                    )}
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl hover:scale-110 transition-all font-bold text-xs flex items-center gap-1.5"
                      title="Inspect Details"
                    >
                      <ArrowUpRight size={18} />
                      <span>Details</span>
                    </button>
                  </div>
                </div>

                {/* Project Info Body */}
                <div className="p-7 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <h3 
                      onClick={() => setSelectedProject(project)}
                      className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1 cursor-pointer flex items-center justify-between"
                    >
                      <span>{project.title}</span>
                      <ArrowUpRight size={18} className="text-gray-400 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="space-y-4 pt-2">
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies?.slice(0, 4).map((tech, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-[11px] font-bold rounded-lg group-hover:border-primary/30 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies && project.technologies.length > 4 && (
                        <span className="px-2 py-1 bg-primary/10 text-primary text-[11px] font-black rounded-lg">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Footer Action Links */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
                      <div className="flex items-center gap-3">
                        {project.liveDemo && (
                          <a
                            href={project.liveDemo}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-black text-primary hover:underline group/btn"
                          >
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span>Live Demo</span>
                            <ExternalLink size={12} className="transition-transform group-hover/btn:translate-x-0.5" />
                          </a>
                        )}

                        {project.githubLink && (
                          <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                          >
                            <Github size={13} />
                            <span>Repository</span>
                          </a>
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedProject(project)}
                        className="text-xs font-bold text-gray-400 hover:text-primary transition-colors"
                      >
                        Learn More →
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Empty Search State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-24 bg-white/40 dark:bg-white/[0.02] rounded-3xl border border-gray-200 dark:border-white/10 max-w-md mx-auto space-y-4 p-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Search size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">No projects found</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            No projects matched "{searchQuery || selectedTech}". Try searching for another technology or resetting filters.
          </p>
          <button
            onClick={() => {
              setSelectedTech('All');
              setSearchQuery('');
            }}
            className="px-6 py-2.5 bg-primary text-black font-bold text-xs rounded-xl hover:bg-cyan-300 transition-all shadow-md"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Interactive Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md p-4 sm:p-6 lg:p-10 flex items-center justify-center overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#0A0A0A] w-full max-w-3xl rounded-[36px] border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden my-auto"
            >
              {/* Modal Banner */}
              <div className="relative h-64 sm:h-80 bg-gray-900">
                <img
                  src={getAssetUrl(selectedProject.image, DEFAULT_PROJECT_IMAGE)}
                  alt={selectedProject.title}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = DEFAULT_PROJECT_IMAGE;
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 p-2.5 bg-black/60 backdrop-blur-md hover:bg-red-500 text-white rounded-full transition-all"
                  title="Close Modal (Esc)"
                >
                  <X size={20} />
                </button>

                <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    {selectedProject.featured && (
                      <span className="px-3 py-1 bg-primary text-black font-black text-[10px] uppercase tracking-widest rounded-full mb-2 inline-block">
                        Featured Project
                      </span>
                    )}
                    <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                      {selectedProject.title}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-primary uppercase tracking-widest">About This Project</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-black text-primary uppercase tracking-widest">Technologies & Tools Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies?.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 text-xs font-bold rounded-xl flex items-center gap-1.5"
                      >
                        <CheckCircle size={14} className="text-primary" /> {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Modal Action CTA Buttons */}
                <div className="pt-4 border-t border-gray-200 dark:border-white/10 flex flex-col sm:flex-row gap-3">
                  {selectedProject.liveDemo && (
                    <a
                      href={selectedProject.liveDemo}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-3.5 px-6 bg-primary text-black font-black text-sm rounded-2xl hover:bg-cyan-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                    >
                      <Globe size={18} />
                      <span>Launch Live Website</span>
                    </a>
                  )}

                  {selectedProject.githubLink && (
                    <a
                      href={selectedProject.githubLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-3.5 px-6 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2"
                    >
                      <Github size={18} />
                      <span>View GitHub Code</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
