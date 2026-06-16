'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await new Promise((r) => setTimeout(r, 1000));
      router.push('/dashboard');
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white">Create your account</h1>
        <p className="text-sm text-slate-400 mt-2">
          Start transforming your lectures with AI
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          id="register-name"
          label="Full Name"
          type="text"
          placeholder="Sarah Chen"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={<User className="h-4 w-4" />}
          required
        />

        <Input
          id="register-email"
          label="Email"
          type="email"
          placeholder="you@university.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="h-4 w-4" />}
          required
        />

        <Input
          id="register-password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Min. 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="h-4 w-4" />}
          rightIcon={
            <button
              type="button"
              id="register-toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              className="hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          hint="Must be at least 8 characters"
          required
        />

        <Input
          id="register-confirm-password"
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          icon={<Lock className="h-4 w-4" />}
          error={
            confirmPassword && password !== confirmPassword
              ? 'Passwords do not match'
              : undefined
          }
          required
        />

        <Button
          id="register-submit-btn"
          type="submit"
          loading={loading}
          className="w-full"
          size="lg"
        >
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link
          href="/login"
          id="register-login-link"
          className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>
    </Card>
  );
}

export default RegisterForm;
