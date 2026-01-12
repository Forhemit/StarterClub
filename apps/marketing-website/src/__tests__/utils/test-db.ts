import { SupabaseClient } from '@supabase/supabase-js'
import { vi } from 'vitest'

/**
 * Mock data builder for creating test database records
 */
export class MockDataBuilder {
  private static idCounter = 1

  static resetIdCounter(): void {
    this.idCounter = 1
  }

  static generateId(prefix: string = 'test'): string {
    return `${prefix}-${this.idCounter++}-${Date.now()}`
  }

  static generateUUID(): string {
    return '00000000-0000-0000-0000-000000000001'
  }

  /**
   * Create a mock organization record
   */
  static createOrganization(overrides: Partial<Organization> = {}): Organization {
    return {
      id: this.generateUUID(),
      name: 'Test Organization',
      slug: 'test-org',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
      ...overrides,
    }
  }

  /**
   * Create a mock company record
   */
  static createCompany(overrides: Partial<Company> = {}): Company {
    return {
      id: this.generateUUID(),
      organization_id: this.generateUUID(),
      legal_name: 'Test Company LLC',
      trade_name: 'Test Co',
      ein: '12-3456789',
      founded_date: '2020-01-01',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
      ...overrides,
    }
  }

  /**
   * Create a mock user profile
   */
  static createUserProfile(overrides: Partial<UserProfile> = {}): UserProfile {
    return {
      id: this.generateUUID(),
      clerk_user_id: 'user_test_123',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      organization_id: this.generateUUID(),
      role: 'member',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
      ...overrides,
    }
  }

  /**
   * Create a mock financial resilience profile
   */
  static createFinancialResilienceProfile(overrides: Partial<FinancialResilienceProfile> = {}): FinancialResilienceProfile {
    return {
      id: this.generateUUID(),
      user_business_id: this.generateUUID(),
      monthly_revenue: 50000,
      monthly_expenses: 35000,
      cash_reserves: 150000,
      revenue_streams: [
        { id: '1', source: 'Product Sales', amount: 30000 },
        { id: '2', source: 'Services', amount: 20000 },
      ],
      expense_categories: [
        { id: '1', category: 'Payroll', amount: 20000 },
        { id: '2', category: 'Rent', amount: 8000 },
        { id: '3', category: 'Operations', amount: 7000 },
      ],
      stress_scenarios: [
        { id: '1', scenario: 'Revenue Drop 30%', impact: -15000, mitigation: 'Reduce expenses' },
      ],
      funding_sources: [
        { id: '1', source: 'Cash Reserves', amount: 150000 },
        { id: '2', source: 'Line of Credit', amount: 100000 },
      ],
      approval_thresholds: {
        single_signature: 5000,
        dual_signature: 25000,
        board_approval: 100000,
      },
      liquidity_buffers: {
        operating_months: 6,
        target_months: 9,
        current_buffer: 150000,
        target_buffer: 225000,
      },
      insurance_coverage: [
        { id: '1', type: 'General Liability', coverage: 1000000, premium: 1200 },
        { id: '2', type: 'Professional Liability', coverage: 2000000, premium: 2400 },
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...overrides,
    }
  }

  /**
   * Create a mock leadership role profile
   */
  static createLeadershipRoleProfile(overrides: Partial<LeadershipRoleProfile> = {}): LeadershipRoleProfile {
    return {
      id: this.generateUUID(),
      user_business_id: this.generateUUID(),
      role: 'CEO',
      incumbent: 'John Doe',
      deputy: 'Jane Smith',
      knowledge_items: [
        { id: '1', domain: 'Strategic Planning', bus_factor: 'Critical', owner: 'John Doe' },
        { id: '2', domain: 'Financial Management', bus_factor: 'High', owner: 'John Doe' },
        { id: '3', domain: 'Key Relationships', bus_factor: 'Medium', owner: 'John Doe' },
      ],
      signing_rules: [
        { id: '1', context: 'Bank Accounts', threshold: 25000, requires: 'dual_signature' },
        { id: '2', context: 'Contracts', threshold: 100000, requires: 'board_approval' },
      ],
      opex_limit: 50000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...overrides,
    }
  }

  /**
   * Create a mock compliance tracking record
   */
  static createComplianceTracking(overrides: Partial<ComplianceTracking> = {}): ComplianceTracking {
    return {
      id: this.generateUUID(),
      user_business_id: this.generateUUID(),
      event_name: 'Annual Report Filing',
      event_type: 'tax',
      due_date: '2025-04-15',
      status: 'pending',
      description: 'File annual tax return with IRS',
      jurisdiction: 'Federal',
      cost_estimate: 500,
      completed_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...overrides,
    }
  }
}

/**
 * Create a mock Supabase client for testing
 */
export function createMockSupabaseClient() {
  const mockData = {
    organizations: [] as Organization[],
    companies: [] as Company[],
    profiles: [] as UserProfile[],
    financial_resilience_profiles: [] as FinancialResilienceProfile[],
    leadership_role_profiles: [] as LeadershipRoleProfile[],
    compliance_tracking: [] as ComplianceTracking[],
  }

  const mockClient = {
    from: vi.fn((table: string) => {
      return {
        select: vi.fn((columns?: string) => {
          return {
            eq: vi.fn((column: string, value: any) => {
              return {
                single: vi.fn(),
                maybeSingle: vi.fn(),
                limit: vi.fn((limit: number) => ({
                  data: mockData[table as keyof typeof mockData] || [],
                  error: null,
                })),
                data: mockData[table as keyof typeof mockData] || [],
                error: null,
              }
            }),
            in: vi.fn((column: string, values: any[]) => ({
              data: mockData[table as keyof typeof mockData] || [],
              error: null,
            })),
            order: vi.fn((column: string, options: any) => ({
              data: mockData[table as keyof typeof mockData] || [],
              error: null,
            })),
            data: mockData[table as keyof typeof mockData] || [],
            error: null,
          }
        }),
        insert: vi.fn((data: any) => ({
          select: vi.fn(() => ({
            single: vi.fn(),
            data: Array.isArray(data) ? data : [data],
            error: null,
          })),
          data: Array.isArray(data) ? data : [data],
          error: null,
        })),
        update: vi.fn((data: any) => ({
          eq: vi.fn((column: string, value: any) => ({
            data: [data],
            error: null,
          })),
        })),
        delete: vi.fn(() => ({
          eq: vi.fn((column: string, value: any) => ({
            not: vi.fn((column: string, value: any) => ({
              data: [],
              error: null,
            })),
            data: [],
            error: null,
          })),
        })),
      }
    }),
    rpc: vi.fn((fnName: string, params: any) => ({
      data: null,
      error: null,
    })),
    auth: {
      getUser: vi.fn(),
    },
  } as unknown as SupabaseClient

  return { mockClient, mockData }
}

/**
 * Set up mock Supabase responses for common queries
 */
export function setupMockSupabaseResponses() {
  vi.mock('@/lib/supabase/server', () => ({
    createSupabaseServerClient: vi.fn(() => createMockSupabaseClient().mockClient),
    createSupabaseAdminClient: vi.fn(() => createMockSupabaseClient().mockClient),
  }))

  vi.mock('@/lib/supabase/admin', () => ({
    createAdminClient: vi.fn(() => createMockSupabaseClient().mockClient),
  }))
}

// Type definitions for mock data
export interface Organization {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface Company {
  id: string
  organization_id: string
  legal_name: string
  trade_name: string
  ein: string
  founded_date: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface UserProfile {
  id: string
  clerk_user_id: string
  email: string
  first_name: string
  last_name: string
  organization_id: string
  role: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface FinancialResilienceProfile {
  id: string
  user_business_id: string
  monthly_revenue: number
  monthly_expenses: number
  cash_reserves: number
  revenue_streams: Array<{ id: string; source: string; amount: number }>
  expense_categories: Array<{ id: string; category: string; amount: number }>
  stress_scenarios: Array<{ id: string; scenario: string; impact: number; mitigation: string }>
  funding_sources: Array<{ id: string; source: string; amount: number }>
  approval_thresholds: {
    single_signature: number
    dual_signature: number
    board_approval: number
  }
  liquidity_buffers: {
    operating_months: number
    target_months: number
    current_buffer: number
    target_buffer: number
  }
  insurance_coverage: Array<{ id: string; type: string; coverage: number; premium: number }>
  created_at: string
  updated_at: string
}

export interface LeadershipRoleProfile {
  id: string
  user_business_id: string
  role: string
  incumbent: string
  deputy: string
  knowledge_items: Array<{ id: string; domain: string; bus_factor: string; owner: string }>
  signing_rules: Array<{ id: string; context: string; threshold: number; requires: string }>
  opex_limit: number
  created_at: string
  updated_at: string
}

export interface ComplianceTracking {
  id: string
  user_business_id: string
  event_name: string
  event_type: string
  due_date: string
  status: string
  description: string
  jurisdiction: string
  cost_estimate: number
  completed_at: string | null
  created_at: string
  updated_at: string
}
