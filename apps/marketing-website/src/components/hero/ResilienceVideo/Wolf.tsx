import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { TIMING, COLORS } from "./compositions";

interface WolfProps {
    state: "entering" | "blowing-straw" | "blowing-wood" | "exhausted";
}

export const Wolf: React.FC<WolfProps> = ({ state }) => {
    const frame = useCurrentFrame();

    // Wolf position animation (entering from left)
    const wolfX = interpolate(
        frame,
        [TIMING.WOLF_ENTER.start, TIMING.WOLF_ENTER.end],
        [-200, 400],
        { easing: Easing.out(Easing.back(1.5)) }
    );

    // Breathing/blinking animation
    const breathScale = interpolate(
        frame % 60,
        [0, 30, 60],
        [1, 1.05, 1],
        { easing: Easing.inOutSine }
    );

    // Exhaustion effects
    const isExhausted = state === "exhausted";
    const exhaustionOpacity = isExhausted
        ? interpolate(frame - TIMING.WOLF_EXHAUSTED.start, [0, 30], [0, 1])
        : 0;

    // Blowing animation (jaw/mouth scale)
    const isBlowing = state === "blowing-straw" || state === "blowing-wood";
    const mouthScale = isBlowing
        ? interpolate(frame % 10, [0, 5, 10], [1, 1.3, 1], { extrapolateRight: "clamp" })
        : 1;

    // Shake when blowing
    const shakeX = isBlowing
        ? Math.sin(frame * 0.5) * 3
        : 0;

    // Wind particles when blowing
    const showWind = isBlowing;

    return (
        <g transform={`translate(${wolfX + shakeX}, 400)`}>
            {/* Wind particles */}
            {showWind && (
                <g opacity={0.6}>
                    {[0, 1, 2].map((i) => (
                        <line
                            key={i}
                            x1={85}
                            y1={70 + i * 8}
                            x2={110 + Math.sin((frame + i * 10) * 0.2) * 10}
                            y2={65 + i * 8 + Math.cos((frame + i * 10) * 0.15) * 5}
                            stroke="#94A3B8"
                            strokeWidth="3"
                            strokeLinecap="round"
                            opacity={interpolate((frame + i * 5) % 20, [0, 10, 20], [0, 1, 0])}
                        />
                    ))}
                </g>
            )}

            {/* Exhaustion puffs */}
            {isExhausted && (
                <g opacity={exhaustionOpacity}>
                    {[0, 1, 2].map((i) => (
                        <circle
                            key={i}
                            cx={60 + i * 20}
                            cy={30 - i * 10}
                            r={interpolate((frame + i * 15) % 40, [0, 20, 40], [5, 15, 0])}
                            fill="#94A3B8"
                            opacity={0.5}
                        />
                    ))}
                </g>
            )}

            {/* Wolf body */}
            <g transform={`scale(${breathScale})`}>
                {/* Main body circle */}
                <circle cx="60" cy="60" r="35" fill={COLORS.WOLF} />

                {/* Ears */}
                <polygon points="35,35 45,10 55,35" fill={COLORS.WOLF} />
                <polygon points="65,35 75,10 85,35" fill={COLORS.WOLF} />

                {/* Inner ears */}
                <polygon points="40,30 45,18 50,30" fill="#475569" />
                <polygon points="70,30 75,18 80,30" fill="#475569" />

                {/* Snout */}
                <ellipse cx="60" cy="70" rx="15" ry="12" fill="#94A3B8" />

                {/* Nose */}
                <circle cx="60" cy="68" r="6" fill="#1E293B" />

                {/* Mouth - scales when blowing */}
                <g transform={`scale(${mouthScale}) translate(${60 * (1 - mouthScale)}, ${70 * (1 - mouthScale)})`}>
                    <path
                        d="M 50 75 Q 60 85 70 75"
                        fill="none"
                        stroke="#1E293B"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </g>

                {/* Eyes */}
                <g>
                    <circle cx="50" cy="55" r="5" fill="#1E293B" />
                    <circle cx="52" cy="53" r="2" fill="white" />
                    <circle cx="70" cy="55" r="5" fill="#1E293B" />
                    <circle cx="72" cy="53" r="2" fill="white" />
                </g>

                {/* Exhausted cheeks (turn blue) */}
                {isExhausted && (
                    <>
                        <circle
                            cx="45"
                            cy="65"
                            r="8"
                            fill={COLORS.WOLF_EXHAUSTED}
                            opacity={exhaustionOpacity * 0.6}
                        />
                        <circle
                            cx="75"
                            cy="65"
                            r="8"
                            fill={COLORS.WOLF_EXHAUSTED}
                            opacity={exhaustionOpacity * 0.6}
                        />
                    </>
                )}

                {/* Sweat drops when exhausted */}
                {isExhausted && exhaustionOpacity > 0.5 && (
                    <g>
                        <motion.drop
                            cx="40"
                            cy="50"
                            r="3"
                            fill="#60A5FA"
                            opacity={interpolate(frame % 30, [0, 15, 30], [0, 1, 0])}
                        />
                        <motion.drop
                            cx="80"
                            cy="55"
                            r="3"
                            fill="#60A5FA"
                            opacity={interpolate((frame + 10) % 30, [0, 15, 30], [0, 1, 0])}
                        />
                    </g>
                )}
            </g>
        </g>
    );
};
