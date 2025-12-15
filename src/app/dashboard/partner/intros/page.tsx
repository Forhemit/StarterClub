export default function IntrosPage() {
    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-bold tracking-tight">Intros & Referrals</h1>
                <p className="text-muted-foreground mt-2">Manage your incoming introductions and track their status.</p>
            </div>
            <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                No active intros found.
            </div>
        </div>
    );
}
