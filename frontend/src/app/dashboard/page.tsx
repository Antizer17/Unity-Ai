'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Clock,
  FileText,
  MessageSquare,
  Upload,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LectureCard } from '@/components/lecture/lecture-card';
import { mockLectures, mockStats, mockUser } from '@/lib/mock-data';

const statCards = [
  {
    label: 'Total Lectures',
    value: mockStats.totalLectures,
    icon: BookOpen,
    gradient: 'from-indigo-500 to-violet-500',
    change: '+3 this week',
  },
  {
    label: 'Hours Studied',
    value: mockStats.hoursStudied,
    icon: Clock,
    gradient: 'from-cyan-500 to-blue-500',
    change: '+5.2 hrs',
  },
  {
    label: 'Notes Generated',
    value: mockStats.notesGenerated,
    icon: FileText,
    gradient: 'from-emerald-500 to-teal-500',
    change: '+2 notes',
  },
  {
    label: 'Chat Sessions',
    value: mockStats.chatSessions,
    icon: MessageSquare,
    gradient: 'from-amber-500 to-orange-500',
    change: '+8 chats',
  },
];

export default function DashboardPage() {
  const recentLectures = mockLectures.slice(0, 4);

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Welcome back, {mockUser.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Here&apos;s what&apos;s happening with your study sessions
          </p>
        </div>
        <Link href="/lectures/upload">
          <Button id="dashboard-upload-btn" icon={<Upload className="h-4 w-4" />}>
            Upload Lecture
          </Button>
        </Link>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            id={`dashboard-stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
            className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-5 hover:border-white/20 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
              </div>
              <div
                className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient} bg-opacity-20`}
              >
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs text-emerald-400">
              <TrendingUp className="h-3 w-3" />
              {stat.change}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Lectures */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Recent Lectures</h2>
          <Link
            href="/lectures"
            id="dashboard-view-all-lectures"
            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {recentLectures.map((lecture, i) => (
            <LectureCard key={lecture.id} lecture={lecture} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
