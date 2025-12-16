"use client";

import Image from "next/image";

export function BackgroundLayer() {
    return (
        <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden bg-white">
            {/* Background Image Container */}
            <div className="absolute inset-0 w-full h-full">
                {/* Placeholder for actual image. User should replace src with: /path/to/workshop.jpg */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-200" />

                {/* If we had an image, it would look like this:
         <Image 
            src="/background-placeholder.jpg" 
            alt="Bright workshop background" 
            fill 
            className="object-cover opacity-50"
            priority
         /> 
         */}
            </div>

            {/* Light Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]" />

            {/* Subtle Grain (optional, keep it light) */}
            <div className="absolute inset-0 opacity-[0.4] pointer-events-none mix-blend-multiply"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")`,
                }}
            />
        </div>
    );
}
