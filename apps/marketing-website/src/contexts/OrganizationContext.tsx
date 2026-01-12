"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/lib/supabase/browser"; // Updated import

export interface Organization {
    id: string;
    name: string;
    slug: string | null;
    owner_email: string | null;
    created_at: string;
}

interface OrganizationContextType {
    organization: Organization | null;
    allOrganizations: Organization[];
    isLoading: boolean;
    switchOrganization: (orgId: string) => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [allOrganizations, setAllOrganizations] = useState<Organization[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = useSupabase(); // Use hook
    const router = useRouter();

    useEffect(() => {
        async function loadOrganizations() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    setIsLoading(false);
                    return;
                }

                // Fetch organizations the user owns
                // In the future, this should also join organization_companies to find orgs they are a MEMBER of.
                // For Phase 2/3, we focus on Ownership.
                const { data: orgs, error } = await supabase
                    .from('organizations')
                    .select('*')
                    .eq('owner_email', user.email!)
                    .order('created_at', { ascending: true });

                if (error) {
                    console.error('Failed to load organizations', error);
                }

                if (orgs && orgs.length > 0) {
                    setAllOrganizations(orgs);

                    // Default to first org, or restore from localStorage if needed
                    // For now, simple default:
                    setOrganization(orgs[0]);
                }
            } catch (err) {
                console.error('Error in OrganizationProvider:', err);
            } finally {
                setIsLoading(false);
            }
        }

        // Subscribe to auth changes to reload orgs on login
        const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
            loadOrganizations();
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const switchOrganization = async (orgId: string) => {
        const target = allOrganizations.find(o => o.id === orgId);
        if (target) {
            setOrganization(target);
            // Optional: Persist preference to DB or LocalStorage
            router.refresh(); // Refresh server components to pick up new context? 
            // Note: Server components need the cookie/header to change if they rely on it.
            // For purely client-side RLS (via the token), the token already has the claim... 
            // BUT the claim in the token is "static" until refreshed.
            // IF we want to switch orgs and have RLS work for the NEW org, we need to update the JWT claim.
            // This is tricky. 
            // Temporary strategy: The JWT claim 'organization_id' is the "Primary" one.
            // If we switch orgs in the UI, we might need to "impersonate" or update the user's metadata 
            // to switch the "active" org in the backend, then refresh the token.

            // For now, let's assume single-org use case is dominant, and switching is a metadata update.
            // We will keep it client-state only for this step, as per plan.
        }
    };

    return (
        <OrganizationContext.Provider value={{ organization, allOrganizations, isLoading, switchOrganization }}>
            {children}
        </OrganizationContext.Provider>
    );
}

export function useOrganization() {
    const context = useContext(OrganizationContext);
    if (context === undefined) {
        throw new Error('useOrganization must be used within an OrganizationProvider');
    }
    return context;
}
