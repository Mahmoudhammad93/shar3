import { getApiUrl } from "@/lib/api-url";
const FETCH_TIMEOUT_MS = 60_000;
const FETCH_RETRIES = 3;

const responseCache = new Map<string, Promise<unknown>>();

async function fetchWithTimeout(url: string, options?: RequestInit): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 0; attempt < FETCH_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeout);
      return res;
    } catch (error) {
      clearTimeout(timeout);
      lastError = error;
      if (attempt < FETCH_RETRIES - 1) {
        await new Promise((resolve) => setTimeout(resolve, 2000 * (attempt + 1)));
      }
    }
  }

  throw lastError;
}

export async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const cacheKey = `${path}:${options?.method ?? "GET"}`;
  const skipModuleCache =
    process.env.NODE_ENV === "development" && (path.startsWith("/settings") || path.startsWith("/home"));

  if (skipModuleCache || !responseCache.has(cacheKey)) {

    const request = (async () => {
      const res = await fetchWithTimeout(`${getApiUrl()}${path}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...options?.headers,
        },
        cache: "force-cache",
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status} for ${path}`);
      }

      return res.json() as Promise<T>;
    })();

    if (!skipModuleCache) {
      responseCache.set(cacheKey, request);
    }

    return request;
  }

  return responseCache.get(cacheKey) as Promise<T>;
}

export async function fetchApiSafe<T>(path: string): Promise<T | null> {
  try {
    return await fetchApi<T>(path);
  } catch (error) {
    console.warn(`Failed to fetch ${path}:`, error);
    return null;
  }
}

/** Fetches fresh data at runtime (for client components on static export). */
export async function fetchApiLive<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetchWithTimeout(`${getApiUrl()}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options?.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} for ${path}`);
  }

  return res.json() as Promise<T>;
}
