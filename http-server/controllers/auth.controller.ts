import JsonResponse from "../utils/JsonResponse";

export async function signUpController(_req: Request, _body?: unknown): Promise<Response> {
  try {
    return JsonResponse({ message: "Hello there from signup" });
  } catch (error) {
    return JsonResponse(
      { message: "Internal Server Error, SignUp Failed" },
      500,
    );
  }
}

export async function signInController(_req: Request, _body?: unknown): Promise<Response> {
  try {
    return JsonResponse({ message: "Hello there from signin" });
  } catch (error) {
    return JsonResponse(
      { message: "Internal Server Error, SignIn Failed" },
      500,
    );
  }
}
