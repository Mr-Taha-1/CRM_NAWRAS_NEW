$headers = @{
    'apikey' = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qaHRkd3J6b2xmd2Jpd3Jwcm9rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwOTk4NzU3NywiZXhwIjoyMDI1NTYzNTc3fQ.Pu_IqTqTIb2lj6YJBZrLpN1zCHNXD_MZdN_6Jy6_Y0Y'
    'Authorization' = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qaHRkd3J6b2xmd2Jpd3Jwcm9rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwOTk4NzU3NywiZXhwIjoyMDI1NTYzNTc3fQ.Pu_IqTqTIb2lj6YJBZrLpN1zCHNXD_MZdN_6Jy6_Y0Y'
}

$queries = @(
    "DROP POLICY IF EXISTS ""Users can insert own customers"" ON customers;",
    "DROP POLICY IF EXISTS ""Users can view own customers"" ON customers;",
    "DROP POLICY IF EXISTS ""Users can update own customers"" ON customers;",
    "CREATE POLICY ""Authenticated users can insert customers"" ON customers FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);",
    "CREATE POLICY ""Users can view own customers"" ON customers FOR SELECT TO authenticated USING (auth.uid() = user_id);",
    "CREATE POLICY ""Users can update own customers"" ON customers FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);"
)

foreach ($query in $queries) {
    $body = @{
        'query' = $query
    } | ConvertTo-Json

    Invoke-RestMethod -Method POST -Uri 'https://ojhtdwrzolfwbiwrprok.supabase.co/rest/v1/rpc/exec_sql' -Headers $headers -Body $body -ContentType 'application/json'
    Write-Host "Executed query: $query"
} 