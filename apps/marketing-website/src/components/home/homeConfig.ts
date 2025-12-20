"use client";

import { ComponentType } from "react";
import dynamic from "next/dynamic";
import { SectionWrapperProps } from "./shared/SectionWrapper";

// Critical Above-the-Fold Components (Static Import)
import { BrandingHeader } from "./sections/BrandingHeader";
import { HeroSection } from "./sections/HeroSection";

// Dynamic Imports for Below-the-Fold Components
const IdentitySection = dynamic(() => import("@/components/IdentitySection").then(mod => mod.IdentitySection), {
    loading: () => null
});
const HowItWorksSection = dynamic(() => import("@/components/HowItWorksSection").then(mod => mod.HowItWorksSection));
const IdeaRealityGapSection = dynamic(() => import("@/components/IdeaRealityGapSection").then(mod => mod.IdeaRealityGapSection));
const InfinityDivider = dynamic(() => import("@/components/InfinityDivider").then(mod => mod.InfinityDivider));
const SpacesSection = dynamic(() => import("@/components/SpacesSection").then(mod => mod.SpacesSection));
const BenefitsGrid = dynamic(() => import("@/components/BenefitsGrid").then(mod => mod.BenefitsGrid));
const BenefitCorpSection = dynamic(() => import("@/components/BenefitCorpSection").then(mod => mod.BenefitCorpSection));
const InsidersAreaSection = dynamic(() => import("@/components/InsidersAreaSection").then(mod => mod.InsidersAreaSection));
const MembershipTiers = dynamic(() => import("@/components/MembershipTiers").then(mod => mod.MembershipTiers));
const PartnersSection = dynamic(() => import("@/components/PartnersSection").then(mod => mod.PartnersSection));
const PreLaunchInvitation = dynamic(() => import("@/components/PreLaunchInvitation").then(mod => mod.PreLaunchInvitation));
const TeaserCards = dynamic(() => import("@/components/TeaserCards").then(mod => mod.TeaserCards));
const FoundingMemberCTA = dynamic(() => import("@/components/FoundingMemberCTA").then(mod => mod.FoundingMemberCTA));
const ActionSection = dynamic(() => import("./sections/ActionSection").then(mod => mod.ActionSection));


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
