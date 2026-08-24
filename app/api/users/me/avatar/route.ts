import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  try {
    const formData = await request.formData();
    const cookieStore = await cookies();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const res = await fetch(`${apiUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        Cookie: cookieStore.toString(),
      },
      body: formData,
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Avatar update error:", error);

    return NextResponse.json(
      { error: "Failed to update avatar" },
      { status: 500 }
    );
  }
}