// Create -> server
// 1. fetch IP
// 2. do rate limiting -> rate limter.consume
// 3. set CORS headers
// 4. parse Cookies
// 5. Do routing
// 6. Make controllers
// 7. Do Validations (Where-ever the things dont slow down)
// 8. Do error handling and status codes
// 9. Make sure when you send json -> you send the right headers

import { appConfig } from "@lev-trade/config";
import JsonResponse from "./utils/JsonResponse";

const server = {
  port: appConfig.PORT,
  async fetch(req: Request) {
    if (new URL(req.url).pathname === "/" || "/health") {
      return JsonResponse({ message: "Healthy" });
    }

    return new Response("Hi there");
  },
};

console.log(`Server started on ${appConfig.PORT}`);
Bun.serve(server);
