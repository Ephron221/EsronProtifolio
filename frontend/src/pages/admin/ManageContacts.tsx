import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Mail, User, Calendar, MessageSquare, AlertCircle, Phone } from 'lucide-react';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

const ManageContacts = () => {
  const queryClient = useQueryClient();

  const { data: messages, isLoading, error } = useQuery<ContactMessage[]>(['contacts'], async () => {
    const { data } = await api.get('/contacts');
    return data;
  });

  const deleteMutation = useMutation(
    (id: string) => api.delete(`/contacts/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['contacts']);
      },
    }
  );

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Manage Messages</h1>
        <p className="text-gray-400">View and manage inquiries from your portfolio website</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
          <AlertCircle size={20} />
          <p>Failed to load messages. Please try again later.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {messages?.map((msg) => (
          <div 
            key={msg._id} 
            className="glass-dark p-6 rounded-2xl border border-white/5 hover:border-primary/20 transition-all group"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{msg.name}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-primary" />
                      <span>{msg.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-primary" />
                      <span>{msg.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                  <div className="flex items-center justify-end gap-2 text-xs text-gray-500 mb-1">
                    <Calendar size={12} />
                    <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(msg._id)}
                  className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                  title="Delete message"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-2 text-primary font-bold mb-2">
                <MessageSquare size={16} />
                <span>Subject: {msg.subject}</span>
              </div>
              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {msg.message}
              </p>
            </div>
            
            <div className="mt-4 flex md:hidden items-center gap-2 text-xs text-gray-500">
              <Calendar size={12} />
              <span>{new Date(msg.createdAt).toLocaleString()}</span>
            </div>
          </div>
        ))}

        {messages?.length === 0 && (
          <div className="text-center py-20 glass-dark rounded-3xl border border-white/5">
            <Mail size={64} className="mx-auto mb-4 text-gray-700" />
            <h3 className="text-xl font-bold mb-2">No messages yet</h3>
            <p className="text-gray-500">When someone contacts you, their message will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageContacts;
