'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UploadZone } from '@/components/lecture/upload-zone';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';

export default function UploadPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title.trim()) return;

    setSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('file', file);

    try {
      const res = await api.lectures.create(formData);
      if (res.success) {
        setSubmitted(true);
      } else {
        setError(res.error || 'Failed to upload and process lecture.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected network error occurred.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link
          href="/lectures"
          id="upload-back-btn"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Lectures
        </Link>
        <h1 className="text-2xl font-bold text-white">Upload New Lecture</h1>
        <p className="text-sm text-slate-400 mt-1">
          Upload an audio or video recording to get started
        </p>
      </motion.div>

      {!submitted ? (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <Input
            id="upload-title"
            label="Lecture Title"
            placeholder="e.g. Introduction to Machine Learning"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-300">
              Description
            </label>
            <textarea
              id="upload-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the lecture content…"
              className="w-full rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 px-4 py-2.5 text-sm backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 hover:border-white/20 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-300">
              Lecture File
            </label>
            <UploadZone
              onFileSelect={(f) => setFile(f)}
              id="upload-zone"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-4 text-sm text-red-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Button
            id="upload-submit-btn"
            type="submit"
            size="lg"
            loading={submitting}
            disabled={!file || !title.trim()}
            className="w-full"
            icon={<Sparkles className="h-4 w-4" />}
          >
            Upload & Process
          </Button>
        </motion.form>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-8 text-center"
        >
          <div className="p-4 rounded-2xl bg-emerald-500/10 inline-block mb-4">
            <Sparkles className="h-10 w-10 text-emerald-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Upload Complete!</h2>
          <p className="text-sm text-slate-400 mb-4">
            Your lecture is now being processed. This may take a few minutes.
          </p>

          <div className="flex flex-col items-center gap-3 mb-6">
            <div className="flex items-center gap-3">
              <Badge variant="success">Uploaded</Badge>
              <Badge variant="processing">Processing Audio</Badge>
              <Badge variant="default">Transcription</Badge>
              <Badge variant="default">Note Generation</Badge>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Link href="/lectures">
              <Button id="upload-view-lectures-btn" variant="secondary">
                View Lectures
              </Button>
            </Link>
            <Button
              id="upload-another-btn"
              variant="outline"
              onClick={() => {
                setSubmitted(false);
                setFile(null);
                setTitle('');
                setDescription('');
              }}
            >
              Upload Another
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
