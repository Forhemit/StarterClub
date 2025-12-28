"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Rocket, Handshake, Megaphone, Briefcase, Compass, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { completeOnboarding } from "./_actions";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Track = {
    id: string;
    title: string;
    description: string;
    icon: any;
    intent: string;
    cta: string;
    roleLabel: string;
};

const tracks: Track[] = [
    {
        id: "build_something",
        title: "Build Something",
        description: "You’re here to create, grow, or refine a real business.",
        icon: Rocket,
        intent: "member",
        cta: "Continue",
        roleLabel: "Member",
    },
    {
        id: "support_builders",
        title: "Support Builders",
        description: "You want to contribute expertise, tools, or guidance.",
        icon: Handshake,
        intent: "partner",
        cta: "Continue",
        roleLabel: "Partner",
    },
    {
        id: "amplify_brand",
        title: "Amplify a Brand",
        description: "You’re exploring ways to reach the community through experiences.",
        icon: Megaphone,
        intent: "sponsor",
        cta: "Continue",
        roleLabel: "Sponsor",
    },
    {
        id: "work_with_us",
        title: "Work with Starter Club",
        description: "You’re part of the team helping run and grow the club.",
        icon: Briefcase,
        intent: "employee",
        cta: "Continue",
        roleLabel: "Employee",
    },
];

export default function OnboardingPage() {
    const { user } = useUser();
    const { signOut } = useClerk();
    const router = useRouter();
    const [processingAutoSubmit, setProcessingAutoSubmit] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-submission handler for returning users
    const [hasAutoSubmitted, setHasAutoSubmitted] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const searchParams = new URLSearchParams(window.location.search);
        const trackParam = searchParams.get('track');

        if (trackParam && user && !processingAutoSubmit && !hasAutoSubmitted && !selectedTrack) {
            // Verify track is valid
            const validTrack = tracks.find(t => t.id === trackParam);
            if (validTrack) {
                console.log("Auto-submitting track from URL:", trackParam);
                setProcessingAutoSubmit(true);
                setHasAutoSubmitted(true);
                setSelectedTrack(trackParam);

                // Use a small delay to ensure UI updates before submission starts
                const timer = setTimeout(() => {
                    handleSubmit(trackParam);
                }, 100);

                return () => clearTimeout(timer);
            }
        }
    }, [user, processingAutoSubmit, hasAutoSubmitted, selectedTrack]);

    const handleTrackSelect = (trackId: string) => {
        setSelectedTrack(trackId);
    };

    const handleSubmit = async (trackId: string) => {
        console.log("handleSubmit called with:", trackId);

        // If user is not logged in, redirect to sign-up with return URL, OR to member onboarding if applicable
        if (!user) {
            console.log("User not logged in");

            // Special case for Member track: allow them to start onboarding before auth
            if (trackId === 'build_something') {
                console.log("Redirecting unauth member to /member-onboarding");
                window.location.href = `/member-onboarding?track=${trackId}`;
                return;
            }
            if (trackId === 'support_builders') {
                console.log("Redirecting unauth partner to /partner-onboarding");
                window.location.href = `/partner-onboarding?track=${trackId}`;
                return;
            }
            if (trackId === 'amplify_brand') {
                console.log("Redirecting unauth sponsor to /sponsor-onboarding");
                window.location.href = `/sponsor-onboarding?track=${trackId}`;
                return;
            }

            console.log("Redirecting to sign-up");
            const currentPath = window.location.pathname;
            const returnUrl = `${currentPath}?track=${trackId}`;
            // Construct the sign-up URL with the redirect_url
            const signUpUrl = `/sign-up?redirect_url=${encodeURIComponent(returnUrl)}`;
            window.location.href = signUpUrl;
            return;
        }

        setIsSubmitting(true);

        // Default values
        const track = tracks.find(t => t.id === trackId);
        if (!track) {
            console.error("Track not found:", trackId);
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData();
        formData.append("track", trackId);
        formData.append("intent", track.intent);
        formData.append("orgType", "individual"); // simplified for now

        console.log("Calling completeOnboarding server action...");
        try {
            const res = await completeOnboarding(formData);
            console.log("Server action response:", res);

            if (res.success) {
                console.log("Onboarding successful, redirecting...");
                // Force reload to pick up new metadata in middleware/layout
                if (trackId === 'build_something') {
                    console.log("Redirecting to /member-onboarding");
                    window.location.href = "/member-onboarding";
                } else if (trackId === 'support_builders') {
                    console.log("Redirecting to /partner-onboarding");
                    window.location.href = "/partner-onboarding";
                } else if (trackId === 'amplify_brand') {
                    console.log("Redirecting to /sponsor-onboarding");
                    window.location.href = "/sponsor-onboarding";
                } else {
                    console.log("Redirecting to /dashboard");
                    window.location.href = "/dashboard";
                }
            } else {
                console.error("Server action failed:", res.error);
                alert(`Onboarding failed: ${res.error}`);
                setIsSubmitting(false);
                setProcessingAutoSubmit(false);
            }
        } catch (e) {
            console.error("Exception in handleSubmit:", e);
            alert(`An error occurred: ${e}`);
            setIsSubmitting(false);
            setProcessingAutoSubmit(false);
        }
    };

    const handleExplore = async () => {
        // specific logic for explore that might also need auth check
        if (!user) {
            const currentPath = window.location.pathname;
            // exploration intent
            const returnUrl = `${currentPath}?track=explore_first`;
            // We'd probably need to handle this track in the auto-submit logic if we care about it persistence
            // For now just redirecting to sign up
            const signUpUrl = `/sign-up?redirect_url=${encodeURIComponent(returnUrl)}`;
            window.location.href = signUpUrl;
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("track", "explore_first");
        formData.append("intent", "explorer");
        formData.append("orgType", "individual");

        try {
            const res = await completeOnboarding(formData);
            if (res.success) {
                window.location.href = "/dashboard";
            }
        } catch (e) {
            console.error(e);
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="max-w-4xl w-full space-y-8">
                <div className="text-center space-y-4">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold tracking-tight"
                    >
                        Welcome to Starter Club
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-muted-foreground max-w-2xl mx-auto"
                    >
                        Choose your starting track to see what's most relevant to you.
                        <br className="hidden sm:inline" /> You can change this anytime.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {tracks.map((track, index) => (
                        <motion.div
                            key={track.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * (index + 1) }}
                        >
                            <Card
                                className={cn(
                                    "h-full cursor-pointer transition-all duration-300 hover:shadow-lg border-2 relative overflow-hidden group",
                                    selectedTrack === track.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                                )}
                                onClick={() => handleTrackSelect(track.id)}
                            >
                                {selectedTrack === track.id && (
                                    <div className="absolute top-2 right-2 text-primary">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                )}
                                <CardHeader>
                                    <div className={cn(
                                        "p-3 w-fit rounded-xl mb-4 transition-colors",
                                        selectedTrack === track.id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground group-hover:bg-primary/10"
                                    )}>
                                        <track.icon className="w-6 h-6" />
                                    </div>
                                    <CardTitle className="text-xl">{track.title}</CardTitle>
                                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mt-1">{track.roleLabel} Track</p>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base leading-relaxed">
                                        {track.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col items-center space-y-4 pt-8 relative z-20"
                >
                    <Button
                        size="lg"
                        className={cn(
                            "w-full max-w-sm text-lg h-12 transition-all duration-500 relative z-30",
                            selectedTrack && "bg-green-600 hover:bg-green-700 text-white"
                        )}
                        disabled={!selectedTrack || isSubmitting}
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('Continue clicked', selectedTrack);
                            if (selectedTrack) handleSubmit(selectedTrack);
                        }}
                    >
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {selectedTrack ? tracks.find(t => t.id === selectedTrack)?.cta : "Select a Track"}
                        {!isSubmitting && <ArrowRight className="ml-2 w-4 h-4" />}
                    </Button>

                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleExplore}
                        className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-colors flex items-center cursor-pointer relative z-30"
                    >
                        <Compass className="w-4 h-4 mr-2" />
                        Just explore for now
                    </button>
                </motion.div>
            </div>

            <div className="fixed top-4 left-4 md:top-8 md:left-8 z-50 pointer-events-auto">
                <Link
                    href="/"
                    onClick={async (e) => {
                        e.stopPropagation();
                        console.log("Sign out clicked (Link)");
                        try {
                            await signOut();
                            console.log("Sign out successful");
                        } catch (err) {
                            console.error("Sign out error", err);
                        }
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center cursor-pointer bg-background/80 backdrop-blur-sm px-3 py-2 rounded-full border border-border/50 hover:bg-background hover:border-border shadow-sm"
                >
                    <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
