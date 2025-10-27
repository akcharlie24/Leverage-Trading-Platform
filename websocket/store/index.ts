// TODO: organize better when adding support for more symbols

const assetPriceObject = {
  SOL: BigInt(0),
  ETH: BigInt(0),
  BTC: BigInt(0),
};

export const assetPriceWS: Map<string, bigint> = new Map(
  Object.entries(assetPriceObject),
);
