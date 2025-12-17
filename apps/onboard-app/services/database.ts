import { supabase } from './supabaseClient';
import { VisitRecord, Member, VisitType, MemberIntent, ResourceType, GuestProfile } from '../types';

export class DatabaseService {

    // Map utilities
    private mapProfileToMember(p: any): Member {
        return {
            id: p.id,
            firstName: p.first_name || '',
            lastName: p.last_name || '',
            tier: (p.tier as any) || 'Starter',
            photoUrl: p.photo_url,
            joinDate: p.created_at,
            isInBuilding: p.is_in_building
        };
    }

    private mapLogToVisit(l: any): VisitRecord {
        return {
            id: l.id,
            timestamp: l.created_at,
            type: l.visit_type as VisitType,
            memberId: l.member_id,
            guestProfile: l.guest_data,
            intent: l.intent as MemberIntent,
            resourceUsed: l.resource_used as ResourceType,
            resourceDurationHours: Number(l.resource_duration_hours),
            paymentCollected: Number(l.payment_collected),
            workDescription: l.description,
            aiCategory: l.ai_category
        };
    }

    async getMembers(): Promise<Member[]> {
        const { data, error } = await supabase.from('profiles').select('*');
        if (error) {
            console.error("Error fetching members:", error);
            return [];
        }
        return data.map(this.mapProfileToMember);
    }

    async getVisits(): Promise<VisitRecord[]> {
        const { data, error } = await supabase.from('activity_log').select('*').order('created_at', { ascending: false });
        if (error) {
            console.error("Error fetching visits:", error);
            return [];
        }
        return data.map(this.mapLogToVisit);
    }

    async addVisit(visit: Omit<VisitRecord, 'id' | 'timestamp'>): Promise<VisitRecord> {
        const row = {
            member_id: visit.memberId,
            visit_type: visit.type,
            intent: visit.intent,
            resource_used: visit.resourceUsed,
            resource_duration_hours: visit.resourceDurationHours,
            payment_collected: visit.paymentCollected,
            description: visit.workDescription,
            ai_category: visit.aiCategory,
            guest_data: visit.guestProfile
        };

        const { data, error } = await supabase.from('activity_log').insert(row).select().single();
        if (error) {
            console.error("Error adding visit:", error);
            throw error;
        }

        // If member check-in, update is_in_building?
        // Logic not strictly in db service, but good place.
        if (visit.memberId) {
            await supabase.from('profiles').update({ is_in_building: true }).eq('id', visit.memberId);
        }

        return this.mapLogToVisit(data);
    }

    async findMember(identifier: string, lastName: string): Promise<Member | undefined> {
        const cleanId = identifier.toLowerCase().trim();
        const cleanLast = lastName.toLowerCase().trim();

        // Search by ID or phone. 
        // Using ILIKE for flexibility? Or exact match.
        // Profiles has 'phone' and 'id'.

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .or(`id.eq.${cleanId},phone.eq.${cleanId}`)
            .ilike('last_name', cleanLast)
            .maybeSingle();

        if (error) console.error("Error finding member:", error);
        if (!data) return undefined;

        return this.mapProfileToMember(data);
    }
}

export const db = new DatabaseService();
