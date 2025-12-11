import Image from "next/image";

export function SpacesSection() {
    return (
        <section className="w-full py-24 bg-white text-black">
            <div className="w-full max-w-7xl mx-auto px-6">
                {/* HEADER */}
                <div className="max-w-3xl mb-16">
                    <h2 className="font-bebas text-5xl md:text-6xl uppercase tracking-tighter mb-6 leading-[0.9]">
                        Spaces Designed for Your Success
                    </h2>
                    <p className="font-sans text-lg text-black/70 leading-relaxed">
                        At Starter Club, every room has a purpose, and every purpose has a room. Whether you’re here to spark conversations, build something brilliant, or disappear into deep focus, we’ve shaped our spaces around the way real Starters actually work.
                    </p>
                </div>

                {/* 3 COLUMN GRID */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-20">

                    {/* COL 1: Meet & Greet */}
                    <div className="flex flex-col space-y-6">
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100">
                            <Image
                                src="/CommonsArea.png"
                                alt="Meet and Greet Commons Area"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-bebas text-3xl uppercase tracking-wide">Meet & Greet</h3>
                            <p className="font-sans text-base text-black/70 leading-relaxed">
                                <strong className="block text-black mb-2">Some ideas don’t show up until you bump into the right person.</strong>
                                Our open, social zones are designed for organic collisions—where members meet other members, founders meet builders, and great conversations turn into even greater momentum. Pull up a chair, join a chat, or just listen in. This is where community sparks.
                            </p>
                        </div>
                    </div>

                    {/* COL 2: Collaborate & Co-Create */}
                    <div className="flex flex-col space-y-6">
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100">
                            <Image
                                src="/ColabborateSection.jpg"
                                alt="Collaborate and Co-Create Area"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-bebas text-3xl uppercase tracking-wide">Collaborate & Co-Create</h3>
                            <p className="font-sans text-base text-black/70 leading-relaxed">
                                <strong className="block text-black mb-2">When you’re ready to roll up your sleeves, head into our collaboration spaces.</strong>
                                These rooms are built for whiteboards full of scribbles, “wait, hear me out…” moments, and the kind of teamwork that makes ideas real. Bring a partner, a small team, or a fellow Starter—every space is engineered to help you workshop, iterate, and build.
                            </p>
                        </div>
                    </div>

                    {/* COL 3: Focus & Get it Done */}
                    <div className="flex flex-col space-y-6">
                        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100">
                            <Image
                                src="/FocusArea.jpg"
                                alt="Focus and Deep Work Area"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-bebas text-3xl uppercase tracking-wide">Focus & Get it Done</h3>
                            <p className="font-sans text-base text-black/70 leading-relaxed">
                                <strong className="block text-black mb-2">Sometimes the world needs to disappear so your work can finally show up.</strong>
                                Our focus zones give you the quiet, calm environment you need for deep work—because breakthrough insights rarely happen in noisy hallways. Settle in, breathe, and make progress without interruption.
                            </p>
                        </div>
                    </div>

                </div>

                {/* BOTTOM SECTION */}
                <div className="w-full bg-black/5 p-8 md:p-12 rounded-xl border border-black/10">
                    <div className="max-w-4xl">
                        <h3 className="font-bebas text-3xl md:text-4xl uppercase tracking-wide mb-4">
                            Tools in Every Room, Support in Every Corner
                        </h3>
                        <p className="font-sans text-lg text-black/70 leading-relaxed">
                            No matter where you are—meeting, collaborating, or focusing—you’ll find the tech, tools, and resources you need to move forward. Screens, whiteboards, super-stations, creator rooms, learning tools… we’ve stocked the building so you can stay in flow and get things done.
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}
