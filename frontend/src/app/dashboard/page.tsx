'use client';

import React, { useState, useRef } from 'react';
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
          Welcome back, {mockUser.name.split(' ')[0]}. I&apos;m ready to help you learn.
        </p>
      </motion.div>

      {/* Main Input Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-3xl mb-12"
      >
        <div className="relative rounded-3xl border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-lg focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all overflow-hidden group">
          <div className="flex items-end px-4 py-4 min-h-[64px]">
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
                'p-2.5 rounded-full shrink-0 transition-all duration-200 ml-2',
                input.trim()
                  ? 'bg-indigo-500 text-white hover:bg-indigo-600 shadow-md'
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
