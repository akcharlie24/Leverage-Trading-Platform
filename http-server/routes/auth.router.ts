import {
  signInController,
  signUpController,
} from "../controllers/auth.controller";
import JsonResponse from "../utils/JsonResponse";

export async function authRouter(
  req: Request,
  subpath: String,
): Promise<Response> {
  try {
    const key = `${req.method} ${subpath}`;
    switch (key) {
      case "POST /signup":
        return signUpController(req);
      case "POST /signin":
        return signInController(req);
      default:
        return JsonResponse({ message: "Bad Request, Not Found" }, 404);
    }
  } catch (error) {
    return JsonResponse({ message: "Internal Sever Error" }, 500);
  }
}
