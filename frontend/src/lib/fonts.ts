export type FontId = 'instrument' | 'playfair' | 'newsreader' | 'cormorant' | 'space';

export interface FontOption {
  id: FontId;
  name: string;
  tagline: string;
  vibe: string;
  category: 'Serif' | 'Geometric Sans';
  cssVariable: string;
  previewFontFamily: string;
}

export const FONTS: FontOption[] = [
  {
    id: 'instrument',
    name: 'Instrument Serif',
    tagline: 'The Modern Darling',
    vibe: 'Sleek, slightly condensed, contemporary indie fashion magazine feel',
    category: 'Serif',
    cssVariable: 'var(--font-instrument)',
    previewFontFamily: 'var(--font-instrument), Georgia, serif',
  },
  {
    id: 'playfair',
    name: 'Playfair Display',
    tagline: 'The Timeless Standard',
    vibe: 'Classic, high-contrast, dramatic strokes with editorial authority',
    category: 'Serif',
    cssVariable: 'var(--font-playfair)',
    previewFontFamily: 'var(--font-playfair), Georgia, serif',
  },
  {
    id: 'newsreader',
    name: 'Newsreader',
    tagline: 'The Sophisticated Academic',
    vibe: 'Digital publishing & long-form editorial journalism, smart & literary',
    category: 'Serif',
    cssVariable: 'var(--font-newsreader)',
    previewFontFamily: 'var(--font-newsreader), Times New Roman, serif',
  },
  {
    id: 'cormorant',
    name: 'Cormorant Garamond',
    tagline: 'The Luxury & Boutique Choice',
    vibe: 'Ultra-refined, delicate, classical book typography carved with precision',
    category: 'Serif',
    cssVariable: 'var(--font-cormorant)',
    previewFontFamily: 'var(--font-cormorant), Garamond, serif',
  },
  {
    id: 'space',
    name: 'Space Grotesk',
    tagline: 'Modern Tech & CS',
    vibe: 'Geometric, slightly futuristic, sharp angles for modern tech platforms',
    category: 'Geometric Sans',
    cssVariable: 'var(--font-space-grotesk)',
    previewFontFamily: 'var(--font-space-grotesk), sans-serif',
  },
];

export function getSavedFont(): FontId {
  if (typeof window === 'undefined') return 'instrument';
  try {
    const saved = localStorage.getItem('unity-font') as FontId | null;
    if (saved && FONTS.some((f) => f.id === saved)) return saved;
  } catch (e) {}
  return 'instrument';
}

export function setSavedFont(fontId: FontId) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('unity-font', fontId);
    document.documentElement.setAttribute('data-font', fontId);
    window.dispatchEvent(new CustomEvent('unity-font-changed', { detail: fontId }));
  } catch (e) {}
}
