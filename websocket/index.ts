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

  ws.addEventListener("message", (msg) => {
    try {
      const msgData = JSON.parse(msg.data as string);
      const symbol = msgData.stream.split(".")[1];
      const decimals = WS_DECIMALS.get(symbol);

      const oldPrice = assetPriceWS.get(symbol);
      const medianPrice =
        (parseInt(msgData.data.a) + parseInt(msgData.data.b)) / 2;
      const assetPriceNumber = medianPrice * 10 ** decimals!;
      const assetPriceBigInt = BigInt(assetPriceNumber);
      const assetPriceSymbol = symbol.split("_")[0];

      if (oldPrice !== assetPriceBigInt) {
        assetPriceWS.set(assetPriceSymbol, assetPriceBigInt);
      }

      // TODO: Use mark price smoothing to trigger liquidations
    } catch (error) {
      console.log("Error parsing string");
    }
  });

  const pushPriceToStream = () => {
    assetPriceWS.forEach((val, key) => {
      console.log(`${key} : ${val}`);
    });
  };

  // TODO: Push to Redis stream at 100ms intervals
  setInterval(pushPriceToStream, 100);
}

startWsSever();
