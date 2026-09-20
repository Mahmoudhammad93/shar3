import type {
  LessonMediaItem,
  LessonMediaType,
  LessonWithMedia,
} from "@/types/lesson-media";

function compareMedia(a: LessonMediaItem, b: LessonMediaItem): number {
  const sortDiff = (a.sort_order ?? 0) - (b.sort_order ?? 0);
  if (sortDiff !== 0) return sortDiff;

  const aId = a.id ?? Number.MAX_SAFE_INTEGER;
  const bId = b.id ?? Number.MAX_SAFE_INTEGER;
  return aId - bId;
}

/**
 * Resolve authoritative media list.
 *
 * - media === undefined → legacy compatibility: synthesize from video_url / legacy bunny / audio
 * - media === [] → authoritative: no media
 * - media present → use as-is (backend already synthesizes legacy when needed)
 */
export function resolveLessonMediaItems(lesson: LessonWithMedia): LessonMediaItem[] {
  if (Array.isArray(lesson.media)) {
    return [...lesson.media].sort(compareMedia);
  }

  const items: LessonMediaItem[] = [];

  if (lesson.bunny?.video_id || lesson.bunny?.embed_url) {
    items.push({
      id: null,
      type: "video",
      provider: "bunny",
      sort_order: 0,
      is_primary: true,
      url: lesson.video_url ?? null,
      synthetic: true,
      bunny: lesson.bunny,
    });
  } else if (lesson.video_url) {
    items.push({
      id: null,
      type: "video",
      provider: "legacy",
      sort_order: 0,
      is_primary: true,
      url: lesson.video_url,
      synthetic: true,
    });
  }

  if (lesson.audio?.url || lesson.media_type === "audio") {
    items.push({
      id: null,
      type: "audio",
      provider: "google_drive",
      sort_order: items.length,
      is_primary: true,
      url: null,
      synthetic: true,
      audio: lesson.audio ?? undefined,
    });
  }

  return items;
}

export function mediaOfType(
  items: LessonMediaItem[],
  type: LessonMediaType
): LessonMediaItem[] {
  return items.filter((item) => item.type === type).sort(compareMedia);
}

/**
 * MVP: one effective primary video/audio.
 * Prefer is_primary=true, else lowest sort_order / stable id.
 */
export function selectPrimaryMedia(
  items: LessonMediaItem[],
  type: LessonMediaType
): LessonMediaItem | null {
  const ofType = mediaOfType(items, type);
  if (ofType.length === 0) return null;

  const primaries = ofType.filter((item) => item.is_primary);
  if (primaries.length > 0) {
    return primaries.sort(compareMedia)[0] ?? null;
  }

  return ofType[0] ?? null;
}

export function resolveVideoPlaybackUrl(item: LessonMediaItem | null): string | null {
  if (!item || item.type !== "video") return null;

  const status = item.bunny?.status ?? null;
  if (item.provider === "bunny" || item.bunny) {
    if (status && status !== "ready") {
      return null;
    }
    if (item.bunny?.embed_url) {
      return item.bunny.embed_url;
    }
    if (item.bunny?.player_url) {
      return item.bunny.player_url;
    }
  }

  if (item.url) return item.url;
  return null;
}

export function bunnyStatusMessage(status?: string | null): string | null {
  switch (status) {
    case "created":
    case "processing":
      return "الفيديو قيد المعالجة. يمكنك متابعة المحتوى والأسئلة في الوقت الحالي.";
    case "failed":
      return "تعذّر تجهيز الفيديو حالياً. المحتوى والأسئلة متاحة.";
    default:
      return null;
  }
}

export function resolveAudioStreamUrl(
  item: LessonMediaItem | null,
  lesson?: LessonWithMedia
): string | null {
  if (item?.type === "audio" && item.audio?.url) {
    return item.audio.url;
  }
  if (lesson?.audio?.url) {
    return lesson.audio.url;
  }
  return null;
}

export function isSafeHttpUrl(value: string | null | undefined): boolean {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function fileAttachmentHref(item: LessonMediaItem): string | null {
  if (item.type !== "file") return null;

  if (item.download_url && item.id != null && Number.isFinite(item.id) && item.id > 0) {
    return item.download_url;
  }

  if (item.external_url && isSafeHttpUrl(item.external_url)) {
    return item.external_url;
  }

  if (item.url && isSafeHttpUrl(item.url) && item.provider === "external_url") {
    return item.url;
  }

  return null;
}

export function formatFileSize(bytes?: number | null): string | null {
  if (bytes == null || !Number.isFinite(bytes) || bytes < 0) return null;
  if (bytes < 1024) return `${bytes} بايت`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} ك.ب`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} م.ب`;
}

export function fileDisplayTitle(item: LessonMediaItem, index: number): string {
  const title = item.title_ar?.trim() || item.title_en?.trim();
  if (title) return title;
  if (item.mime_type) return `مرفق ${index + 1}`;
  return `مرفق ${index + 1}`;
}

export function lessonHasEffectiveVideo(lesson: LessonWithMedia): boolean {
  const items = resolveLessonMediaItems(lesson);
  const primary = selectPrimaryMedia(items, "video");
  return resolveVideoPlaybackUrl(primary) != null;
}
