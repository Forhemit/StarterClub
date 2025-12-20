import Link from "next/link";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-white border-t border-black/5 py-12 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm">

                {/* Left Side: Copyright */}
                <div className="flex flex-col gap-4 text-center md:text-left">
                    <div className="text-black/40 font-sans">
                        © {currentYear} Starter Club SF. All Rights Reserved.
                    </div>
                </div>

                {/* Right Side: Navigation */}
                <div className="flex flex-col items-center md:items-end gap-4">

                    {/* Logins Row */}
                    <div className="flex gap-6 text-black/60 font-sans">
                        <Link href="/login" className="hover:text-black transition-colors">Member Login</Link>
                        <Link href="/partner-login" className="hover:text-black transition-colors">Partner Login</Link>
                        <Link href="/employee-login" className="hover:text-black transition-colors">Employee Login</Link>
                    </div>

                    {/* Legal Links */}
                    <nav className="flex flex-wrap justify-center md:justify-end gap-6 text-black/40 font-sans text-xs">
                        <Link href="/legal/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
                        <Link href="/legal/terms" className="hover:text-black transition-colors">Terms of Use</Link>
                        <Link href="/legal/cookies" className="hover:text-black transition-colors">About Cookies</Link>
                        <Link href="/legal/california-privacy-rights" className="hover:text-black transition-colors">Your California Privacy Rights</Link>
                    </nav>

                </div>

            </div>
        </footer>
    );
}
