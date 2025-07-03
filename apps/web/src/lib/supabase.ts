import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { ContactSource, CustomerStatus } from '@/app/types/customer'

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing required Supabase environment variables:\n" +
    "- NEXT_PUBLIC_SUPABASE_URL\n" +
    "- NEXT_PUBLIC_SUPABASE_ANON_KEY\n\n" +
    "Please set these in your .env.local file."
  )
}

// Create Supabase client with configuration
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-application-name': 'nawras-crm'
    }
  }
})

// Export createClient function
export const createClient = () => {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'x-application-name': 'nawras-crm'
      }
    }
  })
}

// Export type definitions
export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          user_id: string
          company: string
          contact_person: string
          email: string
          phone?: string | null
          country: string
          city: string
          source: ContactSource
          status: CustomerStatus
          notes?: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['customers']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['customers']['Row']>
      }
    }
  }
} 