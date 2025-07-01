ALTER TABLE customers ADD COLUMN name text;
-- If you want to migrate existing data, uncomment the next line:
-- UPDATE customers SET name = contact_person WHERE name IS NULL;
ALTER TABLE customers DROP COLUMN IF EXISTS contact_person;
