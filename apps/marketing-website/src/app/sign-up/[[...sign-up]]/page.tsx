"use client";

import SignUpForm from "@/components/auth/SignUpForm";
import MembershipSelection from "@/components/auth/MembershipSelection";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function SignUpPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50/50">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const track = searchParams.get("track");
    const intent = searchParams.get("intent");
    const plan = searchParams.get("plan");

    // Case 1: Member Track - Needs to select a plan first
    if ((track === "build_something" || intent === "member") && !plan) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50/50">
                <MembershipSelection onSelect={(selectedPlan) => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("plan", selectedPlan);
                    router.push(`/sign-up?${params.toString()}`);
                }} />
            </div>
        );
    }

    // Case 2: Member Track - Plan selected, show sign up
    if ((track === "build_something" || intent === "member") && plan) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50/50">
                <SignUpForm
                    title="MEMBER REGISTRATION"
                    subtitle={`Sign up for the ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`}
                    plan={plan}
                    intent="member"
                    track="build_something"
                />
            </div>
        );
    }

    // Case 3: Partner/Sponsor check
    if (intent === "partner" || track === "support_builders") {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50/50">
                <SignUpForm
                    title="PARTNER ACCESS"
                    subtitle="Partner Application"
                    intent="partner"
                    track={track || "support_builders"}
                />
            </div>
        );
    }

    // Default Fallback
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50/50">
            <SignUpForm
                title="JOIN THE CLUB"
                subtitle="Create your account"
                intent={intent || undefined}
                track={track || undefined}
            />
        </div>
    );
}
