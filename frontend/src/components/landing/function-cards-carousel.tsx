'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface FunctionCardData {
  id: string;
  tabLabel: string;
  badge: string;
  title: string;
  description: string;
  theme: {
    name: string;
    // iPad pastel chassis (outer frame)
    chassisBg: string;
    chassisBorder: string;
    // Tab pill styling
    tabBgActive: string;
    tabTextActive: string;
    tabBorderActive: string;
    // Badge styling
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    // Accent inside the screen
    accentText: string;
    accentBg: string;
    accentBorder: string;
  };
}

export const FUNCTION_CARDS: FunctionCardData[] = [
  {
    id: 'transcription',
    tabLabel: 'AI Transcription',
    badge: '01 · Whisper AI',
    title: 'Automatic Audio & Video Transcription',
    description:
      'Upload any lecture video (MP4, WebM) or audio file (MP3, WAV), or paste a YouTube URL. Whisper AI processes the speech into timestamped, speaker-segmented text with 98.5% verbatim accuracy.',
    theme: {
      name: 'Sky Blue',
      chassisBg: '#d7ebfc',
      chassisBorder: '#b5dbf8',
      tabBgActive: '#e0f0fd',
      tabTextActive: '#0c4a6e',
      tabBorderActive: '#7dd3fc',
      badgeBg: '#cbe5fb',
      badgeText: '#075985',
      badgeBorder: '#93c5fd',
      accentText: '#0284c7',
      accentBg: '#e0f2fe',
      accentBorder: '#bae6fd',
    },
  },
  {
    id: 'notes',
    tabLabel: 'Smart Notes',
    badge: '02 · LLM Intelligence',
    title: 'Structured, Topic-Organized Notes',
    description:
      'Never scramble to take notes again. Our LLM analyzes the transcript to generate clean topic outlines, key concept definitions, and bullet-point summaries linked to exact video moments.',
    theme: {
      name: 'Mint Sage',
      chassisBg: '#d7f3e8',
      chassisBorder: '#ade6d1',
      tabBgActive: '#dcfce7',
      tabTextActive: '#064e3b',
      tabBorderActive: '#6ee7b7',
      badgeBg: '#c2edd9',
      badgeText: '#065f46',
      badgeBorder: '#a7f3d0',
      accentText: '#059669',
      accentBg: '#ecfdf5',
      accentBorder: '#a7f3d0',
    },
  },
  {
    id: 'tutor',
    tabLabel: 'AI Tutor Chatbot',
    badge: '03 · Vector RAG',
    title: 'Ask Questions with Exact Citations',
    description:
      'Have questions about a difficult proof or concept? Chat directly with the AI tutor. ChromaDB vector search indexes every chunk of the lecture, so you get answers with exact video timestamps.',
    theme: {
      name: 'Blossom Pink',
      chassisBg: '#fcdde3',
      chassisBorder: '#f7b8c7',
      tabBgActive: '#ffe4e6',
      tabTextActive: '#881337',
      tabBorderActive: '#f43f5e',
      badgeBg: '#f9cad6',
      badgeText: '#9f1239',
      badgeBorder: '#fbcfe8',
      accentText: '#e11d48',
      accentBg: '#fff1f2',
      accentBorder: '#fecdd3',
    },
  },
  {
    id: 'sync-player',
    tabLabel: 'Parallel Player',
    badge: '04 · Parallel Learning',
    title: 'Synchronized Video & Note Following',
    description:
      'Watch the video lecture side-by-side with live transcripts and notes. Click any timestamp in the notes to immediately seek the video to that exact point without losing your train of thought.',
    theme: {
      name: 'Starlight Cream',
      chassisBg: '#faf0d2',
      chassisBorder: '#edd89b',
      tabBgActive: '#fef3c7',
      tabTextActive: '#78350f',
      tabBorderActive: '#f59e0b',
      badgeBg: '#f6e4b4',
      badgeText: '#92400e',
      badgeBorder: '#fde68a',
      accentText: '#d97706',
      accentBg: '#fffbeb',
      accentBorder: '#fde68a',
    },
  },
  {
    id: 'export',
    tabLabel: 'Study Export',
    badge: '05 · Study Guides',
    title: 'Export to Markdown, PDF & Docs',
    description:
      'Take your study materials everywhere. Export full structured notes, flashcard summaries, or complete raw transcripts formatted for Obsidian, Notion, Google Docs, or printable PDF sheets.',
    theme: {
      name: 'Lavender Lilac',
      chassisBg: '#ebdffa',
      chassisBorder: '#d4c0f3',
      tabBgActive: '#f3e8ff',
      tabTextActive: '#581c87',
      tabBorderActive: '#c084fc',
      badgeBg: '#dec7f7',
      badgeText: '#6b21a8',
      badgeBorder: '#e9d5ff',
      accentText: '#7c3aed',
      accentBg: '#faf5ff',
      accentBorder: '#e9d5ff',
    },
  },
];

export function FunctionCardsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const card = FUNCTION_CARDS[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % FUNCTION_CARDS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + FUNCTION_CARDS.length) % FUNCTION_CARDS.length);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* ─── Top Pastel Tab Selector (iPad Color Palette) ────────────── */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 overflow-x-auto pb-4 custom-scrollbar">
        {FUNCTION_CARDS.map((item, idx) => {
          const isSelected = idx === currentIndex;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 shadow-xs border',
                isSelected
                  ? 'scale-105 shadow-md font-bold'
                  : 'bg-white/80 hover:bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              )}
              style={
                isSelected
                  ? {
                      backgroundColor: item.theme.tabBgActive,
                      color: item.theme.tabTextActive,
                      borderColor: item.theme.tabBorderActive,
                    }
                  : undefined
              }
            >
              {/* Color swatch dot */}
              <span
                className="w-2.5 h-2.5 rounded-full border border-black/15 shrink-0"
                style={{ backgroundColor: item.theme.chassisBg }}
              />
              <span>{item.tabLabel}</span>
            </button>
          );
        })}
      </div>

      {/* ─── Swipeable iPad Pastel Card Stage ────────────────────────── */}
      <div className="relative mt-4 px-2 sm:px-14">
        {/* Navigation Arrow Left (Clean Typography, No Icon) */}
        <button
          onClick={handlePrev}
          aria-label="Previous function"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-white/90 hover:bg-white text-slate-800 hover:text-black border border-slate-300/80 shadow-lg hover:scale-105 transition-all cursor-pointer"
        >
          <span className="text-xl font-bold leading-none select-none">←</span>
        </button>

        {/* Navigation Arrow Right (Clean Typography, No Icon) */}
        <button
          onClick={handleNext}
          aria-label="Next function"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-white/90 hover:bg-white text-slate-800 hover:text-black border border-slate-300/80 shadow-lg hover:scale-105 transition-all cursor-pointer"
        >
          <span className="text-xl font-bold leading-none select-none">→</span>
        </button>

        {/* Swipable Card Frame (Framer Motion Touch/Mouse Drag) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.97, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -40) handleNext();
              else if (info.offset.x > 40) handlePrev();
            }}
            className="cursor-grab active:cursor-grabbing select-none"
          >
            {/* iPad Chassis (Outer Pastel Aluminum Shell) */}
            <div
              className="rounded-[32px] sm:rounded-[40px] p-4 sm:p-8 shadow-[0_22px_55px_-15px_rgba(0,0,0,0.14)] transition-colors duration-500 border-2"
              style={{
                backgroundColor: card.theme.chassisBg,
                borderColor: card.theme.chassisBorder,
              }}
            >
              {/* iPad Top Camera Pin */}
              <div className="flex items-center justify-center mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-black/25 border border-white/40 shadow-inner" />
              </div>

              {/* iPad Retina Display Screen (Crisp White Glass Surface) */}
              <div className="rounded-2xl sm:rounded-3xl bg-white border border-white/80 shadow-inner p-6 sm:p-10 text-left">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Left Column: Description & Highlights */}
                  <div className="lg:col-span-6 space-y-4">
                    {/* Badge (Clean typography, no icon) */}
                    <div
                      className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-2xs"
                      style={{
                        backgroundColor: card.theme.badgeBg,
                        color: card.theme.badgeText,
                        borderColor: card.theme.badgeBorder,
                      }}
                    >
                      {card.badge}
                    </div>

                    {/* Title in Space Grotesk */}
                    <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                      {card.title}
                    </h3>

                    {/* Description in Inter */}
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                      {card.description}
                    </p>

                    {/* Feature Bullets (Clean typographic dash, no icons) */}
                    <div className="pt-3 space-y-2.5">
                      <div className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-slate-700">
                        <span className="font-bold text-slate-400 select-none">—</span>
                        <span>Verbatim timestamped indexing</span>
                      </div>
                      <div className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-slate-700">
                        <span className="font-bold text-slate-400 select-none">—</span>
                        <span>One-click jump directly to key lecture moments</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Screen UI Simulation */}
                  <div className="lg:col-span-6">
                    <CardScreenPreview card={card} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ─── Bottom Pagination Indicators & Controls ─────── */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
          <p className="text-xs text-slate-500 font-medium">
            Swipe left / right or click pills to explore functions
          </p>

          <div className="flex items-center gap-2">
            {FUNCTION_CARDS.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={cn(
                  'h-2.5 rounded-full transition-all cursor-pointer',
                  idx === currentIndex ? 'w-8 shadow-xs' : 'w-2.5 opacity-60 hover:opacity-100'
                )}
                style={{
                  backgroundColor:
                    idx === currentIndex ? card.theme.accentText : 'rgba(100, 116, 139, 0.3)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Screen UI Simulation inside the iPad Retina Screen (Strictly No Icons or Emojis)
 */
function CardScreenPreview({ card }: { card: FunctionCardData }) {
  if (card.id === 'transcription') {
    return (
      <div className="rounded-2xl bg-slate-50 border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3 font-sans">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
          <span className="font-heading text-xs font-bold text-slate-800 tracking-wider uppercase">
            Whisper Transcript
          </span>
          <span className="text-[11px] font-semibold text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full">
            Live Sync
          </span>
        </div>

        {/* Waveform graphic bars */}
        <div className="h-8 flex items-center justify-between gap-1 px-1.5 bg-white rounded-lg border border-slate-200/60">
          {[40, 75, 55, 90, 60, 80, 45, 95, 70, 85, 30, 65, 90, 50, 75, 40].map((h, i) => (
            <span
              key={i}
              className="w-1.5 rounded-full bg-sky-400"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>

        {/* Timestamped lines */}
        <div className="space-y-2 pt-1">
          <div className="p-2.5 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
            <span className="text-[11px] font-mono font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded mr-2">
              00:15
            </span>
            <span className="text-xs text-slate-700">
              "Today we will explore backpropagation and loss functions in depth."
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-sky-50/70 border border-sky-200/60 shadow-2xs">
            <span className="text-[11px] font-mono font-bold text-sky-800 bg-sky-100 px-1.5 py-0.5 rounded mr-2">
              01:04
            </span>
            <span className="text-xs font-semibold text-slate-900">
              "Notice how the gradient flows backward from the output layer to the inputs..."
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (card.id === 'notes') {
    return (
      <div className="rounded-2xl bg-slate-50 border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3 font-sans">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
          <span className="font-heading text-xs font-bold text-slate-800 tracking-wider uppercase">
            Generated Study Notes
          </span>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            Markdown
          </span>
        </div>

        <div className="space-y-2.5">
          <div className="p-3 rounded-xl bg-white border border-slate-200/70">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Topic: Gradient Descent</span>
              <span className="text-[11px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                02:45
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              Optimization algorithm that iteratively adjusts weights to minimize the objective cost function.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200/70">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Key Formula</span>
              <span className="text-[11px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                04:12
              </span>
            </div>
            <code className="text-xs font-mono text-emerald-800 bg-emerald-50/60 block mt-1.5 p-1.5 rounded">
              w := w - η * ∇L(w)
            </code>
          </div>
        </div>
      </div>
    );
  }

  if (card.id === 'tutor') {
    return (
      <div className="rounded-2xl bg-slate-50 border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3 font-sans">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
          <span className="font-heading text-xs font-bold text-slate-800 tracking-wider uppercase">
            Lecture AI Tutor
          </span>
          <span className="text-[11px] font-semibold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
            ChromaDB RAG
          </span>
        </div>

        {/* Chat bubbles */}
        <div className="space-y-2.5">
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl bg-slate-900 text-white p-2.5 text-xs rounded-br-xs">
              Why do we prefer ReLU over Sigmoid for deep neural nets?
            </div>
          </div>

          <div className="flex justify-start">
            <div className="max-w-[90%] rounded-2xl bg-white border border-slate-200 p-3 text-xs text-slate-800 rounded-bl-xs shadow-2xs space-y-1.5">
              <p>
                ReLU prevents the <strong>vanishing gradient problem</strong> because its derivative is 1 for positive inputs, whereas Sigmoid saturates at 0 and 1.
              </p>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  Cited: 14:20 - 15:05
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (card.id === 'sync-player') {
    return (
      <div className="rounded-2xl bg-slate-50 border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3 font-sans">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
          <span className="font-heading text-xs font-bold text-slate-800 tracking-wider uppercase">
            Side-by-Side Sync
          </span>
          <span className="text-[11px] font-semibold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
            Auto-Scroll
          </span>
        </div>

        {/* Video simulation screen */}
        <div className="w-full aspect-video rounded-xl bg-slate-950 flex flex-col justify-between p-3.5 relative overflow-hidden border border-slate-800">
          <div className="flex items-center justify-between text-white text-[11px]">
            <span className="font-semibold">Lecture 4: Neural Architecture</span>
            <span className="font-mono text-amber-300">03:42 / 48:10</span>
          </div>

          <div className="flex items-center justify-center">
            <div className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold tracking-wider uppercase backdrop-blur-md cursor-pointer border border-white/20 transition-all">
              Play Lecture
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full bg-white/20">
            <div className="h-full rounded-full bg-amber-400 w-2/5" />
          </div>
        </div>

        <p className="text-[11px] text-slate-500 text-center font-medium">
          Click any timestamp in notes or chat to jump video playhead instantly
        </p>
      </div>
    );
  }

  // Export card
  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3 font-sans">
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
        <span className="font-heading text-xs font-bold text-slate-800 tracking-wider uppercase">
          Export & Study Anywhere
        </span>
        <span className="text-[11px] font-semibold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
          Multi-Format
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5 pt-1">
        {[
          { name: 'Markdown (.md)', desc: 'For Obsidian & Notion', ext: 'MD' },
          { name: 'Formatted PDF', desc: 'Printable study guide', ext: 'PDF' },
          { name: 'Raw Transcript', desc: 'Plain text with timecodes', ext: 'TXT' },
          { name: 'JSON Metadata', desc: 'Full API export', ext: 'JSON' },
        ].map((fmt) => (
          <div
            key={fmt.name}
            className="p-3 rounded-xl bg-white border border-slate-200/70 hover:border-purple-300 transition-all cursor-pointer"
          >
            <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
              {fmt.ext}
            </span>
            <p className="text-xs font-bold text-slate-800 mt-1">{fmt.name}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{fmt.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
