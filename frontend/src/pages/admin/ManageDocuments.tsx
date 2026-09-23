import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Save, 
  Plus, 
  Trash2, 
  FileText, 
  ShieldCheck, 
  Upload, 
  Award,
  CheckCircle2,
  X,
  Pencil,
  Eye,
  RefreshCcw,
  Lock,
  AlertTriangle
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

  const { data: documents, isLoading } = useQuery(['documents'], async () => {
    const { data } = await api.get('/documents');
    return data;
  });

  const uploadMutation = useMutation(
    async (file: File) => {
      const fd = new FormData();
      fd.append('image', file);
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
        alert('Upload failed');
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setUploading(true);
      uploadMutation.mutate(e.target.files[0]);
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
    setPdfError(null); // Reset error state on new preview
    setPreviewDoc(doc);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-primary to-gray-500 bg-clip-text text-transparent">Document Center</h1>
          <p className="text-gray-400 mt-2">Manage your protected credentials.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold border border-primary/20">
          <ShieldCheck size={14} /> <span>Security System Active</span>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-8 p-4 bg-secondary-success/20 border border-secondary-success/30 rounded-2xl flex items-center gap-3 text-secondary-success">
            <CheckCircle2 size={20} /> <span className="font-semibold">{editingId ? 'Document updated!' : 'Document added!'}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="glass-dark p-8 rounded-[40px] border border-white/5 shadow-2xl sticky top-24">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-white">
              {editingId ? <Pencil size={22} className="text-primary" /> : <Plus size={22} className="text-primary" />}
              {editingId ? 'Edit Document' : 'New Document'}
            </h2>
            <div className="space-y-5">
              <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 outline-none focus:border-primary/50 text-sm" placeholder="Title" />
              <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 outline-none focus:border-primary/50 text-sm text-gray-300">
                <option value="Certificate">Certificate</option>
                <option value="Transcript">Transcript</option>
                <option value="Other">Other Award</option>
              </select>
              <textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 outline-none focus:border-primary/50 text-sm resize-none" placeholder="Description"></textarea>
              <div onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${formData.fileUrl ? 'border-primary/50 bg-primary/5' : 'border-white/10 hover:border-primary/30'}`}>
                {uploading ? <RefreshCcw className="mx-auto animate-spin text-primary" /> : formData.fileUrl ? <ShieldCheck className="mx-auto text-primary" size={32} /> : <Upload className="mx-auto text-gray-500" size={32} />}
                <p className="text-[10px] mt-2 font-bold uppercase tracking-widest text-gray-500">{formData.fileUrl ? 'File Secured' : 'Upload File'}</p>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf" />
              <div className="flex gap-3">
                {editingId && <button onClick={resetForm} className="flex-1 py-4 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all">Cancel</button>}
                <button onClick={() => saveMutation.mutate(formData)} disabled={!formData.title || !formData.fileUrl || saveMutation.isLoading} className="flex-[2] py-4 bg-primary text-black font-black rounded-2xl hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {saveMutation.isLoading ? <LoadingSpinner /> : <><Save size={18} /> {editingId ? 'Update' : 'Save'}</>}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {documents?.map((doc: any) => (
            <div key={doc._id} className="glass-dark p-6 rounded-[32px] border border-white/5 flex flex-col group hover:border-primary/20 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary"><Award size={24} /></div>
                <div className="flex gap-1">
                  <button onClick={() => handlePreview(doc)} className="p-2 text-gray-500 hover:text-primary transition-colors" title="Preview"><Eye size={18} /></button>
                  <button onClick={() => handleEdit(doc)} className="p-2 text-gray-500 hover:text-blue-500 transition-colors" title="Edit"><Pencil size={18} /></button>
                  <button onClick={() => handleDelete(doc._id)} className="p-2 text-gray-500 hover:text-red-500 transition-colors" title="Delete"><Trash2 size={18} /></button>
                </div>
              </div>
              <h3 className="font-bold text-lg mb-1">{doc.title}</h3>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-3 block">{doc.type}</span>
              <p className="text-gray-500 text-xs line-clamp-2 a-clamp-2">{doc.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* --- DEFINITIVE PDF VIEWER MODAL --- */}
      <AnimatePresence>
        {previewDoc && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10" onContextMenu={(e) => e.preventDefault()}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewDoc(null)} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-5xl h-full max-h-[90vh] glass-dark rounded-[40px] border border-white/10 overflow-hidden flex flex-col shadow-2xl">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary"><ShieldCheck size={20} /></div>
                  <div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-tight">{previewDoc.title}</h3>
                    <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">{previewDoc.type}</p>
                  </div>
                </div>
                <button onClick={() => setPreviewDoc(null)} className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-all"><X size={24} /></button>
              </div>

              <div ref={pdfContainerRef} className="flex-1 bg-zinc-900 relative overflow-auto group custom-scrollbar">
                <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.03] flex flex-wrap gap-20 p-20 overflow-hidden rotate-[-15deg]">
                  {[...Array(15)].map((_, i) => (<span key={i} className="text-4xl font-black whitespace-nowrap text-white uppercase">ESRON ADMIN PREVIEW</span>))}
                </div>
                
                {(previewDoc.fileUrl && containerWidth > 0) ? (
                  <Document
                    file={previewDoc._id ? `${api.defaults.baseURL}/documents/${previewDoc._id}/file` : getAssetUrl(previewDoc.fileUrl)}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={<LoadingSpinner />}
                    className="flex flex-col items-center py-4"
                  >
                    {pdfError ? (
                      <div className="text-red-400 p-8 bg-red-500/10 rounded-lg m-4 flex items-center gap-4"><AlertTriangle/> {pdfError}</div>
                    ) : (
                      Array.from(new Array(numPages), (el, index) => (
                        <Page key={`page_${index + 1}`} pageNumber={index + 1} width={containerWidth} renderTextLayer={false} renderAnnotationLayer={false} className="mb-4 shadow-lg" />
                      ))
                    )}
                  </Document>
                ) : (
                  <div className='w-full h-full flex items-center justify-center text-gray-500 p-4'>
                    <p>Document file not found or URL is invalid.</p>
                  </div>
                )}

                <div className="absolute bottom-6 right-6 z-40 px-4 py-2 glass rounded-full border border-primary/20 flex items-center gap-2 backdrop-blur-xl">
                  <Lock size={12} className="text-primary" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Secured Preview</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageDocuments;
