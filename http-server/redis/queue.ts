import { READ_ENGINE_QUEUE, WRITE_ENINGE_QUEUE } from "@lev-trade/constants";
import { redisClient } from ".";

export async function pushToReadQueue(data: unknown) {
  const push = redisClient.lpush(READ_ENGINE_QUEUE, JSON.stringify(data));
}

export async function pushToWriteQueue(data: unknown) {
  const push = redisClient.lpush(WRITE_ENINGE_QUEUE, JSON.stringify(data));
}
