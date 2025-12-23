import { getChecklistData } from '@/app/actions/checklist';
import { getClients } from '@/app/actions/clients';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClientList } from '@/components/dashboard/ClientList';

export default async function ClientsPage() {
    const { business } = await getChecklistData();
    const clients = await getClients(business.id);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Client Tracking</h1>
                    <p className="text-muted-foreground mt-1">Real-time oversight of your coaching engagements and mission progress.</p>
                </div>
                <Button className="gap-2 shadow-sm">
                    <UserPlus className="h-4 w-4" />
                    New Client Record
                </Button>
            </div>

            {/* Real-time client list component */}
            <ClientList initialClients={clients || []} businessId={business.id} />
        </div>
    );
}