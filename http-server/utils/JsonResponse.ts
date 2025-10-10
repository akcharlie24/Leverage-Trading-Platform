import { defaultHeaders } from "../constants";

export default function JsonResponse(
  payload: unknown,
  status: number = 200,
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(
    JSON.stringify(payload, (_key, value) =>
      typeof value === "bigint" ? Number(value) : value,
    ),
    {
      status,
      headers: { "Content-Type": "application/json", ...defaultHeaders, ...extraHeaders },
    },
  );
}
