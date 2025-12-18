"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/context/ToastContext";
import { checkRateLimit, recordSubmission } from "@/lib/rateLimit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const WaitlistSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    identity: z.string().min(1, "This field is required"),
});

type WaitlistValues = z.infer<typeof WaitlistSchema>;

export function WaitlistForm() {
    const { toast } = useToast();
    const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

    const form = useForm<WaitlistValues>({
        resolver: zodResolver(WaitlistSchema),
        defaultValues: {
            name: "",
            email: "",
            identity: "",
        },
    });

    const onSubmit = async (data: WaitlistValues) => {
        // Rate limit check
        const { allowed } = checkRateLimit('waitlist');
        if (!allowed) {
            toast.error("Too many submissions. Please try again later.");
            return;
        }

        setStatus("submitting");

        try {
            const { error } = await supabase
                .from("waitlist_submissions")
                .insert([
                    {
                        full_name: data.name,
                        email: data.email,
                        project_idea: data.identity,
                        source: "main_form",
                    },
                ]);

            if (error) throw error;
            recordSubmission('waitlist');
            setStatus("success");
            toast.success("You're on the list!");
            form.reset();
        } catch (error) {
            console.error("Error submitting waitlist form:", error);
            setStatus("idle");
            // Optionally set an error state here to show to user
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <AnimatePresence mode="wait">
                {status === "success" ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center space-y-6 bg-black/5 border border-black/10 p-8 rounded-2xl backdrop-blur-md"
                    >
                        <div className="w-16 h-16 bg-[var(--accent)] rounded-full flex items-center justify-center mx-auto text-black mb-4">
                            <Check className="w-8 h-8" />
                        </div>
                        <h3 className="font-bebas text-3xl md:text-4xl text-black uppercase">
                            You're on the list.
                        </h3>
                        <p className="font-sans text-black/80">
                            The comeback starts with you. We are currently curating our Founding 100 members.
                        </p>
                        <div className="pt-4 space-y-3">
                            <p className="text-xs uppercase tracking-widest text-black/50">Want to skip the line?</p>
                            <button
                                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent("I just joined the Starter Club. SF is back. #StartHere")}`, "_blank")}
                                className="w-full py-3 px-4 bg-black/5 hover:bg-black/10 text-black font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                            >
                                Share on X / Twitter
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="form"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-custom-toast="true">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="sr-only">Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="YOUR NAME"
                                                    className="w-full bg-white border border-black/10 focus-visible:border-[var(--accent)] text-black placeholder:text-black/40 px-4 py-3 h-auto rounded-lg transition-colors font-sans focus-visible:ring-1 focus-visible:ring-[var(--accent)]/50"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="sr-only">Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="YOUR EMAIL"
                                                    className="w-full bg-white border border-black/10 focus-visible:border-[var(--accent)] text-black placeholder:text-black/40 px-4 py-3 h-auto rounded-lg transition-colors font-sans focus-visible:ring-1 focus-visible:ring-[var(--accent)]/50"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="identity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="sr-only">What are you starting?</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="WHAT ARE YOU STARTING? (e.g. A Tech Co, Run Club...)"
                                                    className="w-full bg-white border border-black/10 focus-visible:border-[var(--accent)] text-black placeholder:text-black/40 px-4 py-3 h-auto rounded-lg transition-colors font-sans focus-visible:ring-1 focus-visible:ring-[var(--accent)]/50"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    disabled={status === "submitting"}
                                    className="group w-full bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-black font-bold uppercase tracking-wider py-6 px-6 h-auto rounded-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4 shadow-lg shadow-[var(--accent)]/20"
                                >
                                    {status === "submitting" ? (
                                        <span className="animate-pulse flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Loading...
                                        </span>
                                    ) : (
                                        <>
                                            Join The Movement
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
