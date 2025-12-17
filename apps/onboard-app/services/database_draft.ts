import { supabase } from './supabaseClient';
import { VisitRecord, Member, VisitType, MemberIntent, ResourceType } from '../types';

class Database {
    // Cache members to avoid frequent fetches? Or fetch strictly.
    // MockDatabase was synchronous. This needs to be asynchronous?
    // If the App expects synchronous return, we have a problem.
    // MockDatabase.addVisit returns VisitRecord immediately.
    // MockDatabase.getMembers returns Member[] immediately.

    // Checking App usage is critical. If App expects sync, we might need to load initial state or refactor App to async.
    // Assuming we need to refactor App to handle async, OR keep state in memory and sync in background.
    // For a kiosk, offline-first/optimistic is good.

    // NOTE: Initial implementation will try to mimic sync by pre-fetching?
    // But addVisit needs to start a request.
    // If I change the signature to Promise, I break App.tsx. I should check App.tsx.

    private membersCache: Member[] = [];
    private visitsCache: VisitRecord[] = [];

    constructor() {
        this.refreshMembers();
        this.refreshVisits();
    }

    async refreshMembers() {
        const { data, error } = await supabase.from('profiles').select('*');
        if (data) {
            // Map keys if necessary. Supabase uses snake_case usually?
            // My migration uses snake_case (first_name). Types use camelCase (firstName).
            this.membersCache = data.map((p: any) => ({
                id: p.id,
                firstName: p.first_name,
                lastName: p.last_name,
                tier: p.tier,
                photoUrl: p.photo_url,
                joinDate: p.created_at, // or join_date if column exists
                isInBuilding: p.is_in_building
            }));
        }
    }

    async refreshVisits() {
        // similar fetch
    }

    // .. implementation placeholders
}
// ...
