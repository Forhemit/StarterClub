import React from "react";
import { ContactPage } from "@/components/contact/ContactPage";

export const metadata = {
    title: "Contact Us | Starter Club SF",
    description: "Get in touch with Starter Club. Visit us at 55 9th Street, San Francisco 94103 or call (202) 505-3567. We're here to help build your business infrastructure.",
};

export default function ContactRoute() {
    return (
        <main className="min-h-screen bg-background text-foreground selection:bg-signal-green selection:text-white">
            <ContactPage />
        </main>
    );
}
