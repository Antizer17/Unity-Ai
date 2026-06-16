'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Clock, Sparkles, User } from 'lucide-react';
import { cn, formatTimestamp } from '@/lib/utils';
import type { ChatMessage, Citation } from '@/types';

export interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage?: (content: string) => void;
  onTimestampClick?: (seconds: number) => void;
  loading?: boolean;
  id?: string;
}

function CitationChip({
  citation,
  onClick,
}: {
  citation: Citation;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
    >
      <Clock className="h-2.5 w-2.5" />
      {formatTimestamp(citation.startTime)}
    </button>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0">
        <Sparkles className="h-4 w-4 text-white" />
      </div>
      <div className="flex items-center gap-1 px-4 py-2 rounded-2xl bg-white/5">
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
          className="w-2 h-2 rounded-full bg-indigo-400"
        />
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
          className="w-2 h-2 rounded-full bg-indigo-400"
        />
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
          className="w-2 h-2 rounded-full bg-indigo-400"
        />
      </div>
    </div>
  );
}

export function ChatPanel({
  messages,
  onSendMessage,
  onTimestampClick,
  loading = false,
  id = 'chat-panel',
}: ChatPanelProps) {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage?.(input.trim());
    setInput('');
    setIsTyping(true);
    // Simulate bot typing
    setTimeout(() => setIsTyping(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div id={id} className="flex flex-col h-full">
      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4"
      >
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="p-4 rounded-2xl bg-indigo-500/10 mb-4">
              <Sparkles className="h-8 w-8 text-indigo-400" />
            </div>
            <h4 className="text-sm font-medium text-white mb-1">
              AI Study Assistant
            </h4>
            <p className="text-xs text-slate-400 max-w-xs">
              Ask me anything about this lecture. I&apos;ll find the answers in the transcript and cite my sources.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
            className={cn(
              'flex gap-3',
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            )}
          >
            {/* Avatar */}
            <div
              className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center shrink-0',
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-cyan-500 to-blue-500'
                  : 'bg-gradient-to-br from-indigo-500 to-violet-500'
              )}
            >
              {msg.role === 'user' ? (
                <User className="h-4 w-4 text-white" />
              ) : (
                <Sparkles className="h-4 w-4 text-white" />
              )}
            </div>

            {/* Bubble */}
            <div
              className={cn(
                'max-w-[80%] rounded-2xl px-4 py-3 text-sm',
                msg.role === 'user'
                  ? 'bg-indigo-500/20 text-white rounded-tr-sm'
                  : 'bg-white/5 text-slate-200 rounded-tl-sm border border-white/5'
              )}
            >
              <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>

              {/* Citations */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-3 pt-2 border-t border-white/10 space-y-1.5">
                  <p className="text-[10px] uppercase text-slate-500 font-medium tracking-wider">
                    Sources
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.citations.map((c) => (
                      <CitationChip
                        key={c.segmentId}
                        citation={c}
                        onClick={() => onTimestampClick?.(c.startTime)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {isTyping && <TypingIndicator />}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <input
            id={`${id}-input`}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about this lecture…"
            className="flex-1 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
          />
          <button
            id={`${id}-send-btn`}
            onClick={handleSend}
            disabled={!input.trim()}
            className={cn(
              'p-2.5 rounded-xl transition-all duration-200',
              input.trim()
                ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40'
                : 'bg-white/5 text-slate-500 cursor-not-allowed'
            )}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPanel;
