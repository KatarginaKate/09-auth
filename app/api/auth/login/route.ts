import { NextRequest, NextResponse } from "next/server";
import { api } from "../../api";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiRes = await api.post("/auth/login", body);

    const cookieStore = await cookies();
    const setCookies = apiRes.headers["set-cookie"];

    if (setCookies) {
      for (const raw of setCookies) {
        const [cookiePair] = raw.split(";"); // "accessToken=..."
        const [name, value] = cookiePair.split("=");

        cookieStore.set({
          name,
          value,
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/",
        });
      }
    }

    return NextResponse.json(apiRes.data, { status: apiRes.status });
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status ?? 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
