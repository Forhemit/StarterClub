import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SecretMenuPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-green-400 p-12 font-mono selection:bg-green-900 selection:text-white">
            <div className="max-w-2xl mx-auto space-y-12">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tighter text-white">
                        $ SECRET_MENU <span className="animate-pulse">_</span>
                    </h1>
                    <p className="text-zinc-500 text-lg">
                        Test credentials for development access.
                    </p>
                </div>

                <div className="space-y-8 border border-zinc-800 p-8 rounded-lg bg-zinc-900/50">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-zinc-600 font-bold">Universal Password</label>
                        <div className="text-xl bg-black p-4 rounded border border-zinc-800 select-all hover:border-green-800 transition-colors">
                            [REDACTED]
                        </div>
                    </div>

                    <div className="grid gap-6">
                        <CredentialBlock
                            role="Super Admin"
                            email="stephenobamastokes@gmail.com"
                            desc="Full system access"
                        />
                        <CredentialBlock
                            role="Partner Admin"
                            email="partneradmin@acme.com"
                            desc="Manage Acme Corp"
                        />
                        <CredentialBlock
                            role="Partner Member"
                            email="partner@acme.com"
                            desc="View Acme Corp"
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button asChild className="bg-green-600 text-black hover:bg-green-500 font-bold">
                        <Link href="/sign-in">
                            Go to Sign In
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-900">
                        <Link href="/">
                            Back Home
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

function CredentialBlock({ role, email, desc }: { role: string, email: string, desc: string }) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-white font-bold">{role}</h3>
                <span className="text-xs text-zinc-600">{desc}</span>
            </div>
            <div className="bg-black p-3 rounded border border-zinc-800 text-zinc-300 text-sm select-all font-mono">
                {email}
            </div>
        </div>
    );
}
