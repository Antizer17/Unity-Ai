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
    // Solid one-color pastel card (original pastel colors, no border outline)
    cardBg: string;
    // Solid active tab color (only shown when clicked)
    activeTabBg: string;
    activeTabText: string;
    // Solid badge
    badgeBg: string;
    badgeText: string;
    accentColor: string;
  };
}

export const FUNCTION_CARDS: FunctionCardData[] = [
  {
    id: 'transcription',
    tabLabel: 'AI Transcription',
    badge: '01 · Whisper AI',
    title: 'Automatic Audio & Video Transcription',
    description:
      'Upload any lecture video (MP4, WebM) or audio file (MP3, WAV), or paste a YouTube URL. Whisper AI processes the speech into timestamped, speaker-segmented text ready for study.',
    theme: {
      name: 'Sky Blue',
      cardBg: '#d7ebfc',
      activeTabBg: '#d7ebfc',
      activeTabText: '#0c4a6e',
      badgeBg: '#cbe5fb',
      badgeText: '#075985',
      accentColor: '#0284c7',
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
      cardBg: '#d7f3e8',
      activeTabBg: '#d7f3e8',
      activeTabText: '#064e3b',
      badgeBg: '#c2edd9',
      badgeText: '#065f46',
      accentColor: '#059669',
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
      cardBg: '#fcdde3',
      activeTabBg: '#fcdde3',
      activeTabText: '#881337',
      badgeBg: '#f9cad6',
      badgeText: '#9f1239',
      accentColor: '#e11d48',
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
      cardBg: '#faf0d2',
      activeTabBg: '#faf0d2',
      activeTabText: '#78350f',
      badgeBg: '#f6e4b4',
      badgeText: '#92400e',
      accentColor: '#d97706',
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
      cardBg: '#ebdffa',
      activeTabBg: '#ebdffa',
      activeTabText: '#581c87',
      badgeBg: '#dec7f7',
      badgeText: '#6b21a8',
      accentColor: '#7c3aed',
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
      {/* ─── Top Tab Selector (All buttons same color, only clicked shows pastel color) ────────────── */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto pb-4 custom-scrollbar">
        {FUNCTION_CARDS.map((item, idx) => {
          const isSelected = idx === currentIndex;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                'px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer shrink-0 shadow-xs',
                isSelected
                  ? 'scale-105 shadow-md font-bold'
                  : 'bg-white hover:bg-slate-50 text-slate-700 shadow-2xs'
              )}
              style={
                isSelected
                  ? {
                      backgroundColor: item.theme.activeTabBg,
                      color: item.theme.activeTabText,
                      border: 'none',
                    }
                  : {
                      backgroundColor: '#ffffff',
                      color: '#334155',
                      border: 'none',
                    }
              }
            >
              <span>{item.tabLabel}</span>
            </button>
          );
        })}
      </div>

      {/* ─── Solid One-Color Pastel Card Stage (No Outline Borders) ────────── */}
      <div className="relative mt-4 px-2 sm:px-14">
        {/* Navigation Arrow Left */}
        <button
          onClick={handlePrev}
          aria-label="Previous function"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-white hover:bg-slate-900 text-slate-800 hover:text-white shadow-lg hover:scale-105 transition-all cursor-pointer"
          style={{ border: 'none' }}
        >
          <span className="text-xl font-bold leading-none select-none">←</span>
        </button>

        {/* Navigation Arrow Right */}
        <button
          onClick={handleNext}
          aria-label="Next function"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-white hover:bg-slate-900 text-slate-800 hover:text-white shadow-lg hover:scale-105 transition-all cursor-pointer"
          style={{ border: 'none' }}
        >
          <span className="text-xl font-bold leading-none select-none">→</span>
        </button>

        {/* Swipable Card Frame */}
        <AnimatePresence mode="wait">
          <motion.div
            key={card.id}
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -15 }}
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
            {/* Fully Solid One-Color Card (Zero Outline Border) */}
            <div
              className="rounded-[32px] sm:rounded-[40px] p-5 sm:p-8 shadow-xl transition-colors duration-500"
              style={{
                backgroundColor: card.theme.cardBg,
                border: 'none',
              }}
            >
              {/* Inner Retina Display Surface (Solid White, No Borders) */}
              <div
                className="rounded-2xl sm:rounded-3xl bg-white p-6 sm:p-10 shadow-sm text-left"
                style={{ border: 'none' }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Left Column: Description & Highlights */}
                  <div className="lg:col-span-6 space-y-4">
                    {/* Title */}
                    <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                      {card.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                      {card.description}
                    </p>

                    {/* Feature Bullets */}
                    <div className="pt-2 space-y-2.5">
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

        {/* ─── Bottom Pagination Indicators ─────── */}
        <div className="mt-5 flex items-center justify-center gap-2 px-2">
          {FUNCTION_CARDS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={cn(
                'h-2.5 rounded-full transition-all cursor-pointer',
                idx === currentIndex ? 'w-8 shadow-xs' : 'w-2.5 opacity-50 hover:opacity-100'
              )}
              style={{
                backgroundColor: idx === currentIndex ? card.theme.accentColor : '#94a3b8',
                border: 'none',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Screen UI Simulation inside the Card (Solid Colors, No Borders)
 */
function CardScreenPreview({ card }: { card: FunctionCardData }) {
  if (card.id === 'transcription') {
    return (
      <div
        className="rounded-2xl bg-slate-50 p-4 sm:p-5 shadow-xs space-y-3 font-sans"
        style={{ border: 'none' }}
      >
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
          <span className="font-heading text-xs font-bold text-slate-800 tracking-wider uppercase">
            Whisper Transcript
          </span>
        </div>

        {/* Waveform graphic bars */}
        <div className="h-8 flex items-center justify-between gap-1 px-2 bg-white rounded-lg">
          {[40, 75, 55, 90, 60, 80, 45, 95, 70, 85, 30, 65, 90, 50, 75, 40].map((h, i) => (
            <span
              key={i}
              className="w-1.5 rounded-full"
              style={{ height: `${h}%`, backgroundColor: card.theme.accentColor }}
            />
          ))}
        </div>

        {/* Timestamped lines */}
        <div className="space-y-2 pt-1">
          <div className="p-3 rounded-xl bg-white shadow-2xs">
            <span
              className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded mr-2"
              style={{ backgroundColor: card.theme.badgeBg, color: card.theme.badgeText }}
            >
              00:15
            </span>
            <span className="text-xs text-slate-700">
              "Today we will explore backpropagation and loss functions in depth."
            </span>
          </div>
          <div
            className="p-3 rounded-xl shadow-2xs"
            style={{ backgroundColor: card.theme.cardBg }}
          >
            <span
              className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded mr-2 bg-white text-slate-900"
            >
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
      <div
        className="rounded-2xl bg-slate-50 p-4 sm:p-5 shadow-xs space-y-3 font-sans"
        style={{ border: 'none' }}
      >
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
          <span className="font-heading text-xs font-bold text-slate-800 tracking-wider uppercase">
            Generated Study Notes
          </span>
        </div>

        <div className="space-y-2.5">
          <div className="p-3.5 rounded-xl bg-white shadow-2xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Topic: Gradient Descent</span>
              <span
                className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: card.theme.badgeBg, color: card.theme.badgeText }}
              >
                02:45
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Optimization algorithm that iteratively adjusts weights to minimize the objective cost function.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white shadow-2xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Key Formula</span>
              <span
                className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: card.theme.badgeBg, color: card.theme.badgeText }}
              >
                04:12
              </span>
            </div>
            <code className="text-xs font-mono block mt-1 p-2 rounded bg-slate-100 text-slate-800">
              w := w - η * ∇L(w)
            </code>
          </div>
        </div>
      </div>
    );
  }

  if (card.id === 'tutor') {
    return (
      <div
        className="rounded-2xl bg-slate-50 p-4 sm:p-5 shadow-xs space-y-3 font-sans"
        style={{ border: 'none' }}
      >
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
          <span className="font-heading text-xs font-bold text-slate-800 tracking-wider uppercase">
            Lecture AI Tutor
          </span>
        </div>

        {/* Chat bubbles */}
        <div className="space-y-2.5">
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl bg-slate-900 text-white p-3 text-xs rounded-br-xs shadow-md">
              Why do we prefer ReLU over Sigmoid for deep neural nets?
            </div>
          </div>

          <div className="flex justify-start">
            <div className="max-w-[90%] rounded-2xl bg-white p-3.5 text-xs text-slate-800 rounded-bl-xs shadow-xs space-y-2">
              <p className="text-slate-700 leading-relaxed font-normal">
                ReLU prevents the <strong className="text-slate-900">vanishing gradient problem</strong> because its derivative is 1 for positive inputs, whereas Sigmoid saturates at 0 and 1.
              </p>
              <div className="flex items-center gap-1.5 pt-1">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: card.theme.badgeBg, color: card.theme.badgeText }}
                >
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
      <div
        className="rounded-2xl bg-slate-50 p-4 sm:p-5 shadow-xs space-y-3 font-sans"
        style={{ border: 'none' }}
      >
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
          <span className="font-heading text-xs font-bold text-slate-800 tracking-wider uppercase">
            Side-by-Side Sync
          </span>
        </div>

        {/* Video simulation screen */}
        <div className="w-full aspect-video rounded-xl bg-slate-950 flex flex-col justify-between p-3.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-white text-[11px]">
            <span className="font-semibold">Lecture 4: Neural Architecture</span>
            <span className="font-mono text-amber-300">03:42 / 48:10</span>
          </div>

          <div className="flex items-center justify-center">
            <div
              className="px-4 py-2 rounded-full text-white text-xs font-bold tracking-wider uppercase shadow-md cursor-pointer"
              style={{ backgroundColor: card.theme.accentColor }}
            >
              Play Lecture
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 rounded-full bg-white/20">
            <div
              className="h-full rounded-full w-2/5"
              style={{ backgroundColor: card.theme.accentColor }}
            />
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
    <div
      className="rounded-2xl bg-slate-50 p-4 sm:p-5 shadow-xs space-y-3 font-sans"
      style={{ border: 'none' }}
    >
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
        <span className="font-heading text-xs font-bold text-slate-800 tracking-wider uppercase">
          Export & Study Anywhere
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
            className="p-3 rounded-xl bg-white shadow-2xs transition-all cursor-pointer"
          >
            <span
              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
              style={{ backgroundColor: card.theme.badgeBg, color: card.theme.badgeText }}
            >
              {fmt.ext}
            </span>
            <p className="text-xs font-bold text-slate-800 mt-1.5">{fmt.name}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{fmt.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
