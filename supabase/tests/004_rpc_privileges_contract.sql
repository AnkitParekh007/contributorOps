-- Must run after 004_restrict_auth_trigger_rpc.sql.
-- A SECURITY DEFINER trigger may be needed for Auth provisioning, but it
-- MUST NOT be directly callable via public PostgREST RPC grants.
DO $$
BEGIN
  IF has_function_privilege('anon', 'public.handle_new_user()', 'EXECUTE')
    OR has_function_privilege('authenticated', 'public.handle_new_user()', 'EXECUTE')
    OR has_function_privilege('anon', 'public.handle_new_subscription()', 'EXECUTE')
    OR has_function_privilege('authenticated', 'public.handle_new_subscription()', 'EXECUTE')
  THEN RAISE EXCEPTION 'External clients must not execute privileged auth triggers'; END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger
    WHERE tgname='on_auth_user_created' AND tgenabled <> 'D')
    OR NOT EXISTS (SELECT 1 FROM pg_trigger
    WHERE tgname='on_user_created_subscription' AND tgenabled <> 'D')
  THEN RAISE EXCEPTION 'Profile/subscription provisioning triggers are missing or disabled'; END IF;
END $$;
