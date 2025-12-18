/**
 * Structured logging utility with environment-aware behavior.
 * - Sanitizes sensitive data before logging
 * - Respects NODE_ENV for debug output
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const isDev = process.env.NODE_ENV === 'development';

// Keys that should be redacted in logs
const SENSITIVE_KEYS = ['password', 'token', 'secret', 'key', 'authorization', 'apikey', 'api_key'];

/**
 * Recursively sanitizes an object, redacting sensitive values.
 */
function sanitize(data: unknown): unknown {
    if (data === null || data === undefined) return data;
    if (typeof data !== 'object') return data;

    if (Array.isArray(data)) {
        return data.map(sanitize);
    }

    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
        const lowerKey = key.toLowerCase();
        if (SENSITIVE_KEYS.some(s => lowerKey.includes(s))) {
            sanitized[key] = '[REDACTED]';
        } else if (typeof value === 'object' && value !== null) {
            sanitized[key] = sanitize(value);
        } else {
            sanitized[key] = value;
        }
    }
    return sanitized;
}

/**
 * Format log message with timestamp and level.
 */
function formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
}

export const logger = {
    /**
     * Debug logs - only output in development
     */
    debug(message: string, context?: Record<string, unknown>): void {
        if (isDev) {
            console.debug(formatMessage('debug', message), context ? sanitize(context) : '');
        }
    },

    /**
     * Info logs - always output
     */
    info(message: string, context?: Record<string, unknown>): void {
        console.info(formatMessage('info', message), context ? sanitize(context) : '');
    },

    /**
     * Warning logs - always output
     */
    warn(message: string, context?: Record<string, unknown>): void {
        console.warn(formatMessage('warn', message), context ? sanitize(context) : '');
    },

    /**
     * Error logs - always output, with optional error object
     */
    error(message: string, error?: unknown, context?: Record<string, unknown>): void {
        const errorInfo = error instanceof Error
            ? { name: error.name, message: error.message, stack: isDev ? error.stack : undefined }
            : error;

        console.error(formatMessage('error', message), {
            error: errorInfo,
            ...(context ? sanitize(context) as Record<string, unknown> : {})
        });
    }
};

export default logger;
