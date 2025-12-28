"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";

export type MemberContext = {
    stage: 'new' | 'existing';
    model: 'online' | 'physical' | 'hybrid';
    primaryGoal: string;
    organizationInfo?: {
        name: string;
        firstName: string;
        lastName: string;
        phone: string;
        contactEmail: string;
    };
    completedAt: string; // ISO string
};

export async function updateMemberContext(context: Omit<MemberContext, 'completedAt'>) {
    const { userId } = await auth();

    if (!userId) {
        return { error: "No Logged In User" };
    }

    try {
        const client = await clerkClient();

        const finalContext: MemberContext = {
            ...context,
            completedAt: new Date().toISOString()
        };

        // Note: This updates publicMetadata. 
        // Existing keys like 'userTrack' and 'onboardingComplete' will be preserved if they are top-level keys 
        // and we are not overwriting them here (we are only passing the keys we want to update).
        // Clerk's updateUser performs a deep merge on metadata.
        await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                memberContext: finalContext,
                memberContextComplete: true,
                // Ensure base onboarding flags are set in case they were skipped (unauth flow)
                onboardingComplete: true,
                userTrack: 'build_something',
                userIntent: 'member',
                orgType: 'individual' // Default for now
            },
        });
        return { success: true };
    } catch (err) {
        console.error("Failed to update user context:", err);
        return { error: "Failed to update user context" };
    }
}
