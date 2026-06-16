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
          <div className="w-full aspect-video bg-slate-900 relative">
            {isMounted && src && isYouTube ? (
              <Player
                ref={playerRef}
                url={src}
                width="100%"
                height="100%"
                playing={playing}
                controls={true}
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
                onError={(e: any) => { if (e?.name !== 'AbortError') console.warn('ReactPlayer error:', e); }}
              />
            ) : isMounted && src ? (
              <video
                ref={nativeRef as React.RefObject<HTMLVideoElement>}
                src={src}
                poster={poster}
                controls
                className="w-full h-full object-contain"
                onTimeUpdate={onNativeTimeUpdate}
                onLoadedMetadata={onNativeLoadedMetadata}
                onEnded={onNativeEnded}
                onPlay={onNativePlay}
                onPause={onNativePause}
                playsInline
              />
            ) : null}
          </div>
        ) : (
          <div className="w-full aspect-video bg-gradient-to-br from-slate-900 to-black flex items-center justify-center relative p-8">
            {isMounted && src && isYouTube ? (
              <Player
                ref={playerRef}
                url={src}
                width="100%"
                height="100px"
                playing={playing}
                controls={true}
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
                onError={(e: any) => { if (e?.name !== 'AbortError') console.warn('ReactPlayer error:', e); }}
              />
            ) : isMounted && src ? (
              <audio
                ref={nativeRef as React.RefObject<HTMLAudioElement>}
                src={src}
                controls
                className="w-full max-w-2xl"
                onTimeUpdate={onNativeTimeUpdate}
                onLoadedMetadata={onNativeLoadedMetadata}
                onEnded={onNativeEnded}
                onPlay={onNativePlay}
                onPause={onNativePause}
              />
            ) : null}
          </div>
        )}
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';
export { VideoPlayer };
export default VideoPlayer;
