"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/context/ToastContext";

export function PartnerInquiryForm({ onSuccess }: { onSuccess: () => void }) {
    const { toast } = useToast();
    const [status, setStatus] = useState<"idle" | "submitting">("idle");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        organization: "",
        message: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");

        try {
            const { error } = await supabase
                .from("partner_inquiries")
                .insert([
                    {
                        full_name: formData.name,
                        email: formData.email,
                        organization: formData.organization,
                        message: formData.message,
                    },
                ]);

            if (error) throw error;

            onSuccess();
            setStatus("idle");
            setFormData({ name: "", email: "", organization: "", message: "" }); // Clear form
            toast.success("Request invitation sent!");
        } catch (error) {
            console.error("Error submitting partner form:", error);
            setStatus("idle");
            alert("Something went wrong. Please try again.");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4" data-custom-toast="true">
            <div>
                <label htmlFor="partner-name" className="sr-only">Name</label>
                <input
                    type="text"
                    name="name"
                    id="partner-name"
                    required
                    placeholder="YOUR NAME"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[var(--accent)] focus:bg-white text-black placeholder:text-black/30 px-4 py-3 rounded-lg outline-none transition-all font-sans"
                />
            </div>
            <div>
                <label htmlFor="partner-email" className="sr-only">Work Email</label>
                <input
                    type="email"
                    name="email"
                    id="partner-email"
                    required
                    placeholder="WORK EMAIL"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[var(--accent)] focus:bg-white text-black placeholder:text-black/30 px-4 py-3 rounded-lg outline-none transition-all font-sans"
                />
            </div>
            <div>
                <label htmlFor="partner-org" className="sr-only">Organization</label>
                <input
                    type="text"
                    name="organization"
                    id="partner-org"
                    required
                    placeholder="ORGANIZATION"
                    value={formData.organization}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[var(--accent)] focus:bg-white text-black placeholder:text-black/30 px-4 py-3 rounded-lg outline-none transition-all font-sans"
                />
            </div>
            <div>
                <label htmlFor="partner-message" className="sr-only">Vision / Message</label>
                <textarea
                    name="message"
                    id="partner-message"
                    required
                    rows={4}
                    placeholder="TELL US ABOUT YOUR VISION..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[var(--accent)] focus:bg-white text-black placeholder:text-black/30 px-4 py-3 rounded-lg outline-none transition-all font-sans resize-none"
                />
            </div>

            <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full bg-black text-white hover:bg-black/80 font-bold uppercase tracking-wider py-4 rounded-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-6 shadow-lg"
            >
                {status === "submitting" ? (
                    <span className="animate-pulse">Sending...</span>
                ) : (
                    <>
                        Request Invitation
                        <ArrowRight className="w-5 h-5" />
                    </>
                )}
            </button>
        </form>
    );
}
