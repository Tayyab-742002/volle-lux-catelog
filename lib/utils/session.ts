/**
 * Session ID utilities for guest cart management
 * Generates and manages session IDs for guest users
 */

/**
 * Generate a unique session ID for guest users
 */
export function generateSessionId(): string {
  return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get or create a session ID for the current session
 * Stores the session ID in localStorage for persistence
 */
export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") {
    return generateSessionId();
  }

  const storageKey = "volle_session_id";
  let sessionId = localStorage.getItem(storageKey);

  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(storageKey, sessionId);
  }

  return sessionId;
}

/**
 * Clear the session ID (useful when user logs in)
 */
export function clearSessionId(): void {
  if (typeof window === "undefined") {
    return;
  }

  const storageKey = "volle_session_id";
  localStorage.removeItem(storageKey);
}
