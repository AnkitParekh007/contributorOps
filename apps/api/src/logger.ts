import { createRequire } from "node:module";
import pino from "pino";

const require = createRequire(import.meta.url);

function resolveDevTransport(): pino.TransportSingleOptions | undefined {
  if (process.env.NODE_ENV === "production") {
    return undefined;
  }

  try {
    require.resolve("pino-pretty");
    return {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss",
      },
    };
  } catch {
    return undefined;
  }
}

export const logger = pino({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug"),
  transport: resolveDevTransport(),
});
