'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Sparkles,
  BookOpen,
  BrainCircuit,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockUser } from '@/lib/mock-data';

const quickPrompts = [
  {
    title: 'Summarize my last lecture',
    icon: BookOpen,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10'
  },
  {
    title: 'Quiz me on Advanced Calculus',
    icon: BrainCircuit,
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10'
  },
  {
    title: 'Explain Thermodynamics simply',
    icon: Lightbulb,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10'
  },
  {
    title: 'Review my generated notes',
    icon: MessageSquare,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10'
  }
];

export default function DashboardPage() {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-6 w-full max-w-4xl mx-auto">
      {/* Welcome Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--border-color)] mb-6 shadow-sm">
          <Sparkles className="h-10 w-10 text-indigo-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] tracking-tight mb-4">
          What do you want to study today?
        </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            I&apos;m ready to help you learn.
          </p>
        </motion.div>
  
        {/* Main Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-3xl mb-12"
        >
          <div className="relative rounded-3xl border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-lg focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all overflow-visible group">
            <div className="flex items-end px-4 py-4 min-h-[64px]">
              
              {/* Paperclip Button & Dropdown */}
              <div className="relative group/upload mr-2">
                <button 
                  className="p-2.5 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--color-surface)] transition-colors shrink-0 mb-0.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-paperclip"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                </button>
                
                {/* Upload Menu (visible on hover) */}
                <div className="absolute bottom-full left-0 mb-2 w-56 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-xl p-2 z-50 flex flex-col gap-1 opacity-0 invisible group-hover/upload:opacity-100 group-hover/upload:visible transition-all pointer-events-none group-hover/upload:pointer-events-auto">
                  <Link href="/lectures/upload" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--color-surface)] text-left transition-colors">
                    <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>
                    </div>
                    <span className="text-sm font-medium text-[var(--text-primary)]">Video Lecture</span>
                  </Link>
                  <Link href="/lectures/upload" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--color-surface)] text-left transition-colors">
                    <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                    </div>
                    <span className="text-sm font-medium text-[var(--text-primary)]">Audio Recording</span>
                  </Link>
                  <Link href="/lectures/upload" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--color-surface)] text-left transition-colors">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
                    </div>
                    <span className="text-sm font-medium text-[var(--text-primary)]">Document / PDF</span>
                  </Link>
                  <div className="h-px w-full bg-[var(--border-color)] my-1" />
                  <Link href="/lectures/upload" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--color-surface)] text-left transition-colors">
                    <div className="p-1.5 rounded-lg bg-slate-500/10 text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
                    </div>
                    <span className="text-sm font-medium text-[var(--text-primary)]">Web Link</span>
                  </Link>
                </div>
              </div>

              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInput}
                placeholder="Ask me anything about your lectures..."
                className="flex-1 max-h-[200px] bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] px-2 py-1 text-lg resize-none focus:outline-none custom-scrollbar"
                rows={1}
              />
              <button
                disabled={!input.trim()}
                className={cn(
                  'p-2.5 rounded-full shrink-0 transition-all duration-200 ml-2 mb-0.5',
                  input.trim()
                    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-80 shadow-md'
                    : 'bg-[var(--color-surface)] text-[var(--text-muted)] cursor-not-allowed'
                )}
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>

      {/* Quick Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => setInput(prompt.title)}
            className="flex items-center gap-4 p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:bg-[var(--color-surface)] transition-colors text-left group"
          >
            <div className={cn('p-2.5 rounded-xl shrink-0', prompt.bg, prompt.color)}>
              <prompt.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-indigo-500 transition-colors">
                {prompt.title}
              </p>
            </div>
          </button>
        ))}
      </motion.div>
    </div>
  );
}
