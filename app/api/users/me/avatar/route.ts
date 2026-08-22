import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "@/lib/api/api";
import { isAxiosError } from "axios";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();

    console.log("🔥 AVATAR COOKIES:", cookieStore.toString());

    const formData = await request.formData();

    const res = await api.patch("/users/me/avatar", formData, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return NextResponse.json(res.data, {
      status: res.status,
    });
  } catch (error) {
    if (isAxiosError(error)) {
      console.log("🔥 AVATAR BACKEND ERROR:", error.response?.data);

      return NextResponse.json(
        {
          error: error.message,
          response: error.response?.data,
        },
        {
          status: error.response?.status ?? 500,
        }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}