"use client";

import React from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        q: "What’s the typical event format and length?",
        a: "Most are 60-90 minute workshops, roundtables, or deep-dive sessions focused on a practical skill or challenge."
    },
    {
        q: "Can we include a product demo?",
        a: "We encourage 'teaching through doing.' Showing your tool in action to solve a real problem is perfect; a standard sales demo is not."
    },
    {
        q: "What kind of support do you provide?",
        a: "We are full partners in promotion, logistics, and agenda development to ensure the event succeeds for you and our members."
    }
];

export function HostFAQ() {
    return (
        <section className="py-24 max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center font-heading racetrack:font-sans racetrack:uppercase">
                Have questions first?
            </h2>

            <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`item-${i}`} className="border-b border-border/50 racetrack:border-signal-blue/30">
                        <AccordionTrigger className="text-lg font-medium hover:text-primary transition-colors racetrack:font-mono racetrack:hover:text-signal-blue text-left">
                            {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed racetrack:font-mono">
                            {faq.a}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </section>
    );
}
