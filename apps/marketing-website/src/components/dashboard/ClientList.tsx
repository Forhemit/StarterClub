'use client';

import { useEffect, useState } from 'react';
import { useSupabase } from '@/lib/supabase/browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Search, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  user_business_id: string;
}

interface ClientListProps {
  initialClients: Client[];
  businessId: string;
}

export function ClientList({ initialClients, businessId }: ClientListProps) {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [searchQuery, setSearchQuery] = useState('');
  const supabase = useSupabase();

  useEffect(() => {
    setClients(initialClients);
  }, [initialClients]);

  useEffect(() => {
    // Subscribe to real-time changes for this business's clients
    const channel = supabase
      .channel(`clients-${businessId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clients',
          filter: `user_business_id=eq.${businessId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setClients((prev) => [...prev, payload.new as Client]);
          } else if (payload.eventType === 'DELETE') {
            setClients((prev) => prev.filter((client) => client.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setClients((prev) =>
              prev.map((client) => (client.id === payload.new.id ? (payload.new as Client) : client))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, businessId]);

  const filteredClients = clients.filter((client) => {
    const fullName = `${client.first_name} ${client.last_name}`.toLowerCase();
    const email = client.email?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{clients.length} Total Clients</span>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Client</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Contact</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="p-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {client.first_name[0]}{client.last_name[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">
                            {client.first_name} {client.last_name}
                          </div>
                          <div className="text-xs text-muted-foreground">ID: {client.id.slice(0, 8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-foreground">{client.email || '—'}</div>
                      <div className="text-xs text-muted-foreground">{client.phone || '—'}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        Active
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Dashboard</DropdownMenuItem>
                          <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Archive Client</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-12 text-center">
                    <Users className="h-12 w-12 text-muted/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground">No clients found</h3>
                    <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                      {clients.length === 0 ? 'Start your first mission by adding a new client.' : 'No results for your current search.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
