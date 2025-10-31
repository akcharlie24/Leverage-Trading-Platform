// THIS SHOULD MATCH THE WS_DECIMALS
// TODO: Later on create a shared decimal config
export const ASSET_DECIMALS: Map<string, number> = new Map(
  Object.entries({
    BTC_USDC: 6,
    ETH_USDC: 6,
    SOL_USDC: 6,
  }),
);
