export default function MissionControlPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold leading-7 text-foreground sm:truncate sm:text-3xl sm:tracking-tight">
                Mission Control
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
                Admin view for team management.
            </p>
            {/* Admin Placeholder */}
            <div className="mt-8 border border-border rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                        <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-foreground sm:pl-6">
                                Name
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">
                                Status
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">
                                Role
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-card">
                        <tr>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-foreground sm:pl-6">
                                Member Name
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">Active</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">Member</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
