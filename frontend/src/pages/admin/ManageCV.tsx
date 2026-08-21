import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Trash2, 
  Download, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles,
  FileCheck,
  X,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, Page, pdfjs } from 'react-pdf';
import api from '../../services/api';
import { getAssetUrl } from '../../utils/url';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ManageCV = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const viewerContainerRef = useRef<HTMLDivElement>(null);
  const modalViewerContainerRef = useRef<HTMLDivElement>(null);

  // States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Viewer States
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'all' | 'single'>('all');
  const [containerWidth, setContainerWidth] = useState<number>(500);
  const [modalContainerWidth, setModalContainerWidth] = useState<number>(800);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState(false);

  // Measure container widths dynamically
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
  }, []);

  useEffect(() => {
    if (!isFullscreenModalOpen) return;
    const modalContainer = modalViewerContainerRef.current;
    if (!modalContainer) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setModalContainerWidth(Math.floor(entry.contentRect.width));
        }
      }
    });

    resizeObserver.observe(modalContainer);
    return () => resizeObserver.disconnect();
  }, [isFullscreenModalOpen]);

  // Handle ESC key for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreenModalOpen) {
        setIsFullscreenModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreenModalOpen]);

  // Clean up object URLs when selecting new files
  useEffect(() => {
    return () => {
      if (filePreviewUrl && filePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(filePreviewUrl);
      }
    };
  }, [filePreviewUrl]);

  // Fetch CV data
  const { data: cvData, isLoading, refetch, isFetching } = useQuery(['cv'], async () => {
    try {
      const { data } = await api.get('/cv');
      return data;
    } catch (error) {
      return null;
    }
  });

  const uploadMutation = useMutation(
    (formData: FormData) => api.post('/cv/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['cv']);
        setUploadStatus('success');
        setStatusMessage('Your CV has been successfully updated and published!');
        setSelectedFile(null);
        setFilePreviewUrl(null);
        setTimeout(() => setUploadStatus('idle'), 5000);
      },
      onError: (err: any) => {
        setUploadStatus('error');
        setStatusMessage(err?.response?.data?.message || 'Failed to upload CV. Please try again.');
        setTimeout(() => setUploadStatus('idle'), 6000);
      }
    }
  );

  const deleteMutation = useMutation(
    () => api.delete('/cv'),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['cv']);
        setUploadStatus('idle');
        setSelectedFile(null);
        setFilePreviewUrl(null);
      },
      onError: (err: any) => {
        alert(err?.response?.data?.message || 'Failed to delete CV');
      }
    }
  );

  const handleFileSelect = (file: File) => {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a valid PDF document.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit.');
      return;
    }

    setSelectedFile(file);
    const blobUrl = URL.createObjectURL(file);
    setFilePreviewUrl(blobUrl);
    setPdfError(null);
    setPageNumber(1);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleUploadSubmit = () => {
    if (!selectedFile) return;
    setUploadStatus('uploading');
    const formData = new FormData();
    formData.append('cv', selectedFile);
    uploadMutation.mutate(formData);
  };

  const handleCancelSelectedFile = () => {
    setSelectedFile(null);
    if (filePreviewUrl && filePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(filePreviewUrl);
    }
    setFilePreviewUrl(null);
    setPdfError(null);
  };

  const handleDeleteCV = () => {
    if (window.confirm('Are you sure you want to delete your current CV? This will remove it from all public sections.')) {
      deleteMutation.mutate();
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPdfError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF.js Error:', error);
    setPdfError(`Unable to render PDF preview (${error.message}).`);
  };

  // Determine which PDF URL to render (local preview if a new file is picked, or live Cloudinary URL)
  const activePdfUrl = filePreviewUrl || (cvData?.fileUrl ? getAssetUrl(cvData.fileUrl) : null);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Manage Curriculum Vitae</h1>
            {cvData ? (
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Live & Published
              </span>
            ) : (
              <span className="px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-xs font-bold">
                No CV Uploaded
              </span>
            )}
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Upload, preview, inspect, and publish your professional CV with live in-page rendering.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 transition-all"
            title="Refresh CV Data"
          >
            <RefreshCw size={18} className={isFetching ? 'animate-spin text-primary' : ''} />
          </button>

          <a
            href="/cv"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 bg-primary/10 hover:bg-primary text-primary hover:text-black border border-primary/20 rounded-xl text-sm font-bold transition-all shadow-sm group"
          >
            <ExternalLink size={16} className="transition-transform group-hover:scale-110" />
            <span>View Public CV</span>
          </a>
        </div>
      </div>

      {/* Main Grid: Upload & Controls on Left, In-Page PDF Viewer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (5 Cols): Upload & Management Card */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upload Card */}
          <div className="bg-white dark:bg-[#0A0A0A] p-6 rounded-3xl border border-gray-200 dark:border-white/10 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Upload size={18} className="text-primary" />
                {cvData ? 'Update & Replace CV' : 'Upload New CV'}
              </h2>
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">PDF format</span>
            </div>

            {/* Drag & Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer group ${
                isDragging 
                  ? 'border-primary bg-primary/10 scale-[1.01]' 
                  : selectedFile 
                    ? 'border-primary/50 bg-primary/5 dark:bg-primary/[0.02]' 
                    : 'border-gray-200 dark:border-white/10 hover:border-primary/40 bg-gray-50 dark:bg-white/[0.02]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
              />

              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-black transition-all">
                {selectedFile ? <FileCheck size={28} /> : <FileText size={28} />}
              </div>

              {selectedFile ? (
                <div className="space-y-1">
                  <p className="font-bold text-sm text-gray-900 dark:text-white truncate max-w-[260px] mx-auto">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-primary font-medium">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to Upload
                  </p>
                  <p className="text-[11px] text-gray-400 mt-2">
                    Click to choose a different file or see preview on the right
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                    Click to browse or drag & drop PDF here
                  </p>
                  <p className="text-xs text-gray-400">Maximum file size: 10 MB</p>
                </div>
              )}
            </div>

            {/* Pending Upload Action Controls */}
            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-primary/10 border border-primary/20 rounded-2xl space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles size={14} className="text-primary" /> New CV Selected
                  </span>
                  <button
                    onClick={handleCancelSelectedFile}
                    className="text-gray-400 hover:text-red-400 flex items-center gap-1 font-medium transition-colors"
                  >
                    <X size={14} /> Cancel
                  </button>
                </div>

                <button
                  onClick={handleUploadSubmit}
                  disabled={uploadStatus === 'uploading'}
                  className="w-full py-3 bg-primary text-black font-bold text-sm rounded-xl hover:bg-cyan-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  {uploadStatus === 'uploading' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>Publishing to Cloudinary...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      <span>Publish & Replace Live CV</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {/* Status Notifications */}
            <AnimatePresence>
              {uploadStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl flex items-start gap-3 text-xs"
                >
                  <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Update Complete</p>
                    <p className="text-emerald-500/80 mt-0.5">{statusMessage}</p>
                  </div>
                </motion.div>
              )}

              {uploadStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-start gap-3 text-xs"
                >
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Upload Failed</p>
                    <p className="text-red-500/80 mt-0.5">{statusMessage}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Current CV Metadata Card */}
          {cvData && (
            <div className="bg-white dark:bg-[#0A0A0A] p-6 rounded-3xl border border-gray-200 dark:border-white/10 shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText size={18} className="text-primary" /> Active CV Information
                </h3>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Cloudinary Hosted
                </span>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary shrink-0">
                    <FileText size={22} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-gray-800 dark:text-white truncate">
                      Curriculum_Vitae.pdf
                    </p>
                    <p className="text-xs text-gray-400">
                      Last Updated: {new Date(cvData.lastUpdated).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200 dark:border-white/5">
                  <a
                    href={getAssetUrl(cvData.fileUrl)}
                    download="Esron_Tuyishime_CV.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl transition-all"
                  >
                    <Download size={14} /> Download
                  </a>
                  <button
                    onClick={() => setIsFullscreenModalOpen(true)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold rounded-xl transition-all"
                  >
                    <Maximize2 size={14} /> Fullscreen
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-400">Remove from portfolio:</span>
                <button
                  onClick={handleDeleteCV}
                  disabled={deleteMutation.isLoading}
                  className="px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-500/10 rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {deleteMutation.isLoading ? (
                    <div className="w-3.5 h-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                  <span>Delete CV</span>
                </button>
              </div>
            </div>
          )}

          {/* Security & ATS Optimization Tips */}
          <div className="bg-gradient-to-br from-primary/5 to-transparent p-5 rounded-2xl border border-primary/10 space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs">
              <ShieldCheck size={16} /> Security & Best Practice
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              The public <strong>/cv</strong> page protects this document with secure view-only mode, watermark overlay, and screenshot/shortcut prevention.
            </p>
          </div>
        </div>

        {/* Right Column (7 Cols): IN-PAGE INTERACTIVE PDF VIEWER */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-[#0A0A0A] rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col min-h-[720px]">
            {/* Viewer Top Toolbar */}
            <div className="p-4 bg-gray-50 dark:bg-white/[0.03] border-b border-gray-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
              {/* Left Toolbar: Title & Page Indicator */}
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                  <Eye size={16} />
                </div>
                <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  {selectedFile ? 'Local Preview' : 'Interactive Viewer'}
                </span>
                {numPages && (
                  <span className="text-[11px] px-2 py-0.5 bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-md font-semibold">
                    {viewMode === 'single' ? `Page ${pageNumber} of ${numPages}` : `${numPages} Pages`}
                  </span>
                )}
              </div>

              {/* Center Toolbar: View Mode & Pagination */}
              {activePdfUrl && (
                <div className="flex items-center gap-1.5 bg-gray-200 dark:bg-white/5 p-1 rounded-xl border border-gray-300 dark:border-white/5">
                  <button
                    onClick={() => setViewMode(viewMode === 'all' ? 'single' : 'all')}
                    className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      viewMode === 'all' 
                        ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm' 
                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                    }`}
                    title={viewMode === 'all' ? 'Switch to Single Page Mode' : 'Switch to Continuous Scroll'}
                  >
                    <Layers size={14} />
                    <span className="hidden sm:inline">{viewMode === 'all' ? 'All Pages' : 'Single'}</span>
                  </button>

                  {viewMode === 'single' && numPages && (
                    <>
                      <div className="h-4 w-[1px] bg-gray-300 dark:bg-white/10 mx-1"></div>
                      <button
                        onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
                        disabled={pageNumber <= 1}
                        className="p-1 hover:bg-white dark:hover:bg-white/10 rounded text-gray-700 dark:text-gray-300 disabled:opacity-30"
                        title="Previous Page"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className="text-xs font-bold px-1 text-gray-800 dark:text-gray-200">
                        {pageNumber} / {numPages}
                      </span>
                      <button
                        onClick={() => setPageNumber(prev => Math.min(numPages, prev + 1))}
                        disabled={pageNumber >= numPages}
                        className="p-1 hover:bg-white dark:hover:bg-white/10 rounded text-gray-700 dark:text-gray-300 disabled:opacity-30"
                        title="Next Page"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Right Toolbar: Zoom, Rotate & Fullscreen */}
              {activePdfUrl && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setZoom(prev => Math.max(0.6, Number((prev - 0.15).toFixed(2))))}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl text-gray-600 dark:text-gray-300 transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut size={16} />
                  </button>
                  <button
                    onClick={() => setZoom(1.0)}
                    className="px-2 py-1 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg"
                    title="Reset Zoom"
                  >
                    {Math.round(zoom * 100)}%
                  </button>
                  <button
                    onClick={() => setZoom(prev => Math.min(2.0, Number((prev + 0.15).toFixed(2))))}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl text-gray-600 dark:text-gray-300 transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn size={16} />
                  </button>
                  <button
                    onClick={() => setRotation(prev => (prev + 90) % 360)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl text-gray-600 dark:text-gray-300 transition-colors"
                    title="Rotate 90°"
                  >
                    <RotateCw size={16} />
                  </button>
                  <button
                    onClick={() => setIsFullscreenModalOpen(true)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-xl text-primary transition-colors ml-1"
                    title="Expand to Fullscreen Modal"
                  >
                    <Maximize2 size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* In-Page Viewer Canvas */}
            <div
              ref={viewerContainerRef}
              className="flex-1 bg-zinc-100 dark:bg-zinc-950 p-4 overflow-auto max-h-[680px] custom-scrollbar relative flex justify-center items-start"
            >
              {activePdfUrl ? (
                <div className="w-full flex justify-center py-2">
                  <Document
                    file={activePdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={
                      <div className="py-24 flex flex-col items-center justify-center gap-3">
                        <LoadingSpinner />
                        <span className="text-xs font-semibold text-gray-400">Rendering document pages...</span>
                      </div>
                    }
                    className="flex flex-col items-center"
                  >
                    {pdfError ? (
                      <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs max-w-md text-center m-4">
                        <AlertCircle size={24} className="mx-auto mb-2" />
                        <p className="font-bold">Failed to load PDF</p>
                        <p className="text-red-400 mt-1">{pdfError}</p>
                      </div>
                    ) : viewMode === 'single' ? (
                      <Page
                        key={`page_${pageNumber}`}
                        pageNumber={pageNumber}
                        width={containerWidth ? Math.min(containerWidth - 32, 700) : 500}
                        scale={zoom}
                        rotate={rotation}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="shadow-2xl rounded-xl overflow-hidden border border-gray-200 dark:border-white/10"
                      />
                    ) : (
                      Array.from(new Array(numPages || 0), (_, index) => (
                        <div key={`page_wrapper_${index + 1}`} className="mb-6 relative group">
                          <Page
                            pageNumber={index + 1}
                            width={containerWidth ? Math.min(containerWidth - 32, 700) : 500}
                            scale={zoom}
                            rotate={rotation}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            className="shadow-2xl rounded-xl overflow-hidden border border-gray-200 dark:border-white/10"
                          />
                          <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                            Page {index + 1}
                          </span>
                        </div>
                      ))
                    )}
                  </Document>
                </div>
              ) : (
                <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8 text-gray-400">
                  <div className="w-20 h-20 rounded-3xl bg-gray-200 dark:bg-white/5 border border-gray-300 dark:border-white/10 flex items-center justify-center text-gray-400 dark:text-gray-600 mb-4">
                    <FileText size={36} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-1">No Document to Display</h3>
                  <p className="text-xs text-gray-500 max-w-sm">
                    Upload a new CV PDF on the left to see the live rendered document here in real-time.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* In-Page Expanded Fullscreen Modal Viewer */}
      <AnimatePresence>
        {isFullscreenModalOpen && activePdfUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col p-4 md:p-8"
          >
            {/* Modal Header Toolbar */}
            <div className="bg-gray-900 border border-white/10 p-4 rounded-2xl mb-4 flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-none">
                    Curriculum Vitae — Fullscreen Inspector
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {numPages ? `${numPages} Total Pages` : 'Loading pages...'}
                  </p>
                </div>
              </div>

              {/* Modal Zoom & Close Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoom(prev => Math.max(0.6, Number((prev - 0.15).toFixed(2))))}
                  className="p-2 hover:bg-white/10 rounded-xl text-gray-300 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut size={18} />
                </button>
                <span className="text-xs font-bold text-white px-2">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom(prev => Math.min(2.5, Number((prev + 0.15).toFixed(2))))}
                  className="p-2 hover:bg-white/10 rounded-xl text-gray-300 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn size={18} />
                </button>
                <button
                  onClick={() => setRotation(prev => (prev + 90) % 360)}
                  className="p-2 hover:bg-white/10 rounded-xl text-gray-300 transition-colors"
                  title="Rotate"
                >
                  <RotateCw size={18} />
                </button>

                <div className="h-6 w-[1px] bg-white/10 mx-2"></div>

                <button
                  onClick={() => setIsFullscreenModalOpen(false)}
                  className="p-2 bg-white/10 hover:bg-red-500 text-white rounded-xl transition-all"
                  title="Close Fullscreen (Esc)"
                >
                  <Minimize2 size={18} />
                </button>
              </div>
            </div>

            {/* Modal Document Canvas */}
            <div
              ref={modalViewerContainerRef}
              className="flex-1 bg-zinc-950 rounded-2xl border border-white/10 p-6 overflow-auto custom-scrollbar flex justify-center"
            >
              <Document
                file={activePdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div className="py-24 flex flex-col items-center justify-center gap-3">
                    <LoadingSpinner />
                    <span className="text-xs font-semibold text-gray-400">Loading High-Definition Canvas...</span>
                  </div>
                }
                className="flex flex-col items-center"
              >
                {Array.from(new Array(numPages || 0), (_, index) => (
                  <div key={`modal_page_${index + 1}`} className="mb-8 shadow-2xl">
                    <Page
                      pageNumber={index + 1}
                      width={modalContainerWidth ? Math.min(modalContainerWidth - 64, 900) : 800}
                      scale={zoom}
                      rotate={rotation}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className="rounded-xl overflow-hidden border border-white/10"
                    />
                  </div>
                ))}
              </Document>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageCV;
