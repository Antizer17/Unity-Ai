'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { ChatPanel } from '@/components/lecture/chat-panel';
import { api } from '@/lib/api';
import type { ChatMessage } from '@/types';

export default function GuestChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, userMsg]);

    try {
      // Call the real general-purpose AI tutor endpoint
      const res = await api.chat.sendGeneralMessage(content);

      if (res.success && res.data) {
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: res.data.answer,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        const errorMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: res.error || "I'm having trouble connecting to the AI service. Please try again.",
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch {
      // Network error fallback
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I couldn't reach the AI service. Please make sure the backend server is running on http://localhost:8000 and try again.",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  // Add initial greeting if no messages
  React.useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'greeting',
          role: 'assistant',
          content: "Hi there! 👋 I'm **Unity-AI**, your intelligent study assistant powered by Llama 3. I can help you with:\n\n- **General study questions** across all subjects\n- **Explaining complex concepts** in simple terms\n- **Quiz preparation** and problem solving\n\nFor personalized lecture-specific answers with exact timestamps, upload your lecture in the dashboard!\n\nWhat would you like to learn today?",
          createdAt: new Date().toISOString(),
        }
      ]);
    }
  }, [messages.length]);

  return (
    <div className="h-screen flex overflow-hidden bg-[var(--bg-primary)]">
      <Sidebar isGuest={true} />
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto h-full">
          <ChatPanel 
            messages={messages} 
            onSendMessage={handleSendMessage} 
          />
        </div>
      </main>
    </div>
  );
}
