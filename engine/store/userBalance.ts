// TODO: for now store constants in global config and get from there OR in the engine itself for now
// -> Better than cloggin up the map of balances

interface UserBalance {
  USDC: bigint;
  SOL: bigint;
  ETH: bigint;
  BTC: bigint;
}
export const userBalance: Map<string, UserBalance> = new Map();
