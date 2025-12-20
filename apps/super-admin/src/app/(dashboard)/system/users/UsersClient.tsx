"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, User, Building, UserPlus, Edit, Trash } from "lucide-react";
import { formatDate } from "@starter-club/utils";
import { createOrgAction, inviteUserAction, deleteUserAction, updateUserAction } from "@/app/actions/users";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@starter-club/ui";


import { useRouter } from "next/navigation";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from "@/components/ui/sheet";

export type PartnerUser = {
    id: string;
    clerk_user_id: string;
    org_id: string | null;
    role: string;
    created_at: string | null;
    first_name?: string | null;
    last_name?: string | null;
};

export type PartnerOrg = {
    id: string;
    name: string;
};

export default function UsersClient({
    initialUsers,
    initialOrgs
}: {
    initialUsers: PartnerUser[],
    initialOrgs: PartnerOrg[]
}) {
    const { toast } = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [isEditUserOpen, setIsEditUserOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<PartnerUser | null>(null);

    // Form States
    const [newOrgName, setNewOrgName] = useState("");

    // Add User Form
    const [addEmail, setAddEmail] = useState("");
    const [addFirstName, setAddFirstName] = useState("");
    const [addLastName, setAddLastName] = useState("");
    const [addRole, setAddRole] = useState("partner");
    const [addOrgId, setAddOrgId] = useState("");

    // Edit User Form
    const [editFirstName, setEditFirstName] = useState("");
    const [editLastName, setEditLastName] = useState("");
    const [editRole, setEditRole] = useState("partner");
    const [editOrgId, setEditOrgId] = useState("");


    const handleRefresh = () => {
        router.refresh();
    };

    // --- ACTIONS ---

    const createOrg = async () => {
        if (!newOrgName) return;
        setLoading(true);
        try {
            const { success, error } = await createOrgAction(newOrgName);
            if (!success) throw new Error(error);
            toast({ title: "Organization created!" });
            setNewOrgName("");
            router.refresh();
        } catch (e: any) {
            toast({ title: "Error", description: e.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleInviteUser = async () => {
        if (!addEmail) return;
        setLoading(true);
        try {
            const finalOrg = addOrgId === "none" || addOrgId === "" ? null : addOrgId;
            const { success, error } = await inviteUserAction(addEmail, addRole, finalOrg, addFirstName, addLastName);
            if (!success) throw new Error(error);
            toast({ title: "User invited successfully!" });
            setIsAddUserOpen(false);
            // Reset form
            setAddEmail("");
            setAddFirstName("");
            setAddLastName("");
            setAddRole("partner");
            setAddOrgId("");
            router.refresh();
        } catch (e: any) {
            toast({ title: "Error", description: e.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const openEditUser = (user: PartnerUser) => {
        setCurrentUser(user);
        setEditFirstName(user.first_name || "");
        setEditLastName(user.last_name || "");
        setEditRole(user.role);
        setEditOrgId(user.org_id || "none");
        setIsEditUserOpen(true);
    };

    const handleUpdateUser = async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const finalOrg = editOrgId === "none" || editOrgId === "" ? null : editOrgId;
            const { success, error } = await updateUserAction(
                currentUser.id,
                currentUser.clerk_user_id,
                {
                    firstName: editFirstName,
                    lastName: editLastName,
                    role: editRole,
                    orgId: finalOrg
                }
            );
            if (!success) throw new Error(error);
            toast({ title: "User updated!" });
            setIsEditUserOpen(false);
            router.refresh();
        } catch (e: any) {
            toast({ title: "Error", description: e.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (user: PartnerUser) => {
        // Confirmation handled by AlertDialog
        setLoading(true);
        try {
            const { success, error } = await deleteUserAction(user.id, user.clerk_user_id);
            if (!success) throw new Error(error);
            toast({ title: "User deleted." });
            router.refresh();
        } catch (e: any) {
            toast({ title: "Error", description: e.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const getOrgName = (id: string | null) => {
        if (!id) return "-- No Org --";
        const org = initialOrgs.find(o => o.id === id);
        return org ? org.name : "Unknown Org";
    };

    return (
        <div className="space-y-8">

            {/* 1. Manage Orgs (Compact) */}
            <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Building className="h-5 w-5 text-gray-500" />
                        Organizations
                    </h2>
                </div>
                <div className="flex gap-4 items-end mb-4">
                    <div className="space-y-1 flex-1 max-w-sm">
                        <Label className="text-xs text-gray-500">New Organization Name</Label>
                        <Input
                            value={newOrgName}
                            onChange={(e) => setNewOrgName(e.target.value)}
                            placeholder="e.g. Acme Corp"
                            className="h-9"
                        />
                    </div>
                    <Button onClick={createOrg} disabled={!newOrgName || loading} size="sm">Create Org</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                    {initialOrgs.map(o => (
                        <div key={o.id} className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium border text-gray-700">
                            {o.name}
                        </div>
                    ))}
                    {initialOrgs.length === 0 && <span className="text-sm text-gray-400 italic">No organizations yet.</span>}
                </div>
            </Card>

            {/* 2. Manage Users (Main) */}
            <Card className="p-0 overflow-hidden border shadow-sm">
                <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                    <div className="space-y-1">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <User className="h-5 w-5 text-gray-500" />
                            Users
                        </h2>
                        <p className="text-sm text-gray-500">Manage access and organization membership.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
                            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                        <Sheet open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                            <SheetTrigger asChild>
                                <Button size="sm">
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Add User
                                </Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Add New User</SheetTitle>
                                    <SheetDescription>
                                        Create a new user account. They will be given a default password.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Email Address</Label>
                                        <Input value={addEmail} onChange={(e) => setAddEmail(e.target.value)} placeholder="email@example.com" />
                                        <p className="text-[10px] text-muted-foreground">A temporary password will be generated. The user should reset it via email.</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>First Name</Label>
                                            <Input value={addFirstName} onChange={(e) => setAddFirstName(e.target.value)} placeholder="Jane" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Last Name</Label>
                                            <Input value={addLastName} onChange={(e) => setAddLastName(e.target.value)} placeholder="Doe" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Role</Label>
                                        <select
                                            className="w-full h-10 border rounded-md px-3 text-sm bg-background"
                                            value={addRole}
                                            onChange={(e) => setAddRole(e.target.value)}
                                        >
                                            <option value="partner">Partner</option>
                                            <option value="partner_admin">Partner Admin</option>
                                            <option value="admin">Super Admin</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Organization</Label>
                                        <select
                                            className="w-full h-10 border rounded-md px-3 text-sm bg-background"
                                            value={addOrgId}
                                            onChange={(e) => setAddOrgId(e.target.value)}
                                        >
                                            <option value="">-- No Organization --</option>
                                            {initialOrgs.map(o => (
                                                <option key={o.id} value={o.id}>{o.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <SheetFooter>
                                    <Button onClick={handleInviteUser} disabled={loading || !addEmail}>Create User</Button>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                            <tr>
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Organization</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {initialUsers.map(u => (
                                <tr key={u.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">
                                            {u.first_name || u.last_name ? `${u.first_name || ''} ${u.last_name || ''}` : <span className="text-gray-400 italic">No Name</span>}
                                        </div>
                                        <div className="text-xs text-gray-500 font-mono truncate max-w-[150px]" title={u.clerk_user_id}>
                                            {u.clerk_user_id}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            Joined {formatDate(u.created_at)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                            ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {u.role.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {getOrgName(u.org_id)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600" onClick={() => openEditUser(u)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-600">
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action will soft-delete the user from the database and remove them from Clerk.
                                                            This cannot be easily undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <div className="my-4 p-4 bg-red-50 text-red-900 text-sm rounded border border-red-200">
                                                        <p className="font-bold mb-2">Type the full Clerk User ID to confirm:</p>
                                                        <code className="bg-white px-1 py-0.5 rounded border select-all">{u.clerk_user_id}</code>
                                                        <Input
                                                            className="mt-2 bg-white"
                                                            placeholder={u.clerk_user_id}
                                                            onChange={(e) => {
                                                                const btn = document.getElementById(`confirm-delete-${u.id}`) as HTMLButtonElement;
                                                                if (btn) btn.disabled = e.target.value !== u.clerk_user_id;
                                                            }}
                                                        />
                                                    </div>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            id={`confirm-delete-${u.id}`}
                                                            disabled={true}
                                                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleDeleteUser(u);
                                                                // Close dialog manually if needed, or rely on re-render. 
                                                                // Shadcn AlertDialogAction usually closes on click. 
                                                                // Since we preventDefault to wait for async, we should probably handle open state if we wanted to be perfect, 
                                                                // but for now let's just trigger the action.
                                                                // Actually, standard behavior is fine if we just let it close and show toast.
                                                            }}
                                                        >
                                                            Delete User
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {initialUsers.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                                        No users found. Create one to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Edit User Sheet */}
            <Sheet open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Edit User</SheetTitle>
                        <SheetDescription>
                            Update user details and access.
                        </SheetDescription>
                    </SheetHeader>
                    {currentUser && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-1">
                                <Label className="text-xs text-gray-500">User ID</Label>
                                <div className="text-xs font-mono bg-gray-100 p-2 rounded">{currentUser.clerk_user_id}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>First Name</Label>
                                    <Input value={editFirstName} onChange={(e) => setEditFirstName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Last Name</Label>
                                    <Input value={editLastName} onChange={(e) => setEditLastName(e.target.value)} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Role</Label>
                                <select
                                    className="w-full h-10 border rounded-md px-3 text-sm bg-background"
                                    value={editRole}
                                    onChange={(e) => setEditRole(e.target.value)}
                                >
                                    <option value="partner">Partner</option>
                                    <option value="partner_admin">Partner Admin</option>
                                    <option value="admin">Super Admin</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Organization</Label>
                                <select
                                    className="w-full h-10 border rounded-md px-3 text-sm bg-background"
                                    value={editOrgId}
                                    onChange={(e) => setEditOrgId(e.target.value)}
                                >
                                    <option value="none">-- No Organization --</option>
                                    {initialOrgs.map(o => (
                                        <option key={o.id} value={o.id}>{o.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                    <SheetFooter>
                        <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdateUser} disabled={loading}>Save Changes</Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    );
}
