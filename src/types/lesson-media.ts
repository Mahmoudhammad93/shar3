/**
 * Lesson multi-media contract matching AC-M03 backend `media[]`.
 * Only fields emitted by the API are typed here.
 */

export type LessonMediaType = "video" | "audio" | "file";

export type LessonMediaProvider =
  | "bunny"
  | "google_drive"
  | "legacy"
  | "external_url"
  | string;

export type BunnyPlaybackStatus =
  | "created"
  | "processing"
  | "ready"
  | "failed"
  | string
  | null;

export interface LessonBunnyPayload {
  library_id?: string | number | null;
  video_id?: string | null;
  status?: BunnyPlaybackStatus;
  embed_url?: string | null;
  player_url?: string | null;
  playback_url?: string | null;
}

export interface LessonAudioPayload {
  url?: string | null;
}

export interface LessonMediaItem {
  id: number | null;
  type: LessonMediaType;
  provider: LessonMediaProvider;
  title_ar?: string | null;
  title_en?: string | null;
  sort_order: number;
  is_primary: boolean;
  url?: string | null;
  mime_type?: string | null;
  file_size?: number | null;
  duration_seconds?: number | null;
  synthetic?: boolean;
  bunny?: LessonBunnyPayload | null;
  audio?: LessonAudioPayload | null;
  download_url?: string | null;
  external_url?: string | null;
}

/** Lesson fields consumed by media normalization / LessonViewer. */
export interface LessonWithMedia {
  id: number;
  title_ar: string;
  content_ar?: string;
  video_url?: string | null;
  media_type?: string | null;
  bunny?: LessonBunnyPayload | null;
  audio?: LessonAudioPayload | null;
  /** When undefined, old API — may fall back to video_url. When [], authoritative empty. */
  media?: LessonMediaItem[];
  duration_minutes?: number;
  sort_order?: number;
  is_completed?: boolean;
  progress_percent?: number;
  is_locked?: boolean;
  has_quiz?: boolean;
  quiz_passed?: boolean;
}
