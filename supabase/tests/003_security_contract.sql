-- Must be executed AFTER migrations 001, 002, 003, with ON_ERROR_STOP=1.
DO $$
DECLARE
  n INTEGER;
BEGIN
  SELECT count(*) INTO n FROM information_schema.columns
    WHERE table_schema='public' AND table_name='oauth_accounts' AND
      column_name IN ('provider_user_id','access_token_encrypted','updated_at');
  IF n <> 3 THEN RAISE EXCEPTION 'OAuth column contract mismatch'; END IF;
  SELECT count(*) INTO n FROM information_schema.tables
    WHERE table_schema='public' AND table_name IN ('user_scoped_state','oauth_states');
  IF n <> 2 THEN RAISE EXCEPTION 'Tenant state / OAuth nonce tables missing'; END IF;
END $$;

INSERT INTO auth.users(id,email) VALUES
 ('11111111-1111-4111-8111-111111111111','a@example.test'),
 ('22222222-2222-4222-8222-222222222222','b@example.test');

INSERT INTO public.oauth_accounts (user_id,provider,provider_user_id,access_token_encrypted,scopes)
VALUES ('11111111-1111-4111-8111-111111111111','github','123456','cipher-a',ARRAY['public_repo'])
ON CONFLICT (user_id,provider) DO UPDATE SET access_token_encrypted=EXCLUDED.access_token_encrypted,
  provider_user_id=EXCLUDED.provider_user_id, updated_at=now();

INSERT INTO public.oauth_accounts (user_id,provider,provider_user_id,access_token_encrypted,scopes)
VALUES ('11111111-1111-4111-8111-111111111111','github','123456','cipher-a-updated',ARRAY['public_repo'])
ON CONFLICT (user_id,provider) DO UPDATE SET access_token_encrypted=EXCLUDED.access_token_encrypted,
  provider_user_id=EXCLUDED.provider_user_id, updated_at=now();

DO $$
DECLARE n INTEGER;
BEGIN
  SELECT count(*) INTO n FROM public.oauth_accounts
  WHERE user_id='11111111-1111-4111-8111-111111111111' AND provider='github'
    AND access_token_encrypted='cipher-a-updated';
  IF n<>1 THEN RAISE EXCEPTION 'OAuth reconnect did not upsert one row'; END IF;
  BEGIN
    INSERT INTO public.oauth_accounts(user_id,provider,provider_user_id,access_token_encrypted)
      VALUES('22222222-2222-4222-8222-222222222222','github','123456','must-not-save');
    RAISE EXCEPTION 'Another app user attached an existing GitHub identity';
  EXCEPTION WHEN unique_violation THEN
    RAISE NOTICE 'Expected OAuth provider identity isolation confirmed';
  END;
END $$;

INSERT INTO public.user_scoped_state(user_id,state_key,value)
VALUES
 ('11111111-1111-4111-8111-111111111111','controlMode','{"safetyLevel":"draft"}'),
 ('22222222-2222-4222-8222-222222222222','controlMode','{"safetyLevel":"research"}');
DO $$
BEGIN
 IF (SELECT value->>'safetyLevel' FROM public.user_scoped_state WHERE
  user_id='11111111-1111-4111-8111-111111111111' AND state_key='controlMode') <> 'draft'
 THEN RAISE EXCEPTION 'User A state incorrect'; END IF;
 IF (SELECT value->>'safetyLevel' FROM public.user_scoped_state WHERE
  user_id='22222222-2222-4222-8222-222222222222' AND state_key='controlMode') <> 'research'
 THEN RAISE EXCEPTION 'User B state incorrect'; END IF;
 IF NOT (SELECT relrowsecurity FROM pg_class WHERE oid='public.user_scoped_state'::regclass)
 THEN RAISE EXCEPTION 'Tenant state RLS disabled'; END IF;
 IF NOT (SELECT relrowsecurity FROM pg_class WHERE oid='public.oauth_states'::regclass)
 THEN RAISE EXCEPTION 'OAuth state RLS disabled'; END IF;
 IF NOT (SELECT relrowsecurity FROM pg_class WHERE oid='public.waitlist_entries'::regclass)
 THEN RAISE EXCEPTION 'Waitlist RLS disabled'; END IF;
END $$;

DO $$
BEGIN
  IF NOT has_table_privilege('service_role', 'public.oauth_accounts', 'SELECT,INSERT,UPDATE,DELETE')
     OR NOT has_table_privilege('service_role', 'public.oauth_states', 'SELECT,INSERT,UPDATE,DELETE')
     OR NOT has_table_privilege('service_role', 'public.user_scoped_state', 'SELECT,INSERT,UPDATE,DELETE')
  THEN RAISE EXCEPTION 'Service-role permission contract is missing for hosted API state'; END IF;
END $$;

DO $$
BEGIN
  IF has_table_privilege('authenticated','public.subscriptions','INSERT')
     OR has_table_privilege('authenticated','public.subscriptions','UPDATE')
     OR has_table_privilege('authenticated','public.subscriptions','DELETE')
  THEN RAISE EXCEPTION 'Authenticated client must not mutate subscriptions'; END IF;
END $$;

SET ROLE authenticated;
DO $$
BEGIN
  BEGIN
    PERFORM value FROM public.user_scoped_state LIMIT 1;
    RAISE EXCEPTION 'Client accessed service-role-only state';
  EXCEPTION WHEN insufficient_privilege THEN
    RAISE NOTICE 'Expected tenant-state privilege boundary confirmed';
  END;
END $$;
RESET ROLE;
