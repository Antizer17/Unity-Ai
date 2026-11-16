import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { FloatingPaletteSwitcher } from '@/components/layout/palette-toggle';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Unity-AI | Lecture Study Platform',
  description:
    'Transform lecture recordings into interactive study sessions with AI-powered transcription, smart notes, and an intelligent tutor chatbot.',
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
    <html lang="en" suppressHydrationWarning className="dark" data-palette="aurora">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const p = localStorage.getItem('unity-palette') || 'aurora';
                document.documentElement.setAttribute('data-palette', p);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} font-sans bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <FloatingPaletteSwitcher />
        </ThemeProvider>
      </body>
    </html>
  );
}
