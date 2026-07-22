import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parse } from "cookie";
import { checkSession } from "./lib/api/serverApi";

const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];
const PRIVATE_ROUTES = ["/profile", "/notes", "/notes/filter"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPublic = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
  const isPrivate = PRIVATE_ROUTES.some((r) => pathname.startsWith(r));

  // PUBLIC ROUTES — завжди доступні
  if (isPublic) {
    return NextResponse.next();
  }

  // PRIVATE ROUTES — немає accessToken
  if (isPrivate && !accessToken) {
    if (refreshToken) {
      try {
        const session = await checkSession();
        const setCookie = session.headers?.["set-cookie"];

        if (setCookie) {
          const response = NextResponse.next();
          const cookieArray = Array.isArray(setCookie)
            ? setCookie
            : [setCookie];

          for (const cookieStr of cookieArray) {
            const parsed = parse(cookieStr);

            const options = {
              path: parsed.Path ?? "/",
              maxAge: parsed["Max-Age"]
                ? Number(parsed["Max-Age"])
                : undefined,
            };

            if (parsed.accessToken) {
              response.cookies.set("accessToken", parsed.accessToken, options);
            }

            if (parsed.refreshToken) {
              response.cookies.set("refreshToken", parsed.refreshToken, options);
            }
          }

          return response;
        }

        return NextResponse.next();
      } catch {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
    }

    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // PRIVATE ROUTES — є accessToken
  if (isPrivate && accessToken) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/notes/:path*",
    "/notes/filter/:path*",
    "/profile/:path*",
    "/sign-in",
    "/sign-up",
  ],
};

