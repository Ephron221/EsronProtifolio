import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle,
  Sparkles, Clock, Github, Linkedin, Twitter, ExternalLink,
  MessageSquare, ArrowRight, Globe, Zap, User, AtSign, FileText
} from 'lucide-react';
import api from '../../services/api';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const CONTACT_INFO = [
  {
    icon: Mail,
    label: 'Email',
    value: 'esront21@gmail.com',
    link: 'mailto:esront21@gmail.com',
    description: 'Fastest response channel',
    color: 'text-cyan-400',
    bg: 'from-cyan-500/15 to-blue-500/5',
    border: 'border-cyan-500/20 hover:border-cyan-400/60'
  },
  {
    icon: Phone,
    label: 'Phone / WhatsApp',
    value: '+250 787 846 344',
    link: 'tel:+250787846344',
    description: 'Available Mon – Fri, 8am–6pm CAT',
    color: 'text-emerald-400',
    bg: 'from-emerald-500/15 to-green-500/5',
    border: 'border-emerald-500/20 hover:border-emerald-400/60'
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Kigali, Rwanda',
    link: 'https://maps.google.com/?q=Kigali,Rwanda',
    description: 'Open to remote & on-site work',
    color: 'text-violet-400',
    bg: 'from-violet-500/15 to-purple-500/5',
    border: 'border-violet-500/20 hover:border-violet-400/60'
  },
];

const SOCIALS = [
  { icon: Github, label: 'GitHub', href: 'https://github.com/', color: 'hover:text-white' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/', color: 'hover:text-blue-400' },
  { icon: Twitter, label: 'Twitter / X', href: 'https://twitter.com/', color: 'hover:text-sky-400' },
  { icon: Globe, label: 'Portfolio', href: '/', color: 'hover:text-primary' },
];

const QUICK_SUBJECTS = [
  '🚀 New Project Collaboration',
  '💼 Job / Freelance Offer',
  '🛠️ Technical Consulting',
  '🤝 Partnership Inquiry',
  '🐛 Bug Report / Support',
  '💬 General Inquiry',
];

const FAQ = [
  {
    q: 'How quickly do you respond?',
    a: 'Usually within 24 hours on weekdays. For urgent matters, reach out directly via WhatsApp.'
  },
  {
    q: 'Are you available for remote work?',
    a: 'Yes — I work with international clients fully remote and am open to hybrid arrangements.'
  },
  {
    q: 'Do you offer freelance services?',
    a: 'Absolutely. I take on selected freelance projects for web apps, APIs, and system design.'
  },
];

const Contact = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ContactForm>();

  const watchedSubject = watch('subject', '');

  const onSubmit = async (data: ContactForm) => {
    setStatus('loading');
    try {
      await api.post('/contacts', data);
      setStatus('success');
      reset();
      setTimeout(() => setStatus('idle'), 6000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3.5 bg-gray-50 dark:bg-white/[0.03] border ${hasError ? 'border-red-400' : 'border-gray-200 dark:border-white/10 focus:border-primary'} rounded-2xl text-sm text-gray-900 dark:text-white outline-none transition-all placeholder:text-gray-400`;

  return (
    <div className="min-h-screen pb-32 overflow-hidden">

      {/* ── HERO HEADER ─────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-4">
              <MessageSquare size={14} /> Let's Build Together
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-gray-900 dark:text-white">
              Get in <span className="text-primary">Touch</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mt-4">
              Have a project in mind, a job opportunity, or simply want to connect? Drop a message and I'll get back to you promptly.
            </p>
          </motion.div>

          {/* Availability Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold"
          >
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Available for new projects & collaborations
          </motion.div>
        </div>
      </section>

      {/* ── MAIN GRID ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* ── LEFT SIDEBAR ── */}
          <div className="lg:col-span-4 space-y-6">

            {/* Contact Info Cards */}
            {CONTACT_INFO.map((info, i) => (
              <motion.a
                key={info.label}
                href={info.link}
                target={info.link.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center gap-4 p-5 bg-white dark:bg-[#0A0A0A] rounded-3xl border ${info.border} shadow-lg transition-all group bg-gradient-to-br ${info.bg}`}
              >
                <div className={`w-12 h-12 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center shadow ${info.color} shrink-0 group-hover:scale-110 transition-transform`}>
                  <info.icon size={22} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-0.5">{info.label}</p>
                  <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{info.value}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{info.description}</p>
                </div>
                <ExternalLink size={14} className="text-gray-400 shrink-0 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.a>
            ))}

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="p-6 bg-white dark:bg-[#0A0A0A] rounded-3xl border border-gray-200 dark:border-white/10 shadow-lg space-y-4"
            >
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={16} className="text-primary" /> Find Me Online
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {SOCIALS.map(({ icon: Icon, label, href, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 rounded-2xl text-gray-600 dark:text-gray-400 ${color} transition-all text-xs font-bold hover:border-primary/30 hover:scale-105`}
                  >
                    <Icon size={16} /> {label}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Response Time Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
              className="p-6 bg-primary/5 border border-primary/20 rounded-3xl space-y-2"
            >
              <div className="flex items-center gap-2 text-primary">
                <Clock size={18} />
                <span className="text-sm font-black">Typical Response Time</span>
              </div>
              <p className="text-3xl font-black text-gray-900 dark:text-white">
                &lt; 24<span className="text-lg text-gray-500 font-semibold"> hrs</span>
              </p>
              <p className="text-xs text-gray-500">Monday through Friday · Central Africa Time (CAT)</p>
            </motion.div>
          </div>

          {/* ── RIGHT: CONTACT FORM ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-8"
          >
            <div className="bg-white dark:bg-[#0A0A0A] rounded-[40px] border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden">
              {/* Form Header */}
              <div className="p-8 border-b border-gray-100 dark:border-white/5 bg-gradient-to-r from-primary/5 to-transparent">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl text-primary"><Send size={20} /></div>
                  Send a Direct Message
                </h2>
                <p className="text-sm text-gray-500 mt-1.5">All fields required. Your information is kept private.</p>
              </div>

              <div className="p-8 space-y-8">
                {/* Quick Subject Chips */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Zap size={13} className="text-primary" /> Quick Topic Selection
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_SUBJECTS.map(subject => (
                      <button
                        key={subject}
                        type="button"
                        onClick={() => setValue('subject', subject)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          watchedSubject === subject
                            ? 'bg-primary text-black border-primary shadow-md shadow-primary/20'
                            : 'bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-primary/50'
                        }`}
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Fields */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                        <User size={13} className="text-primary" /> Your Name
                      </label>
                      <input
                        {...register('name', { required: 'Name is required' })}
                        type="text"
                        placeholder="Esron IT"
                        className={inputClass(!!errors.name)}
                      />
                      {errors.name && (
                        <p className="text-red-400 text-xs flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                        <AtSign size={13} className="text-primary" /> Email Address
                      </label>
                      <input
                        {...register('email', {
                          required: 'Email is required',
                          pattern: { value: /^\S+@\S+$/i, message: 'Enter a valid email' }
                        })}
                        type="email"
                        placeholder="esron@gmail.com"
                        className={inputClass(!!errors.email)}
                      />
                      {errors.email && (
                        <p className="text-red-400 text-xs flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Phone size={13} className="text-primary" /> Phone Number
                      </label>
                      <input
                        {...register('phone', { required: 'Phone number is required' })}
                        type="tel"
                        placeholder="+250 787 846 344"
                        className={inputClass(!!errors.phone)}
                      />
                      {errors.phone && (
                        <p className="text-red-400 text-xs flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText size={13} className="text-primary" /> Subject
                    </label>
                    <input
                      {...register('subject', { required: 'Subject is required' })}
                      type="text"
                      placeholder="What's this about?"
                      className={inputClass(!!errors.subject)}
                    />
                    {errors.subject && (
                      <p className="text-red-400 text-xs flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.subject.message}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <MessageSquare size={13} className="text-primary" /> Message
                    </label>
                    <textarea
                      {...register('message', {
                        required: 'Message is required',
                        minLength: { value: 10, message: 'Please write at least 10 characters' }
                      })}
                      rows={5}
                      placeholder="Tell me about your project, idea, or question in detail..."
                      className={`${inputClass(!!errors.message)} resize-none`}
                    />
                    {errors.message && (
                      <p className="text-red-400 text-xs flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.message.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-4 bg-primary text-black font-black text-sm rounded-2xl hover:bg-cyan-300 transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Send Direct Message</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  {/* Status Feedback */}
                  <AnimatePresence>
                    {status === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-400"
                      >
                        <CheckCircle2 size={20} className="shrink-0" />
                        <div>
                          <p className="font-bold text-sm">Message sent successfully! 🎉</p>
                          <p className="text-xs opacity-75">I'll get back to you within 24 hours.</p>
                        </div>
                      </motion.div>
                    )}
                    {status === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-400"
                      >
                        <AlertCircle size={20} className="shrink-0" />
                        <div>
                          <p className="font-bold text-sm">Message failed to send</p>
                          <p className="text-xs opacity-75">Please try again or email me directly at esront21@gmail.com</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ SECTION ─────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-black text-primary uppercase tracking-widest">Before You Write</span>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white">
            Common <span className="text-primary">Questions</span>
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-[#0A0A0A] rounded-3xl border border-gray-200 dark:border-white/10 shadow-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-6 flex items-center justify-between text-left gap-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
              >
                <span className="font-bold text-gray-900 dark:text-white text-sm">{faq.q}</span>
                <motion.div
                  animate={{ rotate: openFaq === i ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 text-primary"
                >
                  <ArrowRight size={18} />
                </motion.div>
              </button>

              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-white/5 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Contact;
