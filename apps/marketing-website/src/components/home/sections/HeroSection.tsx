"use client";

import { RotatingText } from "@/components/RotatingText";
import { HeroCarousel } from "@/components/HeroCarousel";
import { useModal } from "../context/ModalContext";

export function HeroSection() {
    const { openModal } = useModal();

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center mb-24 md:mb-32">
            {/* LEFT: COPY */}
            <div className="text-center md:text-left space-y-8">
                <h1 className="font-bebas text-6xl md:text-8xl leading-[0.9] md:leading-[0.85] tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-black to-black/60">
                    Start a <br />
                    <RotatingText />
                </h1>

                <div className="max-w-xl mx-auto md:mx-0">
                    <h2 className="font-sans text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                        Starter Club is a place where people bring their ideas to life and dreams to reality for free.
                    </h2>
                </div>

                {/* Hero CTA */}
                <div className="pt-6 md:pt-8 flex flex-col items-center md:items-start space-y-3">
                    <button
                        onClick={openModal}
                        className="w-full md:w-auto bg-black text-white hover:bg-black/80 font-bold uppercase tracking-wider py-4 px-8 rounded-lg transition-colors shadow-lg text-sm md:text-base"
                    >
                        Become a Founding Member
                    </button>
                    <p className="text-sm font-sans text-black/60 italic">
                        Free for a Limited Time - Limited Spaces Left
                    </p>
                </div>
            </div>

            {/* RIGHT: CAROUSEL */}
            <div className="w-full max-w-lg mx-auto md:max-w-none">
                <HeroCarousel />
            </div>
        </div>
    );
}
