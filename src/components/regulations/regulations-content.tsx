"use client";

import { useEffect, useState } from "react";
import { Scale } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";

function RegulationsBody({ html }: { html: string }) {
  const hasHtmlTags = /<[^>]+>/.test(html);

  if (hasHtmlTags) {
    return (
      <div
        className="regulations-content space-y-4 leading-8 text-muted [&_blockquote]:border-s-4 [&_blockquote]:border-gold/40 [&_blockquote]:ps-4 [&_blockquote]:italic [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-brand-dark [&_h2:first-child]:mt-0 [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-brand-dark [&_img]:my-4 [&_img]:max-w-full [&_img]:rounded-xl [&_li]:mb-2 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pe-6 [&_p]:leading-8 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pe-6"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div className="space-y-4 leading-8 text-muted">
      {html.split("\n\n").filter(Boolean).map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}

export function RegulationsContent() {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    api
      .getSettingsLive()
      .then(({ data }) => {
        if (active) setContent(data.regulations_ar ?? null);
      })
      .catch(() => {
        if (active) setContent(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <Container className="py-16">
        <div className="mx-auto max-w-4xl space-y-4">
          <div className="h-12 animate-pulse rounded-xl bg-brand/10" />
          <div className="h-80 animate-pulse rounded-2xl bg-brand/10" />
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-4xl">
        <Card className="overflow-hidden">
          <div className="border-b border-border bg-brand/5 px-6 py-4 md:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-brand-dark">أحكام وضوابط المعهد</h2>
                <p className="text-sm text-muted">الالتزام باللائحة شرط للاستمرار في الدراسة</p>
              </div>
            </div>
          </div>
          <CardContent className="p-6 md:p-8">
            {content ? (
              <RegulationsBody html={content} />
            ) : (
              <p className="text-center text-muted">
                لم تُنشر اللائحة التنظيمية بعد. يمكن للإدارة إضافتها من صفحة اللائحة التنظيمية في لوحة التحكم.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
