import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function BrandingHeader() {
    return (
        <div className="mb-12 md:mb-20 w-full flex justify-between items-center bg-white/50 backdrop-blur-sm px-4 py-2 border-b-4 border-black">
            <h1 className="font-bebas text-3xl md:text-4xl tracking-widest uppercase text-black">
                Starter Club SF
            </h1>
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
        </div>
    );
}
