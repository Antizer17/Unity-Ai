'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Plus,
  LayoutDashboard,
  Settings,
  MoreHorizontal,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const historyGroups = [
  {
    title: 'Today',
    items: [
      { id: '1', title: 'But what is a neural network?', href: '/lectures/lec-001' },
      { id: '2', title: 'Quantum Computers Explained', href: '/lectures/lec-002' },
    ]
  },
  {
    title: 'Previous 7 Days',
    items: [
      { id: '3', title: 'Data Structures: Tries', href: '/lectures/lec-003' },
      { id: '4', title: 'Machine Learning with Python', href: '/lectures/lec-004' },
    ]
  }
];

const bottomLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ isGuest = false }: { isGuest?: boolean }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      id="sidebar"
      animate={{ width: collapsed ? 0 : 260 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        "hidden md:flex flex-col h-screen sticky top-0 border-r border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden shrink-0",
        collapsed && "border-r-0"
      )}
    >
      <div className="p-3 w-[260px] pt-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-[var(--text-primary)] font-bold text-lg hover:opacity-80 transition-opacity pl-2">
          <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent font-extrabold tracking-tight">
            Unity-AI
          </span>
        </Link>
      </div>

      <div className="p-3 w-[260px]">
        <Button className="w-full justify-start text-sm h-10 px-3 bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--color-surface)] shadow-sm" variant="secondary" onClick={() => window.location.href='/chat'}>
          <Plus className="h-4 w-4 mr-2" />
          New chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 w-[260px] space-y-6 mt-2 pb-4">
        {!isGuest && historyGroups.map((group) => (
          <div key={group.title}>
            <h3 className="px-2 text-xs font-semibold text-[var(--text-muted)] mb-2 uppercase tracking-wider">
              {group.title}
            </h3>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={cn(
                      "flex items-center group px-2 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--color-surface)] transition-colors",
                      isActive && "bg-[var(--color-surface)] text-[var(--text-primary)] font-medium"
                    )}
                  >
                    <MessageSquare className="h-4 w-4 mr-2 shrink-0 opacity-70 group-hover:opacity-100" />
                    <span className="truncate">{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
        {isGuest && (
          <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)] text-sm px-4 text-center mt-10">
            No recent sessions
          </div>
        )}
      </div>

      <div className="p-4 border-t border-[var(--border-color)] w-[260px]">
        {!isGuest ? (
          <div className="space-y-1">
            {bottomLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--color-surface)] transition-colors"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-1">Anonymous Chat</h4>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">You are chatting as a guest. Log in to get answers based on saved chats, plus upload files and create notes.</p>
            </div>
            <Link href="/login" className="block w-full">
              <Button variant="outline" className="w-full justify-center bg-[var(--bg-primary)] hover:bg-[var(--color-surface)] border-[var(--border-color)]">
                Sign In
              </Button>
            </Link>
          </div>
        )}
      </div>
    </motion.aside>
  );
}

export default Sidebar;
