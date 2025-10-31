const assetPriceObject = {
  SOL: BigInt(0),
  ETH: BigInt(0),
  BTC: BigInt(0),
};

type Asset = "SOL" | "ETH" | "BTC";

export const assetPrice: Map<Asset, bigint> = new Map(
  Object.entries(assetPriceObject) as [Asset, bigint][],
);
