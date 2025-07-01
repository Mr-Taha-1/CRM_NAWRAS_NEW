import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing required Supabase environment variables:\n" +
    "- NEXT_PUBLIC_SUPABASE_URL\n" +
    "- SUPABASE_SERVICE_ROLE_KEY\n"
  )
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function applyRLSPolicies() {
  try {
    console.log('🔒 Applying RLS policies...')
    
    // Read the SQL file
    const sqlPath = path.join(process.cwd(), 'rls-fix.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')
    
    // Split into individual statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0)
    
    // Execute each statement
    for (const statement of statements) {
      const { error } = await supabase.rpc('exec_sql', {
        sql: statement
      })
      
      if (error) {
        console.error(`❌ Error executing statement: ${error.message}`)
        console.error('Statement:', statement)
      } else {
        console.log('✅ Successfully executed:', statement.substring(0, 50) + '...')
      }
    }
    
    console.log('✅ RLS policies applied successfully')
  } catch (error) {
    console.error('❌ Failed to apply RLS policies:', error)
    process.exit(1)
  }
}

// Run the script
applyRLSPolicies() 