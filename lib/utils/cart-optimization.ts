// PERFORMANCE: Cart optimization utilities for Phase 4
// Implements debouncing and request deduplication

/**
 * Simple debounce function to reduce API calls
 * Waits for a specified delay before executing the function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function debounced(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Throttle function to limit execution frequency
 * Ensures function is called at most once per specified interval
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  interval: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  return function throttled(...args: Parameters<T>) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;

    if (timeSinceLastCall >= interval) {
      lastCall = now;
      func(...args);
    } else {
      // Schedule for the next interval
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        func(...args);
        timeoutId = null;
      }, interval - timeSinceLastCall);
    }
  };
}

/**
 * Request deduplication to prevent duplicate API calls
 * Caches ongoing requests and returns the same promise
 */
class RequestDeduplicator {
  private pendingRequests = new Map<string, Promise<any>>();

  async deduplicate<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    // Check if request is already in flight
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!;
    }

    // Create new request
    const promise = requestFn()
      .finally(() => {
        // Clean up after request completes
        this.pendingRequests.delete(key);
      });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  clear(key?: string) {
    if (key) {
      this.pendingRequests.delete(key);
    } else {
      this.pendingRequests.clear();
    }
  }
}

// Global deduplicator instance
export const requestDeduplicator = new RequestDeduplicator();

/**
 * Optimistic update helper for cart operations
 * Updates UI immediately, then syncs with server
 */
export function optimisticUpdate<T>(
  optimisticFn: () => void,
  serverFn: () => Promise<T>,
  rollbackFn: () => void
): Promise<T> {
  // Apply optimistic update immediately
  optimisticFn();

  // Sync with server
  return serverFn().catch((error) => {
    // Rollback on error
    rollbackFn();
    throw error;
  });
}

/**
 * Batch multiple cart operations into a single API call
 * Useful for bulk add/remove operations
 */
export class CartOperationBatcher {
  private operations: Array<() => Promise<any>> = [];
  private batchTimeout: NodeJS.Timeout | null = null;
  private batchDelay: number;

  constructor(delay: number = 300) {
    this.batchDelay = delay;
  }

  add(operation: () => Promise<any>) {
    this.operations.push(operation);

    // Reset batch timeout
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
    }

    // Execute batch after delay
    this.batchTimeout = setTimeout(() => {
      this.executeBatch();
    }, this.batchDelay);
  }

  private async executeBatch() {
    if (this.operations.length === 0) return;

    const operationsToExecute = [...this.operations];
    this.operations = [];
    this.batchTimeout = null;

    try {
      // Execute all operations in parallel
      await Promise.all(operationsToExecute.map((op) => op()));
    } catch (error) {
      console.error("Batch operation failed:", error);
      throw error;
    }
  }

  flush() {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }
    return this.executeBatch();
  }
}

