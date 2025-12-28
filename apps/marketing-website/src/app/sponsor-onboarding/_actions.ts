"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";

export type SponsorContext = {
    hotButtons: string[];
    partnerInterest: boolean;
    companyInfo: {
        name: string;
        firstName: string;
        lastName: string;
        phone: string;
        contactEmail: string;
    };
    completedAt: string; // ISO string
};

export async function completeSponsorOnboarding(context: Omit<SponsorContext, 'completedAt'>) {
    const { userId } = await auth();

    if (!userId) {
        return { error: "No Logged In User" };
    }

    try {
        const client = await clerkClient();

        const finalContext: SponsorContext = {
            ...context,
            completedAt: new Date().toISOString()
        };

        await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                sponsorContext: finalContext,
                onboardingComplete: true,
                userTrack: 'amplify_brand',
                userIntent: 'sponsor',
                orgType: 'business'
            },
        });
        return { success: true };
    } catch (err) {
        console.error("Failed to update sponsor context:", err);
        return { error: "Failed to update sponsor context" };
    }
}
