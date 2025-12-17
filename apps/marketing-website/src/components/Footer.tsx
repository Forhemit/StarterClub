import Link from "next/link";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-white border-t border-black/5 py-12 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm">

                {/* Copyright */}
                <div className="text-black/40 font-sans">
                    © {currentYear} Starter Club SF. All Rights Reserved.
                </div>

                {/* Legal Links */}
                <nav className="flex flex-wrap justify-center gap-6 text-black/60 font-sans">
                    <Link href="/legal/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
                    <Link href="/legal/terms" className="hover:text-black transition-colors">Terms of Use</Link>
                    <Link href="/legal/cookies" className="hover:text-black transition-colors">About Cookies</Link>
                    <Link href="/legal/california-privacy-rights" className="hover:text-black transition-colors">Your California Privacy Rights</Link>
                    <Link href="/employee-portal" className="hover:text-black transition-colors text-orange-500/50 hover:text-orange-600">Employee Portal</Link>
                </nav>

            </div>
        </footer>
    );
}
