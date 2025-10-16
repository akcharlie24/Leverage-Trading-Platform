import { SignUpSchema } from "@lev-trade/types";
import JsonResponse from "../utils/JsonResponse";
import prisma from "@lev-trade/db";
import { hashPassword } from "../helper";

export async function signUpController(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const parsedData = SignUpSchema.safeParse(body);
    if (!parsedData.success) {
      return JsonResponse({ message: "Bad Request, Invalid Body" }, 400);
    }

    const { email, username, password } = parsedData.data;

    const userExists = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (userExists) {
      return JsonResponse(
        { message: "User alerady exists, try logging in" },
        409,
      );
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    // TODO: directly signup here later on
    return JsonResponse(
      { message: "User Sign Up successful", user: newUser },
      201,
    );
  } catch (error) {
    return JsonResponse(
      { message: "Internal Server Error, SignUp Failed" },
      500,
    );
  }
}

export async function signInController(req: Request): Promise<Response> {
  try {
    return JsonResponse("Hello from signin controller");
  } catch (error) {
    return JsonResponse(
      { message: "Internal Server Error, SignIn Failed" },
      500,
    );
  }
}
