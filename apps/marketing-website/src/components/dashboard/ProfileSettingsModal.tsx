"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Briefcase, Handshake, CreditCard } from "lucide-react";
import { PersonalInfoTab } from "./settings/PersonalInfoTab";
import { EmploymentTab } from "./settings/EmploymentTab";
import { PartnershipTab } from "./settings/PartnershipTab";
import { SubscriptionTab } from "./settings/SubscriptionTab";

interface ProfileSettingsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    profile: any;
    userRoles: string[];
    hasSubscription?: boolean;
}

export function ProfileSettingsModal({
    open,
    onOpenChange,
    profile,
    userRoles,
    hasSubscription = false
}: ProfileSettingsModalProps) {
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState("personal");

    // Determine which tabs to show based on roles
    const employmentRoles = ['admin', 'employee', 'manager', 'super_admin'];
    const partnershipRoles = ['partner', 'sponsor'];

    const showEmployment = userRoles.some(role => employmentRoles.includes(role));
    const showPartnership = userRoles.some(role => partnershipRoles.includes(role));
    const showSubscription = hasSubscription || userRoles.includes('member');

    const tabs = [
        { id: 'personal', label: 'Personal Info', icon: User, visible: true },
        { id: 'employment', label: 'Employment', icon: Briefcase, visible: showEmployment },
        { id: 'partnership', label: 'Partnership', icon: Handshake, visible: showPartnership },
        { id: 'subscription', label: 'Subscription', icon: CreditCard, visible: showSubscription },
    ].filter(tab => tab.visible);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
                <DialogHeader className="pb-4 border-b border-border">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        Profile Settings
                    </DialogTitle>
                </DialogHeader>

                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="flex-1 flex flex-col overflow-hidden"
                >
                    <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
                        {tabs.map((tab) => (
                            <TabsTrigger
                                key={tab.id}
                                value={tab.id}
                                className="flex items-center gap-2 text-sm"
                            >
                                <tab.icon className="h-4 w-4" />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <div className="flex-1 overflow-y-auto mt-4 pr-1">
                        <TabsContent value="personal" className="mt-0">
                            <PersonalInfoTab user={user} profile={profile} />
                        </TabsContent>

                        {showEmployment && (
                            <TabsContent value="employment" className="mt-0">
                                <EmploymentTab profile={profile} />
                            </TabsContent>
                        )}

                        {showPartnership && (
                            <TabsContent value="partnership" className="mt-0">
                                <PartnershipTab profile={profile} />
                            </TabsContent>
                        )}

                        {showSubscription && (
                            <TabsContent value="subscription" className="mt-0">
                                <SubscriptionTab profile={profile} userId={user?.id} />
                            </TabsContent>
                        )}
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
