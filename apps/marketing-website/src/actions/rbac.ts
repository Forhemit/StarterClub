"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export type NavItem = {
    label: string;
    href: string;
    iconName: string;
    section?: string;
};

export type UserContext = {
    roles: string[];
    departments: string[]; // Department codes
    permissions: string[];
};

/**
 * Fetches the user's roles, departments, and specific permissions.
 */
export async function getUserContext(userId?: string): Promise<UserContext> {
    const supabase = await createSupabaseServerClient();
    let targetUserId = userId;

    if (!targetUserId) {
        const { userId: clerkUserId } = await auth();
        if (!clerkUserId) return { roles: [], departments: [], permissions: [] };
        targetUserId = clerkUserId;
    }

    // Optimize with Promise.all
    const [rolesResult, departmentsResult] = await Promise.all([
        supabase
            .from("user_roles")
            .select("role_slug")
            .eq("clerk_user_id", targetUserId)
            .eq("is_active", true),
        supabase
            .from("user_departments")
            .select("department:departments(department_code)")
            .eq("user_id", targetUserId)
    ]);

    const roles = rolesResult.data?.map((r: { role_slug: string }) => r.role_slug) || [];
    const departments = departmentsResult.data?.map((d: any) => d.department?.department_code).filter(Boolean) as string[] || [];

    const permissions: string[] = [];

    return { roles, departments, permissions };
}

/**
 * Returns the list of navigation items the user is allowed to see.
 */
export async function getUserNavItems(userId?: string): Promise<NavItem[]> {
    const context = await getUserContext(userId);
    const { roles, departments } = context;

    const navItems: NavItem[] = [];

    // --- 1. COMMON / EVERYONE ---
    // Always show Home Base for logged in users
    navItems.push(
        { label: "Home Base", href: "/dashboard", iconName: "LayoutDashboard" },
        { label: "Builder Rooms", href: "/builder", iconName: "Hammer" },
        { label: "Playbooks", href: "/resources", iconName: "BookOpen" }
    );

    // --- 2. PARTNER ---
    if (roles.some(r => ["partner", "partner_admin", "super_admin"].includes(r))) {
        navItems.push(
            { label: "Partner Overview", href: "/dashboard/partner", iconName: "Building2", section: "Partner" },
            { label: "Intros", href: "/dashboard/partner/intros", iconName: "Users", section: "Partner" },
            { label: "ROI Lab", href: "/dashboard/partner/roi", iconName: "Calculator", section: "Partner" }
        );
    }

    // --- 3. SPONSOR ---
    if (roles.includes("sponsor") || roles.includes("super_admin")) {
        navItems.push(
            { label: "Campaigns", href: "/dashboard/sponsor", iconName: "Sparkles", section: "Sponsor" },
            { label: "Growth Signals", href: "/dashboard/sponsor/roi", iconName: "BarChart", section: "Sponsor" }
        );
    }

    // --- 4. EMPLOYEE / INTERNAL ---
    if (roles.some(r => ["employee", "manager", "admin", "super_admin"].includes(r))) {

        // Admin / Super Admin
        if (roles.includes("super_admin") || roles.includes("admin")) {
            navItems.push({ label: "Admin Console", href: "/dashboard/super-admin", iconName: "ShieldCheck", section: "Admin" });
        }

        // Department Specifics
        if (departments.includes("finance") || roles.includes("super_admin")) {
            navItems.push({ label: "Financial Reports", href: "/dashboard/finance", iconName: "FileText", section: "Finance" });
        }

        if (departments.includes("people_culture") || roles.includes("super_admin")) {
            navItems.push({ label: "People & Culture", href: "/dashboard/hr", iconName: "Users", section: "HR" });
        }
    }

    return navItems;
}

/**
 * Helper to get all available departments for selection.
 */
export async function getAvailableDepartments() {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("departments")
        .select("id, department_name, department_code, description")
        .eq("is_active", true)
        .order("department_name");

    if (error) {
        console.error("Error fetching departments:", error);
        return [];
    }
    return data;
}

/**
 * Assigns a department to a user.
 */
export async function assignUserDepartment(userId: string, departmentId: string) {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.from("user_departments").insert({
        user_id: userId,
        department_id: departmentId,
        is_primary: true
    });

    if (error) {
        throw new Error(`Failed to assign department: ${error.message}`);
    }

    revalidatePath("/dashboard");
    return { success: true };
}
