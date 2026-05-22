-- ContributorOps — Initial Schema
-- Migration 001: Core tables
-- Run via: npx supabase db push

-- ── Extensions ───────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Users ────────────────────────────────────────────────────────────────────
-- Mirrors Supabase auth.users — stores product-level profile data
CREATE TABLE IF NOT EXISTS public.users (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        TEXT,
  display_name TEXT,
  avatar_url   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create user profile row when auth.users row is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── OAuth Accounts ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.oauth_accounts (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  provider               TEXT NOT NULL,                  -- 'github'
  provider_user_id       TEXT NOT NULL,
  access_token_encrypted TEXT,                           -- AES-256-GCM encrypted
  scopes                 TEXT[],
  token_expires_at       TIMESTAMPTZ,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(provider, provider_user_id)
);

-- ── GitHub Connections ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.github_connections (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  github_username  TEXT NOT NULL,
  github_user_id   BIGINT,
  scopes           TEXT[],
  connected_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_used_at     TIMESTAMPTZ,
  is_active        BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(user_id)
);

-- ── Discovered Issues ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.discovered_issues (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  github_repo          TEXT NOT NULL,   -- 'owner/repo'
  github_issue_number  INT  NOT NULL,
  title                TEXT NOT NULL,
  url                  TEXT NOT NULL,
  score                JSONB,           -- { total, roleMatch, maintainerFit, ... }
  labels               TEXT[],
  discovered_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  plan_generated       BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(user_id, github_repo, github_issue_number)
);

-- ── Daily Plans ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.daily_plans (
  id           UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID  NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date         DATE  NOT NULL,
  issues       JSONB NOT NULL DEFAULT '[]',
  plan_summary TEXT,
  markdown     TEXT,
  mission      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- ── Contribution Plans ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contribution_plans (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  repo             TEXT NOT NULL,
  issue_number     INT  NOT NULL,
  issue_title      TEXT,
  plan_content     JSONB NOT NULL DEFAULT '{}',
  status           TEXT NOT NULL DEFAULT 'draft',
  -- status: draft | approved | submitted | merged | rejected
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Approval Requests ─────────────────────────────────────────────────────────
-- CRITICAL: every external GitHub action must have an approval record
CREATE TABLE IF NOT EXISTS public.approval_requests (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  action_type      TEXT NOT NULL,
  -- action_type: 'comment' | 'fork' | 'branch' | 'commit' | 'draft_pr'
  target_repo      TEXT NOT NULL,
  target_ref       TEXT,              -- issue number, PR number, etc.
  payload          JSONB NOT NULL,    -- exact content to be submitted (immutable after approval)
  status           TEXT NOT NULL DEFAULT 'pending',
  -- status: pending | approved | rejected | executed
  idempotency_key  TEXT UNIQUE,       -- prevents duplicate execution
  approved_at      TIMESTAMPTZ,
  executed_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Audit Logs ────────────────────────────────────────────────────────────────
-- Append-only — never update or delete rows
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action        TEXT NOT NULL,
  -- e.g. 'issue.discover' | 'approval.request' | 'approval.execute' | 'plan.change'
  resource_type TEXT,
  resource_id   TEXT,
  metadata      JSONB,
  ip_address    TEXT,
  user_agent    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Portfolio Entries ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.portfolio_entries (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  repo         TEXT NOT NULL,
  pr_url       TEXT,
  title        TEXT NOT NULL,
  description  TEXT,
  tags         TEXT[],
  status       TEXT NOT NULL DEFAULT 'discovered',
  -- status: discovered | planned | in progress | PR opened | merged | rejected
  proof        JSONB DEFAULT '{}',
  -- proof: { resumeBullet, linkedInPost, interviewStarStory, recruiterNote }
  is_public    BOOLEAN NOT NULL DEFAULT false,
  merged_at    TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Public Portfolio Profiles ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.public_portfolio_profiles (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  slug         TEXT NOT NULL UNIQUE,
  display_name TEXT,
  bio          TEXT,
  headline     TEXT,
  summary      TEXT,
  is_visible   BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- ── Subscriptions ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan                    TEXT NOT NULL DEFAULT 'free',
  -- plan: free | pro | career | team | founder
  status                  TEXT NOT NULL DEFAULT 'active',
  -- status: active | cancelled | past_due | trialing
  stripe_customer_id      TEXT UNIQUE,
  stripe_subscription_id  TEXT UNIQUE,
  current_period_end      TIMESTAMPTZ,
  cancel_at_period_end    BOOLEAN NOT NULL DEFAULT false,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Auto-create free subscription when user is created
CREATE OR REPLACE FUNCTION public.handle_new_subscription()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, plan, status)
  VALUES (NEW.id, 'free', 'active')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_user_created_subscription ON public.users;
CREATE TRIGGER on_user_created_subscription
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_subscription();

-- ── Billing Events ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.billing_events (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES public.users(id) ON DELETE SET NULL,
  stripe_event_id  TEXT UNIQUE,
  event_type       TEXT NOT NULL,
  payload          JSONB NOT NULL,
  processed_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Usage Counters ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.usage_counters (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id   UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  metric    TEXT NOT NULL,
  -- metric: 'plans_generated' | 'prs_submitted' | 'exports' | 'recruiter_shares'
  period    DATE NOT NULL,            -- week start date
  count     INT  NOT NULL DEFAULT 0,
  UNIQUE(user_id, metric, period)
);

-- ── Waitlist Entries ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.waitlist_entries (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email              TEXT NOT NULL UNIQUE,
  name               TEXT,
  github_username    TEXT,
  target_role        TEXT,
  plan_interest      TEXT,
  problem_statement  TEXT,
  source             TEXT NOT NULL DEFAULT 'site',
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Organizations ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.organizations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  owner_id   UUID REFERENCES public.users(id) ON DELETE SET NULL,
  plan       TEXT NOT NULL DEFAULT 'team',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Organization Members ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.organization_members (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id       UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role         TEXT NOT NULL DEFAULT 'member',
  -- role: owner | admin | member | viewer
  invited_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at  TIMESTAMPTZ,
  UNIQUE(org_id, user_id)
);

-- ── Contribution Runs ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contribution_runs (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  approval_request_id   UUID REFERENCES public.approval_requests(id),
  action_type           TEXT NOT NULL,
  github_result         JSONB,        -- { url, pr_number, branch, ... }
  status                TEXT NOT NULL DEFAULT 'success',
  -- status: success | failed | rate_limited | cancelled
  executed_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Webhook Events ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source              TEXT NOT NULL,   -- 'github' | 'stripe'
  event_type          TEXT NOT NULL,
  payload             JSONB NOT NULL,
  signature_verified  BOOLEAN NOT NULL DEFAULT false,
  processed           BOOLEAN NOT NULL DEFAULT false,
  processing_error    TEXT,
  received_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_discovered_issues_user    ON public.discovered_issues(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_plans_user_date     ON public.daily_plans(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_portfolio_user            ON public.portfolio_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_public          ON public.portfolio_entries(user_id) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_approval_requests_user    ON public.approval_requests(user_id, status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user           ON public.audit_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created        ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_user_period         ON public.usage_counters(user_id, period DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_email            ON public.waitlist_entries(email);
CREATE INDEX IF NOT EXISTS idx_contribution_runs_user    ON public.contribution_runs(user_id, executed_at DESC);
