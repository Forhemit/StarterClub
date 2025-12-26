"use client";

import { ComponentType } from "react";

import { SectionWrapperProps } from "./shared/SectionWrapper";

// Critical Above-the-Fold Components (Static Import)
import { BrandingHeader } from "./sections/BrandingHeader";
import { HeroSection } from "./sections/HeroSection";

import { IdentitySection } from "@/components/IdentitySection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { IdeaRealityGapSection } from "@/components/IdeaRealityGapSection";
import { InfinityDivider } from "@/components/InfinityDivider";
import { SpacesSection } from "@/components/SpacesSection";
import { BenefitsGrid } from "@/components/BenefitsGrid";
import { BenefitCorpSection } from "@/components/BenefitCorpSection";
import { InsidersAreaSection } from "@/components/InsidersAreaSection";
import { MembershipTiers } from "@/components/MembershipTiers";
import { PartnersSection } from "@/components/PartnersSection";
import { PreLaunchInvitation } from "@/components/PreLaunchInvitation";
import { TeaserCards } from "@/components/TeaserCards";
import { FoundingMemberCTA } from "@/components/FoundingMemberCTA";

import { ActionSection } from "./sections/ActionSection";

// Content Injection Components
import { ProblemAgitation } from "@/components/content-injection/ProblemAgitation";
import { SolutionStack } from "@/components/content-injection/SolutionStack";
import { PBCTrust } from "@/components/content-injection/PBCTrust";
import { FreeOffer } from "@/components/content-injection/FreeOffer";
import { SocialProof } from "@/components/content-injection/SocialProof";


export interface SectionConfig {
    id: string;
    component: ComponentType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    name: string;
    enabled: boolean;
    order: number;
    containerType?: SectionWrapperProps["containerType"];
    className?: string;
    props?: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const homeSections: SectionConfig[] = [
    {
        id: "branding",
        component: BrandingHeader,
        name: "Branding Header",
        enabled: true,
        order: 10,
        containerType: "contained",
        className: "pt-12",
    },
    {
        id: "hero",
        component: HeroSection,
        name: "Hero Section",
        enabled: true,
        order: 20,
        containerType: "contained",
        // Hero has bottom margin inside component
    },
    {
        id: "problem-agitation",
        component: ProblemAgitation,
        name: "Problem Agitation",
        enabled: true,
        order: 21,
        containerType: "contained",
    },
    {
        id: "solution-stack",
        component: SolutionStack,
        name: "Solution Stack",
        enabled: true,
        order: 22,
        containerType: "contained",
    },
    {
        id: "pbc-trust",
        component: PBCTrust,
        name: "PBC Trust",
        enabled: true,
        order: 23,
        containerType: "contained",
    },
    {
        id: "free-offer",
        component: FreeOffer,
        name: "Free Offer",
        enabled: true,
        order: 24,
        containerType: "contained",
    },
    {
        id: "social-proof",
        component: SocialProof,
        name: "Social Proof",
        enabled: true,
        order: 25,
        containerType: "contained",
    },
    {
        id: "identity",
        component: IdentitySection,
        name: "Identity / Location",
        enabled: true,
        order: 30,
        containerType: "none",
    },
    {
        id: "idea-gap",
        component: IdeaRealityGapSection,
        name: "Idea Reality Gap",
        enabled: true,
        order: 40,
        containerType: "contained",
    },
    {
        id: "cta-1",
        component: FoundingMemberCTA,
        name: "Founding Member CTA 1",
        enabled: true,
        order: 50,
        containerType: "contained",
    },
    {
        id: "divider",
        component: InfinityDivider,
        name: "Infinity Divider",
        enabled: true,
        order: 60,
        containerType: "contained",
    },
    {
        id: "spaces",
        component: SpacesSection,
        name: "Spaces Section",
        enabled: true,
        order: 70,
        containerType: "contained",
    },
    {
        id: "benefits",
        component: BenefitsGrid,
        name: "Benefits Grid",
        enabled: true,
        order: 80,
        containerType: "contained",
    },
    {
        id: "cta-2",
        component: FoundingMemberCTA,
        name: "Founding Member CTA 2",
        enabled: true,
        order: 90,
        containerType: "contained",
    },
    {
        id: "benefit-corp",
        component: BenefitCorpSection,
        name: "Benefit Corp Section",
        enabled: true,
        order: 100,
        containerType: "contained",
        // Note: Originally marked as FULL WIDTH in comments but inside container
    },
    {
        id: "how-it-works",
        component: HowItWorksSection,
        name: "How It Works",
        enabled: true,
        order: 105,
        containerType: "contained",
    },
    {
        id: "insiders",
        component: InsidersAreaSection,
        name: "Insiders Area",
        enabled: true,
        order: 110,
        containerType: "contained",
    },
    {
        id: "membership",
        component: MembershipTiers,
        name: "Membership Tiers",
        enabled: true,
        order: 120,
        containerType: "contained",
        // Needs onWaitlistOpen prop - handled by HomePage injection
    },
    {
        id: "partners",
        component: PartnersSection,
        name: "Partners Section",
        enabled: true,
        order: 130,
        containerType: "contained",
    },
    {
        id: "prelaunch",
        component: PreLaunchInvitation,
        name: "Pre-Launch Invitation",
        enabled: true,
        order: 140,
        containerType: "contained",
    },
    {
        id: "teasers",
        component: TeaserCards,
        name: "Teaser Cards",
        enabled: true,
        order: 150,
        containerType: "contained",
        className: "mb-24 md:mb-32", // Adding wrapper margin from original
    },
    {
        id: "action",
        component: ActionSection,
        name: "Action / Waitlist",
        enabled: true,
        order: 160,
        containerType: "contained",
    },
];
