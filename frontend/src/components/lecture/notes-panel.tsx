'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, RefreshCw, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { cn, formatTimestamp } from '@/lib/utils';
import type { NoteSection } from '@/types';

export interface NotesPanelProps {
  sections: NoteSection[];
  loading?: boolean;
  onTimestampClick?: (seconds: number) => void;
  onRegenerate?: () => void;
  id?: string;
}

export function NotesPanel({
  sections,
  loading = false,
  onTimestampClick,
  onRegenerate,
  id = 'notes-panel',
}: NotesPanelProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);

  const handleRegenerate = async () => {
    setRegenerating(true);
    onRegenerate?.();
    // Simulated delay
    await new Promise((r) => setTimeout(r, 2000));
    setRegenerating(false);
  };

  if (loading) {
    return (
      <div id={id} className="p-6 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse space-y-2">
            <div className="h-5 bg-white/5 rounded-lg w-3/4" />
            <div className="h-3 bg-white/5 rounded-lg w-full" />
            <div className="h-3 bg-white/5 rounded-lg w-5/6" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div id={id} className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h3 className="text-sm font-semibold text-white">Structured Notes</h3>
        <Button
          id={`${id}-regenerate-btn`}
          variant="ghost"
          size="sm"
          loading={regenerating}
          icon={<RefreshCw className="h-3.5 w-3.5" />}
          onClick={handleRegenerate}
        >
          Regenerate
        </Button>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
        {sections.map((section, index) => {
          const isExpanded = expandedSection === section.id;
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'rounded-xl border transition-all duration-200',
                isExpanded
                  ? 'bg-indigo-500/5 border-indigo-500/20'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              )}
            >
              <button
                id={`${id}-section-${section.id}`}
                onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                className="flex items-center gap-3 w-full p-3 text-left"
              >
                <ChevronRight
                  className={cn(
                    'h-4 w-4 text-slate-400 transition-transform shrink-0',
                    isExpanded && 'rotate-90'
                  )}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white truncate">
                    {section.title}
                  </h4>
                </div>
                <Badge
                  variant="info"
                  className="cursor-pointer shrink-0"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTimestampClick?.(section.startTimestamp);
                    }}
                    className="flex items-center gap-1"
                    id={`${id}-timestamp-${section.id}`}
                  >
                    <Clock className="h-3 w-3" />
                    {formatTimestamp(section.startTimestamp)}
                  </button>
                </Badge>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pl-10">
                      <div className="prose prose-sm prose-invert prose-slate max-w-none">
                        {section.content.split('\n').map((line, li) => (
                          <p key={li} className="text-xs text-slate-300 leading-relaxed my-1">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {regenerating && (
        <div className="flex items-center justify-center gap-2 p-4 border-t border-white/10">
          <Spinner size="sm" />
          <span className="text-xs text-slate-400">Regenerating notes…</span>
        </div>
      )}
    </div>
  );
}

export default NotesPanel;
