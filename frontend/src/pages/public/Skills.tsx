import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSkills } from '../../hooks/usePortfolio';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Sparkles,
  Code2,
  Server,
  Database,
  Wrench,
  Globe,
  Layers,
  Cpu,
  Zap,
  Star,
  TrendingUp,
  ChevronRight,
  Monitor,
  Cloud
} from 'lucide-react';

// ─── Fallback Skill Data ──────────────────────────────────────────────────────
const dummySkills = [
  // Frontend
  { _id: 'f1', category: 'Frontend', name: 'React.js', level: 80, icon: '⚛️' },
  { _id: 'f2', category: 'Frontend', name: 'TypeScript', level: 70, icon: '🔷' },
  { _id: 'f3', category: 'Frontend', name: 'Tailwind CSS', level: 80, icon: '🌊' },
  { _id: 'f4', category: 'Frontend', name: 'HTML5 & CSS3', level: 85, icon: '🎨' },
  { _id: 'f5', category: 'Frontend', name: 'JavaScript (ES6+)', level: 75, icon: '🟨' },
  // Backend
  { _id: 'b1', category: 'Backend', name: 'Node.js', level: 82, icon: '🟩' },
  { _id: 'b2', category: 'Backend', name: 'Express.js', level: 80, icon: '🚀' },
  { _id: 'b3', category: 'Backend', name: 'PHP', level: 65, icon: '🐘' },
  { _id: 'b4', category: 'Backend', name: 'Python (Flask & Django)', level: 60, icon: '🐍' },
  // Database
  { _id: 'd1', category: 'Database', name: 'MySQL', level: 90, icon: '🐬' },
  { _id: 'd2', category: 'Database', name: 'MongoDB', level: 80, icon: '🍃' },
  { _id: 'd3', category: 'Database', name: 'SQLite', level: 75, icon: '💾' },
  { _id: 'd4', category: 'Database', name: 'PostgreSQL', level: 65, icon: '🐘' },
  // Tools
  { _id: 't1', category: 'Tools', name: 'Git & GitHub', level: 88, icon: '🔀' },
  { _id: 't2', category: 'Tools', name: 'Docker', level: 60, icon: '🐳' },
  { _id: 't3', category: 'Tools', name: 'Cloudinary', level: 80, icon: '☁️' },
  { _id: 't4', category: 'Tools', name: 'Postman / API Testing', level: 85, icon: '📮' },
  { _id: 't5', category: 'Tools', name: 'VS Code', level: 95, icon: '🛠️' },
];

const categoryConfig: Record<string, { icon: React.ElementType; color: string; gradient: string; description: string }> = {
  Frontend: {
    icon: Monitor,
    color: 'text-cyan-400',
    gradient: 'from-cyan-500/20 to-blue-500/10',
    description: 'Crafting responsive, pixel-perfect interfaces with modern frameworks.'
  },
  Backend: {
    icon: Server,
    color: 'text-emerald-400',
    gradient: 'from-emerald-500/20 to-green-500/10',
    description: 'Building robust REST APIs, server logic, and scalable microservices.'
  },
  Database: {
    icon: Database,
    color: 'text-violet-400',
    gradient: 'from-violet-500/20 to-purple-500/10',
    description: 'Designing efficient schemas, queries, and high-availability data stores.'
  },
  Tools: {
    icon: Wrench,
    color: 'text-amber-400',
    gradient: 'from-amber-500/20 to-orange-500/10',
    description: 'Leveraging DevOps tooling, CI/CD, cloud platforms, and developer utilities.'
  },
};

const getLevelLabel = (level: number): { label: string; color: string } => {
  if (level >= 90) return { label: 'Expert', color: 'text-emerald-400' };
  if (level >= 75) return { label: 'Advanced', color: 'text-primary' };
  if (level >= 60) return { label: 'Proficient', color: 'text-blue-400' };
  return { label: 'Learning', color: 'text-amber-400' };
};

const getLevelBarColor = (level: number) => {
  if (level >= 90) return 'from-emerald-400 to-cyan-400';
  if (level >= 75) return 'from-cyan-400 to-primary';
  if (level >= 60) return 'from-blue-400 to-cyan-400';
  return 'from-amber-400 to-orange-400';
};

// ─── Skill Bar Component ──────────────────────────────────────────────────────
const SkillBar = ({ skill, index }: { skill: any; index: number }) => {
  const [hovered, setHovered] = useState(false);
  const { label, color } = getLevelLabel(skill.level);
  const barColor = getLevelBarColor(skill.level);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 hover:border-primary/40 transition-all cursor-default"
    >
      {/* Hover Glow */}
      {hovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-2xl bg-primary/5 pointer-events-none"
        />
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{skill.icon || '⚡'}</span>
          <span className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-primary transition-colors">
            {skill.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5 ${color}`}>
            {label}
          </span>
          <span className="text-sm font-black text-gray-700 dark:text-gray-300 min-w-[38px] text-right">
            {skill.level}%
          </span>
        </div>
      </div>

      {/* Animated Progress Bar */}
      <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.15 + index * 0.07, ease: 'easeOut' }}
          className={`h-full rounded-full bg-gradient-to-r ${barColor} relative`}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_8px_rgba(0,255,255,0.8)]" />
        </motion.div>
      </div>
    </motion.div>
  );
};

// ─── Radar / Radial Visual ────────────────────────────────────────────────────
const OverallRadar = ({ skillsByCategory }: { skillsByCategory: Record<string, any[]> }) => {
  const cats = Object.entries(skillsByCategory).filter(([, skills]) => skills.length > 0);
  const totalSkills = Object.values(skillsByCategory).flat().length;
  const avgLevel = Math.round(
    Object.values(skillsByCategory).flat().reduce((s, sk) => s + sk.level, 0) / (totalSkills || 1)
  );
  const expertCount = Object.values(skillsByCategory).flat().filter(sk => sk.level >= 90).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {[
        { label: 'Total Skills', value: totalSkills, icon: Layers, suffix: '', color: 'text-primary' },
        { label: 'Avg Proficiency', value: avgLevel, icon: TrendingUp, suffix: '%', color: 'text-emerald-400' },
        { label: 'Expert Level', value: expertCount, icon: Star, suffix: '', color: 'text-amber-400' },
        { label: 'Skill Categories', value: cats.length, icon: Cpu, suffix: '', color: 'text-violet-400' },
      ].map(({ label, value, icon: Icon, suffix, color }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="p-5 bg-white dark:bg-[#0A0A0A] rounded-3xl border border-gray-200 dark:border-white/10 shadow-lg text-center space-y-2"
        >
          <div className={`mx-auto w-10 h-10 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center ${color}`}>
            <Icon size={20} />
          </div>
          <p className={`text-3xl font-black ${color}`}>
            {value}{suffix}
          </p>
          <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">{label}</p>
        </motion.div>
      ))}
    </div>
  );
};

// ─── Main Skills Component ────────────────────────────────────────────────────
const Skills = () => {
  const { data: rawSkills, isLoading } = useSkills();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (isLoading) return <LoadingSpinner />;

  const displaySkills: any[] = (rawSkills && rawSkills.length > 0) ? rawSkills : dummySkills;

  // Group by category
  const allCategories = Array.from(new Set(displaySkills.map(s => s.category)));
  const filteredSkills = activeCategory === 'All'
    ? displaySkills
    : displaySkills.filter(s => s.category === activeCategory);

  const skillsByCategory: Record<string, any[]> = {};
  allCategories.forEach(cat => {
    skillsByCategory[cat] = displaySkills.filter(s => s.category === cat);
  });

  const tabs = ['All', ...allCategories];

  return (
    <div className="min-h-screen pb-32 space-y-16 overflow-hidden">
      {/* ── HERO ── */}
      <section className="relative pt-28 pb-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/8 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
              <Sparkles size={14} /> Technical Proficiency Stack
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-gray-900 dark:text-white">
              Technical <span className="text-primary">Skills</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              A comprehensive engineering stack built through real-world production projects, research, and continuous self-improvement.
            </p>
          </motion.div>

          {/* KPI Overview Cards */}
          <OverallRadar skillsByCategory={skillsByCategory} />
        </div>
      </section>

      {/* ── FILTER TABS + VIEW TOGGLE ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {tabs.map(tab => {
              const config = categoryConfig[tab];
              const CatIcon = config?.icon;
              const isActive = activeCategory === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveCategory(tab)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all ${
                    isActive
                      ? 'bg-primary text-black border-primary shadow-lg shadow-primary/20 scale-105'
                      : 'bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-primary/40'
                  }`}
                >
                  {CatIcon && <CatIcon size={14} />}
                  <span>{tab}</span>
                  <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-black/20 text-black' : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400'
                  }`}>
                    {tab === 'All' ? displaySkills.length : skillsByCategory[tab]?.length ?? 0}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-1 rounded-xl self-start">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid' ? 'bg-primary text-black shadow' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'list' ? 'bg-primary text-black shadow' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              List
            </button>
          </div>
        </div>
      </section>

      {/* ── SKILLS CONTENT ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {activeCategory === 'All' ? (
            /* All categories - grouped view */
            <motion.div
              key="all"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className={viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 gap-8'
                : 'space-y-8'
              }
            >
              {allCategories.map((category, catIdx) => {
                const config = categoryConfig[category] || { icon: Zap, color: 'text-primary', gradient: 'from-primary/20 to-transparent', description: '' };
                const CatIcon = config.icon;
                const catSkills = skillsByCategory[category] || [];
                if (catSkills.length === 0) return null;

                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: catIdx * 0.1 }}
                    className={`bg-white dark:bg-[#0A0A0A] rounded-[32px] border border-gray-200 dark:border-white/10 shadow-xl overflow-hidden ${
                      viewMode === 'list' ? '' : ''
                    }`}
                  >
                    {/* Category Header */}
                    <div className={`p-6 bg-gradient-to-r ${config.gradient} border-b border-gray-100 dark:border-white/5 flex items-center justify-between`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-2xl bg-white dark:bg-white/10 shadow ${config.color}`}>
                          <CatIcon size={20} />
                        </div>
                        <div>
                          <h2 className={`text-lg font-black ${config.color}`}>{category}</h2>
                          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[260px]">{config.description}</p>
                        </div>
                      </div>
                      <span className="text-2xl font-black text-gray-300 dark:text-white/10">{catSkills.length}</span>
                    </div>

                    {/* Skills List */}
                    <div className="p-6 space-y-3">
                      {catSkills.map((skill, i) => (
                        <SkillBar key={skill._id} skill={skill} index={i} />
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            /* Single category filtered view */
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {(() => {
                const config = categoryConfig[activeCategory] || { icon: Zap, color: 'text-primary', gradient: 'from-primary/20 to-transparent', description: '' };
                const CatIcon = config.icon;
                return (
                  <div className="bg-white dark:bg-[#0A0A0A] rounded-[36px] border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className={`p-8 bg-gradient-to-r ${config.gradient} border-b border-gray-100 dark:border-white/5 flex items-center gap-4`}>
                      <div className={`p-4 rounded-3xl bg-white dark:bg-white/10 shadow-xl ${config.color}`}>
                        <CatIcon size={32} />
                      </div>
                      <div>
                        <h2 className={`text-3xl font-black ${config.color}`}>{activeCategory}</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{config.description}</p>
                      </div>
                    </div>

                    {/* Skills Grid */}
                    <div className={`p-8 ${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'space-y-4'}`}>
                      {filteredSkills.map((skill, i) => (
                        <SkillBar key={skill._id} skill={skill} index={i} />
                      ))}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── TECH PHILOSOPHY BANNER ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-white dark:bg-[#0A0A0A] rounded-[40px] border border-primary/20 p-10 sm:p-14 shadow-2xl overflow-hidden text-center space-y-6"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-violet-500/5 pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
              <Zap size={14} /> Engineering Philosophy
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white">
              Building with <span className="text-primary">precision</span>, shipping with <span className="text-primary">confidence</span>
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Every skill listed here is battle-tested in real production environments. I prioritize clean architecture, 
              maintainable codebases, and developer experience — not just checking boxes on a tech list.
            </p>

            {/* Tech Chips Row */}
            <div className="flex flex-wrap justify-center gap-2 pt-4">
              {['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'MySQL', 'Tailwind', 'Git', 'Docker', 'Cloudinary', 'REST APIs', 'Python'].map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="px-3 py-1.5 bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-gray-200 text-xs font-bold rounded-xl border border-gray-200 dark:border-white/10 hover:border-primary/50 hover:text-primary transition-all cursor-default"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Skills;
