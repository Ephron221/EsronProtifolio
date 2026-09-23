import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Mail, MessageCircle, Instagram, ArrowUp, Heart, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-50 dark:bg-black/90 border-t border-gray-200 dark:border-white/10 pt-16 pb-8 mt-20 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 dark:bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & Description */}
          <div className="col-span-1 lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <h3 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500 dark:from-primary dark:to-cyan-300 tracking-tight">
                ESRON
              </h3>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Crafting modern, scalable, and interactive digital experiences. Turning complex problems into elegant solutions.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Available for new opportunities
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6 relative inline-block">
              Explore
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-primary rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Projects', path: '/projects' },
                { name: 'About', path: '/about' },
                { name: 'Services', path: '/services' },
                { name: 'Skills', path: '/skills' }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-all duration-300 flex items-center group w-fit"
                  >
                    <span className="w-0 group-hover:w-4 h-0.5 bg-primary mr-0 group-hover:mr-2 transition-all duration-300 ease-out opacity-0 group-hover:opacity-100"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6 relative inline-block">
              Resources
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-primary rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Curriculum Vitae', path: '/cv' },
                { name: 'Credentials', path: '/documents' },
                { name: 'Contact Me', path: '/contact' }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-all duration-300 flex items-center group w-fit"
                  >
                    <span className="w-0 group-hover:w-4 h-0.5 bg-primary mr-0 group-hover:mr-2 transition-all duration-300 ease-out opacity-0 group-hover:opacity-100"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6 relative inline-block">
              Get in Touch
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-primary rounded-full"></span>
            </h4>
            <ul className="space-y-4">
              <li>
                <a href="mailto:esront21@gmail.com" className="flex items-start gap-3 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors group">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 group-hover:bg-primary/10 transition-colors mt-1">
                    <Mail size={16} className="text-gray-500 dark:text-gray-400 group-hover:text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-0.5 transition-colors">Email</p>
                    <p className="text-sm break-all">esront21@gmail.com</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="https://wa.me/250787846344" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors group">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 group-hover:bg-primary/10 transition-colors mt-1">
                    <Phone size={16} className="text-gray-500 dark:text-gray-400 group-hover:text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-0.5 transition-colors">WhatsApp</p>
                    <p className="text-sm">+250 787 846 344</p>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Social Links & Copyright */}
        <div className="border-t border-gray-200 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://github.com/Ephron221" target="_blank" rel="noopener noreferrer" aria-label="GitHub" 
               className="p-2.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white dark:hover:bg-primary transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md">
              <Github size={20} />
            </a>
            <a href="https://linkedin.com/in/esron-tuyishimire" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
               className="p-2.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-[#0A66C2] hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md">
              <Linkedin size={20} />
            </a>
            <a href="https://x.com/Esron221" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)"
               className="p-2.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md">
              <Twitter size={20} />
            </a>
            <a href="https://www.instagram.com/esront2/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
               className="p-2.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md">
              <Instagram size={20} />
            </a>
            <a href="https://wa.me/250787846344" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
               className="p-2.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-[#25D366] hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md">
              <MessageCircle size={20} />
            </a>
          </div>

          <div className="text-center md:text-left">
            <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center justify-center md:justify-start gap-1">
              © {currentYear} Esron Portfolio. Made with 
              <Heart size={14} className="text-red-500 animate-pulse fill-red-500 mx-1" />
            </p>
          </div>

          <button 
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="p-3 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white dark:hover:bg-primary transition-all duration-300 shadow-sm hover:shadow-md group"
          >
            <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
