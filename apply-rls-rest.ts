import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = 'https://ojhtdwrzolfwbiwrprok.supabase.co'
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qaHRkd3J6b2xmd2Jpd3Jwcm9rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMzc3NDU3MCwiZXhwIjoyMDE5MzUwNTcwfQ.BmbnY1SWB-xC4qBPyqq9nJZM_0Ck_P_gKVzJvGqQXYE'

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
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
    
    // Execute each statement using the REST API
    for (const statement of statements) {
      try {
        const { data, error } = await supabase.rpc('exec_sql', {
          sql: statement
        })
        
        if (error) {
          console.error(`❌ Error executing statement:`, error.message)
          console.error('Statement:', statement)
        } else {
          console.log('✅ Successfully executed:', statement.substring(0, 50) + '...')
        }
      } catch (err: any) {
        console.error(`❌ Error executing statement:`, err.message)
        console.error('Statement:', statement)
      }
    }
    
    console.log('✅ RLS policies applied successfully')
  } catch (err: any) {
    console.error('❌ Failed to apply RLS policies:', err.message)
    process.exit(1)
  }
}

// Run the script
applyRLSPolicies() 