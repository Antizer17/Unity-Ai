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
    // Solid one-color card (no separate border outline)
    cardBg: string;
    // Solid tab button colors (no separate border outline)
    buttonBg: string;
    buttonActiveBg: string;
    // Solid badge
    badgeBg: string;
    // Solid simulation screen preview inside
    previewBg: string;
    previewItemBg: string;
    previewCodeBg: string;
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
      name: 'Pastel Sky Slate',
      cardBg: '#173449',
      buttonBg: '#173449',
      buttonActiveBg: '#0284c7',
      badgeBg: '#0284c7',
      previewBg: '#0f2230',
      previewItemBg: '#1b3d54',
      previewCodeBg: '#234e6c',
      accentColor: '#38bdf8',
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
      name: 'Pastel Mint Sage',
      cardBg: '#14382e',
      buttonBg: '#14382e',
      buttonActiveBg: '#059669',
      badgeBg: '#059669',
      previewBg: '#0d251e',
      previewItemBg: '#194539',
      previewCodeBg: '#215647',
      accentColor: '#6ee7b7',
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
      name: 'Pastel Plum Wine',
      cardBg: '#381a26',
      buttonBg: '#381a26',
      buttonActiveBg: '#e11d48',
      badgeBg: '#e11d48',
      previewBg: '#251119',
      previewItemBg: '#44202e',
      previewCodeBg: '#57293b',
      accentColor: '#fb7185',
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
      name: 'Pastel Amber Slate',
      cardBg: '#362514',
      buttonBg: '#362514',
      buttonActiveBg: '#d97706',
      badgeBg: '#d97706',
      previewBg: '#23180c',
      previewItemBg: '#452f19',
      previewCodeBg: '#573b20',
      accentColor: '#fbbf24',
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
      name: 'Pastel Lilac Violet',
      cardBg: '#271838',
      buttonBg: '#271838',
      buttonActiveBg: '#7c3aed',
      badgeBg: '#7c3aed',
      previewBg: '#1a0f26',
      previewItemBg: '#35214c',
      previewCodeBg: '#472c66',
      accentColor: '#c084fc',
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
      {/* ─── Top Solid Pastel Tab Selector (Fully Solid Colors, No Borders) ────────────── */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto pb-4 custom-scrollbar">
        {FUNCTION_CARDS.map((item, idx) => {
          const isSelected = idx === currentIndex;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                'px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 shadow-md',
                isSelected ? 'scale-105 shadow-xl ring-2 ring-white/70' : 'opacity-85 hover:opacity-100 hover:scale-[1.02]'
              )}
              style={{
                backgroundColor: isSelected ? item.theme.buttonActiveBg : item.theme.buttonBg,
                color: '#ffffff',
                border: 'none',
              }}
            >
              <span>{item.tabLabel}</span>
            </button>
          );
        })}
      </div>

      {/* ─── Solid One-Color Card Stage (No Outlines, Text in White & Grey) ────────── */}
      <div className="relative mt-4 px-2 sm:px-14">
        {/* Navigation Arrow Left (Solid Color, No Transparency) */}
        <button
          onClick={handlePrev}
          aria-label="Previous function"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-slate-900 hover:bg-black text-white shadow-xl hover:scale-105 transition-all cursor-pointer"
          style={{ border: 'none' }}
        >
          <span className="text-xl font-bold leading-none select-none">←</span>
        </button>

        {/* Navigation Arrow Right (Solid Color, No Transparency) */}
        <button
          onClick={handleNext}
          aria-label="Next function"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-slate-900 hover:bg-black text-white shadow-xl hover:scale-105 transition-all cursor-pointer"
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
              className="rounded-[32px] sm:rounded-[40px] p-6 sm:p-12 shadow-2xl transition-colors duration-500"
              style={{
                backgroundColor: card.theme.cardBg,
                border: 'none',
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Column: Description & Highlights */}
                <div className="lg:col-span-6 space-y-5 text-left">
                  {/* Badge */}
                  <div
                    className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm"
                    style={{
                      backgroundColor: card.theme.badgeBg,
                      color: '#ffffff',
                      border: 'none',
                    }}
                  >
                    {card.badge}
                  </div>

                  {/* Title in White that pops */}
                  <h3 className="font-heading text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
                    {card.title}
                  </h3>

                  {/* Description in Grey that pops */}
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                    {card.description}
                  </p>

                  {/* Feature Bullets in clean grey */}
                  <div className="pt-2 space-y-2.5">
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-slate-200">
                      <span className="font-bold text-white select-none">—</span>
                      <span>Verbatim timestamped indexing</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-slate-200">
                      <span className="font-bold text-white select-none">—</span>
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
                idx === currentIndex ? 'w-8 shadow-sm' : 'w-2.5 opacity-60 hover:opacity-100'
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
 * Screen UI Simulation inside the Card (Solid One-Color, Text in White & Grey)
 */
function CardScreenPreview({ card }: { card: FunctionCardData }) {
  if (card.id === 'transcription') {
    return (
      <div
        className="rounded-2xl p-4 sm:p-5 shadow-lg space-y-3 font-sans"
        style={{ backgroundColor: card.theme.previewBg, border: 'none' }}
      >
        <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
          <span className="font-heading text-xs font-bold text-white tracking-wider uppercase">
            Whisper Transcript
          </span>
          <span
            className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: card.theme.badgeBg, color: '#ffffff' }}
          >
            Live Sync
          </span>
        </div>

        {/* Waveform graphic bars */}
        <div
          className="h-8 flex items-center justify-between gap-1 px-2 rounded-lg"
          style={{ backgroundColor: card.theme.previewItemBg }}
        >
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
          <div
            className="p-3 rounded-xl"
            style={{ backgroundColor: card.theme.previewItemBg }}
          >
            <span
              className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded mr-2"
              style={{ backgroundColor: card.theme.badgeBg, color: '#ffffff' }}
            >
              00:15
            </span>
            <span className="text-xs text-slate-200">
              "Today we will explore backpropagation and loss functions in depth."
            </span>
          </div>
          <div
            className="p-3 rounded-xl"
            style={{ backgroundColor: card.theme.previewCodeBg }}
          >
            <span
              className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded mr-2"
              style={{ backgroundColor: card.theme.badgeBg, color: '#ffffff' }}
            >
              01:04
            </span>
            <span className="text-xs font-semibold text-white">
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
        className="rounded-2xl p-4 sm:p-5 shadow-lg space-y-3 font-sans"
        style={{ backgroundColor: card.theme.previewBg, border: 'none' }}
      >
        <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
          <span className="font-heading text-xs font-bold text-white tracking-wider uppercase">
            Generated Study Notes
          </span>
          <span
            className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: card.theme.badgeBg, color: '#ffffff' }}
          >
            Markdown
          </span>
        </div>

        <div className="space-y-2.5">
          <div
            className="p-3.5 rounded-xl space-y-1.5"
            style={{ backgroundColor: card.theme.previewItemBg }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Topic: Gradient Descent</span>
              <span
                className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: card.theme.previewCodeBg, color: card.theme.accentColor }}
              >
                02:45
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-normal">
              Optimization algorithm that iteratively adjusts weights to minimize the objective cost function.
            </p>
          </div>

          <div
            className="p-3.5 rounded-xl space-y-1.5"
            style={{ backgroundColor: card.theme.previewItemBg }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Key Formula</span>
              <span
                className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: card.theme.previewCodeBg, color: card.theme.accentColor }}
              >
                04:12
              </span>
            </div>
            <code
              className="text-xs font-mono block mt-1.5 p-2 rounded text-white"
              style={{ backgroundColor: card.theme.previewCodeBg }}
            >
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
        className="rounded-2xl p-4 sm:p-5 shadow-lg space-y-3 font-sans"
        style={{ backgroundColor: card.theme.previewBg, border: 'none' }}
      >
        <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
          <span className="font-heading text-xs font-bold text-white tracking-wider uppercase">
            Lecture AI Tutor
          </span>
          <span
            className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: card.theme.badgeBg, color: '#ffffff' }}
          >
            ChromaDB RAG
          </span>
        </div>

        {/* Chat bubbles */}
        <div className="space-y-2.5">
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl bg-black text-white p-3 text-xs rounded-br-xs shadow-md">
              Why do we prefer ReLU over Sigmoid for deep neural nets?
            </div>
          </div>

          <div className="flex justify-start">
            <div
              className="max-w-[90%] rounded-2xl p-3.5 text-xs text-white rounded-bl-xs shadow-md space-y-2"
              style={{ backgroundColor: card.theme.previewItemBg }}
            >
              <p className="text-slate-200 leading-relaxed font-normal">
                ReLU prevents the <strong className="text-white">vanishing gradient problem</strong> because its derivative is 1 for positive inputs, whereas Sigmoid saturates at 0 and 1.
              </p>
              <div className="flex items-center gap-1.5 pt-1">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: card.theme.badgeBg, color: '#ffffff' }}
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
        className="rounded-2xl p-4 sm:p-5 shadow-lg space-y-3 font-sans"
        style={{ backgroundColor: card.theme.previewBg, border: 'none' }}
      >
        <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
          <span className="font-heading text-xs font-bold text-white tracking-wider uppercase">
            Side-by-Side Sync
          </span>
          <span
            className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: card.theme.badgeBg, color: '#ffffff' }}
          >
            Auto-Scroll
          </span>
        </div>

        {/* Video simulation screen */}
        <div className="w-full aspect-video rounded-xl bg-black flex flex-col justify-between p-3.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-white text-[11px]">
            <span className="font-semibold">Lecture 4: Neural Architecture</span>
            <span className="font-mono text-amber-300">03:42 / 48:10</span>
          </div>

          <div className="flex items-center justify-center">
            <div
              className="px-4 py-2 rounded-full text-white text-xs font-bold tracking-wider uppercase shadow-md cursor-pointer"
              style={{ backgroundColor: card.theme.badgeBg }}
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

        <p className="text-[11px] text-slate-300 text-center font-medium">
          Click any timestamp in notes or chat to jump video playhead instantly
        </p>
      </div>
    );
  }

  // Export card
  return (
    <div
      className="rounded-2xl p-4 sm:p-5 shadow-lg space-y-3 font-sans"
      style={{ backgroundColor: card.theme.previewBg, border: 'none' }}
    >
      <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
        <span className="font-heading text-xs font-bold text-white tracking-wider uppercase">
          Export & Study Anywhere
        </span>
        <span
          className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
          style={{ backgroundColor: card.theme.badgeBg, color: '#ffffff' }}
        >
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
            className="p-3 rounded-xl transition-all cursor-pointer shadow-sm"
            style={{ backgroundColor: card.theme.previewItemBg }}
          >
            <span
              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
              style={{ backgroundColor: card.theme.previewCodeBg, color: card.theme.accentColor }}
            >
              {fmt.ext}
            </span>
            <p className="text-xs font-bold text-white mt-1.5">{fmt.name}</p>
            <p className="text-[10px] text-slate-300 mt-0.5">{fmt.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
