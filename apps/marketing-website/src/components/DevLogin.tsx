"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Lock, ArrowRight } from "lucide-react";

interface DevLoginProps {
    title: string;
    targetUrl: string;
    description: string;
}

export default function DevLogin({ title, targetUrl, description }: DevLoginProps) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "StarterClub!2025") {
            window.location.href = targetUrl;
        } else {
            setError("Incorrect Dev Password");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-8 shadow-xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                    <p className="text-gray-500 mt-2 text-sm">{description}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input
                            type="password"
                            placeholder="Developer Password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError("");
                            }}
                            className="w-full text-center tracking-widest"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm text-center font-medium animate-pulse">
                            {error}
                        </p>
                    )}

                    <Button type="submit" className="w-full" size="lg">
                        Access Portal <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>

                    <p className="text-xs text-center text-gray-400 mt-4">
                        This is a restricted developer access point.
                    </p>

                    <div className="text-center mt-6">
                        <Button variant="link" size="sm" onClick={() => window.location.href = "/"}>
                            ← Back to Home
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
