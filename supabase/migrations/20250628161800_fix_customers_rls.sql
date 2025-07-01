-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert own customers" ON customers;
DROP POLICY IF EXISTS "Users can view own customers" ON customers;
DROP POLICY IF EXISTS "Users can update own customers" ON customers;

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create simpler INSERT policy that allows authenticated users to insert
CREATE POLICY "Enable insert for authenticated users only"
ON customers
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create trigger function to set user_id
CREATE OR REPLACE FUNCTION public.set_user_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_id = auth.uid();
  RETURN NEW;
END;
$$ language plpgsql security definer;

-- Create trigger to automatically set user_id
DROP TRIGGER IF EXISTS set_user_id_trigger ON customers;
CREATE TRIGGER set_user_id_trigger
  BEFORE INSERT ON customers
  FOR EACH ROW
  EXECUTE FUNCTION public.set_user_id();

-- Create SELECT policy
CREATE POLICY "Enable read access for own customers"
ON customers
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create UPDATE policy
CREATE POLICY "Enable update access for own customers"
ON customers
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id); 