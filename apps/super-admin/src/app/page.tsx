import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white">
            <div className="mb-8">
                <Image
                    src="https://o341ovdtm5.ufs.sh/f/az1cgdYYLQv4wopWHB0jbDenCfGJgyZm9vhqzIaK6NLTWo8V"
                    alt="Starter Club Logo"
                    width={80}
                    height={80}
                    className="rounded-lg"
                />
            </div>
            <div className="text-center max-w-lg px-6">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Super Admin Portal</h1>
                <p className="text-zinc-400 mb-8">
                    Secure access to Starter Club Mission Control.
                    Authorized personnel only.
                </p>

                <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-6 py-3 font-semibold text-white transition hover:bg-rose-700"
                >
                    <ShieldCheck size={20} />
                    Enter Mission Control
                    <ArrowRight size={20} />
                </Link>
            </div>

            <div className="fixed bottom-6 text-xs text-zinc-600">
                System v1.0 • Secure Connection
            </div>
        </div>
    );
}
