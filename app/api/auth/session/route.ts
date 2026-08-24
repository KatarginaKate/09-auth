import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../api";
import { parse } from "cookie";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    // Якщо accessToken є — все ок
    if (accessToken) {
      return NextResponse.json({ success: true });
    }

    // Якщо accessToken немає, але є refreshToken — оновлюємо
    if (refreshToken) {
      // Правильний спосіб передати cookies у SSR
      const cookieHeader = cookieStore
        .getAll()
        .map(({ name, value }) => `${name}=${value}`)
        .join("; ");

      const apiRes = await api.post("auth/refresh", null, {
        headers: {
          Cookie: cookieHeader,
        },
      });

      const setCookie = apiRes.headers["set-cookie"];

      if (setCookie) {
        const response = NextResponse.json({ success: true });

        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);

          const expires = parsed.Expires ? new Date(parsed.Expires) : undefined;

          const options = {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              path: "/",
              expires,
          } as const;

          if (parsed.accessToken) {
            response.cookies.set("accessToken", parsed.accessToken, options);
          }

          if (parsed.refreshToken) {
            response.cookies.set("refreshToken", parsed.refreshToken, options);
          }

          if (parsed.sessionId) {
            response.cookies.set("sessionId", parsed.sessionId, options);
          }
        }

        return response;
      }
    }

    return NextResponse.json({ success: false });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json({ success: false });
    }

    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ success: false });
  }
}
