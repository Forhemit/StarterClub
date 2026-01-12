import Stripe from 'stripe'

/**
 * Stripe webhook mock data generators for testing
 */
export class StripeWebhookMockBuilder {
  private static idCounter = 1

  static generateId(prefix: string = 'test'): string {
    return `${prefix}_${this.idCounter++}_${Date.now()}`
  }

  /**
   * Create a mock checkout.session.completed event
   */
  static createCheckoutSessionCompleted(overrides: Partial<Stripe.Checkout.Session> = {}): Stripe.Event {
    const sessionId = this.generateId('cs')
    const customerId = this.generateId('cus')
    const subscriptionId = this.generateId('sub')

    const session: Stripe.Checkout.Session = {
      id: sessionId,
      object: 'checkout.session',
      mode: 'subscription',
      customer: customerId,
      subscription: subscriptionId,
      client_reference_id: 'user_test_123',
      payment_status: 'paid',
      status: 'complete',
      metadata: {
        org_id: this.generateId('org'),
        deal_type: 'standard',
      },
      created: Math.floor(Date.now() / 1000),
      livemode: false,
      currency: 'usd',
      amount_total: 9900,
      amount_subtotal: 9900,
      ...overrides,
    } as Stripe.Checkout.Session

    return {
      id: this.generateId('evt'),
      object: 'event',
      api_version: '2025-12-15.clover',
      created: Math.floor(Date.now() / 1000),
      type: 'checkout.session.completed',
      data: {
        object: session,
      },
      livemode: false,
    }
  }

  /**
   * Create a mock checkout.session.completed event for one-time payment
   */
  static createCheckoutSessionPayment(overrides: Partial<Stripe.Checkout.Session> = {}): Stripe.Event {
    const session: Stripe.Checkout.Session = {
      id: this.generateId('cs'),
      object: 'checkout.session',
      mode: 'payment',
      customer: this.generateId('cus'),
      payment_status: 'paid',
      status: 'complete',
      metadata: {
        org_id: this.generateId('org'),
        deal_type: 'custom_negotiated',
      },
      created: Math.floor(Date.now() / 1000),
      livemode: false,
      currency: 'usd',
      amount_total: 50000,
      amount_subtotal: 50000,
      ...overrides,
    } as Stripe.Checkout.Session

    return {
      id: this.generateId('evt'),
      object: 'event',
      api_version: '2025-12-15.clover',
      created: Math.floor(Date.now() / 1000),
      type: 'checkout.session.completed',
      data: {
        object: session,
      },
      livemode: false,
    }
  }

  /**
   * Create a mock customer.subscription.updated event
   */
  static createSubscriptionUpdated(overrides: Partial<Stripe.Subscription> = {}): Stripe.Event {
    const subscriptionId = this.generateId('sub')
    const customerId = this.generateId('cus')
    const priceId = this.generateId('price')

    const subscription: Stripe.Subscription = {
      id: subscriptionId,
      object: 'subscription',
      customer: customerId,
      status: 'active',
      current_period_end: Math.floor((Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000),
      current_period_start: Math.floor(Date.now() / 1000),
      items: {
        object: 'list',
        data: [
          {
            id: this.generateId('si'),
            object: 'subscription_item',
            price: {
              id: priceId,
              object: 'price',
              currency: 'usd',
              unit_amount: 9900,
              recurring: {
                interval: 'month',
              },
            } as Stripe.Price,
          } as Stripe.SubscriptionItem,
        ],
      } as Stripe.ApiList<Stripe.SubscriptionItem>,
      metadata: {
        org_id: this.generateId('org'),
      },
      created: Math.floor(Date.now() / 1000),
      livemode: false,
      ...overrides,
    } as Stripe.Subscription

    return {
      id: this.generateId('evt'),
      object: 'event',
      api_version: '2025-12-15.clover',
      created: Math.floor(Date.now() / 1000),
      type: 'customer.subscription.updated',
      data: {
        object: subscription,
      },
      livemode: false,
    }
  }

  /**
   * Create a mock customer.subscription.updated event for member subscription
   */
  static createMemberSubscriptionUpdated(overrides: Partial<Stripe.Subscription> = {}): Stripe.Event {
    const subscription = {
      ...this.createSubscriptionUpdated(overrides).data.object,
      metadata: {
        type: 'member',
      },
    } as Stripe.Subscription

    return {
      id: this.generateId('evt'),
      object: 'event',
      api_version: '2025-12-15.clover',
      created: Math.floor(Date.now() / 1000),
      type: 'customer.subscription.updated',
      data: {
        object: subscription,
      },
      livemode: false,
    }
  }

  /**
   * Create a mock customer.subscription.deleted event
   */
  static createSubscriptionDeleted(overrides: Partial<Stripe.Subscription> = {}): Stripe.Event {
    const subscriptionId = this.generateId('sub')
    const customerId = this.generateId('cus')
    const priceId = this.generateId('price')

    const subscription: Stripe.Subscription = {
      id: subscriptionId,
      object: 'subscription',
      customer: customerId,
      status: 'canceled',
      current_period_end: Math.floor((Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000),
      current_period_start: Math.floor(Date.now() / 1000),
      items: {
        object: 'list',
        data: [
          {
            id: this.generateId('si'),
            object: 'subscription_item',
            price: {
              id: priceId,
              object: 'price',
              currency: 'usd',
              unit_amount: 9900,
              recurring: {
                interval: 'month',
              },
            } as Stripe.Price,
          } as Stripe.SubscriptionItem,
        ],
      } as Stripe.ApiList<Stripe.SubscriptionItem>,
      metadata: {},
      created: Math.floor(Date.now() / 1000),
      livemode: false,
      canceled_at: Math.floor(Date.now() / 1000),
      ...overrides,
    } as Stripe.Subscription

    return {
      id: this.generateId('evt'),
      object: 'event',
      api_version: '2025-12-15.clover',
      created: Math.floor(Date.now() / 1000),
      type: 'customer.subscription.deleted',
      data: {
        object: subscription,
      },
      livemode: false,
    }
  }

  /**
   * Create a mock charge.succeeded event
   */
  static createChargeSucceeded(overrides: Partial<Stripe.Charge> = {}): Stripe.Event {
    const chargeId = this.generateId('ch')
    const balanceTransactionId = this.generateId('txn')
    const customerId = this.generateId('cus')

    const charge: Stripe.Charge = {
      id: chargeId,
      object: 'charge',
      amount: 9900,
      amount_captured: 9900,
      amount_refunded: 0,
      currency: 'usd',
      customer: customerId,
      description: 'Test payment',
      paid: true,
      status: 'succeeded',
      created: Math.floor(Date.now() / 1000),
      livemode: false,
      balance_transaction: balanceTransactionId,
      ...overrides,
    } as Stripe.Charge

    return {
      id: this.generateId('evt'),
      object: 'event',
      api_version: '2025-12-15.clover',
      created: Math.floor(Date.now() / 1000),
      type: 'charge.succeeded',
      data: {
        object: charge,
      },
      livemode: false,
    }
  }

  /**
   * Create a mock charge.succeeded event with balance transaction
   */
  static createChargeSucceededWithFee(overrides: Partial<Stripe.Charge> = {}): Stripe.Event {
    const charge: Stripe.Charge = {
      ...this.createChargeSucceeded(overrides).data.object,
      amount: 10000,
      balance_transaction: {
        id: this.generateId('txn'),
        object: 'balance_transaction',
        amount: 10000,
        currency: 'usd',
        fee: 590,
        net: 9410,
        created: Math.floor(Date.now() / 1000),
        livemode: false,
        ...overrides,
      } as Stripe.BalanceTransaction,
    } as Stripe.Charge

    return {
      id: this.generateId('evt'),
      object: 'event',
      api_version: '2025-12-15.clover',
      created: Math.floor(Date.now() / 1000),
      type: 'charge.succeeded',
      data: {
        object: charge,
      },
      livemode: false,
    }
  }

  /**
   * Create a mock payout.paid event
   */
  static createPayoutPaid(overrides: Partial<Stripe.Payout> = {}): Stripe.Event {
    const payoutId = this.generateId('po')

    const payout: Stripe.Payout = {
      id: payoutId,
      object: 'payout',
      amount: 500000,
      currency: 'usd',
      status: 'in_transit',
      arrival_date: Math.floor((Date.now() + 2 * 24 * 60 * 60 * 1000) / 1000),
      created: Math.floor(Date.now() / 1000),
      livemode: false,
      description: 'Stripe payout',
      method: 'standard',
      ...overrides,
    } as Stripe.Payout

    return {
      id: this.generateId('evt'),
      object: 'event',
      api_version: '2025-12-15.clover',
      created: Math.floor(Date.now() / 1000),
      type: 'payout.paid',
      data: {
        object: payout,
      },
      livemode: false,
    }
  }

  /**
   * Create a mock invoice.payment_succeeded event
   */
  static createInvoicePaymentSucceeded(overrides: Partial<Stripe.Invoice> = {}): Stripe.Event {
    const invoiceId = this.generateId('in')
    const subscriptionId = this.generateId('sub')
    const customerId = this.generateId('cus')

    const invoice: Stripe.Invoice = {
      id: invoiceId,
      object: 'invoice',
      customer: customerId,
      subscription: subscriptionId,
      status: 'paid',
      total: 9900,
      currency: 'usd',
      amount_paid: 9900,
      amount_due: 9900,
      created: Math.floor(Date.now() / 1000),
      livemode: false,
      ...overrides,
    } as Stripe.Invoice

    return {
      id: this.generateId('evt'),
      object: 'event',
      api_version: '2025-12-15.clover',
      created: Math.floor(Date.now() / 1000),
      type: 'invoice.payment_succeeded',
      data: {
        object: invoice,
      },
      livemode: false,
    }
  }
}

/**
 * Helper to create a mock webhook signature
 */
export function createMockWebhookSignature(payload: string, secret: string = 'test_webhook_secret'): string {
  // In real Stripe, this would be HMAC SHA256 signed
  // For tests, we return a predictable format
  return `t=${Date.now()},v1=${Buffer.from(`${secret}.${payload}`).toString('base64')}`
}

/**
 * Set up mocked Stripe client for testing
 */
export function setupMockStripe() {
  const mockStripe = {
    webhooks: {
      constructEvent: vi.fn((payload: string, signature: string, secret: string) => {
        // Return a default event for testing
        return StripeWebhookMockBuilder.createCheckoutSessionCompleted()
      }),
    },
    subscriptions: {
      retrieve: vi.fn(),
    },
    balanceTransactions: {
      retrieve: vi.fn(),
    },
  }

  vi.mock('stripe', () => ({
    default: vi.fn(() => mockStripe),
  }))

  return mockStripe
}

/**
 * Helper to build test webhook payload with signature
 */
export function buildTestWebhookPayload(
  eventType: string,
  overrides: any = {}
): { payload: string; signature: string } {
  let event: Stripe.Event

  switch (eventType) {
    case 'checkout.session.completed':
      event = StripeWebhookMockBuilder.createCheckoutSessionCompleted(overrides)
      break
    case 'checkout.session.payment':
      event = StripeWebhookMockBuilder.createCheckoutSessionPayment(overrides)
      break
    case 'customer.subscription.updated':
      event = StripeWebhookMockBuilder.createSubscriptionUpdated(overrides)
      break
    case 'customer.subscription.deleted':
      event = StripeWebhookMockBuilder.createSubscriptionDeleted(overrides)
      break
    case 'charge.succeeded':
      event = StripeWebhookMockBuilder.createChargeSucceeded(overrides)
      break
    case 'charge.succeeded.with_fee':
      event = StripeWebhookMockBuilder.createChargeSucceededWithFee(overrides)
      break
    case 'payout.paid':
      event = StripeWebhookMockBuilder.createPayoutPaid(overrides)
      break
    case 'invoice.payment_succeeded':
      event = StripeWebhookMockBuilder.createInvoicePaymentSucceeded(overrides)
      break
    default:
      event = StripeWebhookMockBuilder.createCheckoutSessionCompleted(overrides)
  }

  const payload = JSON.stringify(event)
  const signature = createMockWebhookSignature(payload)

  return { payload, signature }
}
