'use client';

<<<<<<< HEAD
import React, { useState, useRef, use } from 'react';
=======
import React, { useState, useRef, useEffect, use } from 'react';
>>>>>>> 718ad7495a3b8572b32da9ecdfe178fbeddf5e46
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BookOpenText,
  MessageSquareText,
  FileText,
<<<<<<< HEAD
=======
  AlertCircle,
  Clock,
  Sparkles
>>>>>>> 718ad7495a3b8572b32da9ecdfe178fbeddf5e46
} from 'lucide-react';
import { VideoPlayer, type VideoPlayerHandle } from '@/components/lecture/video-player';
import { NotesPanel } from '@/components/lecture/notes-panel';
import { ChatPanel } from '@/components/lecture/chat-panel';
import { TranscriptPanel } from '@/components/lecture/transcript-panel';
import { Badge } from '@/components/ui/badge';
<<<<<<< HEAD
import { cn, formatDuration } from '@/lib/utils';
import {
  mockLectures,
  mockTranscript,
  mockNotes,
  mockChatMessages,
} from '@/lib/mock-data';
import type { ChatMessage } from '@/types';
=======
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { cn, formatDuration } from '@/lib/utils';
import { api } from '@/lib/api';
import type { Lecture, Transcript, Note, ChatMessage } from '@/types';
>>>>>>> 718ad7495a3b8572b32da9ecdfe178fbeddf5e46

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
<<<<<<< HEAD
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);

  // Find lecture or use first
  const lecture = mockLectures.find((l) => l.id === id) ?? mockLectures[0];
=======
  
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [notes, setNotes] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    let intervalId: any;

    async function fetchLectureData() {
      try {
        const res = await api.lectures.getById(id);
        if (res.success && res.data) {
          setLecture(res.data);
          
          if (res.data.status === 'READY') {
            // Lecture is ready, fetch transcript and notes
            const [transRes, notesRes] = await Promise.all([
              api.transcripts.getByLectureId(id),
              api.notes.getByLectureId(id),
            ]);

            if (transRes.success && transRes.data) {
              setTranscript(transRes.data);
            }
            if (notesRes.success && notesRes.data) {
              setNotes(notesRes.data);
            }

            setError(null);
            clearInterval(intervalId);
            setLoading(false);
          } else if (res.data.status === 'FAILED') {
            setError('Lecture processing failed. Please try re-uploading.');
            clearInterval(intervalId);
            setLoading(false);
          } else {
            // Keep polling while status is UPLOADING, PROCESSING, etc.
            setLoading(false);
          }
        } else {
          setError(res.error || 'Lecture not found');
          setLoading(false);
          clearInterval(intervalId);
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred loading the lecture.');
        setLoading(false);
        clearInterval(intervalId);
      }
    }

    fetchLectureData();
    // Poll every 5 seconds to check status
    intervalId = setInterval(fetchLectureData, 5000);

    return () => clearInterval(intervalId);
  }, [id]);
>>>>>>> 718ad7495a3b8572b32da9ecdfe178fbeddf5e46

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

<<<<<<< HEAD
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

=======
    // Simulate assistant reply backed by the actual transcription segments if available
    setTimeout(() => {
      let matchingSegment = null;
      if (transcript?.segments) {
        matchingSegment = transcript.segments.find((s) =>
          s.text.toLowerCase().includes(content.toLowerCase())
        );
        // If not found, use a random segment or the first segment
        if (!matchingSegment && transcript.segments.length > 0) {
          matchingSegment = transcript.segments[Math.floor(Math.random() * transcript.segments.length)];
        }
      }

      const replyText = matchingSegment
        ? `Based on the lecture at ${formatDuration(matchingSegment.startTime)}, the discussion mentions:\n\n> "${matchingSegment.text}"\n\nThis relates directly to your question about "${content}". Is there anything specific from this part you would like to explore further?`
        : `That's an interesting question about "${content}". Since the transcription details are still loading or unavailable, I'll save this question and look up the context as soon as processing completes!`;

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-reply`,
        role: 'assistant',
        content: replyText,
        citations: matchingSegment ? [
          {
            segmentId: matchingSegment.id,
            text: matchingSegment.text,
            startTime: matchingSegment.startTime,
            endTime: matchingSegment.endTime,
          }
        ] : undefined,
        createdAt: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
    }, 1200);
  };

  if (loading && !lecture) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Spinner className="h-8 w-8 text-indigo-500" />
        <p className="text-sm text-slate-400">Loading lecture study companion…</p>
      </div>
    );
  }

  if (error && !lecture) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Lecture Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">{error}</p>
        <Link href="/lectures">
          <Button>Back to Lectures</Button>
        </Link>
      </div>
    );
  }

  const isReady = lecture?.status === 'READY';
  const displayFileUrl = lecture?.fileUrl || undefined;

>>>>>>> 718ad7495a3b8572b32da9ecdfe178fbeddf5e46
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
<<<<<<< HEAD
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
=======
            {lecture?.title}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <Badge
              variant={
                lecture?.status === 'READY'
                  ? 'success'
                  : lecture?.status === 'FAILED'
                  ? 'error'
                  : 'processing'
              }
              id="lecture-detail-status"
            >
              {lecture?.status}
            </Badge>
            <span className="text-xs text-slate-500">
              {lecture ? formatDuration(lecture.duration) : '--:--'}
>>>>>>> 718ad7495a3b8572b32da9ecdfe178fbeddf5e46
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
<<<<<<< HEAD
            src={undefined} // No actual file — shows placeholder
=======
            src={displayFileUrl}
>>>>>>> 718ad7495a3b8572b32da9ecdfe178fbeddf5e46
            type="video"
            id="lecture-video-player"
          />

          {/* Lecture description */}
          <div className="mt-4 rounded-xl bg-white/5 border border-white/10 p-4">
            <h3 className="text-sm font-medium text-white mb-2">About this lecture</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
<<<<<<< HEAD
              {lecture.description}
=======
              {lecture?.description}
>>>>>>> 718ad7495a3b8572b32da9ecdfe178fbeddf5e46
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
<<<<<<< HEAD
              <NotesPanel
                sections={mockNotes.sections}
                onTimestampClick={handleTimestampClick}
                onRegenerate={() => {}}
                id="lecture-notes-panel"
              />
            )}
=======
              notes ? (
                <NotesPanel
                  sections={notes.sections}
                  onTimestampClick={handleTimestampClick}
                  onRegenerate={() => {}}
                  id="lecture-notes-panel"
                />
              ) : !isReady ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center gap-3">
                  <Sparkles className="h-8 w-8 text-indigo-400 animate-pulse" />
                  <h4 className="text-sm font-medium text-white">Generating Notes</h4>
                  <p className="text-xs text-slate-500 max-w-[250px]">
                    We are converting the lecture audio into structured study notes. This will take a moment.
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full p-6 text-slate-500 text-sm">
                  No study notes found.
                </div>
              )
            )}
            
>>>>>>> 718ad7495a3b8572b32da9ecdfe178fbeddf5e46
            {activeTab === 'chat' && (
              <ChatPanel
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                onTimestampClick={handleTimestampClick}
                id="lecture-chat-panel"
              />
            )}
<<<<<<< HEAD
            {activeTab === 'transcript' && (
              <TranscriptPanel
                segments={mockTranscript.segments}
                currentTime={currentTime}
                onSegmentClick={handleTimestampClick}
                id="lecture-transcript-panel"
              />
=======
            
            {activeTab === 'transcript' && (
              transcript ? (
                <TranscriptPanel
                  segments={transcript.segments}
                  currentTime={currentTime}
                  onSegmentClick={handleTimestampClick}
                  id="lecture-transcript-panel"
                />
              ) : !isReady ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center gap-3">
                  <Spinner className="h-6 w-6 text-indigo-400" />
                  <h4 className="text-sm font-medium text-white">Transcribing Audio</h4>
                  <p className="text-xs text-slate-500 max-w-[250px]">
                    Whisper is currently transcribing the lecture audio with exact timestamps.
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full p-6 text-slate-500 text-sm">
                  No transcript available.
                </div>
              )
>>>>>>> 718ad7495a3b8572b32da9ecdfe178fbeddf5e46
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
