import { BACKPACK_WS_URL, WS_DECIMALS, WS_STOCK_SYMBOLS } from "./constants";
import { assetPriceWS } from "./store";

class BackpackPricePoller {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 1000; // Start with 1s
  private pushInterval: NodeJS.Timeout | null = null;
  private isConnecting = false;

  async start() {
    this.connect();
    this.startPricePushing();
  }

  private connect() {
    if (this.isConnecting) return;
    this.isConnecting = true;

    try {
      this.ws = new WebSocket(BACKPACK_WS_URL);
      
      this.ws.addEventListener("open", () => {
        console.log("Connected to Backpack websocket");
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
        this.isConnecting = false;
        this.subscribe();
      });

      this.ws.addEventListener("message", (msg) => {
        this.handleMessage(msg);
      });

      this.ws.addEventListener("error", (error) => {
        console.error("WebSocket error:", error);
      });

      this.ws.addEventListener("close", () => {
        console.log("WebSocket closed");
        this.isConnecting = false;
        this.reconnect();
      });
    } catch (error) {
      console.error("Failed to create WebSocket:", error);
      this.isConnecting = false;
      this.reconnect();
    }
  }

  private subscribe() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const payload = {
      method: "SUBSCRIBE",
      params: WS_STOCK_SYMBOLS.map((symbol) => `bookTicker.${symbol}`),
    };
    this.ws.send(JSON.stringify(payload));
  }

  private handleMessage(msg: MessageEvent) {
    try {
      const msgData = JSON.parse(msg.data);
      
      // Validate message structure
      if (!msgData.stream || !msgData.data) return;
      
      const symbol = msgData.stream.split(".")[1];
      if (!symbol) return;

      const decimals = WS_DECIMALS.get(symbol);
      if (decimals === undefined) {
        console.warn(`Unknown symbol: ${symbol}`);
        return;
      }

      const oldPrice = assetPriceWS.get(symbol);
      
      // Calculate median price from best bid and ask
      const bestBid = BigInt(msgData.data.b);
      const bestAsk = BigInt(msgData.data.a);
      const medianPrice = (bestBid + bestAsk) / 2n;
      
      // Scale by decimals - keep everything in BigInt
      const scaleFactor = BigInt(10 ** decimals);
      const assetPriceBigInt = medianPrice * scaleFactor;
      
      const assetPriceSymbol = symbol.split("_")[0];

      // Only update if price changed
      if (oldPrice !== assetPriceBigInt) {
        assetPriceWS.set(assetPriceSymbol, assetPriceBigInt);
        
        // Optional: Track price updates for monitoring
        this.onPriceUpdate(assetPriceSymbol, assetPriceBigInt, oldPrice);
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  }

  private onPriceUpdate(symbol: string, newPrice: bigint, oldPrice?: bigint) {
    // Hook for additional logic (e.g., trigger liquidation checks)
    // You could emit events here for other parts of your system
  }

  private reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached. Manual intervention required.");
      // Alert your monitoring system here
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), 30000);
    
    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  private startPricePushing() {
    this.pushInterval = setInterval(() => {
      this.pushPriceToStream();
    }, 100);
  }

  private pushPriceToStream() {
    assetPriceWS.forEach((val, key) => {
      console.log(`${key}: ${val}`);
      // TODO: Push to Redis stream here
      // await redisClient.xadd(`price:${key}`, '*', 'price', val.toString());
    });
  }

  async stop() {
    if (this.pushInterval) {
      clearInterval(this.pushInterval);
    }
    if (this.ws) {
      this.ws.close();
    }
  }
}

// Start the poller
const poller = new BackpackPricePoller();
poller.start();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await poller.stop();
  process.exit(0);
});

```

## Mark Price Smoothing Explained

**Mark price** is a fair value price used for liquidations and PnL calculations, separate from the last traded price. It prevents manipulation and unfair liquidations.

### Why Mark Price?

In leverage trading, using the last traded price for liquidations is dangerous because:
- **Flash crashes**: A single large sell order could trigger mass liquidations
- **Low liquidity**: Thin order books create volatile prices
- **Market manipulation**: Whales could deliberately trigger liquidations

### How Mark Price Smoothing Works:

1. **Index Price**: Aggregate prices from multiple exchanges (spot markets)
```
   Index = (Binance_BTC + Coinbase_BTC + Kraken_BTC) / 3
```

2. **Fair Price**: Blend index with your order book
```
   Fair Price = Index Price + Moving Average(Funding Basis)
