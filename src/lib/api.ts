import { fetchApi } from "@/lib/fetch-api";
import { getApiUrl } from "@/lib/api-url";

export const api = {
  getHome: () => fetchApi<{ settings: import("@/types").SiteSettings } & Omit<import("@/types").HomeData, "settings"> & { settings: import("@/types").SiteSettings }>("/home"),
  getSettings: () => fetchApi<{ data: import("@/types").SiteSettings }>("/settings"),
  getCourses: (params?: { search?: string; category?: string; program?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.category) query.set("category", params.category);
    if (params?.program) query.set("program", params.program);
    const qs = query.toString();
    return fetchApi<{ data: import("@/types").Course[]; meta: import("@/types").PaginatedMeta }>(`/courses${qs ? `?${qs}` : ""}`);
  },
  getCourse: (slug: string) => fetchApi<{ data: import("@/types").Course }>(`/courses/${slug}`),
  getPrograms: () => fetchApi<{ data: import("@/types").Program[] }>("/programs"),
  getProgram: (slug: string) => fetchApi<{ data: import("@/types").Program }>(`/programs/${slug}`),
  getTeachers: () => fetchApi<{ data: import("@/types").Teacher[] }>("/teachers"),
  getTeacher: (slug: string) => fetchApi<{ data: import("@/types").Teacher }>(`/teachers/${slug}`),
  getAnnouncements: () => fetchApi<{ data: import("@/types").Announcement[]; meta: import("@/types").PaginatedMeta }>("/announcements"),
  getAnnouncement: (slug: string) => fetchApi<{ data: import("@/types").Announcement }>(`/announcements/${slug}`),
  getFaqs: () => fetchApi<{ data: import("@/types").Faq[] }>("/faqs"),
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
