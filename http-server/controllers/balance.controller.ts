import { pushToReadQueue, pushToWriteQueue } from "../redis/queue";
import { stripVersionPrefix } from "../routes";
import JsonResponse from "../utils/JsonResponse";

export async function getBalanceController(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const pathname = stripVersionPrefix(url.pathname);

    const userId = req.userId;

    // TODO: make queryType as enum
    // TODO: make a reqPayload type
    const reqPayload = {
      queryType: "readBalance",
      payload: {
        userId,
      },
    };

    await pushToReadQueue(reqPayload);

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
