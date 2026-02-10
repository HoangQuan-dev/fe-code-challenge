/**
 * Lightweight fetch wrapper.
 * In a real project this would handle auth headers, refresh tokens, etc.
 * (like kz-backoffice's `queryWithAuth` / `queryWithRefresh` in base.ts).
 */

export interface ApiError {
  status: number;
  message: string;
}

/**
 * Generic JSON GET request.
 * Throws a typed `ApiError` on non-2xx responses.
 */
export async function apiGet<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    const error: ApiError = {
      status: response.status,
      message: `Request failed (HTTP ${response.status})`,
    };
    throw error;
  }

  return response.json() as Promise<T>;
}
