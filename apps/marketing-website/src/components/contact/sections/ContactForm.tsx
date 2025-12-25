"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Send,
    AlertTriangle,
    CheckCircle2,
    Ruler,
    Mic,
    Radio,
    Gauge
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

/**
 * ContactForm - Section 2: Direct Inquiry
 * 
 * Corporate Theme (Glassmorphism + Brutalist):
 * - Architectural blueprint aesthetic
 * - Golden ratio spiral layout hint
 * - Space Mono labels, inputs as metal engravings
 * - Construction grid animation on focus
 * - Document stamp on submission
 * 
 * Racing Theme (Retro-Interface 90s telemetry):
 * - Pit crew communication panel
 * - Yellow notepad with grease stains
 * - Share Tech Mono, toggle switches
 * - Pit lane light focus sequence
 * - Push-to-talk intercom submit
 */

interface FormData {
    name: string;
    email: string;
    company: string;
    message: string;
    urgent: boolean;
}

interface FormErrors {
    name?: string;
    email?: string;
    message?: string;
}

export function ContactForm() {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        company: "",
        message: "",
        urgent: false,
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [charCount, setCharCount] = useState(0);
    const formRef = useRef<HTMLFormElement>(null);

    const maxChars = 500;

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!formData.message.trim()) {
            newErrors.message = "Message is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSubmitted(true);

        // Reset after showing success
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({ name: "", email: "", company: "", message: "", urgent: false });
            setCharCount(0);
        }, 3000);
    };

    const handleInputChange = (field: keyof FormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (field === "message" && typeof value === "string") {
            setCharCount(value.length);
        }
        // Clear error when user types
        if (errors[field as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <>
            {/* ========== CORPORATE / LUXURY THEME ========== */}
            <section className="relative py-24 md:py-32 overflow-hidden block racetrack:hidden">
                {/* Blueprint Background */}
                <div className="absolute inset-0 blueprint-grid" />

                {/* Construction Scan Effect */}
                {focusedField && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="construction-scan" />
                    </div>
                )}

                <div className="relative z-10 container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        {/* Section Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 bg-white/5 text-white/70 text-xs uppercase tracking-widest mb-6">
                                <Ruler className="w-4 h-4" />
                                Blueprint Inquiry
                            </div>
                            <h2 className="font-clash text-3xl md:text-5xl font-bold text-white mb-4">
                                Draft Your <span className="text-[#ff4d00]">Request</span>
                            </h2>
                            <p className="text-white/60 max-w-xl mx-auto font-space-grotesk">
                                Every great structure starts with a blueprint. Tell us what you're building.
                            </p>
                        </motion.div>

                        {/* Form */}
                        <motion.form
                            ref={formRef}
                            onSubmit={handleSubmit}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="relative bg-black/40 backdrop-blur-sm border border-white/10 p-8 md:p-12"
                        >
                            {/* Form Grid - Golden Ratio Hint */}
                            <div className="grid md:grid-cols-[1.618fr_1fr] gap-8 mb-8">
                                {/* Left Column - Primary Fields */}
                                <div className="space-y-6">
                                    {/* Name */}
                                    <div className="relative">
                                        <Label
                                            className={`font-space-mono text-xs uppercase tracking-widest mb-2 block transition-all duration-300 ${focusedField === "name" ? "text-[#00f0ff] -translate-x-2" : "text-white/50"
                                                }`}
                                        >
                                            Full Name *
                                        </Label>
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => handleInputChange("name", e.target.value)}
                                            onFocus={() => setFocusedField("name")}
                                            onBlur={() => setFocusedField(null)}
                                            className="blueprint-input h-12 font-space-grotesk"
                                            placeholder="Enter your name"
                                        />
                                        {errors.name && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="absolute -right-2 -top-2 bg-red-500 text-white text-xs px-2 py-1 font-mono transform rotate-3"
                                            >
                                                REV: {errors.name}
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div className="relative">
                                        <Label
                                            className={`font-space-mono text-xs uppercase tracking-widest mb-2 block transition-all duration-300 ${focusedField === "email" ? "text-[#00f0ff] -translate-x-2" : "text-white/50"
                                                }`}
                                        >
                                            Email Address *
                                        </Label>
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                            onFocus={() => setFocusedField("email")}
                                            onBlur={() => setFocusedField(null)}
                                            className="blueprint-input h-12 font-space-grotesk"
                                            placeholder="your@email.com"
                                        />
                                        {errors.email && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="absolute -right-2 -top-2 bg-red-500 text-white text-xs px-2 py-1 font-mono transform -rotate-2"
                                            >
                                                REV: {errors.email}
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Message */}
                                    <div className="relative">
                                        <Label
                                            className={`font-space-mono text-xs uppercase tracking-widest mb-2 block transition-all duration-300 ${focusedField === "message" ? "text-[#00f0ff] -translate-x-2" : "text-white/50"
                                                }`}
                                        >
                                            Project Brief *
                                        </Label>
                                        <Textarea
                                            value={formData.message}
                                            onChange={(e) => handleInputChange("message", e.target.value.slice(0, maxChars))}
                                            onFocus={() => setFocusedField("message")}
                                            onBlur={() => setFocusedField(null)}
                                            className="blueprint-input min-h-[150px] font-space-grotesk resize-none"
                                            placeholder="Describe your project requirements..."
                                        />
                                        {errors.message && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="absolute -right-2 -top-2 bg-red-500 text-white text-xs px-2 py-1 font-mono transform rotate-1"
                                            >
                                                REV: {errors.message}
                                            </motion.div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column - Secondary Fields */}
                                <div className="space-y-6">
                                    {/* Company */}
                                    <div>
                                        <Label
                                            className={`font-space-mono text-xs uppercase tracking-widest mb-2 block transition-all duration-300 ${focusedField === "company" ? "text-[#00f0ff] -translate-x-2" : "text-white/50"
                                                }`}
                                        >
                                            Company
                                        </Label>
                                        <Input
                                            value={formData.company}
                                            onChange={(e) => handleInputChange("company", e.target.value)}
                                            onFocus={() => setFocusedField("company")}
                                            onBlur={() => setFocusedField(null)}
                                            className="blueprint-input h-12 font-space-grotesk"
                                            placeholder="Your company"
                                        />
                                    </div>

                                    {/* Urgent Toggle */}
                                    <div className="pt-4">
                                        <Label className="font-space-mono text-xs uppercase tracking-widest mb-4 block text-white/50">
                                            Priority Level
                                        </Label>
                                        <div className="flex items-center gap-4">
                                            <button
                                                type="button"
                                                onClick={() => handleInputChange("urgent", !formData.urgent)}
                                                className={`relative w-16 h-8 rounded transition-all border-2 ${formData.urgent
                                                        ? "bg-[#ff4d00] border-[#ff4d00]"
                                                        : "bg-black/50 border-white/20"
                                                    }`}
                                            >
                                                <motion.div
                                                    animate={{ x: formData.urgent ? 32 : 4 }}
                                                    className="absolute top-1 w-6 h-6 bg-white rounded-sm"
                                                />
                                            </button>
                                            <span className={`text-sm font-space-mono ${formData.urgent ? "text-[#ff4d00]" : "text-white/50"}`}>
                                                {formData.urgent ? "URGENT" : "Standard"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Character Counter */}
                                    <div className="pt-8">
                                        <div className="text-xs font-space-mono text-white/30 mb-2">SPEC LIMIT</div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                                <motion.div
                                                    className={`h-full ${charCount > maxChars * 0.8 ? "bg-[#ff4d00]" : "bg-[#00f0ff]"}`}
                                                    animate={{ width: `${(charCount / maxChars) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-space-mono text-white/50">
                                                {charCount}/{maxChars}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || isSubmitted}
                                    className="relative px-8 py-6 bg-[#ff4d00] hover:bg-[#ff4d00]/90 text-white font-chakra uppercase tracking-widest disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        >
                                            <Ruler className="w-5 h-5" />
                                        </motion.div>
                                    ) : isSubmitted ? (
                                        <span className="flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5" />
                                            Submitted
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Send className="w-5 h-5" />
                                            Submit Blueprint
                                        </span>
                                    )}
                                </Button>
                            </div>

                            {/* Stamp Animation on Success */}
                            <AnimatePresence>
                                {isSubmitted && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -100, rotate: -15 }}
                                        animate={{ opacity: 1, y: 0, rotate: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                                    >
                                        <div className="border-4 border-green-500 text-green-500 px-8 py-4 font-bold text-2xl uppercase tracking-widest transform rotate-[-5deg]">
                                            APPROVED
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.form>
                    </div>
                </div>
            </section>

            {/* ========== RACING / PIT CREW THEME ========== */}
            <section className="relative py-24 md:py-32 overflow-hidden hidden racetrack:block">
                {/* Notepad Background */}
                <div className="absolute inset-0 notepad-texture" />

                {/* Grease Stains */}
                <div className="grease-stain absolute top-[20%] right-[15%] w-40 h-40" />
                <div className="grease-stain absolute bottom-[30%] left-[10%] w-32 h-32" />

                <div className="relative z-10 container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        {/* Section Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <div className="inline-flex items-center gap-2 border-2 border-black bg-white px-4 py-2 text-black text-sm font-bold uppercase tracking-widest mb-6">
                                <Radio className="w-4 h-4" />
                                PIT WALL COMMS
                            </div>
                            <h2 className="font-bebas text-4xl md:text-6xl text-black uppercase tracking-tight mb-4">
                                Transmission <span className="text-[#c41e3a]">Request</span>
                            </h2>
                            <p className="text-black/60 max-w-xl mx-auto font-share-tech">
                                Fill out the clipboard. Crew chief will respond on next pit window.
                            </p>
                        </motion.div>

                        {/* Clipboard Form */}
                        <motion.form
                            ref={formRef}
                            onSubmit={handleSubmit}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="relative bg-white border-4 border-black p-6 md:p-10 shadow-[8px_8px_0_rgba(0,0,0,1)]"
                        >
                            {/* Clipboard Clip */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-gray-500 rounded-t-lg border-2 border-black" />

                            {/* Form Fields - Staggered */}
                            <div className="space-y-8 pt-4">
                                {/* Name */}
                                <div className="relative pl-12">
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">1</div>
                                    <Label className="font-share-tech text-sm uppercase tracking-widest text-black mb-2 block">
                                        Driver / Team Manager
                                    </Label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        className="h-12 border-2 border-black bg-transparent font-share-tech text-black placeholder:text-black/40 focus:ring-0 focus:border-[#c41e3a]"
                                        placeholder="Enter name..."
                                    />
                                    {errors.name && (
                                        <div className="text-[#c41e3a] text-xs font-bold mt-1 flex items-center gap-1">
                                            <AlertTriangle className="w-3 h-3" /> {errors.name}
                                        </div>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="relative pl-12">
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">2</div>
                                    <Label className="font-share-tech text-sm uppercase tracking-widest text-black mb-2 block">
                                        Radio Frequency (Email)
                                    </Label>
                                    <Input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        className="h-12 border-2 border-black bg-transparent font-share-tech text-black placeholder:text-black/40 focus:ring-0 focus:border-[#c41e3a]"
                                        placeholder="radio@frequency.com"
                                    />
                                    {errors.email && (
                                        <div className="text-[#c41e3a] text-xs font-bold mt-1 flex items-center gap-1">
                                            <AlertTriangle className="w-3 h-3" /> {errors.email}
                                        </div>
                                    )}
                                </div>

                                {/* Company */}
                                <div className="relative pl-12">
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-300 text-black flex items-center justify-center font-bold">3</div>
                                    <Label className="font-share-tech text-sm uppercase tracking-widest text-black mb-2 block">
                                        Team Name (Optional)
                                    </Label>
                                    <Input
                                        value={formData.company}
                                        onChange={(e) => handleInputChange("company", e.target.value)}
                                        className="h-12 border-2 border-black/50 bg-transparent font-share-tech text-black placeholder:text-black/40 focus:ring-0 focus:border-[#c41e3a]"
                                        placeholder="Racing team name..."
                                    />
                                </div>

                                {/* Message with RPM Counter */}
                                <div className="relative pl-12">
                                    <div className="absolute left-0 top-8 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">4</div>
                                    <div className="flex justify-between items-center mb-2">
                                        <Label className="font-share-tech text-sm uppercase tracking-widest text-black">
                                            Transmission Message
                                        </Label>
                                        {/* RPM Style Character Counter */}
                                        <div className="flex items-center gap-2">
                                            <Gauge className="w-4 h-4 text-black" />
                                            <div className="rpm-telemetry w-24">
                                                <div
                                                    className="rpm-indicator"
                                                    style={{ left: `${(charCount / maxChars) * 100}%` }}
                                                />
                                            </div>
                                            <span className="font-share-tech text-xs">{charCount}</span>
                                        </div>
                                    </div>
                                    <Textarea
                                        value={formData.message}
                                        onChange={(e) => handleInputChange("message", e.target.value.slice(0, maxChars))}
                                        className="min-h-[120px] border-2 border-black bg-transparent font-share-tech text-black placeholder:text-black/40 focus:ring-0 focus:border-[#c41e3a] resize-none"
                                        placeholder="Describe the situation on track..."
                                    />
                                    {errors.message && (
                                        <div className="text-[#c41e3a] text-xs font-bold mt-1 flex items-center gap-1">
                                            <AlertTriangle className="w-3 h-3" /> {errors.message}
                                        </div>
                                    )}
                                </div>

                                {/* Urgent Toggle - Physical Switch Style */}
                                <div className="relative pl-12">
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-300 text-black flex items-center justify-center font-bold">5</div>
                                    <Label className="font-share-tech text-sm uppercase tracking-widest text-black mb-3 block">
                                        Priority Flag
                                    </Label>
                                    <button
                                        type="button"
                                        onClick={() => handleInputChange("urgent", !formData.urgent)}
                                        className={`toggle-switch-input ${formData.urgent ? "checked" : ""}`}
                                        style={{
                                            background: formData.urgent ? "#c41e3a" : "#333",
                                        }}
                                    >
                                        <span className="sr-only">Toggle urgent</span>
                                    </button>
                                    <span className={`ml-4 font-share-tech uppercase tracking-widest ${formData.urgent ? "text-[#c41e3a] font-bold" : "text-black/50"}`}>
                                        {formData.urgent ? "🔴 URGENT - BOX BOX BOX" : "Standard Priority"}
                                    </span>
                                </div>
                            </div>

                            {/* Submit - Push to Talk Button */}
                            <div className="mt-10 flex justify-center">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || isSubmitted}
                                    className="push-to-talk group disabled:opacity-50"
                                >
                                    <div className="flex items-center gap-3 text-white">
                                        {isSubmitting ? (
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ duration: 0.5, repeat: Infinity }}
                                            >
                                                <Radio className="w-6 h-6 text-[#c41e3a]" />
                                            </motion.div>
                                        ) : isSubmitted ? (
                                            <CheckCircle2 className="w-6 h-6 text-green-400" />
                                        ) : (
                                            <Mic className="w-6 h-6 group-hover:text-[#c41e3a] transition-colors" />
                                        )}
                                        <span className="font-bebas text-xl uppercase tracking-widest">
                                            {isSubmitting ? "TRANSMITTING..." : isSubmitted ? "MESSAGE SENT" : "PUSH TO TALK"}
                                        </span>
                                    </div>
                                    {/* Transmit Light */}
                                    <div className={`absolute top-2 right-2 transmit-light ${isSubmitting ? "active" : ""}`} />
                                </button>
                            </div>

                            {/* Success Overlay */}
                            <AnimatePresence>
                                {isSubmitted && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 flex items-center justify-center bg-white/90"
                                    >
                                        <div className="text-center">
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                            >
                                                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                            </motion.div>
                                            <div className="font-bebas text-3xl text-black uppercase">Copy That!</div>
                                            <div className="font-share-tech text-black/60">Message received by pit wall</div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.form>
                    </div>
                </div>
            </section>
        </>
    );
}
