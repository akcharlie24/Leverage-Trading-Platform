// TODO: for now store constants in global config and get from there OR in the engine itself for now
// -> Better than cloggin up the map of balances

import { ASSET_DECIMALS } from "../constants";

// Only usdc balance will be needed for now
export const userBalance: Map<string, bigint> = new Map();

const USDC_DECIMALS = ASSET_DECIMALS.get("USDC")?.toString();
const multiplyFactor = 10n ** BigInt(USDC_DECIMALS!);
const initBalance = 100000n * multiplyFactor;

export function initializeUserBalance(userId: string) {
  userBalance.set(userId, BigInt(initBalance));
}

export function getUserBalance(userId: string): bigint | null {
  const userBal = userBalance.get(userId);
  // Save engine from throwing any un-neccessary errors
  // TODO: can decide later to see if you wanna throw any errors

  if (!userBal) return null;

  return userBal;
}

export function updateUserBalance(userId: string, balance: bigint) {
  userBalance.set(userId, balance);
}
