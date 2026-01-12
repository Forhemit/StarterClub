/**
 * Tests for resilience server actions
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  installResilienceModule,
  getResilienceModules,
  getModuleDetails,
  completeCard,
  getResilienceScore,
  saveLeadershipProfile,
  getLeadershipProfile,
  getAllLeadershipProfiles,
  saveFinancialResilienceProfile,
  getFinancialResilienceProfile,
  deleteFinancialResilienceProfile,
  deleteLeadershipProfile,
} from '@/actions/resilience'

import { createMockSupabaseClient, MockDataBuilder } from '@/__tests__/utils/test-db'

// Mock Supabase client
const mockSupabaseFactory = () => createMockSupabaseClient()
const mockSupabaseClient = mockSupabaseFactory().mockClient

vi.mock('@/lib/supabase/server', () => ({
  createSupabaseServerClient: vi.fn(() => mockSupabaseClient),
}))

// Mock Next.js revalidatePath
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('Resilience Server Actions', () => {
  beforeEach(() => {
    MockDataBuilder.resetIdCounter()

    // Reset all mocks
    vi.clearAllMocks()
  })

  // ==================== MODULE INSTALLATION TESTS ====================

  describe('installResilienceModule', () => {
    it('should install a module successfully', async () => {
      const userId = 'user_test_123'
      const businessId = MockDataBuilder.generateUUID()
      const moduleId = MockDataBuilder.generateUUID()

      // Mock auth user
      mockSupabaseClient.auth.getUser = vi.fn().mockResolvedValue({
        data: { user: { id: userId } },
      })

      // Mock business lookup
      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'user_businesses') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: { id: businessId },
                  error: null,
                }),
              })),
            })),
          }
        }
        if (table === 'modules') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: { id: moduleId },
                  error: null,
                }),
              })),
            })),
          }
        }
        if (table === 'user_installed_modules') {
          return {
            insert: vi.fn().mockResolvedValue({ error: null }),
          }
        }
        return mockSupabaseClient.from(table)
      })

      const result = await installResilienceModule('test-module')

      expect(result).toEqual({ success: true })
    })

    it('should return error if not authenticated', async () => {
      mockSupabaseClient.auth.getUser = vi.fn().mockResolvedValue({
        data: { user: null },
      })

      const result = await installResilienceModule('test-module')

      expect(result).toEqual({ error: 'Not authenticated' })
    })

    it('should return error if business not found', async () => {
      mockSupabaseClient.auth.getUser = vi.fn().mockResolvedValue({
        data: { user: { id: 'user_123' } },
      })

      mockSupabaseClient.from = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Not found' },
            }),
          })),
        })),
      }))

      const result = await installResilienceModule('test-module')

      expect(result).toEqual({ error: 'No business found' })
    })

    it('should return error if module not found', async () => {
      mockSupabaseClient.auth.getUser = vi.fn().mockResolvedValue({
        data: { user: { id: 'user_123' } },
      })

      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'user_businesses') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: { id: 'business_123' },
                }),
              })),
            })),
          }
        }
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { message: 'Not found' },
              }),
            })),
          })),
        }
      })

      const result = await installResilienceModule('nonexistent-module')

      expect(result).toEqual({ error: 'Module not found' })
    })

    it('should return error if module already installed', async () => {
      mockSupabaseClient.auth.getUser = vi.fn().mockResolvedValue({
        data: { user: { id: 'user_123' } },
      })

      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'user_businesses') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: { id: 'business_123' },
                }),
              })),
            })),
          }
        }
        if (table === 'modules') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: { id: 'module_123' },
                }),
              })),
            })),
          }
        }
        return {
          insert: vi.fn().mockResolvedValue({
            error: { code: '23505' },
          }),
        }
      })

      const result = await installResilienceModule('test-module')

      expect(result).toEqual({ error: 'Module already installed' })
    })
  })

  // ==================== GET MODULES TESTS ====================

  describe('getResilienceModules', () => {
    it('should return modules and installed status for authenticated user', async () => {
      const userId = 'user_123'
      const businessId = 'business_123'

      mockSupabaseClient.auth.getUser = vi.fn().mockResolvedValue({
        data: { user: { id: userId } },
      })

      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'user_businesses') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: { id: businessId },
                }),
              })),
            })),
          }
        }
        if (table === 'modules') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                eq: vi.fn(() => ({
                  order: vi.fn().mockResolvedValue({
                    data: [
                      { id: 'mod1', name: 'Module 1', created_at: '2025-01-01' },
                      { id: 'mod2', name: 'Module 2', created_at: '2025-01-02' },
                    ],
                  }),
                })),
              })),
            })),
          }
        }
        if (table === 'user_installed_modules') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn().mockResolvedValue({
                data: [{ module_id: 'mod1', status: 'active' }],
              }),
            })),
          }
        }
        return mockSupabaseClient.from(table)
      })

      const result = await getResilienceModules()

      expect(result).toHaveProperty('modules')
      expect(result).toHaveProperty('installed')
      expect(result.modules).toHaveLength(2)
      expect(result.installed).toContain('mod1')
    })

    it('should return empty arrays for unauthenticated user', async () => {
      mockSupabaseClient.auth.getUser = vi.fn().mockResolvedValue({
        data: { user: null },
      })

      const result = await getResilienceModules()

      expect(result).toEqual({ modules: [], installed: [] })
    })

    it('should return empty arrays if business not found', async () => {
      mockSupabaseClient.auth.getUser = vi.fn().mockResolvedValue({
        data: { user: { id: 'user_123' } },
      })

      mockSupabaseClient.from = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: null,
            }),
          })),
        })),
      }))

      const result = await getResilienceModules()

      expect(result).toEqual({ modules: [], installed: [] })
    })
  })

  // ==================== MODULE DETAILS TESTS ====================

  describe('getModuleDetails', () => {
    it('should return module details with sections and completions', async () => {
      const userId = 'user_123'
      const businessId = 'business_123'
      const itemId1 = 'item_1'
      const itemId2 = 'item_2'

      mockSupabaseClient.auth.getUser = vi.fn().mockResolvedValue({
        data: { user: { id: userId } },
      })

      const mockModuleData = {
        id: 'mod_1',
        slug: 'test-module',
        name: 'Test Module',
        items: [
          {
            id: 'link_1',
            section_title: 'Section 1',
            weight: 10,
            display_order: 1,
            item: {
              id: itemId1,
              title: 'Card 1',
              description: 'Description 1',
            },
          },
          {
            id: 'link_2',
            section_title: 'Section 2',
            weight: 5,
            display_order: 2,
            item: {
              id: itemId2,
              title: 'Card 2',
              description: 'Description 2',
            },
          },
        ],
      }

      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'user_businesses') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: { id: businessId },
                }),
              })),
            })),
          }
        }
        if (table === 'modules') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: mockModuleData,
                }),
              })),
            })),
          }
        }
        if (table === 'user_checklist_status') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                in: vi.fn().mockResolvedValue({
                  data: [
                    {
                      item_id: itemId1,
                      status: { name: 'complete' },
                    },
                    {
                      item_id: itemId2,
                      status: { name: 'pending' },
                    },
                  ],
                }),
              })),
            })),
          }
        }
        return mockSupabaseClient.from(table)
      })

      const result = await getModuleDetails('test-module')

      expect(result).toHaveProperty('module')
      expect(result).toHaveProperty('completions')
      expect(result.module.sections).toHaveLength(2)
      expect(result.completions).toHaveLength(2)
      expect(result.completions[0].status).toBe('completed')
      expect(result.completions[1].status).toBe('pending')
    })

    it('should return error if not authenticated', async () => {
      mockSupabaseClient.auth.getUser = vi.fn().mockResolvedValue({
        data: { user: null },
      })

      const result = await getModuleDetails('test-module')

      expect(result).toEqual({ error: 'Not authenticated' })
    })

    it('should return error if module not found', async () => {
      mockSupabaseClient.auth.getUser = vi.fn().mockResolvedValue({
        data: { user: { id: 'user_123' } },
      })

      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'user_businesses') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: { id: 'business_123' },
                }),
              })),
            })),
          }
        }
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: null,
              }),
            })),
          })),
        }
      })

      const result = await getModuleDetails('nonexistent-module')

      expect(result).toEqual({ error: 'Module not found' })
    })
  })

  // ==================== COMPLETE CARD TESTS ====================

  describe('completeCard', () => {
    it('should mark a card as completed successfully', async () => {
      const userId = 'user_123'
      const businessId = 'business_123'
      const cardId = 'card_1'

      mockSupabaseClient.auth.getUser = vi.fn().mockResolvedValue({
        data: { user: { id: userId } },
      })

      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'user_businesses') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: { id: businessId },
                }),
              })),
            })),
          }
        }
        if (table === 'statuses') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: { id: 'status_1' },
                }),
              })),
            })),
          }
        }
        if (table === 'user_checklist_status') {
          return {
            upsert: vi.fn().mockResolvedValue({ error: null }),
          }
        }
        return mockSupabaseClient.from(table)
      })

      const result = await completeCard(cardId, 'completed')

      expect(result).toEqual({ success: true })
    })

    it('should return error if not authenticated', async () => {
      mockSupabaseClient.auth.getUser = vi.fn().mockResolvedValue({
        data: { user: null },
      })

      const result = await completeCard('card_1', 'completed')

      expect(result).toEqual({ error: 'Not authenticated' })
    })

    it('should return error for invalid status', async () => {
      mockSupabaseClient.auth.getUser = vi.fn().mockResolvedValue({
        data: { user: { id: 'user_123' } },
      })

      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'user_businesses') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: { id: 'business_123' },
                }),
              })),
            })),
          }
        }
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn().mockResolvedValue({
                data: null,
              }),
            })),
          })),
        }
      })

      const result = await completeCard('card_1', 'completed')

      expect(result).toEqual({ error: 'Invalid status' })
    })
  })

  // ==================== RESILIENCE SCORE TESTS (CRITICAL) ====================

  describe('getResilienceScore', () => {
    it('should calculate score correctly from completed items', async () => {
      const userId = 'user_123'
      const businessId = 'business_123'
      const moduleId1 = 'mod_1'
      const moduleId2 = 'mod_2'

      mockSupabaseClient.auth.getUser = vi.fn().mockResolvedValue({
        data: { user: { id: userId } },
      })

      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'user_businesses') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: { id: businessId },
                }),
              })),
            })),
          }
        }
        if (table === 'modules') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn().mockResolvedValue({
                data: [
                  { id: moduleId1 },
                  { id: moduleId2 },
                ],
              }),
            })),
          }
        }
        if (table === 'module_items') {
          return {
            select: vi.fn(() => ({
              in: vi.fn().mockResolvedValue({
                data: [
                  { item_id: 'item_1', weight: 10 },
                  { item_id: 'item_2', weight: 5 },
                  { item_id: 'item_3', weight: 5 },
                ],
              }),
            })),
          }
        }
        if (table === 'user_checklist_status') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                in: vi.fn().mockResolvedValue({
                  data: [
                    { item_id: 'item_1', status: { name: 'complete' } },
                    { item_id: 'item_2', status: { name: 'complete' } },
                    { item_id: 'item_3', status: { name: 'pending' } },
                  ],
                }),
              })),
            })),
          }
        }
        return mockSupabaseClient.from(table)
      })

      const score = await getResilienceScore()

      // Total weight: 10 + 5 + 5 = 20
      // Earned: 10 + 5 = 15
      // Score: (15 / 20) * 100 = 75
      expect(score).toBe(75)
    })

    it('should return 0 for unauthenticated user', async () => {
      mockSupabaseClient.auth.getUser = vi.fn().mockResolvedValue({
        data: { user: null },
      })

      const score = await getResilienceScore()

      expect(score).toBe(0)
    })

    it('should return 0 if business not found', async () => {
      mockSupabaseClient.auth.getUser = vi.fn().mockResolvedValue({
        data: { user: { id: 'user_123' } },
      })

      mockSupabaseClient.from = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: null,
            }),
          })),
        })),
      }))

      const score = await getResilienceScore()

      expect(score).toBe(0)
    })

    it('should return 0 if no modules found', async () => {
      mockSupabaseClient.auth.getUser = vi.fn().mockResolvedValue({
        data: { user: { id: 'user_123' } },
      })

      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'user_businesses') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: { id: 'business_123' },
                }),
              })),
            })),
          }
        }
        return {
          select: vi.fn(() => ({
            eq: vi.fn().mockResolvedValue({
              data: [],
            }),
          })),
        }
      })

      const score = await getResilienceScore()

      expect(score).toBe(0)
    })

    it('should return 100% if all items completed', async () => {
      const userId = 'user_123'
      const businessId = 'business_123'

      mockSupabaseClient.auth.getUser = vi.fn().mockResolvedValue({
        data: { user: { id: userId } },
      })

      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'user_businesses') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: { id: businessId },
                }),
              })),
            })),
          }
        }
        if (table === 'modules') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn().mockResolvedValue({
                data: [{ id: 'mod_1' }],
              }),
            })),
          }
        }
        if (table === 'module_items') {
          return {
            select: vi.fn(() => ({
              in: vi.fn().mockResolvedValue({
                data: [
                  { item_id: 'item_1', weight: 10 },
                  { item_id: 'item_2', weight: 10 },
                ],
              }),
            })),
          }
        }
        if (table === 'user_checklist_status') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                in: vi.fn().mockResolvedValue({
                  data: [
                    { item_id: 'item_1', status: { name: 'complete' } },
                    { item_id: 'item_2', status: { name: 'complete' } },
                  ],
                }),
              })),
            })),
          }
        }
        return mockSupabaseClient.from(table)
      })

      const score = await getResilienceScore()

      expect(score).toBe(100)
    })
  })

  // ==================== LEADERSHIP PROFILE TESTS ====================

  describe('saveLeadershipProfile', () => {
    it('should save leadership profile successfully', async () => {
      const userId = 'user_123'
      const businessId = 'business_123'

      mockSupabaseClient.auth.getUser = vi.fn().mockResolvedValue({
        data: { user: { id: userId } },
      })

      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'user_businesses') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: { id: businessId },
                }),
              })),
            })),
          }
        }
        if (table === 'leadership_role_profiles') {
          return {
            upsert: vi.fn().mockResolvedValue({ error: null }),
          }
        }
        return mockSupabaseClient.from(table)
      })

      const profileData = {
        role: 'CEO',
        incumbent: 'John Doe',
        deputy: 'Jane Smith',
        opexLimit: 50000,
        knowledgeItems: [
          { id: '1', domain: 'Strategic Planning', busFactor: 'Critical' },
        ],
      }

      const result = await saveLeadershipProfile(profileData)

      expect(result).toEqual({ success: true })
    })

    it('should handle string to number conversion for limits', async () => {
      const userId = 'user_123'
      const businessId = 'business_123'

      mockSupabaseClient.auth.getUser = vi.fn().mockResolvedValue({
        data: { user: { id: userId } },
      })

      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'user_businesses') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: { id: businessId },
                }),
              })),
            })),
          }
        }
        return {
          upsert: vi.fn().mockResolvedValue({ error: null }),
        }
      })

      const profileData = {
        role: 'CFO',
        incumbent: 'Alice',
        deputy: 'Bob',
        opexLimit: '$50,000', // String with currency symbol
        capexLimit: '100,000', // String with commas
      }

      const result = await saveLeadershipProfile(profileData)

      expect(result).toEqual({ success: true })
    })
  })

  describe('getLeadershipProfile', () => {
    it('should return leadership profile for authenticated user', async () => {
      const userId = 'user_123'
      const businessId = 'business_123'

      mockSupabaseClient.auth.getUser = vi.fn().mockResolvedValue({
        data: { user: { id: userId } },
      })

      const mockProfile = {
        role: 'CEO',
        incumbent: 'John Doe',
        deputy: 'Jane Smith',
        backup_deputy: 'Bob Johnson',
        knowledge_items: [],
        opex_limit: 50000,
      }

      mockSupabaseClient.from = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: { id: businessId },
            }),
          })),
        })),
      }))

      // Second call for leadership profile
      const fromSpy = vi.spyOn(mockSupabaseClient, 'from')
      fromSpy.mockImplementation((table: string) => {
        if (table === 'user_businesses') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: { id: businessId },
                }),
              })),
            })),
          }
        }
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              eq: vi.fn().mockReturnValue({
                order: vi.fn().mockReturnValue({
                  limit: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({
                      data: mockProfile,
                    }),
                  }),
                }),
              }),
            })),
          })),
        }
      })

      const result = await getLeadershipProfile('CEO')

      expect(result).not.toBeNull()
      expect(result?.role).toBe('CEO')
      expect(result?.incumbent).toBe('John Doe')
      expect(result?.backupDeputy).toBe('Bob Johnson')
    })

    it('should return null for unauthenticated user', async () => {
      mockSupabaseClient.auth.getUser = vi.fn().mockResolvedValue({
        data: { user: null },
      })

      const result = await getLeadershipProfile()

      expect(result).toBeNull()
    })
  })

  // ==================== FINANCIAL RESILIENCE PROFILE TESTS ====================

  describe('saveFinancialResilienceProfile', () => {
    it('should save financial resilience profile successfully', async () => {
      const userId = 'user_123'
      const orgId = 'org_123'
      const companyId = 'company_123'

      mockSupabaseClient.auth.getUser = vi.fn().mockResolvedValue({
        data: { user: { id: userId, email: 'test@example.com' } },
      })

      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'organizations') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                limit: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { id: orgId },
                  }),
                }),
              })),
            })),
          }
        }
        if (table === 'core_companies') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                limit: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { id: companyId },
                  }),
                }),
              })),
            })),
          }
        }
        if (table === 'user_businesses') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: { id: 'business_123' },
                }),
              })),
            })),
          }
        }
        if (table === 'financial_resilience_profiles') {
          return {
            upsert: vi.fn().mockResolvedValue({ error: null }),
          }
        }
        return mockSupabaseClient.from(table)
      })

      const profileData = {
        businessType: 'LLC',
        annualRevenue: 1000000,
        monthlyBurnRate: 50000,
        runwayMonths: 12,
        revenueStreams: [
          { id: '1', name: 'Services', amount: 50000, frequency: 'monthly', reliability: 'high' },
        ],
      }

      const result = await saveFinancialResilienceProfile(profileData)

      expect(result).toEqual({ success: true })
    })

    it('should return error if not authenticated', async () => {
      mockSupabaseClient.auth.getUser = vi.fn().mockResolvedValue({
        data: { user: null },
      })

      const result = await saveFinancialResilienceProfile({})

      expect(result).toEqual({ error: 'Not authenticated' })
    })
  })

  describe('deleteFinancialResilienceProfile', () => {
    it('should delete profile successfully', async () => {
      const userId = 'user_123'
      const orgId = 'org_123'
      const companyId = 'company_123'

      mockSupabaseClient.auth.getUser = vi.fn().mockResolvedValue({
        data: { user: { id: userId, email: 'test@example.com' } },
      })

      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'organizations') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                limit: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { id: orgId },
                  }),
                }),
              })),
            })),
          }
        }
        if (table === 'core_companies') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                limit: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { id: companyId },
                  }),
                }),
              })),
            })),
          }
        }
        return {
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        }
      })

      const result = await deleteFinancialResilienceProfile()

      expect(result).toEqual({ success: true })
    })
  })
})
