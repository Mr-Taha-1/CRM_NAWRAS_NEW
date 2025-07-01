import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

const PROJECT_ID = 'ojhtdwrzolfwbiwrprok'
const ACCESS_TOKEN = 'sbp_46c794194879b315b17234eed5b0fdba643973f1'

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
    
    // Execute each statement using the Dashboard API
    for (const statement of statements) {
      try {
        const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_ID}/sql/query`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: statement
          })
        })
        
        if (!response.ok) {
          const error = await response.json()
          console.error(`❌ Error executing statement:`, error)
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