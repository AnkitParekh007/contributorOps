-- Must run after 005_revoke_client_truncate.sql.
-- Check effective privileges, including privileges inherited from PUBLIC or roles.
DO $$
DECLARE t record;
BEGIN
  FOR t IN
    SELECT c.oid, n.nspname, c.relname
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p')
  LOOP
    IF has_table_privilege('anon', t.oid, 'TRUNCATE')
       OR has_table_privilege('authenticated', t.oid, 'TRUNCATE') THEN
      RAISE EXCEPTION 'Client role retains TRUNCATE on %.%', t.nspname, t.relname;
    END IF;
  END LOOP;
END $$;
