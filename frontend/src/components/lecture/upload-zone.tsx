'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileAudio, FileVideo, X, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
  id?: string;
}

const ACCEPTED_TYPES = ['audio/mpeg', 'audio/wav', 'audio/webm', 'video/mp4', 'video/webm'];

export function UploadZone({
  onFileSelect,
  accept = '.mp3,.mp4,.wav,.webm',
  maxSize = 500,
  id = 'upload-zone',
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        return 'Invalid file type. Please upload MP3, MP4, WAV, or WEBM files.';
      }
      if (file.size > maxSize * 1024 * 1024) {
        return `File too large. Maximum size is ${maxSize}MB.`;
      }
      return null;
    },
    [maxSize]
  );

  const handleFile = useCallback(
    (file: File) => {
      const err = validateFile(file);
      if (err) {
        setError(err);
        return;
      }
      setError('');
      setSelectedFile(file);

      // Simulate upload progress
      setUploading(true);
      setProgress(0);
      let p = 0;
      const interval = setInterval(() => {
        p += Math.random() * 15 + 5;
        if (p >= 100) {
          p = 100;
          clearInterval(interval);
          setUploading(false);
          onFileSelect(file);
        }
        setProgress(Math.min(p, 100));
      }, 300);
    },
    [validateFile, onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const clearFile = () => {
    setSelectedFile(null);
    setProgress(0);
    setUploading(false);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div id={id} className="w-full">
      {!selectedFile ? (
        <motion.div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={cn(
            'relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300',
            isDragging
              ? 'border-indigo-400 bg-indigo-500/10'
              : 'border-white/20 bg-white/5 hover:border-indigo-500/50 hover:bg-white/10'
          )}
        >
          <input
            ref={inputRef}
            id={`${id}-input`}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-4">
            <div
              className={cn(
                'p-4 rounded-2xl transition-colors',
                isDragging ? 'bg-indigo-500/20' : 'bg-white/5'
              )}
            >
              <Upload
                className={cn(
                  'h-10 w-10 transition-colors',
                  isDragging ? 'text-indigo-400' : 'text-slate-400'
                )}
              />
            </div>

            <div>
              <p className="text-base font-medium text-white">
                {isDragging ? 'Drop your file here' : 'Drop your lecture here'}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                or click to browse files
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <FileAudio className="h-3.5 w-3.5" /> MP3, WAV, WEBM
              </span>
              <span className="flex items-center gap-1">
                <FileVideo className="h-3.5 w-3.5" /> MP4, WEBM
              </span>
            </div>

            <p className="text-xs text-slate-600">
              Max file size: {maxSize}MB
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10">
                {selectedFile.type.startsWith('video')
                  ? <FileVideo className="h-6 w-6 text-indigo-400" />
                  : <FileAudio className="h-6 w-6 text-indigo-400" />
                }
              </div>
              <div>
                <p className="text-sm font-medium text-white">{selectedFile.name}</p>
                <p className="text-xs text-slate-400">{formatSize(selectedFile.size)}</p>
              </div>
            </div>
            {!uploading && (
              <button
                id={`${id}-clear`}
                onClick={clearFile}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-400">
                {uploading ? 'Uploading…' : 'Upload complete'}
              </span>
              <span className="text-indigo-400">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className={cn(
                  'h-full rounded-full',
                  progress < 100
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-500'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                )}
              />
            </div>
          </div>

          {progress >= 100 && !uploading && (
            <div className="flex items-center gap-2 mt-3 text-sm text-emerald-400">
              <CheckCircle className="h-4 w-4" />
              File ready for processing
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}

export default UploadZone;
