import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'

const PROJECT_ID = 'ojhtdwrzolfwbiwrprok'
const SUPABASE_TOKEN = 'sbp_46c794194879b315b17234eed5b0fdba643973f1'

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
    
    // Execute each statement using the Management API
    for (const statement of statements) {
      const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_ID}/sql`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: statement
        })
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        console.error(`❌ Error executing statement:`, result)
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