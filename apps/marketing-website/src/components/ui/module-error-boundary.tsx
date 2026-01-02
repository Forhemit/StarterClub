"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Props {
    children: ReactNode;
    name?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ModuleErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(`[ModuleErrorBoundary: ${this.props.name || "Unknown"}]`, error, errorInfo);
    }

    public handleRetry = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload(); // Simple reload for now, or just state reset if key change approach used
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-6 h-[400px] flex items-center justify-center">
                    <Alert variant="destructive" className="max-w-md border-red-200 bg-red-50 dark:bg-red-900/10">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Module Error</AlertTitle>
                        <AlertDescription className="mt-2 text-sm text-muted-foreground">
                            Something went wrong in the <strong>{this.props.name || "Marketplace Module"}</strong>.
                            <br />
                            Please try refreshing the page.
                        </AlertDescription>
                        <div className="mt-4">
                            <Button variant="outline" size="sm" onClick={this.handleRetry}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Reload Module
                            </Button>
                        </div>
                    </Alert>
                </div>
            );
        }

        return this.props.children;
    }
}
