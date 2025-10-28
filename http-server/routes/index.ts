import JsonResponse from "../utils/JsonResponse";
import { authRouter } from "./auth.router";

function stripVersionPrefix(pathname: string): string {
  return pathname.startsWith("/v1") ? pathname.slice(3) || "/" : pathname;
}

export async function router(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const pathname = stripVersionPrefix(url.pathname);

    const parts = pathname.split("/").filter(Boolean);
    const route = parts[0] || "";
    const subpath = "/" + parts.slice(1).join("/");

    const key = `/${route}`;

    switch (key) {
      case "/auth":
        return authRouter(req, subpath);

      case "/balance":
        return JsonResponse({});

      default:
        return JsonResponse({ message: "Bad Requeset, Not Found" }, 404);
    }
  } catch (error) {
    return JsonResponse({ message: "Internal Sever Error" }, 500);
  }
}
