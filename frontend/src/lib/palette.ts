export type PaletteId = 'aurora' | 'lagoon' | 'orchid';

export interface PaletteInfo {
  id: PaletteId;
  name: string;
  subtitle: string;
  bluishGreen: string;   // Primary
  contrastColor: string; // Complementary accent
  dotGradient: string;
}

export const PALETTES: PaletteInfo[] = [
  {
    id: 'aurora',
    name: 'Nordic Aurora',
    subtitle: 'Seafoam Teal & Coral Peach',
    bluishGreen: '#5eead4',
    contrastColor: '#ff9e88',
    dotGradient: 'from-[#5eead4] to-[#ff9e88]',
  },
  {
    id: 'lagoon',
    name: 'Deep Lagoon',
    subtitle: 'Mint Sage & Golden Apricot',
    bluishGreen: '#6ee7b7',
    contrastColor: '#fbb572',
    dotGradient: 'from-[#6ee7b7] to-[#fbb572]',
  },
  {
    id: 'orchid',
    name: 'Abyssal Orchid',
    subtitle: 'Ice Aqua & Orchid Rose',
    bluishGreen: '#67e8f9',
    contrastColor: '#f472b6',
    dotGradient: 'from-[#67e8f9] to-[#f472b6]',
  },
];

export const DEFAULT_PALETTE: PaletteId = 'aurora';

export function getSavedPalette(): PaletteId {
  if (typeof window === 'undefined') return DEFAULT_PALETTE;
  const saved = localStorage.getItem('unity-palette') as PaletteId;
  return PALETTES.some((p) => p.id === saved) ? saved : DEFAULT_PALETTE;
}

export function setSavedPalette(id: PaletteId): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('unity-palette', id);
  document.documentElement.setAttribute('data-palette', id);
  window.dispatchEvent(new CustomEvent('unity-palette-changed', { detail: id }));
}
