import JsonResponse from "../utils/JsonResponse";

export async function balanceRouter(
  req: Request,
  subpath: String,
): Promise<Response> {
  try {
    const key = `${req.method} ${subpath}`;

    switch (key) {
      case "GET /:userId":
        return JsonResponse("Get user balance");
      case "POST /onramp":
        return JsonResponse("Onramp user balance");
      default:
        return JsonResponse({ message: "Bad Request, Not Found" }, 404);
    }
  } catch (error) {
    return JsonResponse({ message: "Internal Sever Error" }, 500);
  }
}
