import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Phone, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import { clsx } from 'clsx';

type Message = {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState<'selection' | 'chat'>('selection');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const predefinedQuestions = [
    { text: "What are your core skills?", icon: <Sparkles size={14} /> },
    { text: "Show me your projects", icon: <MessageCircle size={14} /> },
    { text: "How can I contact you?", icon: <Phone size={14} /> }
  ];

  useEffect(() => {
    if (activeView === 'chat' && messages.length === 0) {
      setTimeout(() => {
        setMessages([{
          text: "Hi there! 👋 I'm Esron's AI Assistant. How can I help you today?",
          sender: 'bot',
          timestamp: new Date()
        }]);
      }, 300);
    }
  }, [activeView]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (question?: string) => {
    const userMessage = question || input;
    if (!userMessage.trim()) return;

    const newMessage: Message = { text: userMessage, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data } = await api.post('/chatbot', { message: userMessage });
      setMessages(prev => [...prev, { text: data.response, sender: 'bot', timestamp: new Date() }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        text: "I'm having trouble connecting. Feel free to use the WhatsApp option below!",
        sender: 'bot',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const openWhatsApp = () => {
    const phone = "250787846344";
    const message = encodeURIComponent("Hi Esron, I'm reaching out from your portfolio and would like to chat!");
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const resetChat = () => {
    setIsOpen(false);
    setTimeout(() => setActiveView('selection'), 300);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => isOpen ? resetChat() : setIsOpen(true)}
          className={clsx(
            "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500",
            isOpen ? "bg-white dark:bg-white/10 text-primary rotate-90" : "bg-primary text-black"
          )}
        >
          {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white dark:border-black rounded-full animate-pulse" />
          )}
        </motion.button>
      </div>

      {/* Chat Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(10px)' }}
            className="fixed bottom-28 right-8 w-[90vw] max-w-[400px] h-[70vh] max-h-[600px] glass-dark rounded-[2.5rem] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.4)] flex flex-col overflow-hidden z-[60]"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-br from-primary/10 to-transparent border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="p-3 bg-primary text-black rounded-2xl shadow-lg shadow-primary/20">
                    <Bot size={24} />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-black rounded-full" />
                </div>
                <div>
                  <h3 className="font-bold text-lg tracking-tight">Esron Connect</h3>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">How can I help?</p>
                </div>
              </div>
            </div>

            <div className="flex-1 relative overflow-hidden">
              <AnimatePresence mode="wait">
                {activeView === 'selection' ? (
                  <motion.div
                    key="selection"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="h-full p-8 flex flex-col justify-center space-y-4"
                  >
                    <div className="text-center mb-4">
                      <h4 className="text-xl font-bold mb-2">Choose your preferred way to chat</h4>
                      <p className="text-sm text-gray-500">Get instant AI help or message Esron directly.</p>
                    </div>

                    {/* AI Option */}
                    <button
                      onClick={() => setActiveView('chat')}
                      className="group relative w-full p-6 glass-dark border border-white/10 rounded-3xl hover:border-primary/50 transition-all text-left bg-white/5"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-4 bg-primary/10 text-primary rounded-2xl group-hover:bg-primary group-hover:text-black transition-all">
                          <Bot size={28} />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-lg">Talk to AI Assistant</h5>
                          <p className="text-xs text-gray-500">Instant answers about my portfolio.</p>
                        </div>
                        <ArrowRight size={20} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>

                    {/* WhatsApp Option */}
                    <button
                      onClick={openWhatsApp}
                      className="group relative w-full p-6 glass-dark border border-white/10 rounded-3xl hover:border-[#25D366]/50 transition-all text-left bg-white/5"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-4 bg-[#25D366]/10 text-[#25D366] rounded-2xl group-hover:bg-[#25D366] group-hover:text-white transition-all">
                          <Phone size={28} />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-lg">Direct WhatsApp</h5>
                          <p className="text-xs text-gray-500">Chat with Esron personally.</p>
                        </div>
                        <ArrowRight size={20} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="h-full flex flex-col"
                  >
                    {/* Message Area */}
                    <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
                      {messages.map((msg, index) => (
                        <div key={index} className={clsx("flex gap-3", msg.sender === 'user' ? 'justify-end' : 'justify-start')}>
                          {msg.sender === 'bot' && (
                            <div className="w-8 h-8 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0 border border-primary/20">
                              <Bot size={16} />
                            </div>
                          )}
                          <div className={clsx(
                            "max-w-[85%] p-4 text-sm rounded-2xl shadow-sm",
                            msg.sender === 'user'
                              ? "bg-primary text-black rounded-tr-none font-medium"
                              : "glass bg-white/5 rounded-tl-none border border-white/5"
                          )}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start gap-3">
                          <div className="w-8 h-8 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0 border border-primary/20">
                            <Bot size={16} />
                          </div>
                          <div className="p-4 glass bg-white/5 rounded-2xl rounded-tl-none flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-6 bg-black/10 border-t border-white/5">
                      {messages.length <= 1 && !isLoading && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {predefinedQuestions.map(q => (
                            <button
                              key={q.text}
                              onClick={() => handleSend(q.text)}
                              className="px-3 py-2 glass rounded-xl text-xs hover:border-primary/50 transition-all flex items-center gap-2"
                            >
                              {q.icon} {q.text}
                            </button>
                          ))}
                        </div>
                      )}
                      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                        <input
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Ask me anything..."
                          className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 outline-none focus:border-primary/50 text-sm"
                        />
                        <button
                          type="submit"
                          disabled={isLoading || !input.trim()}
                          className="w-12 h-12 flex items-center justify-center bg-primary text-black rounded-2xl font-bold shadow-lg disabled:opacity-50"
                        >
                          <Send size={20} />
                        </button>
                      </form>
                      <button 
                        onClick={() => setActiveView('selection')}
                        className="w-full text-center text-[10px] text-gray-500 mt-4 hover:text-primary transition-colors font-bold uppercase tracking-widest"
                      >
                        ← Back to options
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
