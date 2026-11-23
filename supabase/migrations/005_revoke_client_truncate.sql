-- Defense in depth: RLS does not apply to TRUNCATE.
-- Supabase's default table grants can give API roles destructive table privileges.
-- Do not change SELECT/INSERT/UPDATE/DELETE policies or service_role grants here.
DO $$
DECLARE t record;
BEGIN
  FOR t IN
    SELECT n.nspname, c.relname
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p')
  LOOP
    EXECUTE format('REVOKE TRUNCATE ON TABLE %I.%I FROM anon, authenticated', t.nspname, t.relname);
  END LOOP;
END $$;

-- Apply the same safe default to future application tables.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE TRUNCATE ON TABLES FROM anon, authenticated;
