-- Forward-only security migration for OAuth identity, state replay protection,
-- and tenant-scoped API state. Apply after 001 and 002.
-- Check existing schema before applying on a previously manually modified project.

ALTER TABLE public.oauth_accounts
  ADD COLUMN IF NOT EXISTS access_token_encrypted TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Older dev deployments may have created the incorrect alias independently.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='oauth_accounts'
      AND column_name='access_token_enc'
  ) THEN
    EXECUTE 'UPDATE public.oauth_accounts SET access_token_encrypted = COALESCE(access_token_encrypted, access_token_enc) WHERE access_token_encrypted IS NULL';
  END IF;
END $$;

-- The app persists one account per user/provider; provider identity must also be unique.
CREATE UNIQUE INDEX IF NOT EXISTS oauth_accounts_user_provider_unique
  ON public.oauth_accounts(user_id, provider);

CREATE TABLE IF NOT EXISTS public.oauth_states (
  state_hash TEXT PRIMARY KEY,
  browser_binding_hash TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  requested_scope TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS oauth_states_expiration_idx ON public.oauth_states(expires_at);
ALTER TABLE public.oauth_states ENABLE ROW LEVEL SECURITY;
-- No policies: only the service-role server can create/consume OAuth state.

CREATE TABLE IF NOT EXISTS public.user_scoped_state (
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  state_key TEXT NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY(user_id, state_key)
);
ALTER TABLE public.user_scoped_state ENABLE ROW LEVEL SECURITY;
-- No client RLS policies: service role only. The API enforces user identity and
-- binds every query to the authenticated user ID.

-- Be explicit: service-role bypassing RLS still requires table privileges on
-- installations with nonstandard public-schema default grants.
GRANT USAGE ON SCHEMA public TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.oauth_accounts, public.oauth_states, public.user_scoped_state
  TO service_role;

-- Stored encrypted tokens and provider identity are managed only by the server.
DROP POLICY IF EXISTS "Users can manage their own OAuth accounts" ON public.oauth_accounts;
REVOKE INSERT, UPDATE, DELETE ON public.oauth_accounts FROM anon, authenticated;
REVOKE ALL ON public.oauth_states FROM anon, authenticated;
REVOKE ALL ON public.user_scoped_state FROM anon, authenticated;

-- All sensitive service-role tables must enforce RLS even when directly exposed.
ALTER TABLE public.waitlist_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.waitlist_entries, public.billing_events, public.webhook_events
  FROM anon, authenticated;
