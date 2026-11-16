import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';

export function Footer() {
  return (
    <footer id="footer" className="w-full border-t border-[var(--border-color)] bg-[var(--bg-secondary)]/90 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-[var(--text-secondary)]">
            <Logo size={38} variant="dark" />
            <span className="text-sm font-medium">
              © {new Date().getFullYear()} UnityAI. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              id="footer-privacy"
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              id="footer-terms"
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="mailto:support@unity-ai.dev"
              id="footer-contact"
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
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
