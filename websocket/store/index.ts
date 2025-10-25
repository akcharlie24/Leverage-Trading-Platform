// TODO: organize better when adding support for more symbols

const assetPriceObject = {
  SOL: BigInt(0),
  ETH: BigInt(0),
  USDC: BigInt(0),
};

const assetPrice: Map<string, BigInt> = new Map(
  Object.entries(assetPriceObject),
);
