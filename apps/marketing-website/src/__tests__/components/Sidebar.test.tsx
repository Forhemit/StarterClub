/**
 * Tests for Sidebar component
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'

import { Sidebar } from '@/components/dashboard/shared/Sidebar'

// Mock dependencies
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}))

vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}))

describe('Sidebar', () => {
  const mockUsePathname = vi.mocked(usePathname)
  const mockUseTheme = vi.mocked(useTheme)

  beforeEach(() => {
    vi.clearAllMocks()

    // Default mocks
    mockUsePathname.mockReturnValue('/dashboard')
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
    })
  })

  // ==================== RENDERING TESTS ====================

  describe('Rendering', () => {
    it('should render the sidebar with logo', async () => {
      render(<Sidebar />)

      await waitFor(() => {
        expect(screen.getByText(/Starter Club/i)).toBeInTheDocument()
      })
    })

    it('should render navigation links', async () => {
      render(<Sidebar />)

      await waitFor(() => {
        expect(screen.getByText(/Home/i)).toBeInTheDocument()
        expect(screen.getByText(/Role Selection/i)).toBeInTheDocument()
        expect(screen.getByText(/Super Admin/i)).toBeInTheDocument()
        expect(screen.getByText(/Onboard App/i)).toBeInTheDocument()
        expect(screen.getByText(/Kiosk/i)).toBeInTheDocument()
      })
    })

    it('should render theme toggle button', async () => {
      render(<Sidebar />)

      await waitFor(() => {
        expect(screen.getByText(/Theme: light/i)).toBeInTheDocument()
      })
    })

    it('should render logout button', async () => {
      render(<Sidebar />)

      await waitFor(() => {
        expect(screen.getByText(/Logout/i)).toBeInTheDocument()
      })
    })

    it('should render apps section header', async () => {
      render(<Sidebar />)

      await waitFor(() => {
        expect(screen.getByText(/Apps/i)).toBeInTheDocument()
      })
    })
  })

  // ==================== COLLAPSE FUNCTIONALITY ====================

  describe('Collapse Functionality', () => {
    it('should collapse sidebar when clicking collapse button', async () => {
      const user = userEvent.setup()
      render(<Sidebar />)

      await waitFor(() => {
        expect(screen.getByText(/Starter Club/i)).toBeInTheDocument()
      })

      // Click the X button in the header to collapse
      const buttons = screen.getAllByRole('button')
      const collapseButton = buttons.find(btn => btn.querySelector('.lucide-x'))
      await user.click(collapseButton!)

      // After collapse, title should be hidden but collapse button still visible
      await waitFor(() => {
        expect(screen.queryByText(/Starter Club/i)).not.toBeInTheDocument()
      })
    })

    it('should expand sidebar when clicking expand button in collapsed state', async () => {
      const user = userEvent.setup()
      render(<Sidebar />)

      await waitFor(() => {
        // First collapse
        const buttons = screen.getAllByRole('button')
        const collapseButton = buttons.find(btn => btn.querySelector('.lucide-x'))
        user.click(collapseButton!)
      })

      await waitFor(() => {
        // Then expand - look for Menu icon button
        const buttons = screen.getAllByRole('button')
        const expandButton = buttons.find(btn => btn.querySelector('.lucide-menu'))
        user.click(expandButton!)
      })

      await waitFor(() => {
        expect(screen.getByText(/Starter Club/i)).toBeInTheDocument()
      })
    })

    it('should show tooltips on collapsed state', async () => {
      const user = userEvent.setup()
      render(<Sidebar />)

      await waitFor(() => {
        // Collapse the sidebar
        const buttons = screen.getAllByRole('button')
        const collapseButton = buttons.find(btn => btn.querySelector('.lucide-x'))
        user.click(collapseButton!)
      })

      // Home text should still be present (in tooltip)
      await waitFor(() => {
        const homeText = screen.queryByText(/Home/i)
        expect(homeText).toBeInTheDocument()
      })
    })
  })

  // ==================== ACTIVE STATE TESTS ====================

  describe('Active State', () => {
    it('should highlight active navigation item', async () => {
      mockUsePathname.mockReturnValue('/')

      render(<Sidebar />)

      await waitFor(() => {
        const homeLink = screen.getByText(/Home/i).closest('a')
        expect(homeLink?.className).toMatch(/bg-blue-50|text-blue-600/i)
      })
    })

    it('should highlight role selection when on role selection page', async () => {
      mockUsePathname.mockReturnValue('/employee-portal/selection')

      render(<Sidebar />)

      await waitFor(() => {
        const roleSelectionLink = screen.getByText(/Role Selection/i).closest('a')
        expect(roleSelectionLink?.className).toMatch(/bg-blue-50|text-blue-600/i)
      })
    })

    it('should not highlight external app links as active', async () => {
      mockUsePathname.mockReturnValue('/dashboard')

      render(<Sidebar />)

      await waitFor(() => {
        // External app links should not be highlighted
        const superAdminLink = screen.getByText(/Super Admin/i).closest('a')
        expect(superAdminLink?.className).not.toMatch(/bg-blue-50/i)
        expect(superAdminLink?.className).not.toMatch(/text-blue-600/i)
      })
    })
  })

  // ==================== THEME TOGGLE TESTS ====================

  describe('Theme Toggle', () => {
    it('should toggle theme from light to dark', async () => {
      const mockSetTheme = vi.fn()
      mockUseTheme.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
      })

      const user = userEvent.setup()
      render(<Sidebar />)

      await waitFor(() => {
        const themeButton = screen.getByText(/Theme: light/i).closest('button')
        user.click(themeButton!)
      })

      await waitFor(() => {
        expect(mockSetTheme).toHaveBeenCalledWith('dark')
      })
    })

    it('should toggle theme from dark to racetrack', async () => {
      const mockSetTheme = vi.fn()
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        setTheme: mockSetTheme,
      })

      const user = userEvent.setup()
      render(<Sidebar />)

      await waitFor(() => {
        const themeButton = screen.getByText(/Theme: dark/i).closest('button')
        user.click(themeButton!)
      })

      await waitFor(() => {
        expect(mockSetTheme).toHaveBeenCalledWith('racetrack')
      })
    })

    it('should toggle theme from racetrack to light', async () => {
      const mockSetTheme = vi.fn()
      mockUseTheme.mockReturnValue({
        theme: 'racetrack',
        setTheme: mockSetTheme,
      })

      const user = userEvent.setup()
      render(<Sidebar />)

      await waitFor(() => {
        const themeButton = screen.getByText(/Theme: racetrack/i).closest('button')
        user.click(themeButton!)
      })

      await waitFor(() => {
        expect(mockSetTheme).toHaveBeenCalledWith('light')
      })
    })

    it('should display sun icon for light theme', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'light',
        setTheme: vi.fn(),
      })

      render(<Sidebar />)

      await waitFor(() => {
        const themeButton = screen.getByText(/Theme: light/i).closest('button')
        expect(themeButton).toBeInTheDocument()
        expect(themeButton?.querySelector('.lucide-sun')).toBeInTheDocument()
      })
    })
  })

  // ==================== EXTERNAL LINKS TESTS ====================

  describe('External Links', () => {
    it('should render external app links with correct hrefs', async () => {
      render(<Sidebar />)

      await waitFor(() => {
        const superAdminLink = screen.getByText(/Super Admin/i).closest('a')
        expect(superAdminLink).toHaveAttribute('href', 'http://localhost:3001')

        const onboardAppLink = screen.getByText(/Onboard App/i).closest('a')
        expect(onboardAppLink).toHaveAttribute('href', 'http://localhost:3002')

        const kioskLink = screen.getByText(/Kiosk/i).closest('a')
        expect(kioskLink).toHaveAttribute('href', 'http://localhost:3003')
      })
    })

    it('should open external links in new tab', async () => {
      render(<Sidebar />)

      await waitFor(() => {
        const superAdminLink = screen.getByText(/Super Admin/i).closest('a')
        expect(superAdminLink).toHaveAttribute('target', '_blank')
      })
    })
  })

  // ==================== NAVIGATION TESTS ====================

  describe('Navigation', () => {
    it('should render home link with correct href', async () => {
      render(<Sidebar />)

      await waitFor(() => {
        const homeLink = screen.getByText(/Home/i).closest('a')
        expect(homeLink).toHaveAttribute('href', '/')
      })
    })

    it('should render role selection link with correct href', async () => {
      render(<Sidebar />)

      await waitFor(() => {
        const roleSelectionLink = screen.getByText(/Role Selection/i).closest('a')
        expect(roleSelectionLink).toHaveAttribute('href', '/employee-portal/selection')
      })
    })

    it('should render logout link with correct href', async () => {
      render(<Sidebar />)

      await waitFor(() => {
        const logoutLink = screen.getByText(/Logout/i).closest('a')
        expect(logoutLink).toHaveAttribute('href', '/')
      })
    })
  })
})
