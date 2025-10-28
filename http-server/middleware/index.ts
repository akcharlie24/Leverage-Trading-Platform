import { decodeJwt } from "../helper";
import JsonResponse from "../utils/JsonResponse";

export async function authMiddleware(
  req: Request,
  handler: (req: Request) => Promise<Response>,
): Promise<Response> {
  try {
    const authToken = req.cookies.authToken;
    if (!authToken) {
      return JsonResponse({ message: "Unauthorized Access" }, 401);
    }

    const payload = decodeJwt(authToken);

    if (!payload) {
      return JsonResponse({ message: "Invalid Auth Token" }, 401);
    }

    req.userId = payload.userId;

    return await handler(req);
  } catch (error) {
    return JsonResponse({ message: "Internal Server Error" }, 500);
  }
}
