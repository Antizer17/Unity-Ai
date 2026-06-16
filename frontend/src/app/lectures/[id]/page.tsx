'use client';

import React, { useState, useRef, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BookOpenText,
  MessageSquareText,
  FileText,
} from 'lucide-react';
import { VideoPlayer, type VideoPlayerHandle } from '@/components/lecture/video-player';
import { NotesPanel } from '@/components/lecture/notes-panel';
import { ChatPanel } from '@/components/lecture/chat-panel';
import { TranscriptPanel } from '@/components/lecture/transcript-panel';
import { Badge } from '@/components/ui/badge';
import { cn, formatDuration } from '@/lib/utils';
import {
  mockLectures,
  mockTranscript,
  mockNotes,
  mockChatMessages,
} from '@/lib/mock-data';
import type { ChatMessage } from '@/types';

type TabKey = 'notes' | 'chat' | 'transcript';

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'notes', label: 'Notes', icon: BookOpenText },
  { key: 'chat', label: 'Chat', icon: MessageSquareText },
  { key: 'transcript', label: 'Transcript', icon: FileText },
];

export default function LectureDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const playerRef = useRef<VideoPlayerHandle>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('notes');
  const [currentTime, setCurrentTime] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);

  // Find lecture or use first
  const lecture = mockLectures.find((l) => l.id === id) ?? mockLectures[0];

  const handleTimestampClick = (seconds: number) => {
    playerRef.current?.seekTo(seconds);
    setCurrentTime(seconds);
  };

  const handleSendMessage = (content: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, userMsg]);

    // Simulate assistant response
    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-reply`,
        role: 'assistant',
        content: `That's a great question about "${content.slice(0, 50)}". Based on the lecture transcript, the professor discusses this topic in detail. The key points are related to the fundamental concepts covered in the earlier sections of this lecture.`,
        citations: [
          {
            segmentId: 'seg-003',
            text: mockTranscript.segments[2].text,
            startTime: mockTranscript.segments[2].startTime,
            endTime: mockTranscript.segments[2].endTime,
          },
        ],
        createdAt: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
    }, 1500);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-6"
      >
        <Link
          href="/lectures"
          id="lecture-detail-back"
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-white truncate">
            {lecture.title}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <Badge
              variant={lecture.status === 'READY' ? 'success' : 'processing'}
              id="lecture-detail-status"
            >
              {lecture.status}
            </Badge>
            <span className="text-xs text-slate-500">
              {formatDuration(lecture.duration)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Split Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Video Player (60%) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:w-[60%]"
        >
          <VideoPlayer
            ref={playerRef}
            src={undefined} // No actual file — shows placeholder
            type="video"
            id="lecture-video-player"
          />

          {/* Lecture description */}
          <div className="mt-4 rounded-xl bg-white/5 border border-white/10 p-4">
            <h3 className="text-sm font-medium text-white mb-2">About this lecture</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lecture.description}
            </p>
          </div>
        </motion.div>

        {/* Right: Tabbed Panel (40%) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:w-[40%] flex flex-col rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md overflow-hidden"
          style={{ height: 'calc(100vh - 12rem)' }}
        >
          {/* Tab bar */}
          <div className="flex border-b border-white/10 bg-white/[0.02]">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                id={`lecture-tab-${tab.key}`}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all relative',
                  activeTab === tab.key
                    ? 'text-indigo-400'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="active-tab-indicator"
                    className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'notes' && (
              <NotesPanel
                sections={mockNotes.sections}
                onTimestampClick={handleTimestampClick}
                onRegenerate={() => {}}
                id="lecture-notes-panel"
              />
            )}
            {activeTab === 'chat' && (
              <ChatPanel
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                onTimestampClick={handleTimestampClick}
                id="lecture-chat-panel"
              />
            )}
            {activeTab === 'transcript' && (
              <TranscriptPanel
                segments={mockTranscript.segments}
                currentTime={currentTime}
                onSegmentClick={handleTimestampClick}
                id="lecture-transcript-panel"
              />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
