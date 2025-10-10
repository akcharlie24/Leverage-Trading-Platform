import { appConfig } from "@lev-trade/config";
import Redis from "ioredis";

export const redisClient = new Redis(appConfig.REDIS_URL);
