"use strict";

import { Monitor, LayoutDashboard, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function EmployeePortalSelectionPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Employee Portal</h1>
                <p className="mt-2 text-slate-500">Select the application you wish to access.</p>
            </div>

            <div className="grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
                {/* Reception App - Kiosk Mode */}
                <a
                    href="http://localhost:3003"
                    className="group relative flex flex-col items-center justify-between rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm transition-all hover:border-blue-500 hover:shadow-md"
                >
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-100">
                        <Monitor size={32} />
                    </div>
                    <div>
                        <h2 className="mb-2 text-xl font-bold text-slate-900">Reception App</h2>
                        <p className="text-sm text-slate-500">
                            Launch the visitor check-in kiosk for the front desk.
                        </p>
                    </div>
                </a>

                {/* Onboarding Manager - Dashboard Mode */}
                <a
                    href="http://localhost:3003?view=DASHBOARD"
                    className="group relative flex flex-col items-center justify-between rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm transition-all hover:border-blue-500 hover:shadow-md"
                >
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100">
                        <LayoutDashboard size={32} />
                    </div>
                    <div>
                        <h2 className="mb-2 text-xl font-bold text-slate-900">Onboarding Manager</h2>
                        <p className="text-sm text-slate-500">
                            Access operational dashboards and visitor logs.
                        </p>
                    </div>
                </a>

                {/* Super Admin - System Management */}
                <a
                    href="http://localhost:3001"
                    className="group relative flex flex-col items-center justify-between rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm transition-all hover:border-blue-500 hover:shadow-md"
                >
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 group-hover:bg-rose-100">
                        <ShieldCheck size={32} />
                    </div>
                    <div>
                        <h2 className="mb-2 text-xl font-bold text-slate-900">Super Admin</h2>
                        <p className="text-sm text-slate-500">
                            Manage users, organizations, and system settings.
                        </p>
                    </div>
                </a>
            </div>

            <div className="mt-12 text-center text-sm text-slate-400">
                <p>Starter Club &copy; 2025</p>
            </div>
        </div>
    );
}
