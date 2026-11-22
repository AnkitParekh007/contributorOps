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

const router = Router();

router.get("/billing", async (req, res, next) => {
  try {
    const billing = await getBillingState();
    res.json({ billing, entitlements: buildEntitlements(billing) });
  } catch (error) {
    next(error);
  }
});

router.post("/billing/mock-select-plan", validate(SelectPlanSchema), async (req, res, next) => {
  try {
    if (isSupabaseMode()) {
      res.status(403).json({ message: "Plan changes require verified billing events. Mock plan selection is demo-only." });
      return;
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
