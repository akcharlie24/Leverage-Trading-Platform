import { BACKPACK_WS_URL, WS_DECIMALS, WS_STOCK_SYMBOLS } from "./constants";
import { assetPriceWS } from "./store";

async function startWsSever() {
  const ws = new WebSocket(BACKPACK_WS_URL);
  console.log("Connected to Backpack websocket");

  ws.addEventListener("open", () => {
    const payload = {
      method: "SUBSCRIBE",
      params: WS_STOCK_SYMBOLS.map((symbol) => `bookTicker.${symbol}`),
    };
    ws.send(JSON.stringify(payload));
  });

  // let streamCounter = 0;
  // let triggerCounter = 0;
  // let durationTrigger = 0;
  // let durationStream = 0;
  // let startTimeTrigger = Date.now();
  // let startTimeStream = Date.now();
  // let lastMessageTime = 0;

  ws.addEventListener("message", (msg) => {
    try {
      // Code to see the time bw messages
      // const now = Date.now();
      //
      // if (lastMessageTime !== 0) {
      //   const durationBetweenMessages = now - lastMessageTime;
      //   console.log(
      //     "Duration between messages:",
      //     durationBetweenMessages,
      //     "ms",
      //   );
      // }

      // lastMessageTime = now;
      const msgData = JSON.parse(msg.data);
      if (!msgData.stream || !msgData.data) return;

      const symbol = msgData.stream.split(".")[1];
      if (!symbol) return;

      const decimals = WS_DECIMALS.get(symbol);
      if (decimals === undefined) return;

      const assetPriceSymbol = symbol.split("_")[0];
      const oldPrice = assetPriceWS.get(assetPriceSymbol);

      const bestBidStr = msgData.data.b as string;
      const bestAskStr = msgData.data.a as string;

      const stringToBigInt = (str: string, decimals: number): bigint => {
        const [whole, fraction = ""] = str.split(".");

        const paddedFraction = fraction
          .padEnd(decimals, "0")
          .slice(0, decimals);

        const combined = whole + paddedFraction;

        return BigInt(combined);
      };

      const bestBid = stringToBigInt(bestBidStr, decimals);
      const bestAsk = stringToBigInt(bestAskStr, decimals);

      const medianPrice = (bestBid + bestAsk) / 2n;

      const assetPriceBigInt = medianPrice;

      if (oldPrice !== assetPriceBigInt) {
        assetPriceWS.set(assetPriceSymbol, assetPriceBigInt);
        // durationTrigger = Date.now() - startTimeTrigger;
        // TODO: Push into the redis stream here
        // Since even pushing on interval will not update, and it will only update when the price is recieved
        // Also benchmark the pushing to redis time here

        // console.log(
        //   `Trigger Pusher ${assetPriceSymbol} : ${assetPriceWS.get(assetPriceSymbol)} trigger counter : ${triggerCounter++} in ${durationTrigger} ms and ${durationTrigger / 1000} sec`,
        // );
      }
    } catch (error) {
      console.log("Error parsing string");
    }
  });

  // conclusion : updating values in every 100ms can be a bad approach
  // const pushPriceToStream = () => {
  //   assetPriceWS.forEach((val, key) => {
  //     durationStream = Date.now() - startTimeStream;
  //     console.log(
  //       `Stream Pusher ${key} : ${val} stream counter : ${streamCounter++} in ${durationStream} ms and ${durationStream / 1000} sec`,
  //     );
  //   });
  // };

  // setInterval(pushPriceToStream, 100);
}

startWsSever();
