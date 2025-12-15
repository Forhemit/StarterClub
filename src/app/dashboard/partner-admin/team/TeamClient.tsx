"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/context/ToastContext";
import { inviteUserAction } from "@/app/dashboard/actions/users";
import { UserPlus, Users } from "lucide-react";

export default function TeamClient({ initialUsers }: { initialUsers: any[] }) {
    const { toast } = useToast();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [resultCreds, setResultCreds] = useState<any>(null);

    const handleInvite = async () => {
        setLoading(true);
        setResultCreds(null);
        try {
            // Defaulting to "partner" role inside the org for now
            const { success, error, data } = await inviteUserAction(email, "partner", null);
            // orgId null is ignored for Partner Admin (overridden by server)

            if (!success) throw new Error(error);

            toast.success("Team member added!");
            setResultCreds(data);
            setEmail("");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Invite Team Member
                </h2>
                <div className="flex gap-4 items-end max-w-md">
                    <div className="space-y-1 flex-1">
                        <Label>Email Address</Label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="colleague@company.com"
                        />
                    </div>
                    <Button onClick={handleInvite} disabled={loading || !email}>
                        {loading ? "Adding..." : "Add Member"}
                    </Button>
                </div>

                {resultCreds && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-900">
                        <p className="font-bold">User Created Successfully!</p>
                        <p className="text-sm mt-1">Share these credentials (temporary):</p>
                        <ul className="text-sm font-mono mt-2 space-y-1 bg-white p-2 rounded border">
                            <li>Email: {resultCreds.email}</li>
                            <li>Password: {resultCreds.password}</li>
                        </ul>
                    </div>
                )}
            </Card>

            <Card className="p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Current Team
                </h2>
                <div className="space-y-2">
                    {initialUsers.length === 0 && <p className="text-muted-foreground">No other team members yet.</p>}
                    {initialUsers.map((u: any) => (
                        <div key={u.id} className="flex justify-between items-center p-3 bg-gray-50 rounded border">
                            <div>
                                <p className="font-medium text-sm">{u.email || "User"}</p>
                                <p className="text-xs text-muted-foreground font-mono">{u.clerk_user_id}</p>
                            </div>
                            <span className="text-xs bg-gray-200 px-2 py-1 rounded capitalize">{u.role}</span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
