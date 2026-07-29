declare global {
  interface Window {
    __SHARE3A_CONFIG__?: {
      apiUrl?: string;
    };
  }
}

const DEFAULT_API_URL = "http://localhost:8000/api/v1";

export function getApiUrl(): string {
  const envUrl = (process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/$/, "");

  if (process.env.NODE_ENV === "development") {
    return envUrl;
  }

  if (typeof window !== "undefined" && window.__SHARE3A_CONFIG__?.apiUrl) {
    return window.__SHARE3A_CONFIG__.apiUrl.replace(/\/$/, "");
  }

  return envUrl;
}
