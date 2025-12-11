"use client";

import { useState } from "react";
import { BackgroundLayer } from "@/components/BackgroundLayer";
import { BenefitsGrid } from "@/components/BenefitsGrid";
import { HeroCarousel } from "@/components/HeroCarousel";
import { RotatingText } from "@/components/RotatingText";
import { TeaserCards } from "@/components/TeaserCards";
import { WaitlistForm } from "@/components/WaitlistForm";
import { WaitlistModal } from "@/components/WaitlistModal";
import { BenefitCorpSection } from "@/components/BenefitCorpSection";
import { InsidersAreaSection } from "@/components/InsidersAreaSection";
import { IdentitySection } from "@/components/IdentitySection";
import { MembershipTiers } from "@/components/MembershipTiers";

import { IdeaRealityGapSection } from "@/components/IdeaRealityGapSection";
import { InfinityDivider } from "@/components/InfinityDivider";
import { PartnersSection } from "@/components/PartnersSection";
import { SpacesSection } from "@/components/SpacesSection";
import { FoundingMemberCTA } from "@/components/FoundingMemberCTA";
import { PreLaunchInvitation } from "@/components/PreLaunchInvitation";
import { Footer } from "@/components/Footer";

import Image from "next/image";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="relative min-h-screen text-black selection:bg-[var(--accent)] selection:text-white flex flex-col items-center">
      <BackgroundLayer />
      <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="w-full max-w-7xl mx-auto px-6 pt-12 pb-32 flex flex-col items-center">
        {/* HEADER AREA */}
        <div className="mb-12 md:mb-20 w-full flex justify-center md:justify-start">
          <h1 className="font-bebas text-3xl md:text-4xl tracking-widest uppercase border-4 border-black inline-block px-4 py-1 bg-white/50 backdrop-blur-sm">
            Starter Club SF
          </h1>
        </div>

        {/* HERO SECTION split layout */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center mb-24 md:mb-32">
          {/* LEFT: COPY */}
          <div className="text-center md:text-left space-y-8">
            <h1 className="font-bebas text-6xl md:text-8xl leading-[0.9] md:leading-[0.85] tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-black to-black/60">
              Start a <br />
              <RotatingText />
            </h1>

            <div className="max-w-xl mx-auto md:mx-0">
              <h2 className="font-sans text-xl md:text-2xl text-black/80 leading-relaxed font-light">
                Starter Club is a place where people bring their ideas to life and dreams to reality
              </h2>
            </div>

            {/* Hero CTA */}
            <div className="pt-6 md:pt-8 flex flex-col items-center md:items-start space-y-3">
              <button
                onClick={() => setIsModalOpen(true)}
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
      </div>

      {/* IDENTITY / LOCATION SECTION */}
      <IdentitySection />



      <div className="w-full max-w-7xl mx-auto px-6 pb-32 flex flex-col items-center">

        {/* IDEA REALITY GAP SECTION */}
        <IdeaRealityGapSection />

        <FoundingMemberCTA onOpen={() => setIsModalOpen(true)} />

        {/* DIVIDER */}
        <InfinityDivider />

        {/* SPACES SECTION */}
        <SpacesSection />

        {/* BENEFITS SECTION */}
        <BenefitsGrid />

        <FoundingMemberCTA onOpen={() => setIsModalOpen(true)} />

        {/* BENEFIT CORP SECTION - FULL WIDTH */}
        <BenefitCorpSection />

        {/* INSIDERS AREA SECTION */}
        <InsidersAreaSection />

        {/* MEMBERSHIP TIERS */}
        <MembershipTiers onWaitlistOpen={() => setIsModalOpen(true)} />

        {/* PARTNERS SECTION */}
        <PartnersSection />

        {/* PRE-LAUNCH INVITATION */}
        <PreLaunchInvitation />

        {/* TEASERS */}
        <div className="w-full mb-24 md:mb-32">
          <TeaserCards />
        </div>

        {/* ACTION / WAITLIST */}
        <div className="w-full max-w-2xl mx-auto text-center space-y-8 mb-20">
          <div className="space-y-4">
            <h2 className="font-bebas text-4xl md:text-5xl uppercase tracking-wide text-black">
              Claim Your Founding Member Spot.
            </h2>
            <p className="font-sans text-black/70">
              Early access to hard-hat tours, launch party invites, and "Founder Tier" pricing.
            </p>
          </div>

          <WaitlistForm />
        </div>

      </div>

      {/* FOOTER */}
      <Footer />
    </main>
  );
}
