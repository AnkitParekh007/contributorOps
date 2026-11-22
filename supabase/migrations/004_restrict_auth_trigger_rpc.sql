-- ContributorOps security: privileged Auth trigger handlers are internal-only.
-- Fresh staging security advisers found direct RPC invocation grants to anon/authenticated.
-- The trigger itself continues to run as its owner when auth.users is inserted.
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_subscription() FROM PUBLIC, anon, authenticated;
