import React from 'react';
import { motion } from 'framer-motion';
import { useAbout } from '../../hooks/usePortfolio';
import { BASE_URL } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { 
  BookOpen, 
  Briefcase, 
  Target, 
  Award, 
  Languages, 
  Heart 
} from 'lucide-react';

const About = () => {
  const { data: aboutData, isLoading } = useAbout();

  if (isLoading) return <LoadingSpinner />;
  if (!aboutData || !aboutData.biography) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-bold mb-4">No Profile Data Found</h2>
        <p className="text-gray-400 max-w-md">Please log in to the admin panel and fill out your professional bio to see it displayed here.</p>
      </div>
    );
  }

  // Helper to get correct image URL
  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${BASE_URL}${path}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              {aboutData.title || 'About'} <span className="text-primary">Me</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {aboutData.subtitle || 'A journey through my professional life and passion for technology.'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Image Side */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative z-10 rounded-[40px] overflow-hidden border-2 border-primary/20 bg-[#0A0A0A] p-4 shadow-2xl">
                {aboutData.aboutImage ? (
                  <img 
                    src={getImageUrl(aboutData.aboutImage)} 
                    alt="Profile" 
                    className="w-full h-auto rounded-[30px] grayscale hover:grayscale-0 transition-all duration-700"
                  />
                ) : (
                  <div className="aspect-[4/5] bg-white/5 flex items-center justify-center text-gray-700">
                    <BookOpen size={80} />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl -z-10"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl -z-10"></div>
            </motion.div>

            {/* Bio Side */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 space-y-8"
            >
              <div className="glass-dark p-10 rounded-[40px] border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-primary/10">
                  <BookOpen size={120} />
                </div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Briefcase size={20} />
                  </div>
                  Biography
                </h2>
                <p className="text-gray-400 leading-relaxed text-lg whitespace-pre-wrap">
                  {aboutData.biography}
                </p>
              </div>

              <div className="glass-dark p-10 rounded-[40px] border border-white/5 relative overflow-hidden">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Target size={20} />
                  </div>
                  My Vision
                </h2>
                <p className="text-gray-400 leading-relaxed text-lg italic">
                  "{aboutData.goals}"
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experience & Education Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Experience */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-black mb-12 flex items-center gap-4">
              <span className="p-3 bg-primary/10 rounded-2xl text-primary"><Briefcase size={28} /></span>
              Work Experience
            </h2>
            <div className="space-y-12 relative before:absolute before:inset-y-0 before:left-[19px] before:w-[2px] before:bg-gradient-to-b before:from-primary before:to-transparent">
              {aboutData.experience?.map((exp: any, index: number) => (
                <motion.div key={index} variants={itemVariants} className="relative pl-12">
                  <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-[#0A0A0A] border-2 border-primary flex items-center justify-center z-10 shadow-[0_0_15px_rgba(0,255,255,0.3)]">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  </div>
                  <div className="glass-dark p-8 rounded-3xl border border-white/5 hover:border-primary/20 transition-all group">
                    <span className="text-primary text-sm font-bold tracking-widest uppercase block mb-2">{exp.duration}</span>
                    <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{exp.position}</h3>
                    <p className="text-gray-400 font-medium mb-4">{exp.company}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{exp.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Education */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-black mb-12 flex items-center gap-4">
              <span className="p-3 bg-primary/10 rounded-2xl text-primary"><BookOpen size={28} /></span>
              Education
            </h2>
            <div className="space-y-12 relative before:absolute before:inset-y-0 before:left-[19px] before:w-[2px] before:bg-gradient-to-b before:from-primary before:to-transparent">
              {aboutData.education?.map((edu: any, index: number) => (
                <motion.div key={index} variants={itemVariants} className="relative pl-12">
                  <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-[#0A0A0A] border-2 border-primary flex items-center justify-center z-10 shadow-[0_0_15px_rgba(0,255,255,0.3)]">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  </div>
                  <div className="glass-dark p-8 rounded-3xl border border-white/5 hover:border-primary/20 transition-all group">
                    <span className="text-primary text-sm font-bold tracking-widest uppercase block mb-2">{edu.year}</span>
                    <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{edu.degree}</h3>
                    <p className="text-gray-400 font-medium mb-4">{edu.institution}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{edu.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Achievements & Misc */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Achievements */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-3xl font-black flex items-center gap-4">
              <span className="p-3 bg-primary/10 rounded-2xl text-primary"><Award size={28} /></span>
              Key Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aboutData.achievements?.map((ach: any, index: number) => (
                <motion.div 
                  key={index}
                  whileHover={{ y: -5 }}
                  className="glass-dark p-8 rounded-3xl border border-white/5"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                      <Award size={24} />
                    </div>
                    <span className="text-xs font-bold text-gray-500 tracking-widest">{ach.year}</span>
                  </div>
                  <h4 className="text-xl font-bold mb-2">{ach.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{ach.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Languages & Interests Sidebar */}
          <div className="space-y-8">
            <div className="glass-dark p-8 rounded-[40px] border border-white/5">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <Languages size={24} className="text-primary" /> Languages
              </h2>
              <div className="space-y-6">
                {aboutData.languages?.map((lang: any, index: number) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="font-bold">{lang.name}</span>
                      <span className="text-xs text-primary font-bold uppercase tracking-widest">{lang.proficiency}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: lang.proficiency === 'Native' ? '100%' : lang.proficiency === 'Fluent' ? '90%' : lang.proficiency === 'Intermediate' ? '70%' : '40%' }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-dark p-8 rounded-[40px] border border-white/5">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Heart size={24} className="text-primary" /> Interests
              </h2>
              <div className="flex flex-wrap gap-3">
                {aboutData.interests?.map((interest: string, index: number) => (
                  <span key={index} className="px-5 py-2 glass rounded-full text-sm font-medium border border-white/5">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
