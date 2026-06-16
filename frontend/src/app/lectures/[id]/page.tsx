'use client';

import React, { useState, useRef, useEffect, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BookOpenText,
  MessageSquareText,
  FileText,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { VideoPlayer, type VideoPlayerHandle } from '@/components/lecture/video-player';
import { NotesPanel } from '@/components/lecture/notes-panel';
import { ChatPanel } from '@/components/lecture/chat-panel';
import { TranscriptPanel } from '@/components/lecture/transcript-panel';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { cn, formatDuration } from '@/lib/utils';
import { api } from '@/lib/api';
import type { Lecture, Transcript, Note, ChatMessage } from '@/types';

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

  const handleTimestampClick = (seconds: number) => {
    playerRef.current?.seekTo(seconds);
    playerRef.current?.play();
    setCurrentTime(seconds);
  };

  const handleRegenerateNotes = async () => {
    // Optimistic UI update: hide notes, show processing status
    setNotes(null);
    setLecture((prev) => prev ? { ...prev, status: 'PROCESSING' } : null);

    try {
      const res = await api.notes.regenerate(id);
      if (res.success && res.data) {
        setNotes(res.data);
        setLecture((prev) => prev ? { ...prev, status: 'READY' } : null);
      } else {
        setLecture((prev) => prev ? { ...prev, status: 'FAILED' } : null);
      }
    } catch (e) {
      console.error("Failed to regenerate notes", e);
      setLecture((prev) => prev ? { ...prev, status: 'FAILED' } : null);
    }
  };

  const handleSendMessage = async (content: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, userMsg]);

    try {
      // Call the real RAG-powered chat API
      const res = await api.chat.sendMessage(id, content);
      
      if (res.success && res.data) {
        const { answer, timestamps } = res.data;
        
        // Build citations from the RAG timestamps
        const citations = timestamps?.map((ts: { start: number; end: number; formatted: string }, idx: number) => ({
          segmentId: `rag-${idx}`,
          text: `Referenced at ${ts.formatted}`,
          startTime: ts.start,
          endTime: ts.end,
        }));

        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now()}-reply`,
          role: 'assistant',
          content: answer,
          citations: citations?.length ? citations : undefined,
          createdAt: new Date().toISOString(),
        };
        setChatMessages((prev) => [...prev, assistantMsg]);
      } else {
        // Fallback if API returns an error
        const errorMsg: ChatMessage = {
          id: `msg-${Date.now()}-error`,
          role: 'assistant',
          content: res.error || "I'm having trouble connecting to the AI service. Please try again.",
          createdAt: new Date().toISOString(),
        };
        setChatMessages((prev) => [...prev, errorMsg]);
      }
    } catch {
      // Network error fallback — use local transcript matching
      let matchingSegment = null;
      if (transcript?.segments) {
        matchingSegment = transcript.segments.find((s) =>
          s.text.toLowerCase().includes(content.toLowerCase())
        );
        if (!matchingSegment && transcript.segments.length > 0) {
          matchingSegment = transcript.segments[Math.floor(Math.random() * transcript.segments.length)];
        }
      }

      const replyText = matchingSegment
        ? `Based on the lecture at ${formatDuration(matchingSegment.startTime)}, the discussion mentions:\n\n> "${matchingSegment.text}"\n\n*Note: This response was generated offline using local transcript data.*`
        : `I couldn't reach the AI service to answer your question about "${content}". Please check that the backend server is running and try again.`;

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
    }
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
  let displayFileUrl = lecture?.fileUrl || undefined;
  if (displayFileUrl && displayFileUrl.startsWith('/')) {
    displayFileUrl = `http://localhost:8000${displayFileUrl}`;
  }

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
            src={displayFileUrl}
            type="video"
            id="lecture-video-player"
            onTimeUpdate={setCurrentTime}
          />

          {/* Lecture description */}
          <div className="mt-4 rounded-xl bg-white/5 border border-white/10 p-4">
            <h3 className="text-sm font-medium text-white mb-2">About this lecture</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {lecture?.description}
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
              notes ? (
                <NotesPanel
                  sections={notes.sections}
                  currentTime={currentTime}
                  onTimestampClick={handleTimestampClick}
                  onRegenerate={handleRegenerateNotes}
                  id="lecture-notes-panel"
                />
              ) : lecture?.status === 'PROCESSING' ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center gap-3">
                  <Sparkles className="h-8 w-8 text-indigo-400 animate-pulse" />
                  <h4 className="text-sm font-medium text-white">Generating Notes</h4>
                  <p className="text-xs text-slate-500 max-w-[250px]">
                    We are converting the lecture audio into structured study notes. This will take a moment.
                  </p>
                </div>
              ) : lecture?.status === 'FAILED' ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center gap-3">
                  <h4 className="text-sm font-medium text-red-400">Processing Failed</h4>
                  <p className="text-xs text-slate-500 max-w-[250px]">
                    We couldn't generate notes for this lecture. The transcription service might be down.
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full p-6 text-slate-500 text-sm">
                  No study notes found.
                </div>
              )
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
              transcript ? (
                <TranscriptPanel
                  segments={transcript.segments}
                  currentTime={currentTime}
                  onSegmentClick={handleTimestampClick}
                  id="lecture-transcript-panel"
                />
              ) : lecture?.status === 'PROCESSING' ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center gap-3">
                  <Spinner className="h-6 w-6 text-indigo-400" />
                  <h4 className="text-sm font-medium text-white">Transcribing Audio</h4>
                  <p className="text-xs text-slate-500 max-w-[250px]">
                    Whisper is currently transcribing the lecture audio with exact timestamps.
                  </p>
                </div>
              ) : lecture?.status === 'FAILED' ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center gap-3">
                  <h4 className="text-sm font-medium text-red-400">Transcription Failed</h4>
                  <p className="text-xs text-slate-500 max-w-[250px]">
                    We couldn't transcribe this lecture. The API connection might have failed.
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full p-6 text-slate-500 text-sm">
                  No transcript available.
                </div>
              )
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
