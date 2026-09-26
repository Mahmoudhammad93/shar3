import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "تسجيل الدخول",
  description: "سجّل دخولك إلى بوابة طلاب معهد إعداد دعاة التوحيد والسنة لمتابعة دوراتك الشرعية وواجباتك الدراسية.",
  path: "/login/",
  noIndex: true,
});

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
