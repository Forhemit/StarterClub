"use client";

import { OrganizationProvider } from "@/contexts/OrganizationContext";
import { ToastProvider } from "@/context/ToastContext";
import { ToasterWrapper } from "@/components/ui/ToasterWrapper";
import { GlobalFormListenerWrapper } from "@/components/GlobalFormListenerWrapper";

export function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <OrganizationProvider>
            <ToastProvider>
                {children}
                <ToasterWrapper />
                <GlobalFormListenerWrapper />
            </ToastProvider>
        </OrganizationProvider>
    );
}
