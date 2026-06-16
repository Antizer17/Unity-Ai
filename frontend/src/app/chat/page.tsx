'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { ChatPanel } from '@/components/lecture/chat-panel';
import type { ChatMessage } from '@/types';

export default function GuestChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Initial greeting
  useEffect(() => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Hi there! I am Unity-AI, your intelligent study assistant. Since you are in guest mode, I can answer general study questions or help you summarize topics. What would you like to learn today?',
        createdAt: new Date().toISOString(),
      }
    ]);
  }, []);

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString() + '-user',
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate LLM response
    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: Date.now().toString() + '-asst',
        role: 'assistant',
        content: `This is a simulated response in guest mode. If you create an account, I can connect directly to your uploaded lecture transcripts and provide highly contextual, cited answers!\n\nRegarding "${content}", that's a great topic to explore.`,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      <Navbar isGuest={true} />
      <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col overflow-hidden pt-4 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="flex-1 rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm flex flex-col">
          <ChatPanel 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            loading={isTyping} 
          />
        </div>
      </main>
    </div>
  );
}
