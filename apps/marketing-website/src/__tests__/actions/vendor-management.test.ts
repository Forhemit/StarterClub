/**
 * Tests for vendor management server actions
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { auth } from '@clerk/nextjs/server'
import {
  getVendorProfile,
  saveVendorProfile,
  resetVendorProfile,
} from '@/actions/vendor-management'

import { createMockSupabaseClient } from '@/__tests__/utils/test-db'

// Mock dependencies
vi.mock('@/lib/supabase/server', () => ({
  createSupabaseServerClient: vi.fn(() => mockSupabaseClient),
}))

vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(() => Promise.resolve({ userId: 'user_123' })),
}))

let mockSupabaseClient: ReturnType<typeof createMockSupabaseClient>['mockClient']

describe('Vendor Management Server Actions', () => {
  beforeEach(() => {
    const mock = createMockSupabaseClient()
    mockSupabaseClient = mock.mockClient
    vi.clearAllMocks()
  })

  // ==================== GET VENDOR PROFILE ====================

  describe('getVendorProfile', () => {
    it('should return vendor profile with all related data', async () => {
      const profileId = 'profile_123'
      const userId = 'user_123'

      const mockProfile = {
        id: profileId,
        user_id: userId,
        created_at: '2025-01-01',
        updated_at: '2025-01-08',
      }

      const mockVendors = [
        {
          id: 'vendor_1',
          profile_id: profileId,
          name: 'Acme Corp',
          category: 'Software',
          contact_name: 'John Doe',
          contact_email: 'john@acme.com',
          contact_phone: '555-0100',
          website: 'https://acme.com',
          notes: 'Primary vendor',
        },
        {
          id: 'vendor_2',
          profile_id: profileId,
          name: 'Globex Inc',
          category: 'Hardware',
          contact_name: 'Jane Smith',
          contact_email: 'jane@globex.com',
          contact_phone: '555-0200',
          website: 'https://globex.com',
          notes: null,
        },
      ]

      const mockContracts = [
        {
          id: 'contract_1',
          profile_id: profileId,
          vendor_id: 'vendor_1',
          contract_name: 'Software License',
          start_date: '2025-01-01',
          end_date: '2025-12-31',
          value: '50000',
          renewal_alert_days: 30,
          auto_renew: true,
          notes: 'Annual contract',
        },
      ]

      const mockSpend = [
        {
          id: 'spend_1',
          profile_id: profileId,
          vendor_id: 'vendor_1',
          amount: '5000',
          period: 'monthly',
          period_date: '2025-01',
          category: 'Software',
          notes: 'Monthly subscription',
        },
      ]

      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'vendor_profiles') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                limit: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: mockProfile,
                    error: null,
                  }),
                }),
              })),
            })),
          }
        }
        if (table === 'vendors') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn().mockResolvedValue({
                data: mockVendors,
                error: null,
              }),
            })),
          }
        }
        if (table === 'vendor_contracts') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn().mockResolvedValue({
                data: mockContracts,
                error: null,
              }),
            })),
          }
        }
        if (table === 'vendor_spend') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn().mockResolvedValue({
                data: mockSpend,
                error: null,
              }),
            })),
          }
        }
        // Default empty response
        return {
          select: vi.fn().mockResolvedValue({ data: [], error: null }),
          insert: vi.fn().mockResolvedValue({ error: null }),
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              not: vi.fn().mockResolvedValue({ error: null }),
              data: [],
              error: null,
            }),
          }),
        }
      })

      const result = await getVendorProfile()

      expect(result).not.toBeNull()
      expect(result?.id).toBe(profileId)
      expect(result?.vendors).toHaveLength(2)
      expect(result?.contracts).toHaveLength(1)
      expect(result?.spend_records).toHaveLength(1)
      expect(result?.contracts[0].vendor_name).toBe('Acme Corp')
      expect(result?.spend_records[0].vendor_name).toBe('Acme Corp')
    })

    it('should return null for unauthenticated user', async () => {
      vi.mocked(auth).mockResolvedValueOnce({ userId: null })

      const result = await getVendorProfile()

      expect(result).toBeNull()
    })

    it('should return null when profile not found', async () => {
      mockSupabaseClient.from = vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            limit: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { code: 'PGRST116' },
              }),
            }),
          })),
        })),
      }))

      const result = await getVendorProfile()

      expect(result).toBeNull()
    })

    it('should handle empty vendors list', async () => {
      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'vendor_profiles') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                limit: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { id: 'profile_123' },
                    error: null,
                  }),
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

      const result = await getVendorProfile()

      expect(result?.vendors).toHaveLength(0)
      expect(result?.contracts).toHaveLength(0)
      expect(result?.spend_records).toHaveLength(0)
    })
  })

  // ==================== SAVE VENDOR PROFILE ====================

  describe('saveVendorProfile', () => {
    it('should create new profile if none exists', async () => {
      const newProfileId = 'new_profile_123'

      const profileData = {
        vendors: [
          {
            id: 'temp-vendor-1',
            name: 'New Vendor',
            category: 'Software',
            contact_name: 'Test Contact',
            contact_email: 'test@example.com',
            contact_phone: '',
            website: '',
            notes: '',
          },
        ],
        contracts: [],
        spend_records: [],
      }

      let callCount = 0
      mockSupabaseClient.from = vi.fn((table: string) => {
        callCount++

        if (table === 'vendor_profiles') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                limit: vi.fn().mockReturnValue({
                  single: vi.fn()
                    .mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } })
                    .mockResolvedValueOnce({
                      data: { id: newProfileId },
                      error: null,
                    }),
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
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null }),
            }),
            delete: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                not: vi.fn().mockResolvedValue({ error: null }),
                data: [],
                error: null,
              }),
            }),
          }
        }
        if (table === 'vendors') {
          return {
            delete: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                not: vi.fn().mockResolvedValue({ error: null }),
                data: [],
                error: null,
              }),
            }),
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: 'vendor_123' },
                  error: null,
                }),
              }),
            }),
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null }),
            }),
          }
        }
        // Default empty response
        return {
          select: vi.fn().mockResolvedValue({ data: [], error: null }),
          insert: vi.fn().mockResolvedValue({ error: null }),
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              not: vi.fn().mockResolvedValue({ error: null }),
              data: [],
              error: null,
            }),
          }),
        }
      })

      await expect(saveVendorProfile(profileData as any)).resolves.not.toThrow()
    })

    it('should update existing vendors', async () => {
      const profileId = 'profile_123'

      const profileData = {
        id: profileId,
        vendors: [
          {
            id: 'vendor_existing_1',
            name: 'Updated Vendor Name',
            category: 'Hardware',
            contact_name: 'Updated Contact',
            contact_email: 'updated@example.com',
            contact_phone: '555-9999',
            website: 'https://updated.com',
            notes: 'Updated notes',
          },
        ],
        contracts: [],
        spend_records: [],
      }

      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'vendor_profiles') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                limit: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { id: profileId },
                    error: null,
                  }),
                }),
              })),
            })),
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null }),
            }),
            delete: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                not: vi.fn().mockResolvedValue({ error: null }),
                data: [],
                error: null,
              }),
            }),
          }
        }
        if (table === 'vendors') {
          return {
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null }),
            }),
            delete: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                not: vi.fn().mockResolvedValue({ error: null }),
                data: [],
                error: null,
              }),
            }),
          }
        }
        // Default empty response
        return {
          select: vi.fn().mockResolvedValue({ data: [], error: null }),
          insert: vi.fn().mockResolvedValue({ error: null }),
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              not: vi.fn().mockResolvedValue({ error: null }),
              data: [],
              error: null,
            }),
          }),
        }
      })

      await expect(saveVendorProfile(profileData as any)).resolves.not.toThrow()
    })

    it('should handle contracts with vendor names', async () => {
      const profileId = 'profile_123'
      const vendorId = 'vendor_1'

      const profileData = {
        id: profileId,
        vendors: [
          {
            id: vendorId,
            name: 'Test Vendor',
            category: 'Software',
            contact_name: 'Contact',
            contact_email: 'contact@test.com',
            contact_phone: '',
            website: '',
            notes: '',
          },
        ],
        contracts: [
          {
            id: 'contract_1',
            vendor_id: vendorId,
            vendor_name: 'Test Vendor',
            contract_name: 'Service Agreement',
            start_date: '2025-01-01',
            end_date: '2025-12-31',
            value: 10000,
            renewal_alert_days: 30,
            auto_renew: false,
            notes: '',
          },
        ],
        spend_records: [],
      }

      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'vendor_profiles') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                limit: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { id: profileId },
                    error: null,
                  }),
                }),
              })),
            })),
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null }),
            }),
            delete: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                not: vi.fn().mockResolvedValue({ error: null }),
                data: [],
                error: null,
              }),
            }),
          }
        }
        if (table === 'vendors') {
          return {
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null }),
            }),
            delete: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                not: vi.fn().mockResolvedValue({ error: null }),
                data: [],
                error: null,
              }),
            }),
          }
        }
        if (table === 'vendor_contracts') {
          return {
            delete: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                not: vi.fn().mockResolvedValue({ error: null }),
                data: [],
                error: null,
              }),
            }),
            insert: vi.fn().mockResolvedValue({ error: null }),
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null }),
            }),
          }
        }
        // Default empty response
        return {
          select: vi.fn().mockResolvedValue({ data: [], error: null }),
          insert: vi.fn().mockResolvedValue({ error: null }),
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              not: vi.fn().mockResolvedValue({ error: null }),
              data: [],
              error: null,
            }),
          }),
        }
      })

      await expect(saveVendorProfile(profileData as any)).resolves.not.toThrow()
    })

    it('should sync spend records with vendor names', async () => {
      const profileId = 'profile_123'
      const vendorId = 'vendor_1'

      const profileData = {
        id: profileId,
        vendors: [
          {
            id: vendorId,
            name: 'Cloud Services Inc',
            category: 'Infrastructure',
            contact_name: 'Tech Contact',
            contact_email: 'tech@cloud.com',
            contact_phone: '555-1234',
            website: 'https://cloud.com',
            notes: 'Critical infrastructure',
          },
        ],
        contracts: [],
        spend_records: [
          {
            id: 'spend_1',
            vendor_id: vendorId,
            vendor_name: 'Cloud Services Inc',
            amount: 2500,
            period: 'monthly',
            period_date: '2025-01',
            category: 'Infrastructure',
            notes: 'Monthly cloud hosting',
          },
        ],
      }

      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'vendor_profiles') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                limit: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { id: profileId },
                    error: null,
                  }),
                }),
              })),
            })),
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null }),
            }),
            delete: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                not: vi.fn().mockResolvedValue({ error: null }),
                data: [],
                error: null,
              }),
            }),
          }
        }
        if (table === 'vendors') {
          return {
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null }),
            }),
            delete: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                not: vi.fn().mockResolvedValue({ error: null }),
                data: [],
                error: null,
              }),
            }),
          }
        }
        if (table === 'vendor_spend') {
          return {
            delete: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                not: vi.fn().mockResolvedValue({ error: null }),
                data: [],
                error: null,
              }),
            }),
            insert: vi.fn().mockResolvedValue({ error: null }),
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null }),
            }),
          }
        }
        // Default empty response
        return {
          select: vi.fn().mockResolvedValue({ data: [], error: null }),
          insert: vi.fn().mockResolvedValue({ error: null }),
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              not: vi.fn().mockResolvedValue({ error: null }),
              data: [],
              error: null,
            }),
          }),
        }
      })

      await expect(saveVendorProfile(profileData as any)).resolves.not.toThrow()
    })

    it('should throw error for unauthorized user', async () => {
      vi.mocked(auth).mockResolvedValueOnce({ userId: null })

      const profileData = {
        vendors: [],
        contracts: [],
        spend_records: [],
      }

      await expect(saveVendorProfile(profileData as any)).rejects.toThrow('Unauthorized')
    })
  })

  // ==================== RESET VENDOR PROFILE ====================

  describe('resetVendorProfile', () => {
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

      const result = await resetVendorProfile(profileId)

      expect(result).toEqual({ success: true })
    })

    it('should throw error for unauthorized user', async () => {
      vi.mocked(auth).mockResolvedValueOnce({ userId: null })

      await expect(resetVendorProfile('profile_123')).rejects.toThrow('Unauthorized')
    })

    it('should throw error on database failure', async () => {
      mockSupabaseClient.from = vi.fn(() => ({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn((column: string, value: string) => {
            return {
              eq: vi.fn().mockResolvedValue({
                error: { message: 'Database connection failed' },
              }),
            }
          }),
        }),
      }))

      await expect(resetVendorProfile('profile_123')).rejects.toThrow('Failed to reset vendor data')
    })
  })

  // ==================== EDGE CASES ====================

  describe('Edge Cases', () => {
    it('should handle vendors with null values', async () => {
      const profileId = 'profile_123'

      const mockVendors = [
        {
          id: 'vendor_1',
          profile_id: profileId,
          name: 'Minimal Vendor',
          category: null,
          contact_name: null,
          contact_email: null,
          contact_phone: null,
          website: null,
          notes: null,
        },
      ]

      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'vendor_profiles') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                limit: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { id: profileId },
                    error: null,
                  }),
                }),
              })),
            })),
          }
        }
        if (table === 'vendors') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn().mockResolvedValue({
                data: mockVendors,
                error: null,
              }),
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

      const result = await getVendorProfile()

      expect(result?.vendors).toHaveLength(1)
      expect(result?.vendors[0].name).toBe('Minimal Vendor')
      expect(result?.vendors[0].category).toBeNull()
      expect(result?.vendors[0].notes).toBeNull()
    })

    it('should handle temp IDs for new vendors', async () => {
      const profileId = 'profile_123'

      const profileData = {
        id: profileId,
        vendors: [
          {
            id: 'temp-new-vendor-123',
            name: 'New Vendor with Temp ID',
            category: 'Services',
            contact_name: 'New Contact',
            contact_email: 'new@example.com',
            contact_phone: '',
            website: '',
            notes: '',
          },
        ],
        contracts: [],
        spend_records: [],
      }

      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'vendor_profiles') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                limit: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { id: profileId },
                    error: null,
                  }),
                }),
              })),
            })),
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ error: null }),
            }),
          }
        }
        if (table === 'vendors') {
          return {
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: 'real-vendor-456' },
                  error: null,
                }),
              }),
            }),
            delete: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                not: vi.fn().mockResolvedValue({ error: null }),
                data: [],
                error: null,
              }),
            }),
          }
        }
        // Default empty response
        return {
          select: vi.fn().mockResolvedValue({ data: [], error: null }),
          insert: vi.fn().mockResolvedValue({ error: null }),
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              not: vi.fn().mockResolvedValue({ error: null }),
              data: [],
              error: null,
            }),
          }),
        }
      })

      await expect(saveVendorProfile(profileData as any)).resolves.not.toThrow()
    })
  })
})
