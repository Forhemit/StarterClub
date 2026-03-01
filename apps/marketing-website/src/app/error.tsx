"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log error to monitoring service
        console.error("Global error:", error);
    }, [error]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="flex justify-center">
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-foreground">
                        Something went wrong
                    </h1>
                    <p className="text-muted-foreground">
                        We apologize for the inconvenience. Our team has been notified.
                    </p>
                    {process.env.NODE_ENV === "development" && (
                        <pre className="mt-4 p-4 bg-muted rounded-lg text-left text-xs overflow-auto max-h-40">
                            {error.message}
                            {"\n"}
                            {error.stack}
                        </pre>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={reset} variant="default" className="gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </Button>
                    <Link href="/">
                        <Button variant="outline" className="gap-2 w-full">
                            <Home className="w-4 h-4" />
                            Go Home
                        </Button>
                    </Link>
                </div>

                {error.digest && (
                    <p className="text-xs text-muted-foreground">
                        Error ID: {error.digest}
                    </p>
                )}
            </div>
        </div>
    );
}
