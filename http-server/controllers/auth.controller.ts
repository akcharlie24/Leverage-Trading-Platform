import { ReqQueryType, SignInSchema, SignUpSchema } from "@lev-trade/types";
import JsonResponse from "../utils/JsonResponse";
import prisma from "@lev-trade/db";
import { comparePassword, hashPassword } from "../helper";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { appConfig } from "@lev-trade/config";
import { pushToWriteQueue } from "../redis/queue";

export interface Payload extends JwtPayload {
  userId: string;
}

export async function signUpController(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const parsedData = SignUpSchema.safeParse(body);
    if (!parsedData.success) {
      return JsonResponse({ message: "Bad Request, Invalid Body" }, 401);
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

    // TODO:  Engine write req to add user in the store and init balance here
    // TODO: queryType and reqPayloadType
    const reqPayload = {
      queryType: ReqQueryType.CreateUser,
      payload: {
        userId: newUser.id,
      },
    };

    await pushToWriteQueue(reqPayload);

    // TODO: directly signin here later on
    return JsonResponse(
      { message: "User Sign Up successful", userId: newUser.id },
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
    const body = await req.json();
    const parsedData = SignInSchema.safeParse(body);

    if (!parsedData.success) {
      return JsonResponse({ message: "Bad Request, Inavlid Body" }, 400);
    }

    const { email, password } = parsedData.data;

    const findUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!findUser) {
      return JsonResponse(
        { message: "User not found, Please try Signing Up" },
        403,
      );
    }

    const comparePasswordResult = await comparePassword(
      password,
      findUser.password,
    );

    if (!comparePasswordResult) {
      return JsonResponse(
        { message: "Authentication Failed, Invalid Password" },
        401,
      );
    }

    const payload: Payload = { userId: findUser.id };

    // TODO: set expiresIn later on
    const authToken = jwt.sign(payload, appConfig.SECRET_KEY);

    const isProd = appConfig.NODE_ENV === "production";
    const cookieOptions = [
      "Path=/",
      "HttpOnly",
      isProd ? "SameSite=Strict" : "SameSite=Lax",
      isProd ? "Secure" : "",
      isProd ? "Domain=.ak24.live" : "",
      "Max-Age=604800",
    ]
      .filter(Boolean)
      .join("; ");

    return JsonResponse({ message: "User Sign In successful" }, 200, {
      "Set-Cookie": `Authentication=${authToken}; ${cookieOptions}`,
    });
  } catch (error) {
    return JsonResponse(
      { message: "Internal Server Error, SignIn Failed" },
      500,
    );
  }
}
