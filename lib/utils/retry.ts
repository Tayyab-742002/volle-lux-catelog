export async function fetchWithRetry(
  input: RequestInfo | URL,
  init?: RequestInit,
  options: { retries?: number; retryDelayMs?: number } = {}
) {
  const { retries = 2, retryDelayMs = 500 } = options;
  let attempt = 0;
  let lastError: unknown;

  while (attempt <= retries) {
    try {
      const res = await fetch(input, init);
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      return res;
    } catch (err) {
      lastError = err;
      if (attempt === retries) break;
      await new Promise((r) =>
        setTimeout(r, retryDelayMs * Math.pow(2, attempt))
      );
      attempt += 1;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Network request failed");
}
