"use client"

import React from "react"
import { useAuth } from "@/components/auth-provider"

/**
 * Hook for role-based access control
 * Provides utilities for checking user roles and permissions
 * Updated: Force cache-busting deployment for admin page fixes
 */
export function useRole() {
  const { user, isAdmin, hasRole } = useAuth()

  return {
    // User role information
    user,
    role: user?.role || 'user',
    isAuthenticated: !!user,
    
    // Role checking functions
    isAdmin,
    hasRole,
    
    // Specific role checks
    isManager: () => hasRole('manager'),
    isUser: () => hasRole('user'),
    
    // Permission checks
    canViewAllData: () => isAdmin(),
    canManageUsers: () => isAdmin(),
    canEditAllRecords: () => isAdmin() || hasRole('manager'),
    canDeleteRecords: () => isAdmin(),
    canAccessAdminFeatures: () => isAdmin(),
    canViewReports: () => isAdmin() || hasRole('manager'),
    
    // Data access permissions
    canViewCustomers: () => true, // All authenticated users can view their customers
    canCreateCustomers: () => true, // All authenticated users can create customers
    canEditCustomers: (customerId?: string, customerUserId?: string) => {
      if (isAdmin()) return true
      if (!customerId || !customerUserId) return true // For new records
      return user?.id === customerUserId // Users can only edit their own
    },
    canDeleteCustomers: (customerUserId?: string) => {
      if (isAdmin()) return true
      return user?.id === customerUserId // Users can only delete their own
    },
    
    canViewDeals: () => true,
    canCreateDeals: () => true,
    canEditDeals: (dealId?: string, dealUserId?: string) => {
      if (isAdmin()) return true
      if (!dealId || !dealUserId) return true
      return user?.id === dealUserId
    },
    canDeleteDeals: (dealUserId?: string) => {
      if (isAdmin()) return true
      return user?.id === dealUserId
    },
    
    canViewProposals: () => true,
    canCreateProposals: () => true,
    canEditProposals: (proposalId?: string, proposalUserId?: string) => {
      if (isAdmin()) return true
      if (!proposalId || !proposalUserId) return true
      return user?.id === proposalUserId
    },
    canDeleteProposals: (proposalUserId?: string) => {
      if (isAdmin()) return true
      return user?.id === proposalUserId
    },
  }
}

/**
 * Hook for checking specific permissions
 * Provides a simple way to check if user has specific permissions
 */
export function usePermissions() {
  const { isAdmin, hasRole, user } = useAuth()

  const checkPermission = (permission: string, context?: any): boolean => {
    switch (permission) {
      case 'admin':
        return isAdmin()
      
      case 'manager':
        return isAdmin() || hasRole('manager')
      
      case 'view_all_data':
        return isAdmin()
      
      case 'manage_users':
        return isAdmin()
      
      case 'edit_all_records':
        return isAdmin() || hasRole('manager')
      
      case 'delete_records':
        return isAdmin()
      
      case 'view_reports':
        return isAdmin() || hasRole('manager')
      
      case 'edit_own_data':
        if (!context?.userId) return true // For new records
        return isAdmin() || user?.id === context.userId
      
      case 'delete_own_data':
        if (!context?.userId) return false
        return isAdmin() || user?.id === context.userId
      
      default:
        return false
    }
  }

  return {
    checkPermission,
    hasPermission: checkPermission, // Alias for convenience
  }
}

/**
 * Component wrapper for role-based rendering
 */
export const RoleGuard = ({
  roles,
  fallback = null,
  children
}: {
  roles: string | string[]
  fallback?: React.ReactNode
  children: React.ReactNode
}) => {
  const { isAdmin, hasRole, user } = useAuth()
  const allowedRoles = Array.isArray(roles) ? roles : [roles]
  const hasRequiredRole = allowedRoles.some(role => {
    if (role === 'admin') return isAdmin()
    if (role === 'any') return !!user
    return hasRole(role)
  })

  return hasRequiredRole ? <>{children}</> : <>{fallback}</>
}

/**
 * Component wrapper for admin-only content
 */
export const AdminOnly = ({
  fallback = null,
  children
}: {
  fallback?: React.ReactNode
  children: React.ReactNode
}) => {
  const { isAdmin } = useAuth()
  return isAdmin() ? <>{children}</> : <>{fallback}</>
}

/**
 * Component wrapper for authenticated users only
 */
export const AuthenticatedOnly = ({
  fallback = null,
  children
}: {
  fallback?: React.ReactNode
  children: React.ReactNode
}) => {
  const { user } = useAuth()
  return user ? <>{children}</> : <>{fallback}</>
}

/**
 * Hook for role-based UI utilities
 */
export function useRoleBasedUI() {
  const { isAdmin, hasRole, user } = useAuth()

  return {
    // Utility functions
    shouldShow: (roles: string | string[]) => {
      const allowedRoles = Array.isArray(roles) ? roles : [roles]
      return allowedRoles.some(role => {
        if (role === 'admin') return isAdmin()
        if (role === 'any') return !!user
        return hasRole(role)
      })
    },

    shouldHide: (roles: string | string[]) => {
      const allowedRoles = Array.isArray(roles) ? roles : [roles]
      return !allowedRoles.some(role => {
        if (role === 'admin') return isAdmin()
        if (role === 'any') return !!user
        return hasRole(role)
      })
    }
  }
}
