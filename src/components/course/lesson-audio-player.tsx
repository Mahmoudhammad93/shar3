"use client";

import { useEffect, useState } from "react";
import { Headphones } from "lucide-react";
import { fetchAuthenticatedBlob } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";

export function LessonAudioPlayer({
  streamUrl,
  title = "الصوت",
}: {
  streamUrl: string;
  title?: string;
}) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let createdUrl: string | null = null;

    fetchAuthenticatedBlob(streamUrl)
      .then((blob) => {
        if (cancelled) return;
        createdUrl = URL.createObjectURL(blob);
        setObjectUrl(createdUrl);
        setStatus("ready");
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setStatus("error");
        setError(err instanceof Error ? err.message : "تعذّر تشغيل الصوت");
      });

    return () => {
      cancelled = true;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [streamUrl]);

  return (
    <Card>
      <CardContent className="space-y-3 p-5 md:p-6">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <Headphones className="h-4 w-4" aria-hidden />
          </span>
          <h4 className="font-bold text-brand-dark">{title}</h4>
        </div>

        {status === "loading" && (
          <p className="text-sm text-muted" role="status">
            جاري تحميل الصوت...
          </p>
        )}

        {status === "error" && (
          <p className="text-sm text-red-700" role="alert">
            {error ?? "تعذّر تشغيل الصوت. يمكنك متابعة بقية الدرس."}
          </p>
        )}

        {status === "ready" && objectUrl && (
          <audio
            controls
            className="w-full"
            preload="metadata"
            src={objectUrl}
            onError={() => {
              setStatus("error");
              setError("المتصفح تعذّر عليه تشغيل هذا الملف الصوتي.");
            }}
          >
            متصفحك لا يدعم تشغيل الصوت.
          </audio>
        )}
      </CardContent>
    </Card>
  );
}
