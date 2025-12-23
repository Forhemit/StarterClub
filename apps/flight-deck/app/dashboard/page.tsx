import { createClient } from '../../lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/sign-in');
    }

    // 1. Get User Business
    const { data: businessData } = await supabase
        .from('user_businesses')
        .select('id, business_name')
        .eq('user_id', user.id)
        .single();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const business = businessData as any;

    if (!business) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="bg-primary/10 p-4 rounded-full mb-6">
                    <span className="text-4xl">🚀</span>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-foreground">Prepare for Takeoff</h2>
                <p className="text-muted-foreground max-w-md mb-8">
                    Welcome to Starter Club! You haven't registered your business on the Flight Deck yet. 
                    Let's get your mission started.
                </p>
                <a 
                    href="/onboarding" 
                    className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                    Start Business Registration
                </a>
            </div>
        );
    }

    // 2. Get Checklist Status
    const { data: rawChecklistStatuses, error } = await supabase
        .from('user_checklist_status')
        .select(`
            id,
            completed_at,
            checklist_items (
                id,
                title,
                description
            ),
            statuses (
                name
            )
        `)
        .eq('user_business_id', business.id);
        
    if (error) {
        console.error("Error fetching checklist:", error);
    }

    // Define types for better handling
    interface ChecklistItem {
        id: string;
        title: string;
        description: string | null;
    }
    
    interface ChecklistStatus {
        id: string;
        completed_at: string | null;
        checklist_items: ChecklistItem | null;
        statuses: { name: string } | null;
    }

    const checklistStatuses = (rawChecklistStatuses as unknown as ChecklistStatus[]) || [];

    // Calculate Stats
    const totalItems = checklistStatuses.length;
    const completedItems = checklistStatuses.filter(item => item.statuses?.name === 'complete').length;
    const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    // Next Actions (Not started or In Progress)
    const nextActions = checklistStatuses
        .filter(item => item.statuses?.name !== 'complete')
        .sort((a, b) => {
             // Prioritize: In Progress first, then Not Started
             if (a.statuses?.name === 'in_progress' && b.statuses?.name !== 'in_progress') return -1;
             if (a.statuses?.name !== 'in_progress' && b.statuses?.name === 'in_progress') return 1;
             return 0;
        })
        .slice(0, 5);

    // Recent Wins
    const recentWins = checklistStatuses
        .filter(item => item.statuses?.name === 'complete')
        .sort((a, b) => {
            const dateA = a.completed_at ? new Date(a.completed_at).getTime() : 0;
            const dateB = b.completed_at ? new Date(b.completed_at).getTime() : 0;
            return dateB - dateA;
        })
        .slice(0, 5);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold leading-7 text-foreground sm:truncate sm:text-3xl sm:tracking-tight">
                    {business.business_name || 'Command Console'}
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Welcome to your Flight Deck. Overview of your project progress and next critical steps.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Flight Status Widget */}
                <div className="bg-card p-6 shadow-sm rounded-xl border border-border">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-foreground">Flight Status</h3>
                        <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">LIVE</span>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-end justify-between mb-2">
                            <span className="text-5xl font-extrabold tracking-tight text-primary">{progress}%</span>
                            <div className="text-right">
                                <span className="block text-sm font-medium text-foreground">{completedItems}/{totalItems}</span>
                                <span className="text-xs text-muted-foreground">Tasks Done</span>
                            </div>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                            <div 
                                className="bg-primary h-full rounded-full transition-all duration-1000 ease-out" 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <p className="mt-4 text-xs text-muted-foreground">
                            {progress === 100 ? "Ready for orbit! All core tasks complete." : "Proceed with mission checklist."}
                        </p>
                    </div>
                </div>

                {/* Next Actions Widget */}
                <div className="bg-card p-6 shadow-sm rounded-xl border border-border">
                    <h3 className="font-semibold text-foreground mb-4">Next Actions</h3>
                    {nextActions.length > 0 ? (
                        <ul className="space-y-4">
                            {nextActions.map((action) => (
                                <li key={action.id} className="group flex items-start gap-3">
                                    <div className={`mt-1 h-3 w-3 rounded-full flex-shrink-0 ${action.statuses?.name === 'in_progress' ? 'bg-amber-400 animate-pulse' : 'bg-muted-foreground/30'}`} />
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-foreground truncate">{action.checklist_items?.title}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 group-hover:line-clamp-none transition-all">
                                            {action.checklist_items?.description || "No description provided."}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <span className="text-2xl mb-2">✨</span>
                            <p className="text-sm font-medium text-foreground">All systems clear!</p>
                            <p className="text-xs text-muted-foreground">Check back for new flight tasks.</p>
                        </div>
                    )}
                </div>

                {/* Recent Wins Widget */}
                <div className="bg-card p-6 shadow-sm rounded-xl border border-border">
                    <h3 className="font-semibold text-foreground mb-4">Recent Wins</h3>
                     {recentWins.length > 0 ? (
                        <ul className="space-y-4">
                            {recentWins.map((win) => (
                                <li key={win.id} className="flex items-start gap-3">
                                    <div className="mt-0.5 h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                                        <span className="text-green-600 text-[10px] font-bold">✓</span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-foreground truncate">{win.checklist_items?.title}</p>
                                        <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/60 mt-0.5">
                                            {win.completed_at ? new Date(win.completed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Mission Logged'}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <span className="text-2xl mb-2">🎯</span>
                            <p className="text-sm font-medium text-foreground">No wins logged yet.</p>
                            <p className="text-xs text-muted-foreground">Complete your first task to see it here!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}