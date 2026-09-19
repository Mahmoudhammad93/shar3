export interface NavPageItem {
  href: string;
  label_ar: string;
  label_en?: string | null;
  description_ar?: string | null;
  description_en?: string | null;
  show_in_footer?: boolean;
  is_visible?: boolean;
  sort_order?: number;
}

export interface SiteSettings {
  site_name_ar: string;
  site_name_en?: string;
  tagline_ar?: string;
  tagline_en?: string;
  about_ar?: string;
  about_en?: string;
  vision_ar?: string;
  vision_en?: string;
  mission_ar?: string;
  mission_en?: string;
  study_plan_intro_ar?: string;
  study_plan_intro_en?: string;
  regulations_ar?: string;
  regulations_en?: string;
  address_ar?: string;
  address_en?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  telegram?: string;
  logo?: string;
  favicon?: string;
  footer_text_ar?: string;
  footer_text_en?: string;
  dashboard_institute_name_ar?: string;
  dashboard_institute_name_en?: string;
  academic_year_ar?: string;
  academic_year_en?: string;
  dashboard_welcome_ar?: string;
  dashboard_welcome_en?: string;
  enable_forum?: boolean;
  enable_live_lessons?: boolean;
  enable_hifz?: boolean;
  enable_honor_board?: boolean;
  enable_wallet?: boolean;
  dashboard_logo?: string;
  dashboard_use_site_logo?: boolean;
  dashboard_primary_color?: string;
  dashboard_sidebar_color?: string;
  dashboard_accent_color?: string;
  dashboard_background_color?: string;
  dashboard_color_palette?: string;
  dashboard_style?: "classic" | "modern" | "minimal" | "compact";
  dashboard_layout?: "wide" | "container";
  dashboard_sidebar_style?: "dark" | "light";
  dashboard_show_pattern?: boolean;
  dashboard_compact_mode?: boolean;
  homepage_featured_courses_enabled?: boolean;
  homepage_featured_courses_visible_from?: string | null;
  homepage_featured_courses_visible_until?: string | null;
  website_primary_color?: string;
  website_accent_color?: string;
  website_background_color?: string;
  website_color_palette?: string;
  website_nav_pages?: NavPageItem[];
}

export interface HeroSlide {
  id: number;
  title_ar: string;
  subtitle_ar?: string;
  button_text_ar?: string;
  button_url?: string;
  image?: string;
}

export interface Course {
  id: number;
  title_ar: string;
  title_en?: string;
  slug: string;
  description_ar?: string;
  description_en?: string;
  image?: string;
  duration_hours?: number;
  level?: string;
  price?: number;
  is_free?: boolean;
  is_featured?: boolean;
  category?: { name_ar: string; slug: string };
  program?: { name_ar: string; slug: string };
  teacher?: { name_ar: string; slug: string; photo?: string };
  lessons?: Lesson[];
}

export interface Lesson {
  id: number;
  title_ar: string;
  content_ar?: string;
  video_url?: string;
  duration_minutes?: number;
  sort_order: number;
}

export interface ProgramSubject {
  id: number;
  name_ar: string;
  slug: string;
  is_required?: boolean;
  memorization_ar?: string | null;
  primary_text_ar?: string | null;
  supplementary_text_ar?: string | null;
  course?: { id: number; slug: string; title_ar: string; title_en?: string } | null;
}

export interface ProgramCurriculumSemester {
  id: number;
  name_ar: string;
  slug: string;
  semester_number: number;
  subjects: ProgramSubject[];
}

export interface ProgramCurriculumYear {
  id: number;
  name_ar: string;
  slug: string;
  year_number: number;
  semesters: ProgramCurriculumSemester[];
}

export interface ProgramSpecializationSubjects {
  id: number;
  name_ar: string;
  slug: string;
  description_ar?: string;
  years?: ProgramCurriculumYear[];
  subjects: ProgramSubject[];
}

export interface Program {
  id: number;
  name_ar: string;
  slug: string;
  description_ar?: string;
  duration?: string;
  level?: string;
  image?: string;
  courses_count?: number;
  subjects_count?: number;
  years?: ProgramCurriculumYear[];
  subjects?: ProgramSubject[];
  specializations?: ProgramSpecializationSubjects[];
}

export interface Teacher {
  id: number;
  name_ar: string;
  slug: string;
  title_ar?: string;
  bio_ar?: string;
  specializations?: string;
  photo?: string;
  is_featured?: boolean;
  courses_count?: number;
  courses?: Course[];
}

export interface Announcement {
  id: number;
  title_ar: string;
  slug: string;
  excerpt_ar?: string;
  content_ar?: string;
  image?: string;
  published_at?: string;
}

export interface Testimonial {
  id: number;
  name_ar: string;
  role_ar?: string;
  content_ar: string;
  photo?: string;
  rating: number;
}

export interface Faq {
  id: number;
  question_ar: string;
  answer_ar: string;
}

export interface HomeData {
  settings: SiteSettings;
  homepage_featured_courses_visible: boolean;
  hero_slides: HeroSlide[];
  featured_courses: Course[];
  programs: Program[];
  teachers: Teacher[];
  testimonials: Testimonial[];
  announcements: Announcement[];
  faqs: Faq[];
  stats: {
    students: number;
    courses: number;
    teachers: number;
    programs: number;
    graduates: number;
  };
}

export interface PaginatedMeta {
  current_page: number;
  last_page: number;
  total: number;
}

export interface StudyPlanSubject {
  id: number;
  name_ar: string;
  name_en?: string;
  slug: string;
  is_required: boolean;
  memorization_ar?: string | null;
  primary_text_ar?: string | null;
  supplementary_text_ar?: string | null;
  course?: { id: number; slug: string; title_ar: string; title_en?: string } | null;
}

export interface StudyPlanSemester {
  id: number;
  name_ar: string;
  name_en?: string;
  slug: string;
  semester_number: number;
  subjects: StudyPlanSubject[];
}

export interface StudyPlanYear {
  id: number;
  name_ar: string;
  name_en?: string;
  slug: string;
  year_number: number;
  semesters: StudyPlanSemester[];
}

export interface StudyPlanSpecialization {
  id: number;
  name_ar: string;
  name_en?: string;
  slug: string;
  description_ar?: string;
  years: StudyPlanYear[];
}

export interface AcademicLevel {
  id: number;
  name_ar: string;
  name_en?: string;
  slug: string;
  number: number;
  curriculum_type?: "general" | "specialized";
  description_ar?: string;
  years?: StudyPlanYear[];
  specializations?: StudyPlanSpecialization[];
}
