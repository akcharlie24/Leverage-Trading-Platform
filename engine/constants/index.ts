// THIS SHOULD MATCH THE WS_DECIMALS
// TODO: Later on create a shared decimal config

// USDC is here for the userBal decimal calc
type AssetType = "SOL" | "ETH" | "BTC" | "USDC";

export const ASSET_DECIMALS: Map<AssetType, number> = new Map(
  Object.entries({
    BTC: 6,
    ETH: 6,
    SOL: 6,
    USDC: 6,
  }) as [AssetType, number][],
);
