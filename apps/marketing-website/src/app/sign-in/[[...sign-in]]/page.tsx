import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50/50">
            <div className="w-full max-w-sm">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bebas text-[var(--accent)] text-4xl mb-2">PARTNER LOGIN</h1>
                    <p className="text-muted-foreground text-sm">Welcome back to the club.</p>
                </div>
                <SignIn forceRedirectUrl="/dashboard" />
            </div>
        </div>
    );
}
