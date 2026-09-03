import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Lock,
  ChevronLeft,
  ZoomIn,
  ZoomOut,
  ShieldCheck,
  RefreshCcw,
  AlertTriangle,
  RotateCw,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Setup for PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const CVViewer = () => {
  const navigate = useNavigate();
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  const [numPages, setNumPages] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Responsive container width measuring
  useEffect(() => {
    const container = pdfContainerRef.current;
    if (!container) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(Math.floor(entry.contentRect.width));
        }
      }
    });
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  // Fetch CV data
  const { data: cvData, isLoading, isError, error } = useQuery(['cv'], async () => {
    const response = await api.get('/cv');
    return response.data;
  });

  // Strict View-Only Anti-Download & Anti-Print protections
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['p', 's', 'u', 'c', 'a'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setPdfError(null);
  }

  function onDocumentLoadError(error: Error): void {
    console.error("PDF.js Load Error:", error.message);
    setPdfError(`Failed to load CV preview (${error.message}).`);
  }

  const cv = Array.isArray(cvData) ? cvData[0] : cvData;
  // Use the backend proxy endpoint to serve the PDF — avoids Cloudinary 401 direct-access errors
  const fileUrl = cv?.fileUrl ? `${api.defaults.baseURL}/cv/file` : '';

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <LoadingSpinner />
          <span className="text-xs font-semibold text-gray-400">Loading verified Curriculum Vitae...</span>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center text-red-500 p-8 text-center">
          <AlertTriangle size={36} className="mb-2" />
          <p className="font-bold">Error loading CV</p>
          <p className="text-xs text-red-400 mt-1">{error instanceof Error ? error.message : 'CV file is not currently available.'}</p>
        </div>
      );
    }

    if (pdfError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center text-red-500 p-8 text-center">
          <AlertTriangle size={36} className="mb-2" />
          <p className="font-bold">{pdfError}</p>
        </div>
      );
    }

    if (fileUrl && containerWidth > 0) {
      return (
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <LoadingSpinner />
              <span className="text-xs font-semibold text-gray-400">Rendering secure canvas pages...</span>
            </div>
          }
          className="flex flex-col items-center py-4 w-full"
          onContextMenu={(e) => e.preventDefault()}
        >
          {Array.from(new Array(numPages || 0), (_, index) => (
            <div key={`cv_page_${index + 1}`} className="mb-6 relative shadow-2xl rounded-xl overflow-hidden">
              <Page
                pageNumber={index + 1}
                width={Math.min(containerWidth - 32, 850)}
                scale={zoom}
                rotate={rotation}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 select-none"
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
          ))}
        </Document>
      );
    }

    return (
      <div className='w-full h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center'>
        <Lock size={40} className="mb-3 text-gray-500" />
        <p className='font-bold text-base text-gray-800 dark:text-gray-200'>No CV Uploaded</p>
        <p className='text-xs text-gray-500 mt-1 max-w-sm'>
          The curriculum vitae has not been uploaded yet. Please check back soon or contact Esron directly.
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black transition-colors duration-500">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header & Zoom Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-1.5 text-gray-500 hover:text-primary transition-colors font-bold text-xs mb-2"
            >
              <ChevronLeft size={16} /> Back
            </button>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              Curriculum <span className="text-primary">Vitae</span>
            </h1>
            <div className="flex items-center gap-2 pt-1">
              <span className="px-2.5 py-0.5 bg-yellow-500/10 text-yellow-500 rounded-full text-[10px] font-black uppercase tracking-wider border border-yellow-500/20">
                View-Only Mode
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 uppercase">
                <ShieldCheck size={12} /> Protected Document
              </span>
            </div>
          </div>

          {/* Interactive Zoom & Rotate Toolbar (Works on Mobile & Desktop) */}
          <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-white/5 p-1.5 rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg self-start sm:self-center">
            <button 
              onClick={() => setZoom(prev => Math.max(0.6, Number((prev - 0.15).toFixed(2))))} 
              className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-xl transition-all text-gray-700 dark:text-gray-300" 
              title="Zoom Out"
            >
              <ZoomOut size={18} />
            </button>

            <button
              onClick={() => setZoom(1.0)}
              className="px-2 py-1 text-xs font-black text-gray-900 dark:text-white min-w-[50px] text-center hover:bg-white dark:hover:bg-white/10 rounded-lg transition-all"
              title="Reset Zoom"
            >
              {Math.round(zoom * 100)}%
            </button>

            <button 
              onClick={() => setZoom(prev => Math.min(2.2, Number((prev + 0.15).toFixed(2))))} 
              className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-xl transition-all text-gray-700 dark:text-gray-300" 
              title="Zoom In"
            >
              <ZoomIn size={18} />
            </button>

            <div className="w-[1px] h-5 bg-gray-300 dark:bg-white/10 mx-1"></div>

            <button 
              onClick={() => setRotation(prev => (prev + 90) % 360)} 
              className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-xl transition-all text-gray-700 dark:text-gray-300" 
              title="Rotate 90°"
            >
              <RotateCw size={18} />
            </button>
          </div>
        </div>

        {/* Security Warning Banner */}
        <div className="p-3.5 bg-primary/5 border border-primary/15 rounded-2xl flex items-center gap-3 text-xs">
          <Lock className="text-primary shrink-0" size={18} />
          <p className="text-gray-600 dark:text-gray-400">
            <strong className="text-gray-900 dark:text-white">Protected Document:</strong> Downloading, printing, and extraction are restricted across all devices. Use zoom controls to inspect CV details.
          </p>
        </div>

        {/* SECURE CV CANVAS CONTAINER */}
        <div className="relative group">
          <motion.div
            layout
            ref={pdfContainerRef}
            className="relative bg-zinc-100 dark:bg-zinc-950 rounded-[32px] shadow-2xl border-4 border-gray-100 dark:border-white/5 transition-all duration-500 flex flex-col items-center p-2 sm:p-6"
          >
            {/* Protection Shield */}
            <div className="absolute inset-0 z-30 pointer-events-none" onContextMenu={(e) => e.preventDefault()} />
            
            {/* Watermark */}
            <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.03] dark:opacity-[0.04] flex flex-wrap gap-24 p-24 overflow-hidden rotate-[-20deg] select-none">
              {[...Array(30)].map((_, i) => (
                <span key={i} className="text-5xl font-black whitespace-nowrap text-black dark:text-white uppercase tracking-widest">
                  ESRON PROTECTED CV
                </span>
              ))}
            </div>
            
            {renderContent()}
            
            <div className="sticky bottom-6 self-end z-40 mr-2 px-4 py-2 bg-black/60 dark:bg-black/80 backdrop-blur-xl rounded-full border border-primary/30 flex items-center gap-2 mt-4">
              <RefreshCcw size={12} className="text-primary animate-spin-slow" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Protected Canvas</span>
            </div>
          </motion.div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-gray-500 pt-2">
          <p>For formal recruitment inquiries, please connect via the <a href="/contact" className="text-primary font-bold hover:underline">Contact Page</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default CVViewer;
