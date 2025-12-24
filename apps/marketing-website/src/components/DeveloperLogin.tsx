"use client";

import { useState } from "react";
import { Lock, ArrowRight, ArrowLeft } from "lucide-react";

interface DeveloperLoginProps {
    targetPort?: number;
    redirectUrl?: string;
    title: string;
}

export function DeveloperLogin({ targetPort, redirectUrl, title }: DeveloperLoginProps) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "StarterClub!2025") {
            if (redirectUrl) {
                window.location.href = redirectUrl;
            } else if (targetPort) {
                window.location.href = `http://localhost:${targetPort}`;
            }
        } else {
            setError(true);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
            <div className="w-full max-w-md space-y-8 rounded-xl border border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center">
                        <img
                            src="https://o341ovdtm5.ufs.sh/f/az1cgdYYLQv4wopWHB0jbDenCfGJgyZm9vhqzIaK6NLTWo8V"
                            alt="Starter Club Logo"
                            className="h-full w-full object-contain rounded-md"
                        />
                    </div>
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{title}</h2>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                        Enter the developer password to access the local environment.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="password" className="sr-only">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="relative block w-full rounded-md border-0 py-3 px-4 text-zinc-900 ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:z-10 focus:ring-2 focus:ring-blue-600 dark:bg-zinc-950 dark:text-white dark:ring-zinc-700 sm:text-sm sm:leading-6"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError(false);
                            }}
                        />
                    </div>

                    {error && <p className="text-sm text-red-600">Incorrect password. Please try again.</p>}

                    <button
                        type="submit"
                        className="group relative flex w-full justify-center rounded-md bg-blue-600 py-3 px-4 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <ArrowRight className="h-5 w-5 text-blue-500 group-hover:text-blue-400" aria-hidden="true" />
                        </span>
                        Access Environment
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a href="/" className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Website
                    </a>
                </div>
            </div>
        </div>
    );
}
