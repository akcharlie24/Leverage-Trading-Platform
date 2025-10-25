export const BACKPACK_WS_URL = "wss://ws.backpack.exchange/";

export const WS_STOCK_SYMBOLS = ["BTC_USDC", "ETH_USDC", "SOL_USDC"];

// TODO: these decimals are wrt convinience -> Can change later on
export const WS_DECIMALS: Map<string, number> = new Map(
  Object.entries({
    BTC_USDC: 6,
    ETH_USDC: 6,
    SOL_USDC: 6,
  }),
);
