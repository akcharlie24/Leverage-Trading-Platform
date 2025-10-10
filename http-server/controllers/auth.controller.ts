import JsonResponse from "../utils/JsonResponse";

export async function signUpController(req: Request): Promise<Response> {
  try {
    return JsonResponse({ message: "Hello there from signup" });
  } catch (error) {
    return JsonResponse(
      { message: "Internal Server Error, SignUp Failed" },
      400,
    );
  }
}

export async function signInController(req: Request): Promise<Response> {
  try {
    return JsonResponse({ message: "Hello there from signup" });
  } catch (error) {
    return JsonResponse(
      { message: "Internal Server Error, SignIn Failed" },
      400,
    );
  }
}
