import { Router } from "express";
import {
  buildEntitlements,
  ensureFeature,
  getBillingState,
  updateBillingPlan,
  updatePublicProfile,
} from "../billing.js";
import { validate } from "../middleware/validate.js";
import { BillingProfileSchema, SelectPlanSchema } from "../schemas/billing.js";
import { isSupabaseMode } from "../db/index.js";
import { getSubscription, updateSubscription } from "../db/billing.js";
import { getUserId } from "../auth/session.js";

const router = Router();

router.get("/billing", async (req, res, next) => {
  try {
    if (isSupabaseMode()) {
      const userId = getUserId(req);
      const sub = await getSubscription(userId);
      const billing = await getBillingState();
      const plan = (sub?.plan ?? billing.plan) as typeof billing.plan;
      const status = (sub?.status ?? billing.status) as typeof billing.status;
      res.json({ billing: { ...billing, plan, status }, entitlements: buildEntitlements({ ...billing, plan }) });
      return;
    }
    const billing = await getBillingState();
    res.json({ billing, entitlements: buildEntitlements(billing) });
  } catch (error) {
    next(error);
  }
});

router.post("/billing/mock-select-plan", validate(SelectPlanSchema), async (req, res, next) => {
  try {
    if (isSupabaseMode()) {
      const userId = getUserId(req);
      await updateSubscription(userId, { plan: req.body.plan });
    }
    const billing = await updateBillingPlan(req.body.plan);
    res.json({ billing, entitlements: buildEntitlements(billing) });
  } catch (error) {
    next(error);
  }
});

router.patch("/billing/profile", validate(BillingProfileSchema), async (req, res, next) => {
  try {
    await ensureFeature("public-portfolio");
    const billing = await updatePublicProfile(req.body);
    res.json({ billing, entitlements: buildEntitlements(billing) });
  } catch (error) {
    next(error);
  }
});

export default router;
