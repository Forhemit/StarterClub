"use client"

import * as React from "react"
import { Moon, Sun, Laptop, Flag, Gauge } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "./ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"

export function ModeToggle() {
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <Button variant="outline" size="icon" className="relative" disabled>
                <Sun className="h-[1.2rem] w-[1.2rem] scale-100 dark:scale-0" />
                <span className="sr-only">Toggle theme</span>
            </Button>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 racetrack:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 racetrack:scale-0" />
                    <Gauge className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all racetrack:rotate-0 racetrack:scale-100 dark:scale-0" />
                    <span className="sr-only">Toggle theme</span>
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
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Laptop className="mr-2 h-4 w-4" />
                    System
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("racetrack")}>
                    <Flag className="mr-2 h-4 w-4" />
                    Race Track
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
