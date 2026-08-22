export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";

import { api } from "../../../api";
import { logErrorResponse } from "../../../_utils/utils";

export async function PATCH(request: Request) {

    console.log("🔥🔥🔥 AVATAR ROUTE HIT");
  try {
    const cookieStore = await cookies();
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
      logErrorResponse(error.response?.data);

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

    logErrorResponse({
      message: (error as Error).message,
    });

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}