import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const onSubmit = async (data: any) => {
    setError(null);
    try {
      const response = await api.post('/auth/login', data);
      localStorage.setItem('token', response.data.token);
      // Ensure the API instance uses the new token immediately
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-10 space-y-8 glass-dark rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 text-primary/5 -z-10">
          <LogIn size={120} />
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-black mb-2 leading-none tracking-tighter">
            Admin <span className="text-primary">Login</span>
          </h1>
          <p className="text-gray-400">Access your portfolio dashboard</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Email Address</label>
            <input
              {...register('email', { required: true })}
              type="email"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-primary transition-all text-white"
              placeholder="admin@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Password</label>
            <input
              {...register('password', { required: true })}
              type="password"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-primary transition-all text-white"
              placeholder="••••••••"
            />
          </div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 text-sm text-red-400 bg-red-500/10 p-4 rounded-2xl border border-red-500/20"
            >
              <AlertCircle size={18} /> {error}
            </motion.div>
          )}

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full h-14 bg-primary text-black font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn size={20}/> Secure Login
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
