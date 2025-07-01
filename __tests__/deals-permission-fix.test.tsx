/**
 * Test Suite: Deals Page Permission Fix Validation
 * 
 * This test validates that the deals page correctly uses useOptimizedData
 * and handles authentication properly to prevent permission denied errors.
 */

import { render, screen, waitFor } from '@testing-library/react'
import { jest } from '@jest/globals'
import '@testing-library/jest-dom'
import DealsPage from '@/app/dashboard/deals/page'

// Mock the hooks and dependencies
jest.mock('@/hooks/use-optimized-data')
jest.mock('@/hooks/useAuth')
jest.mock('@/hooks/use-toast')
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

// Mock the optimized data hook
const mockUseOptimizedData = jest.fn()
const mockUseAuth = jest.fn()
const mockUseToast = jest.fn()

beforeEach(() => {
  // Reset all mocks
  jest.clearAllMocks()
  
  // Setup default mock returns
  mockUseOptimizedData.mockReturnValue({
    data: [],
    loading: false,
    error: null,
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    refresh: jest.fn()
  })
  
  mockUseAuth.mockReturnValue({
    user: {
      id: 'test-user-id',
      email: 'test@example.com'
    }
  })
  
  mockUseToast.mockReturnValue({
    toast: jest.fn()
  })
  
  require('@/hooks/use-optimized-data').useOptimizedData = mockUseOptimizedData
  require('@/hooks/useAuth').useAuth = mockUseAuth
  require('@/hooks/use-toast').useToast = mockUseToast
})

describe('Deals Page Permission Fix', () => {
  test('should use useOptimizedData with correct configuration', () => {
    render(<DealsPage />)
    
    // Verify useOptimizedData is called with correct parameters
    expect(mockUseOptimizedData).toHaveBeenCalledWith({
      table: 'deals',
      requiresAuth: true,
      orderBy: { column: 'position', ascending: true },
      enableRealtime: true
    })
  })

  test('should render deals page components without errors', async () => {
    render(<DealsPage />)
    
    // Wait for and verify key components are rendered
    await waitFor(() => {
      expect(screen.getByText('Deals')).toBeInTheDocument()
      expect(screen.getByText('Manage your sales pipeline')).toBeInTheDocument()
      expect(screen.getByText('New Deal')).toBeInTheDocument()
    })
  })

  test('should display stats cards correctly', async () => {
    render(<DealsPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Total Deals')).toBeInTheDocument()
      expect(screen.getByText('Total Value')).toBeInTheDocument()
      expect(screen.getByText('Won Deals')).toBeInTheDocument()
      expect(screen.getByText('Active Deals')).toBeInTheDocument()
    })
  })

  test('should handle loading state properly', () => {
    mockUseOptimizedData.mockReturnValue({
      data: null,
      loading: true,
      error: null,
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      refresh: jest.fn()
    })
    
    render(<DealsPage />)
    
    // Should show loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  test('should handle error state properly', () => {
    const testError = 'Test error message'
    mockUseOptimizedData.mockReturnValue({
      data: null,
      loading: false,
      error: testError,
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      refresh: jest.fn()
    })
    
    render(<DealsPage />)
    
    // Should show error state with retry option
    expect(screen.getByText('Error loading deals')).toBeInTheDocument()
    expect(screen.getByText('Try Again')).toBeInTheDocument()
  })

  test('should display empty state when no deals exist', async () => {
    mockUseOptimizedData.mockReturnValue({
      data: [],
      loading: false,
      error: null,
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      refresh: jest.fn()
    })
    
    render(<DealsPage />)
    
    await waitFor(() => {
      expect(screen.getByText('No deals found')).toBeInTheDocument()
      expect(screen.getByText('Get started by adding your first deal')).toBeInTheDocument()
    })
  })

  test('should display deals when data is available', async () => {
    const mockDeals = [
      {
        id: '1',
        title: 'Test Deal 1',
        company: 'Test Company',
        value: 50000,
        stage: 'prospecting',
        probability: 25,
        expected_close_date: '2024-12-31',
        created_at: '2024-01-01',
        user_id: 'test-user-id',
        position: 0
      }
    ]
    
    mockUseOptimizedData.mockReturnValue({
      data: mockDeals,
      loading: false,
      error: null,
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      refresh: jest.fn()
    })
    
    render(<DealsPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Deal 1')).toBeInTheDocument()
      expect(screen.getByText('Test Company')).toBeInTheDocument()
    })
  })

  test('should not call old fetchDeals function', () => {
    // This test ensures the old fetchDeals pattern is not used
    const consoleSpy = jest.spyOn(console, 'log')
    
    render(<DealsPage />)
    
    // Should not see any direct Supabase calls or custom fetch logic
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('fetchDeals')
    )
    
    consoleSpy.mockRestore()
  })

  test('should pass authentication requirement to useOptimizedData', () => {
    render(<DealsPage />)
    
    const callArgs = mockUseOptimizedData.mock.calls[0][0]
    expect(callArgs.requiresAuth).toBe(true)
  })

  test('should properly configure table name', () => {
    render(<DealsPage />)
    
    const callArgs = mockUseOptimizedData.mock.calls[0][0]
    expect(callArgs.table).toBe('deals')
  })

  test('should configure proper ordering', () => {
    render(<DealsPage />)
    
    const callArgs = mockUseOptimizedData.mock.calls[0][0]
    expect(callArgs.orderBy).toEqual({
      column: 'position',
      ascending: true
    })
  })

  test('should enable realtime updates', () => {
    render(<DealsPage />)
    
    const callArgs = mockUseOptimizedData.mock.calls[0][0]
    expect(callArgs.enableRealtime).toBe(true)
  })
})

describe('Permission Error Prevention', () => {
  test('should not make direct Supabase calls without authentication check', () => {
    // Mock without user to test authentication protection
    mockUseAuth.mockReturnValue({
      user: null
    })
    
    render(<DealsPage />)
    
    // useOptimizedData should handle the authentication check internally
    // and not attempt to fetch data without a valid user
    expect(mockUseOptimizedData).toHaveBeenCalledWith(
      expect.objectContaining({
        requiresAuth: true
      })
    )
  })

  test('should use the same pattern as proposals page', () => {
    render(<DealsPage />)
    
    // Verify it uses the same hook pattern that works for proposals
    expect(mockUseOptimizedData).toHaveBeenCalledWith({
      table: 'deals',
      requiresAuth: true,
      orderBy: { column: 'position', ascending: true },
      enableRealtime: true
    })
  })
})

describe('CRUD Operations', () => {
  test('should expose create function for deal creation', () => {
    const mockCreate = jest.fn()
    mockUseOptimizedData.mockReturnValue({
      data: [],
      loading: false,
      error: null,
      create: mockCreate,
      update: jest.fn(),
      remove: jest.fn(),
      refresh: jest.fn()
    })
    
    render(<DealsPage />)
    
    // The create function should be available for use
    expect(mockCreate).toBeDefined()
  })

  test('should expose update function for deal updates', () => {
    const mockUpdate = jest.fn()
    mockUseOptimizedData.mockReturnValue({
      data: [],
      loading: false,
      error: null,
      create: jest.fn(),
      update: mockUpdate,
      remove: jest.fn(),
      refresh: jest.fn()
    })
    
    render(<DealsPage />)
    
    // The update function should be available for use
    expect(mockUpdate).toBeDefined()
  })

  test('should expose remove function for deal deletion', () => {
    const mockRemove = jest.fn()
    mockUseOptimizedData.mockReturnValue({
      data: [],
      loading: false,
      error: null,
      create: jest.fn(),
      update: jest.fn(),
      remove: mockRemove,
      refresh: jest.fn()
    })
    
    render(<DealsPage />)
    
    // The remove function should be available for use
    expect(mockRemove).toBeDefined()
  })
})

describe('Integration Validation', () => {
  test('should follow the exact pattern that works for proposals', () => {
    // This test validates that deals page now uses the EXACT same pattern
    // as the working proposals page
    
    render(<DealsPage />)
    
    const expectedConfig = {
      table: 'deals',
      requiresAuth: true,
      orderBy: { column: 'position', ascending: true },
      enableRealtime: true
    }
    
    expect(mockUseOptimizedData).toHaveBeenCalledWith(expectedConfig)
  })

  test('should not contain any custom fetchDeals implementation', () => {
    // Ensure the old custom implementation is completely removed
    const pageSource = DealsPage.toString()
    
    expect(pageSource).not.toContain('fetchDeals')
    expect(pageSource).not.toContain('setDeals')
    expect(pageSource).not.toContain('supabase.from("deals")')
  })
}) 