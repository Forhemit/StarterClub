import { Sidebar } from "@/components/dashboard/shared/Sidebar";

export default function EmployeePortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex transition-colors duration-300">
            <Sidebar />
            <main className="flex-1 overflow-auto h-screen">
                {children}
            </main>
        </div>
    );
}
