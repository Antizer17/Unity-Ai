'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn, formatDuration, formatDate, truncate } from '@/lib/utils';
import type { Lecture, LectureStatus } from '@/types';

export interface LectureCardProps {
  lecture: Lecture;
  index?: number;
}

const statusConfig: Record<LectureStatus, { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'processing' }> = {
  UPLOADING: { label: 'Uploading', variant: 'info' },
  PROCESSING: { label: 'Processing', variant: 'processing' },
  TRANSCRIBING: { label: 'Transcribing', variant: 'processing' },
  GENERATING_NOTES: { label: 'Generating Notes', variant: 'processing' },
  READY: { label: 'Ready', variant: 'success' },
  FAILED: { label: 'Failed', variant: 'error' },
};

const gradients = [
  'from-indigo-600 to-violet-600',
  'from-cyan-600 to-blue-600',
  'from-emerald-600 to-teal-600',
  'from-amber-600 to-orange-600',
  'from-pink-600 to-rose-600',
];

export function LectureCard({ lecture, index = 0 }: LectureCardProps) {
  const status = statusConfig[lecture.status];
  const gradient = gradients[index % gradients.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="group"
    >
      <Link
        href={`/lectures/${lecture.id}`}
        id={`lecture-card-${lecture.id}`}
        className="block"
      >
        <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5">
          {/* Thumbnail Gradient */}
          <div
            className={cn(
              'h-32 bg-gradient-to-br relative overflow-hidden',
              gradient
            )}
          >
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-3 left-3">
              <Badge variant={status.variant} id={`lecture-status-${lecture.id}`}>
                {status.label}
              </Badge>
            </div>
            <div className="absolute bottom-3 right-3">
              <span className="flex items-center gap-1 text-xs text-white/80 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
                <Clock className="h-3 w-3" />
                {formatDuration(lecture.duration)}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-2">
            <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
              {lecture.title}
            </h3>
            <p className="text-xs text-slate-400 line-clamp-2">
              {truncate(lecture.description, 120)}
            </p>
            <div className="flex items-center gap-1 text-xs text-slate-500 pt-1">
              <Calendar className="h-3 w-3" />
              {formatDate(lecture.createdAt)}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default LectureCard;
