import { Router } from "express";
import { readControlMode, writeControlMode } from "../storage.js";
import { validate } from "../middleware/validate.js";
import { ControlModeSchema } from "../schemas/controlMode.js";

const router = Router();

router.get("/control-mode", async (_req, res, next) => {
  try {
    res.json(await readControlMode());
  } catch (error) {
    next(error);
  }
});

router.post("/control-mode", validate(ControlModeSchema), async (req, res, next) => {
  try {
    const { safetyLevel, approvalReason, explicitApproval } = req.body;
    const now = new Date().toISOString();
    const nextState = {
      safetyLevel,
      approvalRequired: safetyLevel === "approved-pr",
      approvalGrantedAt: safetyLevel === "approved-pr" && explicitApproval ? now : null,
      approvalReason: safetyLevel === "approved-pr" ? (approvalReason?.trim() || "") : "",
      lastUpdatedAt: now,
    };
    res.json(await writeControlMode(nextState));
  } catch (error) {
    next(error);
  }
});

export default router;
