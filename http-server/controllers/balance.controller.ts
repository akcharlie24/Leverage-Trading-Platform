import { pushToReadQueue } from "../redis/queue";
import { stripVersionPrefix } from "../routes";
import JsonResponse from "../utils/JsonResponse";

export async function getBalanceController(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const pathname = stripVersionPrefix(url.pathname);

    const parts = pathname.split("/").filter(Boolean);
    const userId = parts[1];
    if (!userId) {
      return JsonResponse(
        { message: "Invalid Request, Please provide userId" },
        404,
      );
    }
    // TODO: add a way to validate userId if possible (not needed tho we can return from engine)

    // TODO: push to redis queue, and make engine worker to fetch balance
    // TODO: There can be a seperate queue for read operations

    const data = {
      queryType: "readBalance",
      payload: {
        userId,
      },
    };

    pushToReadQueue(data);

    return JsonResponse(
      { message: "All good in fetch balance controller" },
      200,
    );
  } catch (error) {
    return JsonResponse({ message: "Internal Server Error" }, 500);
  }
}

export async function onRampBalanceController(req: Request): Promise<Response> {
  try {
    return JsonResponse({ message: "All good in balance" }, 200);
  } catch (error) {
    return JsonResponse({ message: "Internal Server Error" }, 500);
  }
}
