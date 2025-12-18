/**
 * Simple client-side rate limiting utility for form submissions.
 * Uses localStorage to track submission counts per form.
 */

const RATE_LIMIT_STORAGE_KEY = 'form_submissions';
const MAX_SUBMISSIONS = 5;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

interface SubmissionRecord {
    count: number;
    windowStart: number;
}

/**
 * Check if a form submission is allowed based on rate limits.
 * @param formId - Unique identifier for the form
 * @returns Object with allowed status and remaining submissions
 */
export function checkRateLimit(formId: string): { allowed: boolean; remaining: number } {
    const key = `${RATE_LIMIT_STORAGE_KEY}_${formId}`;
    const now = Date.now();

    try {
        const stored = localStorage.getItem(key);
        const record: SubmissionRecord = stored
            ? JSON.parse(stored)
            : { count: 0, windowStart: now };

        // Reset if window expired
        if (now - record.windowStart > WINDOW_MS) {
            return { allowed: true, remaining: MAX_SUBMISSIONS };
        }

        if (record.count >= MAX_SUBMISSIONS) {
            return { allowed: false, remaining: 0 };
        }

        return { allowed: true, remaining: MAX_SUBMISSIONS - record.count };
    } catch {
        // If localStorage fails, allow the submission
        return { allowed: true, remaining: MAX_SUBMISSIONS };
    }
}

/**
 * Record a form submission for rate limiting purposes.
 * @param formId - Unique identifier for the form
 */
export function recordSubmission(formId: string): void {
    const key = `${RATE_LIMIT_STORAGE_KEY}_${formId}`;
    const now = Date.now();

    try {
        const stored = localStorage.getItem(key);
        const record: SubmissionRecord = stored
            ? JSON.parse(stored)
            : { count: 0, windowStart: now };

        // Reset window if expired
        if (now - record.windowStart > WINDOW_MS) {
            record.count = 1;
            record.windowStart = now;
        } else {
            record.count++;
        }

        localStorage.setItem(key, JSON.stringify(record));
    } catch {
        // Silent fail for localStorage issues (e.g., private browsing)
    }
}
