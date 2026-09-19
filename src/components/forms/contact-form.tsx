"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setLoading(true);
    setError("");
    setSuccess("");

    const form = new FormData(formEl);
    const res = await api.postContact({
      name: form.get("name") as string,
      email: form.get("email") as string,
      phone: (form.get("phone") as string) || undefined,
      subject: (form.get("subject") as string) || undefined,
      message: form.get("message") as string,
    });

    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      setSuccess(data.message);
      formEl.reset();
    } else {
      setError("حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.");
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input name="name" required placeholder="الاسم الكامل" />
            <Input name="email" type="email" required placeholder="البريد الإلكتروني" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input name="phone" placeholder="رقم الجوال" />
            <Input name="subject" placeholder="الموضوع" />
          </div>
          <Textarea name="message" required rows={5} placeholder="رسالتك..." />
          {success && <p className="rounded-xl bg-brand/10 p-3 text-sm text-brand">{success}</p>}
          {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "جاري الإرسال..." : "إرسال الرسالة"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
