"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, ExternalLink, ShieldAlert } from "lucide-react";

export default function EmployeePortalPage() {
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "StarterClub!2025") {
            setIsAuthenticated(true);
            setError(false);
        } else {
            setError(true);
            setPassword("");
        }
    };

    if (isAuthenticated) {
        return (
            <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-zinc-200">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Employee Portal</h1>
                        <p className="text-zinc-500">Welcome back, team.</p>
                    </div>

                    <div className="space-y-4">
                        <Button asChild className="w-full h-16 text-lg bg-orange-600 hover:bg-orange-700 font-semibold" size="lg">
                            <Link href="/onboard" className="flex items-center justify-center gap-2">
                                <ExternalLink className="w-5 h-5" />
                                Receptionist App
                            </Link>
                        </Button>

                        <Button asChild variant="outline" className="w-full h-14 text-zinc-600 border-dashed border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50" size="lg">
                            <Link href="/secret-menu" className="flex items-center justify-center gap-2">
                                <ShieldAlert className="w-5 h-5" />
                                Secret Menu (Test Creds)
                            </Link>
                        </Button>
                    </div>

                    <div className="pt-6 border-t border-zinc-100 text-center">
                        <Button variant="ghost" size="sm" onClick={() => setIsAuthenticated(false)} className="text-zinc-400 hover:text-zinc-600">
                            Lock Session
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100">
            <div className="max-w-sm w-full space-y-8">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 mb-4">
                        <Lock className="w-5 h-5 text-zinc-500" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Restricted Access</h1>
                    <p className="text-zinc-500 text-sm">Enter employee password to continue.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-orange-600"
                            autoFocus
                        />
                        {error && (
                            <p className="text-sm text-red-500 font-medium animate-in slide-in-from-top-1">
                                Incorrect password.
                            </p>
                        )}
                    </div>
                    <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200 font-semibold">
                        Enter Portal
                    </Button>
                </form>

                <div className="text-center">
                    <Link href="/" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
