export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly data?: unknown,
  ) {
    super(message);
  }
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');

if (!API_BASE) {
  throw new Error(
    'NEXT_PUBLIC_API_BASE_URL is not set. Please define it in environment variables.',
  );
}

const hasBody = (init?: RequestInit) => init?.body !== undefined && init?.body !== null;

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);

  // Only set JSON content-type when we send a body
  if (hasBody(init) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: 'include', // IMPORTANT: include cookies for auth
    headers,
  });

  const contentType = res.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');

  const data: unknown = isJson ? await res.json() : await res.text().catch(() => '');

  if (!res.ok) {
    const msg =
      (isJson &&
        typeof data === 'object' &&
        data !== null &&
        'message' in data &&
        typeof (data as { message?: unknown }).message === 'string' &&
        (data as { message: string }).message) ||
      (typeof data === 'string' && data.trim() ? data : `Request failed with status ${res.status}`);

    throw new ApiError(res.status, msg, data);
  }

  // For 204 No Content or empty text responses
  if (res.status === 204 || (!isJson && typeof data === 'string' && data.trim() === '')) {
    return undefined as T;
  }

  return data as T;
}
