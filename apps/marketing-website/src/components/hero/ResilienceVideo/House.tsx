import React from "react";
import { useCurrentFrame, interpolate, spring, Easing } from "remotion";
import { TIMING, COLORS } from "./compositions";

interface HouseProps {
    type: "straw" | "wood" | "brick";
    state: "intact" | "collapsing" | "shaking" | "standing";
}

export const House: React.FC<HouseProps> = ({ type, state }) => {
    const frame = useCurrentFrame();

    // Straw house collapse animation
    const strawCollapse = state === "collapsing"
        ? spring({
            frame: frame - TIMING.STRAW_COLLAPSE.start,
            fps: 30,
            config: { mass: 0.8, damping: 10, stiffness: 100 },
        })
        : 0;

    // Wood house shake animation
    const woodShake = state === "shaking"
        ? Math.sin(frame * 0.5) * interpolate(frame - TIMING.WOOD_SHAKE_START, [0, 60], [10, 0])
        : 0;

    // Shingle detach animation
    const shingleOffset = state === "shaking" && frame > TIMING.SHINGLE_DETACH.start
        ? interpolate(
            frame,
            [TIMING.SHINGLE_DETACH.start, TIMING.SHINGLE_DETACH.end],
            [0, 150],
            { extrapolateRight: "clamp" }
        )
        : 0;

    // Window glow for brick house
    const glowIntensity = type === "brick" && state === "standing"
        ? interpolate(
            frame - TIMING.WINDOW_GLOW.start,
            [0, 60],
            [0, 20],
            { easing: Easing.elastic(1.5) }
        )
        : 0;

    const renderStrawHouse = () => (
        <g transform={`translate(${400 + woodShake}, 350)`}>
            {/* Particle system - straw pieces */}
            {state === "collapsing" && Array.from({ length: 20 }).map((_, i) => {
                const angle = (i / 20) * Math.PI * 2;
                const distance = strawCollapse * (50 + i * 10);
                const rotation = strawCollapse * (Math.random() * 360 - 180);
                const opacity = interpolate(strawCollapse, [0, 0.5, 1], [1, 1, 0]);

                return (
                    <rect
                        key={i}
                        x={25 + Math.cos(angle) * distance}
                        y={40 + Math.sin(angle) * distance * 0.5}
                        width="8"
                        height="3"
                        fill={COLORS.STRAW}
                        opacity={opacity}
                        transform={`rotate(${rotation} ${25 + Math.cos(angle) * distance} ${40 + Math.sin(angle) * distance * 0.5})`}
                    />
                );
            })}

            {/* Main house structure (fades out when collapsing) */}
            <g opacity={interpolate(strawCollapse, [0, 0.3, 0.6], [1, 1, 0], { extrapolateRight: "clamp" })}>
                {/* Roof */}
                <path d="M20 40 L50 10 L80 40" fill="none" stroke={COLORS.STRAW} strokeWidth="4" />
                {/* Walls */}
                <rect x="25" y="40" width="50" height="50" fill="#FDE68A" stroke={COLORS.STRAW} strokeWidth="2" />
                {/* Straw texture lines */}
                {Array.from({ length: 5 }).map((_, i) => (
                    <line
                        key={i}
                        x1={30 + i * 10}
                        y1="40"
                        x2={30 + i * 10}
                        y2="90"
                        stroke={COLORS.STRAW}
                        strokeWidth="1"
                        opacity="0.5"
                    />
                ))}
                {/* Door */}
                <rect x="42" y="65" width="16" height="25" fill="#92400E" />
            </g>
        </g>
    );

    const renderWoodHouse = () => (
        <g transform={`translate(${550 + woodShake}, 350)`}>
            {/* Detached shingle */}
            {shingleOffset > 0 && (
                <g
                    transform={`translate(15, ${-shingleOffset}) rotate(${shingleOffset * 0.3})`}
                >
                    <path d="M15 35 L50 5 L85 35" fill="#8B4513" stroke="#654321" strokeWidth="2" />
                </g>
            )}

            {/* Main structure */}
            <g>
                {/* Walls */}
                <rect x="20" y="35" width="60" height="55" fill="#A67C52" stroke={COLORS.WOOD} strokeWidth="3" />
                {/* Wood planks */}
                {Array.from({ length: 4 }).map((_, i) => (
                    <line
                        key={i}
                        x1="20"
                        y1={45 + i * 10}
                        x2="80"
                        y2={45 + i * 10}
                        stroke={COLORS.WOOD}
                        strokeWidth="2"
                    />
                ))}
                {/* Roof (partial when damaged) */}
                <path
                    d="M15 35 L50 5 L85 35"
                    fill="#8B4513"
                    stroke="#654321"
                    strokeWidth="2"
                    opacity={shingleOffset > 50 ? 0.5 : 1}
                />
                {/* Door */}
                <rect x="42" y="65" width="16" height="25" fill="#5D3A1A" />
                {/* Windows */}
                <rect x="28" y="48" width="12" height="12" fill="#87CEEB" stroke="#5D3A1A" strokeWidth="2" opacity="0.8" />
                <rect x="60" y="48" width="12" height="12" fill="#87CEEB" stroke="#5D3A1A" strokeWidth="2" opacity="0.6" />

                {/* Damage cracks */}
                {state === "shaking" && frame > 150 && (
                    <>
                        <line x1="25" y1="50" x2="35" y2="55" stroke="#5D3A1A" strokeWidth="1" />
                        <line x1="65" y1="70" x2="75" y2="75" stroke="#5D3A1A" strokeWidth="1" />
                    </>
                )}
            </g>
        </g>
    );

    const renderBrickHouse = () => (
        <g transform={`translate(${700}, 350)`}>
            {/* Parallax background bricks for depth */}
            <g opacity="0.5" transform="translate(-5, -5)">
                <rect x="15" y="30" width="70" height="65" fill="#5D3A1A" />
                <line x1="15" y1="42" x2="85" y2="42" stroke="#3D2310" strokeWidth="2" />
                <line x1="15" y1="54" x2="85" y2="54" stroke="#3D2310" strokeWidth="2" />
                <line x1="15" y1="66" x2="85" y2="66" stroke="#3D2310" strokeWidth="2" />
                <line x1="15" y1="78" x2="85" y2="78" stroke="#3D2310" strokeWidth="2" />
            </g>

            {/* Main structure */}
            <g>
                {/* Walls with brick pattern */}
                <rect x="15" y="30" width="70" height="65" fill={COLORS.BRICK} stroke="#5D3A1A" strokeWidth="2" />
                {/* Horizontal mortar lines */}
                {Array.from({ length: 4 }).map((_, i) => (
                    <line
                        key={`h-${i}`}
                        x1="15"
                        y1={42 + i * 12}
                        x2="85"
                        y2={42 + i * 12}
                        stroke="#A0522D"
                        strokeWidth="2"
                    />
                ))}
                {/* Vertical mortar lines - offset pattern */}
                <line x1="32" y1="30" x2="32" y2="42" stroke="#A0522D" strokeWidth="2" />
                <line x1="50" y1="30" x2="50" y2="42" stroke="#A0522D" strokeWidth="2" />
                <line x1="68" y1="30" x2="68" y2="42" stroke="#A0522D" strokeWidth="2" />
                <line x1="23" y1="42" x2="23" y2="54" stroke="#A0522D" strokeWidth="2" />
                <line x1="41" y1="42" x2="41" y2="54" stroke="#A0522D" strokeWidth="2" />
                <line x1="59" y1="42" x2="59" y2="54" stroke="#A0522D" strokeWidth="2" />
                <line x1="77" y1="42" x2="77" y2="54" stroke="#A0522D" strokeWidth="2" />

                {/* Fortress roof */}
                <path d="M10 30 L50 0 L90 30" fill="#5D3A1A" stroke="#3D2310" strokeWidth="2" />

                {/* Reinforced door */}
                <rect x="40" y="60" width="20" height="35" fill="#4A3728" stroke="#2D1F14" strokeWidth="2" />
                <circle cx="56" cy="78" r="2" fill="#FFD700" />

                {/* Reinforced window with glow */}
                <g>
                    <rect x="22" y="45" width="12" height="12" fill="#87CEEB" stroke="#4A3728" strokeWidth="3" />
                    <line x1="28" y1="45" x2="28" y2="57" stroke="#4A3728" strokeWidth="2" />
                    <line x1="22" y1="51" x2="34" y2="51" stroke="#4A3728" strokeWidth="2" />
                    {/* Glow effect */}
                    <circle
                        cx="28"
                        cy="51"
                        r="4"
                        fill="#FFD700"
                        opacity={0.8 + Math.sin(frame * 0.2) * 0.2}
                        filter={`drop-shadow(0 0 ${glowIntensity}px rgba(255, 215, 0, 0.8))`}
                    />
                </g>
            </g>
        </g>
    );

    switch (type) {
        case "straw":
            return renderStrawHouse();
        case "wood":
            return renderWoodHouse();
        case "brick":
            return renderBrickHouse();
        default:
            return null;
    }
};
