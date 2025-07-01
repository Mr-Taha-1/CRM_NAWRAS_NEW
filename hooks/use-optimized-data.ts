"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { createClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

// Check if demo mode is enabled (only in development)
const isDemoModeEnabled = () => {
  if (typeof window === 'undefined') return false
  const isProduction = process.env.NODE_ENV === 'production'
  const demoModeDisabled = process.env.ENABLE_DEMO_MODE === 'false'
  
  // Demo mode only available in development and when not explicitly disabled
  return !isProduction && !demoModeDisabled
}

// Demo data generator for development/testing only
function getDemoData(table: string) {
  // Only return demo data if demo mode is enabled
  if (!isDemoModeEnabled()) {
    return []
  }

  const currentDate = new Date().toISOString()
  
  switch (table) {
    case "customers":
      return [
        {
          id: "1",
          contact_person: "John Smith",
          email: "john.smith@acme.com",
          phone: "+962-6-1234567",
          company: "Acme Corporation",
          address: "123 Business Street",
          country: "Jordan",
          city: "Amman",
          status: "Active",
          created_at: currentDate,
          user_id: "00000000-0000-4000-8000-000000000001",
        },
        {
          id: "2", 
          contact_person: "Sarah Johnson",
          email: "sarah.j@techsolutions.com",
          phone: "+962-6-7654321",
          company: "Tech Solutions Inc",
          address: "456 Innovation Ave",
          country: "Jordan",
          city: "Irbid",
          status: "Active",
          created_at: currentDate,
          user_id: "00000000-0000-4000-8000-000000000001",
        },
      ]
    default:
      return []
  }
}

interface UseOptimizedDataOptions {
  table: string
  select?: string
  orderBy?: { column: string; ascending?: boolean }
  filters?: Record<string, any>
  realtime?: boolean
  requiresAuth?: boolean
}

export function useOptimizedData<T = any>({
  table,
  select = "*",
  orderBy,
  filters = {},
  realtime = false,
  requiresAuth = true,
}: UseOptimizedDataOptions) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const supabase = createClient()
  const { user } = useAuth()

  // Memoize the query to prevent unnecessary re-renders
  const queryKey = useMemo(() => {
    return JSON.stringify({ table, select, orderBy, filters })
  }, [table, select, orderBy, filters])

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      console.log(`🔍 [DATA DEBUG] Fetching data from ${table}:`, {
        userId: user?.id,
        userEmail: user?.email,
        requiresAuth,
        hasUser: !!user,
        select,
        filters
      })

      // PRODUCTION: Only use demo data in development mode when explicitly enabled
      if (isDemoModeEnabled()) {
        // Check for demo session only in development
        const demoSession = typeof window !== 'undefined' ? localStorage.getItem("demo-session") : null
        if (demoSession || (user && user.email === "demo@nawrascrm.com")) {
          console.log(`🎯 Using demo data for ${table} (development mode)`)
          const mockData = getDemoData(table)
          setData(mockData as T[])
          setLoading(false)
          return
        }
      }

      // For production: require authentication and use real database
      if (requiresAuth && !user) {
        console.log(`❌ [DATA DEBUG] No user found for ${table}, requiresAuth=${requiresAuth}`)
        setData([])
        setLoading(false)
        return
      }

      console.log(`🔍 [DATA DEBUG] Querying Supabase for ${table}`)
      let query = supabase.from(table).select(select)

      // CRITICAL FIX: Add user filtering for authenticated requests
      if (user && requiresAuth) {
        console.log(`🔒 [DATA DEBUG] Adding user filter: user_id = ${user.id}`)
        query = query.eq("user_id", user.id)
      }

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value)
        }
      })

      // Apply ordering
      if (orderBy) {
        query = query.order(orderBy.column, {
          ascending: orderBy.ascending ?? true,
        })
      }

      const { data: result, error: queryError } = await query

      if (queryError) {
        throw queryError
      }

      setData(result as T[])
      setError(null)
    } catch (err: any) {
      console.error(`Error fetching ${table}:`, err)
      setError(err.message)
      toast({
        title: `Error fetching ${table}`,
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [queryKey, user, supabase, toast])

  const create = async (data: Partial<T>, table: string) => {
    try {
      if (requiresAuth && !user) {
        throw new Error("Authentication required")
      }

      // CRITICAL FIX: Handle field mapping for customers table
      let recordData = { ...data, user_id: user?.id }

      if (table === 'customers') {
        console.log("🔍 [HOOK DEBUG] Original customer data:", data)

        // Map contact_person to name field for database compatibility
        if ((data as any).contact_person && !(data as any).name) {
          recordData = {
            ...recordData,
            name: (data as any).contact_person,  // Required field for database
            contact_person: (data as any).contact_person  // Keep for compatibility
          }
        }

        console.log("🔍 [HOOK DEBUG] Mapped customer data:", recordData)
      }

      const { data: result, error } = await supabase
        .from(table)
        .insert([recordData])
        .select()
        .single()

      if (error) throw error

      // Optimistically update the local data
      setData(prev => [...prev, result as T])

      return result
    } catch (err: any) {
      console.error(`Error creating record in ${table}:`, err)
      toast({
        title: `Error creating record`,
        description: err.message,
        variant: "destructive",
      })
      return null
    }
  }

  const update = async (id: string, data: Partial<T>, table: string) => {
    try {
      if (requiresAuth && !user) {
        throw new Error("Authentication required")
      }

      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Optimistically update the local data
      setData(prev => prev.map(item => {
        if ((item as any).id === id) {
          return { ...item, ...result }
        }
        return item
      }))

      return result
    } catch (err: any) {
      console.error(`Error updating record in ${table}:`, err)
      toast({
        title: `Error updating record`,
        description: err.message,
        variant: "destructive",
      })
      return null
    }
  }

  const remove = async (id: string, table: string) => {
    try {
      if (requiresAuth && !user) {
        throw new Error("Authentication required")
      }

      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)

      if (error) throw error

      // Optimistically update the local data
      setData(prev => prev.filter(item => (item as any).id !== id))

      return true
    } catch (err: any) {
      console.error(`Error deleting record from ${table}:`, err)
      toast({
        title: `Error deleting record`,
        description: err.message,
        variant: "destructive",
      })
      return false
    }
  }

  useEffect(() => {
    fetchData()

    if (realtime && user) {
      console.log(`🔄 [REALTIME DEBUG] Setting up realtime subscription for ${table}:`, {
        userId: user.id,
        userEmail: user.email,
        requiresAuth
      })

      let realtimeChannel: any = null
      let fallbackInterval: NodeJS.Timeout | null = null
      let realtimeWorking = false

      // Try to set up realtime subscription
      try {
        realtimeChannel = supabase
          .channel(`table_db_changes_${table}_${user.id}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: table,
              // CRITICAL FIX: Add user filter to realtime subscription
              filter: requiresAuth ? `user_id=eq.${user.id}` : undefined,
            },
            (payload: RealtimePostgresChangesPayload<any>) => {
              console.log(`🔄 [REALTIME DEBUG] Change received for ${table}:`, {
                event: payload.eventType,
                userId: user.id,
                recordUserId: payload.new?.user_id || payload.old?.user_id,
                payload
              })
              realtimeWorking = true
              fetchData()
            }
          )
          .subscribe((status) => {
            console.log(`🔄 [REALTIME DEBUG] Subscription status for ${table}:`, status)

            if (status === 'SUBSCRIBED') {
              realtimeWorking = true
              console.log(`✅ [REALTIME DEBUG] Realtime working for ${table}`)
              // Clear fallback if realtime starts working
              if (fallbackInterval) {
                clearInterval(fallbackInterval)
                fallbackInterval = null
              }
            } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
              console.log(`❌ [REALTIME DEBUG] Realtime failed for ${table}, starting fallback polling`)
              realtimeWorking = false

              // Start fallback polling every 30 seconds
              if (!fallbackInterval) {
                fallbackInterval = setInterval(() => {
                  if (!realtimeWorking) {
                    console.log(`🔄 [FALLBACK DEBUG] Polling ${table} data (realtime unavailable)`)
                    fetchData()
                  }
                }, 30000) // Poll every 30 seconds
              }
            }
          })
      } catch (error) {
        console.error(`❌ [REALTIME DEBUG] Failed to setup realtime for ${table}:`, error)
        realtimeWorking = false
      }

      // Start fallback polling after 5 seconds if realtime hasn't connected
      const fallbackTimeout = setTimeout(() => {
        if (!realtimeWorking) {
          console.log(`⚠️ [FALLBACK DEBUG] Realtime not working for ${table}, starting fallback polling`)
          fallbackInterval = setInterval(() => {
            console.log(`🔄 [FALLBACK DEBUG] Polling ${table} data (realtime unavailable)`)
            fetchData()
          }, 30000) // Poll every 30 seconds
        }
      }, 5000)

      return () => {
        console.log(`🔄 [REALTIME DEBUG] Cleaning up realtime subscription for ${table}`)
        if (realtimeChannel) {
          supabase.removeChannel(realtimeChannel)
        }
        if (fallbackInterval) {
          clearInterval(fallbackInterval)
        }
        clearTimeout(fallbackTimeout)
      }
    }
  }, [fetchData, realtime, supabase, table, user, requiresAuth])

  return {
    data,
    loading,
    error,
    create,
    update,
    remove,
    refresh: fetchData,
  }
} 