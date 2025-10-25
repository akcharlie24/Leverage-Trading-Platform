import { BACKPACK_WS_URL, WS_DECIMALS, WS_STOCK_SYMBOLS } from "./constants";

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
      const data = JSON.parse(msg.data as string);
      const symbol = data.stream.split(".")[1];
      const decimals = WS_DECIMALS.get(symbol);

      // 1. Update the socket store here
      // 2. Update the store only when prices change
      // 3. Push to Redis stream
      // 4. Use mark price smoothing to trigger liquidations
    } catch (error) {
      console.log("Error parsing string");
    }
  });
}

startWsSever();
