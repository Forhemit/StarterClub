'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    KanbanSquare,
    TowerControl,
    Settings,
    Menu,
    X,
    Plane,
    Globe,
} from 'lucide-react'
import { logout } from '@/app/actions/auth'
import { useRouter } from 'next/navigation'
import { ModeToggle } from '@/components/theme-toggle'

const navigation = [
    { name: 'Command Console', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Board', href: '/dashboard/my-board', icon: KanbanSquare },
    { name: 'Mission Control', href: '/dashboard/mission-control', icon: TowerControl },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()

    const handleSignOut = async () => {
        await logout()
        router.push('/login')
        router.refresh()
    }

    return (
        <>
            <div>
                {/* Mobile sidebar */}
                <div
                    className={`relative z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'
                        }`}
                >
                    <div className="fixed inset-0 bg-gray-900/80" />

                    <div className="fixed inset-0 flex">
                        <div className="relative mr-16 flex w-full max-w-xs flex-1">
                            <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                <button
                                    type="button"
                                    className="-m-2.5 p-2.5"
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <span className="sr-only">Close sidebar</span>
                                    <X className="h-6 w-6 text-white" aria-hidden="true" />
                                </button>
                            </div>

                            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-background px-6 pb-4">
                                <div className="flex h-16 shrink-0 items-center">
                                    <Plane className="h-8 w-8 text-primary" />
                                    <span className="ml-2 text-xl font-bold text-foreground">Flight Deck</span>
                                </div>
                                <nav className="flex flex-1 flex-col">
                                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                        <li>
                                            <ul role="list" className="-mx-2 space-y-1">
                                                {navigation.map((item) => (
                                                    <li key={item.name}>
                                                        <Link
                                                            href={item.href}
                                                            className={classNames(
                                                                pathname === item.href
                                                                    ? 'bg-accent text-primary'
                                                                    : 'text-muted-foreground hover:text-primary hover:bg-accent',
                                                                'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                            )}
                                                        >
                                                            <item.icon
                                                                className={classNames(
                                                                    pathname === item.href
                                                                        ? 'text-primary'
                                                                        : 'text-muted-foreground group-hover:text-primary',
                                                                    'h-6 w-6 shrink-0'
                                                                )}
                                                                aria-hidden="true"
                                                            />
                                                            {item.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                        <li className="mt-auto">
                                            <a
                                                href={process.env.NEXT_PUBLIC_MARKETING_URL || 'http://localhost:3000'}
                                                className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-muted-foreground hover:bg-accent hover:text-primary"
                                            >
                                                <Globe
                                                    className="h-6 w-6 shrink-0 text-muted-foreground group-hover:text-primary"
                                                    aria-hidden="true"
                                                />
                                                Back to Website
                                            </a>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Static sidebar for desktop */}
                <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-background px-6 pb-4">
                        <div className="flex h-16 shrink-0 items-center">
                            <Plane className="h-8 w-8 text-primary" />
                            <span className="ml-2 text-xl font-bold text-foreground">Flight Deck</span>
                        </div>
                        <nav className="flex flex-1 flex-col">
                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                <li>
                                    <ul role="list" className="-mx-2 space-y-1">
                                        {navigation.map((item) => (
                                            <li key={item.name}>
                                                <Link
                                                    href={item.href}
                                                    className={classNames(
                                                        pathname === item.href
                                                            ? 'bg-accent text-primary'
                                                            : 'text-muted-foreground hover:text-primary hover:bg-accent',
                                                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                    )}
                                                >
                                                    <item.icon
                                                        className={classNames(
                                                            pathname === item.href
                                                                ? 'text-primary'
                                                                : 'text-muted-foreground group-hover:text-primary',
                                                            'h-6 w-6 shrink-0'
                                                        )}
                                                        aria-hidden="true"
                                                    />
                                                    {item.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                                <li className="mt-auto">
                                    <a
                                        href={process.env.NEXT_PUBLIC_MARKETING_URL || 'http://localhost:3000'}
                                        className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-muted-foreground hover:bg-accent hover:text-primary"
                                    >
                                        <Globe
                                            className="h-6 w-6 shrink-0 text-muted-foreground group-hover:text-primary"
                                            aria-hidden="true"
                                        />
                                        Back to Website
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>

                <div className="lg:pl-72">
                    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                        <button
                            type="button"
                            className="-m-2.5 p-2.5 text-muted-foreground lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <span className="sr-only">Open sidebar</span>
                            <Menu className="h-6 w-6" aria-hidden="true" />
                        </button>
                        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                            <div className="flex flex-1" />
                            <div className="flex items-center gap-x-4 lg:gap-x-6">
                                <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />
                                <div className="flex items-center gap-x-4">
                                    <ModeToggle />
                                    <button
                                        onClick={handleSignOut}
                                        className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <main className="py-10">
                        <div className="px-4 sm:px-6 lg:px-8">{children}</div>
                    </main>
                </div>
            </div>
        </>
    )
}
