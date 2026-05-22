-- ContributorOps — Row Level Security Policies
-- Migration 002: Per-user data isolation
-- These policies ensure users can only access their own data.

-- ── Enable RLS on all user-scoped tables ──────────────────────────────────────
ALTER TABLE public.users                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oauth_accounts           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.github_connections       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discovered_issues        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_plans              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contribution_plans       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_requests        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_entries        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_portfolio_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_counters           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contribution_runs        ENABLE ROW LEVEL SECURITY;

-- NOTE: audit_logs, billing_events, webhook_events are service-role only
-- They are enabled above but have no user-facing policies — only service role can write

-- ── users ─────────────────────────────────────────────────────────────────────
CREATE POLICY "Users can read their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- ── oauth_accounts ────────────────────────────────────────────────────────────
CREATE POLICY "Users can manage their own OAuth accounts"
  ON public.oauth_accounts FOR ALL
  USING (auth.uid() = user_id);

-- ── github_connections ────────────────────────────────────────────────────────
CREATE POLICY "Users can manage their own GitHub connections"
  ON public.github_connections FOR ALL
  USING (auth.uid() = user_id);

-- ── discovered_issues ─────────────────────────────────────────────────────────
CREATE POLICY "Users can manage their own discovered issues"
  ON public.discovered_issues FOR ALL
  USING (auth.uid() = user_id);

-- ── daily_plans ───────────────────────────────────────────────────────────────
CREATE POLICY "Users can manage their own daily plans"
  ON public.daily_plans FOR ALL
  USING (auth.uid() = user_id);

-- ── contribution_plans ────────────────────────────────────────────────────────
CREATE POLICY "Users can manage their own contribution plans"
  ON public.contribution_plans FOR ALL
  USING (auth.uid() = user_id);

-- ── approval_requests ─────────────────────────────────────────────────────────
CREATE POLICY "Users can manage their own approval requests"
  ON public.approval_requests FOR ALL
  USING (auth.uid() = user_id);

-- Prevent updating executed approval requests (safety: immutable after execution)
CREATE POLICY "Executed approvals are immutable"
  ON public.approval_requests FOR UPDATE
  USING (auth.uid() = user_id AND executed_at IS NULL);

-- ── audit_logs ────────────────────────────────────────────────────────────────
-- Users can read their own audit log entries but cannot insert/update/delete
CREATE POLICY "Users can read their own audit logs"
  ON public.audit_logs FOR SELECT
  USING (auth.uid() = user_id);

-- No INSERT policy for users — audit logs are written by service role only

-- ── portfolio_entries ─────────────────────────────────────────────────────────
CREATE POLICY "Users can manage their own portfolio entries"
  ON public.portfolio_entries FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Public portfolio entries are readable by anyone"
  ON public.portfolio_entries FOR SELECT
  USING (is_public = true);

-- ── public_portfolio_profiles ─────────────────────────────────────────────────
CREATE POLICY "Users can manage their own portfolio profile"
  ON public.public_portfolio_profiles FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Visible portfolio profiles are readable by anyone"
  ON public.public_portfolio_profiles FOR SELECT
  USING (is_visible = true);

-- ── subscriptions ─────────────────────────────────────────────────────────────
CREATE POLICY "Users can read their own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- No user INSERT/UPDATE policy — subscriptions are managed by service role (billing webhooks)

-- ── usage_counters ────────────────────────────────────────────────────────────
CREATE POLICY "Users can read their own usage counters"
  ON public.usage_counters FOR SELECT
  USING (auth.uid() = user_id);

-- Service role manages inserts/updates (upsert pattern)

-- ── organizations ─────────────────────────────────────────────────────────────
CREATE POLICY "Org members can read their organization"
  ON public.organizations FOR SELECT
  USING (
    id IN (
      SELECT org_id FROM public.organization_members
      WHERE user_id = auth.uid() AND accepted_at IS NOT NULL
    )
    OR owner_id = auth.uid()
  );

CREATE POLICY "Org owners can update their organization"
  ON public.organizations FOR UPDATE
  USING (owner_id = auth.uid());

-- ── organization_members ──────────────────────────────────────────────────────
CREATE POLICY "Org members can see other members in their org"
  ON public.organization_members FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM public.organization_members
      WHERE user_id = auth.uid() AND accepted_at IS NOT NULL
    )
  );

CREATE POLICY "Users can see their own membership rows"
  ON public.organization_members FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can accept their own invitations"
  ON public.organization_members FOR UPDATE
  USING (user_id = auth.uid());

-- ── contribution_runs ─────────────────────────────────────────────────────────
CREATE POLICY "Users can read their own contribution runs"
  ON public.contribution_runs FOR SELECT
  USING (auth.uid() = user_id);

-- Service role manages inserts (runs are created via approval execution)
