import { Composition } from "remotion";

// Video specifications
export const VIDEO_CONFIG = {
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: 300, // 10 seconds at 30fps
};

// Scene timing (frames)
export const SCENES = {
    STRAW: { start: 0, end: 90 },      // 0s - 3s
    WOOD: { start: 90, end: 210 },     // 3s - 7s
    BRICK: { start: 210, end: 300 },  // 7s - 10s
};

// Animation timing
export const TIMING = {
    WOLF_ENTER: { start: 0, end: 30 },
    STRAW_COLLAPSE: { start: 60, end: 90 },
    WOOD_SHAKE_START: 90,
    SHINGLE_DETACH: { start: 120, end: 150 },
    WOLF_EXHAUSTED: { start: 210, end: 300 },
    WINDOW_GLOW: { start: 210, end: 270 },
};

// Colors (matching Tailwind theme)
export const COLORS = {
    STRAW: "#F59E0B",      // amber-500
    WOOD: "#92400E",       // amber-800
    BRICK: "#DC2626",      // red-600
    WOLF: "#64748B",       // slate-500
    WOLF_EXHAUSTED: "#3B82F6", // blue-500
    BACKGROUND: "#0F172A", // slate-900
};
