import { vi } from 'vitest'

/**
 * Authentication test helpers for simulating authenticated users
 */
export class AuthTestHelper {
  /**
   * Create a mock authenticated user with default values
   */
  static createMockUser(overrides: Partial<MockUser> = {}): MockUser {
    return {
      id: 'user_test_123456',
      firstName: 'Test',
      lastName: 'User',
      emailAddress: 'test@example.com',
      userId: 'user_test_123456',
      orgId: 'org_test_789',
      orgSlug: 'test-organization',
      sessionId: 'sess_test_abc123',
      isLoaded: true,
      ...overrides,
    }
  }

  /**
   * Create a mock organization context
   */
  static createMockOrganization(overrides: Partial<MockOrganization> = {}): MockOrganization {
    return {
      id: 'org_test_789',
      name: 'Test Organization',
      slug: 'test-organization',
      maxUsers: 10,
      membersCount: 1,
      ...overrides,
    }
  }

  /**
   * Create mock JWT claims for RLS testing
   */
  static createMockJWTClaims(overrides: Partial<MockJWTClaims> = {}): MockJWTClaims {
    return {
      sub: 'user_test_123456',
      organization_id: 'org_test_789',
      role: 'member',
      email: 'test@example.com',
      ...overrides,
    }
  }

  /**
   * Mock Clerk auth object for server-side testing
   */
  static createMockAuth(overrides: Partial<MockAuth> = {}): MockAuth {
    return {
      userId: 'user_test_123456',
      orgId: 'org_test_789',
      sessionId: 'sess_test_abc123',
      getToken: vi.fn().mockResolvedValue('mock-supabase-jwt-token'),
      ...overrides,
    }
  }

  /**
   * Create mock headers for authenticated requests
   */
  static createMockAuthHeaders(): Headers {
    const headers = new Headers()
    headers.set('Authorization', 'Bearer mock-supabase-jwt-token')
    headers.set('x-clerk-auth-message', 'mock-auth-token')
    return headers
  }
}

/**
 * Set up mocked Clerk auth context for testing
 */
export function setupMockAuthContext() {
  const mockUser = AuthTestHelper.createMockUser()
  const mockAuth = AuthTestHelper.createMockAuth()

  vi.mock('@clerk/nextjs', () => ({
    auth: vi.fn(() => Promise.resolve(mockAuth)),
    currentUser: mockUser,
    useAuth: () => ({
      userId: mockUser.userId,
      orgId: mockUser.orgId,
      sessionId: mockUser.sessionId,
      isLoaded: true,
    }),
    useUser: () => ({
      user: mockUser,
      isLoaded: true,
    }),
    useOrganization: () => ({
      organization: AuthTestHelper.createMockOrganization(),
      membership: {
        role: 'admin',
      },
    }),
    ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
  }))
}

/**
 * Set up mocked Clerk auth for server actions
 */
export function setupMockServerAuth() {
  const mockAuth = AuthTestHelper.createMockAuth()

  vi.mock('@clerk/nextjs/server', () => ({
    auth: vi.fn(() => Promise.resolve(mockAuth)),
  }))
}

/**
 * Helper to test authentication failures
 */
export function testUnauthenticatedAccess() {
  vi.mock('@clerk/nextjs/server', () => ({
    auth: vi.fn(() => Promise.resolve(null)),
  }))
}

/**
 * Helper to test cross-organization access prevention
 */
export function testCrossOrganizationAccess() {
  const userAuth = AuthTestHelper.createMockAuth({
    orgId: 'org_test_789',
  })

  const differentOrgContext = {
    organization_id: 'org_different_123',
  }

  return { userAuth, differentOrgContext }
}

// Type definitions
export interface MockUser {
  id: string
  firstName: string
  lastName: string
  emailAddress: string
  userId: string
  orgId: string
  orgSlug: string
  sessionId: string
  isLoaded: boolean
}

export interface MockOrganization {
  id: string
  name: string
  slug: string
  maxUsers: number
  membersCount: number
}

export interface MockJWTClaims {
  sub: string
  organization_id: string
  role: string
  email: string
}

export interface MockAuth {
  userId: string
  orgId: string
  sessionId: string
  getToken: () => Promise<string | null>
}
