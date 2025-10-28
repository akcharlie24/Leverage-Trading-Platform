import { appConfig } from "@lev-trade/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Payload } from "../controllers/auth.controller";

const SALT_ROUNDS: number = 10;

export async function hashPassword(password: string): Promise<string> {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    return hashedPassword;
  } catch (e) {
    throw new Error("Error hashing password, please try again");
  }
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  try {
    const result = await bcrypt.compare(password, hash);
    return result;
  } catch (e) {
    throw new Error("Error comparing password, please try again");
  }
}

export function decodeJwt(token: string) {
  try {
    const payload = jwt.verify(token, appConfig.SECRET_KEY) as Payload;
    return payload;
  } catch (_error) {
    return null;
  }
}
