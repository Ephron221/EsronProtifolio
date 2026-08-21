import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Home, 
  User, 
  Briefcase, 
  Settings, 
  Layers, 
  MessageSquare, 
  LogOut,
  ChevronRight,
  Menu,
  X,
  FileText,
  ExternalLink,
  Bell,
  Search,
  ShieldCheck,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useTheme } from '../../context/ThemeContext';

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Home Section', path: '/admin/home', icon: Home },
    { name: 'About Me', path: '/admin/about', icon: User },
    { name: 'Projects', path: '/admin/projects', icon: Briefcase },
    { name: 'Skills', path: '/admin/skills', icon: Settings },
    { name: 'Services', path: '/admin/services', icon: Layers },
    { name: 'Manage CV', path: '/admin/cv', icon: FileText },
    { name: 'Documents', path: '/admin/documents', icon: ShieldCheck },
    { name: 'Messages', path: '/admin/contacts', icon: MessageSquare },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-light-bg dark:bg-[#020202] text-light-text dark:text-gray-100 selection:bg-primary/30 selection:text-primary">
      {/* Sidebar */}
      <aside 
        className={clsx(
          "fixed inset-y-0 left-0 z-50 bg-white dark:bg-[#080808] border-r border-gray-200 dark:border-white/5 transition-all duration-500 ease-in-out shadow-2xl",
          isSidebarOpen ? "w-72" : "w-20"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-24 px-8 border-b border-gray-200 dark:border-white/5">
            <AnimatePresence mode="wait">
              {isSidebarOpen ? (
                <motion.div
                  key="logo-full"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-black font-black text-xl shadow-[0_0_20px_rgba(0,255,255,0.4)]">
                    E
                  </div>
                  <span className="font-bold text-lg tracking-wider text-gray-900 dark:text-white">ADMIN <span className="text-primary">HUB</span></span>
                </motion.div>
              ) : (
                <motion.div
                  key="logo-short"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mx-auto"
                >
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-black font-black text-xl shadow-[0_0_20px_rgba(0,255,255,0.4)]">
                    E
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto scrollbar-hide">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path === '/admin/dashboard' && location.pathname === '/admin');
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    "flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.03]"
                  )}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                    />
                  )}
                  <item.icon size={22} className={clsx("min-w-[22px] transition-transform group-hover:scale-110", isActive && "text-primary")} />
                  {isSidebarOpen && (
                    <span className="ml-4 font-semibold tracking-wide">{item.name}</span>
                  )}
                  {isSidebarOpen && isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="ml-auto"
                    >
                      <ChevronRight size={16} />
                    </motion.div>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="p-6 border-t border-gray-200 dark:border-white/5 space-y-4">
            <Link 
              to="/" 
              target="_blank"
              className={clsx(
                "flex items-center w-full px-4 py-3.5 rounded-2xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all",
                !isSidebarOpen && "justify-center"
              )}
            >
              <ExternalLink size={20} />
              {isSidebarOpen && <span className="ml-4 font-semibold">Live Site</span>}
            </Link>
            
            <button
              onClick={handleLogout}
              className={clsx(
                "flex items-center w-full px-4 py-3.5 rounded-2xl text-red-500/70 hover:text-red-500 hover:bg-red-500/10 transition-all",
                !isSidebarOpen && "justify-center"
              )}
            >
              <LogOut size={20} />
              {isSidebarOpen && <span className="ml-4 font-semibold">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={clsx(
        "flex-1 transition-all duration-500",
        isSidebarOpen ? "ml-72" : "ml-20"
      )}>
        {/* Top Header */}
        <header className={clsx(
          "sticky top-0 z-40 px-10 flex items-center justify-between h-24 transition-all duration-300 backdrop-blur-xl border-b",
          scrolled ? "bg-white/80 dark:bg-black/60 border-gray-200 dark:border-white/10" : "bg-transparent border-transparent"
        )}>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl transition-all border border-gray-200 dark:border-white/5"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5 group focus-within:border-primary/50 transition-all">
              <Search size={18} className="text-gray-500 group-focus-within:text-primary" />
              <input 
                type="text" 
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-gray-500 dark:placeholder:text-gray-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Mode Switcher */}
            <button 
              onClick={toggleTheme}
              className="p-2.5 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl transition-all border border-gray-200 dark:border-white/5 group relative text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDarkMode ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, scale: 0.7, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 90, scale: 0.7, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun size={20} className="text-yellow-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, scale: 0.7, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: -90, scale: 0.7, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon size={20} className="text-gray-700" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <button className="relative p-2.5 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl transition-all border border-gray-200 dark:border-white/5 group">
              <Bell size={20} className="text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(0,255,255,0.8)]"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">Esron Admin</p>
                <p className="text-[10px] text-primary uppercase font-black tracking-widest mt-1">Superuser</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 p-[1.5px]">
                <div className="w-full h-full rounded-[10px] bg-gray-900 dark:bg-black flex items-center justify-center overflow-hidden">
                   <User size={20} className="text-primary" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-10 pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
