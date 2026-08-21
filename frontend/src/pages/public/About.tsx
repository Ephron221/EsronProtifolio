import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAbout } from '../../hooks/usePortfolio';
import { getAssetUrl } from '../../utils/url';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  BookOpen, 
  Briefcase, 
  Target, 
  Award, 
  Languages, 
  Heart, 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  ArrowRight, 
  ExternalLink, 
  Globe, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Code2, 
  Layers,
  Compass,
  Cpu
} from 'lucide-react';

const DEFAULT_ABOUT_IMAGE = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80';

const About = () => {
  const { data: aboutData, isLoading } = useAbout();
  const [activeTab, setActiveTab] = useState<'bio' | 'experience' | 'education' | 'achievements'>('bio');

  if (isLoading) return <LoadingSpinner />;

  // Default fallback data if database is empty
  const defaultData = {
    title: "About",
    subtitle: "Software Engineer & Full-Stack Developer passionate about scalable digital architecture.",
    biography: "I am a dedicated software developer based in Rwanda with a passion for architecting modern, high-performance web applications. My journey in technology centers around building elegant, maintainable codebases that solve real-world problems. With extensive experience across React, Node.js, TypeScript, and cloud ecosystems, I focus on delivering seamless digital solutions from database design to refined frontend user interfaces.",
    goals: "To engineer transformative software solutions that empower communities, drive business scalability, and push the boundaries of modern full-stack web engineering.",
    aboutImage: "",
    experience: [
      {
        position: "Full-Stack Software Developer",
        company: "Independent & Contract Engineering",
        duration: "2023 - Present",
        description: "Designing and developing production-grade web systems, REST APIs, and responsive web applications with React, TypeScript, Node.js, and MongoDB."
      },
      {
        position: "Lead Frontend Engineer",
        company: "Community Web Portals",
        duration: "2022 - 2023",
        description: "Spearheaded user experience design and client-side architecture for academic and organizational community platforms."
      }
    ],
    education: [
      {
        degree: "Bachelor of Science in Information Systems / Computer Science",
        institution: "University of Rwanda (UR)",
        year: "2021 - 2025",
        description: "Focused on Software Engineering, Database Systems, Computer Networks, and Cloud Application Architectures."
      }
    ],
    achievements: [
      {
        title: "Academic & Technical Excellence",
        year: "2024",
        description: "Recognized for high-impact software design and leadership in university technological associations."
      },
      {
        title: "Production System Deployments",
        year: "2023",
        description: "Successfully deployed multi-tier production platforms serving hundreds of active users."
      }
    ],
    languages: [
      { name: "English", proficiency: "Fluent" },
      { name: "Kinyarwanda", proficiency: "Native" },
      { name: "French", proficiency: "Intermediate" }
    ],
    interests: ["Full-Stack Architecture", "Cloud Computing", "UI/UX Micro-interactions", "Open Source", "System Optimization"]
  };

  const profile = {
    title: aboutData?.title || defaultData.title,
    subtitle: aboutData?.subtitle || defaultData.subtitle,
    biography: aboutData?.biography || defaultData.biography,
    goals: aboutData?.goals || defaultData.goals,
    aboutImage: aboutData?.aboutImage || defaultData.aboutImage,
    experience: (aboutData?.experience && aboutData.experience.length > 0) ? aboutData.experience : defaultData.experience,
    education: (aboutData?.education && aboutData.education.length > 0) ? aboutData.education : defaultData.education,
    achievements: (aboutData?.achievements && aboutData.achievements.length > 0) ? aboutData.achievements : defaultData.achievements,
    languages: (aboutData?.languages && aboutData.languages.length > 0) ? aboutData.languages : defaultData.languages,
    interests: (aboutData?.interests && aboutData.interests.length > 0) ? aboutData.interests : defaultData.interests
  };

  const profileImageUrl = getAssetUrl(profile.aboutImage, DEFAULT_ABOUT_IMAGE);

  return (
    <div className="min-h-screen pb-32 space-y-20 overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-28 pb-12 overflow-hidden">
        {/* Glows */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header Title */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3 max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
              <Sparkles size={14} /> Professional Journey
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tight">
              {profile.title} <span className="text-primary">Tuyishime</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              {profile.subtitle}
            </p>
          </motion.div>

          {/* Main Hero Card Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left: Persona Card & Photo */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-[40px] overflow-hidden border-2 border-primary/30 bg-white dark:bg-[#0A0A0A] p-4 shadow-2xl group">
                <div className="relative h-[420px] rounded-[32px] overflow-hidden bg-gray-900">
                  <img 
                    src={profileImageUrl} 
                    alt="Esron Profile" 
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = DEFAULT_ABOUT_IMAGE;
                    }}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

                  {/* Badges on image */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="px-3 py-1.5 bg-black/70 backdrop-blur-md border border-white/10 rounded-xl flex items-center gap-1.5 text-xs font-bold text-white">
                      <MapPin size={14} className="text-primary" />
                      <span>Kigali, Rwanda</span>
                    </div>
                    <div className="px-3 py-1.5 bg-primary text-black font-black text-xs rounded-xl shadow-lg flex items-center gap-1">
                      <ShieldCheck size={14} />
                      <span>Verified Engineer</span>
                    </div>
                  </div>
                </div>

                {/* Quick Bio Info Footer */}
                <div className="p-4 pt-5 grid grid-cols-3 gap-2 text-center border-t border-gray-100 dark:border-white/5 mt-2">
                  <div>
                    <p className="text-xl font-black text-primary">4+ Yrs</p>
                    <p className="text-[10px] uppercase font-bold text-gray-500">Experience</p>
                  </div>
                  <div>
                    <p className="text-xl font-black text-gray-900 dark:text-white">25+</p>
                    <p className="text-[10px] uppercase font-bold text-gray-500">Projects</p>
                  </div>
                  <div>
                    <p className="text-xl font-black text-emerald-400">100%</p>
                    <p className="text-[10px] uppercase font-bold text-gray-500">Commitment</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Interactive Bio & Vision Highlights */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-7 space-y-6"
            >
              {/* Biography Card */}
              <div className="bg-white dark:bg-[#0A0A0A] p-8 sm:p-10 rounded-[36px] border border-gray-200 dark:border-white/10 shadow-xl space-y-4 relative overflow-hidden">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <BookOpen size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white">Engineering Background</h2>
                    <p className="text-xs text-gray-500">Passion for clean code & scalable systems</p>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
                  {profile.biography}
                </p>

                {/* Key Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {['Full-Stack Development', 'API Design', 'System Architecture', 'Modern UX', 'Cloud Services'].map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 text-xs font-bold rounded-xl">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mission & Vision Card */}
              <div className="bg-white dark:bg-[#0A0A0A] p-8 sm:p-10 rounded-[36px] border border-gray-200 dark:border-white/10 shadow-xl space-y-3 relative overflow-hidden">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <Target size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white">Core Vision & Philosophy</h2>
                    <p className="text-xs text-gray-500">Long-term engineering aspiration</p>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base italic pl-2 border-l-2 border-primary">
                  "{profile.goals}"
                </p>
              </div>

              {/* Fast Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Link 
                  to="/cv" 
                  className="px-6 py-3.5 bg-primary text-black font-black text-xs rounded-2xl hover:bg-cyan-300 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                  <FileText size={16} />
                  <span>Inspect Official CV</span>
                </Link>

                <Link 
                  to="/documents" 
                  className="px-6 py-3.5 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white font-bold text-xs rounded-2xl border border-gray-200 dark:border-white/10 transition-all flex items-center gap-2"
                >
                  <Award size={16} className="text-primary" />
                  <span>View Verified Credentials</span>
                </Link>

                <Link 
                  to="/contact" 
                  className="px-6 py-3.5 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white font-bold text-xs rounded-2xl border border-gray-200 dark:border-white/10 transition-all flex items-center gap-2"
                >
                  <span>Connect With Me</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE CAREER JOURNEY TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-black text-primary uppercase tracking-widest">Career Highlights</span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
            Experience & <span className="text-primary">Academics</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Navigate through professional roles, university milestones, and notable achievements.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { id: 'bio', label: 'Overview', icon: Compass },
            { id: 'experience', label: `Work Experience (${profile.experience.length})`, icon: Briefcase },
            { id: 'education', label: `Education (${profile.education.length})`, icon: GraduationCap },
            { id: 'achievements', label: `Achievements (${profile.achievements.length})`, icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all border flex items-center gap-2 ${
                  isSelected
                    ? 'bg-primary text-black border-primary font-black shadow-lg shadow-primary/20 scale-105'
                    : 'bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-primary/40'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Tab Content Area */}
        <div className="bg-white dark:bg-[#0A0A0A] p-6 sm:p-10 rounded-[40px] border border-gray-200 dark:border-white/10 shadow-2xl min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {/* Overview / All-in-One View */}
            {activeTab === 'bio' && (
              <motion.div
                key="tab-overview"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {/* Latest Experience Box */}
                <div className="p-6 bg-gray-50 dark:bg-white/[0.02] rounded-3xl border border-gray-100 dark:border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                      <Briefcase size={18} className="text-primary" /> Latest Experience
                    </h3>
                    <button onClick={() => setActiveTab('experience')} className="text-xs text-primary font-bold hover:underline">
                      See All →
                    </button>
                  </div>
                  {profile.experience.slice(0, 2).map((exp: any, i: number) => (
                    <div key={i} className="p-4 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/5 space-y-1">
                      <span className="text-xs font-black text-primary uppercase tracking-wider">{exp.duration}</span>
                      <p className="font-bold text-sm text-gray-900 dark:text-white">{exp.position}</p>
                      <p className="text-xs text-gray-500">{exp.company}</p>
                    </div>
                  ))}
                </div>

                {/* Latest Education Box */}
                <div className="p-6 bg-gray-50 dark:bg-white/[0.02] rounded-3xl border border-gray-100 dark:border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                      <GraduationCap size={18} className="text-primary" /> Education & Degree
                    </h3>
                    <button onClick={() => setActiveTab('education')} className="text-xs text-primary font-bold hover:underline">
                      See All →
                    </button>
                  </div>
                  {profile.education.slice(0, 2).map((edu: any, i: number) => (
                    <div key={i} className="p-4 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/5 space-y-1">
                      <span className="text-xs font-black text-primary uppercase tracking-wider">{edu.year}</span>
                      <p className="font-bold text-sm text-gray-900 dark:text-white">{edu.degree}</p>
                      <p className="text-xs text-gray-500">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Experience Timeline Tab */}
            {activeTab === 'experience' && (
              <motion.div
                key="tab-experience"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-[19px] before:w-[2px] before:bg-gradient-to-b before:from-primary before:via-primary/50 before:to-transparent">
                  {profile.experience.map((exp: any, index: number) => (
                    <div key={index} className="relative pl-12">
                      <div className="absolute left-0 top-1.5 w-10 h-10 rounded-full bg-white dark:bg-[#0A0A0A] border-2 border-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse"></div>
                      </div>
                      
                      <div className="p-6 bg-gray-50 dark:bg-white/[0.02] rounded-3xl border border-gray-200 dark:border-white/5 hover:border-primary/40 transition-all space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white">{exp.position}</h4>
                          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-wider w-fit">
                            {exp.duration}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{exp.company}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed pt-2">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && (
              <motion.div
                key="tab-education"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-[19px] before:w-[2px] before:bg-gradient-to-b before:from-primary before:via-primary/50 before:to-transparent">
                  {profile.education.map((edu: any, index: number) => (
                    <div key={index} className="relative pl-12">
                      <div className="absolute left-0 top-1.5 w-10 h-10 rounded-full bg-white dark:bg-[#0A0A0A] border-2 border-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <GraduationCap size={16} className="text-primary" />
                      </div>
                      
                      <div className="p-6 bg-gray-50 dark:bg-white/[0.02] rounded-3xl border border-gray-200 dark:border-white/5 hover:border-primary/40 transition-all space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4 className="text-xl font-bold text-gray-900 dark:text-white">{edu.degree}</h4>
                          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-wider w-fit">
                            {edu.year}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{edu.institution}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed pt-2">
                          {edu.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <motion.div
                key="tab-achievements"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {profile.achievements.map((ach: any, index: number) => (
                  <div 
                    key={index}
                    className="p-6 bg-gray-50 dark:bg-white/[0.02] rounded-3xl border border-gray-200 dark:border-white/5 hover:border-primary/40 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                        <Award size={20} />
                      </div>
                      <span className="text-xs font-black text-primary">{ach.year}</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">{ach.title}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{ach.description}</p>
                  </div>
                ))}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </section>

      {/* LANGUAGES & CORE INTERESTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Languages */}
          <div className="bg-white dark:bg-[#0A0A0A] p-8 rounded-[36px] border border-gray-200 dark:border-white/10 shadow-xl space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Languages size={22} className="text-primary" /> Spoken Languages
            </h3>
            <div className="space-y-4">
              {profile.languages.map((lang: any, index: number) => (
                <div key={index} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-800 dark:text-gray-200">{lang.name}</span>
                    <span className="text-primary uppercase tracking-wider">{lang.proficiency}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ 
                        width: lang.proficiency === 'Native' ? '100%' : 
                               lang.proficiency === 'Fluent' ? '90%' : 
                               lang.proficiency === 'Intermediate' ? '70%' : '45%' 
                      }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interests & Passions */}
          <div className="bg-white dark:bg-[#0A0A0A] p-8 rounded-[36px] border border-gray-200 dark:border-white/10 shadow-xl space-y-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Heart size={22} className="text-primary" /> Interests & Technical Passions
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {profile.interests.map((interest: string, index: number) => (
                <span 
                  key={index} 
                  className="px-4 py-2 bg-gray-50 dark:bg-white/5 text-gray-800 dark:text-gray-200 text-xs font-bold rounded-2xl border border-gray-200 dark:border-white/10 hover:border-primary/50 transition-colors flex items-center gap-1.5"
                >
                  <Cpu size={14} className="text-primary" />
                  <span>{interest}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
