import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  useHome, 
  useProjects, 
  useServices, 
  useSkills, 
  useTestimonials, 
  useDocuments 
} from '../../hooks/usePortfolio';
import { getAssetUrl } from '../../utils/url';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  ArrowRight, 
  FileText, 
  Send, 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  ExternalLink, 
  Layers, 
  Code, 
  Database, 
  Layout, 
  Star, 
  Quote, 
  Award, 
  ShieldCheck, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  Globe, 
  Lock, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  X, 
  MessageSquare, 
  ChevronRight,
  Terminal,
  Cpu,
  Server
} from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import api from '../../services/api';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const DEFAULT_PROJECT_IMAGE = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80';

const iconMap: Record<string, any> = {
  Github,
  Linkedin,
  Twitter,
  Mail,
  Layers,
  Code,
  Database,
  Layout,
  Server,
  Cpu,
  Terminal
};

const Typewriter = ({ texts }: { texts: string[] }) => {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!texts || texts.length === 0) {
      setDisplayText('Full-Stack Engineer');
      return;
    }

    const currentWord = texts[index] || '';
    let timer: NodeJS.Timeout;

    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayText(currentWord.substring(0, displayText.length - 1));
        if (displayText === '') {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % texts.length);
        }
      }, 40);
    } else {
      timer = setTimeout(() => {
        setDisplayText(currentWord.substring(0, displayText.length + 1));
        if (displayText === currentWord) {
          setTimeout(() => setIsDeleting(true), 2200);
        }
      }, 80);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, index, texts]);

  return (
    <div className="flex items-center justify-center lg:justify-start min-h-[50px] md:min-h-[70px]">
      <span className="text-primary/40 mr-3 text-3xl md:text-5xl font-light select-none">&gt;</span>
      <span className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-primary via-cyan-300 to-blue-500 bg-clip-text text-transparent">
        {displayText || '\u00A0'}
        <span className="text-primary animate-pulse ml-1">_</span>
      </span>
    </div>
  );
};

const Home = () => {
  const { data: homeData, isLoading: homeLoading } = useHome();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: skills, isLoading: skillsLoading } = useSkills();
  const { data: testimonials, isLoading: testimonialsLoading } = useTestimonials();
  const { data: documents, isLoading: docsLoading } = useDocuments();

  // Interactive States
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<string>('Frontend');
  const [previewDocument, setPreviewDocument] = useState<any | null>(null);
  const [modalZoom, setModalZoom] = useState<number>(1.0);
  const [modalRotation, setModalRotation] = useState<number>(0);
  const [numModalPages, setNumModalPages] = useState<number | null>(null);
  const [modalContainerWidth, setModalContainerWidth] = useState<number>(600);
  const modalContainerRef = useRef<HTMLDivElement>(null);

  // Measure modal container for PDF rendering
  useEffect(() => {
    if (!previewDocument) return;
    const container = modalContainerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setModalContainerWidth(Math.floor(entry.contentRect.width));
        }
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [previewDocument]);

  // Handle ESC for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && previewDocument) {
        setPreviewDocument(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewDocument]);

  if (homeLoading || projectsLoading || skillsLoading || testimonialsLoading || docsLoading) {
    return <LoadingSpinner />;
  }

  const validRoles = homeData?.roles?.filter((r: string) => r && r.trim() !== '') || [];
  
  const heroData = {
    title: homeData?.title || "Hi, I'm Esron",
    description: homeData?.description || "I design and build high-performance, scalable web applications with clean architecture and modern digital user experiences.",
    profileImage: getAssetUrl(homeData?.profileImage, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80'),
    roles: validRoles.length > 0 ? validRoles : ["Full-Stack Developer", "Software Architect", "UI/UX Designer", "Cloud Engineer"],
    statistics: homeData?.statistics || [
      { label: "Production Builds", value: "25+" },
      { label: "Years Experience", value: "4+" },
      { label: "Tech Stack Tools", value: "15+" },
      { label: "Client Satisfaction", value: "100%" }
    ],
    socialLinks: homeData?.socialLinks || [
      { platform: "Github", url: "https://github.com/Ephron221" },
      { platform: "Mail", url: "mailto:esront21@gmail.com" }
    ]
  };

  const featuredProjects = projects?.filter(p => p.featured).slice(0, 3) || projects?.slice(0, 3) || [];
  const skillCategories = ['Frontend', 'Backend', 'Database', 'Tools'];

  return (
    <div className="space-y-32 pb-32 overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center pt-24 overflow-hidden">
        {/* Animated Cyber Glowing Backdrops */}
        <div className="absolute top-[-5%] right-[-5%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] animate-pulse delay-1000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 text-center lg:text-left space-y-6"
            >
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Available for Full-time Roles & Contracts</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight text-gray-900 dark:text-white">
                {heroData.title}
              </h1>
              
              <Typewriter texts={heroData.roles} />

              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed pt-2">
                {heroData.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
                <Link 
                  to="/projects" 
                  className="px-8 py-4 bg-primary text-black font-black text-sm rounded-2xl hover:bg-cyan-300 transition-all flex items-center gap-2 shadow-lg shadow-primary/25 group"
                >
                  <span>Explore Live Projects</span>
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>

                <Link 
                  to="/cv" 
                  className="px-7 py-4 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white font-bold text-sm rounded-2xl border border-gray-200 dark:border-white/10 transition-all flex items-center gap-2"
                >
                  <FileText size={18} className="text-primary" />
                  <span>View Protected CV</span>
                </Link>

                <Link 
                  to="/documents" 
                  className="px-6 py-4 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-bold text-sm rounded-2xl border border-gray-200 dark:border-white/10 transition-all flex items-center gap-2"
                >
                  <ShieldCheck size={18} className="text-emerald-500" />
                  <span>Credentials</span>
                </Link>
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-center lg:justify-start gap-3 pt-2">
                {heroData.socialLinks.map((link: any, i: number) => {
                  const Icon = iconMap[link.platform] || Github;
                  return (
                    <a 
                      key={i} 
                      href={link.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="p-3 bg-gray-100 dark:bg-white/5 hover:bg-primary hover:text-black rounded-2xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 transition-all shadow-sm"
                      title={link.platform}
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </motion.div>

            {/* Right Profile Showcase with Floating Badges */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9 }}
              className="flex-1 relative flex justify-center"
            >
              <div className="relative w-72 h-72 sm:w-96 sm:h-96">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
                
                {/* Main Identity Box */}
                <div className="relative w-full h-full rounded-[40px] border-2 border-primary/50 bg-white shadow-2xl overflow-hidden group p-2">
                  <img 
                    src={heroData.profileImage} 
                    alt="Esron Profile" 
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80';
                    }}
                    className="w-full h-full object-cover object-top rounded-[32px] transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle inner gradient to ground the image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity rounded-[40px] pointer-events-none" />
                </div>

                {/* Floating Micro Badges */}
                <motion.div 
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute -top-4 -left-4 px-4 py-2 bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-white"
                >
                  <Code size={16} className="text-primary" />
                  <span>Full-Stack Pro</span>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-4 -right-4 px-4 py-2 bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-primary/40 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold text-primary"
                >
                  <ShieldCheck size={16} className="text-emerald-400" />
                  <span>Verified Credentials</span>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* KPI Statistics Row */}
          {heroData.statistics.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-white/70 dark:bg-[#0A0A0A]/80 backdrop-blur-2xl rounded-[36px] border border-gray-200 dark:border-white/10 shadow-xl"
            >
              {heroData.statistics.map((stat: any, index: number) => (
                <div key={index} className="text-center group border-r last:border-r-0 border-gray-200 dark:border-white/10 px-4">
                  <h3 className="text-3xl sm:text-4xl font-black text-primary mb-1 tracking-tight group-hover:scale-105 transition-transform">{stat.value}</h3>
                  <p className="text-gray-500 dark:text-gray-400 uppercase tracking-widest text-[11px] font-bold">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* FEATURED PROJECTS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <span className="text-xs font-black text-primary uppercase tracking-widest">Selected Works</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mt-1">
              Featured <span className="text-primary">Live Projects</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Interactive systems with live demo links and open source code.
            </p>
          </div>

          <Link 
            to="/projects" 
            className="px-5 py-2.5 bg-gray-100 dark:bg-white/5 hover:bg-primary hover:text-black rounded-xl text-xs font-bold text-gray-800 dark:text-white border border-gray-200 dark:border-white/10 transition-all flex items-center gap-2 group"
          >
            <span>View All ({projects?.length || 0})</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project, index) => {
            const imageUrl = getAssetUrl(project.image, DEFAULT_PROJECT_IMAGE);

            return (
              <motion.div
                key={project._id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white dark:bg-[#0A0A0A] rounded-[32px] overflow-hidden border border-gray-200 dark:border-white/10 hover:border-primary/40 shadow-xl flex flex-col justify-between transition-all duration-500"
              >
                {/* Project Image Banner */}
                <div className="relative h-52 bg-gray-900 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={project.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = DEFAULT_PROJECT_IMAGE;
                    }}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />

                  {project.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="px-2.5 py-1 bg-primary text-black font-black text-[10px] uppercase tracking-wider rounded-lg shadow-md flex items-center gap-1">
                        <Sparkles size={11} /> Featured
                      </span>
                    </div>
                  )}

                  {/* Hover Buttons */}
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                    {project.liveDemo && (
                      <a
                        href={project.liveDemo}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2.5 bg-primary text-black font-bold text-xs rounded-xl hover:scale-105 transition-all flex items-center gap-1.5 shadow-lg"
                      >
                        <Globe size={16} />
                        <span>Live Demo</span>
                      </a>
                    )}
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl hover:scale-105 transition-all"
                        title="GitHub Code"
                      >
                        <Github size={18} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Project Details */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies?.slice(0, 3).map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 text-[10px] font-bold rounded-md border border-gray-200 dark:border-white/10">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/5">
                      {project.liveDemo ? (
                        <a
                          href={project.liveDemo}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-black text-primary hover:underline flex items-center gap-1.5"
                        >
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span>Launch Live Demo</span>
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <Link to="/projects" className="text-xs font-bold text-primary">View Project →</Link>
                      )}

                      {project.githubLink && (
                        <a href={project.githubLink} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-900 dark:hover:text-white text-xs">
                          <Github size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* VERIFIED CREDENTIALS & CERTIFICATIONS (VIEW-ONLY ON BOTH MOBILE & DESKTOP) */}
      {documents && documents.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-black text-primary uppercase tracking-widest">Verified Qualifications</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
              Certifications & <span className="text-primary">Credentials</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              All credentials are authentic and rendered securely in protected view-only mode.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {documents.map((doc: any, index: number) => (
              <motion.div
                key={doc._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="bg-white dark:bg-[#0A0A0A] p-6 rounded-3xl border border-gray-200 dark:border-white/10 hover:border-primary/40 shadow-xl flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                      {doc.type === 'Certificate' ? <Award size={24} /> : <FileText size={24} />}
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase tracking-widest">
                      Verified
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors">
                      {doc.title}
                    </h3>
                    <p className="text-[10px] font-black text-primary uppercase tracking-wider mt-1">{doc.type}</p>
                    <p className="text-gray-500 text-xs mt-2 line-clamp-2">{doc.description || 'Verified academic credential.'}</p>
                  </div>
                </div>

                {/* Secure View Trigger Button */}
                <button
                  onClick={() => {
                    setPreviewDocument(doc);
                    setModalZoom(1.0);
                    setModalRotation(0);
                  }}
                  className="w-full py-3 bg-gray-100 dark:bg-white/5 hover:bg-primary hover:text-black text-gray-900 dark:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-gray-200 dark:border-white/10 group-hover:border-primary"
                >
                  <Eye size={14} />
                  <span>View Protected Certificate</span>
                </button>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* TECHNICAL PROFICIENCY & SKILLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Interactive Categories */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-black text-primary uppercase tracking-widest">Core Capabilities</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
              Technical <span className="text-primary">Proficiency</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
              Engineered with modern best practices, focusing on maintainable code, test-driven reliability, and lightning-fast user experiences.
            </p>

            {/* Category Switcher Tabs */}
            <div className="flex flex-wrap gap-2 pt-2">
              {skillCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedSkillCategory(cat)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all border ${
                    selectedSkillCategory === cat
                      ? 'bg-primary text-black border-primary font-black shadow-lg shadow-primary/20'
                      : 'bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-primary/40'
                  }`}
                >
                  {cat} Stack
                </button>
              ))}
            </div>

            {/* Selected Category Skill Badges */}
            <div className="p-6 bg-white dark:bg-[#0A0A0A] rounded-3xl border border-gray-200 dark:border-white/10 shadow-lg space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {selectedSkillCategory} Technologies:
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {skills?.filter(s => s.category?.toLowerCase() === selectedSkillCategory.toLowerCase()).map((skill) => (
                  <div
                    key={skill._id}
                    className="px-4 py-2 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white text-xs font-bold rounded-xl border border-gray-200 dark:border-white/10 flex items-center gap-2 hover:border-primary/50 transition-colors"
                  >
                    <CheckCircle2 size={14} className="text-primary" />
                    <span>{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Architecture Pillars */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="p-6 bg-white dark:bg-[#0A0A0A] rounded-3xl border border-gray-200 dark:border-white/10 shadow-xl space-y-3">
              <div className="p-3 bg-primary/10 text-primary w-fit rounded-2xl"><Layout size={28} /></div>
              <h4 className="font-bold text-gray-900 dark:text-white text-base">UI/UX & Frontend</h4>
              <p className="text-gray-500 text-xs leading-relaxed">Responsive, accessible, and intuitive interfaces with smooth Framer Motion animations.</p>
            </div>

            <div className="p-6 bg-white dark:bg-[#0A0A0A] rounded-3xl border border-gray-200 dark:border-white/10 shadow-xl space-y-3">
              <div className="p-3 bg-primary/10 text-primary w-fit rounded-2xl"><Server size={28} /></div>
              <h4 className="font-bold text-gray-900 dark:text-white text-base">Backend & APIs</h4>
              <p className="text-gray-500 text-xs leading-relaxed">Secure Node.js & Express RESTful services with rate limiting and JWT auth.</p>
            </div>

            <div className="p-6 bg-white dark:bg-[#0A0A0A] rounded-3xl border border-gray-200 dark:border-white/10 shadow-xl space-y-3">
              <div className="p-3 bg-primary/10 text-primary w-fit rounded-2xl"><Database size={28} /></div>
              <h4 className="font-bold text-gray-900 dark:text-white text-base">Database Design</h4>
              <p className="text-gray-500 text-xs leading-relaxed">Schema modeling, indexing, and high-availability Atlas / PostgreSQL storage.</p>
            </div>

            <div className="p-6 bg-white dark:bg-[#0A0A0A] rounded-3xl border border-gray-200 dark:border-white/10 shadow-xl space-y-3">
              <div className="p-3 bg-primary/10 text-primary w-fit rounded-2xl"><ShieldCheck size={28} /></div>
              <h4 className="font-bold text-gray-900 dark:text-white text-base">Cloud & Security</h4>
              <p className="text-gray-500 text-xs leading-relaxed">Cloudinary media streaming, Vercel deployments, and production hardening.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECURE IN-PAGE VIEW-ONLY MODAL FOR CERTIFICATES/DOCUMENTS (Mobile & Desktop Safe, Zero Download Prompts) */}
      <AnimatePresence>
        {previewDocument && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewDocument(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-3 sm:p-6 lg:p-8 flex items-center justify-center overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#0C0C0C] w-full max-w-4xl rounded-[36px] border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
            >
              {/* Modal Header & Zoom Controls */}
              <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.02] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 rounded-2xl text-primary shrink-0">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white truncate max-w-xs sm:max-w-md">
                      {previewDocument.title}
                    </h3>
                    <p className="text-[10px] font-black uppercase text-primary tracking-widest">
                      {previewDocument.type} • Protected Canvas
                    </p>
                  </div>
                </div>

                {/* Touch-Friendly Zoom Toolbar */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setModalZoom(prev => Math.max(0.6, Number((prev - 0.15).toFixed(2))))}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl text-gray-700 dark:text-gray-300 transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut size={18} />
                  </button>
                  <button
                    onClick={() => setModalZoom(1.0)}
                    className="px-2.5 py-1 text-xs font-black text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg"
                    title="Reset Zoom"
                  >
                    {Math.round(modalZoom * 100)}%
                  </button>
                  <button
                    onClick={() => setModalZoom(prev => Math.min(2.2, Number((prev + 0.15).toFixed(2))))}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl text-gray-700 dark:text-gray-300 transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn size={18} />
                  </button>
                  <button
                    onClick={() => setModalRotation(prev => (prev + 90) % 360)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl text-gray-700 dark:text-gray-300 transition-colors"
                    title="Rotate"
                  >
                    <RotateCw size={18} />
                  </button>

                  <div className="w-[1px] h-5 bg-gray-300 dark:bg-white/10 mx-1"></div>

                  <button
                    onClick={() => setPreviewDocument(null)}
                    className="p-2 bg-gray-200 dark:bg-white/10 hover:bg-red-500 hover:text-white rounded-xl text-gray-600 dark:text-gray-300 transition-all"
                    title="Close"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Secure Document Canvas Body */}
              <div 
                ref={modalContainerRef}
                className="flex-1 bg-zinc-100 dark:bg-zinc-950 p-4 sm:p-8 overflow-auto custom-scrollbar relative flex justify-center items-start min-h-[500px]"
              >
                {/* Transparent Security Shield */}
                <div className="absolute inset-0 z-30 pointer-events-none select-none" onContextMenu={(e) => e.preventDefault()} />

                {previewDocument.fileUrl ? (
                  <Document
                    file={getAssetUrl(previewDocument.fileUrl)}
                    onLoadSuccess={({ numPages }) => setNumModalPages(numPages)}
                    loading={
                      <div className="py-24 flex flex-col items-center justify-center gap-3">
                        <LoadingSpinner />
                        <span className="text-xs font-semibold text-gray-400">Rendering high-resolution credential canvas...</span>
                      </div>
                    }
                    className="flex flex-col items-center"
                  >
                    {Array.from(new Array(numModalPages || 0), (_, index) => (
                      <div key={`modal_doc_${index + 1}`} className="mb-6 shadow-2xl rounded-xl overflow-hidden">
                        <Page
                          pageNumber={index + 1}
                          width={Math.min(modalContainerWidth - 32, 850)}
                          scale={modalZoom}
                          rotate={modalRotation}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                          className="rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 select-none"
                          onContextMenu={(e) => e.preventDefault()}
                        />
                      </div>
                    ))}
                  </Document>
                ) : (
                  <div className="py-24 text-center text-gray-400">
                    <Lock size={36} className="mx-auto mb-2" />
                    <p className="text-sm font-bold">Document protected or unavailable.</p>
                  </div>
                )}
              </div>

              {/* Modal Security Footer */}
              <div className="p-4 bg-gray-50 dark:bg-white/[0.02] border-t border-gray-200 dark:border-white/10 flex items-center justify-between text-xs text-gray-500 px-6">
                <span className="flex items-center gap-1.5 text-primary font-bold">
                  <ShieldCheck size={14} /> View-Only Mode Protected
                </span>
                <span className="text-[11px]">Direct download and printing restricted on all browsers</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
