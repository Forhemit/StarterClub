"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function completeOnboarding(formData: FormData) {
    const { userId } = await auth();

    if (!userId) {
        return { message: "No Logged In User" };
    }

    const track = formData.get("track") as string;
    const intent = formData.get("intent") as string;
    const orgType = formData.get("orgType") as string;

    try {
        const client = await clerkClient(); // Await the client
        await client.users.updateUser(userId, {
            publicMetadata: {
                onboardingComplete: true,
                userTrack: track,
                userIntent: intent,
                orgType: orgType,
            },
        });
        return { success: true };
    } catch (err) {
        console.error("Failed to update user metadata:", err);
        return { error: "Failed to update user metadata" };
    }
}
