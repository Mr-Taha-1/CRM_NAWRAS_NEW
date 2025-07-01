-- =====================================================
-- ADMIN ROLE-BASED ACCESS CONTROL IMPLEMENTATION
-- This script creates admin-specific RLS policies that allow
-- admin users to access all data while maintaining regular
-- user restrictions to their own data only.
-- =====================================================

-- =====================================================
-- STEP 1: ENSURE USERS TABLE EXISTS WITH ROLES
-- =====================================================

-- Create users table if it doesn't exist (extends Supabase auth.users)
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

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create users table policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;

CREATE POLICY "Users can view own profile" ON users 
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users 
    FOR UPDATE USING (auth.uid() = id);

-- Admin can view all user profiles
CREATE POLICY "Admins can view all users" ON users 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- STEP 2: CREATE HELPER FUNCTION TO CHECK ADMIN ROLE
-- =====================================================

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- STEP 3: UPDATE CUSTOMERS TABLE POLICIES
-- =====================================================

-- Drop existing customer policies
DROP POLICY IF EXISTS "Users can view own customers" ON customers;
DROP POLICY IF EXISTS "Users can insert own customers" ON customers;
DROP POLICY IF EXISTS "Users can update own customers" ON customers;
DROP POLICY IF EXISTS "Users can delete own customers" ON customers;
DROP POLICY IF EXISTS "Authenticated users can insert customers" ON customers;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON customers;
DROP POLICY IF EXISTS "Enable read access for own customers" ON customers;
DROP POLICY IF EXISTS "Enable update access for own customers" ON customers;
DROP POLICY IF EXISTS "authenticated_users_can_insert_customers" ON customers;
DROP POLICY IF EXISTS "users_can_view_own_customers" ON customers;
DROP POLICY IF EXISTS "users_can_update_own_customers" ON customers;
DROP POLICY IF EXISTS "users_can_delete_own_customers" ON customers;
DROP POLICY IF EXISTS "Admins can view all customers" ON customers;
DROP POLICY IF EXISTS "Admins can manage all customers" ON customers;

-- Create new role-based customer policies
-- Regular users can only see their own customers, admins can see all
CREATE POLICY "Users and admins can view customers" ON customers
    FOR SELECT USING (
        auth.uid() = user_id OR is_admin()
    );

-- Regular users can only insert their own customers, admins can insert any
CREATE POLICY "Users and admins can insert customers" ON customers
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR is_admin()
    );

-- Regular users can only update their own customers, admins can update any
CREATE POLICY "Users and admins can update customers" ON customers
    FOR UPDATE USING (
        auth.uid() = user_id OR is_admin()
    ) WITH CHECK (
        auth.uid() = user_id OR is_admin()
    );

-- Regular users can only delete their own customers, admins can delete any
CREATE POLICY "Users and admins can delete customers" ON customers
    FOR DELETE USING (
        auth.uid() = user_id OR is_admin()
    );

-- =====================================================
-- STEP 4: UPDATE DEALS TABLE POLICIES
-- =====================================================

-- Drop existing deal policies
DROP POLICY IF EXISTS "Users can view own deals" ON deals;
DROP POLICY IF EXISTS "Users can insert own deals" ON deals;
DROP POLICY IF EXISTS "Users can update own deals" ON deals;
DROP POLICY IF EXISTS "Users can delete own deals" ON deals;
DROP POLICY IF EXISTS "Users can manage own deals" ON deals;
DROP POLICY IF EXISTS "authenticated_users_can_insert_deals" ON deals;
DROP POLICY IF EXISTS "users_can_view_own_deals" ON deals;
DROP POLICY IF EXISTS "users_can_update_own_deals" ON deals;
DROP POLICY IF EXISTS "users_can_delete_own_deals" ON deals;
DROP POLICY IF EXISTS "Users can CRUD their own deals" ON deals;
DROP POLICY IF EXISTS "Admins can view all deals" ON deals;
DROP POLICY IF EXISTS "Admins can manage all deals" ON deals;

-- Create new role-based deal policies
CREATE POLICY "Users and admins can view deals" ON deals
    FOR SELECT USING (
        auth.uid() = user_id OR is_admin()
    );

CREATE POLICY "Users and admins can insert deals" ON deals
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR is_admin()
    );

CREATE POLICY "Users and admins can update deals" ON deals
    FOR UPDATE USING (
        auth.uid() = user_id OR is_admin()
    ) WITH CHECK (
        auth.uid() = user_id OR is_admin()
    );

CREATE POLICY "Users and admins can delete deals" ON deals
    FOR DELETE USING (
        auth.uid() = user_id OR is_admin()
    );

-- =====================================================
-- STEP 5: UPDATE PROPOSALS TABLE POLICIES
-- =====================================================

-- Drop existing proposal policies
DROP POLICY IF EXISTS "Users can view own proposals" ON proposals;
DROP POLICY IF EXISTS "Users can insert own proposals" ON proposals;
DROP POLICY IF EXISTS "Users can update own proposals" ON proposals;
DROP POLICY IF EXISTS "Users can delete own proposals" ON proposals;
DROP POLICY IF EXISTS "Users can manage own proposals" ON proposals;
DROP POLICY IF EXISTS "Admins can view all proposals" ON proposals;
DROP POLICY IF EXISTS "Admins can manage all proposals" ON proposals;

-- Create new role-based proposal policies
CREATE POLICY "Users and admins can view proposals" ON proposals
    FOR SELECT USING (
        auth.uid() = user_id OR is_admin()
    );

CREATE POLICY "Users and admins can insert proposals" ON proposals
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR is_admin()
    );

CREATE POLICY "Users and admins can update proposals" ON proposals
    FOR UPDATE USING (
        auth.uid() = user_id OR is_admin()
    ) WITH CHECK (
        auth.uid() = user_id OR is_admin()
    );

CREATE POLICY "Users and admins can delete proposals" ON proposals
    FOR DELETE USING (
        auth.uid() = user_id OR is_admin()
    );

-- =====================================================
-- STEP 6: CREATE ADMIN TEST USER
-- =====================================================

-- Insert admin test user (this will be used for testing)
-- Note: In production, you should create this through Supabase Auth UI
-- and then update the role in the users table

-- This is a placeholder - the actual user creation should be done through
-- Supabase Auth, then we update their role here
-- INSERT INTO users (id, email, full_name, role) 
-- VALUES ('admin-user-uuid', 'admin@nawrascrm.com', 'Admin User', 'admin')
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- =====================================================
-- STEP 7: GRANT PERMISSIONS
-- =====================================================

-- Grant access to authenticated users
GRANT ALL ON users TO authenticated;
GRANT ALL ON customers TO authenticated;
GRANT ALL ON deals TO authenticated;
GRANT ALL ON proposals TO authenticated;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =====================================================
-- VERIFICATION QUERIES (for testing)
-- =====================================================

-- Test queries to verify the policies work:
-- 1. Check if admin function works:
-- SELECT is_admin();

-- 2. Check user roles:
-- SELECT id, email, role FROM users;

-- 3. Test data access as regular user vs admin:
-- SELECT COUNT(*) FROM customers; -- Should show different counts based on role

COMMENT ON FUNCTION is_admin() IS 'Helper function to check if current authenticated user has admin role';
COMMENT ON TABLE users IS 'Extended user profiles with role-based access control';
