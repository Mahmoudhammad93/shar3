"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ExternalLink, Play } from "lucide-react";
import { Card } from "./card";
import { ProgressBar } from "./progress";

export const VIDEO_WATCH_THRESHOLD = 95;

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string,
        config: {
          videoId: string;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: (event: { target: YtPlayerInstance }) => void;
            onStateChange?: (event: { data: number; target: YtPlayerInstance }) => void;
          };
        }
      ) => YtPlayerInstance;
      PlayerState: { ENDED: number; PLAYING: number; PAUSED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YtPlayerInstance {
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
}

function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?.*v=|youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

let apiLoading: Promise<void> | null = null;

function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();

  if (!apiLoading) {
    apiLoading = new Promise((resolve) => {
      const existing = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        existing?.();
        resolve();
      };

      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(script);
      }
    });
  }

  return apiLoading;
}

export function TrackedVideoPlayer({
  url,
  title,
  initialProgress = 0,
  onProgressUpdate,
  onVideoComplete,
}: {
  url?: string;
  title: string;
  initialProgress?: number;
  onProgressUpdate?: (percent: number) => void;
  onVideoComplete?: () => void;
}) {
  const playerId = useId().replace(/:/g, "");
  const playerRef = useRef<YtPlayerInstance | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const maxProgressRef = useRef(initialProgress);
  const completedRef = useRef(initialProgress >= VIDEO_WATCH_THRESHOLD);
  const onProgressUpdateRef = useRef(onProgressUpdate);
  const onVideoCompleteRef = useRef(onVideoComplete);
  const [watchProgress, setWatchProgress] = useState(initialProgress);

  onProgressUpdateRef.current = onProgressUpdate;
  onVideoCompleteRef.current = onVideoComplete;

  function clearPoll() {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }

  function reportProgress(percent: number) {
    const rounded = Math.min(100, Math.round(percent));
    if (rounded <= maxProgressRef.current) return;

    maxProgressRef.current = rounded;
    setWatchProgress(rounded);
    onProgressUpdateRef.current?.(rounded);

    if (rounded >= VIDEO_WATCH_THRESHOLD && !completedRef.current) {
      completedRef.current = true;
      onVideoCompleteRef.current?.();
    }
  }

  // Create the YouTube player once per video URL — never recreate on progress updates.
  useEffect(() => {
    if (!url) return;

    const youtubeId = extractYoutubeId(url);
    if (!youtubeId) return;

    let cancelled = false;

    loadYouTubeApi().then(() => {
      if (cancelled || !window.YT?.Player) return;

      playerRef.current = new window.YT.Player(playerId, {
        videoId: youtubeId,
        playerVars: {
          rel: 0,
          modestbranding: 1,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onStateChange: (event) => {
            const YT = window.YT!;
            if (event.data === YT.PlayerState.PLAYING) {
              clearPoll();
              pollRef.current = setInterval(() => {
                const player = playerRef.current;
                if (!player) return;
                const duration = player.getDuration();
                if (!duration || duration <= 0) return;
                reportProgress((player.getCurrentTime() / duration) * 100);
              }, 2000);
            } else {
              clearPoll();
              if (event.data === YT.PlayerState.ENDED) {
                reportProgress(100);
              }
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      clearPoll();
      playerRef.current?.destroy();
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, playerId]);

  if (url) {
    const youtubeId = extractYoutubeId(url);
    if (youtubeId) {
      const watchUrl = `https://www.youtube.com/watch?v=${youtubeId}`;

      return (
        <div className="space-y-3">
          <div className="aspect-video overflow-hidden rounded-2xl bg-black shadow-lg">
            <div id={playerId} className="h-full w-full" title={title} />
          </div>
          {watchProgress > 0 && watchProgress < VIDEO_WATCH_THRESHOLD && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted">
                <span>تقدم المشاهدة</span>
                <span>{watchProgress}%</span>
              </div>
              <ProgressBar value={watchProgress} className="h-1.5" />
            </div>
          )}
          {watchProgress >= VIDEO_WATCH_THRESHOLD && (
            <p className="text-xs font-medium text-brand">✓ تمت مشاهدة الفيديو</p>
          )}
          <Link
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted transition hover:text-brand"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            مشاهدة على يوتيوب
          </Link>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="aspect-video overflow-hidden rounded-2xl bg-black shadow-lg">
          <video
            src={url}
            controls
            className="h-full w-full"
            title={title}
            onTimeUpdate={(e) => {
              const video = e.currentTarget;
              if (!video.duration) return;
              reportProgress((video.currentTime / video.duration) * 100);
            }}
            onEnded={() => reportProgress(100)}
          />
        </div>
        {watchProgress > 0 && watchProgress < VIDEO_WATCH_THRESHOLD && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted">
              <span>تقدم المشاهدة</span>
              <span>{watchProgress}%</span>
            </div>
            <ProgressBar value={watchProgress} className="h-1.5" />
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className="flex aspect-video items-center justify-center bg-brand/5">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-brand text-white shadow-lg">
          <Play className="h-7 w-7" />
        </div>
        <p className="text-sm text-muted">لا يوجد فيديو لهذا الدرس</p>
      </div>
    </Card>
  );
}
