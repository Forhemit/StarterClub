"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Loader2, ArrowRight } from "lucide-react";
import { BoardSettings } from "./Step1BoardSettings";
import { NotificationSettings } from "./Step2Notifications";

interface Step3ReviewProps {
    boardSettings: BoardSettings;
    notifications: NotificationSettings;
    isInstalling: boolean;
    isInstalled: boolean;
    onInstall: () => void;
}

export function Step3Review({
    boardSettings,
    notifications,
    isInstalling,
    isInstalled,
    onInstall,
}: Step3ReviewProps) {
    if (isInstalled) {
        return (
            <Card className="border-green-500/50 bg-green-50/10">
                <CardContent className="pt-6 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mx-auto">
                        <Check className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold">Installation Complete!</h3>
                        <p className="text-muted-foreground">
                            The Jobs & Careers module has been successfully installed and configured.
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
                    Review Configuration
                </CardTitle>
                <CardDescription>
                    Review your settings before installing the module.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Board Settings</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium">Title:</span> {boardSettings.title || "Not set"}
                            </div>
                            <div>
                                <span className="font-medium">URL Slug:</span> {boardSettings.slug || "Not set"}
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Notifications</h4>
                        <div className="text-sm">
                            <span className="font-medium">Email:</span> {notifications.email || "Not set"}
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t">
                    <Button
                        className="w-full"
                        size="lg"
                        onClick={onInstall}
                        disabled={isInstalling}
                    >
                        {isInstalling ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Installing Module...
                            </>
                        ) : (
                            <>
                                Install Module
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
