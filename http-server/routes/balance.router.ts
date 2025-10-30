import {
  getBalanceController,
  onRampBalanceController,
} from "../controllers/balance.controller";
import { authMiddleware } from "../middleware";
import JsonResponse from "../utils/JsonResponse";

export async function balanceRouter(
  req: Request,
  subpath: String,
): Promise<Response> {
  try {
    const key = `${req.method} ${subpath}`;

    switch (key) {
      case `GET ${subpath}`:
        return authMiddleware(req, getBalanceController);
      case "POST /onramp":
        return authMiddleware(req, onRampBalanceController);
      default:
        return JsonResponse({ message: "Bad Request, Not Found" }, 404);
    }
  } catch (error) {
    return JsonResponse({ message: "Internal Sever Error" }, 500);
  }
}
