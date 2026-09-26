import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.duaat-altawheed.com";

/** Absolute Open Graph image — override with NEXT_PUBLIC_OG_IMAGE when needed. */
export const DEFAULT_OG_IMAGE =
  process.env.NEXT_PUBLIC_OG_IMAGE || `${SITE_URL}/og-image.jpg`;

export const SITE = {
  name: "معهد إعداد دعاة التوحيد والسنة",
  nameEn: "Institute for Training Preachers of Tawhid and the Sunnah",
  shortName: "دعاة التوحيد",
  tagline: "إعداد علمي .. تأهيل دعوي",
  description:
    "معهد إعداد دعاة التوحيد والسنة — صرح علمي ودعوي يُعنى بتأصيل العقيدة الصحيحة، والدعوة إلى الكتاب والسنة بفهم سلف الأمة، وإعداد الدعاة وتأهيلهم علميًا ودعويًا عبر برامج متدرجة في التفسير والفقه والحديث والعقيدة.",
  keywords: [
    "معهد إعداد دعاة التوحيد والسنة",
    "دعاة التوحيد",
    "معهد دعاة التوحيد",
    "تعليم شرعي عن بعد",
    "إعداد الدعاة",
    "علوم شرعية",
    "دورات شرعية مجانية",
    "القرآن الكريم",
    "التفسير",
    "الفقه",
    "الحديث",
    "العقيدة",
    "التوحيد والسنة",
    "أهل السنة والجماعة",
    "منهج السلف",
    "طلب العلم الشرعي",
    "معهد إسلامي أونلاين",
  ],
  locale: "ar_SA",
  email: "duaat.altawheed@gmail.com",
  phone: "+201007102523",
  addressCountry: "EG",
  social: [
    "https://www.facebook.com/profile.php?id=61591439512746",
    "https://x.com/duaataltawheed",
    "https://www.youtube.com/@duaataltawheed",
    "https://t.me/duaataltawheed",
  ],
} as const;

export const ABOUT_DEFAULT =
  "معهد إعداد دعاة التوحيد والسنة صرح علمي ودعوي يُعنى بتأصيل العقيدة الصحيحة، والدعوة إلى الكتاب والسنة بفهم سلف الأمة، وإعداد الدعاة وتأهيلهم علميًا ودعويًا؛ ليكونوا قادرين على تبليغ دين الله بالحكمة والبصيرة.";

export const VISION_DEFAULT =
  "يهدف المعهد إلى تخريج جيل من الدعاة الواعين وطلاب العلم النابهين، وتأصيل الطلاب علميًا وتأهيلهم ليكونوا من العلماء العاملين، القادرين على فهم الكتاب والسنة، والوقوف على كلام أهل العلم، والدعوة إلى الله تعالى بالحكمة والبصيرة.";

export const MISSION_DEFAULT =
  "تقديم تعليم شرعي متدرج ومنهجي يجمع بين الأصالة العلمية والتقنية الحديثة، ويربط الطالب بالقرآن والسنة على فهم السلف الصالح، مع تهيئة بيئة تعليمية محفّزة على حفظ العلم والالتزام والإخلاص.";

export const INSTITUTE_INTRO = ABOUT_DEFAULT;

function canonicalUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${normalized.endsWith("/") ? normalized : `${normalized}/`}`;
}

function resolveImage(image?: string): string {
  if (!image) return DEFAULT_OG_IMAGE;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `${SITE_URL}${image.startsWith("/") ? image : `/${image}`}`;
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
  const pageTitle = title ? `${title} | ${SITE.name}` : `${SITE.name} | ${SITE.tagline}`;
  const pageDescription = description || SITE.description;
  const url = canonicalUrl(path);
  const ogImage = resolveImage(image);

  return {
    title: title || `${SITE.name} | ${SITE.tagline}`,
    description: pageDescription,
    keywords: keywords ?? [...SITE.keywords],
    authors: [{ name: SITE.name }],
    creator: SITE.name,
    publisher: SITE.name,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      type,
      locale: SITE.locale,
      url,
      siteName: SITE.name,
      title: pageTitle,
      description: pageDescription,
      images: [{ url: ogImage, width: 1254, height: 1254, alt: title || SITE.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [ogImage],
    },
  };
}

export function organizationJsonLd(logo?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE.name,
    alternateName: [SITE.nameEn, SITE.shortName],
    url: SITE_URL,
    logo: resolveImage(logo),
    image: resolveImage(logo),
    description: SITE.description,
    inLanguage: "ar",
    areaServed: {
      "@type": "Country",
      name: "Egypt",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: SITE.addressCountry,
      addressLocality: "مصر",
    },
    email: SITE.email,
    telephone: SITE.phone,
    sameAs: [...SITE.social],
    knowsAbout: [
      "التوحيد والعقيدة",
      "القرآن الكريم",
      "التفسير",
      "الفقه الإسلامي",
      "علوم الحديث",
      "إعداد الدعاة",
      "منهج السلف",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE.name,
    alternateName: SITE.shortName,
    url: SITE_URL,
    description: SITE.description,
    inLanguage: "ar",
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/courses/?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function faqJsonLd(faqs: { question_ar: string; answer_ar: string }[]) {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question_ar,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer_ar,
      },
    })),
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
    ...(course.image ? { image: resolveImage(course.image) } : {}),
    inLanguage: "ar",
    isAccessibleForFree: true,
  };
}

export function programJsonLd(program: {
  name_ar: string;
  description_ar?: string;
  slug: string;
  image?: string;
}) {
  // Academic multi-year tracks — not individual Course offerings.
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    name: program.name_ar,
    description: program.description_ar || SITE.description,
    url: canonicalUrl(`/programs/${program.slug}`),
    provider: {
      "@type": "EducationalOrganization",
      name: SITE.name,
      url: SITE_URL,
    },
    ...(program.image ? { image: resolveImage(program.image) } : {}),
    inLanguage: "ar",
  };
}

export function personJsonLd(person: {
  name_ar: string;
  title_ar?: string;
  bio_ar?: string;
  slug: string;
  photo?: string;
  specializations?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name_ar,
    ...(person.title_ar ? { jobTitle: person.title_ar } : {}),
    ...(person.bio_ar ? { description: person.bio_ar } : {}),
    url: canonicalUrl(`/teachers/${person.slug}`),
    ...(person.photo ? { image: resolveImage(person.photo) } : {}),
    ...(person.specializations ? { knowsAbout: person.specializations } : {}),
    worksFor: {
      "@type": "EducationalOrganization",
      name: SITE.name,
      url: SITE_URL,
    },
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
