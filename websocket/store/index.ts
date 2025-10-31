// TODO: organize better when adding support for more symbols

const assetPriceObject = {
  SOL: BigInt(0),
  ETH: BigInt(0),
  BTC: BigInt(0),
};

type Asset = "SOL" | "ETH" | "BTC";

export const assetPriceWS: Map<Asset, bigint> = new Map(
  Object.entries(assetPriceObject) as [Asset, bigint][],
);
