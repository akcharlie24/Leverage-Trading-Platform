import { SignUpSchema } from "@lev-trade/types";
import JsonResponse from "../utils/JsonResponse";

export async function signUpController(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const parsedData = SignUpSchema.safeParse(body);
    if (!parsedData.success) {
      return JsonResponse({ message: "Bad Request, Invalid Body" }, 400);
    }
    const { email, username, password } = parsedData.data;

    return JsonResponse({ message: "Hello there from signup" });
  } catch (error) {
    return JsonResponse(
      { message: "Internal Server Error, SignUp Failed" },
      500,
    );
  }
}

export async function signInController(req: Request): Promise<Response> {
  try {
    return JsonResponse({ message: "Hello there from signin" });
  } catch (error) {
    return JsonResponse(
      { message: "Internal Server Error, SignIn Failed" },
      500,
    );
  }
}
