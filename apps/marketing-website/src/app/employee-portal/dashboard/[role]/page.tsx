"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
    PeopleCultureDashboard,
    FinanceDashboard,
    OperationsDashboard,
    MemberServicesDashboard,
    PartnerServicesDashboard,
    ProgramsDashboard,
    GrowthDashboard,
    TechDataDashboard,
    LegalDashboard,
    StrategyDashboard,
    SuperAdminDashboard,
} from "@/components/dashboard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RoleDashboardPage() {
    const params = useParams();
    const router = useRouter();
    const role = params.role as string;

    const renderDashboard = () => {
        switch (role) {
            case "people-culture":
                return <PeopleCultureDashboard />;
            case "finance":
                return <FinanceDashboard />;
            case "operations":
                return <OperationsDashboard />;
            case "member-services":
                return <MemberServicesDashboard />;
            case "partner-services":
                return <PartnerServicesDashboard />;
            case "programs":
                return <ProgramsDashboard />;
            case "growth":
                return <GrowthDashboard />;
            case "tech-data":
                return <TechDataDashboard />;
            case "legal":
                return <LegalDashboard />;
            case "strategy":
                return <StrategyDashboard />;
            case "super-admin":
                return <SuperAdminDashboard />;
            default:
                return (
                    <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
                        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
                            Role Not Found
                        </h1>
                        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
                            The dashboard for role "{role}" could not be found.
                        </p>
                        <Link
                            href="/employee-portal/selection"
                            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Selection
                        </Link>
                    </div>
                );
        }
    };

    return (
        <div>
            {renderDashboard()}
        </div>
    );
}
