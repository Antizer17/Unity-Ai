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
import ReactPlayer from 'react-player';
import { cn, formatDuration } from '@/lib/utils';

export interface VideoPlayerHandle {
  seekTo: (seconds: number) => void;
  play: () => void;
}

export interface VideoPlayerProps {
  src?: string;
  type?: 'video' | 'audio';
  poster?: string;
  id?: string;
  onTimeUpdate?: (time: number) => void;
}

const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(
  ({ src, type = 'video', poster, id = 'video-player', onTimeUpdate }, ref) => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);

    const isYouTube = src ? src.includes('youtube.com') || src.includes('youtu.be') : false;

    const Player = ReactPlayer as any;

    const playerRef = useRef<any>(null);
    const nativeRef = useRef<HTMLMediaElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTimeState] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const setCurrentTime = useCallback((time: number) => {
      setCurrentTimeState(time);
      onTimeUpdate?.(time);
    }, [onTimeUpdate]);

    useImperativeHandle(ref, () => ({
      seekTo: (seconds: number) => {
        if (isYouTube && playerRef.current) {
          if (typeof playerRef.current.seekTo === 'function') {
            playerRef.current.seekTo(seconds, 'seconds');
          } else {
            const internal = (playerRef.current as any).getInternalPlayer?.();
            if (internal && 'currentTime' in internal) {
              internal.currentTime = seconds;
            }
          }
        } else if (nativeRef.current) {
          nativeRef.current.currentTime = seconds;
        }
        setCurrentTime(seconds);
      },
      play: () => {
        if (isYouTube && playerRef.current) {
          setPlaying(true);
        } else if (nativeRef.current) {
          const playPromise = nativeRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(e => {
              if (e.name !== 'AbortError') console.error('Play error:', e);
            });
          }
          setPlaying(true);
        }
      }
    }));

    const togglePlay = useCallback((e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      setPlaying(p => {
        const next = !p;
        if (!isYouTube && nativeRef.current) {
          if (next) {
            const playPromise = nativeRef.current.play();
            if (playPromise !== undefined) {
              playPromise.catch(e => {
                if (e.name !== 'AbortError') console.error('Toggle play error:', e);
              });
            }
          } else {
            nativeRef.current.pause();
          }
        }
        return next;
      });
    }, [isYouTube]);

    const toggleMute = useCallback(() => {
      setMuted(m => {
        const next = !m;
        if (!isYouTube && nativeRef.current) {
          nativeRef.current.muted = next;
        }
        return next;
      });
    }, [isYouTube]);

    const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressRef.current) return;
      const rect = progressRef.current.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      const newTime = pct * duration;
      
      if (isYouTube && playerRef.current) {
        if (typeof playerRef.current.seekTo === 'function') {
          playerRef.current.seekTo(newTime, 'seconds');
        } else {
          const internal = (playerRef.current as any).getInternalPlayer?.();
          if (internal && 'currentTime' in internal) {
            internal.currentTime = newTime;
          }
        }
      } else if (nativeRef.current) {
        nativeRef.current.currentTime = newTime;
      }
      setCurrentTime(newTime);
    }, [duration, isYouTube]);

    const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const v = parseFloat(e.target.value);
      setVolume(v);
      setMuted(v === 0);
      if (!isYouTube && nativeRef.current) {
        nativeRef.current.volume = v;
        nativeRef.current.muted = v === 0;
      }
    }, [isYouTube]);

    const skip = useCallback((seconds: number) => {
      const newTime = Math.max(0, Math.min(currentTime + seconds, duration));
      if (isYouTube && playerRef.current) {
        if (typeof playerRef.current.seekTo === 'function') {
          playerRef.current.seekTo(newTime, 'seconds');
        } else {
          const internal = (playerRef.current as any).getInternalPlayer?.();
          if (internal && 'currentTime' in internal) {
            internal.currentTime = newTime;
          }
        }
      } else if (nativeRef.current) {
        nativeRef.current.currentTime = newTime;
      }
      setCurrentTime(newTime);
    }, [duration, currentTime, isYouTube]);

    const handleFullscreen = useCallback(() => {
      const container = document.getElementById(id);
      if (container?.requestFullscreen) {
        container.requestFullscreen();
      }
    }, [id]);

    // Native media events
    const onNativeTimeUpdate = useCallback(() => {
      if (nativeRef.current) setCurrentTime(nativeRef.current.currentTime);
    }, []);
    const onNativeLoadedMetadata = useCallback(() => {
      if (nativeRef.current) {
        setDuration(nativeRef.current.duration);
        setLoaded(true);
      }
    }, []);
    const onNativeEnded = useCallback(() => setPlaying(false), []);
    const onNativePlay = useCallback(() => setPlaying(true), []);
    const onNativePause = useCallback(() => setPlaying(false), []);

    const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
      <div
        id={id}
        className="relative rounded-2xl overflow-hidden bg-black/90 border border-[var(--border-color)] group"
      >
        {type === 'video' ? (
          <div className="w-full aspect-video bg-slate-900 pointer-events-none">
            {isMounted && src && isYouTube ? (
              <Player
                ref={playerRef}
                url={src}
                width="100%"
                height="100%"
                playing={playing}
                volume={volume}
                muted={muted}
                onProgress={(state: any) => setCurrentTime(state.playedSeconds)}
                onReady={() => {
                  if (playerRef.current) {
                    setDuration(playerRef.current.getDuration());
                    setLoaded(true);
                  }
                }}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
                config={{
                  youtube: { playerVars: { showinfo: 0, controls: 0, disablekb: 1, modestbranding: 1 } }
                } as any}
              />
            ) : isMounted && src ? (
              <video
                ref={nativeRef as React.RefObject<HTMLVideoElement>}
                src={src}
                poster={poster}
                className="w-full h-full object-cover"
                onTimeUpdate={onNativeTimeUpdate}
                onLoadedMetadata={onNativeLoadedMetadata}
                onEnded={onNativeEnded}
                onPlay={onNativePlay}
                onPause={onNativePause}
                playsInline
              />
            ) : null}
            <div className="absolute inset-0 pointer-events-auto" onClick={togglePlay} />
          </div>
        ) : (
          <div className="w-full aspect-video bg-gradient-to-br from-slate-900 to-black flex items-center justify-center relative">
            {isMounted && src && isYouTube ? (
              <Player
                ref={playerRef}
                url={src}
                width="0"
                height="0"
                playing={playing}
                volume={volume}
                muted={muted}
                onProgress={(state: any) => setCurrentTime(state.playedSeconds)}
                onReady={() => {
                  if (playerRef.current) {
                    setDuration(playerRef.current.getDuration());
                    setLoaded(true);
                  }
                }}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
              />
            ) : isMounted && src ? (
              <audio
                ref={nativeRef as React.RefObject<HTMLAudioElement>}
                src={src}
                className="hidden"
                onTimeUpdate={onNativeTimeUpdate}
                onLoadedMetadata={onNativeLoadedMetadata}
                onEnded={onNativeEnded}
                onPlay={onNativePlay}
                onPause={onNativePause}
              />
            ) : null}
            
            <div className="text-center z-10" onClick={togglePlay}>
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition-transform">
                {playing ? (
                  <Pause className="h-10 w-10 text-white" />
                ) : (
                  <Play className="h-10 w-10 text-white ml-1" />
                )}
              </div>
              <p className="text-sm text-slate-400 font-medium">Audio Lecture</p>
            </div>
          </div>
        )}

        {/* Placeholder overlay when no source */}
        {!src && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 z-20">
            <div className="text-center">
              <Play className="h-16 w-16 text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No media loaded</p>
            </div>
          </div>
        )}

        {/* Controls overlay */}
        <div
          className={cn(
            'absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-10 z-30',
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
                onClick={(e) => { e.stopPropagation(); skip(-10); }}
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
                onClick={(e) => { e.stopPropagation(); skip(10); }}
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
                onClick={(e) => { e.stopPropagation(); toggleMute(); }}
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
                onClick={(e) => e.stopPropagation()}
                className="w-20 h-1 accent-indigo-500"
              />
              {type === 'video' && (
                <button
                  id={`${id}-fullscreen`}
                  onClick={(e) => { e.stopPropagation(); handleFullscreen(); }}
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
