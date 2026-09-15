import { StudentSubjectPage } from "./student-subject-page";

export async function generateStaticParams() {
  return [
    { slug: "y1s1-tawheed" },
    { slug: "y1s1-seerah" },
    { slug: "y1s1-tafsir" },
    { slug: "y1s1-nahw" },
    { slug: "y1s1-usul-fiqh" },
    { slug: "y1s1-fiqh" },
    { slug: "y1s1-mustalah" },
    { slug: "y1s1-memorization" },
  ];
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <StudentSubjectPage slug={slug} />;
}
