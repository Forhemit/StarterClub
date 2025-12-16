"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/context/ToastContext";

interface WaitlistModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
    const { toast } = useToast();
    const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
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
                        phone: formData.phone,
                        source: "modal_popup",
                    },
                ]);

            if (error) throw error;
            setStatus("success");
            toast.success("You're in! We'll be in touch.");
        } catch (error) {
            console.error("Error submitting modal form:", error);
            setStatus("idle");
            alert("Something went wrong. Please try again.");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Reset form when modal closes (optional, but good UX)
    const handleClose = () => {
        if (status === "success") {
            setTimeout(() => setStatus("idle"), 500);
            setFormData({ name: "", email: "", phone: "" });
        }
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-md rounded-2xl shadow-2xl pointer-events-auto overflow-hidden border border-black/5"
                        >
                            <div className="relative p-6 md:p-8">
                                {/* Close Button */}
                                <button
                                    onClick={handleClose}
                                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 transition-colors text-black/40 hover:text-black"
                                >
                                    <X className="w-5 h-5" />
                                </button>

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
                                        >
                                            <div className="mb-8 space-y-1">
                                                <h2 className="font-bebas text-3xl md:text-4xl uppercase">Join the Waitlist</h2>
                                                <p className="font-sans text-sm text-black/60">
                                                    Be the first to know when we open doors.
                                                </p>
                                            </div>

                                            <form onSubmit={handleSubmit} className="space-y-4" data-custom-toast="true">
                                                <div>
                                                    <label htmlFor="modal-name" className="sr-only">Name</label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        id="modal-name"
                                                        required
                                                        placeholder="YOUR NAME"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        className="w-full bg-gray-50 border border-gray-200 focus:border-[var(--accent)] focus:bg-white text-black placeholder:text-black/30 px-4 py-3 rounded-lg outline-none transition-all font-sans"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="modal-email" className="sr-only">Email</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        id="modal-email"
                                                        required
                                                        placeholder="YOUR EMAIL"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        className="w-full bg-gray-50 border border-gray-200 focus:border-[var(--accent)] focus:bg-white text-black placeholder:text-black/30 px-4 py-3 rounded-lg outline-none transition-all font-sans"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="modal-phone" className="sr-only">Phone Number</label>
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        id="modal-phone"
                                                        required
                                                        placeholder="PHONE NUMBER"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        className="w-full bg-gray-50 border border-gray-200 focus:border-[var(--accent)] focus:bg-white text-black placeholder:text-black/30 px-4 py-3 rounded-lg outline-none transition-all font-sans"
                                                    />
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={status === "submitting"}
                                                    className="w-full bg-[var(--accent)] hover:bg-[var(--accent)]/90 text-black font-bold uppercase tracking-wider py-4 rounded-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-6 shadow-lg shadow-[var(--accent)]/20"
                                                >
                                                    {status === "submitting" ? (
                                                        <span className="animate-pulse">Saving...</span>
                                                    ) : (
                                                        <>
                                                            Get Early Access
                                                            <ArrowRight className="w-5 h-5" />
                                                        </>
                                                    )}
                                                </button>
                                            </form>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
