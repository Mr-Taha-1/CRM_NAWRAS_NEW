"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { AuthError } from "@supabase/supabase-js"

type User = {
  id: string
  email: string
  full_name?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ error: new Error("Not implemented") as AuthError }),
  signUp: async () => ({ error: new Error("Not implemented") as AuthError }),
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("🔍 [AUTH DEBUG] Initial session check:", {
        hasSession: !!session,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        userMetadata: session?.user?.user_metadata,
        sessionExpiry: session?.expires_at
      })

      if (session) {
        const userData = {
          id: session.user.id,
          email: session.user.email!,
          full_name: session.user.user_metadata.full_name,
        }
        console.log("✅ [AUTH DEBUG] Setting user data:", userData)
        setUser(userData)
      } else {
        console.log("❌ [AUTH DEBUG] No session found")
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔄 [AUTH DEBUG] Auth state change:", {
        event,
        hasSession: !!session,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        timestamp: new Date().toISOString()
      })

      if (session) {
        const userData = {
          id: session.user.id,
          email: session.user.email!,
          full_name: session.user.user_metadata.full_name,
        }
        console.log("✅ [AUTH DEBUG] Auth change - setting user:", userData)
        setUser(userData)
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

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 