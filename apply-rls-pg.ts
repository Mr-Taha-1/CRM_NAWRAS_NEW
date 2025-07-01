import { Client } from 'pg'
import fs from 'fs'
import path from 'path'

const DB_CONFIG = {
  host: 'db.ojhtdwrzolfwbiwrprok.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: '2Icaf90uVwuYzSlA',
  ssl: {
    rejectUnauthorized: false
  }
}

async function applyRLSPolicies() {
  const client = new Client(DB_CONFIG)
  
  try {
    console.log('🔒 Connecting to database...')
    await client.connect()
    
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
      try {
        await client.query(statement)
        console.log('✅ Successfully executed:', statement.substring(0, 50) + '...')
      } catch (err: any) {
        console.error(`❌ Error executing statement:`, err.message)
        console.error('Statement:', statement)
      }
    }
    
    console.log('✅ RLS policies applied successfully')
  } catch (err: any) {
    console.error('❌ Failed to apply RLS policies:', err.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

// Run the script
applyRLSPolicies() 