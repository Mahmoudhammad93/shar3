import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://shar3.chiefcoder.net";

export const SITE = {
  name: "معهد علم شرعي",
  nameEn: "Share3a Institute of Islamic Sciences",
  tagline: "تعليم العلوم الشرعية على منهج أهل السنة والجماعة",
  description:
    "معهد علم شرعي — مؤسسة تعليمية إسلامية متخصصة في تعليم العلوم الشرعية: القرآن الكريم، التفسير، الفقه، الحديث، والعقيدة على منهج أهل السنة والجماعة. نقدم برامج علمية متدرجة، دورات شرعية، وحلقات علمية للطلاب والباحثين عن العلم الشرعي.",
  keywords: [
    "معهد علم شرعي",
    "علوم شرعية",
    "تعليم إسلامي",
    "دورات شرعية",
    "القرآن الكريم",
    "التفسير",
    "الفقه",
    "الحديث",
    "العقيدة",
    "أهل السنة والجماعة",
    "برامج علمية إسلامية",
    "تعليم عن بعد",
    "معهد إسلامي",
    "طلب العلم الشرعي",
  ],
  locale: "ar_SA",
} as const;

export const ABOUT_DEFAULT =
  "معهد علم شرعي مؤسسة تعليمية إسلامية تُعنى بتيسير طلب العلم الشرعي على منهج أهل السنة والجماعة، من خلال برامج علمية منظمة في التفسير والفقه والحديث والعقيدة، يقدّمها نخبة من أهل العلم والاختصاص، مع متابعة أكاديمية للطلاب عبر منصة تعليمية حديثة.";

export const VISION_DEFAULT =
  "أن نكون مرجعاً موثوقاً في تعليم العلوم الشرعية، نُخرّج طلاب علم راسخين في منهج أهل السنة والجماعة، ينفعون أنفسهم وأمتهم بالعلم النافع والعمل الصالح.";

export const MISSION_DEFAULT =
  "تقديم تعليم شرعي متدرج ومنهجي يجمع بين الأصالة العلمية والتقنية الحديثة، ويربط الطالب بالقرآن والسنة على فهم السلف الصالح، مع تهيئة بيئة تعليمية محفّزة على حفظ العلم والالتزام والإخلاص.";

export const INSTITUTE_INTRO =
  "نرحّب بكم في معهد علم شرعي، حيث نسعى لتمكين طالب العلم من التأسيس الصحيح في العلوم الشرعية: كتاب الله وتفسيره، والسنة النبوية وعلومها، والفقه الإسلامي، والعقيدة على منهج السلف. برامجنا مصممة لتناسب المبتدئ والمتوسط والمتقدم، مع محتوى عربي أصيل يُحترم فيه للعلماء ويُحافظ فيه على منهج أهل السنة والجماعة.";

function canonicalUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${normalized.endsWith("/") ? normalized : `${normalized}/`}`;
}

export function buildMetadata({
  title,
  description,
  path = "/",
  keywords,
  noIndex = false,
  image,
  type = "website",
}: {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  const pageTitle = title ? `${title} | ${SITE.name}` : SITE.name;
  const pageDescription = description || SITE.description;
  const url = canonicalUrl(path);

  return {
    title: title || SITE.name,
    description: pageDescription,
    keywords: keywords ?? [...SITE.keywords],
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type,
      locale: SITE.locale,
      url,
      siteName: SITE.name,
      title: pageTitle,
      description: pageDescription,
      ...(image ? { images: [{ url: image, alt: title || SITE.name }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SITE.name,
    alternateName: SITE.nameEn,
    url: SITE_URL,
    description: SITE.description,
    inLanguage: "ar",
    areaServed: "SA",
    knowsAbout: [
      "القرآن الكريم",
      "التفسير",
      "الفقه الإسلامي",
      "علوم الحديث",
      "العقيدة الإسلامية",
      "أهل السنة والجماعة",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE_URL,
    description: SITE.description,
    inLanguage: "ar",
    publisher: {
      "@type": "Organization",
      name: SITE.name,
    },
  };
}

export function courseJsonLd(course: {
  title_ar: string;
  description_ar?: string;
  slug: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title_ar,
    description: course.description_ar || SITE.description,
    url: canonicalUrl(`/courses/${course.slug}`),
    provider: {
      "@type": "EducationalOrganization",
      name: SITE.name,
      url: SITE_URL,
    },
    ...(course.image ? { image: course.image } : {}),
    inLanguage: "ar",
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}
