import { createClient } from '../../../lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function MyBoardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/sign-in');
    }

    // 1. Get User Business
    const { data: businessData } = await supabase
        .from('user_businesses')
        .select('id')
        .eq('user_id', user.id)
        .single();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const business = businessData as any;

    if (!business) {
        redirect('/dashboard'); // Redirect to dashboard if no business (dashboard handles empty state)
    }

    // 2. Get Checklist Items
    const { data: rawChecklistStatuses, error } = await supabase
        .from('user_checklist_status')
        .select(`
            id,
            status_id,
            checklist_items (
                id,
                title,
                description,
                category_id
            ),
            statuses (
                name
            )
        `)
        .eq('user_business_id', business.id);

    if (error) {
        console.error("Error fetching board data:", error);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items: any[] = rawChecklistStatuses || [];

    // 3. Group by Status
    const todoItems = items.filter(item => item.statuses?.name === 'not_started');
    const inProgressItems = items.filter(item => item.statuses?.name === 'in_progress');
    const doneItems = items.filter(item => item.statuses?.name === 'complete');

    // Helper for cards
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const TaskCard = ({ item }: { item: any }) => (
        <div className="bg-card p-4 rounded-lg shadow-sm border border-border mb-3 hover:shadow-md transition-shadow">
            <h4 className="font-medium text-sm text-foreground">{item.checklist_items?.title}</h4>
            {item.checklist_items?.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {item.checklist_items.description}
                </p>
            )}
            <div className="mt-3 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/60 bg-muted px-1.5 py-0.5 rounded">
                    Task
                </span>
                {/* Future: Add due date or priority here */}
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <h1 className="text-2xl font-bold leading-7 text-foreground sm:truncate sm:text-3xl sm:tracking-tight">
                    My Board
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Visualise your workflow and move tasks to completion.
                </p>
            </div>

            <div className="flex-1 overflow-x-auto">
                <div className="flex gap-6 h-full min-w-[1000px] pb-4">
                    
                    {/* Column: To Do */}
                    <div className="flex-1 min-w-[300px] bg-muted/30 rounded-xl p-4 border border-border/50">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                                To Do
                            </h3>
                            <span className="bg-background text-foreground text-xs font-medium px-2 py-0.5 rounded-full border border-border">
                                {todoItems.length}
                            </span>
                        </div>
                        <div className="space-y-3">
                            {todoItems.length > 0 ? (
                                todoItems.map(item => <TaskCard key={item.id} item={item} />)
                            ) : (
                                <div className="text-center py-10 opacity-50 border-2 border-dashed border-border rounded-lg">
                                    <p className="text-sm">No new tasks</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Column: In Progress */}
                    <div className="flex-1 min-w-[300px] bg-muted/30 rounded-xl p-4 border border-border/50">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
                                In Progress
                            </h3>
                            <span className="bg-background text-foreground text-xs font-medium px-2 py-0.5 rounded-full border border-border">
                                {inProgressItems.length}
                            </span>
                        </div>
                        <div className="space-y-3">
                             {inProgressItems.length > 0 ? (
                                inProgressItems.map(item => <TaskCard key={item.id} item={item} />)
                            ) : (
                                <div className="text-center py-10 opacity-50 border-2 border-dashed border-border rounded-lg">
                                    <p className="text-sm">Nothing in progress</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Column: Done */}
                    <div className="flex-1 min-w-[300px] bg-muted/30 rounded-xl p-4 border border-border/50">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                Completed
                            </h3>
                            <span className="bg-background text-foreground text-xs font-medium px-2 py-0.5 rounded-full border border-border">
                                {doneItems.length}
                            </span>
                        </div>
                        <div className="space-y-3">
                             {doneItems.length > 0 ? (
                                doneItems.map(item => <TaskCard key={item.id} item={item} />)
                            ) : (
                                <div className="text-center py-10 opacity-50 border-2 border-dashed border-border rounded-lg">
                                    <p className="text-sm">No completed tasks yet</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}