"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Check, Mail, Phone, User } from "lucide-react";
import { toast } from "sonner";

interface PersonalInfoTabProps {
    user: any;
    profile: any;
}

export function PersonalInfoTab({ user, profile }: PersonalInfoTabProps) {
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        phone: profile?.phone || "",
        preferredContact: profile?.preferred_contact || "email",
    });

    const handleSave = async () => {
        setSaving(true);
        try {
            // TODO: Implement profile update action
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
            toast.success("Personal information updated successfully");
        } catch (error) {
            toast.error("Failed to update information");
        } finally {
            setSaving(false);
        }
    };

    const initials = user?.firstName && user?.lastName
        ? `${user.firstName[0]}${user.lastName[0]}`
        : user?.firstName?.[0] || "U";

    return (
        <div className="space-y-6">
            {/* Avatar Section */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Profile Photo</CardTitle>
                    <CardDescription>Your profile photo is managed through your Clerk account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20 ring-2 ring-primary/20">
                            <AvatarImage src={user?.imageUrl} />
                            <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{user?.fullName || "No name set"}</p>
                            <p className="text-sm text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
                            <Button
                                variant="link"
                                className="px-0 h-auto text-xs"
                                onClick={() => window.open('https://accounts.clerk.dev/user', '_blank')}
                            >
                                Change photo in Clerk →
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Contact Information</CardTitle>
                    <CardDescription>How can we reach you?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className="flex items-center gap-2">
                                <User className="h-3.5 w-3.5" />
                                First Name
                            </Label>
                            <Input
                                id="firstName"
                                value={user?.firstName || ""}
                                disabled
                                className="bg-muted"
                            />
                            <p className="text-[10px] text-muted-foreground">Managed by Clerk</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="flex items-center gap-2">
                                <User className="h-3.5 w-3.5" />
                                Last Name
                            </Label>
                            <Input
                                id="lastName"
                                value={user?.lastName || ""}
                                disabled
                                className="bg-muted"
                            />
                            <p className="text-[10px] text-muted-foreground">Managed by Clerk</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5" />
                            Email Address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={user?.primaryEmailAddress?.emailAddress || ""}
                            disabled
                            className="bg-muted"
                        />
                        <p className="text-[10px] text-muted-foreground">Managed by Clerk</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5" />
                            Phone Number
                        </Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Check className="mr-2 h-4 w-4" />
                            Save Changes
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
