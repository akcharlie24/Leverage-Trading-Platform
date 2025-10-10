// Create -> server
// 4. parse Cookies
// 5. Do routing
// 6. Make controllers
// 7. Do Validations (Where-ever the things dont slow down)
// 8. Do error handling and status codes
// 9. Make sure when you send json -> you send the right headers

import { appConfig } from "@lev-trade/config";
import JsonResponse from "./utils/JsonResponse";
import { RATE_LIMIT_POINTS, rateLimiter } from "./utils/RateLimiter";
import { corsHeaders } from "./constants";
import { router } from "./routes";

const server = {
  port: appConfig.PORT,
  async fetch(req: Request) {
    try {
      // TODO: Below is just code side rate-limit to protect the application layer, you have to also apply devops level rate limiting
      // -> We can remove this later if you wish to - but it is good for App Layer protection

      const getClientIp = () => {
        const xff = req.headers.get("x-forwarded-for");
        if (xff) {
          const firstHop = xff.split(",")[0]?.trim();
          if (firstHop) return firstHop;
        }
        const cfIp = req.headers.get("cf-connecting-ip");
        if (cfIp) return cfIp;
        const xRealIp = req.headers.get("x-real-ip");
        if (xRealIp) return xRealIp;
        else return "unknown";
      };

      const ip = getClientIp();

      const rlRes = await rateLimiter.consume(ip);

      const rateLimiterHeaders = {
        "X-RateLimit-Limit": RATE_LIMIT_POINTS.toString(),
        "X-RateLimit-Remaining": rlRes.remainingPoints.toString(),
        "X-RateLimit-Reset": (Date.now() + rlRes.msBeforeNext).toString(),
      };

      const headers = {
        ...corsHeaders,
        ...rateLimiterHeaders,
      };

      if (req.method === "OPTIONS") {
        return new Response(null, {
          headers,
        });
      }

      const cookies = Object.fromEntries(
        (req.headers.get("cookie") || "")
          .split(";")
          .map((c) => c.trim().split("=").map(decodeURIComponent)),
      );

      (req as any).cookies = cookies;

      if (
        req.method === "GET" &&
        (new URL(req.url).pathname === "/" || "/health")
      ) {
        return JsonResponse({ message: "Healthy" });
      }

      if (new URL(req.url).pathname.startsWith("/v1")) {
        return await router(req);
      }

      return new Response("Universal catcher");
    } catch (rejRes: any) {
      if (rejRes instanceof Error) {
        return JsonResponse({ message: "Internal Server Error" }, 500);
      } else {
        const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;

        return new Response(
          JSON.stringify({
            message: "Too Many Attempts, Please Try Again after a while",
          }),
          {
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
              "Retry-After": secs.toString(),
            },
          },
        );
      }
    }
  },
};

console.log(`Server started on ${appConfig.PORT}`);
Bun.serve(server);
