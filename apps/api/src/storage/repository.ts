import fs from "node:fs/promises";
import path from "node:path";
import { config } from "../config.js";
import { requireRequestUserId } from "../auth/request-context.js";
import { getSupabaseAdmin } from "../db/client.js";

/** All shared state IO flows through this interface, never raw global JSON in hosted mode. */
export interface StorageRepository {
  read<T>(key: string, fallback: T): Promise<T>;
  write<T>(key: string, value: T): Promise<T>;
}

const paths: Record<string, string> = {
  portfolio: config.portfolioPath,
  dailyPlan: config.dailyPlanPath,
  controlMode: config.controlModePath,
  prActivity: config.prActivityPath,
  contributionRuns: config.contributionRunsPath,
  billing: config.billingPath,
  usage: config.usagePath,
};

const demoRepository: StorageRepository = {
  async read<T>(key: string, fallback: T): Promise<T> {
    const filePath = paths[key];
    if (!filePath) throw new Error("Unrecognized local state key");
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    try {
      const raw = await fs.readFile(filePath, "utf8");
      return JSON.parse(raw) as T;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      await fs.writeFile(filePath, JSON.stringify(fallback, null, 2), "utf8");
      return fallback;
    }
  },
  async write<T>(key: string, value: T): Promise<T> {
    const filePath = paths[key];
    if (!filePath) throw new Error("Unrecognized local state key");
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(value, null, 2), "utf8");
    return value;
  },
};

export function makeHostedStorageRepository(dbFactory: () => ReturnType<typeof getSupabaseAdmin> = getSupabaseAdmin): StorageRepository {
  return {
  async read<T>(key: string, fallback: T): Promise<T> {
    if (!Object.hasOwn(paths, key)) throw new Error("Unrecognized state key");
    const userId = requireRequestUserId();
    const { data, error } = await dbFactory().from("user_scoped_state")
      .select("value").eq("user_id", userId).eq("state_key", key).maybeSingle();
    if (error) throw new Error(`Scoped state read failed: ${error.message}`);
    return data ? data.value as T : fallback;
  },
  async write<T>(key: string, value: T): Promise<T> {
    if (!Object.hasOwn(paths, key)) throw new Error("Unrecognized state key");
    const userId = requireRequestUserId();
    const { error } = await dbFactory().from("user_scoped_state").upsert({
      user_id: userId,
      state_key: key,
      value,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,state_key" });
    if (error) throw new Error(`Scoped state write failed: ${error.message}`);
    return value;
  },
  };
}

const hostedRepository = makeHostedStorageRepository();
export function getStorageRepository(): StorageRepository {
  return config.storageMode === "supabase" ? hostedRepository : demoRepository;
}
