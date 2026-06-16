'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Upload, BookOpen, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LectureCard } from '@/components/lecture/lecture-card';
import { Spinner } from '@/components/ui/spinner';
import { api } from '@/lib/api';
import type { Lecture, LectureStatus } from '@/types';

type FilterTab = 'all' | 'PROCESSING' | 'READY';

const tabs: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'PROCESSING', label: 'Processing' },
  { key: 'READY', label: 'Ready' },
];

export default function LecturesPage() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  useEffect(() => {
    async function fetchLectures() {
      try {
        setLoading(true);
        const res = await api.lectures.getAll();
        if (res.success && res.data) {
          setLectures(res.data);
        } else {
          setError(res.error || 'Failed to fetch lectures');
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchLectures();
  }, []);

  const filtered = lectures.filter((lec) => {
    const matchesSearch =
      lec.title.toLowerCase().includes(search.toLowerCase()) ||
      lec.description.toLowerCase().includes(search.toLowerCase());

    const processingStatuses: LectureStatus[] = [
      'UPLOADING',
      'PROCESSING',
      'TRANSCRIBING',
      'GENERATING_NOTES',
    ];

    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'PROCESSING' && processingStatuses.includes(lec.status)) ||
      (activeTab === 'READY' && lec.status === 'READY');

    return matchesSearch && matchesTab;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">My Lectures</h1>
          <p className="text-sm text-slate-400 mt-1">
            {loading ? 'Loading library…' : `${lectures.length} lectures in your library`}
          </p>
        </div>
        <Link href="/lectures/upload">
          <Button id="lectures-upload-btn" icon={<Upload className="h-4 w-4" />}>
            Upload New
          </Button>
        </Link>
      </motion.div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="lectures-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search lectures…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>

        <div className="flex rounded-xl bg-white/5 border border-white/10 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              id={`lectures-tab-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lectures Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Spinner className="h-8 w-8 text-indigo-500" />
          <p className="text-sm text-slate-400">Loading your lectures…</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/10 bg-red-500/5 p-8 text-center max-w-md mx-auto">
          <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-white mb-1">Could not load lectures</h3>
          <p className="text-sm text-slate-400 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((lecture, i) => (
            <LectureCard key={lecture.id} lecture={lecture} index={i} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <div className="p-4 rounded-2xl bg-white/5 inline-block mb-4">
            <BookOpen className="h-10 w-10 text-slate-500" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No lectures found</h3>
          <p className="text-sm text-slate-400 mb-6">
            {search
              ? 'Try a different search term'
              : 'Upload your first lecture to get started'}
          </p>
          {!search && (
            <Link href="/lectures/upload">
              <Button id="lectures-empty-upload-btn" icon={<Upload className="h-4 w-4" />}>
                Upload Lecture
              </Button>
            </Link>
          )}
        </motion.div>
      )}
    </div>
  );
}
