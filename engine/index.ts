import { READ_ENGINE_QUEUE, WRITE_ENINGE_QUEUE } from "@lev-trade/constants";
import { redisClient } from "./redis";
import { getUserBalance } from "./store/userBalance";

async function readProcessor(reqData: string) {
  const data = JSON.parse(reqData);
  const userId = data.payload.userId;

  // TODO: switch casing here

  // TODO: add graceful logic over here, cant throw useless errors from the engine at all
  if (!userId) return null;

  const userBalance = getUserBalance(userId);

  console.log(userBalance);
}

async function main() {
  try {
    while (true) {
      const requestRecieved = await redisClient.brpop(
        READ_ENGINE_QUEUE,
        WRITE_ENINGE_QUEUE,
        0,
      );
      const recievedTime = Date.now();

      // TODO: can remove this if statement later on (useless check)
      if (!requestRecieved) continue;

      const [reqQueue, reqData] = requestRecieved;

      if (reqQueue === READ_ENGINE_QUEUE) {
        readProcessor(reqData);
        console.log(`Time taken to process : ${Date.now() - recievedTime} ms`);
      }
    }
  } catch (error: any) {
    console.error("Engine Failure", error.message);
    // TODO: add graceful exit and snapshot logic right here
  }
}

main();
