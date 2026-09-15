import { fetchApi, fetchApiLive } from "@/lib/fetch-api";
import { getApiUrl } from "@/lib/api-url";

export const api = {
  getHome: () => fetchApi<{ settings: import("@/types").SiteSettings } & Omit<import("@/types").HomeData, "settings"> & { settings: import("@/types").SiteSettings }>("/home"),
  getHomeStatsLive: () =>
    fetchApiLive<{ stats: import("@/types").HomeData["stats"] }>("/home").then((res) => res.stats),
  getFeaturedCoursesLive: () =>
    fetchApiLive<{
      featured_courses: import("@/types").Course[];
      homepage_featured_courses_visible: boolean;
    }>("/home").then((res) => ({
      visible: res.homepage_featured_courses_visible,
      courses: res.featured_courses,
    })),
  getFeaturedTeachersLive: () =>
    fetchApiLive<{ teachers: import("@/types").Teacher[] }>("/home").then((res) => res.teachers),
  getSettings: () => fetchApi<{ data: import("@/types").SiteSettings }>("/settings"),
  getSettingsLive: () => fetchApiLive<{ data: import("@/types").SiteSettings }>("/settings"),
  getCourses: (params?: { search?: string; category?: string; program?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.category) query.set("category", params.category);
    if (params?.program) query.set("program", params.program);
    const qs = query.toString();
    return fetchApi<{ data: import("@/types").Course[]; meta: import("@/types").PaginatedMeta }>(`/courses${qs ? `?${qs}` : ""}`);
  },
  getCoursesLive: (params?: { search?: string; category?: string; program?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.category) query.set("category", params.category);
    if (params?.program) query.set("program", params.program);
    const qs = query.toString();
    return fetchApiLive<{ data: import("@/types").Course[]; meta: import("@/types").PaginatedMeta }>(
      `/courses${qs ? `?${qs}` : ""}`,
    );
  },
  getCourse: (slug: string) => fetchApi<{ data: import("@/types").Course }>(`/courses/${slug}`),
  getPrograms: () => fetchApi<{ data: import("@/types").Program[] }>("/programs"),
  getProgramsLive: () => fetchApiLive<{ data: import("@/types").Program[] }>("/programs"),
  getProgram: (slug: string) => fetchApi<{ data: import("@/types").Program }>(`/programs/${slug}`),
  getProgramLive: (slug: string) => fetchApiLive<{ data: import("@/types").Program }>(`/programs/${slug}`),
  getTeachers: () => fetchApi<{ data: import("@/types").Teacher[] }>("/teachers"),
  getTeachersLive: () => fetchApiLive<{ data: import("@/types").Teacher[] }>("/teachers"),
  getTeacher: (slug: string) => fetchApi<{ data: import("@/types").Teacher }>(`/teachers/${slug}`),
  getTeacherLive: (slug: string) => fetchApiLive<{ data: import("@/types").Teacher }>(`/teachers/${slug}`),
  getAnnouncements: () => fetchApi<{ data: import("@/types").Announcement[]; meta: import("@/types").PaginatedMeta }>("/announcements"),
  getAnnouncement: (slug: string) => fetchApi<{ data: import("@/types").Announcement }>(`/announcements/${slug}`),
  getFaqs: () => fetchApi<{ data: import("@/types").Faq[] }>("/faqs"),
  getAcademicStructure: () => fetchApi<{ data: import("@/types").AcademicLevel[] }>("/academic/structure"),
  getAcademicStructureLive: () => fetchApiLive<{ data: import("@/types").AcademicLevel[] }>("/academic/structure"),
  postContact: (data: { name: string; email: string; phone?: string; subject?: string; message: string }) =>
    fetch(`${getApiUrl()}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    }),
  postEnrollment: (data: { name: string; email: string; phone?: string; course_id: number; notes?: string }) =>
    fetch(`${getApiUrl()}/enrollments`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    }),
};
