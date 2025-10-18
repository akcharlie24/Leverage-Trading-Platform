import { BACKPACK_WS_URL, STOCK_SYMBOLS } from "./constants";

async function startWsSever() {
  const ws = new WebSocket(BACKPACK_WS_URL);
  console.log("Connected to Backpack websocket");

  ws.addEventListener("open", () => {
    const payload = {
      method: "SUBSCRIBE",
      params: STOCK_SYMBOLS.map((symbol) => `bookTicker.${symbol}`),
    };
    ws.send(JSON.stringify(payload));
  });

  ws.addEventListener("message", (msg) => {
    try {
      const data = JSON.parse(msg.data as string);
      console.log(data);
    } catch (error) {
      console.log("Error parsing string");
    }
  });
}

startWsSever();
