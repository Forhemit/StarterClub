/**
 * Tests for ComplianceTrackingWizard component
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { ComplianceTrackingWizard } from '@/components/dashboard/compliance/ComplianceTrackingWizard'
import { type ComplianceData, INITIAL_DATA } from '@/components/dashboard/compliance/types'

// Mock dependencies
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('ComplianceTrackingWizard', () => {
  // Mock callbacks
  const mockOnSave = vi.fn()
  const mockOnReset = vi.fn()
  const mockOnComplete = vi.fn()
  const mockOnCancel = vi.fn()

  // Get toast mock reference
  const toast = require('sonner').toast

  beforeEach(() => {
    vi.clearAllMocks()

    // Default mock implementations
    mockOnSave.mockResolvedValue(undefined)
    mockOnReset.mockResolvedValue(undefined)
  })

  // ==================== RENDERING TESTS ====================

  describe('Rendering', () => {
    it('should render the wizard with initial step', async () => {
      render(<ComplianceTrackingWizard />)

      await waitFor(() => {
        expect(screen.getByText(/Compliance Tracking/i)).toBeInTheDocument()
        expect(screen.getByText(/Tax Filings/i)).toBeInTheDocument()
      })
    })

    it('should render all step indicator buttons', async () => {
      render(<ComplianceTrackingWizard />)

      await waitFor(() => {
        // Step indicators are numbered buttons 1-4
        expect(screen.getByText('1')).toBeInTheDocument()
        expect(screen.getByText('2')).toBeInTheDocument()
        expect(screen.getByText('4')).toBeInTheDocument()
      })
    })

    it('should render wizard content after mount', async () => {
      render(<ComplianceTrackingWizard />)

      // After mount, content should be visible
      await waitFor(() => {
        expect(screen.getByText(/Compliance Tracking/i)).toBeInTheDocument()
      })
    })

    it('should render with initial data prop', async () => {
      const initialData: ComplianceData = {
        tax_events: [{
          id: '1',
          title: 'Annual Tax Return',
          due_date: '2025-04-15',
          status: 'pending',
          category: 'tax'
        }]
      }

      render(<ComplianceTrackingWizard initialData={initialData} />)

      await waitFor(() => {
        expect(screen.getByText(/Compliance Tracking/i)).toBeInTheDocument()
      })
    })

    it('should display step titles and descriptions', async () => {
      render(<ComplianceTrackingWizard />)

      await waitFor(() => {
        expect(screen.getByText(/Tax Filings/i)).toBeInTheDocument()
        expect(screen.getByText(/Federal, State & Local Taxes/i)).toBeInTheDocument()
      })
    })
  })

  // ==================== NAVIGATION TESTS ====================

  describe('Navigation', () => {
    it('should navigate to next step when clicking next button', async () => {
      const user = userEvent.setup()
      render(<ComplianceTrackingWizard />)

      await waitFor(() => {
        expect(screen.getByText(/Tax Filings/i)).toBeInTheDocument()
      })

      const nextButton = screen.getByRole('button', { name: /Next Step/i })
      await user.click(nextButton)

      await waitFor(() => {
        expect(screen.getByText(/Registrations/i)).toBeInTheDocument()
      })
    })

    it('should navigate to previous step when clicking back button', async () => {
      const user = userEvent.setup()
      render(<ComplianceTrackingWizard />)

      await waitFor(() => {
        expect(screen.getByText(/Tax Filings/i)).toBeInTheDocument()
      })

      // Go to next step first
      const nextButton = screen.getByRole('button', { name: /Next Step/i })
      await user.click(nextButton)

      await waitFor(() => {
        expect(screen.getByText(/Registrations/i)).toBeInTheDocument()
      })

      // Go back to previous step
      const backButton = screen.getByRole('button', { name: /Back/i })
      await user.click(backButton)

      await waitFor(() => {
        expect(screen.getByText(/Tax Filings/i)).toBeInTheDocument()
      })
    })

    it('should update step labels when navigating', async () => {
      const user = userEvent.setup()
      render(<ComplianceTrackingWizard />)

      await waitFor(() => {
        expect(screen.getByText(/Tax Filings/i)).toBeInTheDocument()
        expect(screen.getByText(/Federal, State & Local Taxes/i)).toBeInTheDocument()
      })

      // Navigate to second step
      const nextButton = screen.getByRole('button', { name: /Next Step/i })
      await user.click(nextButton)

      await waitFor(() => {
        expect(screen.getByText(/Registrations/i)).toBeInTheDocument()
        expect(screen.getByText(/State & Foreign Qualifications/i)).toBeInTheDocument()
      })
    })

    it('should show complete button on last step', async () => {
      const user = userEvent.setup()
      render(<ComplianceTrackingWizard />)

      await waitFor(() => {
        expect(screen.getByText(/Tax Filings/i)).toBeInTheDocument()
      })

      // Navigate through all steps to the last one
      for (let i = 0; i < 3; i++) {
        const nextButton = await screen.findByRole('button', { name: /Next Step/i })
        await user.click(nextButton)
      }

      await waitFor(() => {
        const completeButton = screen.getByRole('button', { name: /Complete/i })
        expect(completeButton).toBeInTheDocument()
      })
    })

    it('should call onCancel when clicking back on first step', async () => {
      const user = userEvent.setup()
      render(<ComplianceTrackingWizard onCancel={mockOnCancel} />)

      await waitFor(() => {
        const backButton = screen.getByRole('button', { name: /Back to Marketplace/i })
        user.click(backButton)
      })

      await waitFor(() => {
        expect(mockOnCancel).toHaveBeenCalled()
      })
    })
  })

  // ==================== SAVE FUNCTIONALITY ====================

  describe('Save Functionality', () => {
    it('should save profile when clicking save button', async () => {
      const user = userEvent.setup()
      render(<ComplianceTrackingWizard onSave={mockOnSave} />)

      await waitFor(() => {
        expect(screen.getByText(/Tax Filings/i)).toBeInTheDocument()
      })

      const saveButton = screen.getByRole('button', { name: /^Save$/i })
      await user.click(saveButton)

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalled()
      })
    })

    it('should show saving state when saving', async () => {
      const user = userEvent.setup()

      // Make save take longer to catch the loading state
      mockOnSave.mockImplementation(() => new Promise(resolve => {
        setTimeout(() => resolve(undefined), 100)
      }))

      render(<ComplianceTrackingWizard onSave={mockOnSave} />)

      await waitFor(() => {
        const saveButton = screen.getByRole('button', { name: /^Save$/i })
        user.click(saveButton)
      })

      await waitFor(() => {
        expect(screen.getByText(/Saving\.\.\./i)).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('should show saved state after successful save', async () => {
      const user = userEvent.setup()
      render(<ComplianceTrackingWizard onSave={mockOnSave} />)

      await waitFor(() => {
        const saveButton = screen.getByRole('button', { name: /^Save$/i })
        user.click(saveButton)
      })

      await waitFor(() => {
        expect(screen.getByText(/^Saved$/i)).toBeInTheDocument()
      })
    })

    it('should disable save button when no onSave prop provided', async () => {
      render(<ComplianceTrackingWizard />)

      await waitFor(() => {
        const saveButton = screen.getByRole('button', { name: /^Save$/i })
        expect(saveButton).toBeDisabled()
      })
    })

    it('should show unsaved changes indicator when data is updated', async () => {
      const user = userEvent.setup()
      render(<ComplianceTrackingWizard onSave={mockOnSave} />)

      await waitFor(() => {
        expect(screen.getByText(/Tax Filings/i)).toBeInTheDocument()
      })

      // Wait for component to mount and then update
      await waitFor(() => {
        expect(screen.getByText(/Compliance Tracking/i)).toBeInTheDocument()
      })

      // The initial state should not show "Unsaved changes"
      expect(screen.queryByText(/Unsaved changes/i)).not.toBeInTheDocument()
    })
  })

  // ==================== RESET FUNCTIONALITY ====================

  describe('Reset Functionality', () => {
    it('should show reset options in menu', async () => {
      const user = userEvent.setup()
      render(<ComplianceTrackingWizard />)

      await waitFor(() => {
        const menuButton = screen.getByRole('button', { name: /Options/i })
        user.click(menuButton)
      })

      await waitFor(() => {
        const resetMenuItem = screen.getByText(/Reset Form/i)
        expect(resetMenuItem).toBeInTheDocument()
      })
    })

    it('should reset form to defaults when clicking reset form', async () => {
      const user = userEvent.setup()
      render(<ComplianceTrackingWizard />)

      await waitFor(() => {
        const menuButton = screen.getByRole('button', { name: /Options/i })
        user.click(menuButton)
      })

      await waitFor(() => {
        const resetMenuItem = screen.getByText(/Reset Form/i)
        expect(resetMenuItem).toBeInTheDocument()
      })
    })
  })

  // ==================== DELETE FUNCTIONALITY ====================

  describe('Delete Functionality', () => {
    it('should show delete confirmation dialog', async () => {
      const user = userEvent.setup()
      render(<ComplianceTrackingWizard onReset={mockOnReset} />)

      await waitFor(() => {
        const menuButton = screen.getByRole('button', { name: /Options/i })
        user.click(menuButton)
      })

      await waitFor(() => {
        const deleteMenuItem = screen.getByText(/Delete All Data/i)
        user.click(deleteMenuItem)
      })

      await waitFor(() => {
        expect(screen.getByText(/Delete All Compliance Data\?/i)).toBeInTheDocument()
      })
    })

    it('should call onReset when confirming delete', async () => {
      const user = userEvent.setup()

      const initialData: ComplianceData = {
        id: 'test-id',
        tax_events: []
      }

      render(<ComplianceTrackingWizard initialData={initialData} onReset={mockOnReset} />)

      await waitFor(() => {
        const menuButton = screen.getByRole('button', { name: /Options/i })
        user.click(menuButton)
      })

      await waitFor(() => {
        const deleteMenuItem = screen.getByText(/Delete All Data/i)
        user.click(deleteMenuItem)
      })

      await waitFor(() => {
        const confirmButton = screen.getByRole('button', { name: /Delete All Data/i })
        user.click(confirmButton)
      })

      await waitFor(() => {
        expect(mockOnReset).toHaveBeenCalledWith('test-id')
      })
    })

    it('should cancel delete when clicking cancel', async () => {
      const user = userEvent.setup()
      render(<ComplianceTrackingWizard onReset={mockOnReset} />)

      await waitFor(() => {
        const menuButton = screen.getByRole('button', { name: /Options/i })
        user.click(menuButton)
      })

      await waitFor(() => {
        const deleteMenuItem = screen.getByText(/Delete All Data/i)
        user.click(deleteMenuItem)
      })

      await waitFor(() => {
        const cancelButton = screen.getByRole('button', { name: /Cancel/i })
        user.click(cancelButton)
      })

      await waitFor(() => {
        expect(screen.queryByText(/Delete All Compliance Data\?/i)).not.toBeInTheDocument()
      })
    })
  })

  // ==================== COMPLETE FUNCTIONALITY ====================

  describe('Complete Functionality', () => {
    it('should complete wizard and call onSave when clicking complete on last step', async () => {
      const user = userEvent.setup()
      render(<ComplianceTrackingWizard onSave={mockOnSave} onComplete={mockOnComplete} />)

      await waitFor(() => {
        expect(screen.getByText(/Tax Filings/i)).toBeInTheDocument()
      })

      // Navigate to last step
      for (let i = 0; i < 3; i++) {
        const nextButton = await screen.findByRole('button', { name: /Next Step/i })
        await user.click(nextButton)
      }

      await waitFor(() => {
        const completeButton = screen.getByRole('button', { name: /Complete/i })
        user.click(completeButton)
      })

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalled()
        expect(mockOnComplete).toHaveBeenCalled()
      })
    })

    it('should show preview mode after completion', async () => {
      const user = userEvent.setup()
      render(<ComplianceTrackingWizard onSave={mockOnSave} onComplete={mockOnComplete} />)

      await waitFor(() => {
        expect(screen.getByText(/Tax Filings/i)).toBeInTheDocument()
      })

      // Navigate to last step
      for (let i = 0; i < 3; i++) {
        const nextButton = await screen.findByRole('button', { name: /Next Step/i })
        await user.click(nextButton)
      }

      await waitFor(() => {
        const completeButton = screen.getByRole('button', { name: /Complete/i })
        user.click(completeButton)
      })

      await waitFor(() => {
        // Should be in preview mode after completion
        expect(screen.getByRole('button', { name: /Edit/i })).toBeInTheDocument()
      })
    })
  })

  // ==================== PREVIEW FUNCTIONALITY ====================

  describe('Preview Functionality', () => {
    it('should show preview mode when clicking preview button', async () => {
      const user = userEvent.setup()
      render(<ComplianceTrackingWizard />)

      await waitFor(() => {
        expect(screen.getByText(/Tax Filings/i)).toBeInTheDocument()
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
      render(<ComplianceTrackingWizard />)

      await waitFor(() => {
        const previewButton = screen.getByRole('button', { name: /Preview/i })
        user.click(previewButton)
      })

      await waitFor(() => {
        const editButton = screen.getByRole('button', { name: /Edit/i })
        user.click(editButton)
      })

      await waitFor(() => {
        // Back to edit mode, should see Tax Filings step
        expect(screen.getByText(/Tax Filings/i)).toBeInTheDocument()
      })
    })
  })
})
