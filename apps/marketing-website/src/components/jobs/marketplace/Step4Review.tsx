"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Loader2, ArrowRight } from "lucide-react";

interface Step4ReviewProps {
    isInstalling: boolean;
    isInstalled: boolean;
    onInstall: () => void;
}

export function Step4Review({
    isInstalling,
    isInstalled,
    onInstall,
}: Step4ReviewProps) {
    if (isInstalled) {
        return (
            <Card className="border-green-500/50 bg-green-50/10">
                <CardContent className="pt-6 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mx-auto">
                        <Check className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold">Installation and Posting Complete!</h3>
                        <p className="text-muted-foreground">
                            The Jobs & Careers module has been installed and your first job posting has been created.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    Review & Install
                </CardTitle>
                <CardDescription>
                    Ready to launch? This will install the module and publish your job posting.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="bg-muted/30 p-4 rounded-lg text-sm text-muted-foreground">
                    <p>
                        By clicking "Install Module", you will:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Enable the <strong>Jobs & Careers</strong> module for your organization.</li>
                        <li>Create a secure database table for your job postings.</li>
                        <li>Publish your first job posting (as draft or active).</li>
                    </ul>
                </div>

                <div className="pt-4">
                    <Button
                        className="w-full"
                        size="lg"
                        onClick={onInstall}
                        disabled={isInstalling}
                    >
                        {isInstalling ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Installing...
                            </>
                        ) : (
                            <>
                                Install Module & Create Job
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
