import type { Metadata } from 'next';
import {
  Inter,
  Instrument_Serif,
  Playfair_Display,
  Newsreader,
  Cormorant_Garamond,
  Space_Grotesk,
} from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { FloatingPaletteSwitcher } from '@/components/layout/palette-toggle';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Unity-AI | Lecture Study Platform',
  description:
    'Transform lecture recordings into interactive study sessions with AI-powered transcription, smart notes, and an intelligent tutor chatbot.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  keywords: [
    'AI',
    'lectures',
    'study',
    'transcription',
    'notes',
    'chatbot',
    'education',
    'Unity-AI',
  ],
  authors: [{ name: 'Unity-AI Team' }],
  openGraph: {
    title: 'Unity-AI | Lecture Study Platform',
    description:
      'Transform lecture recordings into interactive study sessions with AI.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark" data-palette="aurora" data-font="instrument">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const p = localStorage.getItem('unity-palette') || 'aurora';
                document.documentElement.setAttribute('data-palette', p);
                const f = localStorage.getItem('unity-font') || 'instrument';
                document.documentElement.setAttribute('data-font', f);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${instrumentSerif.variable} ${playfairDisplay.variable} ${newsreader.variable} ${cormorantGaramond.variable} ${spaceGrotesk.variable} font-sans bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <FloatingPaletteSwitcher />
        </ThemeProvider>
      </body>
    </html>
  );
}
