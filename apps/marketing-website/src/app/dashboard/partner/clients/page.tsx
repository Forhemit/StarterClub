import { getChecklistData } from '@/app/actions/checklist';
import { getClients } from '@/app/actions/clients';
import { Users, UserPlus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default async function ClientsPage() {
    const { business } = await getChecklistData();
    const clients = await getClients(business.id);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Client Tracking</h1>
                    <p className="text-slate-500 mt-1">Manage your coaching engagements and track outcomes.</p>
                </div>
                <Button className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    New Client
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 text-blue-600 mb-2">
                        <Users className="h-5 w-5" />
                        <span className="text-sm font-bold uppercase tracking-wider">Total Clients</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">{clients?.length || 0}</div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input className="pl-9 h-9 text-sm" placeholder="Search clients..." />
                    </div>
                </div>

                <div className="divide-y divide-slate-100">
                    {clients && clients.length > 0 ? (
                        clients.map((client) => (
                            <div key={client.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                                        {client.first_name[0]}{client.last_name[0]}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900">{client.first_name} {client.last_name}</div>
                                        <div className="text-xs text-slate-500">{client.email || 'No email provided'}</div>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                    View Engagement
                                </Button>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center">
                            <Users className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900">No clients yet</h3>
                            <p className="text-slate-500 text-sm">Add your first coaching client to start tracking progress.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
