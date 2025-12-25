"use client";

import React from "react";
import "@/app/contact/contact.css";

// Section Components
import { ContactHero } from "./sections/ContactHero";
import { ContactForm } from "./sections/ContactForm";
import { ContactMethods } from "./sections/ContactMethods";
import { ContactMap } from "./sections/ContactMap";
import { ContactAvailability } from "./sections/ContactAvailability";

/**
 * ContactPage - Main orchestrator for the Contact page
 * 
 * Implements dual themes following tactile, immersive contact experience:
 * 1. Hero (Prologue) - Fractured glass / Helmet HUD
 * 2. Form (Direct Inquiry) - Blueprint / Pit Crew Panel
 * 3. Methods Grid - Filing Cabinet / Garage Doors
 * 4. Map - Isometric / Race Circuit
 * 5. Availability - Factory Control / Telemetry
 * 
 * Themes:
 * - Corporate (Light/Dark): Luxury, Neo-Grotesque, Editorial
 * - Racing: Cyber-Physical, Retro-Interface, Maximalist
 * 
 * Contact Info:
 * - Address: 55 9th Street, San Francisco 94103
 * - Phone: (202) 505-3567
 */
export function ContactPage() {
    return (
        <div className="relative">
            {/* Section 1: Hero / Contact Prologue */}
            <ContactHero />

            {/* Section 2: Contact Form / Direct Inquiry */}
            <ContactForm />

            {/* Section 3: Contact Methods Grid */}
            <ContactMethods />

            {/* Section 4: Map & Location Visualization */}
            <ContactMap />

            {/* Section 5: Team Availability / Live Status */}
            <ContactAvailability />
        </div>
    );
}
