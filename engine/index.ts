import { READ_ENGINE_QUEUE } from "@lev-trade/constants";
import { redisClient } from "./redis";

async function readProcessor(payload: string) {}

async function main() {
  try {
    while (true) {
      // TODO: redis have support for multiple queue reading at the same time, so it would be better to do it like that
      const requestRecievedReadQueue = await redisClient.brpop(
        READ_ENGINE_QUEUE,
        0,
        (error, payload) => {
          if (!payload) return;
          const jsonObj = JSON.parse(payload[1]);
          console.log(payload[0]);
          console.log(jsonObj);
        },
      );
    }
  } catch (error: any) {
    console.error("Engine Failure", error.message);
    // TODO: add graceful exit and snapshot logic right here
  }
}

main();
