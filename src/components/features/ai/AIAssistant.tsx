import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Trash2, 
  ChevronDown, 
  MessageSquare,
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useAIAssistantStore, Message } from '@/store/aiAssistantStore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

export const AIAssistant: React.FC = () => {
  const { 
    messages, 
    isChatOpen, 
    isLoading, 
    toggleChat, 
    sendMessage, 
    clearHistory, 
    suggestions,
    error 
  } = useAIAssistantStore();
  
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const msg = input;
    setInput('');
    await sendMessage(msg);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        onClick={() => toggleChat()}
        className={cn(
          "fixed bottom-6 right-6 z-[100] p-4 rounded-full shadow-2xl transition-all duration-300 group",
          isChatOpen 
            ? "bg-slate-800 text-slate-400 rotate-90 scale-0" 
            : "bg-cyan-600 text-white hover:bg-cyan-500 hover:scale-110 active:scale-95"
        )}
      >
        <Bot size={24} className="group-hover:animate-pulse" />
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[101] w-[400px] h-[600px] flex flex-col glass-panel rounded-2xl border-slate-800 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-slate-900/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 italic">
                    Ops Copilot
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mt-0.5" />
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">v2.1 Intelligence Proxy</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={clearHistory}
                  className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                  title="Clear History"
                >
                  <Trash2 size={16} />
                </button>
                <button 
                  onClick={() => toggleChat(false)}
                  className="p-2 text-slate-500 hover:text-slate-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-slate-950/40"
            >
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <div className="w-16 h-16 rounded-3xl bg-slate-900/80 border border-slate-800 flex items-center justify-center mb-6 shadow-inner">
                    <Sparkles size={32} className="text-cyan-500" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-200 mb-2">Initialize Operational Analysis</h4>
                  <p className="text-[11px] text-slate-500 max-w-[240px] leading-relaxed">
                    Access real-time telemetry datasets and strategic recommendations for fleet, facility, and waste-bin management.
                  </p>
                  
                  <div className="mt-8 w-full max-w-sm space-y-2">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3 text-left">Suggested Queries</p>
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(s)}
                        className="w-full text-left p-3 rounded-xl bg-slate-900/50 border border-slate-800/50 text-[11px] text-slate-300 hover:border-cyan-500/30 hover:bg-slate-800/50 transition-all group flex items-center justify-between"
                      >
                        {s}
                        <ArrowRight size={12} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((m) => (
                    <div 
                      key={m.id}
                      className={cn(
                        "flex flex-col max-w-[85%] animate-in fade-in slide-in-from-bottom-2",
                        m.role === 'user' ? "ml-auto" : "mr-auto"
                      )}
                    >
                      <div className={cn(
                        "p-3 rounded-2xl text-[12px] leading-relaxed",
                        m.role === 'user' 
                          ? "bg-cyan-600 text-white rounded-tr-none" 
                          : "bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none prose prose-invert prose-sm max-w-none prose-p:my-0 prose-headings:text-cyan-400 prose-headings:text-sm"
                      )}>
                        {m.role === 'assistant' ? (
                          <ReactMarkdown>{m.content}</ReactMarkdown>
                        ) : (
                          m.content
                        )}
                      </div>
                      <div className={cn(
                        "flex items-center mt-1 text-[9px] text-slate-500 font-mono",
                        m.role === 'user' ? "justify-end" : "justify-start"
                      )}>
                        <Clock size={10} className="mr-1" />
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex flex-col mr-auto max-w-[85%]">
                        <div className="p-4 rounded-2xl rounded-tl-none bg-slate-800 border border-slate-700 flex items-center gap-3">
                            <Bot className="text-cyan-400 animate-pulse" size={16} />
                            <div className="flex gap-1">
                                <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="w-1 h-1 rounded-full bg-cyan-500" />
                                <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1 h-1 rounded-full bg-cyan-500" />
                                <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1 h-1 rounded-full bg-cyan-500" />
                            </div>
                        </div>
                    </div>
                  )}

                  {error && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] flex gap-2">
                        <AlertCircle size={14} className="shrink-0" />
                        {error}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-900/80 border-t border-white/5">
              <div className="relative group">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask for an operational briefing..."
                  disabled={isLoading}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-4 pr-12 text-[12px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all resize-none min-h-[44px] max-h-[120px] no-scrollbar"
                  rows={1}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={cn(
                    "absolute right-2 bottom-2 p-2 rounded-lg transition-all",
                    input.trim() && !isLoading 
                      ? "bg-cyan-600 text-white hover:bg-cyan-500" 
                      : "text-slate-600"
                  )}
                >
                  <Send size={16} />
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-[10px] text-slate-600 font-medium">Shift + Enter for new line</p>
                {messages.length > 0 && (
                   <span className="text-[10px] text-slate-500 font-mono">CONTEXT: ACTIVE_TELEMETRY</span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
