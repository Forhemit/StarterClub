"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, UserCircle, Rocket, Smartphone, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

const roles = [
    { dept: "People & Culture", title: "Senior Lead Partner", id: "people-culture", color: "blue" },
    { dept: "Finance & Accounting", title: "Senior Partner", id: "finance", color: "emerald" },
    { dept: "Operations", title: "Senior Lead Partner", id: "operations", color: "amber" },
    { dept: "Member Services", title: "Club Lead → Senior Partner", id: "member-services", color: "indigo" },
    { dept: "Partner Services", title: "Senior Partner", id: "partner-services", color: "violet" },
    { dept: "Programs & Curriculum", title: "Senior Lead Partner", id: "programs", color: "rose" },
    { dept: "Marketing & Growth", title: "Senior Partner", id: "growth", color: "cyan" },
    { dept: "Technology & Data", title: "Senior Partner → Senior Lead", id: "tech-data", color: "slate" },
    { dept: "Legal & Compliance", title: "Senior Partner", id: "legal", color: "zinc" },
    { dept: "Strategy & Impact", title: "Founder Partner", id: "strategy", color: "fuchsia" },
    { dept: "Super Admin", title: "Founder Partner + System Admin", id: "super-admin", color: "red", icon: Rocket },
];

const apps = [
    { name: "Onboard App", desc: "Member Onboarding & Check-in", url: "http://localhost:3002", icon: Smartphone, color: "blue" },
    { name: "Kiosk / Flight Deck", desc: "Public Display & Interaction", url: "http://localhost:3003", icon: Monitor, color: "orange" },
];

export default function SelectionPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-12 pb-24">
            <div className="text-center space-y-4 max-w-2xl">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
                    Employee Portal Access
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    Select your role to access the command center.
                    <br />
                    <span className="text-sm italic opacity-75">
                        (Development Mode: One-Click Access Enabled)
                    </span>
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                {roles.map((role) => (
                    <Link
                        key={role.id}
                        href={`/employee-portal/dashboard/${role.id}`}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-blue-500 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-blue-500"
                    >
                        <div className="mb-4">
                            <div
                                className={cn(
                                    "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white",
                                )}
                            >
                                {role.icon ? <role.icon className="h-6 w-6" /> : <UserCircle className="h-6 w-6" />}
                            </div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">
                                {role.dept}
                            </h3>
                            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                {role.title}
                            </p>
                        </div>

                        <div className="flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-500 dark:text-blue-400">
                            Access Dashboard
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                    </Link>
                ))}
            </div>

            <div className="w-full max-w-6xl pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white text-center">Auxiliary Applications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {apps.map((app) => (
                        <a
                            key={app.name}
                            href={app.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative flex items-center p-6 gap-6 rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:border-blue-500 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-blue-500"
                        >
                            <div
                                className={cn(
                                    "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white",
                                )}
                            >
                                <app.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">
                                    {app.name}
                                </h3>
                                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                    {app.desc}
                                </p>
                            </div>
                            <div className="ml-auto">
                                <Rocket className="h-5 w-5 text-zinc-400 group-hover:text-blue-500 transition-colors" />
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
