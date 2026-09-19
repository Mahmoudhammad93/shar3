"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isValidPhoneNumber } from "libphonenumber-js";
import type { Value } from "react-phone-number-input";
import { AuthLayout, AuthLinks } from "@/components/layout/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { PhoneField } from "@/components/ui/phone-field";
import { DatePickerField } from "@/components/ui/date-picker-field";
import { FormField, FormSection } from "@/components/ui/form-field";
import { NativeSelect } from "@/components/ui/native-select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useAuth } from "@/components/providers/auth-provider";
import { authApi, clearToken, type RegisterPayload } from "@/lib/auth";
import { getCountryOptions } from "@/lib/countries";
import { getStudentDashboardPath } from "@/lib/student-auth";

export default function RegisterPage() {
  const router = useRouter();
  const { isLoggedIn, loading: authLoading, refreshUser, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState<Value>();
  const [whatsapp, setWhatsapp] = useState<Value>();
  const [nationality, setNationality] = useState<string>();
  const [country, setCountry] = useState<string>();
  const [birthDate, setBirthDate] = useState("");

  const countryOptions = useMemo(
    () => getCountryOptions().map(({ value, label }) => ({ value, label })),
    [],
  );

  useEffect(() => {
    if (!authLoading && isLoggedIn) {
      router.replace(getStudentDashboardPath(user));
    }
  }, [authLoading, isLoggedIn, user, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);

    if (form.get("password") !== form.get("password_confirmation")) {
      setError("كلمتا المرور غير متطابقتين");
      setLoading(false);
      return;
    }

    if (phone && !isValidPhoneNumber(phone)) {
      setError("رقم الجوال غير صالح. تأكد من اختيار كود الدولة وإدخال الرقم بشكل صحيح.");
      setLoading(false);
      return;
    }

    if (whatsapp && !isValidPhoneNumber(whatsapp)) {
      setError("رقم الواتساب غير صالح. تأكد من اختيار كود الدولة وإدخال الرقم بشكل صحيح.");
      setLoading(false);
      return;
    }

    const worksFullTime = form.get("works_full_time") as string;
    const participatesOther = form.get("participates_other_programs") as string;

    const payload: RegisterPayload = {
      first_name: (form.get("first_name") as string).trim(),
      last_name: (form.get("last_name") as string).trim(),
      email: (form.get("email") as string).trim(),
      phone: phone || undefined,
      whatsapp: whatsapp || undefined,
      password: form.get("password") as string,
      password_confirmation: form.get("password_confirmation") as string,
      gender: (form.get("gender") as "male" | "female") || undefined,
      birth_date: birthDate || undefined,
      nationality: nationality || undefined,
      country: country || undefined,
      education_level: (form.get("education_level") as string) || undefined,
      heard_about: (form.get("heard_about") as string) || undefined,
      works_full_time:
        worksFullTime === "yes" ? true : worksFullTime === "no" ? false : undefined,
      participates_other_programs:
        participatesOther === "yes" ? true : participatesOther === "no" ? false : undefined,
      daily_hours: (form.get("daily_hours") as string) || undefined,
      accept_terms: form.get("accept_terms") === "on",
    };

    try {
      clearToken();
      const res = await authApi.register(payload);
      await refreshUser();
      router.push(getStudentDashboardPath(res.user));
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر إنشاء الحساب.");
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || isLoggedIn) {
    return null;
  }

  return (
    <AuthLayout title="إنشاء حساب" subtitle="انضم إلى معهد إعداد دعاة التوحيد والسنة">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input name="first_name" required placeholder="الاسم الأول" autoComplete="given-name" />
          <Input name="last_name" required placeholder="الاسم الأخير" autoComplete="family-name" />
        </div>

        <Input
          name="email"
          type="email"
          required
          placeholder="البريد الإلكتروني"
          autoComplete="email"
          inputMode="email"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <PhoneField
            name="phone"
            label="رقم الجوال"
            value={phone}
            onChange={setPhone}
            placeholder="1012345678"
          />
          <PhoneField
            name="whatsapp"
            label="رقم الواتساب"
            value={whatsapp}
            onChange={setWhatsapp}
            placeholder="1012345678"
          />
        </div>

        <PasswordInput name="password" required placeholder="كلمة المرور" autoComplete="new-password" />
        <PasswordInput
          name="password_confirmation"
          required
          placeholder="تأكيد كلمة المرور"
          autoComplete="new-password"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="النوع">
            <NativeSelect
              name="gender"
              options={[
                { value: "", label: "اختر النوع", disabled: true },
                { value: "male", label: "ذكر" },
                { value: "female", label: "أنثى" },
              ]}
            />
          </FormField>
          <SearchableSelect
            name="nationality"
            label="الجنسية"
            options={countryOptions}
            value={nationality}
            onChange={setNationality}
            placeholder="ابحث واختر الجنسية"
          />
        </div>

        <DatePickerField
          name="birth_date"
          label="تاريخ الميلاد"
          value={birthDate}
          onChange={setBirthDate}
          placeholder="اختر تاريخ الميلاد"
          min="1940-01-01"
        />

        <FormSection title="البيانات التعليمية والإقامة">
          <div className="grid gap-4 sm:grid-cols-2">
            <SearchableSelect
              name="country"
              label="بلد الإقامة"
              options={countryOptions}
              value={country}
              onChange={setCountry}
              placeholder="ابحث واختر بلد الإقامة"
            />
            <FormField label="المستوى التعليمي">
              <NativeSelect
                name="education_level"
                options={[
                  { value: "", label: "اختر المستوى التعليمي", disabled: true },
                  { value: "primary", label: "ابتدائي" },
                  { value: "preparatory", label: "إعدادي" },
                  { value: "secondary", label: "ثانوي" },
                  { value: "diploma", label: "معهد / diploma" },
                  { value: "bachelor", label: "جامعي" },
                  { value: "master", label: "ماجستير" },
                  { value: "phd", label: "دكتوراه" },
                  { value: "other", label: "أخرى" },
                ]}
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="أسئلة التسجيل">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="كيف سمعت عن المعهد؟">
              <NativeSelect
                name="heard_about"
                options={[
                  { value: "", label: "اختر الإجابة", disabled: true },
                  { value: "friend", label: "صديق" },
                  { value: "social", label: "وسائل التواصل" },
                  { value: "search", label: "محرك بحث" },
                  { value: "teacher", label: "أحد المشايخ" },
                  { value: "other", label: "أخرى" },
                ]}
              />
            </FormField>
            <FormField label="الساعات اليومية للدراسة">
              <NativeSelect
                name="daily_hours"
                options={[
                  { value: "", label: "اختر عدد الساعات", disabled: true },
                  { value: "1-2", label: "1-2 ساعة" },
                  { value: "2-4", label: "2-4 ساعات" },
                  { value: "4-6", label: "4-6 ساعات" },
                  { value: "6+", label: "أكثر من 6 ساعات" },
                ]}
              />
            </FormField>
            <FormField label="هل تعمل بدوام كامل؟">
              <NativeSelect
                name="works_full_time"
                options={[
                  { value: "", label: "اختر الإجابة", disabled: true },
                  { value: "yes", label: "نعم" },
                  { value: "no", label: "لا" },
                ]}
              />
            </FormField>
            <FormField label="هل تشارك في برامج أخرى؟">
              <NativeSelect
                name="participates_other_programs"
                options={[
                  { value: "", label: "اختر الإجابة", disabled: true },
                  { value: "yes", label: "نعم" },
                  { value: "no", label: "لا" },
                ]}
              />
            </FormField>
          </div>
        </FormSection>

        <label className="flex items-start gap-3 text-sm text-muted">
          <input type="checkbox" name="accept_terms" required className="mt-1 accent-brand" />
          <span>
            أوافق على{" "}
            <Link href="/about" className="text-brand hover:underline">
              سياسة الخصوصية
            </Link>{" "}
            والشروط والأحكام
          </span>
        </label>

        {error && <p className="rounded-form bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "جاري التسجيل..." : "إنشاء حساب"}
        </Button>
      </form>
      <AuthLinks />
      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/volunteer" className="font-semibold text-brand hover:underline">
          التطوع بفريق العمل
        </Link>
      </p>
      <p className="mt-4 text-center text-xs text-muted">
        <Link href="/">← العودة للموقع</Link>
      </p>
    </AuthLayout>
  );
}
