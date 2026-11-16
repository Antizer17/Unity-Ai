'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FONTS, FontId, getSavedFont, setSavedFont } from '@/lib/fonts';
import { cn } from '@/lib/utils';

export function FontToggle({ className }: { className?: string } = {}) {
  const [currentFont, setCurrentFont] = useState<FontId>('instrument');
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initial = getSavedFont();
    setCurrentFont(initial);
    document.documentElement.setAttribute('data-font', initial);

    const handleFontChange = (e: Event) => {
      const customEvent = e as CustomEvent<FontId>;
      if (customEvent.detail) {
        setCurrentFont(customEvent.detail);
      }
    };

    window.addEventListener('unity-font-changed', handleFontChange);
    return () => window.removeEventListener('unity-font-changed', handleFontChange);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (id: FontId) => {
    setSavedFont(id);
    setCurrentFont(id);
    setOpen(false);
  };

  const activeFontObj = FONTS.find((f) => f.id === currentFont) || FONTS[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        id="font-toggle-btn"
        className={cn(
          'flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--color-surface)] hover:border-[var(--border-color-hover)] hover:bg-[var(--bg-secondary)] transition-all cursor-pointer shadow-xs text-xs sm:text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
          open &&
            'border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/30 text-[var(--text-primary)]',
          className
        )}
        title="Toggle Editorial Heading Font"
      >
        <span className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-mono font-bold">
          Font
        </span>
        <span
          className="font-semibold text-slate-800"
          style={{ fontFamily: activeFontObj.previewFontFamily }}
        >
          {activeFontObj.name.split(' ')[0]}
        </span>
        <span className="text-[10px] text-slate-400 select-none">▾</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-2xl p-2 z-50 overflow-hidden backdrop-blur-xl"
          >
            <div className="px-3 py-2 border-b border-[var(--border-color)] mb-1.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                  Editorial Headline Fonts
                </p>
                <p className="text-[10px] text-[var(--text-muted)]">
                  Paired with Inter body copy & UI
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold">
                Live Preview
              </span>
            </div>

            <div className="space-y-1">
              {FONTS.map((font) => {
                const isSelected = currentFont === font.id;
                return (
                  <button
                    key={font.id}
                    onClick={() => handleSelect(font.id)}
                    className={cn(
                      'w-full flex flex-col p-2.5 rounded-xl text-left transition-all cursor-pointer group',
                      isSelected
                        ? 'bg-[var(--color-surface)] border border-[var(--border-color-hover)] shadow-xs'
                        : 'hover:bg-[var(--color-surface)]/60 border border-transparent'
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span
                        className="text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-tight leading-none"
                        style={{ fontFamily: font.previewFontFamily }}
                      >
                        {font.name}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-mono font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/15 px-2 py-0.5 rounded-full">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-semibold text-[var(--color-accent)] mt-1">
                      {font.tagline}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5 leading-tight">
                      {font.vibe}
                    </p>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Floating Quick Switcher Pill for Fonts
 */
export function FloatingFontSwitcher() {
  const [currentFont, setCurrentFont] = useState<FontId>('instrument');

  useEffect(() => {
    setCurrentFont(getSavedFont());
    const handleFontChange = (e: Event) => {
      const customEvent = e as CustomEvent<FontId>;
      if (customEvent.detail) setCurrentFont(customEvent.detail);
    };
    window.addEventListener('unity-font-changed', handleFontChange);
    return () => window.removeEventListener('unity-font-changed', handleFontChange);
  }, []);

  const handleSelect = (id: FontId) => {
    setSavedFont(id);
    setCurrentFont(id);
  };

  return (
    <div className="flex items-center gap-1">
      {FONTS.map((font) => {
        const isSelected = currentFont === font.id;
        return (
          <button
            key={font.id}
            onClick={() => handleSelect(font.id)}
            title={`${font.name} — ${font.tagline}`}
            className={cn(
              'px-2 py-1 rounded-lg text-xs transition-all cursor-pointer select-none',
              isSelected
                ? 'bg-[var(--color-surface)] text-[var(--text-primary)] border border-[var(--border-color-hover)] shadow-xs font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--color-surface)]/40 border border-transparent font-medium'
            )}
            style={{ fontFamily: font.previewFontFamily }}
          >
            {font.name.split(' ')[0]}
          </button>
        );
      })}
    </div>
  );
}
