import BrandingHeaderAuth from "./BrandingHeaderAuth";
import { ModeToggle } from "@starter-club/ui";

export function BrandingHeader() {
    return (
        <div className="mb-12 md:mb-20 w-full flex justify-between items-center bg-white/50 dark:bg-black/50 backdrop-blur-sm px-4 py-2 border-b-4 border-black dark:border-white racetrack:border-primary transition-colors">
            <div className="flex items-center gap-3">
                <img
                    src="https://o341ovdtm5.ufs.sh/f/az1cgdYYLQv4wopWHB0jbDenCfGJgyZm9vhqzIaK6NLTWo8V"
                    alt="Starter Club Logo"
                    className="h-10 w-10 md:h-12 md:w-12 object-contain rounded-sm"
                />
                <h1 className="font-bebas text-3xl md:text-4xl tracking-widest uppercase text-black dark:text-white racetrack:text-primary transition-colors">
                    Starter Club SF
                </h1>
            </div>
            <div className="flex items-center gap-4">
                <ModeToggle />
                <BrandingHeaderAuth />
            </div>
        </div>
    );
}
