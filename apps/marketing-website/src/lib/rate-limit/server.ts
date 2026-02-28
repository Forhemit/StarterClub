// Server-side rate limiting using in-memory store
// For production with multiple instances, use Redis or similar

type RateLimitStore = Map<string, { count: number; resetTime: number }>;

const store: RateLimitStore = new Map();

interface RateLimitConfig {
    windowMs: number;    // Time window in milliseconds
    maxRequests: number; // Max requests per window
}

const DEFAULT_CONFIG: RateLimitConfig = {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
};

export class RateLimiter {
    private config: RateLimitConfig;

    constructor(config: Partial<RateLimitConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
    }

    /**
     * Check if request is allowed
     * @param identifier - IP address or user ID
     * @returns { allowed: boolean, remaining: number, resetTime: number }
     */
    check(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
        const now = Date.now();
        const windowStart = now - this.config.windowMs;

        // Clean up expired entries
        for (const [key, value] of store.entries()) {
            if (value.resetTime < now) {
                store.delete(key);
            }
        }

        const record = store.get(identifier);

        if (!record || record.resetTime < now) {
            // First request or window expired
            const resetTime = now + this.config.windowMs;
            store.set(identifier, { count: 1, resetTime });
            return {
                allowed: true,
                remaining: this.config.maxRequests - 1,
                resetTime,
            };
        }

        if (record.count >= this.config.maxRequests) {
            // Rate limit exceeded
            return {
                allowed: false,
                remaining: 0,
                resetTime: record.resetTime,
            };
        }

        // Increment count
        record.count++;
        return {
            allowed: true,
            remaining: this.config.maxRequests - record.count,
            resetTime: record.resetTime,
        };
    }

    /**
     * Get client IP from request
     */
    static getClientIP(request: Request): string {
        const forwarded = request.headers.get('x-forwarded-for');
        if (forwarded) {
            return forwarded.split(',')[0].trim();
        }
        // Fallback - in production this would be the CDN/proxy IP
        return 'unknown';
    }
}

// Pre-configured limiters for common use cases
export const limiters = {
    // Strict limiter for auth endpoints
    auth: new RateLimiter({ windowMs: 15 * 60 * 1000, maxRequests: 5 }), // 5 attempts per 15 min

    // Standard API limiter
    api: new RateLimiter({ windowMs: 60 * 1000, maxRequests: 100 }), // 100 requests per minute

    // Webhook limiter (more permissive but still protected)
    webhook: new RateLimiter({ windowMs: 60 * 1000, maxRequests: 1000 }), // 1000 per minute

    // Export limiter (resource intensive)
    export: new RateLimiter({ windowMs: 60 * 1000, maxRequests: 10 }), // 10 exports per minute
};
