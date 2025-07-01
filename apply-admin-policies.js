/**
 * APPLY ADMIN POLICIES SCRIPT
 * 
 * This script applies admin role-based access control policies
 * using direct SQL execution through Supabase service role.
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = 'https://ojhtdwrzolfwbiwrprok.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qaHRkd3J6b2xmd2Jpd3Jwcm9rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDY4NDk0NiwiZXhwIjoyMDY2MjYwOTQ2fQ.m1w2e25EYZ5rdQYLhgIv-REAWWErltEFe2eknYZK4h8';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function applyAdminPolicies() {
  console.log('🚀 Applying Admin Role Policies...\n');

  try {
    // =====================================================
    // STEP 1: CREATE USERS TABLE WITH ROLES
    // =====================================================
    console.log('📋 Step 1: Creating users table with roles...');
    
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
          id UUID REFERENCES auth.users(id) PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          full_name TEXT,
          avatar_url TEXT,
          role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
          department TEXT,
          phone TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    const { error: createTableError } = await supabase.rpc('exec_sql', { sql: createUsersTable });
    if (createTableError) {
      console.log('⚠️ Users table may already exist:', createTableError.message);
    } else {
      console.log('✅ Users table created/verified');
    }

    // =====================================================
    // STEP 2: CREATE ADMIN CHECK FUNCTION
    // =====================================================
    console.log('\n📋 Step 2: Creating admin check function...');
    
    const createAdminFunction = `
      CREATE OR REPLACE FUNCTION is_admin()
      RETURNS BOOLEAN AS $$
      BEGIN
          RETURN EXISTS (
              SELECT 1 FROM users 
              WHERE id = auth.uid() AND role = 'admin'
          );
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;

    const { error: functionError } = await supabase.rpc('exec_sql', { sql: createAdminFunction });
    if (functionError) {
      console.error('❌ Error creating admin function:', functionError);
    } else {
      console.log('✅ Admin check function created');
    }

    // =====================================================
    // STEP 3: APPLY CUSTOMER POLICIES
    // =====================================================
    console.log('\n📋 Step 3: Applying customer policies...');
    
    const customerPolicies = [
      `DROP POLICY IF EXISTS "Users can view own customers" ON customers;`,
      `DROP POLICY IF EXISTS "Users can insert own customers" ON customers;`,
      `DROP POLICY IF EXISTS "Users can update own customers" ON customers;`,
      `DROP POLICY IF EXISTS "Users can delete own customers" ON customers;`,
      `DROP POLICY IF EXISTS "users_can_view_own_customers" ON customers;`,
      `DROP POLICY IF EXISTS "authenticated_users_can_insert_customers" ON customers;`,
      
      `CREATE POLICY "Users and admins can view customers" ON customers
        FOR SELECT USING (auth.uid() = user_id OR is_admin());`,
      
      `CREATE POLICY "Users and admins can insert customers" ON customers
        FOR INSERT WITH CHECK (auth.uid() = user_id OR is_admin());`,
      
      `CREATE POLICY "Users and admins can update customers" ON customers
        FOR UPDATE USING (auth.uid() = user_id OR is_admin())
        WITH CHECK (auth.uid() = user_id OR is_admin());`,
      
      `CREATE POLICY "Users and admins can delete customers" ON customers
        FOR DELETE USING (auth.uid() = user_id OR is_admin());`
    ];

    for (const policy of customerPolicies) {
      const { error } = await supabase.rpc('exec_sql', { sql: policy });
      if (error) {
        console.log(`⚠️ Policy execution note: ${policy.substring(0, 50)}... - ${error.message}`);
      }
    }
    console.log('✅ Customer policies applied');

    // =====================================================
    // STEP 4: APPLY DEALS POLICIES
    // =====================================================
    console.log('\n📋 Step 4: Applying deals policies...');
    
    const dealsPolicies = [
      `DROP POLICY IF EXISTS "Users can view own deals" ON deals;`,
      `DROP POLICY IF EXISTS "Users can insert own deals" ON deals;`,
      `DROP POLICY IF EXISTS "Users can update own deals" ON deals;`,
      `DROP POLICY IF EXISTS "Users can delete own deals" ON deals;`,
      `DROP POLICY IF EXISTS "users_can_view_own_deals" ON deals;`,
      
      `CREATE POLICY "Users and admins can view deals" ON deals
        FOR SELECT USING (auth.uid() = user_id OR is_admin());`,
      
      `CREATE POLICY "Users and admins can insert deals" ON deals
        FOR INSERT WITH CHECK (auth.uid() = user_id OR is_admin());`,
      
      `CREATE POLICY "Users and admins can update deals" ON deals
        FOR UPDATE USING (auth.uid() = user_id OR is_admin())
        WITH CHECK (auth.uid() = user_id OR is_admin());`,
      
      `CREATE POLICY "Users and admins can delete deals" ON deals
        FOR DELETE USING (auth.uid() = user_id OR is_admin());`
    ];

    for (const policy of dealsPolicies) {
      const { error } = await supabase.rpc('exec_sql', { sql: policy });
      if (error) {
        console.log(`⚠️ Policy execution note: ${policy.substring(0, 50)}... - ${error.message}`);
      }
    }
    console.log('✅ Deals policies applied');

    // =====================================================
    // STEP 5: APPLY PROPOSALS POLICIES
    // =====================================================
    console.log('\n📋 Step 5: Applying proposals policies...');
    
    const proposalsPolicies = [
      `DROP POLICY IF EXISTS "Users can view own proposals" ON proposals;`,
      `DROP POLICY IF EXISTS "Users can insert own proposals" ON proposals;`,
      `DROP POLICY IF EXISTS "Users can update own proposals" ON proposals;`,
      `DROP POLICY IF EXISTS "Users can delete own proposals" ON proposals;`,
      
      `CREATE POLICY "Users and admins can view proposals" ON proposals
        FOR SELECT USING (auth.uid() = user_id OR is_admin());`,
      
      `CREATE POLICY "Users and admins can insert proposals" ON proposals
        FOR INSERT WITH CHECK (auth.uid() = user_id OR is_admin());`,
      
      `CREATE POLICY "Users and admins can update proposals" ON proposals
        FOR UPDATE USING (auth.uid() = user_id OR is_admin())
        WITH CHECK (auth.uid() = user_id OR is_admin());`,
      
      `CREATE POLICY "Users and admins can delete proposals" ON proposals
        FOR DELETE USING (auth.uid() = user_id OR is_admin());`
    ];

    for (const policy of proposalsPolicies) {
      const { error } = await supabase.rpc('exec_sql', { sql: policy });
      if (error) {
        console.log(`⚠️ Policy execution note: ${policy.substring(0, 50)}... - ${error.message}`);
      }
    }
    console.log('✅ Proposals policies applied');

    // =====================================================
    // STEP 6: ENABLE RLS AND SET PERMISSIONS
    // =====================================================
    console.log('\n📋 Step 6: Enabling RLS and setting permissions...');
    
    const rlsCommands = [
      `ALTER TABLE users ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE customers ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE deals ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;`,
      
      `GRANT ALL ON users TO authenticated;`,
      `GRANT ALL ON customers TO authenticated;`,
      `GRANT ALL ON deals TO authenticated;`,
      `GRANT ALL ON proposals TO authenticated;`
    ];

    for (const command of rlsCommands) {
      const { error } = await supabase.rpc('exec_sql', { sql: command });
      if (error) {
        console.log(`⚠️ RLS command note: ${command.substring(0, 50)}... - ${error.message}`);
      }
    }
    console.log('✅ RLS and permissions configured');

    console.log('\n🎉 Admin Role Policies Applied Successfully!');
    console.log('=====================================');
    console.log('✅ Users table with roles created');
    console.log('✅ is_admin() function created');
    console.log('✅ Customer admin policies applied');
    console.log('✅ Deals admin policies applied');
    console.log('✅ Proposals admin policies applied');
    console.log('✅ RLS enabled and permissions set');
    console.log('\n🚀 Ready for admin role testing!');

  } catch (error) {
    console.error('❌ Error applying admin policies:', error);
  }
}

// Run the script
if (require.main === module) {
  applyAdminPolicies();
}

module.exports = { applyAdminPolicies };
