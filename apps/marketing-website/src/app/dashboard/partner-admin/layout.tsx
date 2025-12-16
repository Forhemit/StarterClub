import { DashboardSidebar, DashboardMobileNav } from "@/components/dashboard/DashboardSidebar";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function PartnerAdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    return (
        <div className="flex min-h-screen bg-gray-50/50">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 border-r bg-white fixed inset-y-0 z-30">
                <DashboardSidebar role="partner_admin" />
            </aside>

            {/* Main Content */}
            <div className="flex-1 md:ml-64 flex flex-col">
                {/* Mobile Header */}
                <header className="md:hidden h-14 border-b bg-white flex items-center px-4 sticky top-0 z-40">
                    <DashboardMobileNav role="partner_admin" />
                    <span className="font-bebas text-lg text-[var(--accent)] ml-3">Partner Admin</span>
                </header>

                <main className="flex-1 p-6 lg:p-10 overflow-auto">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>

                <DashboardFooter role="partner_admin" />
            </div>
        </div>
    );
}
