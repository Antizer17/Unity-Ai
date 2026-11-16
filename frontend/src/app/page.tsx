'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Mic,
  BookOpenText,
  MessageSquareText,
  ArrowRight,
  Play,
  Zap,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/layout/footer';
import { PaletteToggle } from '@/components/layout/palette-toggle';

const features = [
  {
    icon: Mic,
    title: 'AI Transcription',
    description:
      'Upload any audio or video lecture and get accurate, timestamped transcripts powered by Whisper AI. Supports multiple languages and accents.',
  },
  {
    icon: BookOpenText,
    title: 'Smart Notes',
    description:
      'Our LLM automatically generates structured, topic-organized notes linked to exact timestamps. Never miss a key concept again.',
  },
  {
    icon: MessageSquareText,
    title: 'AI Tutor Chatbot',
    description:
      'Ask questions about your lecture and get contextual answers with citations. Like having a personal tutor who watched every lecture with you.',
  },
];

const stats = [
  { value: '10,000+', label: 'Lectures Processed' },
  { value: '98.5%', label: 'Transcription Accuracy' },
  { value: '50K+', label: 'Notes Generated' },
  { value: '4.9/5', label: 'Student Rating' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* ─── Light Hero Canvas ───────────────────────────────────────────── */}
      <div className="relative bg-[var(--hero-bg)] text-[var(--hero-text-primary)] transition-colors duration-300 overflow-hidden">
        {/* Soft pastel ambient background glows */}
        <div className="absolute top-10 left-1/4 w-[450px] h-[450px] bg-[var(--color-primary)]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-[var(--color-accent)]/12 rounded-full blur-3xl pointer-events-none" />

        {/* Navbar */}
        <nav className="sticky top-0 z-50 border-b border-[var(--hero-border)] bg-[var(--hero-bg)]/85 backdrop-blur-xl transition-colors duration-300">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-85 transition-opacity">
                <Sparkles className="h-6 w-6 text-[var(--hero-primary)]" />
                <span className="font-extrabold tracking-tight text-[var(--hero-text-primary)]">
                  Unity<span className="text-[var(--hero-accent)]">-AI</span>
                </span>
              </Link>
              <div className="flex items-center gap-2 sm:gap-3">
                <PaletteToggle className="border-[var(--hero-border)] bg-white/70 text-[var(--hero-text-primary)] hover:bg-white" />
                <Link href="/dashboard" className="hidden sm:block">
                  <Button id="landing-guest-chat-btn" variant="outline" size="sm" className="border-[var(--hero-border)] text-[var(--hero-text-primary)] hover:bg-[var(--hero-bg-subtle)]">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button id="landing-register-btn" variant="accent" size="sm" className="font-semibold shadow-xs">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative pt-16 pb-24 sm:pt-24 sm:pb-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--hero-bg-subtle)] border border-[var(--hero-border)] text-sm font-semibold text-[var(--hero-primary)] mb-8 shadow-xs">
                <Zap className="h-4 w-4 text-[var(--hero-accent)]" />
                Powered by Llama 3 & Whisper AI
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--hero-text-primary)] leading-[1.15]"
            >
              Transform Lectures into{' '}
              <span className="text-[var(--hero-primary)] underline decoration-[var(--hero-accent)] decoration-wavy decoration-2 underline-offset-8">
                Interactive Study Sessions
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg text-[var(--hero-text-secondary)] max-w-2xl mx-auto leading-relaxed"
            >
              Upload your lecture recordings and let AI transcribe, generate structured notes, and
              power an intelligent tutor that answers your questions with precision.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/dashboard">
                  <Button id="landing-hero-cta" variant="accent" size="lg" className="h-12 px-8 text-base shadow-lg shadow-[var(--glow-accent)] font-semibold">
                    Start Uploading
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="lg" className="h-12 px-8 text-base border-[var(--hero-border)] text-[var(--hero-text-primary)] hover:bg-[var(--hero-bg-subtle)]">
                    <Play className="mr-2 h-4 w-4 text-[var(--hero-primary)]" />
                    View Demo
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Hero Visual Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-16 mx-auto max-w-4xl"
            >
              <div className="rounded-3xl bg-[var(--hero-card-bg)] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-[var(--hero-border)] p-6 sm:p-10 backdrop-blur-md">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="rounded-2xl bg-[var(--hero-bg-subtle)] p-6 border border-[var(--hero-border)] text-left">
                    <Mic className="h-8 w-8 text-[var(--hero-primary)] mb-3" />
                    <div className="h-2 rounded-full bg-[var(--hero-primary)]/40 mb-2" />
                    <div className="h-2 rounded-full bg-[var(--hero-primary)]/20 w-4/5" />
                    <p className="text-xs font-semibold text-[var(--hero-text-secondary)] mt-3">Transcribing audio…</p>
                  </div>
                  <div className="rounded-2xl bg-[var(--hero-bg-subtle)] p-6 border border-[var(--hero-border)] text-left">
                    <BookOpenText className="h-8 w-8 text-[var(--hero-primary)] mb-3" />
                    <div className="h-2 rounded-full bg-[var(--hero-primary)]/40 mb-2" />
                    <div className="h-2 rounded-full bg-[var(--hero-primary)]/20 w-3/5" />
                    <p className="text-xs font-semibold text-[var(--hero-text-secondary)] mt-3">Generating notes…</p>
                  </div>
                  <div className="rounded-2xl bg-[var(--hero-bg-subtle)] p-6 border border-[var(--hero-border)] text-left">
                    <MessageSquareText className="h-8 w-8 text-[var(--hero-accent)] mb-3" />
                    <div className="h-2 rounded-full bg-[var(--hero-accent)]/40 mb-2" />
                    <div className="h-2 rounded-full bg-[var(--hero-accent)]/20 w-4/6" />
                    <p className="text-xs font-semibold text-[var(--hero-text-secondary)] mt-3">Ready to chat!</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Smooth transition from Light Hero into Contrasting Dark Realm */}
        <div className="w-full h-28 sm:h-36 bg-gradient-to-b from-transparent via-[var(--bg-primary)]/40 to-[var(--bg-primary)] pointer-events-none" />
      </div>

      {/* ─── Contrasting Dark Palette Realm (As You Scroll) ────────────────── */}
      <div className="relative bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
        {/* Ambient background glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-primary)]/10 rounded-full blur-3xl animate-blob pointer-events-none" />
        <div className="absolute top-2/3 right-1/4 w-96 h-96 bg-[var(--color-accent)]/8 rounded-full blur-3xl animate-blob [animation-delay:2s] pointer-events-none" />

        {/* Stats Section */}
        <section className="py-20 border-y border-[var(--border-color)] bg-[var(--bg-secondary)]/40 backdrop-blur-md relative z-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <p className="text-3xl sm:text-5xl font-extrabold text-[var(--color-primary)] tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-[var(--text-secondary)] mt-2">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 sm:py-32 relative z-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)]">
                Everything you need to{' '}
                <span className="text-[var(--color-accent)]">study smarter</span>
              </h2>
              <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-xl mx-auto">
                From raw recordings to study-ready materials in minutes
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ y: -5 }}
                  id={`feature-card-${i}`}
                  className="group rounded-2xl bg-[var(--color-surface)] border border-[var(--border-color)] backdrop-blur-md p-8 hover:border-[var(--color-primary)]/40 hover:shadow-xl hover:shadow-[var(--glow-primary)] transition-all duration-300"
                >
                  <div className="inline-flex p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] mb-6">
                    <feature.icon className="h-6 w-6 text-[var(--color-primary)]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3 group-hover:text-[var(--color-primary)] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative z-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-2xl p-8 sm:p-16 text-center relative overflow-hidden"
            >
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-[var(--color-primary)]/10 rounded-full blur-3xl pointer-events-none" />
              <Shield className="h-12 w-12 text-[var(--color-primary)] mx-auto mb-6 relative z-10" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] mb-4 relative z-10">
                Ready to transform your study experience?
              </h2>
              <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto mb-8 relative z-10">
                Join thousands of students who are studying smarter with AI-powered lecture tools.
              </p>
              <Link href="/dashboard" className="relative z-10">
                <Button id="cta-get-started-btn" variant="accent" size="lg" className="font-semibold shadow-lg shadow-[var(--glow-accent)]">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
