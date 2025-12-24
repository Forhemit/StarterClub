/**
 * ANTIGRAVITY DESIGN TOKENS
 * Aesthetic: Cyber-Physical Industrial
 * Vibe: Racing Telemetry, Raw Carbon, Neon Signals
 */

export const colors = {
    // The Void
    void: {
        DEFAULT: "#050505",
        surface: "#0a0a0a",
        deep: "#000000",
    },
    // Active Signals
    signal: {
        green: "#00ff9d", // Acid Green
        orange: "#ff4d00", // International Orange / Warning
        red: "#ff003c", // Critical Failure
        blue: "#00f0ff", // Electric Blue / Data
    },
    // Structural Materials
    carbon: {
        light: "#2a2a2a",
        DEFAULT: "#1a1a1a",
        dark: "#111111",
    },
    // Textures
    glass: "rgba(255, 255, 255, 0.05)",
    glassBorder: "rgba(255, 255, 255, 0.1)",
} as const;

export const typography = {
    // Display / Headings - Import this in your global CSS
    display: '"Chakra Petch", sans-serif',
    // Data / Code / Telemetry
    mono: '"JetBrains Mono", monospace',
    // Standard UI text (rarely used, prefer mono for this aesthetic)
    sans: '"Space Grotesk", sans-serif',
} as const;

export const spacing = {
    micro: "0.25rem", // 4px
    xs: "0.5rem", // 8px
    sm: "1rem", // 16px
    md: "1.5rem", // 24px
    lg: "2rem", // 32px
    xl: "4rem", // 64px
    xxl: "8rem", // 128px
} as const;

export const physics = {
    spring: {
        stiff: { stiffness: 300, damping: 20 },
        bouncy: { stiffness: 400, damping: 10 },
        gentle: { stiffness: 100, damping: 15 },
    },
} as const;
