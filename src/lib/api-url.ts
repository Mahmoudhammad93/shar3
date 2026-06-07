declare global {
  interface Window {
    __SHARE3A_CONFIG__?: {
      apiUrl?: string;
    };
  }
}

const DEFAULT_API_URL = "http://localhost:8000/api/v1";

export function getApiUrl(): string {
  if (typeof window !== "undefined" && window.__SHARE3A_CONFIG__?.apiUrl) {
    return window.__SHARE3A_CONFIG__.apiUrl.replace(/\/$/, "");
  }

  return (process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/$/, "");
}
