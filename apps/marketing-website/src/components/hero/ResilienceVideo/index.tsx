import React from "react";
import { useCurrentFrame, AbsoluteFill, interpolate } from "remotion";
import { Wolf } from "./Wolf";
import { House } from "./House";
import { VIDEO_CONFIG, SCENES, COLORS } from "./compositions";

export const ResilienceVideo: React.FC = () => {
    const frame = useCurrentFrame();

    // Determine current scene based on frame
    const getWolfState = () => {
        if (frame < SCENES.STRAW.end - 30) return "blowing-straw";
        if (frame < SCENES.WOOD.end - 30) return "blowing-wood";
        return "exhausted";
    };

    const getHouseState = (type: "straw" | "wood" | "brick") => {
        if (type === "straw") {
            if (frame < SCENES.STRAW.start + 60) return "intact";
            if (frame < SCENES.STRAW.end) return "collapsing";
            return "collapsing";
        }
        if (type === "wood") {
            if (frame < SCENES.WOOD.start) return "intact";
            if (frame < SCENES.WOOD.end) return "shaking";
            return "shaking";
        }
        return "standing";
    };

    return (
        <AbsoluteFill style={{ backgroundColor: COLORS.BACKGROUND }}>
            <svg
                viewBox={`0 0 ${VIDEO_CONFIG.width} ${VIDEO_CONFIG.height}`}
                style={{ width: "100%", height: "100%" }}
                preserveAspectRatio="xMidYMid slice"
            >
                {/* Background grid pattern */}
                <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path
                            d="M 40 0 L 0 0 0 40"
                            fill="none"
                            stroke="#1E293B"
                            strokeWidth="1"
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3" />

                {/* Ground line */}
                <line
                    x1="0"
                    y1="450"
                    x2={VIDEO_CONFIG.width}
                    y2="450"
                    stroke="#334155"
                    strokeWidth="2"
                />

                {/* Houses */}
                <House type="straw" state={getHouseState("straw")} />
                <House type="wood" state={getHouseState("wood")} />
                <House type="brick" state={getHouseState("brick")} />

                {/* Wolf */}
                <Wolf state={getWolfState()} />

                {/* Labels */}
                <g transform="translate(400, 500)" opacity={frame < SCENES.STRAW.end ? 1 : 0.3}>
                    <text
                        x="50"
                        y="0"
                        textAnchor="middle"
                        fill={COLORS.STRAW}
                        fontSize="14"
                        fontFamily="Montserrat, sans-serif"
                        fontWeight="800"
                    >
                        THE HUSTLE
                    </text>
                </g>

                <g transform="translate(550, 500)" opacity={frame < SCENES.WOOD.end ? 1 : 0.3}>
                    <text
                        x="50"
                        y="0"
                        textAnchor="middle"
                        fill={COLORS.WOOD}
                        fontSize="14"
                        fontFamily="Montserrat, sans-serif"
                        fontWeight="800"
                    >
                        TYPICAL SMB
                    </text>
                </g>

                <g transform="translate(700, 500)" opacity={1}>
                    <text
                        x="50"
                        y="0"
                        textAnchor="middle"
                        fill={COLORS.BRICK}
                        fontSize="14"
                        fontFamily="Montserrat, sans-serif"
                        fontWeight="800"
                    >
                        SYSTEMATIZED
                    </text>
                </g>
            </svg>
        </AbsoluteFill>
    );
};

// Export for Remotion Player
export const ResilienceVideoComposition: React.FC = () => {
    return <ResilienceVideo />;
};
