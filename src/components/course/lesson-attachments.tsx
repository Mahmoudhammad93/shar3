"use client";

import { useState } from "react";
import { Download, ExternalLink, FileText, Paperclip } from "lucide-react";
import { downloadAuthenticatedFile } from "@/lib/auth";
import {
  fileAttachmentHref,
  fileDisplayTitle,
  formatFileSize,
  isSafeHttpUrl,
  mediaOfType,
} from "@/lib/lesson-media";
import type { LessonMediaItem } from "@/types/lesson-media";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function LessonAttachments({ items }: { items: LessonMediaItem[] }) {
  const files = mediaOfType(items, "file").filter((item) => {
    const href = fileAttachmentHref(item);
    return href != null;
  });

  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (files.length === 0) return null;

  async function handleAuthenticatedDownload(item: LessonMediaItem) {
    if (item.id == null || !item.download_url) return;
    setBusyId(item.id);
    setError(null);
    try {
      await downloadAuthenticatedFile(
        item.download_url,
        fileDisplayTitle(item, 0)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذّر تحميل الملف");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-5 md:p-6">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <Paperclip className="h-4 w-4" aria-hidden />
          </span>
          <h4 className="font-bold text-brand-dark">المرفقات</h4>
        </div>

        {error && (
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <ul className="space-y-2">
          {files.map((item, index) => {
            const href = fileAttachmentHref(item);
            if (!href) return null;

            const title = fileDisplayTitle(item, index);
            const size = formatFileSize(item.file_size);
            const isAuthDownload =
              !!item.download_url && item.id != null && item.id > 0;
            const isExternal =
              !isAuthDownload && isSafeHttpUrl(item.external_url ?? item.url);

            return (
              <li
                key={item.id ?? `file-${index}-${item.sort_order}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3"
              >
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold text-brand-dark">{title}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {[item.mime_type, size].filter(Boolean).join(" · ") || "ملف مرفق"}
                    </p>
                  </div>
                </div>

                {isAuthDownload ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={busyId === item.id}
                    onClick={() => handleAuthenticatedDownload(item)}
                    aria-label={`تحميل الملف: ${title}`}
                  >
                    <Download className="me-1.5 h-3.5 w-3.5" aria-hidden />
                    {busyId === item.id ? "جاري التحميل..." : "تحميل الملف"}
                  </Button>
                ) : isExternal ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-medium text-brand transition hover:border-brand/40 hover:bg-brand/5"
                    aria-label={`فتح الملف: ${title}`}
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    فتح الملف
                  </a>
                ) : null}
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
