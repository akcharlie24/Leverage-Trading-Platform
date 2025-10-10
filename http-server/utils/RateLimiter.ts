import { RateLimiterMemory, RateLimiterRedis } from "rate-limiter-flexible";
import { redisClient } from "../redis";

export const RATE_LIMIT_DURATION = 60;
export const RATE_LIMIT_POINTS = 70;

const insuranceRateLimiter = new RateLimiterMemory({
  points: RATE_LIMIT_POINTS,
  duration: RATE_LIMIT_DURATION,
});

export const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rlflx",
  points: RATE_LIMIT_POINTS,
  duration: RATE_LIMIT_DURATION,
  blockDuration: 180,
  inMemoryBlockOnConsumed: 70,
  inMemoryBlockDuration: 300,
  insuranceLimiter: insuranceRateLimiter,
});
