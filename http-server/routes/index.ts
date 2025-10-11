import {
  signInController,
  signUpController,
} from "../controllers/auth.controller";
import JsonResponse from "../utils/JsonResponse";

export async function router(req: Request): Promise<Response> {
  try {
    const routeUrl = new URL(req.url);
    const pathname = routeUrl.pathname.replace("/v1", "");

    if (req.method === "POST") {
      try {
        const validation = req.clone();
        await validation.json();

        switch (pathname) {
          case "/auth/signup":
            return await signUpController(req);

          case "/auth/signin":
            return await signInController(req);
        }
      } catch (error: any) {
        return JsonResponse({ message: "Bad Request" }, 400);
      }
    }
    if (req.method === "GET") {
      return JsonResponse({ message: "Get Request" }, 200);
    }

    return JsonResponse({ message: "Bad Request" }, 400);
  } catch (error) {
    return JsonResponse(
      { message: "Internal Sever Error, Authentication Failed" },
      500,
    );
  }
}
