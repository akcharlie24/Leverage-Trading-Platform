import { READ_ENGINE_QUEUE, WRITE_ENINGE_QUEUE } from "@lev-trade/constants";
import { redisClient } from "./redis";

async function readProcessor(payload: string) {
  const data = JSON.parse(payload);
  console.log(data);
}

async function main() {
  try {
    while (true) {
      const requestRecieved = await redisClient.brpop(
        READ_ENGINE_QUEUE,
        WRITE_ENINGE_QUEUE,
        0,
      );

      // TODO: can remove this if statement (useless check)
      if (!requestRecieved) continue;

      const [reqQueue, reqData] = requestRecieved;

      if (reqQueue === READ_ENGINE_QUEUE) {
        readProcessor(reqData);
      }
    }
  } catch (error: any) {
    console.error("Engine Failure", error.message);
    // TODO: add graceful exit and snapshot logic right here
  }
}

main();
