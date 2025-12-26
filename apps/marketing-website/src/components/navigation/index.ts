// Navigation Components - Super Menu System
// Strategic navigation with intent-first architecture

export { SuperMenu } from "./SuperMenu";
export { SuperMenuTrigger } from "./SuperMenuTrigger";
export { NavigationSection } from "./NavigationSection";
export { NavigationBadge } from "./NavigationBadge";
export type { BadgeVariant } from "./NavigationBadge";
export { navigationData } from "./navigation-data";
export type { NavigationSectionData, NavigationItem } from "./navigation-data";

// Analytics
export {
    trackMenuEvent,
    getMenuAnalytics,
    getMenuAnalyticsSummary,
    clearMenuAnalytics,
    exportMenuAnalytics
} from "./analytics";
export type { MenuEvent, MenuEventType } from "./analytics";
export { JourneyLauncher } from "./JourneyLauncher";
