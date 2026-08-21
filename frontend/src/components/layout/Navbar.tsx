import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Services', path: '/services' },
    { name: 'Skills', path: '/skills' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={clsx(
      'fixed w-full z-50 transition-all duration-500 ease-in-out',
      scrolled
        ? 'top-4 px-4'
        : 'top-0 px-0'
    )}>
      <div className={clsx(
        'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-500',
        scrolled
          ? 'glass-dark rounded-full py-2 shadow-2xl border border-primary/20 max-w-5xl'
          : 'bg-transparent py-4'
      )}>
        <div className="flex items-center justify-between h-14 md:h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl md:text-2xl font-black tracking-tighter text-primary cyan-glow">
              ESRON
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1 lg:space-x-4">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={clsx(
                      'relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300',
                      isActive
                        ? 'text-black dark:text-black'
                        : 'text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary'
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-primary rounded-full shadow-[0_0_15px_rgba(0,255,255,0.5)]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.name}</span>
                  </Link>
                );
              })}
              
              <div className="h-6 w-[1px] bg-gray-300 dark:bg-white/10 mx-2" />

              <Link
                to="/admin/login" 
                className="group flex items-center gap-2 px-5 py-2 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm font-bold hover:border-primary hover:text-primary transition-all"
              >
                <Lock size={14} className="group-hover:scale-110 transition-transform" />
                <span>CMS</span>
              </Link>

              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="ml-2 p-2.5 rounded-full hover:bg-primary/10 transition-colors group"
              >
                {isDarkMode ? (
                  <Sun size={18} className="text-primary group-hover:rotate-45 transition-transform" />
                ) : (
                  <Moon size={18} className="text-gray-600 dark:text-gray-400 group-hover:-rotate-12 transition-transform" />
                )}
              </button>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-full hover:bg-primary/10 transition-colors"
            >
              {isDarkMode ? <Sun size={20} className="text-primary" /> : <Moon size={20} className="text-gray-600" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-black transition-all"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden px-4 pt-2"
          >
            <div className="glass-dark rounded-3xl overflow-hidden border border-primary/20 shadow-2xl p-2 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={clsx(
                    'block px-4 py-3 rounded-2xl text-base font-semibold transition-all',
                    location.pathname === link.path
                      ? 'text-black bg-primary shadow-lg shadow-primary/20'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-primary/10 hover:text-primary'
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-[1px] bg-gray-200 dark:bg-white/10 my-2 mx-4" />
              <Link
                to="/admin/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl text-base font-bold text-primary hover:bg-primary/10"
              >
                <Lock size={18} />
                <span>CMS DASHBOARD</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
