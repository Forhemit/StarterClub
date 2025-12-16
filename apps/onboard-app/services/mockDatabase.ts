import { VisitRecord, Member, VisitType, MemberIntent, ResourceType } from '../types';
import { MOCK_MEMBERS } from '../constants';

// Singleton to persist data in memory during the session without a real backend
class MockDatabase {
  private visits: VisitRecord[] = [];
  private members: (Member & { phone: string })[] = [...MOCK_MEMBERS];

  constructor() {
    // Seed some initial data for the dashboard
    this.seedData();
  }

  private seedData() {
    const today = new Date();
    // Generate 20 random visits for the past week
    for (let i = 0; i < 20; i++) {
        const isMember = Math.random() > 0.4;
        this.visits.push({
            id: `v-seed-${i}`,
            timestamp: new Date(today.getTime() - i * 86400000).toISOString(),
            type: isMember ? VisitType.MEMBER_VISIT : VisitType.NEW_GUEST,
            resourceUsed: Math.random() > 0.7 ? ResourceType.CREATOR_ROOM : ResourceType.WORKSTATION,
            resourceDurationHours: 2,
            paymentCollected: isMember ? 0 : 0,
            intent: isMember ? MemberIntent.WORK : undefined,
            aiCategory: isMember ? ['Marketing', 'Sales', 'Admin'][Math.floor(Math.random()*3)] : undefined
        });
    }
  }

  addVisit(visit: Omit<VisitRecord, 'id' | 'timestamp'>) {
    const newVisit: VisitRecord = {
      ...visit,
      id: `v-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.visits.unshift(newVisit); // Add to top
    console.log("Visit recorded:", newVisit);
    return newVisit;
  }

  getVisits(): VisitRecord[] {
    return this.visits;
  }

  getMembers(): Member[] {
    return this.members;
  }
  
  getMemberById(id: string): Member | undefined {
      return this.members.find(m => m.id === id);
  }

  findMember(identifier: string, lastName: string): Member | undefined {
    const cleanId = identifier.toLowerCase().trim();
    const cleanLast = lastName.toLowerCase().trim();
    return this.members.find(m => 
        (m.id.toLowerCase() === cleanId || m.phone === cleanId) && 
        m.lastName.toLowerCase() === cleanLast
    );
  }
}

export const db = new MockDatabase();