import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const formData = await request.formData();

    const response = await fetch(`${API_URL}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        Cookie: cookieStore.toString(),
      },
      body: formData,
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Avatar update error:", error);

    return NextResponse.json(
      { error: "Failed to update avatar" },
      { status: 500 },
    );
  }
}