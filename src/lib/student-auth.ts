import type { AuthUser } from "@/lib/auth";

export type StudentAccountStatus = "pending" | "active" | "rejected" | "graduated" | "suspended" | "unknown";

export function getStudentStatus(user: AuthUser | null): StudentAccountStatus {
  return user?.student?.status ?? "unknown";
}

export function isActiveStudent(user: AuthUser | null): boolean {
  return getStudentStatus(user) === "active";
}

export function isPendingStudent(user: AuthUser | null): boolean {
  return getStudentStatus(user) === "pending";
}

export function isRejectedStudent(user: AuthUser | null): boolean {
  return getStudentStatus(user) === "rejected";
}

export function getStudentDashboardPath(user: AuthUser | null): string {
  const status = getStudentStatus(user);

  if (status === "pending") {
    return "/dashboard/pending";
  }

  if (status === "rejected") {
    return "/dashboard/rejected";
  }

  return "/dashboard/courses";
}

export function canAccessAcademicDashboard(user: AuthUser | null): boolean {
  return isActiveStudent(user);
}
