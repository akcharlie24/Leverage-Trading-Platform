import { appConfig } from "@lev-trade/config";

export const corsHeaders = {
  "Access-Control-Allow-Origin": appConfig.FRONTEND_URL,
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
  // Ensure caches vary by origin so CORS doesn't get cached incorrectly
  Vary: "Origin",
};

export const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
};

export const defaultHeaders = {
  ...corsHeaders,
  ...securityHeaders,
};
