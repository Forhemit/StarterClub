"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";

export type PartnerContext = {
    expertise: string[];
    capacity: string[];
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

export async function updatePartnerContext(context: Omit<PartnerContext, 'completedAt'>) {
    const { userId } = await auth();

    if (!userId) {
        return { error: "No Logged In User" };
    }

    try {
        const client = await clerkClient();

        const finalContext: PartnerContext = {
            ...context,
            completedAt: new Date().toISOString()
        };

        await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                partnerContext: finalContext,
                partnerContextComplete: true,
                onboardingComplete: true, // Ensure this is set
                userTrack: 'support_builders', // Reinforced
                userIntent: 'partner',
                orgType: 'individual'
            },
        });
        return { success: true };
    } catch (err) {
        console.error("Failed to update partner context:", err);
        return { error: "Failed to update partner context" };
    }
}
