'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { mockUser } from '@/lib/mock-data';
import { ThemeToggle } from './theme-toggle';
import { Logo } from '@/components/ui/logo';

export function Navbar({ isGuest = false }: { isGuest?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/lectures', label: 'My Lectures', icon: BookOpen },
  ];

  return (
    <nav
      id="navbar"
      className="sticky top-0 z-40 w-full border-b border-[var(--border-color)] bg-[var(--bg-primary)]/85 backdrop-blur-xl"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo & Desktop Nav (Larger with Space Grotesk) */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              id="navbar-logo"
              className="flex items-center gap-3 text-[var(--text-primary)] font-bold hover:opacity-85 transition-opacity group"
            >
              <Logo size={52} variant="dark" priority />
              <span className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight text-[var(--text-primary)]">
                UnityAI
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--color-surface)] transition-all"
                >
                  <link.icon className="h-4 w-4 opacity-70" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Profile or Guest Actions */}
            {!isGuest ? (
              <div className="hidden md:block relative" ref={profileRef}>
                <button
                  id="navbar-profile-btn"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[var(--color-surface)] transition-colors"
                >
                  <Avatar name={mockUser.name} size="sm" />
                  <span className="text-sm font-medium text-[var(--text-primary)]">{mockUser.name}</span>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-xl py-1 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-[var(--border-color)] bg-[var(--bg-tertiary)]">
                        <p className="text-sm font-medium text-[var(--text-primary)]">{mockUser.name}</p>
                        <p className="text-xs text-[var(--text-muted)] truncate">{mockUser.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--color-surface)]"
                      >
                        <User className="h-4 w-4" /> Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--color-surface)]"
                      >
                        <Settings className="h-4 w-4" /> Settings
                      </Link>
                      <div className="h-px bg-[var(--border-color)] my-1" />
                      <button
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10"
                      >
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/dashboard">
                  <span className="h-11 px-5 text-sm sm:text-base font-semibold rounded-xl border border-slate-300 bg-white/80 text-slate-800 hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all shadow-2xs font-heading cursor-pointer inline-flex items-center justify-center">
                    Dashboard
                  </span>
                </Link>
                <Link href="/dashboard">
                  <span className="h-11 px-6 text-sm sm:text-base font-bold rounded-xl border border-slate-300 bg-white text-slate-900 hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all shadow-xs font-heading cursor-pointer inline-flex items-center justify-center">
                    Get Started
                  </span>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              id="navbar-mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--color-surface)] transition-colors"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-[var(--border-color)] bg-[var(--bg-secondary)]"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--color-surface)] transition-colors"
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              ))}
              {!isGuest ? (
                <div className="pt-3 mt-3 border-t border-[var(--border-color)]">
                  <div className="flex items-center gap-3 px-3 py-2">
                    <Avatar name={mockUser.name} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{mockUser.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{mockUser.email}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="pt-3 mt-3 border-t border-[var(--border-color)] flex flex-col gap-3 px-3 pb-2">
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-[var(--text-primary)]">Dashboard</Link>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-indigo-500">Start Learning</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
