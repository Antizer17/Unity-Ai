import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

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
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans bg-slate-950 text-slate-200 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
