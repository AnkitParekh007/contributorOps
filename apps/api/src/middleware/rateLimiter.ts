import rateLimit from "express-rate-limit";

/** 100 requests per 15 minutes — applied to all API routes */
export const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

/** 10 requests per 15 minutes — applied to external-write routes */
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Rate limit exceeded for this action." },
});
