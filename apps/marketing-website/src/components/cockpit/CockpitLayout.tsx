import React from 'react';
import { CockpitSidebar } from './CockpitSidebar';

interface CockpitLayoutProps {
    children: React.ReactNode;
}

export const CockpitLayout: React.FC<CockpitLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-background">
            <CockpitSidebar />
            <main className="pl-64">
                {/* Top telemetry bar could go here later */}
                <div className="container mx-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};
