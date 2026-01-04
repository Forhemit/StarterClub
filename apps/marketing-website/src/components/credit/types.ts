// =============================================
// CREDIT COMMAND - SHARED TYPES
// =============================================

// ==================== PERSONAL CREDIT ====================

export interface PersonalCreditData {
    id?: string;
    userId?: string;

    // Personal Identity
    firstName?: string;
    lastName?: string;
    ssnLastFour?: string;
    dateOfBirth?: string;
    currentAddress?: string;
    isIdentityVerified?: boolean;

    // Gardening Mode
    gardeningModeEnabled?: boolean;
    gardeningModeStartDate?: string;

    // FICO Scores (manual entry)
    fico8Experian?: number;
    fico8Transunion?: number;
    fico8Equifax?: number;
    vantage3Score?: number;
    scoresUpdatedAt?: string;

    // Computed/Display
    averageFicoScore?: number;

    // Tradelines (loaded separately)
    tradelines?: Tradeline[];

    // Inquiries (loaded separately)
    inquiries?: Inquiry[];

    // Metadata
    createdAt?: string;
    updatedAt?: string;
    completedAt?: string;
}

export interface PersonalCreditStepProps {
    data: PersonalCreditData;
    onSave: (data: Partial<PersonalCreditData>) => void;
}

// ==================== BUSINESS CREDIT ====================

export interface BusinessCreditData {
    id?: string;
    userId?: string;

    // Business Identity
    legalBusinessName?: string;
    dbaName?: string;
    einLastFour?: string;
    entityType?: EntityType;
    formationState?: string;
    formationDate?: string;

    // Bureau IDs
    dunsNumber?: string;
    experianBin?: string;

    // COMPLIANCE FLAGS (Critical)
    isSosActive?: boolean;
    isEinVerified?: boolean;
    is411Listed?: boolean;
    isAddressCommercial?: boolean;
    naicsCode?: string;
    naicsRiskLevel?: RiskLevel;
    complianceScore?: number;

    // Business Scores (manual entry)
    paydexScore?: number; // Target 80+
    intelliscorePlus?: number;
    ficoSbss?: number;
    scoresUpdatedAt?: string;

    // Tier Progress
    currentTier?: TierLevel;
    tier1Complete?: boolean;
    tier2Complete?: boolean;
    tier3Complete?: boolean;
    tier4Complete?: boolean;

    // Tradelines (loaded separately)
    tradelines?: Tradeline[];

    // Metadata
    createdAt?: string;
    updatedAt?: string;
    completedAt?: string;
}

export interface BusinessCreditStepProps {
    data: BusinessCreditData;
    onSave: (data: Partial<BusinessCreditData>) => void;
}

// ==================== SHARED TYPES ====================

export interface Tradeline {
    id?: string;
    userId?: string;
    personalProfileId?: string;
    businessProfileId?: string;

    // Core Account Data
    creditorName: string;
    accountType: AccountType;
    accountStatus: AccountStatus;

    // Financials
    creditLimit?: number;
    currentBalance?: number;
    minimumPayment?: number;

    // Dates
    dateOpened?: string;
    lastPaymentDate?: string;
    statementCloseDate?: number; // Day of month (1-31)

    // Categorization
    isBusinessCredit: boolean;
    tierLevel?: TierLevel; // For business: 1-4

    // Cross-Module Bridge
    hasPersonalGuarantee?: boolean;
    reportsToPersonal?: boolean;

    // Reporting Bureaus
    reportsToExperian?: boolean;
    reportsToTransunion?: boolean;
    reportsToEquifax?: boolean;
    reportsToDnb?: boolean;

    // Computed
    utilizationPercent?: number;

    // Metadata
    createdAt?: string;
    updatedAt?: string;
}

export interface Inquiry {
    id?: string;
    userId?: string;
    personalProfileId?: string;
    businessProfileId?: string;

    creditorName: string;
    inquiryDate: string;
    isHardPull: boolean;
    bureau?: Bureau;

    // Impact tracking
    impactEndsDate?: string;
    visibilityEndsDate?: string;

    // Computed
    daysUntilImpactEnds?: number;

    createdAt?: string;
}

export interface CreditScoreEntry {
    id?: string;
    userId?: string;
    personalProfileId?: string;
    businessProfileId?: string;

    bureau: Bureau;
    scoringModel: ScoringModel;
    scoreValue: number;
    scoreDate: string;

    createdAt?: string;
}

// ==================== ENUMS ====================

export type EntityType = 'llc' | 'corp' | 'scorp' | 'partnership' | 'sole_prop';

export type RiskLevel = 'low' | 'medium' | 'high';

export type TierLevel = 0 | 1 | 2 | 3 | 4;

export type AccountType =
    | 'revolving'
    | 'installment'
    | 'net-30'
    | 'net-60'
    | 'net-90'
    | 'mortgage'
    | 'auto'
    | 'student'
    | 'heloc'
    | 'fleet';

export type AccountStatus = 'open' | 'closed' | 'collection' | 'chargeoff' | 'paid';

export type Bureau = 'experian' | 'transunion' | 'equifax' | 'dnb';

export type ScoringModel =
    | 'FICO 8'
    | 'FICO 2'
    | 'FICO 4'
    | 'FICO 5'
    | 'Vantage 3.0'
    | 'PAYDEX'
    | 'Intelliscore Plus'
    | 'FICO SBSS';

// ==================== UTILIZATION BANDS ====================

export const UTILIZATION_BANDS = [
    { max: 1, label: '0%', impact: 'Excellent', points: 0 },
    { max: 10, label: '1-9%', impact: 'Excellent', points: 0 },
    { max: 30, label: '10-29%', impact: 'Good', points: -5 },
    { max: 50, label: '30-49%', impact: 'Fair', points: -20 },
    { max: 75, label: '50-74%', impact: 'Poor', points: -40 },
    { max: 100, label: '75-100%', impact: 'Very Poor', points: -60 },
] as const;

export function getUtilizationBand(percent: number) {
    return UTILIZATION_BANDS.find(band => percent <= band.max) || UTILIZATION_BANDS[UTILIZATION_BANDS.length - 1];
}

export function calculateUtilization(balance: number, limit: number): number {
    if (limit <= 0) return 0;
    return Math.round((balance / limit) * 100);
}

// ==================== TIER DEFINITIONS ====================

export const BUSINESS_TIERS = {
    1: {
        name: 'Tier 1 - Net-30 Vendors',
        description: 'Starter vendor accounts that report to D&B without personal credit check',
        examples: ['Uline', 'Grainger', 'Quill', 'Strategic Network Solutions'],
        requirement: '3+ accounts reporting',
    },
    2: {
        name: 'Tier 2 - Store Credit',
        description: 'Retail store cards based on Tier 1 payment history',
        examples: ['Amazon Business', 'Staples', 'Home Depot', 'Lowes'],
        requirement: 'Tier 1 complete + 60 days history',
    },
    3: {
        name: 'Tier 3 - Cash/Fleet Cards',
        description: 'Major bank cards and fleet cards',
        examples: ['Chase Ink', 'Amex Business', 'WEX Fleet', 'Fuelman'],
        requirement: 'Tier 2 complete + PAYDEX 70+',
    },
    4: {
        name: 'Tier 4 - Non-PG Funding',
        description: 'Corporate credit lines without Personal Guarantee',
        examples: ['Bank Lines of Credit', 'SBA Loans', 'Equipment Financing'],
        requirement: 'Tier 3 complete + PAYDEX 80+ + 2 years history',
    },
} as const;

// ==================== COMPLIANCE CHECKLIST ====================

export const COMPLIANCE_ITEMS = [
    {
        id: 'sos_active',
        label: 'Secretary of State - Active',
        description: 'Business is in good standing with the state',
        field: 'isSosActive',
    },
    {
        id: 'ein_verified',
        label: 'EIN Verified',
        description: 'IRS EIN matches business name',
        field: 'isEinVerified',
    },
    {
        id: '411_listed',
        label: '411 Directory Listing',
        description: 'Business phone is listed in 411 directory',
        field: 'is411Listed',
    },
    {
        id: 'address_commercial',
        label: 'Commercial Address',
        description: 'Business address is not a PO Box or residential',
        field: 'isAddressCommercial',
    },
] as const;
