import { getCourseIds } from "@/lib/static-params";
import { StudentCoursePage } from "./student-course-page";

export async function generateStaticParams() {
  const ids = await getCourseIds();
  return ids.map((id) => ({ id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StudentCoursePage courseId={Number(id)} />;
}
