import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.shortName,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#eef1f5",
    theme_color: "#08254b",
    lang: "ar",
    dir: "rtl",
    icons: [
      {
        src: "/favicon.svg",
        type: "image/svg+xml",
        sizes: "any",
      },
      {
        src: "/og-image.jpg",
        type: "image/jpeg",
        sizes: "1254x1254",
        purpose: "any",
      },
    ],
  };
}
