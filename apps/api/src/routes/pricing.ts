import { Router } from "express";
import { pricingTiers } from "../billing.js";

const router = Router();

router.get("/pricing", (_req, res) => {
  res.json(pricingTiers);
});

export default router;
