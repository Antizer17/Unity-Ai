'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Palette, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PALETTES, PaletteId, getSavedPalette, setSavedPalette } from '@/lib/palette';
import { cn } from '@/lib/utils';

export function PaletteToggle({ className }: { className?: string } = {}) {
  const [currentPalette, setCurrentPalette] = useState<PaletteId>('aurora');
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial sync
    const initial = getSavedPalette();
    setCurrentPalette(initial);
    document.documentElement.setAttribute('data-palette', initial);

    const handlePaletteChange = (e: Event) => {
      const customEvent = e as CustomEvent<PaletteId>;
      if (customEvent.detail) {
        setCurrentPalette(customEvent.detail);
      }
    };

    window.addEventListener('unity-palette-changed', handlePaletteChange);
    return () => window.removeEventListener('unity-palette-changed', handlePaletteChange);
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

  const handleSelect = (id: PaletteId) => {
    setSavedPalette(id);
    setCurrentPalette(id);
    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        id="palette-toggle-btn"
        className={cn(
          "flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--color-surface)] hover:border-[var(--border-color-hover)] hover:bg-[var(--bg-secondary)] transition-all cursor-pointer shadow-sm text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
          open && "border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/30 text-[var(--text-primary)]",
          className
        )}
        title="Change Dark Pastel Palette"
      >
        <Palette className="h-3.5 w-3.5 text-[var(--color-primary)]" />
        <span className="hidden sm:inline">Theme</span>
        <div className="flex items-center -space-x-1 ml-0.5">
          <span
            className="w-2.5 h-2.5 rounded-full border border-black/40 shadow-xs"
            style={{ backgroundColor: PALETTES.find(p => p.id === currentPalette)?.bluishGreen }}
          />
          <span
            className="w-2.5 h-2.5 rounded-full border border-black/40 shadow-xs"
            style={{ backgroundColor: PALETTES.find(p => p.id === currentPalette)?.contrastColor }}
          />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-72 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-2xl p-2 z-50 overflow-hidden backdrop-blur-xl"
          >
            <div className="px-3 py-2 border-b border-[var(--border-color)] mb-1.5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[var(--text-primary)]">Dark Pastel Palettes</p>
                <p className="text-[10px] text-[var(--text-muted)]">Bluish-Green with warm contrast</p>
              </div>
              <Sparkles className="h-3.5 w-3.5 text-[var(--color-primary)] opacity-70" />
            </div>

            <div className="space-y-1">
              {PALETTES.map((palette) => {
                const isSelected = currentPalette === palette.id;
                return (
                  <button
                    key={palette.id}
                    onClick={() => handleSelect(palette.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer group",
                      isSelected
                        ? "bg-[var(--color-surface)] border border-[var(--border-color-hover)] shadow-xs"
                        : "hover:bg-[var(--color-surface)]/60 border border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {/* Dual color swatches */}
                      <div className="flex items-center -space-x-1.5 shrink-0">
                        <span
                          className="w-4 h-4 rounded-full border border-black/30 shadow-sm"
                          style={{ backgroundColor: palette.bluishGreen }}
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-black/30 shadow-sm"
                          style={{ backgroundColor: palette.contrastColor }}
                        />
                      </div>
                      <div>
                        <p className={cn(
                          "text-xs font-medium leading-tight transition-colors",
                          isSelected ? "text-[var(--color-primary)] font-semibold" : "text-[var(--text-primary)]"
                        )}>
                          {palette.name}
                        </p>
                        <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                          {palette.subtitle}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="h-4 w-4 text-[var(--color-primary)] shrink-0" />
                    )}
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
 * Floating Quick-Switch Pill for easy testing on any page
 */
export function FloatingPaletteSwitcher() {
  const [currentPalette, setCurrentPalette] = useState<PaletteId>('aurora');
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    setCurrentPalette(getSavedPalette());
    const handlePaletteChange = (e: Event) => {
      const customEvent = e as CustomEvent<PaletteId>;
      if (customEvent.detail) setCurrentPalette(customEvent.detail);
    };
    window.addEventListener('unity-palette-changed', handlePaletteChange);
    return () => window.removeEventListener('unity-palette-changed', handlePaletteChange);
  }, []);

  const handleSwitch = (id: PaletteId) => {
    setSavedPalette(id);
    setCurrentPalette(id);
  };

  return (
    <aside
      aria-label="Theme Palette Switcher"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 p-1.5 rounded-2xl bg-[var(--bg-secondary)]/90 border border-[var(--border-color-hover)] shadow-2xl backdrop-blur-xl transition-all"
    >
      <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold text-[var(--text-muted)] select-none">
        <Palette className="h-3.5 w-3.5 text-[var(--color-primary)]" />
        <span className="hidden sm:inline">Palette:</span>
      </div>

      <div className="flex items-center gap-1">
        {PALETTES.map((p) => {
          const isSelected = currentPalette === p.id;
          return (
            <button
              key={p.id}
              onClick={() => handleSwitch(p.id)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer",
                isSelected
                  ? "bg-[var(--color-surface)] text-[var(--text-primary)] border border-[var(--border-color-hover)] shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--color-surface)]/40 border border-transparent"
              )}
            >
              <div className="flex items-center -space-x-1 shrink-0">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/40"
                  style={{ backgroundColor: p.bluishGreen }}
                />
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/40"
                  style={{ backgroundColor: p.contrastColor }}
                />
              </div>
              <span>{p.name.split(' ')[1] || p.name}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
