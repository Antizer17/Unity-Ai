'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Play,
} from 'lucide-react';
import { Footer } from '@/components/layout/footer';
import { Logo } from '@/components/ui/logo';
import { FunctionCardsCarousel } from '@/components/landing/function-cards-carousel';

const workflowSteps = [
  {
    title: 'Upload Audio, Video, or Link',
    description:
      'Upload MP4, MP3, WAV or paste any YouTube lecture URL. Files are safely ingested and prepped for AI processing.',
  },
  {
    title: 'Whisper AI & LLM Extraction',
    description:
      'Whisper AI transcribes with millisecond timecodes while our LLM structures topics, formulas, and key points.',
  },
  {
    title: 'Learn with Side-by-Side Tutor',
    description:
      'Watch synchronized video, read clickable notes, and ask your vector-indexed AI tutor anything with exact citations.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between overflow-x-hidden">
      {/* ─── Light Hero Canvas ───────────────────────────────────────────── */}
      <div className="relative bg-[var(--hero-bg)] text-[var(--hero-text-primary)] transition-colors duration-300 overflow-hidden">
        {/* Soft pastel ambient background glows */}
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-[var(--color-primary)]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-[450px] h-[450px] bg-[var(--color-accent)]/12 rounded-full blur-3xl pointer-events-none" />

        {/* Navbar */}
        <nav className="sticky top-0 z-50 border-b border-[var(--hero-border)] bg-[var(--hero-bg)]/90 backdrop-blur-xl transition-colors duration-300">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-20 items-center justify-between">
              {/* Brand Logo & Name */}
              <Link
                href="/"
                className="flex items-center gap-3 hover:opacity-85 transition-opacity group"
              >
                <Logo size={62} variant="light" priority />
                <span className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight text-[var(--hero-text-primary)]">
                  Unity<span className="text-[var(--hero-accent)]">-AI</span>
                </span>
              </Link>

              {/* Action Buttons with Dark Navy Hover */}
              <div className="flex items-center gap-2 sm:gap-3">
                <Link href="/dashboard" className="hidden sm:block">
                  <button
                    id="landing-guest-chat-btn"
                    className="h-11 px-5 text-sm sm:text-base font-semibold rounded-xl border border-slate-300 bg-white/80 text-slate-800 hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all shadow-2xs font-heading cursor-pointer inline-flex items-center justify-center"
                  >
                    Dashboard
                  </button>
                </Link>

                <Link href="/dashboard">
                  <button
                    id="landing-register-btn"
                    className="h-11 px-6 text-sm sm:text-base font-bold rounded-xl border border-slate-300 bg-white text-slate-900 hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all shadow-xs font-heading cursor-pointer inline-flex items-center justify-center"
                  >
                    Get Started
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--hero-text-primary)] leading-[1.15] max-w-4xl mx-auto"
            >
              Transform Lectures into Interactive Study Sessions
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-6 text-base sm:text-lg text-[var(--hero-text-secondary)] max-w-2xl mx-auto leading-relaxed"
            >
              Upload your lecture recordings and let AI transcribe, generate structured notes, and
              power an intelligent tutor that answers your questions with precision.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
                {/* High Contrast Deep Obsidian CTA Button */}
                <Link href="/dashboard">
                  <button
                    id="landing-hero-cta"
                    className="h-14 px-9 text-base sm:text-lg font-bold rounded-2xl bg-slate-950 hover:bg-black text-white shadow-xl shadow-slate-950/20 border border-slate-800 transition-all hover:scale-[1.02] cursor-pointer inline-flex items-center justify-center gap-2.5 font-heading"
                  >
                    <span>Start Uploading</span>
                    <ArrowRight className="h-5 w-5 text-[var(--color-primary)]" />
                  </button>
                </Link>
                <Link href="/dashboard">
                  <button className="h-14 px-8 text-base sm:text-lg font-semibold rounded-2xl border-2 border-slate-300 bg-white/90 hover:bg-white text-slate-800 hover:text-black hover:border-slate-400 shadow-sm transition-all inline-flex items-center justify-center gap-2 cursor-pointer font-heading">
                    <Play className="h-4 w-4 text-[var(--hero-primary)]" />
                    <span>View Demo</span>
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* ─── Swipeable iPad Pastel Cards Explaining the Functions ─── */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-16 sm:mt-20 mx-auto w-full"
              id="features"
            >
              <FunctionCardsCarousel />
            </motion.div>
          </div>
        </section>

        {/* Smooth transition from Light Hero into Contrasting Dark Realm */}
        <div className="w-full h-28 sm:h-36 bg-gradient-to-b from-transparent via-[var(--bg-primary)]/40 to-[var(--bg-primary)] pointer-events-none" />
      </div>

      {/* ─── Contrasting Dark Palette Realm (As You Scroll) ────────────────── */}
      <div className="relative bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 overflow-hidden flex-1 flex flex-col justify-between">
        {/* Ambient background glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-3xl animate-blob pointer-events-none" />
        <div className="absolute top-2/3 right-1/4 w-96 h-96 bg-[var(--color-accent)]/8 rounded-full blur-3xl animate-blob [animation-delay:2s] pointer-events-none" />

        {/* How It Works Section */}
        <section className="py-24 sm:py-32 relative z-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]">
                How Unity-AI Works
              </h2>
              <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-xl mx-auto">
                From raw audio or video to interactive study-ready tutor in 3 easy steps
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {workflowSteps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ y: -5 }}
                  className="group rounded-3xl bg-[var(--color-surface)] border border-[var(--border-color)] backdrop-blur-md p-8 hover:border-[var(--color-primary)]/40 hover:shadow-xl hover:shadow-[var(--glow-primary)] transition-all duration-300 relative overflow-hidden"
                >
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3 group-hover:text-[var(--color-primary)] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
