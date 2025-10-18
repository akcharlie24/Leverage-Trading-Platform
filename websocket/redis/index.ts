import { appConfig } from "@lev-trade/config";
import Redis from "ioredis";

export const redisClient = new Redis(appConfig.REDIS_URL, {
  maxRetriesPerRequest: 3,
});

redisClient.on("error", (err) => {
  console.error("Redis error:", (err as any)?.message || err);
});
