import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/admin/ProtectedRoute';
import Chatbot from './components/common/Chatbot';

// Lazy loaded pages
const Home = lazy(() => import('./pages/public/Home'));
const About = lazy(() => import('./pages/public/About'));
const Projects = lazy(() => import('./pages/public/Projects'));
const Services = lazy(() => import('./pages/public/Services'));
const Skills = lazy(() => import('./pages/public/Skills'));
const Contact = lazy(() => import('./pages/public/Contact'));
const CVViewer = lazy(() => import('./pages/public/CVViewer'));
const Documents = lazy(() => import('./pages/public/Documents'));
const DocumentViewer = lazy(() => import('./pages/public/DocumentViewer'));

// Admin Pages
const Login = lazy(() => import('./pages/admin/Login'));
const DashboardLayout = lazy(() => import('./pages/admin/DashboardLayout'));
const DashboardOverview = lazy(() => import('./pages/admin/DashboardOverview'));
const ManageHome = lazy(() => import('./pages/admin/ManageHome'));
const ManageAbout = lazy(() => import('./pages/admin/ManageAbout'));
const ManageProjects = lazy(() => import('./pages/admin/ManageProjects'));
const ManageSkills = lazy(() => import('./pages/admin/ManageSkills'));
const ManageServices = lazy(() => import('./pages/admin/ManageServices'));
const ManageContacts = lazy(() => import('./pages/admin/ManageContacts'));
const ManageCV = lazy(() => import('./pages/admin/ManageCV'));
const ManageDocuments = lazy(() => import('./pages/admin/ManageDocuments'));

function App() {
  const location = useLocation();
  // We want to hide navbar/footer only for the protected admin DASHBOARD pages,
  // but keep them for the public-facing admin LOGIN page.
  const isDashboardPath = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      {!isDashboardPath && <Navbar />}
      
      <main className={!isDashboardPath ? "pt-20" : ""}>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/services" element={<Services />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cv" element={<CVViewer />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/document/:id" element={<DocumentViewer />} />

            {/* Admin Auth - Now has Navbar/Footer */}
            <Route path="/admin/login" element={<Login />} />

            {/* Protected Admin Routes - Dashboard (No Navbar/Footer) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<DashboardLayout />}>
                <Route index element={<DashboardOverview />} />
                <Route path="dashboard" element={<DashboardOverview />} />
                <Route path="home" element={<ManageHome />} />
                <Route path="about" element={<ManageAbout />} />
                <Route path="projects" element={<ManageProjects />} />
                <Route path="skills" element={<ManageSkills />} />
                <Route path="services" element={<ManageServices />} />
                <Route path="contacts" element={<ManageContacts />} />
                <Route path="cv" element={<ManageCV />} />
                <Route path="documents" element={<ManageDocuments />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </main>
      
      {!isDashboardPath && <Chatbot />}
      {!isDashboardPath && <Footer />}
    </div>
  );
}

export default App;
