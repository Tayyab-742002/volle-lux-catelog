/**
 * Session ID utilities for guest cart management
 * DEPRECATED: No longer used.
 * This file is kept for reference but should be removed in future cleanup.
 *
 * Old implementation used session IDs for guest cart tracking in Supabase.
 * New implementation uses localStorage directly for guest carts.
 */

const SESSION_ID_KEY = "volle_guest_session_id";
const SESSION_EXPIRY_DAYS = 7;

/**
 * Generate a unique session ID for guest users
 */
export function generateSessionId(): string {
  return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get or create a session ID for the current session
 * Stores the session ID in localStorage with expiry timestamp
 */
export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") {
    return generateSessionId();
  }

  try {
    const stored = localStorage.getItem(SESSION_ID_KEY);

    if (stored) {
      const { sessionId, expiresAt } = JSON.parse(stored);

      // Check if session is still valid
      if (expiresAt && Date.now() < expiresAt) {
        return sessionId;
      }

      // Session expired, remove it
      localStorage.removeItem(SESSION_ID_KEY);
    }

    // Create new session
    const sessionId = generateSessionId();
    const expiresAt = Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

    localStorage.setItem(
      SESSION_ID_KEY,
      JSON.stringify({
        sessionId,
        expiresAt,
        createdAt: Date.now(),
      })
    );

    return sessionId;
  } catch (error) {
    console.error("Error managing session ID:", error);
    // Fallback to generating a new ID if storage fails
    return generateSessionId();
  }
}

/**
 * Clear the session ID (useful when user logs in)
 */
export function clearSessionId(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(SESSION_ID_KEY);
  } catch (error) {
    console.error("Error clearing session ID:", error);
  }
}

/**
 * Check if a valid session ID exists
 */
export function hasValidSessionId(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const stored = localStorage.getItem(SESSION_ID_KEY);
    if (!stored) return false;

    const { expiresAt } = JSON.parse(stored);
    return expiresAt && Date.now() < expiresAt;
  } catch {
    return false;
  }
}
