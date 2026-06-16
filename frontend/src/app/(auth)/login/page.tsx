import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Sign In | Unity-AI',
  description: 'Sign in to your Unity-AI account to access your lectures and study tools.',
};

export default function LoginPage() {
  return (
    <div>
      <div className="mb-8 text-center">
        <Link
          href="/"
          id="login-back-home"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>
      <LoginForm />
    </div>
  );
}
