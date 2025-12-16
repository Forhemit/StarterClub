"use client";

import React from "react";
import { BackgroundLayer } from "@/components/BackgroundLayer";
import { WaitlistModal } from "@/components/WaitlistModal";
import { Footer } from "@/components/Footer";
import { ModalProvider, useModal } from "./context/ModalContext";
import { homeSections } from "./homeConfig";
import { SectionWrapper } from "./shared/SectionWrapper";

function HomePageContent() {
    const { isModalOpen, closeModal, openModal } = useModal();

    return (
        <main className="relative min-h-screen text-black selection:bg-[var(--accent)] selection:text-white flex flex-col items-center">
            <BackgroundLayer />
            <WaitlistModal isOpen={isModalOpen} onClose={closeModal} />

            {homeSections
                .filter((section) => section.enabled)
                .sort((a, b) => a.order - b.order)
                .map((section) => {
                    const Component = section.component;

                    // Inject common props/handlers for waitlist
                    // We pass both onOpen and onWaitlistOpen to cover different component prop names
                    const sectionProps = {
                        ...section.props,
                        onOpen: openModal,
                        onWaitlistOpen: openModal,
                    };

                    return (
                        <SectionWrapper
                            key={section.id}
                            containerType={section.containerType}
                            className={section.className}
                        >
                            <Component {...sectionProps} />
                        </SectionWrapper>
                    );
                })}

            <Footer />
        </main>
    );
}

export default function HomePage() {
    return (
        <ModalProvider>
            <HomePageContent />
        </ModalProvider>
    );
}
