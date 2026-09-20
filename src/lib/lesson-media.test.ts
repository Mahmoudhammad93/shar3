import { describe, expect, it } from "vitest";
import {
  bunnyStatusMessage,
  fileAttachmentHref,
  isSafeHttpUrl,
  lessonHasEffectiveVideo,
  mediaOfType,
  resolveAudioStreamUrl,
  resolveLessonMediaItems,
  resolveVideoPlaybackUrl,
  selectPrimaryMedia,
} from "@/lib/lesson-media";
import type { LessonMediaItem, LessonWithMedia } from "@/types/lesson-media";

function baseLesson(overrides: Partial<LessonWithMedia> = {}): LessonWithMedia {
  return {
    id: 1,
    title_ar: "درس تجريبي",
    ...overrides,
  };
}

function media(partial: Partial<LessonMediaItem> & Pick<LessonMediaItem, "type" | "provider">): LessonMediaItem {
  return {
    id: partial.id ?? null,
    type: partial.type,
    provider: partial.provider,
    sort_order: partial.sort_order ?? 0,
    is_primary: partial.is_primary ?? false,
    title_ar: partial.title_ar ?? null,
    url: partial.url ?? null,
    synthetic: partial.synthetic,
    bunny: partial.bunny,
    audio: partial.audio,
    download_url: partial.download_url,
    external_url: partial.external_url,
    mime_type: partial.mime_type,
    file_size: partial.file_size,
  };
}

describe("resolveLessonMediaItems", () => {
  it("treats media=[] as authoritative empty (text only)", () => {
    const items = resolveLessonMediaItems(
      baseLesson({ media: [], video_url: "https://example.com/v.mp4" })
    );
    expect(items).toEqual([]);
    expect(lessonHasEffectiveVideo(baseLesson({ media: [], video_url: "https://example.com/v.mp4" }))).toBe(
      false
    );
  });

  it("falls back to video_url only when media is undefined", () => {
    const items = resolveLessonMediaItems(
      baseLesson({ video_url: "https://www.youtube.com/watch?v=3a7a55bEFho" })
    );
    expect(items).toHaveLength(1);
    expect(items[0]?.provider).toBe("legacy");
    expect(items[0]?.id).toBeNull();
  });

  it("uses synthetic media[] legacy video with id=null", () => {
    const items = resolveLessonMediaItems(
      baseLesson({
        video_url: "https://www.youtube.com/watch?v=3a7a55bEFho",
        media: [
          media({
            id: null,
            type: "video",
            provider: "legacy",
            is_primary: true,
            url: "https://www.youtube.com/watch?v=3a7a55bEFho",
            synthetic: true,
          }),
        ],
      })
    );
    expect(items).toHaveLength(1);
    expect(resolveVideoPlaybackUrl(items[0]!)).toContain("youtube");
  });
});

describe("primary selection", () => {
  it("selects is_primary video over others", () => {
    const items = [
      media({ id: 1, type: "video", provider: "bunny", sort_order: 0, is_primary: false, url: "a" }),
      media({ id: 2, type: "video", provider: "bunny", sort_order: 1, is_primary: true, url: "b" }),
    ];
    expect(selectPrimaryMedia(items, "video")?.id).toBe(2);
  });

  it("falls back to lowest sort_order when no primary", () => {
    const items = [
      media({ id: 10, type: "audio", provider: "google_drive", sort_order: 5, is_primary: false }),
      media({ id: 11, type: "audio", provider: "google_drive", sort_order: 1, is_primary: false }),
    ];
    expect(selectPrimaryMedia(items, "audio")?.id).toBe(11);
  });

  it("keeps all files ordered", () => {
    const items = [
      media({ id: 3, type: "file", provider: "external_url", sort_order: 2, external_url: "https://a.example/f2" }),
      media({ id: 1, type: "file", provider: "external_url", sort_order: 0, external_url: "https://a.example/f0" }),
      media({ id: 2, type: "file", provider: "google_drive", sort_order: 1, download_url: "https://api/x/1" }),
    ];
    expect(mediaOfType(items, "file").map((f) => f.id)).toEqual([1, 2, 3]);
  });
});

describe("combinations", () => {
  it("supports video + audio + files together", () => {
    const lesson = baseLesson({
      media: [
        media({
          id: 1,
          type: "video",
          provider: "bunny",
          is_primary: true,
          bunny: { status: "ready", embed_url: "https://iframe.mediadelivery.net/embed/1/abc" },
        }),
        media({
          id: 2,
          type: "audio",
          provider: "google_drive",
          is_primary: true,
          audio: { url: "https://api.example/student/lessons/1/audio" },
        }),
        media({
          id: 3,
          type: "file",
          provider: "external_url",
          external_url: "https://files.example/notes.pdf",
        }),
        media({
          id: 4,
          type: "file",
          provider: "google_drive",
          download_url: "https://api.example/student/lessons/1/media/4/download",
        }),
      ],
    });
    const items = resolveLessonMediaItems(lesson);
    expect(selectPrimaryMedia(items, "video")).toBeTruthy();
    expect(resolveAudioStreamUrl(selectPrimaryMedia(items, "audio"))).toContain("/audio");
    expect(mediaOfType(items, "file")).toHaveLength(2);
    expect(lessonHasEffectiveVideo(lesson)).toBe(true);
  });
});

describe("bunny states", () => {
  it("hides playback while processing and exposes message", () => {
    const item = media({
      type: "video",
      provider: "bunny",
      is_primary: true,
      bunny: { status: "processing", embed_url: "https://iframe.mediadelivery.net/embed/1/abc" },
    });
    expect(resolveVideoPlaybackUrl(item)).toBeNull();
    expect(bunnyStatusMessage("processing")).toBeTruthy();
    expect(bunnyStatusMessage("failed")).toBeTruthy();
  });

  it("uses embed_url when ready", () => {
    const item = media({
      type: "video",
      provider: "bunny",
      is_primary: true,
      bunny: { status: "ready", embed_url: "https://iframe.mediadelivery.net/embed/1/abc" },
    });
    expect(resolveVideoPlaybackUrl(item)).toBe("https://iframe.mediadelivery.net/embed/1/abc");
  });
});

describe("files security", () => {
  it("rejects unsafe schemes", () => {
    expect(isSafeHttpUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeHttpUrl("data:text/html,hi")).toBe(false);
    expect(isSafeHttpUrl("file:///etc/passwd")).toBe(false);
    expect(isSafeHttpUrl("https://example.com/a.pdf")).toBe(true);
  });

  it("never builds download for missing id", () => {
    expect(
      fileAttachmentHref(
        media({
          id: null,
          type: "file",
          provider: "google_drive",
          download_url: "https://api.example/student/lessons/1/media/null/download",
        })
      )
    ).toBeNull();
  });

  it("allows authenticated download when id is valid", () => {
    expect(
      fileAttachmentHref(
        media({
          id: 9,
          type: "file",
          provider: "google_drive",
          download_url: "https://api.example/student/lessons/1/media/9/download",
        })
      )
    ).toContain("/media/9/download");
  });
});

describe("subject fixtures (contract)", () => {
  it("supports course=null with lessons", () => {
    const payload = {
      subject: { id: 1, name_ar: "عقيدة", slug: "aqidah" },
      course: null as null,
      progress: 40,
      lessons: [
        baseLesson({
          id: 100,
          media: [
            media({
              id: null,
              type: "video",
              provider: "legacy",
              is_primary: true,
              url: "https://www.youtube.com/watch?v=abc",
              synthetic: true,
            }),
          ],
        }),
      ],
    };
    expect(payload.course).toBeNull();
    expect(payload.lessons).toHaveLength(1);
    expect(lessonHasEffectiveVideo(payload.lessons[0]!)).toBe(true);
  });

  it("supports course=null with empty lessons", () => {
    const payload = {
      subject: { id: 2, name_ar: "فقه", slug: "fiqh" },
      course: null as null,
      progress: 0,
      lessons: [] as LessonWithMedia[],
    };
    expect(payload.lessons).toHaveLength(0);
    expect(payload.progress).toBe(0);
  });
});
