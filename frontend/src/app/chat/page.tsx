'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { ChatPanel } from '@/components/lecture/chat-panel';
import type { ChatMessage } from '@/types';

export default function GuestChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm currently in demo mode. Please log in or create an account to access the full Unity-AI experience, upload files, and save your lecture notes!",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  // Add initial greeting if no messages
  React.useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'greeting',
          role: 'assistant',
          content: "Hi there! I am Unity-AI, your intelligent study assistant. Since you are in guest mode, I can answer general study questions or help you summarize topics. What would you like to learn today?",
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
            loading={isTyping} 
          />
        </div>
      </main>
    </div>
  );
}
