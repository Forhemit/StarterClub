/**
 * Tests for compliance tracking server actions
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { auth } from '@clerk/nextjs/server'
import {
  getComplianceProfile,
  saveComplianceProfile,
  resetComplianceProfile,
} from '@/actions/compliance'

import { createMockSupabaseClient } from '@/__tests__/utils/test-db'

// Mock dependencies
vi.mock('@/lib/supabase/server', () => ({
  createSupabaseServerClient: vi.fn(() => mockSupabaseClient),
}))

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(() => Promise.resolve({ userId: 'user_123' })),
}))

let mockSupabaseClient: ReturnType<typeof createMockSupabaseClient>['mockClient']

describe('Compliance Server Actions', () => {
  beforeEach(() => {
    const mock = createMockSupabaseClient()
    mockSupabaseClient = mock.mockClient
    vi.clearAllMocks()
  })

  // ==================== GET COMPLIANCE PROFILE ====================

  describe('getComplianceProfile', () => {
    it('should return compliance profile with events grouped by category', async () => {
      const profileId = 'profile_123'
      const userId = 'user_123'

      const mockEvents = [
        {
          id: 'evt_1',
          profile_id: profileId,
          title: 'Annual Tax Return',
          description: 'File annual tax return',
          due_date: '2025-04-15',
          status: 'pending',
          category: 'tax',
          jurisdiction: 'Federal',
          notes: 'Gather all documents',
          completed_at: null,
        },
        {
          id: 'evt_2',
          profile_id: profileId,
          title: 'Business Registration',
          description: 'Renew business registration',
          due_date: '2025-06-30',
          status: 'completed',
          category: 'registration',
          jurisdiction: 'State',
          notes: null,
          completed_at: '2025-01-15',
        },
        {
          id: 'evt_3',
          profile_id: profileId,
          title: 'Professional License',
          description: 'Renew professional license',
          due_date: '2025-12-31',
          status: 'in_progress',
          category: 'license',
          jurisdiction: 'State',
          notes: 'Submit continuing education credits',
          completed_at: null,
        },
      ]

      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'items_compliance_profiles') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: { id: profileId },
                  error: null,
                }),
              })),
            })),
          }
        }
        if (table === 'items_compliance_events') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn().mockResolvedValue({
                data: mockEvents,
                error: null,
              }),
            })),
          }
        }
        return mockSupabaseClient.from(table)
      })

      const result = await getComplianceProfile()

      expect(result).toHaveProperty('id', profileId)
      expect(result.tax_events).toHaveLength(1)
      expect(result.registrations).toHaveLength(1)
      expect(result.licenses).toHaveLength(1)
      expect(result.tax_events[0].title).toBe('Annual Tax Return')
      expect(result.registrations[0].status).toBe('completed')
    })

    it('should return empty data for unauthenticated user', async () => {
      vi.mocked(auth).mockResolvedValueOnce({ userId: null })

      const result = await getComplianceProfile()

      expect(result).toEqual({
        tax_events: [],
        registrations: [],
        licenses: [],
        other_documents: [],
        documents: [],
      })
    })

    it('should return empty data when profile not found', async () => {
      mockSupabaseClient.from = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { code: 'PGRST116' },
            }),
          })),
        })),
      }))

      const result = await getComplianceProfile()

      expect(result).toEqual({
        tax_events: [],
        registrations: [],
        licenses: [],
        other_documents: [],
        documents: [],
      })
    })

    it('should return empty data when no events exist', async () => {
      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'items_compliance_profiles') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: { id: 'profile_123' },
                  error: null,
                }),
              })),
            })),
          }
        }
        return {
          select: vi.fn(() => ({
            eq: vi.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          })),
        }
      })

      const result = await getComplianceProfile()

      expect(result.tax_events).toHaveLength(0)
      expect(result.registrations).toHaveLength(0)
      expect(result.licenses).toHaveLength(0)
      expect(result.other_documents).toHaveLength(0)
    })
  })

  // ==================== SAVE COMPLIANCE PROFILE ====================

  describe('saveComplianceProfile', () => {
    it('should create new profile if none exists', async () => {
      const newProfileId = 'new_profile_123'

      const profileData = {
        tax_events: [
          {
            id: 'temp-1',
            title: 'Quarterly Taxes',
            description: 'Q1 estimated taxes',
            due_date: new Date('2025-04-15'),
            status: 'pending',
            category: 'tax',
            jurisdiction: 'Federal',
            notes: '',
          },
        ],
        registrations: [],
        licenses: [],
        other_documents: [],
        documents: [],
      }

      let callCount = 0
      mockSupabaseClient.from = vi.fn((table: string) => {
        callCount++

        if (table === 'items_compliance_profiles') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn()
                  .mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } })
                  .mockResolvedValueOnce({
                    data: { id: newProfileId },
                    error: null,
                  }),
              })),
            })),
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: newProfileId },
                  error: null,
                }),
              }),
            }),
          }
        }
        return {
          insert: vi.fn().mockResolvedValue({ error: null }),
          update: vi.fn().mockResolvedValue({ error: null }),
        }
      })

      const result = await saveComplianceProfile(profileData)

      expect(result).toEqual({ success: true, profileId: newProfileId })
    })

    it('should update existing events', async () => {
      const profileId = 'profile_123'
      const existingEventId = 'evt_existing_1'

      const profileData = {
        id: profileId,
        tax_events: [
          {
            id: existingEventId,
            title: 'Updated Tax Event',
            description: 'Updated description',
            due_date: new Date('2025-05-15'),
            status: 'completed',
            category: 'tax',
            jurisdiction: 'Federal',
            notes: 'Updated notes',
          },
        ],
        registrations: [],
        licenses: [],
        other_documents: [],
        documents: [],
      }

      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'items_compliance_profiles') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: { id: profileId },
                  error: null,
                }),
              })),
            })),
          }
        }
        if (table === 'items_compliance_events') {
          return {
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null }),
            }),
          }
        }
        return mockSupabaseClient.from(table)
      })

      const result = await saveComplianceProfile(profileData)

      expect(result).toEqual({ success: true, profileId })
    })

    it('should insert new events with temp IDs', async () => {
      const profileId = 'profile_123'

      const profileData = {
        id: profileId,
        tax_events: [
          {
            id: 'temp-new-1',
            title: 'New Tax Event',
            description: 'New event description',
            due_date: new Date('2025-06-15'),
            status: 'pending',
            category: 'tax',
            jurisdiction: 'Federal',
            notes: '',
          },
        ],
        registrations: [],
        licenses: [],
        other_documents: [],
        documents: [],
      }

      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'items_compliance_profiles') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: { id: profileId },
                  error: null,
                }),
              })),
            })),
          }
        }
        if (table === 'items_compliance_events') {
          return {
            insert: vi.fn().mockResolvedValue({ error: null }),
          }
        }
        return mockSupabaseClient.from(table)
      })

      const result = await saveComplianceProfile(profileData)

      expect(result).toEqual({ success: true, profileId })
    })

    it('should handle string dates for database', async () => {
      const profileId = 'profile_123'

      const profileData = {
        id: profileId,
        tax_events: [
          {
            id: 'evt_1',
            title: 'Event with String Date',
            description: 'Test',
            due_date: '2025-04-15' as any, // String date
            status: 'pending',
            category: 'tax',
            jurisdiction: 'Federal',
            notes: '',
          },
        ],
        registrations: [],
        licenses: [],
        other_documents: [],
        documents: [],
      }

      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'items_compliance_profiles') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: { id: profileId },
                  error: null,
                }),
              })),
            })),
          }
        }
        if (table === 'items_compliance_events') {
          return {
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null }),
            }),
          }
        }
        return mockSupabaseClient.from(table)
      })

      const result = await saveComplianceProfile(profileData)

      expect(result).toEqual({ success: true, profileId })
    })

    it('should throw error for unauthorized user', async () => {
      vi.mocked(auth).mockResolvedValueOnce({ userId: null })

      const profileData = {
        tax_events: [],
        registrations: [],
        licenses: [],
        other_documents: [],
        documents: [],
      }

      await expect(saveComplianceProfile(profileData)).rejects.toThrow('Unauthorized')
    })
  })

  // ==================== RESET COMPLIANCE PROFILE ====================

  describe('resetComplianceProfile', () => {
    it('should delete profile successfully', async () => {
      const profileId = 'profile_123'
      const userId = 'user_123'

      mockSupabaseClient.from = vi.fn(() => ({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn((column: string, value: string) => {
            return {
              eq: vi.fn().mockResolvedValue({
                error: null,
              }),
            }
          }),
        }),
      }))

      const result = await resetComplianceProfile(profileId)

      expect(result).toEqual({ success: true })
    })

    it('should throw error for unauthorized user', async () => {
      vi.mocked(auth).mockResolvedValueOnce({ userId: null })

      await expect(resetComplianceProfile('profile_123')).rejects.toThrow('Unauthorized')
    })

    it('should throw error on database failure', async () => {
      mockSupabaseClient.from = vi.fn(() => ({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn((column: string, value: string) => {
            return {
              eq: vi.fn().mockResolvedValue({
                error: { message: 'Database error' },
              }),
            }
          }),
        }),
      }))

      await expect(resetComplianceProfile('profile_123')).rejects.toThrow('Failed to reset profile')
    })
  })

  // ==================== EDGE CASES ====================

  describe('Edge Cases', () => {
    it('should handle events with null notes', async () => {
      const profileId = 'profile_123'

      const mockEvents = [
        {
          id: 'evt_1',
          title: 'Event without notes',
          description: 'Test',
          due_date: '2025-04-15',
          status: 'pending',
          category: 'tax',
          jurisdiction: 'Federal',
          notes: null,
          completed_at: null,
        },
      ]

      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'items_compliance_profiles') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: { id: profileId },
                  error: null,
                }),
              })),
            })),
          }
        }
        if (table === 'items_compliance_events') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn().mockResolvedValue({
                data: mockEvents,
                error: null,
              }),
            })),
          }
        }
        return mockSupabaseClient.from(table)
      })

      const result = await getComplianceProfile()

      expect(result.tax_events).toHaveLength(1)
      expect(result.tax_events[0].notes).toBeNull()
    })

    it('should handle events with completed_at dates', async () => {
      const profileId = 'profile_123'

      const mockEvents = [
        {
          id: 'evt_1',
          title: 'Completed Event',
          description: 'Test',
          due_date: '2025-04-15',
          status: 'completed',
          category: 'tax',
          jurisdiction: 'Federal',
          notes: 'Done',
          completed_at: '2025-03-15',
        },
      ]

      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'items_compliance_profiles') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: { id: profileId },
                  error: null,
                }),
              })),
            })),
          }
        }
        if (table === 'items_compliance_events') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn().mockResolvedValue({
                data: mockEvents,
                error: null,
              }),
            })),
          }
        }
        return mockSupabaseClient.from(table)
      })

      const result = await getComplianceProfile()

      expect(result.tax_events[0].completed_at).toBeInstanceOf(Date)
      expect(result.tax_events[0].completed_at?.toISOString()).toBe('2025-03-15T00:00:00.000Z')
    })
  })
})
