"use client";

/**
 * Super Menu Analytics Module
 * 
 * Tracks menu interactions for conversion optimization.
 * Events are stored locally and can be synced to the super admin dashboard.
 */

export type MenuEventType =
    | "menu_open"
    | "menu_close"
    | "section_toggle"
    | "navigation_click"
    | "cta_click"
    | "hover_interaction";

export interface MenuEvent {
    type: MenuEventType;
    timestamp: number;
    sessionId: string;
    pathname: string;
    data: Record<string, unknown>;
}

// Generate session ID for tracking
const getSessionId = (): string => {
    if (typeof window === "undefined") return "server";

    let sessionId = sessionStorage.getItem("super_menu_session");
    if (!sessionId) {
        sessionId = `sm_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        sessionStorage.setItem("super_menu_session", sessionId);
    }
    return sessionId;
};

// Local event queue
const eventQueue: MenuEvent[] = [];

/**
 * Track a menu interaction event
 */
export function trackMenuEvent(
    type: MenuEventType,
    data: Record<string, unknown> = {}
): void {
    if (typeof window === "undefined") return;

    const event: MenuEvent = {
        type,
        timestamp: Date.now(),
        sessionId: getSessionId(),
        pathname: window.location.pathname,
        data,
    };

    eventQueue.push(event);

    // Store in localStorage for persistence
    try {
        const stored = localStorage.getItem("super_menu_analytics") || "[]";
        const events: MenuEvent[] = JSON.parse(stored);
        events.push(event);

        // Keep only last 1000 events
        if (events.length > 1000) {
            events.splice(0, events.length - 1000);
        }

        localStorage.setItem("super_menu_analytics", JSON.stringify(events));
    } catch (e) {
        console.warn("Failed to store menu analytics:", e);
    }

    // Log in development
    if (process.env.NODE_ENV === "development") {
        console.log(`[SuperMenu Analytics] ${type}`, data);
    }
}

/**
 * Get all stored analytics events
 */
export function getMenuAnalytics(): MenuEvent[] {
    if (typeof window === "undefined") return [];

    try {
        const stored = localStorage.getItem("super_menu_analytics") || "[]";
        return JSON.parse(stored);
    } catch {
        return [];
    }
}

/**
 * Get analytics summary for super admin dashboard
 */
export function getMenuAnalyticsSummary(): {
    totalMenuOpens: number;
    totalNavigationClicks: number;
    totalCtaClicks: number;
    avgSectionsExpanded: number;
    topClickedItems: Array<{ label: string; href: string; count: number }>;
    conversionPaths: Array<{ from: string; to: string; count: number }>;
    deviceBreakdown: { mobile: number; desktop: number };
} {
    const events = getMenuAnalytics();

    const summary = {
        totalMenuOpens: 0,
        totalNavigationClicks: 0,
        totalCtaClicks: 0,
        avgSectionsExpanded: 0,
        topClickedItems: [] as Array<{ label: string; href: string; count: number }>,
        conversionPaths: [] as Array<{ from: string; to: string; count: number }>,
        deviceBreakdown: { mobile: 0, desktop: 0 },
    };

    const clickCounts = new Map<string, { label: string; href: string; count: number }>();
    let sectionToggles = 0;

    for (const event of events) {
        switch (event.type) {
            case "menu_open":
                summary.totalMenuOpens++;
                break;
            case "navigation_click":
                summary.totalNavigationClicks++;
                const label = event.data.itemLabel as string;
                const href = event.data.itemHref as string;
                const isMobile = event.data.isMobile as boolean;

                if (isMobile) {
                    summary.deviceBreakdown.mobile++;
                } else {
                    summary.deviceBreakdown.desktop++;
                }

                if (label && href) {
                    const key = href;
                    const existing = clickCounts.get(key);
                    if (existing) {
                        existing.count++;
                    } else {
                        clickCounts.set(key, { label, href, count: 1 });
                    }
                }
                break;
            case "cta_click":
                summary.totalCtaClicks++;
                break;
            case "section_toggle":
                if (event.data.expanded) {
                    sectionToggles++;
                }
                break;
        }
    }

    // Calculate averages
    if (summary.totalMenuOpens > 0) {
        summary.avgSectionsExpanded = sectionToggles / summary.totalMenuOpens;
    }

    // Sort top clicked items
    summary.topClickedItems = Array.from(clickCounts.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    return summary;
}

/**
 * Clear stored analytics (for testing/debugging)
 */
export function clearMenuAnalytics(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("super_menu_analytics");
    eventQueue.length = 0;
}

/**
 * Export analytics data as JSON (for super admin sync)
 */
export function exportMenuAnalytics(): string {
    return JSON.stringify(getMenuAnalytics(), null, 2);
}
