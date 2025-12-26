'use client';

import { SiteHeader } from '@/components/layout/SiteHeader';
import { Footer } from '@/components/Footer';

export default function EventsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <SiteHeader />
            <main className="flex-1 pt-16">
                <div className="max-w-7xl mx-auto p-8">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
}
