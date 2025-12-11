import { Footer } from "@/components/Footer";
import Link from "next/link";

export default function LegalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-white text-black font-sans">
            <header className="p-6 border-b border-black/5">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link href="/" className="font-bebas text-2xl uppercase tracking-widest text-black/80 hover:text-black transition-colors">
                        Starter Club SF
                    </Link>
                    <Link href="/" className="text-sm uppercase tracking-wide font-bold hover:underline">
                        Back to Home
                    </Link>
                </div>
            </header>

            <main className="flex-grow w-full max-w-4xl mx-auto px-6 py-12 md:py-24">
                {children}
            </main>

            <Footer />
        </div>
    );
}
