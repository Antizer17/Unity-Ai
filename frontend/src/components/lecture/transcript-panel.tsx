'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Clock } from 'lucide-react';
import { cn, formatTimestamp } from '@/lib/utils';
import type { TranscriptSegment } from '@/types';

export interface TranscriptPanelProps {
  segments: TranscriptSegment[];
  currentTime?: number;
  onSegmentClick?: (seconds: number) => void;
  loading?: boolean;
  id?: string;
}

export function TranscriptPanel({
  segments,
  currentTime = 0,
  onSegmentClick,
  loading = false,
  id = 'transcript-panel',
}: TranscriptPanelProps) {
  const [search, setSearch] = useState('');
  const activeRef = useRef<HTMLDivElement>(null);

  // Find active segment
  const activeSegmentId = segments.find(
    (s) => currentTime >= s.startTime && currentTime < s.endTime
  )?.id;

  // Filter by search
  const filtered = search.trim()
    ? segments.filter((s) =>
        s.text.toLowerCase().includes(search.toLowerCase())
      )
    : segments;

  // Auto-scroll to active segment
  useEffect(() => {
    if (activeRef.current && !search) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeSegmentId, search]);

  if (loading) {
    return (
      <div id={id} className="p-4 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse flex gap-3">
            <div className="h-4 w-12 bg-white/5 rounded" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 bg-white/5 rounded w-full" />
              <div className="h-3 bg-white/5 rounded w-4/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div id={id} className="flex flex-col h-full">
      {/* Search */}
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id={`${id}-search`}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transcript…"
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
          />
        </div>
        {search && (
          <p className="text-xs text-slate-500 mt-2">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      {/* Segments */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1">
        {filtered.map((segment, index) => {
          const isActive = segment.id === activeSegmentId;
          return (
            <motion.div
              key={segment.id}
              ref={isActive ? activeRef : undefined}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.02 }}
              onClick={() => onSegmentClick?.(segment.startTime)}
              id={`${id}-segment-${segment.id}`}
              className={cn(
                'flex gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 group',
                isActive
                  ? 'bg-indigo-500/10 border border-indigo-500/20'
                  : 'hover:bg-white/5 border border-transparent'
              )}
            >
              <button
                className={cn(
                  'flex items-center gap-1 text-[11px] font-mono shrink-0 pt-0.5',
                  isActive
                    ? 'text-indigo-400'
                    : 'text-slate-500 group-hover:text-slate-300'
                )}
              >
                <Clock className="h-3 w-3" />
                {formatTimestamp(segment.startTime)}
              </button>
              <p
                className={cn(
                  'text-sm leading-relaxed',
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'
                )}
              >
                {search ? highlightMatch(segment.text, search) : segment.text}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;

  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark
        key={i}
        className="bg-yellow-500/20 text-yellow-300 rounded px-0.5"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default TranscriptPanel;
