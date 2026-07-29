import { getApiUrl } from "@/lib/api-url";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  student_id?: number;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("share3a-auth-change"));
  }
}

export function clearToken() {
  localStorage.removeItem("token");
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("share3a-auth-change"));
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

async function parseApiError(res: Response): Promise<string> {
  const body = await res.json().catch(() => ({} as Record<string, unknown>));

  if (body.errors && typeof body.errors === "object") {
    const firstField = Object.values(body.errors as Record<string, string[]>)[0];
    if (Array.isArray(firstField) && firstField[0]) {
      return translateValidationMessage(String(firstField[0]));
    }
  }

  if (typeof body.message === "string") {
    return translateValidationMessage(body.message);
  }

  return `حدث خطأ (${res.status})`;
}

function translateValidationMessage(message: string): string {
  const map: Record<string, string> = {
    "The email has already been taken.": "البريد الإلكتروني مستخدم بالفعل.",
    "The password field confirmation does not match.": "كلمتا المرور غير متطابقتين.",
    "The password field must be at least 8 characters.": "كلمة المرور يجب أن تكون 8 أحرف على الأقل.",
  };

  return map[message] ?? message;
}

async function authFetch<T>(path: string, options: RequestInit = {}, { public: isPublic = false } = {}): Promise<T> {
  const token = isPublic ? null : getToken();

  let res: Response;
  try {
    res = await fetch(`${getApiUrl()}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error("تعذر الاتصال بالخادم. تحقق من عنوان API وإعدادات CORS.");
  }

  if (res.status === 401) {
    const hadToken = !!getToken();
    if (hadToken) {
      clearToken();
      const pathname = typeof window !== "undefined" ? window.location.pathname : "";
      const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password";
      const isPublicPage = !pathname.startsWith("/dashboard");
      if (typeof window !== "undefined" && !isAuthPage && !isPublicPage) {
        window.location.href = "/login";
      }
    }
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    throw new Error(await parseApiError(res));
  }

  return res.json();
}

export const authApi = {
  register: async (data: RegisterPayload) => {
    const res = await authFetch<{ token: string; user: AuthUser }>(
      "/auth/register",
      { method: "POST", body: JSON.stringify(data) },
      { public: true },
    );
    setToken(res.token);
    return res;
  },

  login: async (email: string, password: string) => {
    const res = await authFetch<{ token: string; user: AuthUser }>(
      "/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) },
      { public: true },
    );
    setToken(res.token);
    return res;
  },

  logout: async () => {
    try {
      await authFetch("/auth/logout", { method: "POST" });
    } finally {
      clearToken();
    }
  },

  me: () => authFetch<{ user: AuthUser }>("/auth/me"),
};

export const studentApi = {
  dashboard: () => authFetch<{
    stats: { active_courses: number; completed_lessons: number; total_lessons: number; progress_percent: number; pending_assignments: number; certificates: number };
    recent_courses: { id: number; title_ar: string; slug: string; progress: number }[];
  }>("/student/dashboard"),

  courses: () => authFetch<{ data: StudentCourse[] }>("/student/courses"),

  enroll: (data: { course_id: number; notes?: string }) =>
    authFetch<{ message: string; enrollment: { status: string } }>("/student/enrollments", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  course: (id: number) => authFetch<{ course: { id: number; title_ar: string; slug: string; image?: string; description_ar?: string; teacher?: string }; progress: number; lessons: StudentLesson[] }>(`/student/courses/${id}`),

  completeLesson: (lessonId: number) => authFetch(`/student/lessons/${lessonId}/complete`, { method: "POST" }),

  updateLessonProgress: (lessonId: number, progressPercent: number) =>
    authFetch<{ progress_percent: number }>(`/student/lessons/${lessonId}/progress`, {
      method: "POST",
      body: JSON.stringify({ progress_percent: progressPercent }),
    }),

  lessonQuiz: (lessonId: number) =>
    authFetch<{ lesson_id: number; questions: { id: number; question_ar: string; options: { id: number; option_ar: string }[] }[] }>(
      `/student/lessons/${lessonId}/quiz`,
    ),

  submitLessonQuiz: (lessonId: number, answers: Record<number, number>) =>
    authFetch<{ message: string; passed: boolean }>(`/student/lessons/${lessonId}/quiz`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    }),

  reportError: (data: { lesson_id?: number; page_url?: string; error_type: string; description: string }) =>
    authFetch<{ message: string }>("/student/error-reports", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  schedule: () => authFetch<{ data: ScheduleItem[] }>("/student/schedule"),

  assignments: () => authFetch<{ data: AssignmentItem[] }>("/student/assignments"),

  submitAssignment: (id: number, content: string) =>
    authFetch(`/student/assignments/${id}/submit`, { method: "POST", body: JSON.stringify({ content }) }),

  grades: () => authFetch<{ grades: GradeItem[]; certificates: CertificateItem[] }>("/student/grades"),

  certificate: (id: number) =>
    authFetch<{ certificate: CertificateDetail }>(`/student/certificates/${id}`),

  profile: () => authFetch<{ user: { name: string; email: string }; student: StudentProfile }>("/student/profile"),

  updateProfile: (data: {
    name?: string;
    phone?: string;
    whatsapp?: string;
    country?: string;
    city?: string;
  }) => authFetch<{ message: string; student: StudentProfile }>("/student/profile", { method: "PUT", body: JSON.stringify(data) }),
};

export interface StudentProfile {
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  gender?: string | null;
  gender_label?: string | null;
  birth_date?: string | null;
  nationality?: string | null;
  country?: string | null;
  country_label?: string | null;
  city?: string | null;
  national_id?: string | null;
  education_level?: string | null;
  education_level_label?: string | null;
  heard_about?: string | null;
  heard_about_label?: string | null;
  works_full_time?: boolean | null;
  works_full_time_label?: string | null;
  participates_other_programs?: boolean | null;
  participates_other_programs_label?: string | null;
  daily_hours?: string | null;
  daily_hours_label?: string | null;
  terms_accepted_at?: string | null;
  status: number;
  status_label?: string;
  photo?: string | null;
}

export interface StudentCourse {
  enrollment_id: number;
  status: string;
  course: {
    id: number;
    title_ar: string;
    slug: string;
    image?: string;
    teacher?: string;
    category?: string;
    description_ar?: string;
    lessons_count: number;
    completed_lessons?: number;
  };
  progress: number;
}

export interface StudentLesson {
  id: number;
  title_ar: string;
  content_ar?: string;
  video_url?: string;
  duration_minutes?: number;
  is_completed: boolean;
  progress_percent: number;
  quiz_passed?: boolean;
  has_quiz?: boolean;
  is_locked?: boolean;
}

export interface ScheduleItem {
  id: number;
  title_ar: string;
  description_ar?: string;
  type: string;
  starts_at: string;
  ends_at?: string;
  meeting_url?: string;
  course?: string;
}

export interface AssignmentItem {
  id: number;
  title_ar: string;
  description_ar?: string;
  due_at?: string;
  max_score: number;
  course?: string;
  submission?: { status: string; score?: number; submitted_at?: string };
}

export interface GradeItem {
  assignment?: string;
  course?: string;
  score?: number;
  max_score?: number;
  feedback?: string;
}

export interface CertificateItem {
  id: number;
  course?: string;
  certificate_number: string;
  issued_at: string;
}

export interface CertificateDetail {
  id: number;
  certificate_number: string;
  issued_at: string;
  issued_at_label: string;
  student_name: string;
  course_title?: string;
  teacher_name?: string | null;
  teacher_title?: string | null;
  institute_name?: string;
  institute_tagline?: string | null;
  academic_year?: string | null;
  file_url?: string | null;
}

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  password: string;
  password_confirmation: string;
  gender?: "male" | "female";
  birth_date?: string;
  nationality?: string;
  country?: string;
  education_level?: string;
  heard_about?: string;
  works_full_time?: boolean;
  participates_other_programs?: boolean;
  daily_hours?: string;
  accept_terms: boolean;
}

export async function submitVolunteer(data: {
  name: string;
  country: string;
  phone: string;
  whatsapp?: string;
  work_type: string;
  experience?: string;
}) {
  return authFetch<{ message: string }>("/volunteer", {
    method: "POST",
    body: JSON.stringify(data),
  }, { public: true });
}
