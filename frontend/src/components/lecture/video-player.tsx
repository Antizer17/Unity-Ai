'use client';

import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import { cn, formatDuration } from '@/lib/utils';

export interface VideoPlayerHandle {
  seekTo: (seconds: number) => void;
}

export interface VideoPlayerProps {
  src?: string;
  type?: 'video' | 'audio';
  poster?: string;
  id?: string;
}

const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(
  ({ src, type = 'video', poster, id = 'video-player' }, ref) => {
    const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useImperativeHandle(ref, () => ({
      seekTo: (seconds: number) => {
        if (mediaRef.current) {
          mediaRef.current.currentTime = seconds;
          setCurrentTime(seconds);
        }
      },
    }));

    const togglePlay = useCallback(() => {
      if (!mediaRef.current) return;
      if (playing) {
        mediaRef.current.pause();
      } else {
        mediaRef.current.play();
      }
      setPlaying(!playing);
    }, [playing]);

    const toggleMute = useCallback(() => {
      if (!mediaRef.current) return;
      mediaRef.current.muted = !muted;
      setMuted(!muted);
    }, [muted]);

    const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressRef.current || !mediaRef.current) return;
      const rect = progressRef.current.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      const newTime = pct * duration;
      mediaRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }, [duration]);

    const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const v = parseFloat(e.target.value);
      setVolume(v);
      if (mediaRef.current) {
        mediaRef.current.volume = v;
        setMuted(v === 0);
      }
    }, []);

    const skip = useCallback((seconds: number) => {
      if (!mediaRef.current) return;
      mediaRef.current.currentTime = Math.max(
        0,
        Math.min(mediaRef.current.currentTime + seconds, duration)
      );
    }, [duration]);

    const handleFullscreen = useCallback(() => {
      const container = document.getElementById(id);
      if (container?.requestFullscreen) {
        container.requestFullscreen();
      }
    }, [id]);

    useEffect(() => {
      const media = mediaRef.current;
      if (!media) return;

      const onTimeUpdate = () => setCurrentTime(media.currentTime);
      const onLoadedMetadata = () => {
        setDuration(media.duration);
        setLoaded(true);
      };
      const onEnded = () => setPlaying(false);

      media.addEventListener('timeupdate', onTimeUpdate);
      media.addEventListener('loadedmetadata', onLoadedMetadata);
      media.addEventListener('ended', onEnded);

      return () => {
        media.removeEventListener('timeupdate', onTimeUpdate);
        media.removeEventListener('loadedmetadata', onLoadedMetadata);
        media.removeEventListener('ended', onEnded);
      };
    }, [src]);

    const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
      <div
        id={id}
        className="relative rounded-2xl overflow-hidden bg-black/90 border border-[var(--border-color)] group"
      >
        {/* Media element */}
        {type === 'video' ? (
          <video
            ref={mediaRef as React.RefObject<HTMLVideoElement>}
            src={src}
            poster={poster}
            className="w-full aspect-video bg-slate-900"
            onClick={togglePlay}
          />
        ) : (
          <div className="w-full aspect-video bg-gradient-to-br from-slate-900 to-black flex items-center justify-center">
            <audio ref={mediaRef as React.RefObject<HTMLAudioElement>} src={src} />
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                {playing ? (
                  <Pause className="h-10 w-10 text-white" />
                ) : (
                  <Play className="h-10 w-10 text-white ml-1" />
                )}
              </div>
              <p className="text-sm text-slate-400">Audio Lecture</p>
            </div>
          </div>
        )}

        {/* Placeholder overlay when no source */}
        {!src && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90">
            <div className="text-center">
              <Play className="h-16 w-16 text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No media loaded</p>
            </div>
          </div>
        )}

        {/* Controls overlay */}
        <div
          className={cn(
            'absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-10',
            'opacity-0 group-hover:opacity-100 transition-opacity duration-300',
            !loaded && 'hidden'
          )}
        >
          {/* Progress bar */}
          <div
            ref={progressRef}
            id={`${id}-progress`}
            onClick={handleSeek}
            className="h-1.5 rounded-full bg-white/20 cursor-pointer mb-3 group/progress hover:h-2.5 transition-all"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 relative"
              style={{ width: `${progressPct}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                id={`${id}-skip-back`}
                onClick={() => skip(-10)}
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <SkipBack className="h-4 w-4" />
              </button>

              <button
                id={`${id}-play-btn`}
                onClick={togglePlay}
                className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                {playing ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </button>

              <button
                id={`${id}-skip-forward`}
                onClick={() => skip(10)}
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <SkipForward className="h-4 w-4" />
              </button>

              <span className="text-xs text-white/70 ml-2 font-mono">
                {formatDuration(currentTime)} / {formatDuration(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id={`${id}-mute-btn`}
                onClick={toggleMute}
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                {muted || volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
              <input
                id={`${id}-volume`}
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={muted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 accent-indigo-500"
              />
              {type === 'video' && (
                <button
                  id={`${id}-fullscreen`}
                  onClick={handleFullscreen}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Maximize className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';
export { VideoPlayer };
export default VideoPlayer;
