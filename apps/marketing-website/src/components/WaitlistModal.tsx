"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/context/ToastContext";

interface WaitlistModalProps {
    isOpen: boolean;
    onClose: () => void;
}

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

// Simplified schema to match existing fields
const WaitlistSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
});

type WaitlistValues = z.infer<typeof WaitlistSchema>;

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
    const { toast } = useToast();
    const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

    const form = useForm<WaitlistValues>({
        resolver: zodResolver(WaitlistSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
        },
    });

    // Reset when opening
    if (isOpen && status === "success" && !isOpen) {
        // Handled by onClose logic or effect
    }

    const onSubmit = async (data: WaitlistValues) => {
        setStatus("submitting");
        try {
            const { error } = await supabase
                .from("waitlist_submissions")
                .insert([
                    {
                        full_name: data.name,
                        email: data.email,
                        phone: data.phone,
                        source: "modal_popup",
                    },
                ]);

            if (error) throw error;
            setStatus("success");
            toast.success("You're in! We'll be in touch.");
            form.reset();
        } catch (error) {
            console.error("Error submitting modal form:", error);
            setStatus("idle");
            toast.error("Something went wrong. Please try again.");
        }
    };

    const handleClose = () => {
        if (status === "success") {
            setTimeout(() => setStatus("idle"), 500);
            form.reset();
        }
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="max-w-md bg-white p-0 rounded-2xl overflow-hidden">
                <DialogHeader className="sr-only">
                    <DialogTitle>Join the Waitlist</DialogTitle>
                    <DialogDescription>Be the first to know when we open doors.</DialogDescription>
                </DialogHeader>

                <div className="relative p-6 md:p-8">
                    <AnimatePresence mode="wait">
                        {status === "success" ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center py-8 space-y-6"
                            >
                                <div className="w-20 h-20 bg-[var(--accent)] rounded-full flex items-center justify-center mx-auto text-black">
                                    <Check className="w-10 h-10" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-bebas text-3xl uppercase">You're In.</h3>
                                    <p className="font-sans text-black/60">
                                        We'll text you when spots open up.
                                    </p>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="text-sm font-bold uppercase tracking-wider text-black/40 hover:text-black transition-colors"
                                >
                                    Close
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="form"
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-6"
                            >
                                <div className="space-y-1">
                                    <h2 className="font-bebas text-3xl md:text-4xl uppercase">Join the Waitlist</h2>
                                    <p className="font-sans text-sm text-black/60">
                                        Be the first to know when we open doors.
                                    </p>
                                </div>

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
                                                            className="w-full bg-gray-50 border border-gray-200 focus-visible:border-[var(--accent)] focus-visible:bg-white text-black placeholder:text-black/30 px-4 py-3 h-auto rounded-lg transition-all font-sans focus-visible:ring-0"
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
                                                            className="w-full bg-gray-50 border border-gray-200 focus-visible:border-[var(--accent)] focus-visible:bg-white text-black placeholder:text-black/30 px-4 py-3 h-auto rounded-lg transition-all font-sans focus-visible:ring-0"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="sr-only">Phone Number</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="tel"
                                                            placeholder="PHONE NUMBER"
                                                            className="w-full bg-gray-50 border border-gray-200 focus-visible:border-[var(--accent)] focus-visible:bg-white text-black placeholder:text-black/30 px-4 py-3 h-auto rounded-lg transition-all font-sans focus-visible:ring-0"
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
                                            className="w-full bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-black font-bold uppercase tracking-wider py-6 h-auto rounded-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-6 shadow-lg shadow-[var(--accent)]/20"
                                        >
                                            {status === "submitting" ? (
                                                <span className="animate-pulse flex items-center gap-2">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Saving...
                                                </span>
                                            ) : (
                                                <>
                                                    Get Early Access
                                                    <ArrowRight className="w-5 h-5" />
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </Form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    );
}
