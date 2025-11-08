import { READ_ENGINE_QUEUE, WRITE_ENINGE_QUEUE } from "@lev-trade/constants";
import { redisClient } from ".";

// CAN DO THIS DIRECTLY IN THE ENGINE MAIN AS WELL
// export async function popFromReadQueue(data: unknown) {
//   const push = redisClient.brpop(READ_ENGINE_QUEUE, JSON.stringify(data));
// }
//
// export async function popFromWriteQueue(data: unknown) {
//   const push = redisClient.brpop(WRITE_ENINGE_QUEUE, JSON.stringify(data));
// }
