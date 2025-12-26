import Link from "next/link";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-background border-t border-border py-12 px-6 transition-colors duration-300">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm">

                {/* Left Side: Copyright */}
                <div className="flex flex-col gap-4 text-center md:text-left">
                    <div className="text-muted-foreground font-sans racetrack:font-mono racetrack:text-xs racetrack:uppercase racetrack:tracking-wider">
                        © {currentYear} Starter Club SF. All Rights Reserved.
                    </div>
                </div>

                {/* Right Side: Navigation */}
                <div className="flex flex-col items-center md:items-end gap-4">

                    {/* Logins Row */}
                    <div className="flex gap-6 text-muted-foreground font-sans racetrack:font-mono racetrack:text-xs racetrack:uppercase">
                        <Link href="/member-login" className="hover:text-foreground transition-colors">Member Login</Link>
                        <Link href="/partner-login" className="hover:text-foreground transition-colors">Partner Login</Link>
                        <Link href="/employee-login" className="hover:text-foreground transition-colors">Employee Login</Link>
                    </div>

                    {/* Legal Links */}
                    <nav className="flex flex-wrap justify-center md:justify-end gap-6 text-muted-foreground font-sans text-xs racetrack:font-mono racetrack:uppercase">
                        <Link href="/legal/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                        <Link href="/legal/terms" className="hover:text-foreground transition-colors">Terms of Use</Link>
                        <Link href="/legal/cookies" className="hover:text-foreground transition-colors">About Cookies</Link>
                        <Link href="/legal/california-privacy-rights" className="hover:text-foreground transition-colors">Your California Privacy Rights</Link>
                    </nav>

                </div>

            </div>
        </footer>
    );
}
