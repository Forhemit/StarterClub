"use client";

import { UserCircle } from "lucide-react";

export default function MemberDashboardPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <UserCircle size={48} />
                </div>
                <h1 className="mb-2 text-2xl font-bold text-slate-900">Member Dashboard</h1>
                <p className="mb-8 text-slate-500">
                    Welcome back! Your member dashboard is coming soon.
                </p>
                <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
                    <p className="font-semibold">Development Status:</p>
                    <p>This page is a placeholder for the future member area.</p>
                </div>
                <button
                    className="mt-8 w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700"
                    onClick={() => window.history.back()}
                >
                    Go Back
                </button>
            </div>
        </div>
    );
}
