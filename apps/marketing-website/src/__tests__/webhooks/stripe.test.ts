/**
 * Tests for Stripe webhook handlers
 * @vitest-environment node
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { POST } from '@/app/api/webhooks/stripe/route'
import { buildTestWebhookPayload, setupMockStripe } from '@/__tests__/mocks/stripe.webhooks'
import { createMockSupabaseClient } from '@/__tests__/utils/test-db'

// Mock Stripe
const mockWebhooks = {
  constructEvent: vi.fn((payload: string, signature: string, secret: string) => {
    // Parse and return the event directly for testing (bypass signature verification)
    return JSON.parse(payload)
  }),
}
const mockSubscriptions = {
  retrieve: vi.fn(),
}
const mockBalanceTransactions = {
  retrieve: vi.fn(),
}

vi.mock('stripe', () => ({
  default: class {
    webhooks = mockWebhooks
    subscriptions = mockSubscriptions
    balanceTransactions = mockBalanceTransactions
  },
}))

// Mock Supabase - will be set in beforeEach
let mockSupabaseClient: ReturnType<typeof createMockSupabaseClient>['mockClient']

vi.mock('@/lib/supabase/server', () => ({
  createSupabaseServerClient: vi.fn(() => mockSupabaseClient),
}))

vi.mock('next/headers', () => ({
  headers: vi.fn(() => ({
    get: vi.fn((name: string) => {
      if (name === 'stripe-signature') return 't=1234567890,v1=abc123'
      return null
    }),
  })),
}))

describe('Stripe Webhook Handlers', () => {
  beforeEach(() => {
    const mock = createMockSupabaseClient()
    mockSupabaseClient = mock.mockClient
    vi.clearAllMocks()

    // Reset constructEvent mock to default implementation
    mockWebhooks.constructEvent.mockImplementation((payload: string, signature: string, secret: string) => {
      return JSON.parse(payload)
    })

    // Set up environment variables
    process.env.STRIPE_SECRET_KEY = 'sk_test_123'
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_123'
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
  })

  // ==================== CHECKOUT SESSION COMPLETED ====================

  describe('checkout.session.completed', () => {
    it('should handle subscription checkout successfully', async () => {
      const { payload, signature } = buildTestWebhookPayload('checkout.session.completed', {
        mode: 'subscription',
        client_reference_id: 'user_test_123',
      })

      const request = new Request('https://example.com/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': signature,
          'content-type': 'application/json',
        },
        body: payload,
      })

      // Mock Supabase responses
      let callCount = 0
      mockSupabaseClient.from = vi.fn((table: string) => {
        callCount++

        if (table === 'members') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: { id: 'member_123' },
                  error: null,
                }),
              })),
            })),
          }
        }

        if (table === 'member_subscriptions') {
          return {
            upsert: vi.fn().mockResolvedValue({ error: null }),
          }
        }

        return {
          upsert: vi.fn().mockResolvedValue({ error: null }),
          insert: vi.fn().mockResolvedValue({ error: null }),
        }
      })

      // Mock Stripe subscription retrieve
      // Set up mock responses
      mockSubscriptions.retrieve.mockResolvedValue({
        id: 'sub_123',
        status: 'active',
        current_period_end: Math.floor(Date.now() / 1000) + 2592000,
        items: {
          data: [
            {
              price: {
                id: 'price_123',
              },
            },
          ],
        },
      })

      const response = await POST(request)

      expect(response.status).toBe(200)
    })

    it('should handle one-time payment checkout successfully', async () => {
      const { payload, signature } = buildTestWebhookPayload('checkout.session.payment', {
        mode: 'payment',
      })

      const request = new Request('https://example.com/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': signature,
          'content-type': 'application/json',
        },
        body: payload,
      })

      mockSupabaseClient.from = vi.fn(() => ({
        insert: vi.fn().mockResolvedValue({ error: null }),
      }))

      const response = await POST(request)

      expect(response.status).toBe(200)
    })
  })

  // ==================== SUBSCRIPTION UPDATED ====================

  describe('customer.subscription.updated', () => {
    it('should handle subscription update for organization', async () => {
      const { payload, signature } = buildTestWebhookPayload('customer.subscription.updated', {
        metadata: {
          org_id: 'org_123',
        },
      })

      const request = new Request('https://example.com/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': signature,
          'content-type': 'application/json',
        },
        body: payload,
      })

      mockSupabaseClient.from = vi.fn(() => ({
        upsert: vi.fn().mockResolvedValue({ error: null }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      }))

      const response = await POST(request)

      expect(response.status).toBe(200)
    })

    it('should handle subscription update for member', async () => {
      const { payload, signature } = buildTestWebhookPayload('member.subscription.updated')

      const request = new Request('https://example.com/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': signature,
          'content-type': 'application/json',
        },
        body: payload,
      })

      mockSupabaseClient.from = vi.fn(() => ({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      }))

      const response = await POST(request)

      expect(response.status).toBe(200)
    })
  })

  // ==================== SUBSCRIPTION DELETED ====================

  describe('customer.subscription.deleted', () => {
    it('should handle subscription cancellation for organization', async () => {
      const { payload, signature } = buildTestWebhookPayload('customer.subscription.deleted')

      const request = new Request('https://example.com/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': signature,
          'content-type': 'application/json',
        },
        body: payload,
      })

      mockSupabaseClient.from = vi.fn(() => ({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      }))

      const response = await POST(request)

      expect(response.status).toBe(200)
    })

    it('should handle subscription cancellation for member', async () => {
      const { payload, signature } = buildTestWebhookPayload('customer.subscription.deleted', {
        metadata: {
          type: 'member',
        },
      })

      const request = new Request('https://example.com/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': signature,
          'content-type': 'application/json',
        },
        body: payload,
      })

      mockSupabaseClient.from = vi.fn(() => ({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      }))

      const response = await POST(request)

      expect(response.status).toBe(200)
    })
  })

  // ==================== CHARGE SUCCEEDED ====================

  describe('charge.succeeded', () => {
    it('should handle successful charge with accounting entries', async () => {
      const { payload, signature } = buildTestWebhookPayload('charge.succeeded.with_fee')

      const request = new Request('https://example.com/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': signature,
          'content-type': 'application/json',
        },
        body: payload,
      })

      let callCount = 0
      mockSupabaseClient.from = vi.fn((table: string) => {
        callCount++

        if (table === 'income_sources') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: { id: 'income_source_1' },
                }),
              })),
            })),
          }
        }

        if (table === 'ledger_accounts') {
          return {
            select: vi.fn(() => ({
              in: vi.fn().mockResolvedValue({
                data: [
                  { id: 'acct_1000', account_code: '1000' },
                  { id: 'acct_1001', account_code: '1001' },
                  { id: 'acct_4000', account_code: '4000' },
                  { id: 'acct_5000', account_code: '5000' },
                ],
              }),
            })),
          }
        }

        if (table === 'journal_entries') {
          return {
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: 'entry_1' },
                }),
              }),
            }),
          }
        }

        if (table === 'journal_entry_lines') {
          return {
            insert: vi.fn().mockResolvedValue({ error: null }),
          }
        }

        if (table === 'stripe_sync_log') {
          return {
            insert: vi.fn().mockResolvedValue({ error: null }),
          }
        }

        return mockSupabaseClient.from(table)
      })

      // Mock Stripe balance transaction retrieve
      // Set up mock responses
      mockBalanceTransactions.retrieve.mockResolvedValue({
        id: 'txn_123',
        amount: 10000,
        fee: 590,
        net: 9410,
      })

      const response = await POST(request)

      expect(response.status).toBe(200)
    })

    it('should handle missing income source gracefully', async () => {
      const { payload, signature } = buildTestWebhookPayload('charge.succeeded')

      const request = new Request('https://example.com/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': signature,
          'content-type': 'application/json',
        },
        body: payload,
      })

      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'income_sources') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: null,
                }),
              })),
            })),
          }
        }
        return mockSupabaseClient.from(table)
      })

      const response = await POST(request)

      expect(response.status).toBe(200)
    })

    it('should handle missing ledger accounts gracefully', async () => {
      const { payload, signature } = buildTestWebhookPayload('charge.succeeded')

      const request = new Request('https://example.com/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': signature,
          'content-type': 'application/json',
        },
        body: payload,
      })

      let callCount = 0
      mockSupabaseClient.from = vi.fn((table: string) => {
        callCount++

        if (table === 'income_sources') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: { id: 'income_source_1' },
                }),
              })),
            })),
          }
        }

        if (table === 'ledger_accounts') {
          return {
            select: vi.fn(() => ({
              in: vi.fn().mockResolvedValue({
                data: null,
              }),
            })),
          }
        }

        return mockSupabaseClient.from(table)
      })

      const response = await POST(request)

      expect(response.status).toBe(200)
    })
  })

  // ==================== PAYOUT PAID ====================

  describe('payout.paid', () => {
    it('should handle payout successfully with accounting entries', async () => {
      const { payload, signature } = buildTestWebhookPayload('payout.paid')

      const request = new Request('https://example.com/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': signature,
          'content-type': 'application/json',
        },
        body: payload,
      })

      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'ledger_accounts') {
          return {
            select: vi.fn(() => ({
              in: vi.fn().mockResolvedValue({
                data: [
                  { id: 'acct_1000', account_code: '1000' },
                  { id: 'acct_1001', account_code: '1001' },
                ],
              }),
            })),
          }
        }

        if (table === 'journal_entries') {
          return {
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: { id: 'entry_1' },
                }),
              }),
            }),
          }
        }

        if (table === 'journal_entry_lines') {
          return {
            insert: vi.fn().mockResolvedValue({ error: null }),
          }
        }

        return mockSupabaseClient.from(table)
      })

      const response = await POST(request)

      expect(response.status).toBe(200)
    })
  })

  // ==================== WEBHOOK SIGNATURE VERIFICATION ====================

  describe('Webhook Signature Verification', () => {
    it('should reject requests with invalid signature', async () => {
      const payload = JSON.stringify({
        id: 'evt_test',
        object: 'event',
        type: 'checkout.session.completed',
        data: { object: {} },
      })

      const request = new Request('https://example.com/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'invalid_signature',
          'content-type': 'application/json',
        },
        body: payload,
      })

      // Mock constructEvent to throw an error
      // Set up mock to throw error
      mockWebhooks.constructEvent = vi.fn(() => {
        throw new Error('Invalid signature')
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
    })
  })

  // ==================== ERROR HANDLING ====================

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      const { payload, signature } = buildTestWebhookPayload('checkout.session.payment')

      const request = new Request('https://example.com/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': signature,
          'content-type': 'application/json',
        },
        body: payload,
      })

      mockSupabaseClient.from = vi.fn(() => ({
        insert: vi.fn().mockResolvedValue({
          error: { message: 'Database error' },
        }),
      }))

      const response = await POST(request)

      // Should still return 200 to avoid webhook retries
      expect(response.status).toBe(200)
    })

    it('should handle unhandled event types', async () => {
      const payload = JSON.stringify({
        id: 'evt_test',
        object: 'event',
        type: 'account.application.authorized',
        data: { object: {} },
      })

      const signature = 't=1234567890,v1=abc123'

      const request = new Request('https://example.com/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': signature,
          'content-type': 'application/json',
        },
        body: payload,
      })

      const response = await POST(request)

      // Should return 200 for unhandled events
      expect(response.status).toBe(200)
    })
  })

  // ==================== MEMBER SUBSCRIPTION CHECKOUT ====================

  describe('Member Subscription Checkout', () => {
    it('should handle member subscription checkout', async () => {
      const { payload, signature } = buildTestWebhookPayload('checkout.session.completed', {
        mode: 'subscription',
        client_reference_id: 'member_user_123',
      })

      const request = new Request('https://example.com/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': signature,
          'content-type': 'application/json',
        },
        body: payload,
      })

      let callCount = 0
      mockSupabaseClient.from = vi.fn((table: string) => {
        callCount++

        if (table === 'members') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: { id: 'member_123' },
                  error: null,
                }),
              })),
            })),
          }
        }

        if (table === 'member_subscriptions') {
          return {
            upsert: vi.fn().mockResolvedValue({ error: null }),
          }
        }

        return mockSupabaseClient.from(table)
      })

      // Mock Stripe subscription retrieve
      // Set up mock responses
      mockSubscriptions.retrieve.mockResolvedValue({
        id: 'sub_123',
        status: 'active',
        current_period_end: Math.floor(Date.now() / 1000) + 2592000,
        items: {
          data: [
            {
              price: {
                id: 'price_123',
              },
            },
          ],
        },
      })

      const response = await POST(request)

      expect(response.status).toBe(200)
    })

    it('should handle missing member gracefully', async () => {
      const { payload, signature } = buildTestWebhookPayload('checkout.session.completed', {
        mode: 'subscription',
        client_reference_id: 'nonexistent_member',
      })

      const request = new Request('https://example.com/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': signature,
          'content-type': 'application/json',
        },
        body: payload,
      })

      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'members') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn().mockResolvedValue({
                  data: null,
                  error: null,
                }),
              })),
            })),
          }
        }
        return mockSupabaseClient.from(table)
      })

      // Mock Stripe subscription retrieve
      // Set up mock responses
      mockSubscriptions.retrieve.mockResolvedValue({
        id: 'sub_123',
        items: { data: [{ price: { id: 'price_123' } }] },
      })

      const response = await POST(request)

      expect(response.status).toBe(200)
    })
  })
})
