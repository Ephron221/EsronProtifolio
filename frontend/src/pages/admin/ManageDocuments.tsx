import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Save, Plus, Trash2, FileText, ShieldCheck, Upload, Award,
  CheckCircle2, X, Pencil, Eye, RefreshCcw, Lock, AlertTriangle, File
} from 'lucide-react';
import api from '../../services/api';
import { getAssetUrl } from '../../utils/url';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ManageDocuments = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    const container = pdfContainerRef.current;
    if (!container) return;
    const resizeObserver = new ResizeObserver(() => {
      setContainerWidth(container.clientWidth);
    });
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [previewDoc]);

  const [formData, setFormData] = useState({
    title: '',
    type: 'Certificate',
    description: '',
    fileUrl: '',
    publicId: ''
  });
  
  const [uploading, setUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const { data: documents, isLoading } = useQuery(['documents'], async () => {
    const { data } = await api.get('/documents');
    return data;
  });

  const uploadMutation = useMutation(
    async (file: File) => {
      const fd = new FormData();
      fd.append('image', file); // Backend expects 'image' field for cloudinary upload
      const { data } = await api.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return data;
    },
    {
      onSuccess: (data) => {
        setFormData(prev => ({ ...prev, fileUrl: data.url, publicId: data.public_id }));
        setUploading(false);
      },
      onError: () => {
        setUploading(false);
        alert('Upload failed. Ensure the backend accepts this file type.');
      }
    }
  );

  const saveMutation = useMutation(
    (data: any) => editingId 
      ? api.put(`/documents/${editingId}`, data) 
      : api.post('/documents', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['documents']);
        setShowSuccess(true);
        resetForm();
        setTimeout(() => setShowSuccess(false), 3000);
      }
    }
  );

  const deleteMutation = useMutation(
    (id: string) => api.delete(`/documents/${id}`),
    {
      onSuccess: () => queryClient.invalidateQueries(['documents'])
    }
  );

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (doc: any) => {
    setEditingId(doc._id);
    setFormData({
      title: doc.title,
      type: doc.type,
      description: doc.description || '',
      fileUrl: doc.fileUrl,
      publicId: doc.publicId || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ title: '', type: 'Certificate', description: '', fileUrl: '', publicId: '' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
    let file;
    if ('dataTransfer' in e) {
      file = e.dataTransfer.files?.[0];
    } else {
      file = e.target.files?.[0];
    }
    
    if (file) {
      setUploading(true);
      uploadMutation.mutate(file);
    }
  };
  
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setPdfError(null);
  }

  function onDocumentLoadError(err: Error): void {
    setPdfError(`Failed to load PDF. Message: ${err.message}`);
  }

  const handlePreview = (doc: any) => {
    setPdfError(null);
    setPreviewDoc(doc);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4 sm:px-6 lg:px-8 relative min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pt-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Document Center</h1>
          <p className="text-gray-500 mt-2 text-sm">Manage your protected credentials and certificates.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold border border-primary/20 shadow-sm shadow-primary/5">
          <ShieldCheck size={14} /> <span>Security System Active</span>
        </div>
      </div>

      {/* Floating Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 20, scale: 0.9 }} 
            className="fixed bottom-10 right-10 z-50 p-4 bg-emerald-500 text-white shadow-2xl rounded-2xl flex items-center gap-3 font-semibold"
          >
            <CheckCircle2 size={24} /> 
            <span>{editingId ? 'Document updated successfully!' : 'Document created successfully!'}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: FORM */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-[#0A0A0A] p-6 sm:p-8 rounded-[36px] border border-gray-200 dark:border-white/10 shadow-xl sticky top-24">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                {editingId ? <Pencil size={20} /> : <Plus size={20} />}
              </div>
              {editingId ? 'Edit Document' : 'Add New Document'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1 uppercase tracking-wider">Title</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-sm text-gray-900 dark:text-white transition-all shadow-sm" 
                  placeholder="e.g. AWS Certified Solutions Architect" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1 uppercase tracking-wider">Type</label>
                <select 
                  value={formData.type} 
                  onChange={(e) => setFormData({...formData, type: e.target.value})} 
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-sm text-gray-900 dark:text-white transition-all shadow-sm appearance-none"
                >
                  <option value="Certificate">Certificate</option>
                  <option value="Transcript">Transcript</option>
                  <option value="Other">Other Award</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1 uppercase tracking-wider">Description</label>
                <textarea 
                  rows={3} 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-sm text-gray-900 dark:text-white transition-all shadow-sm resize-none" 
                  placeholder="Brief details about this credential..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1 uppercase tracking-wider">Document File (PDF)</label>
                <div 
                  onClick={() => !uploading && fileInputRef.current?.click()} 
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileChange(e); }}
                  className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 relative overflow-hidden ${
                    isDragging ? 'border-primary bg-primary/10' :
                    formData.fileUrl ? 'border-primary/40 bg-primary/5 hover:bg-primary/10' : 
                    'border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-white/5 hover:border-primary/50'
                  } ${uploading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                >
                  {uploading ? (
                    <div className="flex flex-col items-center justify-center gap-3">
                      <RefreshCcw className="animate-spin text-primary" size={32} />
                      <span className="text-xs font-bold text-primary">Uploading Securely...</span>
                    </div>
                  ) : formData.fileUrl ? (
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-16 h-16 rounded-2xl bg-white dark:bg-black shadow-lg flex items-center justify-center border border-gray-100 dark:border-white/10 mb-2">
                        <FileText className="text-primary" size={32} />
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">PDF Secured</span>
                      <span className="text-[10px] text-gray-500 font-medium">Click to replace file</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center mb-1 transition-transform group-hover:scale-110">
                        <Upload className="text-gray-500 dark:text-gray-400" size={28} />
                      </div>
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Drop PDF here</span>
                      <span className="text-xs text-gray-400">or click to browse</span>
                    </div>
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="application/pdf" />
              </div>

              <div className="flex gap-3 pt-4">
                {editingId && (
                  <button 
                    onClick={resetForm} 
                    className="flex-1 py-4 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-white/10 transition-all text-sm"
                  >
                    Cancel
                  </button>
                )}
                <button 
                  onClick={() => saveMutation.mutate(formData)} 
                  disabled={!formData.title || !formData.fileUrl || saveMutation.isLoading || uploading} 
                  className="flex-[2] py-4 bg-primary text-black font-black rounded-2xl hover:bg-cyan-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all disabled:opacity-50 disabled:hover:shadow-none flex items-center justify-center gap-2 text-sm"
                >
                  {saveMutation.isLoading ? <LoadingSpinner /> : <><Save size={18} /> {editingId ? 'Update Document' : 'Save Document'}</>}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DOCUMENT LIST */}
        <div className="lg:col-span-8">
          {documents?.length === 0 ? (
            <div className="bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 rounded-[36px] p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
              <File size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No documents yet</h3>
              <p className="text-gray-500 text-sm max-w-sm">Upload your first certificate or transcript using the form on the left.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {documents?.map((doc: any) => (
                <div key={doc._id} className="bg-white dark:bg-[#0A0A0A] p-6 sm:p-8 rounded-[32px] border border-gray-200 dark:border-white/10 flex flex-col group hover:border-primary/40 hover:shadow-2xl transition-all duration-300">
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                      {doc.type === 'Certificate' ? <Award size={24} /> : <FileText size={24} />}
                    </div>
                    <div className="flex gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handlePreview(doc)} className="p-2 bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-black rounded-lg transition-colors" title="Preview"><Eye size={16} /></button>
                      <button onClick={() => handleEdit(doc)} className="p-2 bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-blue-500 hover:text-white rounded-lg transition-colors" title="Edit"><Pencil size={16} /></button>
                      <button onClick={() => handleDelete(doc._id)} className="p-2 bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors" title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1.5 line-clamp-1">{doc.title}</h3>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4 block">{doc.type}</span>
                  <p className="text-gray-500 text-sm line-clamp-2 mt-auto">{doc.description || 'No description provided.'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- SECURE PDF PREVIEW MODAL --- */}
      <AnimatePresence>
        {previewDoc && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10" onContextMenu={(e) => e.preventDefault()}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewDoc(null)} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
            
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-5xl h-full max-h-[90vh] bg-white dark:bg-[#0C0C0C] rounded-[40px] border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col shadow-2xl">
              <div className="p-5 sm:p-6 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-primary/10 rounded-xl text-primary"><ShieldCheck size={22} /></div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-md">{previewDoc.title}</h3>
                    <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-0.5">{previewDoc.type}</p>
                  </div>
                </div>
                <button onClick={() => setPreviewDoc(null)} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full text-gray-500 transition-all"><X size={24} /></button>
              </div>

              <div ref={pdfContainerRef} className="flex-1 bg-zinc-100 dark:bg-zinc-950 relative overflow-auto custom-scrollbar flex justify-center items-start pt-8 pb-16">
                {/* Watermark */}
                <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.02] dark:opacity-[0.04] flex flex-wrap gap-20 p-20 overflow-hidden rotate-[-15deg]">
                  {[...Array(15)].map((_, i) => (<span key={i} className="text-5xl font-black whitespace-nowrap text-gray-900 dark:text-white uppercase">ESRON PREVIEW</span>))}
                </div>
                
                {/* Detect legacy local file paths that won't load */}
                {previewDoc.fileUrl && (previewDoc.fileUrl.startsWith('/uploads/') || !previewDoc.fileUrl.startsWith('http')) ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6">
                      <AlertTriangle size={36} className="text-amber-500" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Legacy File Detected</h4>
                    <p className="text-sm text-gray-500 max-w-sm mb-6">
                      This document was stored on the old local server and is no longer accessible. Please re-upload the PDF file to make it available.
                    </p>
                    <button
                      onClick={() => { setPreviewDoc(null); handleEdit(previewDoc); }}
                      className="px-6 py-3 bg-primary text-black font-bold rounded-2xl hover:bg-cyan-300 transition-all text-sm flex items-center gap-2"
                    >
                      <Upload size={16} /> Re-upload this Document
                    </button>
                  </div>
                ) : (previewDoc.fileUrl && containerWidth > 0) ? (
                  <Document
                    file={previewDoc._id ? `${api.defaults.baseURL}/documents/${previewDoc._id}/file` : getAssetUrl(previewDoc.fileUrl)}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={
                      <div className="py-24 flex flex-col items-center justify-center gap-3">
                        <LoadingSpinner />
                        <span className="text-sm font-semibold text-gray-500">Loading secure preview...</span>
                      </div>
                    }
                    className="flex flex-col items-center w-full z-30 relative px-4"
                  >
                    {pdfError ? (
                      <div className="text-red-500 p-8 bg-red-500/10 rounded-2xl m-4 flex flex-col items-center text-center gap-3 border border-red-500/20">
                        <AlertTriangle size={32} /> 
                        <p className="font-bold text-sm">{pdfError}</p>
                        <p className="text-xs opacity-80 max-w-sm mt-1">This usually means the file could not be fetched from the secure storage. Please check if the file exists or try re-uploading.</p>
                        <button
                          onClick={() => { setPreviewDoc(null); handleEdit(previewDoc); }}
                          className="mt-2 px-4 py-2 bg-primary text-black font-bold rounded-xl text-xs hover:bg-cyan-300 transition-all flex items-center gap-1.5"
                        >
                          <Upload size={14} /> Re-upload File
                        </button>
                      </div>
                    ) : (
                      Array.from(new Array(numPages), (el, index) => (
                        <div key={`page_${index + 1}`} className="mb-6 shadow-2xl rounded-xl overflow-hidden bg-white">
                          <Page pageNumber={index + 1} width={Math.min(containerWidth - 64, 900)} renderTextLayer={false} renderAnnotationLayer={false} className="select-none" />
                        </div>
                      ))
                    )}
                  </Document>
                ) : (
                  <div className='w-full h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center'>
                    <File size={48} className="mb-4 opacity-50" />
                    <p className="font-bold text-gray-900 dark:text-white">Document file not found.</p>
                    <p className="text-sm mt-2">The URL is invalid or the file has been removed.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageDocuments;
