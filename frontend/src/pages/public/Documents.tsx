import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDocuments } from '../../hooks/usePortfolio';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import { 
  ShieldCheck, 
  Award, 
  FileText, 
  Lock, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RefreshCcw,
  ChevronRight,
  Search,
  RotateCw,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Setup for PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Documents = () => {
  const { data: documents, isLoading } = useDocuments();
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [zoom, setZoom] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [search, setSearch] = useState<string>('');
  const [numPages, setNumPages] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(600);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const viewerContainerRef = useRef<HTMLDivElement>(null);

  // Auto-select first document
  useEffect(() => {
    if (documents && documents.length > 0 && !selectedDoc) {
      setSelectedDoc(documents[0]);
    }
  }, [documents, selectedDoc]);

  // Responsive viewer width measuring
  useEffect(() => {
    const container = viewerContainerRef.current;
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
  }, [selectedDoc]);

  // Security protections against keyboard shortcuts and context menus
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

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPdfError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF.js Error:', error);
    setPdfError(`Failed to load document preview. (${error.message})`);
  };

  if (isLoading) return <LoadingSpinner />;

  const filteredDocs = documents?.filter((doc: any) => 
    doc.title.toLowerCase().includes(search.toLowerCase()) || 
    doc.type.toLowerCase().includes(search.toLowerCase())
  ) || [];

  // Route PDFs through our backend proxy to avoid Cloudinary 401 errors in the browser
  const activePdfUrl = selectedDoc?._id
    ? `${api.defaults.baseURL}/documents/${selectedDoc._id}/file`
    : null;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-black transition-colors duration-500">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT SIDE: CREDENTIALS LIST & SEARCH */}
          <aside className="w-full lg:w-96 shrink-0 space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-2">
                <Sparkles size={12} /> Verified Documents
              </div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                Credentials
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Official certifications, degree transcripts, and academic awards.
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search certificates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl pl-11 pr-4 py-3 outline-none focus:border-primary text-sm text-gray-900 dark:text-white placeholder:text-gray-400 transition-colors"
              />
            </div>

            <div className="space-y-3 max-h-[62vh] overflow-y-auto custom-scrollbar pr-1">
              {filteredDocs.map((doc: any) => {
                const isSelected = selectedDoc?._id === doc._id;
                return (
                  <button
                    key={doc._id}
                    onClick={() => {
                      setSelectedDoc(doc);
                      setPdfError(null);
                      setZoom(1.0);
                    }}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-3.5 group ${
                      isSelected 
                        ? 'bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10 scale-[1.01]' 
                        : 'bg-white dark:bg-white/[0.02] border-gray-200 dark:border-white/5 hover:border-primary/30 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                      isSelected ? 'bg-primary text-black' : 'bg-gray-100 dark:bg-white/5 text-gray-500'
                    }`}>
                      {doc.type === 'Certificate' ? <Award size={20} /> : <FileText size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                        {doc.title}
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mt-0.5">
                        {doc.type}
                      </p>
                    </div>
                    <ChevronRight size={16} className={`transition-transform ${isSelected ? 'translate-x-0 text-primary' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 text-gray-400'}`} />
                  </button>
                );
              })}

              {filteredDocs.length === 0 && (
                <div className="text-center py-12 text-gray-400 bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-gray-200 dark:border-white/5 p-4">
                  <p className="text-xs">No matching credentials found.</p>
                </div>
              )}
            </div>
          </aside>

          {/* RIGHT SIDE: VIEW-ONLY PROTECTED CANVAS VIEWER */}
          <main className="flex-1 min-w-0 space-y-4">
            {selectedDoc ? (
              <div className="space-y-4">
                {/* Viewer Header & Zoom Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50 dark:bg-[#0A0A0A] p-4 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 rounded-2xl text-primary shrink-0">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white uppercase truncate max-w-xs md:max-w-md">
                        {selectedDoc.title}
                      </h2>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-yellow-500/10 text-yellow-500 uppercase tracking-widest border border-yellow-500/20">
                          View-Only Canvas
                        </span>
                        <span className="text-[10px] text-gray-400 uppercase font-bold">
                          {selectedDoc.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Responsive Zoom & Rotate Controls */}
                  <div className="flex items-center gap-1 bg-white dark:bg-white/5 p-1 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm self-start sm:self-center">
                    <button
                      onClick={() => setZoom(prev => Math.max(0.6, Number((prev - 0.15).toFixed(2))))}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all text-gray-700 dark:text-gray-300"
                      title="Zoom Out"
                    >
                      <ZoomOut size={18} />
                    </button>

                    <button
                      onClick={() => setZoom(1.0)}
                      className="px-2.5 py-1 text-xs font-black text-gray-900 dark:text-white min-w-[50px] text-center hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-all"
                      title="Reset Zoom"
                    >
                      {Math.round(zoom * 100)}%
                    </button>

                    <button
                      onClick={() => setZoom(prev => Math.min(2.2, Number((prev + 0.15).toFixed(2))))}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all text-gray-700 dark:text-gray-300"
                      title="Zoom In"
                    >
                      <ZoomIn size={18} />
                    </button>

                    <div className="w-[1px] h-5 bg-gray-200 dark:bg-white/10 mx-1"></div>

                    <button
                      onClick={() => setRotation(prev => (prev + 90) % 360)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all text-gray-700 dark:text-gray-300"
                      title="Rotate 90°"
                    >
                      <RotateCw size={18} />
                    </button>
                  </div>
                </div>

                {/* SECURE VIEW CONTAINER (Canvas-based react-pdf, Zero Download prompts on Phoenix/Mobile) */}
                <motion.div 
                  key={selectedDoc._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative bg-zinc-100 dark:bg-zinc-950 rounded-[36px] overflow-hidden shadow-2xl border-4 border-gray-100 dark:border-white/5 transition-all min-h-[75vh] max-h-[82vh] flex flex-col justify-between"
                >
                  {/* Top Transparent Shield Layer */}
                  <div className="absolute inset-0 z-30 pointer-events-none select-none" onContextMenu={(e) => e.preventDefault()} />
                  
                  {/* Anti-Copy Watermark Overlay */}
                  <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.03] dark:opacity-[0.04] flex flex-wrap gap-20 p-16 overflow-hidden rotate-[-15deg] select-none">
                    {[...Array(24)].map((_, i) => (
                      <span key={i} className="text-4xl font-black whitespace-nowrap text-black dark:text-white uppercase tracking-widest">
                        ESRON PROTECTED ACHIEVEMENT
                      </span>
                    ))}
                  </div>

                  {/* Scrollable Document Body */}
                  <div 
                    ref={viewerContainerRef}
                    className="w-full flex-1 overflow-auto custom-scrollbar p-3 sm:p-6 lg:p-8 flex justify-center items-start"
                  >
                    {activePdfUrl ? (
                      <Document
                        file={activePdfUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={
                          <div className="py-24 flex flex-col items-center justify-center gap-3">
                            <LoadingSpinner />
                            <span className="text-xs font-semibold text-gray-400">Rendering secure canvas...</span>
                          </div>
                        }
                        className="flex flex-col items-center w-full"
                        onContextMenu={(e) => e.preventDefault()}
                      >
                        {pdfError ? (
                          <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs max-w-md text-center m-4">
                            <p className="font-bold">Error Displaying Document</p>
                            <p className="mt-1 text-red-400">{pdfError}</p>
                          </div>
                        ) : (
                          Array.from(new Array(numPages || 0), (_, index) => (
                            <div key={`doc_page_${index + 1}`} className="mb-6 shadow-2xl rounded-xl overflow-hidden">
                              <Page
                                pageNumber={index + 1}
                                width={Math.min(containerWidth - 32, 900)}
                                scale={zoom}
                                rotate={rotation}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                className="rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 select-none"
                                onContextMenu={(e) => e.preventDefault()}
                              />
                            </div>
                          ))
                        )}
                      </Document>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                        <Lock size={36} className="mb-2" />
                        <p className="text-sm font-bold">Document protected or not found.</p>
                      </div>
                    )}
                  </div>

                  {/* Security Badge */}
                  <div className="p-3 bg-gray-50/80 dark:bg-black/60 backdrop-blur-md border-t border-gray-200 dark:border-white/5 flex items-center justify-between text-[11px] px-6 text-gray-500">
                    <span className="flex items-center gap-1.5 text-primary font-bold">
                      <Lock size={12} /> View-Only Mode Enabled
                    </span>
                    <span>Protected across all mobile & desktop browsers</span>
                  </div>
                </motion.div>
              </div>
            ) : (
              <div className="h-[70vh] flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-white/[0.02] rounded-[40px] border-2 border-dashed border-gray-200 dark:border-white/10 p-8">
                <Award size={64} className="text-gray-300 dark:text-gray-700 mb-4" />
                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">Select a credential from the list</h3>
                <p className="text-xs text-gray-400 mt-1">View authenticated certificates and academic transcripts.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Documents;
