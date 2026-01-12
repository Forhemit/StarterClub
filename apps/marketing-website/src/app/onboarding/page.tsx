'use client';

import { useState, useTransition, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { completeOnboarding, skipOnboarding } from './actions';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';
import { ArrowRight, Check, Rocket, Users, Target, Briefcase, Eye, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const TRACKS = [
    {
        id: 'builder',
        title: 'Build Something',
        description: 'You’re here to create, grow, or refine a real business. We’ll point you to tools, rooms, and people that help you move forward.',
        image: '/onboarding/build_something.png',
        icon: Rocket,
        color: 'oklch(0.72 0.18 45)', // Racing Orange
        suggestedRole: 'member',
    },
    {
        id: 'partner',
        title: 'Support Builders',
        description: 'You want to contribute expertise, tools, or guidance to help members succeed. We’ll show you where you can plug in and make an impact.',
        image: '/onboarding/support_builders.png',
        icon: Users,
        color: 'oklch(0.85 0.18 195)', // Cyan Telemetry
        suggestedRole: 'partner',
    },
    {
        id: 'sponsor',
        title: 'Amplify a Brand',
        description: 'You’re exploring ways to reach the Starter Club community through meaningful experiences. We’ll highlight visibility opportunities and real engagement.',
        image: '/onboarding/amplify_brand.png',
        icon: Target,
        color: 'oklch(0.65 0.2 145)', // Success Green
        suggestedRole: 'sponsor',
    },
    {
        id: 'staff',
        title: 'Work with Starter Club',
        description: 'You’re part of the team helping run and grow the club. We’ll route you to the tools that keep everything moving smoothly.',
        image: '/onboarding/work_with_club.png',
        icon: Briefcase,
        color: 'oklch(0.75 0.18 70)', // Warning/Gold
        suggestedRole: 'employee',
    },
    {
        id: 'explore',
        title: 'Explore First',
        description: 'You’re getting a feel for the community before diving in. Take a look around—you can choose a track anytime.',
        image: '/onboarding/explore_first.png',
        icon: Eye,
        color: 'oklch(0.93 0 0)', // Neutral/White
        suggestedRole: 'guest',
    },
];

const PARTICIPATION_OPTIONS = [
    { id: 'learn', label: 'Learn & attend' },
    { id: 'build', label: 'Build & execute' },
    { id: 'host', label: 'Host or partner' },
    { id: 'observe', label: 'Observe for now' },
];

const ORG_OPTIONS = [
    { id: 'yes', label: 'Yes' },
    { id: 'no', label: 'No' },
    { id: 'unsure', label: 'Not sure yet' },
];

export default function OnboardingPage() {
    const { user, isLoaded } = useUser();
    const [step, setStep] = useState(1);
    const [isPending, startTransition] = useTransition();

    const [primaryIntent, setPrimaryIntent] = useState<string>('');
    const [participation, setParticipation] = useState<string>('');
    const [orgAffiliation, setOrgAffiliation] = useState<string>('');

    // Force racetrack theme properties for this page
    useEffect(() => {
        document.documentElement.classList.add('racetrack');
        return () => {
            // We don't necessarily want to remove it if that's their chosen theme, 
            // but for this flow we definitely want it.
        };
    }, []);

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
        else handleSubmit();
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async () => {
        startTransition(async () => {
            try {
                const selectedTrack = TRACKS.find(t => t.id === primaryIntent);
                const suggestedRoles = selectedTrack?.suggestedRole ? [selectedTrack.suggestedRole] : ['guest'];
                const primaryRole = selectedTrack?.suggestedRole || 'guest';

                await completeOnboarding(
                    suggestedRoles,
                    primaryRole,
                    [],
                    primaryIntent,
                    participation,
                    orgAffiliation
                );

                toast({
                    title: "Welcome to Starter Club!",
                    description: "Redirecting you to your personalized dashboard.",
                });

                window.location.href = '/dashboard';
            } catch (error) {
                console.error('Onboarding error:', error);
                toast({
                    title: "Error",
                    description: "Failed to save your preferences. Please try again.",
                    variant: "destructive"
                });
            }
        });
    };

    const handleSkip = () => {
        startTransition(async () => {
            try {
                // Skip onboarding means setting a default role (e.g., 'guest')
                // and marking onboarding as complete without specific selections.
                await skipOnboarding();
                toast({
                    title: "Skipped Onboarding",
                    description: "You can set your preferences later.",
                });
                window.location.href = '/dashboard';
            } catch (error) {
                console.error('Skip error:', error);
                toast({
                    title: "Error",
                    description: "Failed to skip onboarding. Please try again.",
                    variant: "destructive"
                });
            }
        });
    };

    if (!isLoaded) return null;

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans overflow-hidden flex flex-col">
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 bg-muted overflow-hidden z-50">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${(step / 3) * 100}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                />
            </div>

            <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="w-full max-w-5xl"
                        >
                            <div className="text-center mb-12">
                                <h1 className="text-6xl md:text-8xl font-bold uppercase tracking-tighter mb-4">
                                    Choose Your Track
                                </h1>
                                <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto">
                                    Answer a few quick questions so we can point you in the right direction.
                                    <span className="block mt-2 text-sm opacity-60">You can change this anytime.</span>
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                {TRACKS.map((track) => (
                                    <motion.button
                                        key={track.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setPrimaryIntent(track.id)}
                                        className={cn(
                                            "relative aspect-[3/4] rounded-none border-2 transition-all p-6 text-left group overflow-hidden flex flex-col justify-end",
                                            primaryIntent === track.id
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/50 bg-card"
                                        )}
                                    >
                                        <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity">
                                            <Image
                                                src={track.image}
                                                alt={track.title}
                                                fill
                                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                                        </div>

                                        <div className="relative z-10">
                                            <track.icon
                                                className="w-8 h-8 mb-4 transition-colors"
                                                style={{ color: primaryIntent === track.id ? track.color : 'inherit' }}
                                            />
                                            <h3 className="text-2xl font-bold uppercase tracking-tight mb-2 leading-none">
                                                {track.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                                                {track.description}
                                            </p>
                                        </div>

                                        {primaryIntent === track.id && (
                                            <motion.div
                                                layoutId="selected-check"
                                                className="absolute top-4 right-4 bg-primary text-primary-foreground p-1"
                                            >
                                                <Check size={16} />
                                            </motion.div>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="w-full max-w-2xl text-center"
                        >
                            <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-8 italic">
                                How would you like to participate today?
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                {PARTICIPATION_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setParticipation(opt.id)}
                                        className={cn(
                                            "py-6 px-8 text-2xl font-bold uppercase tracking-tight border-2 transition-all",
                                            participation === opt.id
                                                ? "border-accent bg-accent text-accent-foreground shadow-[4px_4px_0px_var(--primary)]"
                                                : "border-border hover:border-accent/50 bg-card text-foreground"
                                        )}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="w-full max-w-2xl text-center"
                        >
                            <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-8 italic">
                                Are you here as part of an organization?
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                {ORG_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setOrgAffiliation(opt.id)}
                                        className={cn(
                                            "py-6 px-8 text-2xl font-bold uppercase tracking-tight border-2 transition-all",
                                            orgAffiliation === opt.id
                                                ? "border-primary bg-primary text-primary-foreground shadow-[4px_4px_0px_var(--accent)]"
                                                : "border-border hover:border-primary/50 bg-card text-foreground"
                                        )}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Sticky Navigation Footer */}
            <footer className="p-8 flex flex-col sm:flex-row items-center justify-between border-t border-border bg-background/80 backdrop-blur-md z-40">
                <button
                    onClick={handleSkip}
                    className="text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest text-xs font-bold mb-4 sm:mb-0"
                >
                    Explore first
                </button>

                <div className="flex items-center gap-4">
                    {step > 1 && (
                        <button
                            onClick={handleBack}
                            className="p-4 border border-border hover:bg-muted transition-colors flex items-center justify-center"
                        >
                            <ChevronLeft size={24} />
                        </button>
                    )}

                    <button
                        onClick={handleNext}
                        disabled={
                            isPending ||
                            (step === 1 && !primaryIntent) ||
                            (step === 2 && !participation) ||
                            (step === 3 && !orgAffiliation)
                        }
                        className={cn(
                            "group flex items-center gap-3 py-4 px-8 text-xl font-bold uppercase tracking-tighter transition-all",
                            isPending ? "opacity-50 cursor-not-allowed" : "bg-primary text-primary-foreground hover:translate-x-1"
                        )}
                    >
                        {step === 3 ? (isPending ? 'Unlocking...' : 'Continue') : 'Next'}
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </footer>
        </div>
    );
}
