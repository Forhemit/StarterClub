"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/context/ToastContext";

export function WaitlistForm() {
    const { toast } = useToast();
    const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        identity: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");

        try {
            const { error } = await supabase
                .from("waitlist_submissions")
                .insert([
                    {
                        full_name: formData.name,
                        email: formData.email,
                        project_idea: formData.identity,
                        source: "main_form",
                    },
                ]);

            if (error) throw error;
            setStatus("success");
            toast.success("You're on the list!");
        } catch (error) {
            console.error("Error submitting waitlist form:", error);
            setStatus("idle");
            // Optionally set an error state here to show to user
            alert("Something went wrong. Please try again.");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
                    <motion.form
                        key="form"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        onSubmit={handleSubmit}
                        data-custom-toast="true"
                        className="space-y-4"
                    >
                        <div>
                            <label htmlFor="name" className="sr-only">Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                required
                                placeholder="YOUR NAME"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-white border border-black/10 focus:border-[var(--accent)] text-black placeholder:text-black/40 px-4 py-3 rounded-lg outline-none transition-colors font-sans focus:ring-1 focus:ring-[var(--accent)]/50"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                placeholder="YOUR EMAIL"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-white border border-black/10 focus:border-[var(--accent)] text-black placeholder:text-black/40 px-4 py-3 rounded-lg outline-none transition-colors font-sans focus:ring-1 focus:ring-[var(--accent)]/50"
                            />
                        </div>
                        <div>
                            <label htmlFor="identity" className="sr-only">What are you starting?</label>
                            <input
                                type="text"
                                name="identity"
                                id="identity"
                                required
                                placeholder="WHAT ARE YOU STARTING? (e.g. A Tech Co, Run Club...)"
                                value={formData.identity}
                                onChange={handleChange}
                                className="w-full bg-white border border-black/10 focus:border-[var(--accent)] text-black placeholder:text-black/40 px-4 py-3 rounded-lg outline-none transition-colors font-sans focus:ring-1 focus:ring-[var(--accent)]/50"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === "submitting"}
                            className="group w-full bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-black font-bold uppercase tracking-wider py-4 px-6 rounded-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4 shadow-lg shadow-[var(--accent)]/20"
                        >
                            {status === "submitting" ? (
                                <span className="animate-pulse">Loading...</span>
                            ) : (
                                <>
                                    Join The Movement
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
}
