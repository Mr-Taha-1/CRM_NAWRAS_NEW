"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { AuthError, User as SupabaseUser } from "@supabase/supabase-js"

// Extended user type with role information
interface UserWithRole extends SupabaseUser {
  role?: string
  full_name?: string
  department?: string
}

type AuthContextType = {
  user: UserWithRole | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
  isAdmin: () => boolean
  hasRole: (role: string) => boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ error: new Error("Not implemented") as AuthError }),
  signUp: async () => ({ error: new Error("Not implemented") as AuthError }),
  signOut: async () => {},
  refreshSession: async () => {},
  isAdmin: () => false,
  hasRole: () => false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserWithRole | null>(null)
  const [loading, setLoading] = useState(true)

  // Function to fetch user role from users table
  const fetchUserRole = async (userId: string): Promise<{ role?: string; full_name?: string; department?: string } | null> => {
    try {
      const { data: userProfile, error } = await supabase
        .from('users')
        .select('role, full_name, department')
        .eq('id', userId)
        .single()

      if (error) {
        console.warn('Could not fetch user role:', error.message)
        return null
      }

      return userProfile
    } catch (error) {
      console.warn('Error fetching user role:', error)
      return null
    }
  }

  // Function to enhance user with role information
  const enhanceUserWithRole = async (authUser: SupabaseUser): Promise<UserWithRole> => {
    const userProfile = await fetchUserRole(authUser.id)

    return {
      ...authUser,
      role: userProfile?.role || 'user',
      full_name: userProfile?.full_name || authUser.user_metadata?.full_name,
      department: userProfile?.department
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
          setLoading(false)
          return
        }

        if (session?.user) {
          console.log("🔍 [AUTH DEBUG] Initial session found:", session.user.email)
          // Enhance user with role information
          const enhancedUser = await enhanceUserWithRole(session.user)
          setUser(enhancedUser)
        } else {
          console.log("❌ [AUTH DEBUG] No session found")
        }
        setLoading(false)
      } catch (error) {
        console.error("Error in getInitialSession:", error)
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔄 [AUTH DEBUG] Auth state change:", {
        event,
        hasSession: !!session,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        timestamp: new Date().toISOString()
      })

      if (session?.user) {
        // Enhance user with role information
        const enhancedUser = await enhanceUserWithRole(session.user)
        console.log("✅ [AUTH DEBUG] Auth change - setting enhanced user:", {
          email: enhancedUser.email,
          role: enhancedUser.role
        })
        setUser(enhancedUser)
      } else {
        console.log("❌ [AUTH DEBUG] Auth change - clearing user")
        setUser(null)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      })
      
      if (error) {
        console.error("Sign in error:", error.message)
      } else if (data?.user) {
        console.log("Signed in successfully:", data.user.email)
      }
      
      return { error }
    } catch (error) {
      console.error("Unexpected sign in error:", error)
      return { error: error as AuthError }
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })
      
      if (error) {
        console.error("Sign up error:", error.message)
      } else if (data?.user) {
        console.log("Signed up successfully:", data.user.email)
      }
      
      return { error }
    } catch (error) {
      console.error("Unexpected sign up error:", error)
      return { error: error as AuthError }
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Sign out error:", error.message)
    }
  }

  const refreshSession = async () => {
    try {
      const { error } = await supabase.auth.refreshSession()
      if (error) {
        console.error("Error refreshing session:", error)
      }
    } catch (error) {
      console.error("Error in refreshSession:", error)
    }
  }

  // Role checking functions
  const isAdmin = (): boolean => {
    return user?.role === 'admin'
  }

  const hasRole = (role: string): boolean => {
    return user?.role === role
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    refreshSession,
    isAdmin,
    hasRole,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}