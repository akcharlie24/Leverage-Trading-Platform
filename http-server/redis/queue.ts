import { READ_ENGINE_QUEUE, WRITE_ENINGE_QUEUE } from "@lev-trade/constants";
import { redisClient } from ".";

export async function pushToReadQueue(data: unknown): Promise<void> {
  await redisClient.lpush(READ_ENGINE_QUEUE, JSON.stringify(data));
}

export async function pushToWriteQueue(data: unknown): Promise<void> {
  await redisClient.lpush(WRITE_ENINGE_QUEUE, JSON.stringify(data));
}
