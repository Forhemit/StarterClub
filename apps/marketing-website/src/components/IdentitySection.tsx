import React from 'react';
import Image from 'next/image';

export function IdentitySection() {
    return (
        <section className="w-full bg-[#F4F4F0] py-24 px-6 flex justify-center">
            <div className="max-w-[1280px] w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                {/* Left Column: Text */}
                <div className="space-y-8 md:pr-12">
                    <h2 className="font-bebas text-5xl md:text-6xl leading-[0.9] text-black uppercase tracking-tight">
                        Located in the heart of San Francisco
                    </h2>

                    <div className="space-y-6 font-sans text-lg text-black/80 font-light leading-relaxed">
                        <p>
                            San Francisco is the epicenter of creativity, reinvention, and world-changing ideas. Our city’s history — and the people who shape it — are as diverse and boundary-pushing as the innovations born here. From groundbreaking technologies to cultural movements that reshaped the planet, San Francisco has always been a launchpad for big dreams.
                        </p>
                        <p>
                            Yet many people with powerful ideas still struggle to access the tools, resources, and connections needed to turn a spark into a finished product, a training program, or a thriving business. Countless early-stage “Starters” fall into the gap between inspiration and successful execution.
                        </p>
                        <p className="font-medium text-black">
                            Our mission is to close that gap between dreams and reality.
                        </p>
                    </div>

                    <div className="pt-4">
                        <button className="bg-black text-white hover:bg-black/80 font-bold uppercase tracking-wider py-4 px-8 rounded-lg transition-colors shadow-lg text-sm md:text-base">
                            Why San Francisco
                        </button>
                    </div>
                </div>

                {/* Right Column: Image */}
                {/* Tall, narrow image showing location/identity. Cropped to be visually striking. */}
                <div className="h-[600px] w-full relative rounded-xl overflow-hidden shadow-xl bg-neutral-200 group">
                    <Image
                        src="/embarcadero-4.webp"
                        alt="San Francisco - Embarcadero"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                </div>
            </div>
        </section>
    );
}
