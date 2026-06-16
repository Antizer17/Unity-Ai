'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, Copy, RotateCw, ThumbsUp, ThumbsDown, Sparkles, User, Video, Mic, FileText, Globe } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/types';

export interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage?: (content: string) => void;
  onTimestampClick?: (seconds: number) => void;
  loading?: boolean;
  id?: string;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 py-4">
      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0 shadow-sm">
        <Sparkles className="h-4 w-4 text-white" />
      </div>
      <div className="flex items-center gap-1.5 px-3 py-2">
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
          className="w-2 h-2 rounded-full bg-[var(--text-muted)]"
        />
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
          className="w-2 h-2 rounded-full bg-[var(--text-muted)]"
        />
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
          className="w-2 h-2 rounded-full bg-[var(--text-muted)]"
        />
      </div>
    </div>
  );
}

export function ChatPanel({
  messages,
  onSendMessage,
  loading = false,
  id = 'chat-panel',
}: ChatPanelProps) {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [uploadMenuOpen, setUploadMenuOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const uploadMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (uploadMenuRef.current && !uploadMenuRef.current.contains(e.target as Node)) {
        setUploadMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage?.(input.trim());
    setInput('');
    setIsTyping(true);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setTimeout(() => setIsTyping(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div id={id} className="flex flex-col flex-1 h-full w-full bg-[var(--bg-primary)]">
      {/* Messages Feed */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6 md:px-8 space-y-6"
      >
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 max-w-md mx-auto">
            <div className="p-4 rounded-full bg-[var(--color-surface)] border border-[var(--border-color)] mb-6 shadow-sm">
              <Sparkles className="h-8 w-8 text-indigo-500" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              How can I help you study?
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Ask questions about the lecture, request a summary, or let me quiz you on the material.
            </p>
          </div>
        )}

        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className={cn(
                'flex gap-4 w-full',
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {msg.role === 'assistant' && (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0 shadow-sm mt-1">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              )}

              <div className="flex flex-col gap-2 max-w-[80%]">
                <div
                  className={cn(
                    'px-5 py-3.5 text-[15px] leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-3xl rounded-tr-sm'
                      : 'bg-transparent text-[var(--text-primary)] rounded-3xl rounded-tl-sm'
                  )}
                >
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  )}
                </div>

                {/* Assistant Micro-Actions */}
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-1 text-[var(--text-muted)] ml-2 mt-1">
                    <button className="p-1.5 hover:bg-[var(--color-surface)] hover:text-[var(--text-primary)] rounded-md transition-colors" title="Copy">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button className="p-1.5 hover:bg-[var(--color-surface)] hover:text-[var(--text-primary)] rounded-md transition-colors" title="Regenerate">
                      <RotateCw className="h-3.5 w-3.5" />
                    </button>
                    <div className="w-px h-3.5 bg-[var(--border-color)] mx-1" />
                    <button className="p-1.5 hover:bg-[var(--color-surface)] hover:text-[var(--text-primary)] rounded-md transition-colors" title="Helpful">
                      <ThumbsUp className="h-3.5 w-3.5" />
                    </button>
                    <button className="p-1.5 hover:bg-[var(--color-surface)] hover:text-[var(--text-primary)] rounded-md transition-colors" title="Not Helpful">
                      <ThumbsDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="h-8 w-8 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center shrink-0 shadow-sm mt-1">
                  <User className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                </div>
              )}
            </motion.div>
          ))}
          {isTyping && <TypingIndicator />}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 md:px-8 pb-6 md:pb-8 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)] to-transparent sticky bottom-0 w-full">
        <div className="max-w-3xl mx-auto relative rounded-3xl border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-sm focus-within:ring-1 focus-within:ring-[var(--border-color)] transition-all">
          <div className="flex items-end px-3 py-3">
            <div className="relative" ref={uploadMenuRef}>
              <button 
                onClick={() => setUploadMenuOpen(!uploadMenuOpen)}
                className={cn(
                  "p-2 rounded-full transition-colors shrink-0 mb-0.5",
                  uploadMenuOpen 
                    ? "bg-[var(--color-surface)] text-[var(--text-primary)]" 
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--color-surface)]"
                )}
              >
                <Paperclip className="h-5 w-5" />
              </button>

              <AnimatePresence>
                {uploadMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full left-0 mb-2 w-56 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-xl p-2 z-50 flex flex-col gap-1"
                  >
                    <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--color-surface)] text-left group transition-colors">
                      <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                        <Video className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium text-[var(--text-primary)]">Video Lecture</span>
                    </button>
                    <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--color-surface)] text-left group transition-colors">
                      <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                        <Mic className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium text-[var(--text-primary)]">Audio Recording</span>
                    </button>
                    <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--color-surface)] text-left group transition-colors">
                      <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                        <FileText className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium text-[var(--text-primary)]">Document / PDF</span>
                    </button>
                    <div className="h-px w-full bg-[var(--border-color)] my-1" />
                    <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--color-surface)] text-left group transition-colors">
                      <div className="p-1.5 rounded-lg bg-slate-500/10 text-slate-400 group-hover:bg-slate-500/20 transition-colors">
                        <Globe className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium text-[var(--text-primary)]">Web Link</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Message Unity-AI..."
              className="flex-1 max-h-[200px] bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] px-3 py-2 text-[15px] resize-none focus:outline-none custom-scrollbar"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={cn(
                'p-2 rounded-full shrink-0 mb-0.5 transition-all duration-200',
                input.trim()
                  ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-80'
                  : 'bg-[var(--color-surface)] text-[var(--text-muted)] cursor-not-allowed'
              )}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <div className="px-4 pb-2 text-center text-xs text-[var(--text-muted)]">
            Unity-AI can make mistakes. Consider verifying important information.
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPanel;
