export default function MyBoardPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold leading-7 text-foreground sm:truncate sm:text-3xl sm:tracking-tight">
                My Board
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
                Manage your tasks and projects.
            </p>
            {/* Kanban Placeholder */}
            <div className="mt-8 h-96 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Kanban Board Placeholder</span>
            </div>
        </div>
    )
}
