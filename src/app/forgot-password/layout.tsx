import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "استعادة كلمة المرور",
  description: "استعد كلمة مرور حسابك في بوابة طلاب معهد علم شرعي.",
  path: "/forgot-password/",
  noIndex: true,
});

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
