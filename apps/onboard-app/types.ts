export enum VisitType {
  NEW_GUEST = 'NEW_GUEST',
  MEMBER_VISIT = 'MEMBER_VISIT',
  QUICK_LOG = 'QUICK_LOG',
}

export enum MemberIntent {
  HANG_OUT = 'HANG_OUT',
  WORK = 'WORK',
}

export enum WorkGoal {
  START_BUSINESS = 'Start a Business',
  GROW_BUSINESS = 'Get Help with Business',
  COACHING = 'Start a Coaching Business',
  CREATOR = 'Start a Creator Business',
  OTHER = 'Other',
}

export enum ResourceType {
  NONE = 'None',
  WORKSTATION = 'Workstation',
  CREATOR_ROOM = 'Creator Room',
  MEETING_ROOM = 'Meeting Room',
  PODCAST_STUDIO = 'Podcast Studio',
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  tier: 'Starter' | 'Pro' | 'Enterprise';
  photoUrl?: string;
  joinDate: string;
  isInBuilding?: boolean; // New field for guest lookup
}

export interface GuestProfile {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  zipCode?: string; // Important for CRA
  goal: WorkGoal | string;
  onboardingNotes?: string;
  tourAccepted: boolean;
  craEligible?: boolean; // AI determined based on address
}

export interface VisitRecord {
  id: string;
  timestamp: string; // ISO string
  type: VisitType;
  memberId?: string; // If member
  guestProfile?: GuestProfile; // If guest
  intent?: MemberIntent;
  resourceUsed: ResourceType;
  resourceDurationHours: number;
  paymentCollected: number;
  workDescription?: string; // Free text from member or Category for Quick Log
  aiCategory?: string; // AI categorized work type
}

export interface KPIStats {
  totalVisits: number;
  newGuests: number;
  memberVisits: number;
  revenue: number;
  topResources: { name: string; count: number }[];
  goalDistribution: { name: string; count: number }[];
}