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

const features = [
  {
    icon: Mic,
    title: 'AI Transcription',
    description:
      'Upload any audio or video lecture and get accurate, timestamped transcripts powered by Whisper AI. Supports multiple languages and accents.',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    icon: BookOpenText,
    title: 'Smart Notes',
    description:
      'Our LLM automatically generates structured, topic-organized notes linked to exact timestamps. Never miss a key concept again.',
    gradient: 'from-indigo-500 to-violet-500',
  },
  {
    icon: MessageSquareText,
    title: 'AI Tutor Chatbot',
    description:
      'Ask questions about your lecture and get contextual answers with citations. Like having a personal tutor who watched every lecture with you.',
    gradient: 'from-violet-500 to-pink-500',
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
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-blob [animation-delay:2s]" />
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl animate-blob [animation-delay:4s]" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/60 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl">
              <Sparkles className="h-6 w-6 text-indigo-400" />
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Unity-AI
              </span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/dashboard" className="hidden sm:block">
                <Button id="landing-guest-chat-btn" variant="outline" size="sm" className="border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10">
                  Dashboard
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button id="landing-register-btn" variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 sm:pt-32 sm:pb-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-sm text-indigo-400 mb-8">
              <Zap className="h-4 w-4" />
              Powered by GPT-4 & Whisper AI
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight"
          >
            Transform Lectures into{' '}
            <span className="gradient-text">Interactive Study Sessions</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
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
                <Button id="landing-hero-cta" variant="primary" size="lg" className="h-12 px-8 text-base shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)]">
                  Start Uploading
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base border-white/10 hover:bg-white/5">
                  <Play className="mr-2 h-4 w-4" />
                  View Demo
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Hero visual */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 mx-auto max-w-4xl"
          >
            <div className="rounded-2xl bg-gradient-to-br from-indigo-500/20 via-violet-500/10 to-cyan-500/20 p-[1px]">
              <div className="rounded-2xl bg-slate-900/90 backdrop-blur-xl p-8 sm:p-12">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="rounded-xl bg-white/5 p-6 border border-white/10">
                    <Mic className="h-8 w-8 text-cyan-400 mb-3" />
                    <div className="h-2 rounded-full bg-cyan-500/30 mb-2" />
                    <div className="h-2 rounded-full bg-cyan-500/20 w-4/5" />
                    <p className="text-xs text-slate-500 mt-3">Transcribing…</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-6 border border-white/10">
                    <BookOpenText className="h-8 w-8 text-indigo-400 mb-3" />
                    <div className="h-2 rounded-full bg-indigo-500/30 mb-2" />
                    <div className="h-2 rounded-full bg-indigo-500/20 w-3/5" />
                    <p className="text-xs text-slate-500 mt-3">Generating notes…</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-6 border border-white/10">
                    <MessageSquareText className="h-8 w-8 text-violet-400 mb-3" />
                    <div className="h-2 rounded-full bg-violet-500/30 mb-2" />
                    <div className="h-2 rounded-full bg-violet-500/20 w-4/6" />
                    <p className="text-xs text-slate-500 mt-3">Ready to chat!</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-white/5">
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
                <p className="text-3xl sm:text-4xl font-bold gradient-text">{stat.value}</p>
                <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Everything you need to{' '}
              <span className="gradient-text">study smarter</span>
            </h2>
            <p className="mt-4 text-lg text-slate-400 max-w-xl mx-auto">
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
                className="group rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-8 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
              >
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-gradient-to-br from-indigo-500/20 via-violet-500/10 to-cyan-500/20 p-[1px]"
          >
            <div className="rounded-3xl bg-slate-900/90 backdrop-blur-xl px-8 py-16 sm:px-16 sm:py-20 text-center">
              <Shield className="h-12 w-12 text-indigo-400 mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to transform your study experience?
              </h2>
              <p className="text-lg text-slate-400 max-w-xl mx-auto mb-8">
                Join thousands of students who are studying smarter with AI-powered lecture tools.
              </p>
              <Link href="/register">
                <Button id="cta-get-started-btn" size="lg" icon={<ArrowRight className="h-5 w-5" />}>
                  Get Started for Free
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
