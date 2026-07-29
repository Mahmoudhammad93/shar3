import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import {
  getAnnouncementSlugs,
  getCourseSlugs,
  getProgramSlugs,
  getTeacherSlugs,
} from "@/lib/static-params";

export const dynamic = "force-static";

const STATIC_ROUTES = [
  "",
  "about/",
  "courses/",
  "programs/",
  "teachers/",
  "news/",
  "contact/",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}/${route}`,
    lastModified: now,
    changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
    priority: route === "" ? 1 : 0.8,
  }));

  const [courseSlugs, programSlugs, teacherSlugs, newsSlugs] = await Promise.all([
    getCourseSlugs(),
    getProgramSlugs(),
    getTeacherSlugs(),
    getAnnouncementSlugs(),
  ]);

  const dynamicEntries: MetadataRoute.Sitemap = [
    ...courseSlugs.map((slug) => ({
      url: `${SITE_URL}/courses/${slug}/`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...programSlugs.map((slug) => ({
      url: `${SITE_URL}/programs/${slug}/`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...teacherSlugs.map((slug) => ({
      url: `${SITE_URL}/teachers/${slug}/`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...newsSlugs.map((slug) => ({
      url: `${SITE_URL}/news/${slug}/`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];

  return [...staticEntries, ...dynamicEntries];
}
