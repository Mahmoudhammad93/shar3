import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "إنشاء حساب",
  description: "أنشئ حساباً في معهد إعداد دعاة التوحيد والسنة وانضم إلى برامجنا ودوراتنا في العلوم الشرعية على منهج أهل السنة والجماعة.",
  path: "/register/",
  noIndex: true,
});

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
