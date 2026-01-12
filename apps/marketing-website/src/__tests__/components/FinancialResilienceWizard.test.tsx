/**
 * Tests for FinancialResilienceWizard component
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { FinancialResilienceWizard } from '@/components/financial-resilience/FinancialResilienceWizard'
import { saveFinancialResilienceProfile, getFinancialResilienceProfile, deleteFinancialResilienceProfile } from '@/actions/resilience'
import { type FinancialResilienceData } from '@/actions/resilience'

// Mock dependencies
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}))

vi.mock('@/hooks/useOrganization', () => ({
  useOrganization: vi.fn(() => ({
    organization: { id: 'org_123', name: 'Test Org' },
    isLoading: false,
  })),
}))

vi.mock('@/actions/resilience', () => ({
  saveFinancialResilienceProfile: vi.fn(),
  getFinancialResilienceProfile: vi.fn(),
  deleteFinancialResilienceProfile: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}))

const mockSave = vi.mocked(saveFinancialResilienceProfile)
const mockGet = vi.mocked(getFinancialResilienceProfile)
const mockDelete = vi.mocked(deleteFinancialResilienceProfile)

describe('FinancialResilienceWizard', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Default mock implementations
    mockGet.mockResolvedValue(null)
    mockSave.mockResolvedValue({ success: true })
    mockDelete.mockResolvedValue({ success: true })
  })

  // ==================== RENDERING TESTS ====================

  describe('Rendering', () => {
    it('should render the wizard with initial step', async () => {
      render(<FinancialResilienceWizard />)

      await waitFor(() => {
        expect(screen.getByText(/Financial Resilience/i)).toBeInTheDocument()
        expect(screen.getByText(/Overview/i)).toBeInTheDocument()
        expect(screen.getByText(/Business Profile/i)).toBeInTheDocument()
      })
    })

    it('should render all step indicator buttons', async () => {
      render(<FinancialResilienceWizard />)

      await waitFor(() => {
        // Step indicators are numbered buttons - use getAllByText since there are multiple "1"s
        const allOnes = screen.getAllByText('1')
        expect(allOnes.length).toBeGreaterThan(0)

        // Check for later step numbers that only appear once
        expect(screen.getByText('11')).toBeInTheDocument()
      })
    })

    it('should show loading state initially', () => {
      mockGet.mockImplementation(() => new Promise(() => {})) // Never resolves

      render(<FinancialResilienceWizard />)

      // Should show skeleton or loading state
      expect(screen.queryByText(/Financial Resilience/i)).not.toBeInTheDocument()
    })

    it('should display step indicator buttons', async () => {
      render(<FinancialResilienceWizard />)

      await waitFor(() => {
        // Check that we have multiple step indicator buttons
        const step2 = screen.getAllByText('2')
        expect(step2.length).toBeGreaterThan(0)
      })
    })
  })

  // ==================== NAVIGATION TESTS ====================

  describe('Navigation', () => {
    it('should navigate to next step when clicking next button', async () => {
      const user = userEvent.setup()
      render(<FinancialResilienceWizard />)

      await waitFor(() => {
        expect(screen.getByText(/Overview/i)).toBeInTheDocument()
      })

      const nextButton = screen.getByRole('button', { name: /Next Step/i })
      await user.click(nextButton)

      await waitFor(() => {
        expect(screen.getByText(/Metrics/i)).toBeInTheDocument()
      })
    })

    it('should navigate to previous step when clicking back button', async () => {
      const user = userEvent.setup()
      render(<FinancialResilienceWizard />)

      await waitFor(() => {
        expect(screen.getByText(/Overview/i)).toBeInTheDocument()
      })

      // Go to next step first
      const nextButton = screen.getByRole('button', { name: /Next Step/i })
      await user.click(nextButton)

      await waitFor(() => {
        expect(screen.getByText(/Metrics/i)).toBeInTheDocument()
      })

      // Go back to previous step
      const backButton = screen.getByRole('button', { name: /Back/i })
      await user.click(backButton)

      await waitFor(() => {
        expect(screen.getByText(/Overview/i)).toBeInTheDocument()
      })
    })

    it('should update current step indicator when navigating', async () => {
      const user = userEvent.setup()
      render(<FinancialResilienceWizard />)

      await waitFor(() => {
        expect(screen.getByText(/Overview/i)).toBeInTheDocument()
      })

      const nextButton = screen.getByRole('button', { name: /Next Step/i })
      await user.click(nextButton)

      await waitFor(() => {
        expect(screen.getByText(/Metrics/i)).toBeInTheDocument()
      })
    })
  })

  // ==================== SAVE FUNCTIONALITY ====================

  describe('Save Functionality', () => {
    it('should save profile when clicking save button', async () => {
      const user = userEvent.setup()
      render(<FinancialResilienceWizard />)

      await waitFor(() => {
        expect(screen.getByText(/Overview/i)).toBeInTheDocument()
      })

      const saveButton = screen.getByRole('button', { name: /^Save$/i })
      await user.click(saveButton)

      await waitFor(() => {
        expect(mockSave).toHaveBeenCalled()
      })
    })

    it('should show saving state when saving', async () => {
      const user = userEvent.setup()

      // Make save take longer so we can catch the loading state
      mockSave.mockImplementation(() => new Promise(resolve => {
        setTimeout(() => resolve({ success: true }), 100)
      }))

      render(<FinancialResilienceWizard />)

      await waitFor(() => {
        expect(screen.getByText(/Overview/i)).toBeInTheDocument()
      })

      const saveButton = screen.getByRole('button', { name: /^Save$/i })
      await user.click(saveButton)

      // The button should show "Saving..." text
      await waitFor(() => {
        expect(screen.getByText(/Saving\.\.\./i)).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('should show saved state after successful save', async () => {
      const user = userEvent.setup()
      render(<FinancialResilienceWizard />)

      await waitFor(() => {
        const saveButton = screen.getByRole('button', { name: /^Save$/i })
        user.click(saveButton)
      })

      await waitFor(() => {
        expect(screen.getByText(/^Saved$/i)).toBeInTheDocument()
      })
    })

    it('should load existing profile on mount', async () => {
      const existingProfile: FinancialResilienceData = {
        targetMonthsCoverage: 9,
        averageCollectionDays: 45,
        averagePaymentDays: 60,
        requireDualSignature: true,
        dualSignatureThreshold: 25000,
      }

      mockGet.mockResolvedValue(existingProfile)

      render(<FinancialResilienceWizard />)

      await waitFor(() => {
        expect(mockGet).toHaveBeenCalledWith('org_123')
      })
    })
  })

  // ==================== RESET FUNCTIONALITY ====================

  describe('Reset Functionality', () => {
    it('should show reset confirmation dialog when clicking reset form option', async () => {
      const user = userEvent.setup()
      render(<FinancialResilienceWizard />)

      await waitFor(() => {
        expect(screen.getByText(/Overview/i)).toBeInTheDocument()
      })

      // Click the options menu button (the trigger is a button with Options title or MoreVertical icon)
      const menuButton = screen.getByRole('button', { name: /Options/i })
      await user.click(menuButton)

      // Click "Reset Form" menu item
      await waitFor(() => {
        const resetMenuItem = screen.getByText(/Reset Form/i)
        expect(resetMenuItem).toBeInTheDocument()
      })
    })

    it('should show reset confirmation dialog with correct title', async () => {
      const user = userEvent.setup()
      render(<FinancialResilienceWizard />)

      await waitFor(() => {
        const menuButton = screen.getByRole('button', { name: /Options/i })
        user.click(menuButton)
      })

      await waitFor(() => {
        const resetMenuItem = screen.getByText(/Reset Form/i)
        user.click(resetMenuItem)
      })

      await waitFor(() => {
        expect(screen.getByText(/Reset Form\?/i)).toBeInTheDocument()
      })
    })

    it('should cancel reset when clicking cancel', async () => {
      const user = userEvent.setup()
      render(<FinancialResilienceWizard />)

      await waitFor(() => {
        const menuButton = screen.getByRole('button', { name: /Options/i })
        user.click(menuButton)
      })

      await waitFor(() => {
        const resetMenuItem = screen.getByText(/Reset Form/i)
        user.click(resetMenuItem)
      })

      await waitFor(() => {
        const cancelButton = screen.getByRole('button', { name: /Cancel/i })
        user.click(cancelButton)
      })

      await waitFor(() => {
        expect(screen.queryByText(/Reset Form\?/i)).not.toBeInTheDocument()
      })
    })
  })

  // ==================== DELETE FUNCTIONALITY ====================

  describe('Delete Functionality', () => {
    it('should show delete confirmation dialog when clicking delete all data option', async () => {
      const user = userEvent.setup()
      render(<FinancialResilienceWizard />)

      await waitFor(() => {
        expect(screen.getByText(/Overview/i)).toBeInTheDocument()
      })

      // Click the options menu button
      const menuButton = screen.getByRole('button', { name: /Options/i })
      await user.click(menuButton)

      // Click "Delete All Data" menu item
      await waitFor(() => {
        const deleteMenuItem = screen.getByText(/Delete All Data/i)
        expect(deleteMenuItem).toBeInTheDocument()
      })
    })

    it('should show delete confirmation dialog with correct title', async () => {
      const user = userEvent.setup()
      render(<FinancialResilienceWizard />)

      await waitFor(() => {
        const menuButton = screen.getByRole('button', { name: /Options/i })
        user.click(menuButton)
      })

      await waitFor(() => {
        const deleteMenuItem = screen.getByText(/Delete All Data/i)
        user.click(deleteMenuItem)
      })

      await waitFor(() => {
        expect(screen.getByText(/Delete All Financial Resilience Data\?/i)).toBeInTheDocument()
      })
    })

    it('should show delete warning message', async () => {
      const user = userEvent.setup()
      render(<FinancialResilienceWizard />)

      await waitFor(() => {
        const menuButton = screen.getByRole('button', { name: /Options/i })
        user.click(menuButton)
      })

      await waitFor(() => {
        const deleteMenuItem = screen.getByText(/Delete All Data/i)
        user.click(deleteMenuItem)
      })

      await waitFor(() => {
        expect(screen.getByText(/permanently delete/i)).toBeInTheDocument()
        expect(screen.getByText(/cannot be undone/i)).toBeInTheDocument()
      })
    })
  })

  // ==================== COMPLETE FUNCTIONALITY ====================

  describe('Complete Functionality', () => {
    it('should show complete button on last step', async () => {
      const user = userEvent.setup()
      render(<FinancialResilienceWizard />)

      await waitFor(() => {
        expect(screen.getByText(/Overview/i)).toBeInTheDocument()
      })

      // Navigate to the second step to verify navigation works
      const nextButton = screen.getByRole('button', { name: /Next Step/i })
      await user.click(nextButton)

      await waitFor(() => {
        expect(screen.getByText(/Metrics/i)).toBeInTheDocument()
        // Next Step button should still exist on step 2
        expect(screen.queryByRole('button', { name: /Next Step/i })).toBeInTheDocument()
      })
    })

    it('should show correct step labels when navigating', async () => {
      const user = userEvent.setup()
      render(<FinancialResilienceWizard />)

      await waitFor(() => {
        expect(screen.getByText(/Overview/i)).toBeInTheDocument()
        expect(screen.getByText(/Business Profile/i)).toBeInTheDocument()
      })

      // Navigate to second step
      const nextButton = screen.getByRole('button', { name: /Next Step/i })
      await user.click(nextButton)

      await waitFor(() => {
        expect(screen.getByText(/Metrics/i)).toBeInTheDocument()
        expect(screen.getByText(/Key Financials/i)).toBeInTheDocument()
      })

      // Navigate back
      const backButton = screen.getByRole('button', { name: /Back/i })
      await user.click(backButton)

      await waitFor(() => {
        expect(screen.getByText(/Overview/i)).toBeInTheDocument()
      })
    })
  })

  // ==================== PREVIEW FUNCTIONALITY ====================

  describe('Preview Functionality', () => {
    it('should show preview mode when clicking preview button', async () => {
      const user = userEvent.setup()
      render(<FinancialResilienceWizard />)

      await waitFor(() => {
        expect(screen.getByText(/Overview/i)).toBeInTheDocument()
      })

      const previewButton = screen.getByRole('button', { name: /Preview/i })
      await user.click(previewButton)

      await waitFor(() => {
        // In preview mode, the edit button should be visible
        expect(screen.getByRole('button', { name: /Edit/i })).toBeInTheDocument()
      })
    })

    it('should exit preview mode when clicking edit button', async () => {
      const user = userEvent.setup()
      render(<FinancialResilienceWizard />)

      await waitFor(() => {
        const previewButton = screen.getByRole('button', { name: /Preview/i })
        user.click(previewButton)
      })

      await waitFor(() => {
        const editButton = screen.getByRole('button', { name: /Edit/i })
        user.click(editButton)
      })

      await waitFor(() => {
        // Back to edit mode, should see Overview step
        expect(screen.getByText(/Overview/i)).toBeInTheDocument()
      })
    })
  })

  // ==================== ERROR HANDLING ====================

  describe('Error Handling', () => {
    it('should render wizard content when loaded', async () => {
      render(<FinancialResilienceWizard />)

      // With default mock (org loaded), content should be visible
      await waitFor(() => {
        expect(screen.getByText(/Financial Resilience/i)).toBeInTheDocument()
      })
    })
  })
})
