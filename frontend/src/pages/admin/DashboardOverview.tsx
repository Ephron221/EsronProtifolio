import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Briefcase, 
  MessageSquare, 
  Settings, 
  Layers, 
  ShieldCheck,
  PlusCircle,
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useProjects, useSkills, useServices, useDocuments } from '../../hooks/usePortfolio';
import api from '../../services/api';

const DashboardOverview = () => {
  const navigate = useNavigate();
  const { data: projects } = useProjects();
  const { data: skills } = useSkills();
  const { data: services } = useServices();
  const { data: documents } = useDocuments();

  const { data: contacts } = useQuery(['contacts'], async () => {
    try {
      const { data } = await api.get('/contacts');
      return data;
    } catch {
      return [];
    }
  });

  const stats = [
    { label: 'Total Projects', value: projects?.length || 0, icon: Briefcase, color: 'text-primary' },
    { label: 'Skills Added', value: skills?.length || 0, icon: Settings, color: 'text-blue-500' },
    { label: 'Services Offered', value: services?.length || 0, icon: Layers, color: 'text-purple-500' },
    { label: 'Documents & Awards', value: documents?.length || 0, icon: ShieldCheck, color: 'text-yellow-500' },
    { label: 'Inquiries / Messages', value: contacts?.length || 0, icon: MessageSquare, color: 'text-secondary-success' },
  ];

  const recentInquiries = contacts?.slice(0, 4) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome back to your portfolio management hub.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="bg-white dark:bg-black/40 p-6 rounded-2xl border border-gray-200 dark:border-white/5 hover:border-primary/50 dark:hover:border-primary/20 transition-all shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gray-100 dark:bg-white/5 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
            <p className="text-gray-500 dark:text-gray-500 text-xs mt-1 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity / Inquiries */}
        <div className="lg:col-span-2 bg-white dark:bg-black/40 p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <Clock size={20} className="text-primary" /> Recent Inquiries
            </h2>
            <button 
              onClick={() => navigate('/admin/contacts')}
              className="text-sm text-primary hover:underline flex items-center gap-1 font-semibold"
            >
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-4">
            {recentInquiries.length > 0 ? (
              recentInquiries.map((inquiry: any) => (
                <div 
                  key={inquiry._id} 
                  onClick={() => navigate('/admin/contacts')}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-primary/30 transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
                    <MessageSquare size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{inquiry.name}</p>
                      <span className="text-[10px] text-gray-500">{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{inquiry.subject || inquiry.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">
                <MessageSquare size={36} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No messages received yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white dark:bg-black/40 p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Quick Actions</h2>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/admin/projects')}
              className="w-full p-4 text-left rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-primary hover:text-black transition-all font-medium group text-gray-700 dark:text-white flex items-center justify-between"
            >
              <span>Add / Manage Projects</span>
              <PlusCircle size={18} className="opacity-60 group-hover:opacity-100" />
            </button>
            <button 
              onClick={() => navigate('/admin/documents')}
              className="w-full p-4 text-left rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-primary hover:text-black transition-all font-medium group text-gray-700 dark:text-white flex items-center justify-between"
            >
              <span>Upload Certificate / Doc</span>
              <ShieldCheck size={18} className="opacity-60 group-hover:opacity-100" />
            </button>
            <button 
              onClick={() => navigate('/admin/cv')}
              className="w-full p-4 text-left rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-primary hover:text-black transition-all font-medium group text-gray-700 dark:text-white flex items-center justify-between"
            >
              <span>Update Curriculum Vitae</span>
              <FileText size={18} className="opacity-60 group-hover:opacity-100" />
            </button>
            <button 
              onClick={() => navigate('/admin/home')}
              className="w-full p-4 text-left rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-primary hover:text-black transition-all font-medium group text-gray-700 dark:text-white flex items-center justify-between"
            >
              <span>Edit Hero & Socials</span>
              <Settings size={18} className="opacity-60 group-hover:opacity-100" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
