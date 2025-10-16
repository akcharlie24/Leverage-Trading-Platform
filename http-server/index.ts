import { appConfig } from "@lev-trade/config";
import JsonResponse from "./utils/JsonResponse";
import { RATE_LIMIT_POINTS, rateLimiter } from "./utils/RateLimiter";
import { corsHeaders, defaultHeaders } from "./constants";
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
        return "unknown";
      };

      const ip = getClientIp();

      const rlRes = await rateLimiter.consume(ip);

      const rateLimiterHeaders = {
        "X-RateLimit-Limit": RATE_LIMIT_POINTS.toString(),
        "X-RateLimit-Remaining": rlRes.remainingPoints.toString(),
        "X-RateLimit-Reset": Math.ceil(rlRes.msBeforeNext / 1000).toString(),
      };

      const headers = {
        ...defaultHeaders,
        ...rateLimiterHeaders,
      };

      if (req.method === "OPTIONS") {
        return new Response(null, {
          headers,
        });
      }

      const cookieHeader = req.headers.get("cookie");
      const cookies: Record<string, string> = {};
      if (cookieHeader) {
        for (const part of cookieHeader.split(";")) {
          const trimmed = part.trim();
          if (!trimmed) continue;
          const eqIdx = trimmed.indexOf("=");
          if (eqIdx <= 0) continue;
          const rawKey = trimmed.slice(0, eqIdx);
          const rawVal = trimmed.slice(eqIdx + 1);
          try {
            const k = decodeURIComponent(rawKey);
            const v = decodeURIComponent(rawVal);
            cookies[k] = v;
          } catch {}
        }
      }
      req.cookies = cookies;

      const pathname = new URL(req.url).pathname;
      if (
        req.method === "GET" &&
        (pathname === "/" || pathname === "/health")
      ) {
        return new Response(JSON.stringify({ message: "Healthy" }), {
          headers,
          status: 200,
        });
      }

      if (pathname.startsWith("/v1")) {
        return await router(req);
      }

      return JsonResponse({ message: "Bad Request, Invalid Route" }, 404);
    } catch (rejRes: any) {
      if (rejRes instanceof Error) {
        return JsonResponse({ message: "Internal Server Error" }, 500);
      } else {
        const secs = Math.max(1, Math.round(rejRes.msBeforeNext / 1000));
        return JsonResponse(
          { message: "Too Many Attempts, Please Try Again after a while" },
          429,
          { ...corsHeaders, "Retry-After": secs.toString() },
        );
      }
    }
  },
};

Bun.serve(server);
console.log(`Server started on ${appConfig.PORT}`);
