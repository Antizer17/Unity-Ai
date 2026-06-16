import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer id="footer" className="border-t border-white/10 bg-slate-950/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span className="text-sm">
              © {new Date().getFullYear()} Unity-AI. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              id="footer-privacy"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              id="footer-terms"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="mailto:support@unity-ai.dev"
              id="footer-contact"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
