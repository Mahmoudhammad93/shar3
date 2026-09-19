import { fetchApiSafe } from "@/lib/fetch-api";

export async function getCourseSlugs(): Promise<string[]> {
  const res = await fetchApiSafe<{ data: { slug: string }[] }>("/courses");
  return res?.data?.map((course) => course.slug) ?? [];
}

export async function getCourseIds(): Promise<string[]> {
  const res = await fetchApiSafe<{ data: { id: number }[] }>("/courses");
  return res?.data?.map((course) => String(course.id)) ?? [];
}

export async function getProgramSlugs(): Promise<string[]> {
  const res = await fetchApiSafe<{ data: { slug: string }[] }>("/programs");
  return res?.data?.map((program) => program.slug) ?? [];
}

export async function getTeacherSlugs(): Promise<string[]> {
  const res = await fetchApiSafe<{ data: { slug: string }[] }>("/teachers");
  return res?.data?.map((teacher) => teacher.slug) ?? [];
}

export async function getAnnouncementSlugs(): Promise<string[]> {
  const res = await fetchApiSafe<{ data: { slug: string }[] }>("/announcements");
  return res?.data?.map((announcement) => announcement.slug) ?? [];
}
