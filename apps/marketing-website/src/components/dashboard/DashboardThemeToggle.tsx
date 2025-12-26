"use client";

import * as React from "react";
import { Moon, Sun, FlagTriangleRight } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function DashboardThemeToggle({ className }: { className?: string }) {
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button variant="outline" size="sm" className={cn("w-full justify-start gap-2 border-border bg-card text-card-foreground", className)}>
                <span className="w-4 h-4" /> {/* Placeholder for icon */}
                <span>Loading...</span>
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className={cn("w-full justify-start gap-2 border-border bg-card text-card-foreground hover:bg-muted", className)}>
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 racetrack:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 racetrack:scale-0" />
                    <FlagTriangleRight className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all racetrack:rotate-0 racetrack:scale-100 text-primary" />
                    <span className="capitalize">{theme === 'racetrack' ? 'Race Track' : theme} Mode</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("racetrack")}>
                    <FlagTriangleRight className="mr-2 h-4 w-4 text-primary" />
                    Race Track
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
