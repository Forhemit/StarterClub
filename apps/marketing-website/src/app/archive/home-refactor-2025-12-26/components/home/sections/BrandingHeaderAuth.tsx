"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function BrandingHeaderAuth() {
    return (
        <div className="flex items-center gap-4">
            <SignedOut>
                <SignInButton mode="modal">
                    <button className="font-bebas text-xl tracking-wide uppercase hover:underline">
                        Partner Portal
                    </button>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <div className="flex items-center gap-4">
                    <a href="/partners" className="font-bebas text-xl tracking-wide uppercase hover:underline">
                        Enter Portal
                    </a>
                    <UserButton />
                </div>
            </SignedIn>
        </div>
    );
}
