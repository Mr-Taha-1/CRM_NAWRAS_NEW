-- Fix RLS policies for customers table to resolve 403 errors
-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Users can insert own customers" ON customers;
DROP POLICY IF EXISTS "Users can view own customers"  ON customers;
DROP POLICY IF EXISTS "Users can update own customers" ON customers;

-- Create a more permissive INSERT policy for authenticated users
CREATE POLICY "Authenticated users can insert customers"
  ON customers FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Ensure the existing SELECT policy allows users to see their own customers
CREATE POLICY "Users can view own customers"
  ON customers FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Ensure the UPDATE policy is correct
CREATE POLICY "Users can update own customers"
  ON customers FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to automatically set user_id on insert
CREATE OR REPLACE FUNCTION set_user_id_on_customers()
RETURNS TRIGGER AS $$
BEGIN
    NEW.user_id := auth.uid();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically set user_id
DROP TRIGGER IF EXISTS trigger_set_user_id_customers ON customers;
CREATE TRIGGER trigger_set_user_id_customers
    BEFORE INSERT ON customers
    FOR EACH ROW
    EXECUTE FUNCTION set_user_id_on_customers(); 