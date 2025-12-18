"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { PartnerInquiryForm } from "./PartnerInquiryForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type ModalContent = "why-partner" | "partners-seek" | "inquiry";

interface PartnersModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialTab?: ModalContent;
}

export function PartnersModal({ isOpen, onClose, initialTab = "inquiry" }: PartnersModalProps) {
    const [currentTab, setCurrentTab] = useState<ModalContent>(initialTab);
    const [isSuccess, setIsSuccess] = useState(false);

    // Sync internal state with prop when modal opens or tab changes
    useEffect(() => {
        if (isOpen) {
            setCurrentTab(initialTab);
        }
    }, [isOpen, initialTab]);

    const handleSuccess = () => {
        setIsSuccess(true);
    };

    const handleClose = () => {
        setIsSuccess(false);
        onClose();
    };

    const contentMap = {
        "why-partner": {
            title: "Why Partner With Us?",
            body: (
                <div className="space-y-6 text-black/80 font-light text-lg leading-relaxed">
                    <p>
                        <strong>For organizations seeking impact that is visible, meaningful, and measurable.</strong>
                    </p>
                    <p>
                        As a Partner or Sponsor, your organization gains:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-base">
                        <li><strong>Direct Access</strong> to 20–40 high-potential Starters each month—through warm introductions, never cold outreach.</li>
                        <li><strong>Brand Alignment</strong> with a Public Benefit Corporation committed to economic mobility and local innovation.</li>
                        <li><strong>A Strategic Seat</strong> in shaping programs that move entrepreneurs from confusion into confident execution.</li>
                        <li><strong>Premium Visibility</strong> throughout our physical space—member zones, shared environments, and digital displays.</li>
                        <li><strong>Expert Positioning</strong> through hosted workshops, office hours, micro-events, and educational sessions.</li>
                        <li><strong>Priority Placement</strong> within our Starter Roadmaps (banking, legal, software, insurance, and more).</li>
                        <li><strong>Early Insights</strong> into standout members accelerating quickly and seeking specialized services.</li>
                        <li><strong>Monthly Recognition</strong> for fueling real wins—launches, milestones, graduations, first customers.</li>
                        <li><strong>Impact Reporting</strong> with data on reach, outcomes, referrals, and measurable pipeline value.</li>
                    </ul>
                    <p className="font-bold border-t border-black/10 pt-4">
                        This is not sponsorship for visibility.<br />
                        It is participation in an engine that creates jobs, confidence, and upward mobility—right here in San Francisco.
                    </p>
                </div>
            )
        },
        "partners-seek": {
            title: "The Partners We Seek",
            body: (
                <div className="space-y-6 text-black/80 font-light text-lg leading-relaxed">
                    <p>
                        <strong>We are intentional about every alliance we form.</strong>
                    </p>
                    <p>
                        We partner with organizations that:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-base">
                        <li><strong>Believe in economic mobility</strong>, not gatekeeping.</li>
                        <li><strong>Commit to supporting founders</strong> at the most critical phase: the beginning.</li>
                        <li><strong>Provide tools, expertise, or resources</strong> that directly accelerate a Starter’s path.</li>
                        <li><strong>Value mentorship, education</strong>, and deep community impact.</li>
                        <li><strong>Seek intentional, long-term relationships</strong> rather than transactional engagements.</li>
                    </ul>
                    <p className="font-bold border-t border-black/10 pt-4">
                        If this reflects your ethos—we should speak.
                    </p>
                </div>
            )
        },
        "inquiry": {
            title: "Begin the Conversation",
            body: (
                <div className="space-y-4">
                    <p className="text-black/60">
                        We craft each partnership with intention and clarity. Share your organization’s vision, and we’ll arrange a conversation to explore whether we’re the right fit.
                    </p>
                </div>
            )
        }
    };

    const isInfoMode = currentTab === "why-partner" || currentTab === "partners-seek";

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className={`bg-white p-0 gap-0 overflow-hidden max-h-[90vh] flex flex-col md:flex-row ${isInfoMode ? "max-w-5xl" : "max-w-5xl"}`}>
                <DialogHeader className="sr-only">
                    <DialogTitle>{contentMap[currentTab].title}</DialogTitle>
                    <DialogDescription>Details about partnering with Starter Club</DialogDescription>
                </DialogHeader>

                {isInfoMode ? (
                    <div className="p-8 md:p-16 overflow-y-auto w-full h-full bg-[#f8f8f6]">
                        <div className="max-w-4xl mx-auto space-y-8">
                            <h2 className="font-bebas text-5xl md:text-6xl text-center mb-12">{contentMap[currentTab].title}</h2>
                            {contentMap[currentTab].body}

                            <div className="flex justify-center pt-8">
                                <button
                                    onClick={handleClose}
                                    className="bg-black text-white hover:bg-black/80 font-bold uppercase tracking-wider py-3 px-8 rounded-lg transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="w-full md:w-1/2 bg-[#f8f8f6] p-8 md:p-12 overflow-y-auto border-r border-black/5 hidden md:block">
                            <div className="space-y-8 h-full flex flex-col justify-center">
                                <div>
                                    <h2 className="font-bebas text-4xl mb-6">{contentMap["inquiry"].title}</h2>
                                    {contentMap["inquiry"].body}
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 p-8 md:p-12 bg-white overflow-y-auto">
                            {isSuccess ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-20 h-20 bg-[var(--accent)] rounded-full flex items-center justify-center text-black">
                                        <Check className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <h3 className="font-bebas text-3xl uppercase">Request Received</h3>
                                        <p className="text-black/60 font-sans mt-2">
                                            We’ll review your inquiry and be in touch soon.
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        className="text-sm font-bold uppercase tracking-wider text-black/40 hover:text-black transition-colors"
                                    >
                                        Close Window
                                    </button>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col justify-center">
                                    <PartnerInquiryForm onSuccess={handleSuccess} />
                                </div>
                            )}
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

// NOTE: Since the design request implies triggering different text in the left column but ALWAYS showing the form, 
// this two-column layout with Tabs allows the user to read the relevant context (Why Partner / Who We Seek) while filling out the form.
