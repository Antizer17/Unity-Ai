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
      { id: '1', title: 'Calculus III: Multiple Integrals', href: '/lectures/1' },
      { id: '2', title: 'Physics: Thermodynamics', href: '/lectures/2' },
    ]
  },
  {
    title: 'Previous 7 Days',
    items: [
      { id: '3', title: 'Data Structures: Trees', href: '/lectures/3' },
      { id: '4', title: 'Machine Learning basics', href: '/lectures/4' },
      { id: '5', title: 'History of Art: Renaissance', href: '/lectures/5' },
    ]
  }
];

const bottomLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      id="sidebar"
      animate={{ width: collapsed ? 0 : 260 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        "hidden md:flex flex-col h-[calc(100vh-4rem)] sticky top-16 border-r border-[var(--border-color)] bg-[var(--bg-secondary)] overflow-hidden",
        collapsed && "border-r-0"
      )}
    >
      <div className="p-3 w-[260px]">
        <Button className="w-full justify-start text-sm h-10 px-3 bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--color-surface)] shadow-sm" variant="secondary" onClick={() => window.location.href='/dashboard'}>
          <Plus className="h-4 w-4 mr-2" />
          New chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 w-[260px] space-y-6 mt-4 pb-4">
        {historyGroups.map((group) => (
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
      </div>

      <div className="p-3 border-t border-[var(--border-color)] w-[260px] space-y-1">
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
    </motion.aside>
  );
}

export default Sidebar;
