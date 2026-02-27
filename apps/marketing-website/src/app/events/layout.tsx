'use client';

import { Footer } from '@/components/Footer';

export default function EventsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                <div className="max-w-7xl mx-auto p-8">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
}
