import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = {
  title: 'Create Account | Unity-AI',
  description: 'Create your Unity-AI account and start transforming your lectures with AI.',
};

export default function RegisterPage() {
  return (
    <div>
      <div className="mb-8 text-center">
        <Link
          href="/"
          id="register-back-home"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </div>
      <RegisterForm />
    </div>
  );
}
