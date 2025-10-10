import { appConfig } from "@lev-trade/config";

export const corsHeaders = {
  "Access-Control-Allow-Origin": appConfig.FRONTEND_URL,
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};
